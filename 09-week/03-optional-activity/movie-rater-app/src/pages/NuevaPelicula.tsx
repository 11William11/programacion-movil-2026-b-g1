import { useState } from 'react';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { crearPelicula } from '../services/peliculasApi';

const NuevaPelicula: React.FC = () => {
  const router = useIonRouter();
  const [titulo, setTitulo] = useState('');
  const [anio, setAnio] = useState('');
  const [genero, setGenero] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function guardar(evento: React.FormEvent) {
    evento.preventDefault();
    setError(null);
    try {
      await crearPelicula({ titulo, anio: Number(anio), genero });
      setTitulo('');
      setAnio('');
      setGenero('');
      router.goBack(); // vuelve a la lista, que se recarga sola
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/peliculas" />
          </IonButtons>
          <IonTitle>Nueva película</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={guardar}>
          <IonInput
            label="Título"
            labelPlacement="stacked"
            fill="outline"
            value={titulo}
            onIonInput={(e) => setTitulo(e.detail.value ?? '')}
          />
          <IonInput
            className="ion-margin-top"
            label="Año"
            labelPlacement="stacked"
            fill="outline"
            type="number"
            value={anio}
            onIonInput={(e) => setAnio(e.detail.value ?? '')}
          />
          <IonInput
            className="ion-margin-top"
            label="Género (opcional)"
            labelPlacement="stacked"
            fill="outline"
            value={genero}
            onIonInput={(e) => setGenero(e.detail.value ?? '')}
          />

          {error && (
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
          )}

          <IonButton className="ion-margin-top" type="submit" expand="block">
            Guardar
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default NuevaPelicula;
