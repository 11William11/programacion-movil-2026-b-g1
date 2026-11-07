import { useState } from 'react';
import {
  IonBackButton,
  IonButton,
  IonButtons,
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
import AvisoConexion from '../components/AvisoConexion';
import { useIrAlLogin } from '../hooks/useIrAlLogin';
import { crearPelicula } from '../services/peliculasApi';

const ANIO_MINIMO = 1888; // la misma regla que valida la API

const NuevaPelicula: React.FC = () => {
  const router = useIonRouter();
  const irAlLogin = useIrAlLogin();
  const [titulo, setTitulo] = useState('');
  const [anio, setAnio] = useState('');
  const [genero, setGenero] = useState('');
  const [errores, setErrores] = useState<{ titulo?: string; anio?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Se valida antes de enviar para no gastar una petición en datos que la API rechazaría
  function validar() {
    const nuevos: typeof errores = {};
    const anioMaximo = new Date().getFullYear() + 1;
    const numero = Number(anio);
    if (!titulo.trim()) nuevos.titulo = 'Escribe el título.';
    if (!Number.isInteger(numero) || numero < ANIO_MINIMO || numero > anioMaximo) {
      nuevos.anio = `Escribe un año entre ${ANIO_MINIMO} y ${anioMaximo}.`;
    }
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }

  async function guardar(evento: React.FormEvent) {
    evento.preventDefault();
    setError(null);
    if (!validar()) return;

    setGuardando(true);
    try {
      await crearPelicula({ titulo: titulo.trim(), anio: Number(anio), genero: genero.trim() });
      setTitulo('');
      setAnio('');
      setGenero('');
      router.goBack(); // vuelve a la lista, que se recarga sola
    } catch (e) {
      if (!irAlLogin(e)) setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/peliculas" text="Películas" />
          </IonButtons>
          <IonTitle>Nueva película</IonTitle>
        </IonToolbar>
        <AvisoConexion />
      </IonHeader>

      <IonContent className="ion-padding">
        <form onSubmit={guardar} noValidate>
          <IonInput
            label="Título"
            labelPlacement="stacked"
            fill="outline"
            value={titulo}
            errorText={errores.titulo}
            className={errores.titulo ? 'ion-invalid ion-touched' : undefined}
            onIonInput={(e) => setTitulo(e.detail.value ?? '')}
          />
          <IonInput
            label="Año"
            labelPlacement="stacked"
            fill="outline"
            type="number"
            inputmode="numeric"
            value={anio}
            errorText={errores.anio}
            className={`ion-margin-top${errores.anio ? ' ion-invalid ion-touched' : ''}`}
            onIonInput={(e) => setAnio(e.detail.value ?? '')}
          />
          <IonInput
            className="ion-margin-top"
            label="Género (opcional)"
            labelPlacement="stacked"
            fill="outline"
            value={genero}
            onIonInput={(e) => setGenero(e.detail.value ?? '')}
          />

          {error && (
            <IonText color="danger">
              <p role="alert">{error}</p>
            </IonText>
          )}

          <IonButton className="ion-margin-top" type="submit" expand="block" disabled={guardando}>
            {guardando ? <IonSpinner name="crescent" aria-label="Guardando" /> : 'Guardar'}
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default NuevaPelicula;
