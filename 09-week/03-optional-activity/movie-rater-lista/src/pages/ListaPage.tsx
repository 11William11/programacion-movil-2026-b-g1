import { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { peliculas } from '../data/peliculas';

const ListaPage: React.FC = () => {
  const [vistas, setVistas] = useState(0);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Movie Rater</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding">
          <p>Películas vistas: {vistas}</p>
          <IonButton onClick={() => setVistas((actual) => actual + 1)}>Marcar una vista</IonButton>
        </div>

        <IonList>
          {peliculas.map((p) => (
            <IonItem key={p.id} routerLink={`/pelicula/${p.id}`}>
              <IonLabel>
                <h2>{p.titulo}</h2>
                <p>{p.genero}</p>
              </IonLabel>
              <IonNote slot="end">{p.anio}</IonNote>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ListaPage;
