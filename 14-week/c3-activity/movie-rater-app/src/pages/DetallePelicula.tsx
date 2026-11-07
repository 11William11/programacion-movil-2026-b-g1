import { useParams } from 'react-router-dom';
import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import AvisoConexion from '../components/AvisoConexion';
import EstadoError from '../components/EstadoError';
import { useRecurso } from '../hooks/useRecurso';
import { obtenerPelicula } from '../services/peliculasApi';

const DetallePelicula: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { estado, recargar } = useRecurso(() => obtenerPelicula(id), [id]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/peliculas" text="Películas" />
          </IonButtons>
          <IonTitle>Detalle</IonTitle>
        </IonToolbar>
        <AvisoConexion />
      </IonHeader>

      <IonContent className="ion-padding">
        {estado.tipo === 'cargando' && (
          <IonCard aria-busy="true" aria-label="Cargando la película">
            <IonCardHeader>
              <IonSkeletonText animated style={{ width: '30%' }} />
              <IonSkeletonText animated style={{ width: '70%', height: '1.6rem' }} />
            </IonCardHeader>
            <IonCardContent>
              <IonSkeletonText animated style={{ width: '45%' }} />
            </IonCardContent>
          </IonCard>
        )}

        {estado.tipo === 'error' && (
          <EstadoError
            mensaje={estado.mensaje}
            sinConexion={estado.sinConexion}
            onReintentar={() => void recargar()}
          />
        )}

        {estado.tipo === 'datos' && (
          <IonCard>
            <IonCardHeader>
              <IonCardSubtitle>{estado.datos.genero}</IonCardSubtitle>
              <IonCardTitle>{estado.datos.titulo}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>Estrenada en {estado.datos.anio}</IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default DetallePelicula;
