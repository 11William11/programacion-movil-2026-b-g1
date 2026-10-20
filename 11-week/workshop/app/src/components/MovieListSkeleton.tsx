import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonSkeletonText,
} from '@ionic/react';

interface MovieListSkeletonProps {
  filas?: number;
}

/* Misma forma que la tarjeta de película de Home: póster, título, fecha y calificación */
const MovieListSkeleton: React.FC<MovieListSkeletonProps> = ({ filas = 3 }) => (
  <div aria-busy="true" aria-label="Buscando películas">
    {Array.from({ length: filas }, (_, index) => (
      <IonCard key={index}>
        <IonSkeletonText animated className="skeleton-poster" />

        <IonCardHeader>
          <IonSkeletonText animated className="skeleton-title" />
        </IonCardHeader>

        <IonCardContent>
          <IonSkeletonText animated className="skeleton-line" />
          <IonSkeletonText animated className="skeleton-line short" />
        </IonCardContent>
      </IonCard>
    ))}
  </div>
);

export default MovieListSkeleton;
