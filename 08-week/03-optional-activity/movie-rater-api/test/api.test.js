import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { crearApp } from '../src/app.js';
import { listarPeliculas, crearPelicula, ApiError } from '../src/cliente/peliculasApi.js';

let servidor;
let base;

before(async () => {
  const app = crearApp([{ id: 1, titulo: 'Coco', anio: 2017, genero: 'Animación' }]);
  await new Promise((listo) => { servidor = app.listen(0, listo); });
  base = `http://localhost:${servidor.address().port}`;
});

after(() => servidor.close());

describe('API Express', () => {
  test('GET /peliculas responde 200 con un arreglo JSON', async () => {
    const res = await fetch(`${base}/peliculas`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type'), /application\/json/);
    const peliculas = await res.json();
    assert.equal(peliculas[0].titulo, 'Coco');
  });

  test('POST /peliculas crea la película y responde 201', async () => {
    const res = await fetch(`${base}/peliculas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: 'Parásitos', anio: 2019, genero: 'Thriller' }),
    });
    assert.equal(res.status, 201);
    assert.equal(res.headers.get('location'), '/peliculas/2');
    assert.deepEqual(await res.json(), { id: 2, titulo: 'Parásitos', anio: 2019, genero: 'Thriller' });
  });

  test('POST /peliculas con datos inválidos responde 400 con detalles', async () => {
    const res = await fetch(`${base}/peliculas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: '', anio: 1500 }),
    });
    assert.equal(res.status, 400);
    const cuerpo = await res.json();
    assert.equal(cuerpo.detalles.length, 2);
  });

  test('POST /peliculas con JSON mal formado responde 400', async () => {
    const res = await fetch(`${base}/peliculas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ titulo: sin comillas',
    });
    assert.equal(res.status, 400);
    assert.equal((await res.json()).error, 'El cuerpo no es un JSON válido');
  });
});

describe('Cliente fetch', () => {
  test('listarPeliculas devuelve el arreglo', async () => {
    const peliculas = await listarPeliculas(base);
    assert.ok(Array.isArray(peliculas));
    assert.ok(peliculas.some((p) => p.titulo === 'Coco'));
  });

  test('crearPelicula devuelve la película creada con id', async () => {
    const creada = await crearPelicula({ titulo: 'Amélie', anio: 2001 }, base);
    assert.equal(creada.titulo, 'Amélie');
    assert.equal(creada.genero, 'Sin género');
    assert.ok(Number.isInteger(creada.id));
  });

  test('crearPelicula lanza ApiError con status 400 si la API rechaza los datos', async () => {
    await assert.rejects(
      crearPelicula({ titulo: 'Sin año' }, base),
      (error) => error instanceof ApiError && error.status === 400 && error.detalles.length === 1,
    );
  });

  test('listarPeliculas lanza ApiError sin status si el servidor no responde', async () => {
    await assert.rejects(
      listarPeliculas('http://localhost:1'),
      (error) => error instanceof ApiError
        && error.status === null
        && error.message === 'No se pudo conectar con el servidor',
    );
  });
});
