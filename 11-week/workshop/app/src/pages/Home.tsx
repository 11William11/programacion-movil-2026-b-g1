import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonImg,
  IonText,
  IonButton,
  IonIcon,
} from '@ionic/react';

import { useState } from 'react';
import { cloudOfflineOutline, filmOutline } from 'ionicons/icons';
import { searchMovies, Movie } from '../services/tmdb';
import MovieListSkeleton from '../components/MovieListSkeleton';
import './Home.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const Home: React.FC = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadMovies = async (value: string) => {
    if (!value.trim()) {
      setMovies([]);
      setError('');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMovies(await searchMovies(value));
    } catch (err) {
      console.error('Error buscando películas:', err);
      setError('No se pudieron cargar las películas. Revisa tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setQuery(value);
    loadMovies(value);
  };

  const showEmpty = !loading && !error && query.trim() !== '' && movies.length === 0;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Movie Rater</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="home-content">
        <div className="home-container">
          <IonText>
            <h1>Encuentra una película</h1>
            <p>
              Busca una película para verla y calificarla.
            </p>
          </IonText>

          <IonSearchbar
            value={query}
            placeholder="Buscar película..."
            animated={true}
            onIonInput={(event) => {
              const value = event.detail.value ?? '';
              handleSearch(value);
            }}
          />

          {loading && <MovieListSkeleton filas={3} />}

          {!loading && error && (
            <div className="home-state" role="alert">
              <IonIcon icon={cloudOfflineOutline} aria-hidden="true" />
              <p>{error}</p>
              <IonButton onClick={() => loadMovies(query)}>
                Reintentar
              </IonButton>
            </div>
          )}

          {showEmpty && (
            <div className="home-state">
              <IonIcon icon={filmOutline} aria-hidden="true" />
              <p>No encontramos películas para «{query}».</p>
              <IonButton fill="outline" onClick={() => handleSearch('')}>
                Limpiar búsqueda
              </IonButton>
            </div>
          )}

          {!loading && !error && (
            <div className="movie-list">
              {movies.map((movie) => (
                <IonCard
                  key={movie.id}
                  button
                  routerLink={`/movie/${movie.id}`}
                >
                  {movie.poster_path && (
                    <IonImg
                      src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                      alt={`Póster de ${movie.title}`}
                    />
                  )}

                  <IonCardHeader>
                    <IonCardTitle>
                      {movie.title}
                    </IonCardTitle>
                  </IonCardHeader>

                  <IonCardContent>
                    <p>
                      {movie.release_date || 'Fecha desconocida'}
                    </p>

                    <p>
                      ⭐ {movie.vote_average.toFixed(1)}
                    </p>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
