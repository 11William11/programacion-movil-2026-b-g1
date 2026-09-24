// Demo del cliente: node src/cliente/demo.js (con la API corriendo en el puerto 3000)
import { listarPeliculas, crearPelicula, ApiError } from './peliculasApi.js';

async function main() {
  console.log('1) Listar películas');
  const peliculas = await listarPeliculas();
  peliculas.forEach((p) => console.log(`   #${p.id} ${p.titulo} (${p.anio}) · ${p.genero}`));

  console.log('\n2) Crear una película válida');
  const creada = await crearPelicula({ titulo: 'Relatos salvajes', anio: 2014, genero: 'Comedia negra' });
  console.log('   Creada:', JSON.stringify(creada));

  console.log('\n3) Crear una película inválida (sin título, año 1500)');
  try {
    await crearPelicula({ titulo: '', anio: 1500 });
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    console.log(`   ApiError ${error.status}: ${error.message}`);
    error.detalles.forEach((d) => console.log(`   - ${d}`));
  }

  console.log('\n4) Llamar a un servidor apagado (puerto 3999)');
  try {
    await listarPeliculas('http://localhost:3999');
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    console.log(`   ApiError (status ${error.status}): ${error.message}`);
  }

  console.log('\n5) Listar otra vez: ahora hay', (await listarPeliculas()).length, 'películas');
}

main();
