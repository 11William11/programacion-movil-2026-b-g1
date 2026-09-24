import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Saludo from '../components/Saludo';

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

        <Saludo nombre="William" />
      </IonContent>
    </IonPage>
  );
};

export default Home;
