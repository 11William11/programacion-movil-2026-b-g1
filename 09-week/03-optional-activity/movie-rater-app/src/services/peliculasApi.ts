/**
 * Único lugar de la app que habla con la API: las pantallas llaman a estas
 * funciones y nunca usan fetch directamente.
 */

export const API_URL = 'http://localhost:3000';

export interface Pelicula {
  id: number;
  titulo: string;
  anio: number;
  genero: string;
}

export type NuevaPelicula = Omit<Pelicula, 'id'>;

export function listarPeliculas(): Promise<Pelicula[]> {
  return pedir<Pelicula[]>(`${API_URL}/peliculas`);
}

export function obtenerPelicula(id: string): Promise<Pelicula> {
  return pedir<Pelicula>(`${API_URL}/peliculas/${id}`);
}

export function crearPelicula(pelicula: NuevaPelicula): Promise<Pelicula> {
  return pedir<Pelicula>(`${API_URL}/peliculas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pelicula),
  });
}

async function pedir<T>(url: string, opciones?: RequestInit): Promise<T> {
  let respuesta: Response;
  try {
    respuesta = await fetch(url, opciones);
  } catch {
    // fetch solo falla así cuando no hubo respuesta: servidor apagado o sin red
    throw new Error('No se pudo conectar con el servidor');
  }

  // fetch NO lanza error con 400, 404 o 500: hay que revisar response.ok a mano
  const cuerpo = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    throw new Error(cuerpo?.error ?? `Error ${respuesta.status}`);
  }
  return cuerpo as T;
}
