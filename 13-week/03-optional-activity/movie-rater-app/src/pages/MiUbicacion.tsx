import { useState } from 'react';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { obtenerUbicacion, PermisoDenegadoError, Ubicacion } from '../services/ubicacion';

const MiUbicacion: React.FC = () => {
  const [cargando, setCargando] = useState(false);
  const [ubicacion, setUbicacion] = useState<Ubicacion | null>(null);
  const [denegado, setDenegado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pedirUbicacion = () => {
    setCargando(true);
    setUbicacion(null);
    setDenegado(false);
    setError(null);
    obtenerUbicacion()
      .then(setUbicacion)
      .catch((e: Error) => {
        if (e instanceof PermisoDenegadoError) setDenegado(true);
        else setError(e.message);
      })
      .finally(() => setCargando(false));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/peliculas" />
          </IonButtons>
          <IonTitle>Mi ubicación</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p>Usa el GPS del dispositivo para mostrar tu latitud y longitud.</p>

        <IonButton expand="block" onClick={pedirUbicacion} disabled={cargando}>
          {cargando ? <IonSpinner name="crescent" /> : 'Obtener mi ubicación'}
        </IonButton>

        {ubicacion && (
          <IonList>
            <IonItem>
              <IonLabel>Latitud</IonLabel>
              <IonText slot="end">{ubicacion.latitud.toFixed(6)}</IonText>
            </IonItem>
            <IonItem>
              <IonLabel>Longitud</IonLabel>
              <IonText slot="end">{ubicacion.longitud.toFixed(6)}</IonText>
            </IonItem>
            <IonItem>
              <IonLabel>Precisión</IonLabel>
              <IonText slot="end">{Math.round(ubicacion.precision)} m</IonText>
            </IonItem>
          </IonList>
        )}

        {denegado && (
          <IonText color="danger">
            <h2>Permiso de ubicación denegado</h2>
            <p>
              La app no puede mostrar tu ubicación sin ese permiso. Actívalo en los ajustes del
              teléfono (o del navegador, en el candado junto a la dirección) y vuelve a intentarlo.
            </p>
          </IonText>
        )}

        {error && <p className="ion-text-center">{error}</p>}
      </IonContent>
    </IonPage>
  );
};

export default MiUbicacion;
