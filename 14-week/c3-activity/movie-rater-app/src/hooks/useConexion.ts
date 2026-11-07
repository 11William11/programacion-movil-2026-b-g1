import { useEffect, useState } from 'react';
import { escucharConexion, hayConexion } from '../services/conexion';

/** true mientras el dispositivo tenga red; se actualiza solo cuando cambia. */
export function useConexion(): boolean {
  const [conectado, setConectado] = useState(true);

  useEffect(() => {
    let activo = true;
    void hayConexion().then((c) => activo && setConectado(c));
    const dejarDeEscuchar = escucharConexion(setConectado);
    return () => {
      activo = false;
      dejarDeEscuchar();
    };
  }, []);

  return conectado;
}
