import { useState } from 'react';
import {
  IonButton,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { checkmarkCircle, closeCircle, helpCircle, locateOutline } from 'ionicons/icons';
import EstadoError from '../components/EstadoError';
import {
  EstadoPermiso,
  estadoPermiso,
  obtenerUbicacion,
  PermisoDenegadoError,
  Ubicacion,
} from '../services/ubicacion';

type Estado =
  | { tipo: 'inicial' }
  | { tipo: 'cargando' }
  | { tipo: 'datos'; ubicacion: Ubicacion }
  | { tipo: 'negado' }
  | { tipo: 'error'; mensaje: string };

const CHIP_PERMISO: Record<EstadoPermiso, { texto: string; color: string; icono: string }> = {
  concedido: { texto: 'Permiso de ubicación: concedido', color: 'success', icono: checkmarkCircle },
  negado: { texto: 'Permiso de ubicación: negado', color: 'danger', icono: closeCircle },
  'sin-pedir': { texto: 'Permiso de ubicación: aún no se ha pedido', color: 'medium', icono: helpCircle },
  desconocido: { texto: 'Permiso de ubicación: se pedirá al usarla', color: 'medium', icono: helpCircle },
};

const MiUbicacion: React.FC = () => {
  const [estado, setEstado] = useState<Estado>({ tipo: 'inicial' });
  const [permiso, setPermiso] = useState<EstadoPermiso>('desconocido');

  const revisarPermiso = () => void estadoPermiso().then(setPermiso);
  // El usuario puede cambiar el permiso en los ajustes y volver: se revisa cada vez que entra
  useIonViewWillEnter(revisarPermiso);

  const pedirUbicacion = () => {
    setEstado({ tipo: 'cargando' });
    obtenerUbicacion()
      .then((ubicacion) => setEstado({ tipo: 'datos', ubicacion }))
      .catch((e: Error) =>
        setEstado(e instanceof PermisoDenegadoError ? { tipo: 'negado' } : { tipo: 'error', mensaje: e.message }),
      )
      .finally(revisarPermiso);
  };

  const chip = CHIP_PERMISO[permiso];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mi ubicación</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonChip className="permiso" color={chip.color} outline>
          <IonIcon icon={chip.icono} aria-hidden="true" />
          <IonLabel>{chip.texto}</IonLabel>
        </IonChip>

        <p>
          Usa el GPS del dispositivo (plugin <code>@capacitor/geolocation</code>) para mostrar tu latitud
          y longitud. La app solo pide el permiso cuando tocas el botón.
        </p>

        <IonButton expand="block" onClick={pedirUbicacion} disabled={estado.tipo === 'cargando'}>
          {estado.tipo === 'cargando' ? (
            <IonSpinner name="crescent" aria-label="Obteniendo la ubicación" />
          ) : (
            <>
              <IonIcon slot="start" icon={locateOutline} aria-hidden="true" />
              Obtener mi ubicación
            </>
          )}
        </IonButton>

        {estado.tipo === 'datos' && (
          <IonList aria-live="polite">
            <IonItem>
              <IonLabel>Latitud</IonLabel>
              <IonText slot="end" className="valor">{estado.ubicacion.latitud.toFixed(6)}</IonText>
            </IonItem>
            <IonItem>
              <IonLabel>Longitud</IonLabel>
              <IonText slot="end" className="valor">{estado.ubicacion.longitud.toFixed(6)}</IonText>
            </IonItem>
            <IonItem>
              <IonLabel>Precisión</IonLabel>
              <IonText slot="end" className="valor">{Math.round(estado.ubicacion.precision)} m</IonText>
            </IonItem>
          </IonList>
        )}

        {estado.tipo === 'negado' && (
          <IonText color="danger">
            <div role="alert">
              <h2>Permiso de ubicación denegado</h2>
              <p>
                La app no puede mostrar tu ubicación sin ese permiso. Actívalo en los ajustes del
                teléfono (o del navegador, en el icono junto a la dirección) y vuelve a intentarlo.
              </p>
            </div>
          </IonText>
        )}

        {estado.tipo === 'error' && (
          <EstadoError mensaje={estado.mensaje} onReintentar={pedirUbicacion} />
        )}
      </IonContent>
    </IonPage>
  );
};

export default MiUbicacion;
