import { crearApp } from './app.js';

const PUERTO = process.env.PORT ?? 3000;

const app = crearApp(
  [
    { id: 1, titulo: 'El Padrino', anio: 1972, genero: 'Drama' },
    { id: 2, titulo: 'Coco', anio: 2017, genero: 'Animación' },
    { id: 3, titulo: 'Interestelar', anio: 2014, genero: 'Ciencia ficción' },
    { id: 4, titulo: 'Parásitos', anio: 2019, genero: 'Thriller' },
    { id: 5, titulo: 'Whiplash', anio: 2014, genero: 'Drama' },
    { id: 6, titulo: 'Relatos salvajes', anio: 2014, genero: 'Comedia negra' },
  ],
  {
    // Si no se definen, crearApp usa los valores de demostración (admin / movie123)
    usuario: process.env.AUTH_USUARIO,
    contrasena: process.env.AUTH_CONTRASENA,
    secreto: process.env.JWT_SECRETO,
    expiraEn: process.env.JWT_EXPIRA_EN,
  },
);

app.listen(PUERTO, () => {
  console.log(`API Movie Rater escuchando en http://localhost:${PUERTO}`);
});
