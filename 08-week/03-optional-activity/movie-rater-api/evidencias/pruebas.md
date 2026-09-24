# Evidencia de pruebas

API levantada con `npm start` (3 películas de ejemplo). Ejecutado el 2026-09-24 13:27.

## 1. Endpoints probados con curl

### GET /peliculas

```bash
curl http://localhost:3000/peliculas
```

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[{"id":1,"titulo":"El Padrino","anio":1972,"genero":"Drama"},{"id":2,"titulo":"Coco","anio":2017,"genero":"Animación"},{"id":3,"titulo":"Interestelar","anio":2014,"genero":"Ciencia ficción"}]

```

### POST /peliculas (válido → 201)

```bash
curl -X POST http://localhost:3000/peliculas -H 'Content-Type: application/json' -d '{"titulo":"Whiplash","anio":2014,"genero":"Drama"}'
```

```http
HTTP/1.1 201 Created
Location: /peliculas/4
Content-Type: application/json; charset=utf-8

{"id":4,"titulo":"Whiplash","anio":2014,"genero":"Drama"}

```

### POST /peliculas (inválido → 400)

```bash
curl -X POST http://localhost:3000/peliculas -H 'Content-Type: application/json' -d '{"titulo":"","anio":1500}'
```

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8

{"error":"Datos inválidos","detalles":["titulo es obligatorio","anio debe ser un entero entre 1888 y 2027"]}

```

### POST /peliculas (JSON mal formado → 400)

```bash
curl -X POST http://localhost:3000/peliculas -H 'Content-Type: application/json' -d '{titulo: sin comillas'
```

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8

{"error":"El cuerpo no es un JSON válido"}

```

### GET /peliculas después de crear

```bash
curl http://localhost:3000/peliculas
```

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[{"id":1,"titulo":"El Padrino","anio":1972,"genero":"Drama"},{"id":2,"titulo":"Coco","anio":2017,"genero":"Animación"},{"id":3,"titulo":"Interestelar","anio":2014,"genero":"Ciencia ficción"},{"id":4,"titulo":"Whiplash","anio":2014,"genero":"Drama"}]

```

## 2. Consumo con las funciones fetch

```bash
node src/cliente/demo.js
```

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

## 3. Pruebas automáticas

```bash
npm test
```

```
▶ API Express
  ✔ GET /peliculas responde 200 con un arreglo JSON
  ✔ POST /peliculas crea la película y responde 201
  ✔ POST /peliculas con datos inválidos responde 400 con detalles
  ✔ POST /peliculas con JSON mal formado responde 400
✔ API Express
▶ Cliente fetch
  ✔ listarPeliculas devuelve el arreglo
  ✔ crearPelicula devuelve la película creada con id
  ✔ crearPelicula lanza ApiError con status 400 si la API rechaza los datos
  ✔ listarPeliculas lanza ApiError sin status si el servidor no responde
✔ Cliente fetch
ℹ tests 8
ℹ suites 2
ℹ pass 8
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```
