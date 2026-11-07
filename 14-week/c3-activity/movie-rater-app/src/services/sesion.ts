import { Preferences } from '@capacitor/preferences';

/**
 * Dónde vive el token (semana 13).
 * @capacitor/preferences guarda pares clave-valor en el almacenamiento privado de la app:
 * SharedPreferences en Android, UserDefaults en iOS y localStorage en el navegador.
 * Otras apps no pueden leerlo, pero no está cifrado (ver README).
 */

const CLAVE_TOKEN = 'movie-rater.token';

export async function guardarToken(token: string): Promise<void> {
  await Preferences.set({ key: CLAVE_TOKEN, value: token });
}

export async function leerToken(): Promise<string | null> {
  const { value } = await Preferences.get({ key: CLAVE_TOKEN });
  return value;
}

export async function borrarToken(): Promise<void> {
  await Preferences.remove({ key: CLAVE_TOKEN });
}
