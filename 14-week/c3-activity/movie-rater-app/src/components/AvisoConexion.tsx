import { IonIcon } from '@ionic/react';
import { cloudOfflineOutline } from 'ionicons/icons';
import { useConexion } from '../hooks/useConexion';

/** Franja bajo el encabezado que aparece sola cuando el dispositivo pierde la red. */
const AvisoConexion: React.FC = () => {
  const conectado = useConexion();
  if (conectado) return null;

  return (
    <div className="aviso-conexion" role="status">
      <IonIcon icon={cloudOfflineOutline} aria-hidden="true" />
      Sin conexión. Se mostrará la información nueva cuando vuelva la red.
    </div>
  );
};

export default AvisoConexion;
