import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iniciarSesion } from '../services/api';
import './Auth.css';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!correo || !contrasena) {
      setError('Completa todos los campos.');
      return;
    }

    try {
      setError('');

      const data = await iniciarSesion(correo, contrasena);

      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      navigate('/home');
    } catch (err) {
      console.error('Error iniciando sesión:', err);
      setError('Correo o contraseña incorrectos.');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Movie Rater</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="auth-container">
          <h1>Iniciar sesión</h1>

          <IonItem>
            <IonLabel position="stacked">
              Correo
            </IonLabel>

            <IonInput
              type="email"
              value={correo}
              placeholder="correo@ejemplo.com"
              onIonInput={(event) =>
                setCorreo(event.detail.value ?? '')
              }
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">
              Contraseña
            </IonLabel>

            <IonInput
              type="password"
              value={contrasena}
              placeholder="Tu contraseña"
              onIonInput={(event) =>
                setContrasena(event.detail.value ?? '')
              }
            />
          </IonItem>

          {error && (
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
          )}

          <IonButton
            expand="block"
            onClick={handleLogin}
          >
            Iniciar sesión
          </IonButton>

          <IonButton
            expand="block"
            fill="clear"
            onClick={() => navigate('/register')}
          >
            Crear una cuenta
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;