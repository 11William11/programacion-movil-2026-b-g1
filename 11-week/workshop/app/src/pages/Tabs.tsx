import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { Navigate, Route } from 'react-router-dom';
import { person, search } from 'ionicons/icons';
import Home from './Home';
import Profile from './Profile';

const Tabs: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route path="buscar" element={<Home />} />
      <Route path="perfil" element={<Profile />} />
      <Route index element={<Navigate to="buscar" replace />} />
    </IonRouterOutlet>

    <IonTabBar slot="bottom">
      <IonTabButton tab="buscar" href="/tabs/buscar">
        <IonIcon icon={search} aria-hidden="true" />
        <IonLabel>Buscar</IonLabel>
      </IonTabButton>

      <IonTabButton tab="perfil" href="/tabs/perfil">
        <IonIcon icon={person} aria-hidden="true" />
        <IonLabel>Mi perfil</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

export default Tabs;
