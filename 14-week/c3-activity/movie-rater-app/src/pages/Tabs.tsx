import { Navigate, Route } from 'react-router-dom';
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { filmOutline, locationOutline, personCircleOutline } from 'ionicons/icons';
import DetallePelicula from './DetallePelicula';
import ListaPeliculas from './ListaPeliculas';
import MiUbicacion from './MiUbicacion';
import NuevaPelicula from './NuevaPelicula';
import Perfil from './Perfil';

/**
 * Navegación principal con pestañas. "Nueva" y "Detalle" se abren encima de la lista,
 * sin ocultar la barra de pestañas, y su botón atrás vuelve a ella.
 */
const Tabs: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route path="peliculas" element={<ListaPeliculas />} />
      <Route path="peliculas/nueva" element={<NuevaPelicula />} />
      <Route path="peliculas/:id" element={<DetallePelicula />} />
      <Route path="ubicacion" element={<MiUbicacion />} />
      <Route path="perfil" element={<Perfil />} />
      <Route index element={<Navigate to="peliculas" replace />} />
    </IonRouterOutlet>

    <IonTabBar slot="bottom">
      <IonTabButton tab="peliculas" href="/tabs/peliculas">
        <IonIcon icon={filmOutline} aria-hidden="true" />
        <IonLabel>Películas</IonLabel>
      </IonTabButton>
      <IonTabButton tab="ubicacion" href="/tabs/ubicacion">
        <IonIcon icon={locationOutline} aria-hidden="true" />
        <IonLabel>Ubicación</IonLabel>
      </IonTabButton>
      <IonTabButton tab="perfil" href="/tabs/perfil">
        <IonIcon icon={personCircleOutline} aria-hidden="true" />
        <IonLabel>Perfil</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

export default Tabs;
