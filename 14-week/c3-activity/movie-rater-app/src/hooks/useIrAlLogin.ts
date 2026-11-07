import { useCallback, useRef } from 'react';
import { useIonRouter } from '@ionic/react';
import { SesionRequeridaError } from '../services/peliculasApi';

/**
 * Manejo del 401 en un solo lugar: si el error es de sesión, navega al login
 * (con el aviso de sesión expirada cuando corresponde) y devuelve true.
 * Para cualquier otro error devuelve false y la pantalla muestra el mensaje.
 */
export function useIrAlLogin(): (error: unknown) => boolean {
  const router = useIonRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  return useCallback((error: unknown) => {
    if (!(error instanceof SesionRequeridaError)) return false;
    routerRef.current.push(error.vencida ? '/login?motivo=expirada' : '/login', 'root', 'replace');
    return true;
  }, []);
}
