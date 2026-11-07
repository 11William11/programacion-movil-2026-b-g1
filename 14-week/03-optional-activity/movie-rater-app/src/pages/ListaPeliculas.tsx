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
  useIonRouter,
  useIonViewWillEnter,
} from '@ionic/react';
import {
  cerrarSesion,
  listarPeliculas,
  Pelicula,
  SesionRequeridaError,
} from '../services/peliculasApi';

const ListaPeliculas: React.FC = () => {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useIonRouter();

  // Ionic mantiene la página montada al navegar: cargar cada vez que se vuelve a mostrar
  // asegura que aparezca la película recién creada.
  useIonViewWillEnter(() => {
    setError(null);
    listarPeliculas()
      .then(setPeliculas)
      .catch((e: Error) => {
        // Sin token o 401: volver al login (con aviso si la sesión venció)
        if (e instanceof SesionRequeridaError) {
          router.push(e.vencida ? '/login?motivo=expirada' : '/login', 'root', 'replace');
        } else {
          setError(e.message); // sin red o servidor caído
        }
      });
  });

  async function salir() {
    await cerrarSesion();
    router.push('/login', 'root', 'replace');
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Movie Rater</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/ubicacion">Ubicación</IonButton>
            <IonButton routerLink="/peliculas/nueva">Nueva</IonButton>
            <IonButton onClick={salir}>Salir</IonButton>
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
