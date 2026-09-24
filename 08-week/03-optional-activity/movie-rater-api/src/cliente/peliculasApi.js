/**
 * Funciones para consumir la API de películas desde la app (Ionic React o cualquier
 * cliente con fetch). Lanzan ApiError con un mensaje listo para mostrar al usuario.
 */

export const API_URL = 'http://localhost:3000';
const TIEMPO_MAXIMO_MS = 8000;

export class ApiError extends Error {
  /**
   * @param {string} message mensaje para mostrar
   * @param {number | null} status código HTTP, o null si ni siquiera hubo respuesta
   * @param {string[]} detalles errores de validación que devolvió la API
   */
  constructor(message, status = null, detalles = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detalles = detalles;
  }
}

/** Lista todas las películas. */
export async function listarPeliculas(baseUrl = API_URL) {
  return pedir(`${baseUrl}/peliculas`);
}

/**
 * Crea una película.
 * @param {{ titulo: string, anio: number, genero?: string }} pelicula
 */
export async function crearPelicula(pelicula, baseUrl = API_URL) {
  return pedir(`${baseUrl}/peliculas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pelicula),
  });
}

async function pedir(url, opciones = {}) {
  let respuesta;
  try {
    respuesta = await fetch(url, { ...opciones, signal: AbortSignal.timeout(TIEMPO_MAXIMO_MS) });
  } catch (error) {
    // fetch solo falla así cuando no hubo respuesta: servidor apagado, sin internet o timeout
    const mensaje = error.name === 'TimeoutError'
      ? 'El servidor tardó demasiado en responder'
      : 'No se pudo conectar con el servidor';
    throw new ApiError(mensaje);
  }

  // fetch NO lanza error con 400 o 500: hay que revisar response.ok a mano
  const cuerpo = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    throw new ApiError(
      cuerpo?.error ?? `Error ${respuesta.status}`,
      respuesta.status,
      cuerpo?.detalles ?? [],
    );
  }
  return cuerpo;
}
