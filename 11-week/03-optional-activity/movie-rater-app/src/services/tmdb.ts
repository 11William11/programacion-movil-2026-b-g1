const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';


export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
}

interface MovieSearchResponse {
  results: Movie[];
  total_results: number;
  total_pages: number;
}

// Para probar los estados de la lista: /tabs/buscar?retraso=3000 o /tabs/buscar?falla=1
const simulateNetwork = async () => {
  const params = new URLSearchParams(window.location.search);
  const delay = Number(params.get('retraso') ?? 0);

  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  if (params.get('falla') === '1') {
    throw new Error('Falla simulada');
  }
};

export const searchMovies = async (
  query: string
): Promise<Movie[]> => {
  if (!query.trim()) {
    return [];
  }

  await simulateNetwork();

  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error('Error al buscar películas');
  }

  const data: MovieSearchResponse = await response.json();

  return data.results;
};

export const getMovie = async (
  id: number
): Promise<Movie> => {
  const response = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES`
  );

  if (!response.ok) {
    throw new Error('Error al obtener la película');
  }

    return response.json();
};
