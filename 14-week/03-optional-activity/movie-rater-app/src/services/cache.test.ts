import { describe, expect, it, vi } from 'vitest';
import { crearCache } from './cache';

const PELICULAS = [{ id: 1, titulo: 'Coco', anio: 2017, genero: 'Animación' }];

describe('crearCache', () => {
  it('no vuelve a llamar a la API mientras el dato está vigente, y sí cuando vence', async () => {
    let reloj = 0; // reloj falso: la prueba decide cuánto tiempo "pasa"
    const cargar = vi.fn().mockResolvedValue(PELICULAS);
    const cache = crearCache(cargar, 60_000, () => reloj);

    await cache.obtener(); // primera vez: va a la API
    reloj = 30_000;
    await cache.obtener(); // 30 s después: sale de la caché
    await cache.obtener();
    expect(cargar).toHaveBeenCalledTimes(1);

    reloj = 60_000; // ya pasaron los 60 s de vigencia
    await expect(cache.obtener()).resolves.toEqual(PELICULAS);
    expect(cargar).toHaveBeenCalledTimes(2);
  });

  it('invalidar() obliga a pedir de nuevo (lo que pasa al crear una película)', async () => {
    const conNueva = [...PELICULAS, { id: 2, titulo: 'Parásitos', anio: 2019, genero: 'Thriller' }];
    const cargar = vi.fn().mockResolvedValueOnce(PELICULAS).mockResolvedValueOnce(conNueva);
    const cache = crearCache(cargar, 60_000, () => 0);

    await expect(cache.obtener()).resolves.toHaveLength(1);
    cache.invalidar();
    await expect(cache.obtener()).resolves.toHaveLength(2);
    expect(cargar).toHaveBeenCalledTimes(2);
  });
});
