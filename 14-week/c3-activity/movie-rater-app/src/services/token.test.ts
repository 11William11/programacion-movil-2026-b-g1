import { describe, expect, it } from 'vitest';
import { enSegundos, jwtFalso } from '../test/jwtFalso';
import { decodificarToken, tokenVencido } from './token';

describe('token (lectura del JWT en el cliente)', () => {
  const vence = new Date('2026-11-07T15:00:00Z');
  const token = jwtFalso({ sub: 'admin', exp: enSegundos(vence) });

  it('lee el usuario y la hora de vencimiento del payload', () => {
    expect(decodificarToken(token)).toEqual({ usuario: 'admin', venceEn: vence });
    expect(decodificarToken('esto-no-es-un-jwt')).toBeNull();
  });

  it('tokenVencido es false antes del exp y true desde el exp o si está mal formado', () => {
    expect(tokenVencido(token, new Date('2026-11-07T14:59:59Z'))).toBe(false);
    expect(tokenVencido(token, vence)).toBe(true);
    expect(tokenVencido('a.b.c', vence)).toBe(true);
  });
});
