import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { crearApp } from '../src/app.js';

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

  test('GET /peliculas/:id responde 200 con la película', async () => {
    const res = await fetch(`${base}/peliculas/1`);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { id: 1, titulo: 'Coco', anio: 2017, genero: 'Animación' });
  });

  test('GET /peliculas/:id responde 404 si no existe', async () => {
    const res = await fetch(`${base}/peliculas/999`);
    assert.equal(res.status, 404);
    assert.equal((await res.json()).error, 'No existe la película 999');
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
