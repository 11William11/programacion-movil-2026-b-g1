/**
 * Estado de la red con el plugin @capacitor/network (c3).
 * En Android/iOS pregunta al sistema operativo; en el navegador usa navigator.onLine
 * y los eventos online/offline. Es el único archivo que usa el plugin.
 */
import { Network } from '@capacitor/network';

export async function hayConexion(): Promise<boolean> {
  try {
    return (await Network.getStatus()).connected;
  } catch {
    return navigator.onLine; // si el plugin no responde, se usa lo que sabe el navegador
  }
}

/** Avisa cada vez que el dispositivo se conecta o se desconecta. Devuelve la función para dejar de escuchar. */
export function escucharConexion(alCambiar: (conectado: boolean) => void): () => void {
  const suscripcion = Network.addListener('networkStatusChange', (estado) =>
    alCambiar(estado.connected),
  );
  return () => {
    void suscripcion.then((s) => s.remove());
  };
}
