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

export const searchMovies = async (
  query: string
): Promise<Movie[]> => {
  if (!query.trim()) {
    return [];
  }

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
