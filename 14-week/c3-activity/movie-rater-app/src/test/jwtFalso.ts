/** Arma un JWT con el payload dado (la firma no importa: la app no la verifica). */
export function jwtFalso(payload: Record<string, unknown>): string {
  const base64url = (objeto: object) =>
    btoa(JSON.stringify(objeto)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${base64url({ alg: 'HS256', typ: 'JWT' })}.${base64url(payload)}.firma`;
}

/** Segundos desde 1970, como el campo exp de un JWT. */
export const enSegundos = (fecha: Date) => Math.floor(fecha.getTime() / 1000);
