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
  IonSpinner,
  IonButton,
} from '@ionic/react';

import { useState } from 'react';
import { searchMovies, Movie } from '../services/tmdb';
import './Home.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const Home: React.FC = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (value: string) => {
    setQuery(value);

    if (!value.trim()) {
      setMovies([]);
      return;
    }

    try {
      setLoading(true);
      setError('');

      console.log('Buscando:', value);

      const results = await searchMovies(value);

      console.log('Resultados:', results);

      setMovies(results);
    } catch (err) {
      console.error('Error buscando películas:', err);
      setError('No se pudieron cargar las películas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Movie Rater</IonTitle>

           <IonButton
  slot="end"
  fill="clear"
  routerLink="/profile"
>
  Mi perfil
</IonButton>
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

          {loading && (
            <div className="loading">
              <IonSpinner />
              <p>Buscando películas...</p>
            </div>
          )}

          {error && (
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
          )}

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
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
