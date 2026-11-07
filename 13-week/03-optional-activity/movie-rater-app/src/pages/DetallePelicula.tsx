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
  useIonRouter,
} from '@ionic/react';
import { obtenerPelicula, Pelicula, SesionRequeridaError } from '../services/peliculasApi';

const DetallePelicula: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pelicula, setPelicula] = useState<Pelicula | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useIonRouter();

  useEffect(() => {
    if (!id) return;
    setPelicula(null);
    setError(null);
    obtenerPelicula(id)
      .then(setPelicula)
      .catch((e: Error) => {
        if (e instanceof SesionRequeridaError) {
          router.push(e.vencida ? '/login?motivo=expirada' : '/login', 'root', 'replace');
        } else {
          setError(e.message); // 404 si no existe, sin red o servidor caído
        }
      });
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
