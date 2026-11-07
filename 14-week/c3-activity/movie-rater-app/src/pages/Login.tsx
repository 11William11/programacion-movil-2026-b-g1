import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { iniciarSesion } from '../services/peliculasApi';

const Login: React.FC = () => {
  const router = useIonRouter();
  const location = useLocation();
  // Las pantallas mandan ?motivo=expirada cuando la API respondió 401
  const sesionExpirada = new URLSearchParams(location.search).get('motivo') === 'expirada';

  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function entrar(evento: React.FormEvent) {
    evento.preventDefault();
    if (!usuario.trim() || !contrasena) {
      setError('Escribe el usuario y la contraseña.');
      return;
    }
    setError(null);
    setCargando(true);
    try {
      await iniciarSesion(usuario.trim(), contrasena);
      setContrasena('');
      router.push('/tabs/peliculas', 'root', 'replace');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setCargando(false);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Movie Rater · Iniciar sesión</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {sesionExpirada && !error && (
          <IonText color="warning">
            <p>Tu sesión expiró. Inicia sesión de nuevo.</p>
          </IonText>
        )}

        <form onSubmit={entrar}>
          <IonInput
            label="Usuario"
            labelPlacement="stacked"
            fill="outline"
            autocomplete="username"
            value={usuario}
            onIonInput={(e) => setUsuario(e.detail.value ?? '')}
          />
          <IonInput
            className="ion-margin-top"
            label="Contraseña"
            labelPlacement="stacked"
            fill="outline"
            type="password"
            autocomplete="current-password"
            value={contrasena}
            onIonInput={(e) => setContrasena(e.detail.value ?? '')}
          />

          {error && (
            <IonText color="danger">
              <p role="alert">{error}</p>
            </IonText>
          )}

          <IonButton className="ion-margin-top" type="submit" expand="block" disabled={cargando}>
            {cargando ? <IonSpinner name="crescent" /> : 'Ingresar'}
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Login;
