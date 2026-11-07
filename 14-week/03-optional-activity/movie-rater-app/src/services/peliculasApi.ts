/**
 * Único lugar de la app que habla con la API: las pantallas llaman a estas
 * funciones y nunca usan fetch directamente.
 * Desde la semana 13 agrega el token a cada petición y traduce los errores
 * (401, sin red, servidor caído) a mensajes claros.
 * Desde la semana 14 guarda la lista en caché para no pedirla cada vez que se vuelve a ella.
 */
import { crearCache } from './cache';
import { borrarToken, guardarToken, leerToken } from './sesion';

// Se puede cambiar al compilar (p. ej. la IP del computador para probar en el celular):
// VITE_API_URL=http://192.168.1.10:3000 npm run build
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface Pelicula {
  id: number;
  titulo: string;
  anio: number;
  genero: string;
}

export type NuevaPelicula = Omit<Pelicula, 'id'>;

// ---------- Errores que las pantallas pueden distinguir ----------

/** No hay token o la API respondió 401: hay que volver al login. */
export class SesionRequeridaError extends Error {
  readonly vencida: boolean;

  constructor(vencida: boolean) {
    super(vencida ? 'Tu sesión expiró. Inicia sesión de nuevo.' : 'Inicia sesión para continuar.');
    this.vencida = vencida;
  }
}

/** El dispositivo no tiene conexión a internet. */
export class SinConexionError extends Error {
  constructor() {
    super('Sin conexión a internet. Revisa tu red e inténtalo de nuevo.');
  }
}

// ---------- Sesión ----------

export async function iniciarSesion(usuario: string, contrasena: string): Promise<void> {
  // conToken: false → un 401 aquí significa contraseña incorrecta, no sesión vencida
  const { token } = await pedir<{ token: string }>(
    '/auth/login',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, contrasena }),
    },
    false,
  );
  await guardarToken(token);
}

export function cerrarSesion(): Promise<void> {
  cacheLista.invalidar(); // el siguiente usuario no debe ver datos de la sesión anterior
  return borrarToken();
}

// ---------- Películas (protegidas: piden el token) ----------

// La lista se reutiliza durante 60 s; crear una película o cerrar sesión la invalida
const VIGENCIA_LISTA_MS = 60_000;
const cacheLista = crearCache(() => pedir<Pelicula[]>('/peliculas'), VIGENCIA_LISTA_MS);

export function listarPeliculas(): Promise<Pelicula[]> {
  return cacheLista.obtener();
}

export function obtenerPelicula(id: string): Promise<Pelicula> {
  return pedir<Pelicula>(`/peliculas/${id}`);
}

export async function crearPelicula(pelicula: NuevaPelicula): Promise<Pelicula> {
  const creada = await pedir<Pelicula>('/peliculas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pelicula),
  });
  cacheLista.invalidar(); // al volver, la lista se pide de nuevo y aparece la película nueva
  return creada;
}

async function pedir<T>(ruta: string, opciones: RequestInit = {}, conToken = true): Promise<T> {
  const headers = new Headers(opciones.headers);
  if (conToken) {
    const token = await leerToken();
    if (!token) throw new SesionRequeridaError(false);
    headers.set('Authorization', `Bearer ${token}`);
  }

  let respuesta: Response;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, { ...opciones, headers });
  } catch {
    // fetch solo falla así cuando no hubo respuesta: sin red o servidor apagado
    if (!navigator.onLine) throw new SinConexionError();
    throw new Error('No se pudo conectar con el servidor. Inténtalo más tarde.');
  }

  // fetch NO lanza error con 400, 401 o 500: hay que revisar response.ok a mano
  const cuerpo = await respuesta.json().catch(() => null);
  if (respuesta.status === 401 && conToken) {
    await borrarToken(); // el token ya no sirve: se borra para no volver a enviarlo
    cacheLista.invalidar();
    throw new SesionRequeridaError(true);
  }
  if (!respuesta.ok) {
    throw new Error(cuerpo?.error ?? `Error ${respuesta.status}`);
  }
  return cuerpo as T;
}
