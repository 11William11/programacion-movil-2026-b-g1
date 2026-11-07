/**
 * Caché en memoria para una petición (semana 14).
 * Guarda el último resultado durante `vigenciaMs`; mientras siga vigente no se vuelve
 * a llamar a la API. `invalidar()` lo descarta (por ejemplo, después de crear una película).
 * Si llegan dos pedidos a la vez mientras se carga, los dos esperan la misma petición.
 */
export interface Cache<T> {
  obtener(): Promise<T>;
  invalidar(): void;
}

export function crearCache<T>(
  cargar: () => Promise<T>,
  vigenciaMs: number,
  ahora: () => number = Date.now,
): Cache<T> {
  let valor: { dato: T; guardadoEn: number } | null = null;
  let enCurso: Promise<T> | null = null;
  let version = 0; // cambia con cada invalidar() para descartar cargas que ya no sirven

  return {
    obtener() {
      if (valor && ahora() - valor.guardadoEn < vigenciaMs) {
        return Promise.resolve(valor.dato);
      }
      if (!enCurso) {
        const versionAlPedir = version;
        enCurso = cargar()
          .then((dato) => {
            if (versionAlPedir === version) valor = { dato, guardadoEn: ahora() };
            return dato;
          })
          .finally(() => {
            // si falló, el siguiente intento vuelve a llamar a la API
            if (versionAlPedir === version) enCurso = null;
          });
      }
      return enCurso;
    },

    invalidar() {
      valor = null;
      enCurso = null;
      version++;
    },
  };
}
