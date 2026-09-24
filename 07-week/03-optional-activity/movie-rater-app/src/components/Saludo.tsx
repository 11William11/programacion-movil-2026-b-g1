import { useState } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
} from '@ionic/react';
import { handLeftOutline } from 'ionicons/icons';

interface SaludoProps {
  /** Nombre de la persona a saludar. */
  nombre: string;
}

/** Tarjeta que muestra un nombre y un botón que activa o desactiva el saludo. */
const Saludo: React.FC<SaludoProps> = ({ nombre }) => {
  const [saludado, setSaludado] = useState(false);

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardSubtitle>Componente Saludo</IonCardSubtitle>
        <IonCardTitle>{nombre}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p className="saludo-mensaje" aria-live="polite">
          {saludado
            ? `¡Hola, ${nombre}! Bienvenido a Movie Rater 🎬`
            : 'Toca el botón para saludar.'}
        </p>
        <IonButton expand="block" onClick={() => setSaludado(!saludado)}>
          <IonIcon slot="start" icon={handLeftOutline} aria-hidden="true" />
          {saludado ? 'Ocultar saludo' : 'Saludar'}
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default Saludo;
