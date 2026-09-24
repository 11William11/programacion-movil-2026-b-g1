import express from 'express';
import cors from 'cors';

const ANIO_MINIMO = 1888; // año de la primera película registrada

/**
 * Crea la aplicación Express con los endpoints de películas.
 * Los datos viven en memoria: se reinician cada vez que arranca el servidor.
 */
export function crearApp(peliculasIniciales = []) {
  const peliculas = peliculasIniciales.map((p) => ({ ...p }));
  let siguienteId = peliculas.reduce((max, p) => Math.max(max, p.id), 0) + 1;

  const app = express();
  app.use(cors()); // permite que la app Ionic (localhost:8100) llame a la API
  app.use(express.json());

  // GET /peliculas → lista todas las películas
  app.get('/peliculas', (req, res) => {
    res.json(peliculas);
  });

  // POST /peliculas → crea una película
  app.post('/peliculas', (req, res) => {
    const errores = validarPelicula(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ error: 'Datos inválidos', detalles: errores });
    }

    const nueva = {
      id: siguienteId++,
      titulo: req.body.titulo.trim(),
      anio: req.body.anio,
      genero: req.body.genero?.trim() || 'Sin género',
    };
    peliculas.push(nueva);
    res.status(201).location(`/peliculas/${nueva.id}`).json(nueva);
  });

  // Cualquier otra ruta → 404 en JSON
  app.use((req, res) => {
    res.status(404).json({ error: `No existe ${req.method} ${req.path}` });
  });

  // JSON mal formado u otro error → respuesta en JSON, nunca HTML
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'El cuerpo no es un JSON válido' });
    }
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  });

  return app;
}

function validarPelicula(body) {
  const errores = [];
  const anioMaximo = new Date().getFullYear() + 1;

  if (typeof body?.titulo !== 'string' || body.titulo.trim() === '') {
    errores.push('titulo es obligatorio');
  }
  if (!Number.isInteger(body?.anio) || body.anio < ANIO_MINIMO || body.anio > anioMaximo) {
    errores.push(`anio debe ser un entero entre ${ANIO_MINIMO} y ${anioMaximo}`);
  }
  if (body?.genero !== undefined && typeof body.genero !== 'string') {
    errores.push('genero debe ser texto');
  }
  return errores;
}
