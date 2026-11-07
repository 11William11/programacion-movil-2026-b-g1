/**
 * Único lugar de la app que habla con el plugin de geolocalización de Capacitor:
 * la pantalla llama a obtenerUbicacion() y nunca usa el plugin directamente.
 */
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

export interface Ubicacion {
  latitud: number;
  longitud: number;
  precision: number; // radio en metros
}

/** Se lanza cuando el usuario niega (o ya había negado) el permiso de ubicación. */
export class PermisoDenegadoError extends Error {
  constructor() {
    super('Permiso de ubicación denegado');
  }
}

export async function obtenerUbicacion(): Promise<Ubicacion> {
  try {
    // En Android/iOS el permiso se pide explícitamente. En el navegador requestPermissions
    // no existe: es getCurrentPosition el que muestra el aviso de permiso.
    if (Capacitor.isNativePlatform()) {
      let permiso = await Geolocation.checkPermissions();
      if (permiso.location === 'prompt' || permiso.location === 'prompt-with-rationale') {
        permiso = await Geolocation.requestPermissions();
      }
      if (permiso.location === 'denied') throw new PermisoDenegadoError();
    }

    const { coords } = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    });
    return { latitud: coords.latitude, longitud: coords.longitude, precision: coords.accuracy };
  } catch (e) {
    if (e instanceof PermisoDenegadoError) throw e;
    // En el navegador el error trae code 1 (PERMISSION_DENIED); en Android el mensaje dice "denied"
    const error = e as { code?: number; message?: string };
    if (error.code === 1 || /denied/i.test(error.message ?? '')) throw new PermisoDenegadoError();
    throw new Error('No se pudo obtener la ubicación. Revisa que el GPS esté encendido.');
  }
}
