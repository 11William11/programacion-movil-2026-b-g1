import { Navigate, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Login from './pages/Login';
import Tabs from './pages/Tabs';

/* CSS base de Ionic */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';
/* Modo oscuro según la preferencia del sistema */
import '@ionic/react/css/palettes/dark.system.css';
import './theme/estilos.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/login" element={<Login />} />
        {/* Si no hay sesión, la primera petición de la lista lleva al login */}
        <Route path="/tabs/*" element={<Tabs />} />
        <Route path="/" element={<Navigate to="/tabs/peliculas" replace />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
