import { IonButton, IonIcon, IonText } from '@ionic/react';
import { alertCircleOutline, cloudOfflineOutline, refreshOutline } from 'ionicons/icons';

interface Props {
  mensaje: string;
  sinConexion?: boolean;
  onReintentar: () => void;
}

/** Estado de error: qué pasó y un botón para volver a intentarlo. */
const EstadoError: React.FC<Props> = ({ mensaje, sinConexion = false, onReintentar }) => (
  <div className="estado" role="alert">
    <IonIcon
      className="estado-icono"
      icon={sinConexion ? cloudOfflineOutline : alertCircleOutline}
      color="medium"
      aria-hidden="true"
    />
    <IonText>
      <h2>{sinConexion ? 'Estás sin conexión' : 'Algo salió mal'}</h2>
      <p>{mensaje}</p>
    </IonText>
    <IonButton fill="outline" onClick={onReintentar}>
      <IonIcon slot="start" icon={refreshOutline} aria-hidden="true" />
      Reintentar
    </IonButton>
  </div>
);

export default EstadoError;
