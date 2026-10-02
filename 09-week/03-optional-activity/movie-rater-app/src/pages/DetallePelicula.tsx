import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { obtenerPelicula, Pelicula } from '../services/peliculasApi';

const DetallePelicula: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pelicula, setPelicula] = useState<Pelicula | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setPelicula(null);
    setError(null);
    obtenerPelicula(id)
      .then(setPelicula)
      .catch((e: Error) => setError(e.message)); // 404 si no existe, o error de red
  }, [id]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/peliculas" />
          </IonButtons>
          <IonTitle>Detalle</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {error && <p className="ion-text-center">{error}</p>}

        {pelicula && (
          <IonCard>
            <IonCardHeader>
              <IonCardSubtitle>{pelicula.genero}</IonCardSubtitle>
              <IonCardTitle>{pelicula.titulo}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>Estrenada en {pelicula.anio}</IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default DetallePelicula;
