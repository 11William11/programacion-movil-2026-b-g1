import { crearApp } from './app.js';

const PUERTO = process.env.PORT ?? 3000;

const app = crearApp([
  { id: 1, titulo: 'El Padrino', anio: 1972, genero: 'Drama' },
  { id: 2, titulo: 'Coco', anio: 2017, genero: 'Animación' },
  { id: 3, titulo: 'Interestelar', anio: 2014, genero: 'Ciencia ficción' },
]);

app.listen(PUERTO, () => {
  console.log(`API Movie Rater escuchando en http://localhost:${PUERTO}`);
});
