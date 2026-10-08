import { useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { listarPeliculas, Pelicula } from '../services/peliculasApi';

const ListaPeliculas: React.FC = () => {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Ionic mantiene la página montada al navegar: cargar cada vez que se vuelve a mostrar
  // asegura que aparezca la película recién creada.
  useIonViewWillEnter(() => {
    setError(null);
    listarPeliculas()
      .then(setPeliculas)
      .catch((e: Error) => setError(e.message));
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Movie Rater</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/peliculas/nueva">Nueva</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {error && <p className="ion-text-center ion-padding">{error}</p>}

        <IonList>
          {peliculas.map((p) => (
            <IonItem key={p.id} routerLink={`/peliculas/${p.id}`}>
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

export default ListaPeliculas;
