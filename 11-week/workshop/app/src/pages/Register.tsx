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
import { registrarUsuario } from '../services/api';
import './Auth.css';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!nombre || !correo || !contrasena || !confirmarContrasena) {
      setError('Completa todos los campos.');
      return;
    }

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setError('');

      const data = await registrarUsuario(
        nombre,
        correo,
        contrasena
      );

      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      navigate('/home');
   } catch (err) {
  console.error('Error registrando usuario:', err);

  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError('No se pudo crear la cuenta.');
  }
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
          <h1>Crear cuenta</h1>

          <IonItem>
            <IonLabel position="stacked">
              Nombre
            </IonLabel>

            <IonInput
              value={nombre}
              placeholder="Tu nombre"
              onIonInput={(event) =>
                setNombre(event.detail.value ?? '')
              }
            />
          </IonItem>

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

          <IonItem>
            <IonLabel position="stacked">
              Confirmar contraseña
            </IonLabel>

            <IonInput
              type="password"
              value={confirmarContrasena}
              placeholder="Repite tu contraseña"
              onIonInput={(event) =>
                setConfirmarContrasena(event.detail.value ?? '')
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
            onClick={handleRegister}
          >
            Registrarme
          </IonButton>

          <IonButton
            expand="block"
            fill="clear"
            onClick={() => navigate('/login')}
          >
            Ya tengo una cuenta
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;