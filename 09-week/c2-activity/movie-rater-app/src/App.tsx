import { Navigate, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import ListaPeliculas from './pages/ListaPeliculas';
import NuevaPelicula from './pages/NuevaPelicula';
import DetallePelicula from './pages/DetallePelicula';

/* CSS base de Ionic */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/peliculas" element={<ListaPeliculas />} />
        <Route path="/peliculas/nueva" element={<NuevaPelicula />} />
        <Route path="/peliculas/:id" element={<DetallePelicula />} />
        <Route path="/" element={<Navigate to="/peliculas" replace />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
