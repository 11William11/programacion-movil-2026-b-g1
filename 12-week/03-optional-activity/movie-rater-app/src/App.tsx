import { Navigate, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import ListaPeliculas from './pages/ListaPeliculas';
import NuevaPelicula from './pages/NuevaPelicula';
import DetallePelicula from './pages/DetallePelicula';
import MiUbicacion from './pages/MiUbicacion';

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
    {/* basename: en GitHub Pages la app vive en /programacion-movil-2026-b-g1/ */}
    <IonReactRouter basename={import.meta.env.BASE_URL}>
      <IonRouterOutlet>
        <Route path="/peliculas" element={<ListaPeliculas />} />
        <Route path="/peliculas/nueva" element={<NuevaPelicula />} />
        <Route path="/peliculas/:id" element={<DetallePelicula />} />
        <Route path="/ubicacion" element={<MiUbicacion />} />
        <Route path="/" element={<Navigate to="/peliculas" replace />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
