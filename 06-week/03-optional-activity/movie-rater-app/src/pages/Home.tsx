import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { filmOutline } from 'ionicons/icons';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Movie Rater</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Movie Rater</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonCard className="welcome-card">
          <IonCardHeader>
            <IonIcon icon={filmOutline} className="welcome-icon" aria-hidden="true" />
            <IonCardSubtitle>Mi primer proyecto Ionic React</IonCardSubtitle>
            <IonCardTitle>¡Bienvenido a Movie Rater!</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Busca películas, califícalas de 1 a 5 estrellas, escribe reseñas cortas y
            arma tu lista de películas por ver.
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;
