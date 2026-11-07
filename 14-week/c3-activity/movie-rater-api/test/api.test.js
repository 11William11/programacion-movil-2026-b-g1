import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { crearApp } from '../src/app.js';

const SECRETO = 'secreto-de-prueba';

let servidor;
let base;
let conToken; // cabecera Authorization con un token válido

before(async () => {
  const app = crearApp([{ id: 1, titulo: 'Coco', anio: 2017, genero: 'Animación' }], {
    usuario: 'admin',
    contrasena: 'movie123',
    secreto: SECRETO,
  });
  await new Promise((listo) => { servidor = app.listen(0, listo); });
  base = `http://localhost:${servidor.address().port}`;

  const res = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario: 'admin', contrasena: 'movie123' }),
  });
  conToken = { Authorization: `Bearer ${(await res.json()).token}` };
});

after(() => servidor.close());

describe('API Express (con token)', () => {
  test('GET /peliculas responde 200 con un arreglo JSON', async () => {
    const res = await fetch(`${base}/peliculas`, { headers: conToken });
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type'), /application\/json/);
    const peliculas = await res.json();
    assert.equal(peliculas[0].titulo, 'Coco');
  });

  test('GET /peliculas/:id responde 200 con la película', async () => {
    const res = await fetch(`${base}/peliculas/1`, { headers: conToken });
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { id: 1, titulo: 'Coco', anio: 2017, genero: 'Animación' });
  });

  test('GET /peliculas/:id responde 404 si no existe', async () => {
    const res = await fetch(`${base}/peliculas/999`, { headers: conToken });
    assert.equal(res.status, 404);
    assert.equal((await res.json()).error, 'No existe la película 999');
  });

  test('POST /peliculas crea la película y responde 201', async () => {
    const res = await fetch(`${base}/peliculas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...conToken },
      body: JSON.stringify({ titulo: 'Parásitos', anio: 2019, genero: 'Thriller' }),
    });
    assert.equal(res.status, 201);
    assert.equal(res.headers.get('location'), '/peliculas/2');
    assert.deepEqual(await res.json(), { id: 2, titulo: 'Parásitos', anio: 2019, genero: 'Thriller' });
  });

  test('POST /peliculas con datos inválidos responde 400 con detalles', async () => {
    const res = await fetch(`${base}/peliculas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...conToken },
      body: JSON.stringify({ titulo: '', anio: 1500 }),
    });
    assert.equal(res.status, 400);
    const cuerpo = await res.json();
    assert.equal(cuerpo.detalles.length, 2);
  });

  test('POST /peliculas con JSON mal formado responde 400', async () => {
    const res = await fetch(`${base}/peliculas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...conToken },
      body: '{ titulo: sin comillas',
    });
    assert.equal(res.status, 400);
    assert.equal((await res.json()).error, 'El cuerpo no es un JSON válido');
  });
});

describe('Login y token (semana 13)', () => {
  const login = (cuerpo) =>
    fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    });

  test('POST /auth/login con datos correctos responde 200 con un JWT', async () => {
    const res = await login({ usuario: 'admin', contrasena: 'movie123' });
    assert.equal(res.status, 200);
    const { token } = await res.json();
    assert.equal(jwt.verify(token, SECRETO).sub, 'admin');
  });

  test('POST /auth/login con contraseña incorrecta responde 401', async () => {
    const res = await login({ usuario: 'admin', contrasena: 'mala' });
    assert.equal(res.status, 401);
    assert.equal((await res.json()).error, 'Usuario o contraseña incorrectos');
  });

  test('GET /peliculas sin token responde 401', async () => {
    const res = await fetch(`${base}/peliculas`);
    assert.equal(res.status, 401);
    assert.equal((await res.json()).error, 'Falta el token. Inicia sesión.');
  });

  test('GET /peliculas con un token vencido responde 401', async () => {
    const vencido = jwt.sign({ sub: 'admin', exp: Math.floor(Date.now() / 1000) - 60 }, SECRETO);
    const res = await fetch(`${base}/peliculas`, { headers: { Authorization: `Bearer ${vencido}` } });
    assert.equal(res.status, 401);
    assert.equal((await res.json()).error, 'Token inválido o vencido');
  });

  test('GET /peliculas con un token firmado con otro secreto responde 401', async () => {
    const falso = jwt.sign({ sub: 'admin' }, 'otro-secreto');
    const res = await fetch(`${base}/peliculas`, { headers: { Authorization: `Bearer ${falso}` } });
    assert.equal(res.status, 401);
  });
});
