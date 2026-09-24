# Movie Rater — API REST con Express y consumo con fetch (Semana 8)

Actividad opcional de refuerzo · Programación Móvil · 2026-B
**Autor:** William Erney Collo Narvaez (`11William11`)

Backend mínimo para **Movie Rater** con Express: la entidad es **película**
(`id`, `titulo`, `anio`, `genero`). El proyecto está en
[`movie-rater-api/`](movie-rater-api/).

| Parte | Archivo |
|---|---|
| API Express (`GET` y `POST /peliculas`) | [`src/app.js`](movie-rater-api/src/app.js), [`src/server.js`](movie-rater-api/src/server.js) |
| Funciones `fetch` con manejo de errores | [`src/cliente/peliculasApi.js`](movie-rater-api/src/cliente/peliculasApi.js) |
| Pruebas automáticas | [`test/api.test.js`](movie-rater-api/test/api.test.js) |
| Evidencia completa (curl, cliente, pruebas) | [`evidencias/pruebas.md`](movie-rater-api/evidencias/pruebas.md) |

## Cómo ejecutarlo

Requisitos: Node.js 20 o superior.

```bash
cd movie-rater-api
npm install
npm start        # API en http://localhost:3000
npm test         # 8 pruebas (API + cliente)
node src/cliente/demo.js   # usa las funciones fetch contra la API encendida
```

Los datos están en memoria: al reiniciar el servidor vuelven las 3 películas de
ejemplo.

## 1. Endpoints

| Método | URL | Cuerpo | Respuesta |
|---|---|---|---|
| `GET` | `/peliculas` | — | `200` + arreglo JSON de películas |
| `POST` | `/peliculas` | `{ "titulo": "Whiplash", "anio": 2014, "genero": "Drama" }` | `201` + la película creada con su `id` y cabecera `Location` |

Validaciones del `POST` (si fallan responde `400` con la lista de errores):

- `titulo`: texto obligatorio, no vacío.
- `anio`: entero entre 1888 (primera película) y el año siguiente al actual.
- `genero`: opcional; si no llega se guarda `"Sin género"`.

Otros casos: un JSON mal formado responde `400 { "error": "El cuerpo no es un JSON válido" }`
y una ruta que no existe responde `404` en JSON. La API tiene **CORS** activado para
que la app Ionic (`localhost:8100`) pueda llamarla desde el navegador.

```js
app.get('/peliculas', (req, res) => {
  res.json(peliculas);
});

app.post('/peliculas', (req, res) => {
  const errores = validarPelicula(req.body);
  if (errores.length > 0) {
    return res.status(400).json({ error: 'Datos inválidos', detalles: errores });
  }
  const nueva = { id: siguienteId++, titulo: req.body.titulo.trim(), anio: req.body.anio,
                  genero: req.body.genero?.trim() || 'Sin género' };
  peliculas.push(nueva);
  res.status(201).location(`/peliculas/${nueva.id}`).json(nueva);
});
```

## 2. Pruebas de los endpoints

Probados con curl (la sesión completa, con cabeceras, está en
[`evidencias/pruebas.md`](movie-rater-api/evidencias/pruebas.md)):

| Petición | Respuesta |
|---|---|
| `curl http://localhost:3000/peliculas` | `200 OK` — 3 películas |
| `curl -X POST .../peliculas -H 'Content-Type: application/json' -d '{"titulo":"Whiplash","anio":2014,"genero":"Drama"}'` | `201 Created`, `Location: /peliculas/4`, `{"id":4,...}` |
| `POST` con `{"titulo":"","anio":1500}` | `400` — `["titulo es obligatorio","anio debe ser un entero entre 1888 y 2027"]` |
| `POST` con `{titulo: sin comillas` | `400` — `El cuerpo no es un JSON válido` |
| `curl http://localhost:3000/peliculas` otra vez | `200 OK` — 4 películas |

También se pueden probar en Postman o Thunder Client con las mismas URLs.

## 3. Funciones fetch con manejo de errores

```js
export async function listarPeliculas(baseUrl = API_URL) {
  return pedir(`${baseUrl}/peliculas`);
}

export async function crearPelicula(pelicula, baseUrl = API_URL) {
  return pedir(`${baseUrl}/peliculas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pelicula),
  });
}
```

Las dos usan `pedir`, que maneja los tres tipos de error y siempre lanza un
`ApiError` con un mensaje listo para mostrar en la app:

| Qué pasa | Cómo se detecta | Qué lanza |
|---|---|---|
| El servidor está apagado o no hay internet | `fetch` lanza una excepción (no hubo respuesta) | `ApiError("No se pudo conectar con el servidor")`, `status = null` |
| El servidor tarda más de 8 s | `AbortSignal.timeout(8000)` cancela la petición | `ApiError("El servidor tardó demasiado en responder")` |
| La API responde `400` o `500` | `fetch` **no** lanza error con esos códigos: hay que revisar `response.ok` | `ApiError(mensaje de la API, status, detalles)` |

Salida de `node src/cliente/demo.js` con la API encendida:

```
1) Listar películas
   #1 El Padrino (1972) · Drama
   #2 Coco (2017) · Animación
   #3 Interestelar (2014) · Ciencia ficción
   #4 Whiplash (2014) · Drama

2) Crear una película válida
   Creada: {"id":5,"titulo":"Relatos salvajes","anio":2014,"genero":"Comedia negra"}

3) Crear una película inválida (sin título, año 1500)
   ApiError 400: Datos inválidos
   - titulo es obligatorio
   - anio debe ser un entero entre 1888 y 2027

4) Llamar a un servidor apagado (puerto 3999)
   ApiError (status null): No se pudo conectar con el servidor

5) Listar otra vez: ahora hay 5 películas
```

### Uso desde la app Ionic React

Las funciones no dependen de nada del navegador aparte de `fetch`, así que se
importan tal cual en una página de la app:

```tsx
const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  listarPeliculas()
    .then(setPeliculas)
    .catch((e) => setError(e.message)); // p. ej. mostrar un IonToast
}, []);
```

## 4. Pruebas automáticas

`npm test` usa el runner integrado de Node (`node:test`): levanta la API en un
puerto libre y prueba tanto los endpoints como las funciones del cliente.

```
▶ API Express
  ✔ GET /peliculas responde 200 con un arreglo JSON
  ✔ POST /peliculas crea la película y responde 201
  ✔ POST /peliculas con datos inválidos responde 400 con detalles
  ✔ POST /peliculas con JSON mal formado responde 400
▶ Cliente fetch
  ✔ listarPeliculas devuelve el arreglo
  ✔ crearPelicula devuelve la película creada con id
  ✔ crearPelicula lanza ApiError con status 400 si la API rechaza los datos
  ✔ listarPeliculas lanza ApiError sin status si el servidor no responde
ℹ tests 8
ℹ pass 8
ℹ fail 0
```
