import { beforeEach, describe, expect, it, vi } from 'vitest';
import { jwtFalso } from '../test/jwtFalso';
import { hayConexion } from './conexion';
import { listarPeliculas, SesionRequeridaError, SinConexionError } from './peliculasApi';
import { borrarToken, leerToken } from './sesion';

// El almacenamiento del token y el estado de la red se reemplazan por funciones de prueba
vi.mock('./sesion', () => ({ leerToken: vi.fn(), guardarToken: vi.fn(), borrarToken: vi.fn() }));
vi.mock('./conexion', () => ({ hayConexion: vi.fn() }));

const fetchFalso = vi.fn<typeof fetch>();
const respuesta = (status: number, cuerpo: unknown) =>
  new Response(JSON.stringify(cuerpo), { status, headers: { 'Content-Type': 'application/json' } });

const tokenValido = jwtFalso({ sub: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 });

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal('fetch', fetchFalso);
  vi.mocked(leerToken).mockResolvedValue(tokenValido);
  vi.mocked(hayConexion).mockResolvedValue(true);
});

describe('peliculasApi (servicio centralizado)', () => {
  it('envía el token en la cabecera Authorization de la petición protegida', async () => {
    fetchFalso.mockResolvedValue(respuesta(200, [{ id: 1, titulo: 'Coco', anio: 2017, genero: 'Animación' }]));

    const peliculas = await listarPeliculas();

    expect(peliculas).toHaveLength(1);
    const [url, opciones] = fetchFalso.mock.calls[0];
    expect(url).toMatch(/\/peliculas$/);
    expect(new Headers(opciones?.headers).get('Authorization')).toBe(`Bearer ${tokenValido}`);
  });

  it('si la API responde 401, borra el token y pide iniciar sesión de nuevo', async () => {
    fetchFalso.mockResolvedValue(respuesta(401, { error: 'Token inválido o vencido' }));

    const error = await listarPeliculas().catch((e) => e);

    expect(error).toBeInstanceOf(SesionRequeridaError);
    expect(error.vencida).toBe(true);
    expect(borrarToken).toHaveBeenCalledOnce();
  });

  it('sin conexión no llama a la API y lanza SinConexionError', async () => {
    vi.mocked(hayConexion).mockResolvedValue(false);

    await expect(listarPeliculas()).rejects.toBeInstanceOf(SinConexionError);
    expect(fetchFalso).not.toHaveBeenCalled();
  });

  it('con un token vencido no llama a la API: lo borra y pide iniciar sesión', async () => {
    vi.mocked(leerToken).mockResolvedValue(jwtFalso({ sub: 'admin', exp: 1 }));

    await expect(listarPeliculas()).rejects.toBeInstanceOf(SesionRequeridaError);
    expect(fetchFalso).not.toHaveBeenCalled();
    expect(borrarToken).toHaveBeenCalledOnce();
  });

  it('si fetch falla con red disponible, avisa que el servidor no responde', async () => {
    fetchFalso.mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(listarPeliculas()).rejects.toThrow('No se pudo conectar con el servidor');
  });
});
