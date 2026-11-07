import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SesionRequeridaError, SinConexionError } from '../services/peliculasApi';
import { useRecurso } from './useRecurso';

// Solo se necesita el router de Ionic para comprobar a dónde navega
const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('@ionic/react', () => ({ useIonRouter: () => ({ push }) }));

beforeEach(() => vi.clearAllMocks());

describe('useRecurso (estados de carga, datos y error)', () => {
  it('pasa de cargando a error y, al reintentar, a datos', async () => {
    const cargar = vi
      .fn<() => Promise<string[]>>()
      .mockRejectedValueOnce(new SinConexionError())
      .mockResolvedValueOnce(['Coco']);

    const { result } = renderHook(() => useRecurso(cargar, []));
    expect(result.current.estado).toEqual({ tipo: 'cargando' });

    await waitFor(() => expect(result.current.estado.tipo).toBe('error'));
    expect(result.current.estado).toMatchObject({ sinConexion: true });

    await act(() => result.current.recargar());
    expect(result.current.estado).toEqual({ tipo: 'datos', datos: ['Coco'] });
  });

  it('si la sesión venció, va al login con el aviso en vez de mostrar un error', async () => {
    const cargar = vi.fn().mockRejectedValue(new SesionRequeridaError(true));

    const { result } = renderHook(() => useRecurso(cargar, []));

    await waitFor(() => expect(push).toHaveBeenCalledWith('/login?motivo=expirada', 'root', 'replace'));
    expect(result.current.estado.tipo).toBe('cargando');
  });

  it('si una recarga falla con datos en pantalla, conserva los datos y deja el error en aviso', async () => {
    const cargar = vi
      .fn<() => Promise<string[]>>()
      .mockResolvedValueOnce(['Coco'])
      .mockRejectedValueOnce(new Error('No se pudo conectar con el servidor. Inténtalo más tarde.'));

    const { result } = renderHook(() => useRecurso(cargar, []));
    await waitFor(() => expect(result.current.estado.tipo).toBe('datos'));

    await act(() => result.current.recargar());
    expect(result.current.estado).toEqual({ tipo: 'datos', datos: ['Coco'] });
    expect(result.current.aviso).toMatch(/No se pudo conectar/);
  });
});
