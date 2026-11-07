/**
 * Único lugar de la app que habla con la API: las pantallas llaman a estas
 * funciones y nunca usan fetch directamente.
 * Agrega el token a cada petición y traduce los errores (401, sin red, servidor
 * caído o lento) a errores con mensajes claros.
 */
import { hayConexion } from './conexion';
import { borrarToken, guardarToken, leerToken } from './sesion';
import { tokenVencido } from './token';

// Se puede cambiar al arrancar Vite o al compilar (p. ej. la IP del computador para el celular):
// VITE_API_URL=http://192.168.1.10:3000 npm run dev
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

/** Si la API no responde en este tiempo, se cancela la petición. */
export const TIEMPO_MAXIMO_MS = 10_000;

export interface Pelicula {
  id: number;
  titulo: string;
  anio: number;
  genero: string;
}

export type NuevaPelicula = Omit<Pelicula, 'id'>;

// ---------- Errores que las pantallas pueden distinguir ----------

/** No hay token, el token venció o la API respondió 401: hay que volver al login. */
export class SesionRequeridaError extends Error {
  readonly vencida: boolean;

  constructor(vencida: boolean) {
    super(vencida ? 'Tu sesión expiró. Inicia sesión de nuevo.' : 'Inicia sesión para continuar.');
    this.name = 'SesionRequeridaError';
    this.vencida = vencida;
  }
}

/** El dispositivo no tiene conexión a internet. */
export class SinConexionError extends Error {
  constructor() {
    super('Sin conexión a internet. Revisa tu red e inténtalo de nuevo.');
    this.name = 'SinConexionError';
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
  return borrarToken();
}

// ---------- Películas (protegidas: piden el token) ----------

export function listarPeliculas(): Promise<Pelicula[]> {
  return pedir<Pelicula[]>('/peliculas');
}

export function obtenerPelicula(id: string): Promise<Pelicula> {
  return pedir<Pelicula>(`/peliculas/${encodeURIComponent(id)}`);
}

export function crearPelicula(pelicula: NuevaPelicula): Promise<Pelicula> {
  return pedir<Pelicula>('/peliculas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pelicula),
  });
}

async function pedir<T>(ruta: string, opciones: RequestInit = {}, conToken = true): Promise<T> {
  const headers = new Headers(opciones.headers);

  if (conToken) {
    const token = await leerToken();
    if (!token) throw new SesionRequeridaError(false);
    if (tokenVencido(token)) {
      // Su campo exp ya pasó: la API lo rechazaría con 401, así que ni se envía
      await borrarToken();
      throw new SesionRequeridaError(true);
    }
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Sin red no se intenta la petición: el aviso aparece de inmediato
  if (!(await hayConexion())) throw new SinConexionError();

  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TIEMPO_MAXIMO_MS);
  let respuesta: Response;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      ...opciones,
      headers,
      signal: controlador.signal,
    });
  } catch {
    // fetch solo falla así cuando no hubo respuesta: se perdió la red, la API está apagada o tardó demasiado
    if (!(await hayConexion())) throw new SinConexionError();
    if (controlador.signal.aborted) {
      throw new Error('El servidor tardó demasiado en responder. Inténtalo de nuevo.');
    }
    throw new Error('No se pudo conectar con el servidor. Inténtalo más tarde.');
  } finally {
    clearTimeout(temporizador);
  }

  // fetch NO lanza error con 400, 401 o 500: hay que revisar el código a mano
  const cuerpo = await respuesta.json().catch(() => null);
  if (respuesta.status === 401 && conToken) {
    await borrarToken(); // el token ya no sirve: se borra para no volver a enviarlo
    throw new SesionRequeridaError(true);
  }
  if (!respuesta.ok) {
    throw new Error(cuerpo?.error ?? `Error ${respuesta.status}`);
  }
  return cuerpo as T;
}
