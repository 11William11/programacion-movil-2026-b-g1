import { useCallback, useEffect, useRef, useState } from 'react';
import { SinConexionError } from '../services/peliculasApi';
import { useIrAlLogin } from './useIrAlLogin';

/** Los tres estados de una pantalla que carga datos de la API. */
export type Estado<T> =
  | { tipo: 'cargando' }
  | { tipo: 'datos'; datos: T }
  | { tipo: 'error'; mensaje: string; sinConexion: boolean };

interface Opciones {
  /** Cargar apenas se monta el componente (por defecto sí). */
  alMontar?: boolean;
}

/**
 * Carga datos con `cargar()` y expone el estado: cargando → datos | error.
 * - Si ya hay datos en pantalla, recargar no los borra: si la recarga falla, los datos
 *   se quedan y el error llega en `aviso` (para mostrarlo en un toast).
 * - Si el error es de sesión (sin token o 401), va al login en vez de mostrar el error.
 * - Si llegan dos respuestas, solo cuenta la de la última petición.
 */
export function useRecurso<T>(
  cargar: () => Promise<T>,
  deps: readonly unknown[],
  { alMontar = true }: Opciones = {},
) {
  const [estado, setEstado] = useState<Estado<T>>({ tipo: 'cargando' });
  const [aviso, setAviso] = useState<string | null>(null);
  const irAlLogin = useIrAlLogin();

  const cargarRef = useRef(cargar);
  cargarRef.current = cargar;
  const estadoRef = useRef(estado);
  estadoRef.current = estado;
  const ultimaPeticion = useRef(0);

  const recargar = useCallback(async () => {
    const peticion = ++ultimaPeticion.current;
    const habiaDatos = estadoRef.current.tipo === 'datos';
    if (!habiaDatos) setEstado({ tipo: 'cargando' });
    setAviso(null);

    try {
      const datos = await cargarRef.current();
      if (peticion === ultimaPeticion.current) setEstado({ tipo: 'datos', datos });
    } catch (e) {
      if (peticion !== ultimaPeticion.current || irAlLogin(e)) return;
      const mensaje = e instanceof Error ? e.message : 'Error desconocido';
      if (habiaDatos) setAviso(mensaje);
      else setEstado({ tipo: 'error', mensaje, sinConexion: e instanceof SinConexionError });
    }
  }, [irAlLogin]);

  useEffect(() => {
    // Al cambiar de recurso (p. ej. otra película) se empieza de cero
    estadoRef.current = { tipo: 'cargando' };
    if (alMontar) void recargar();
    // deps las define quien usa el hook (p. ej. [id] en el detalle)
  }, deps);

  return { estado, aviso, cerrarAviso: () => setAviso(null), recargar };
}
