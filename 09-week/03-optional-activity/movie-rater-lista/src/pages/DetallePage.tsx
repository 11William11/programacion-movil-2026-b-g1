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
import { peliculas } from '../data/peliculas';

const DetallePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const pelicula = peliculas.find((p) => p.id === Number(id));

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/lista" />
          </IonButtons>
          <IonTitle>Detalle</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {pelicula ? (
          <IonCard>
            <IonCardHeader>
              <IonCardSubtitle>{pelicula.genero}</IonCardSubtitle>
              <IonCardTitle>{pelicula.titulo}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>Estrenada en {pelicula.anio}</IonCardContent>
          </IonCard>
        ) : (
          <p>No existe la película {id}</p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default DetallePage;
