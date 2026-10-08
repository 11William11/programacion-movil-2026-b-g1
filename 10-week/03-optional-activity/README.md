# Movie Rater — Mini-app integradora (Semana 10)

Actividad opcional de refuerzo (cierre C2) · Programación Móvil · 2026-B
**Autor:** William Erney Collo Narvaez (`11William11`)

Mini-app de películas que integra los contenidos del Corte 2: un backend **Express** y
una app **Ionic React** que trabajan juntos. Parte de la
[`c2-activity` de la semana 9](../../09-week/c2-activity/).

| Carpeta | Contenido |
|---|---|
| [`movie-rater-api/`](movie-rater-api/) | API REST con Express: una entidad (`películas`) con `GET` y `POST` |
| [`movie-rater-app/`](movie-rater-app/) | App Ionic React: lista, formulario para crear y pantalla de detalle |

## Cómo ejecutarlo

Requisitos: Node.js 20 o superior. Se necesitan dos terminales, una por cada carpeta.

```bash
# Terminal 1: API en http://localhost:3000
cd movie-rater-api
npm install
npm start
npm test        # 6 pruebas de los endpoints

# Terminal 2: app en http://localhost:8100
cd movie-rater-app
npm install
npm run dev
```

La API guarda los datos en memoria (arranca con 6 películas) y se reinicia al apagarla.

## Qué pide el enunciado y dónde está

| Requisito | Dónde está |
|---|---|
| Backend Express con una entidad, `GET` y `POST` | [`app.js`](movie-rater-api/src/app.js): `GET /peliculas`, `GET /peliculas/:id` y `POST /peliculas` |
| Pantalla que lista los datos con `fetch` | [`ListaPeliculas.tsx`](movie-rater-app/src/pages/ListaPeliculas.tsx) |
| Formulario que crea un elemento nuevo | [`NuevaPelicula.tsx`](movie-rater-app/src/pages/NuevaPelicula.tsx) |
| Navegación a una pantalla de detalle | [`App.tsx`](movie-rater-app/src/App.tsx) y [`DetallePelicula.tsx`](movie-rater-app/src/pages/DetallePelicula.tsx) |
| Manejo básico de errores de red | [`peliculasApi.ts`](movie-rater-app/src/services/peliculasApi.ts) |

## Endpoints

| Acción | Método | URL | Éxito | Errores |
|---|---|---|---|---|
| Listar | `GET` | `/peliculas` | `200` | — |
| Obtener una | `GET` | `/peliculas/:id` | `200` | `404` no existe |
| Crear | `POST` | `/peliculas` | `201` + `Location` | `400` título o año inválidos, o JSON mal formado |

Cuerpo para `POST`:

```json
{ "titulo": "Oppenheimer", "anio": 2023, "genero": "Drama" }
```

## Manejo de errores

Todas las llamadas a la API pasan por `peliculasApi.ts`. Si algo falla, el servicio lanza un
error con un mensaje claro y la pantalla lo muestra en vez de quedarse en blanco:

| Situación | Mensaje en pantalla |
|---|---|
| El servidor está apagado o no hay red | `No se pudo conectar con el servidor` |
| La API responde con error (por ejemplo, formulario vacío) | El mensaje de la API, como `Datos inválidos` |
| El detalle de una película que no existe | `No existe la película 99` |

En Windows el mensaje de "sin conexión" puede tardar unos segundos en aparecer, porque el
sistema reintenta la conexión antes de darla por fallida.
