import { useEffect, useRef } from 'react';
import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonTitle,
  IonToast,
  IonToolbar,
  RefresherEventDetail,
  useIonViewWillEnter,
} from '@ionic/react';
import { add, filmOutline } from 'ionicons/icons';
import AvisoConexion from '../components/AvisoConexion';
import EstadoError from '../components/EstadoError';
import ListaSkeleton from '../components/ListaSkeleton';
import { useConexion } from '../hooks/useConexion';
import { useRecurso } from '../hooks/useRecurso';
import { listarPeliculas } from '../services/peliculasApi';

const ListaPeliculas: React.FC = () => {
  // alMontar: false → la carga la hace useIonViewWillEnter, que también corre al volver
  // de "Nueva película" y así aparece la película recién creada
  const { estado, aviso, cerrarAviso, recargar } = useRecurso(listarPeliculas, [], {
    alMontar: false,
  });
  useIonViewWillEnter(() => void recargar());

  // Cuando vuelve la red, la lista se actualiza sola
  const conectado = useConexion();
  const estabaConectado = useRef(conectado);
  useEffect(() => {
    if (conectado && !estabaConectado.current) void recargar();
    estabaConectado.current = conectado;
  }, [conectado, recargar]);

  async function deslizarParaActualizar(evento: CustomEvent<RefresherEventDetail>) {
    await recargar();
    evento.detail.complete();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Películas</IonTitle>
        </IonToolbar>
        <AvisoConexion />
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={deslizarParaActualizar}>
          <IonRefresherContent pullingText="Desliza para actualizar" />
        </IonRefresher>

        {estado.tipo === 'cargando' && <ListaSkeleton />}

        {estado.tipo === 'error' && (
          <EstadoError
            mensaje={estado.mensaje}
            sinConexion={estado.sinConexion}
            onReintentar={() => void recargar()}
          />
        )}

        {estado.tipo === 'datos' && estado.datos.length === 0 && (
          <div className="estado">
            <IonIcon className="estado-icono" icon={filmOutline} color="medium" aria-hidden="true" />
            <IonText>
              <h2>Aún no hay películas</h2>
              <p>Agrega la primera con el botón +.</p>
            </IonText>
            <IonButton routerLink="/tabs/peliculas/nueva">Agregar película</IonButton>
          </div>
        )}

        {estado.tipo === 'datos' && estado.datos.length > 0 && (
          <IonList>
            {estado.datos.map((p) => (
              <IonItem key={p.id} routerLink={`/tabs/peliculas/${p.id}`} detail>
                <IonLabel>
                  <h2>{p.titulo}</h2>
                  <p>{p.genero}</p>
                </IonLabel>
                <IonNote slot="end">{p.anio}</IonNote>
              </IonItem>
            ))}
          </IonList>
        )}

        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton routerLink="/tabs/peliculas/nueva" aria-label="Nueva película">
            <IonIcon icon={add} aria-hidden="true" />
          </IonFabButton>
        </IonFab>

        {/* Si una recarga falla con datos en pantalla, los datos se quedan y el error va aquí */}
        <IonToast
          isOpen={aviso !== null}
          message={aviso ?? ''}
          duration={4000}
          color="dark"
          onDidDismiss={cerrarAviso}
        />
      </IonContent>
    </IonPage>
  );
};

export default ListaPeliculas;
