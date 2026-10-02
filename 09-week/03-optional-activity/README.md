# Movie Rater — App Ionic React + API Express (Semana 9)

Actividad opcional de refuerzo y actividad calificable c2 · Programación Móvil · 2026-B
**Autor:** William Erney Collo Narvaez (`11William11`)

| Carpeta | Contenido |
|---|---|
| [`movie-rater-api/`](movie-rater-api/) | API REST con Express: `GET /peliculas`, `GET /peliculas/:id` y `POST /peliculas` |
| [`movie-rater-app/`](movie-rater-app/) | App Ionic React: lista, formulario para crear y pantalla de detalle |

## Cómo ejecutarlo

Requisitos: Node.js 20 o superior. Se necesitan dos terminales.

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

## Qué hace cada requisito

| Requisito | Dónde está |
|---|---|
| `IonList` con 6 películas cargadas con `fetch` | [`ListaPeliculas.tsx`](movie-rater-app/src/pages/ListaPeliculas.tsx) |
| Formulario que crea una película (`useState` por campo) | [`NuevaPelicula.tsx`](movie-rater-app/src/pages/NuevaPelicula.tsx) |
| Navegación a la 2ª página (detalle) con React Router | [`App.tsx`](movie-rater-app/src/App.tsx), [`DetallePelicula.tsx`](movie-rater-app/src/pages/DetallePelicula.tsx) |
| Errores de red y de la API | [`peliculasApi.ts`](movie-rater-app/src/services/peliculasApi.ts): cada pantalla muestra el mensaje en pantalla |

## Architecture

The Movie Rater app is split into a Node.js backend and an Ionic React frontend that talk through a REST API in JSON format.
The Express API exposes three endpoints for the movie entity: `GET /peliculas` returns the list of movies, `GET /peliculas/:id` returns one movie or a 404 error if it does not exist, and `POST /peliculas` creates a movie and answers 201, or 400 when the title or the year is not valid.
All the `fetch` calls live in one service file, `peliculasApi.ts`, so the screens never build requests by themselves and the base URL is defined in a single place.
The list page calls `GET /peliculas` every time it is shown, saves the response in a `useState` variable and renders it with an `IonList` component.
When the user taps a movie, React Router navigates to `/peliculas/:id` and the detail page calls `GET /peliculas/:id` to show that movie.
The form sends the typed values with `POST /peliculas`, and when the API answers 201 the app goes back to the list, which loads again and shows the new movie.
If the server is off or the API answers with an error, the service throws an error with a clear message and the page shows it on screen instead of crashing.
