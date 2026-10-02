# Movie Rater — Pantalla con lista y navegación en Ionic React (Semana 9)

Actividad opcional de refuerzo · Programación Móvil · 2026-B
**Autor:** William Erney Collo Narvaez (`11William11`)

App Ionic React en [`movie-rater-lista/`](movie-rater-lista/): una pantalla con una lista de
películas, un contador con `useState` y una segunda página a la que se navega con React Router.

## Cómo ejecutarlo

Requisitos: Node.js 20 o superior.

```bash
cd movie-rater-lista
npm install
npm run dev      # app en http://localhost:8100
```

## Qué cumple cada requisito

| Requisito | Dónde está |
|---|---|
| Lista (`IonList`) de al menos 5 elementos | [`ListaPage.tsx`](movie-rater-lista/src/pages/ListaPage.tsx): 6 películas de [`peliculas.ts`](movie-rater-lista/src/data/peliculas.ts) |
| Contador con `useState` | [`ListaPage.tsx`](movie-rater-lista/src/pages/ListaPage.tsx): "Películas vistas" sube con el botón "Marcar una vista" |
| Segunda página y navegación (React Router) | [`App.tsx`](movie-rater-lista/src/App.tsx) define `/pelicula/:id`; cada elemento de la lista navega a [`DetallePage.tsx`](movie-rater-lista/src/pages/DetallePage.tsx) |
