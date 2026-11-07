/**
 * Lectura del JWT en el cliente (c3).
 * La app NO verifica la firma: eso lo hace la API con su clave secreta. Aquí solo se lee
 * el payload para mostrar quién inició sesión, cuándo vence la sesión y para no enviar
 * a la API un token que ya venció.
 */

export interface DatosToken {
  usuario: string;
  venceEn: Date;
}

/** Devuelve el usuario (`sub`) y el vencimiento (`exp`) del JWT, o null si el token está mal formado. */
export function decodificarToken(token: string): DatosToken | null {
  const partes = token.split('.');
  if (partes.length !== 3) return null;

  try {
    // El payload va en base64url: se pasa a base64 normal y se completa el relleno con '='
    const base64 = partes[1].replace(/-/g, '+').replace(/_/g, '/');
    const conRelleno = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const bytes = Uint8Array.from(atob(conRelleno), (c) => c.charCodeAt(0));
    const payload = JSON.parse(new TextDecoder().decode(bytes));

    if (typeof payload.sub !== 'string' || typeof payload.exp !== 'number') return null;
    return { usuario: payload.sub, venceEn: new Date(payload.exp * 1000) };
  } catch {
    return null;
  }
}

/** true si el token está mal formado o su `exp` ya pasó. */
export function tokenVencido(token: string, ahora: Date = new Date()): boolean {
  const datos = decodificarToken(token);
  return datos === null || datos.venceEn.getTime() <= ahora.getTime();
}
