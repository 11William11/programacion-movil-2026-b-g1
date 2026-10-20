# Taller W11 — UX/UI en pantallas avanzadas · Movie Rater

<!-- CONFIG-START -->
- FULL_NAME: William Erney Collo Narvaez
- GITHUB_USER: 11William11
- TEAM: Movie Rater (William Collo, Paulina Díaz, Andrés Cárdenas)
- DOCS_REPO: https://github.com/code-corhuila/mr-docs
- CODE_REPO: https://github.com/code-corhuila/movie-rater
- BASELINE: app del equipo (`movie-rater-frontend`), rama `develop`, commit `559ed75`
- REFLECTION_DOC: https://docs.google.com/document/d/1-p89yy6arSPQPPMa4si2geBKGf4iQlqXC1zdsoiXWwE/edit?usp=sharing
- MY_SCREENS: Home (búsqueda y lista de películas, `/tabs/buscar`), MovieDetail (detalle y reseña, `/movie/:id`)
<!-- CONFIG-END -->

## Línea base

`app/` es una copia sin cambios de `movie-rater-frontend` (Ionic React + TypeScript) tomada del commit `559ed75` de la rama `develop` del repositorio del equipo, sin `node_modules` ni archivos de build.

## Cómo ejecutar

```bash
cd 11-week/workshop/app
npm install
npm run dev
```

La app abre en `http://localhost:5173`.

- La búsqueda de películas usa TMDB: crear `app/.env` con `VITE_TMDB_API_KEY=<clave>` (el archivo está en `.gitignore`).
- Login, registro y reseñas usan el backend del equipo (`movie-rater-backend`) en `http://localhost:3000/api`.
