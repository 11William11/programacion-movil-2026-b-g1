import { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
  useIonViewWillEnter,
} from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import AvisoConexion from '../components/AvisoConexion';
import { useConexion } from '../hooks/useConexion';
import { cerrarSesion } from '../services/peliculasApi';
import { leerToken } from '../services/sesion';
import { DatosToken, decodificarToken } from '../services/token';

const formatoHora = new Intl.DateTimeFormat('es-CO', { hour: '2-digit', minute: '2-digit' });

const Perfil: React.FC = () => {
  const router = useIonRouter();
  const conectado = useConexion();
  const [sesion, setSesion] = useState<DatosToken | null>(null);

  useIonViewWillEnter(() => {
    void leerToken().then((token) => setSesion(token ? decodificarToken(token) : null));
  });

  async function salir() {
    await cerrarSesion();
    router.push('/login', 'root', 'replace');
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mi perfil</IonTitle>
        </IonToolbar>
        <AvisoConexion />
      </IonHeader>

      <IonContent>
        <IonList inset>
          <IonListHeader>
            <IonLabel>Sesión</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonLabel>Usuario</IonLabel>
            <IonNote slot="end">{sesion?.usuario ?? '—'}</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>La sesión vence a las</IonLabel>
            <IonNote slot="end" className="valor">
              {sesion ? formatoHora.format(sesion.venceEn) : '—'}
            </IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Red</IonLabel>
            <IonNote slot="end" color={conectado ? 'success' : 'danger'}>
              {conectado ? 'En línea' : 'Sin conexión'}
            </IonNote>
          </IonItem>
        </IonList>

        <div className="ion-padding">
          <IonButton expand="block" color="danger" fill="outline" onClick={salir}>
            <IonIcon slot="start" icon={logOutOutline} aria-hidden="true" />
            Cerrar sesión
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Perfil;
