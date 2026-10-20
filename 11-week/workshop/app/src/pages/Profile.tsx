import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonSpinner,
  IonTextarea,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  actualizarResena,
  eliminarResena,
  obtenerResenas,
} from '../services/api';

import { getMovie, Movie } from '../services/tmdb';

import './Profile.css';

interface ResenaConPelicula {
  id: number;
  pelicula_id_tmdb: number;
  calificacion: number;
  texto: string | null;
  movie?: Movie;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [resenas, setResenas] = useState<ResenaConPelicula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem('token');
      const usuarioGuardado = localStorage.getItem('usuario');

      if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado);
        setNombre(usuario.nombre);
        setCorreo(usuario.correo);
      }

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const reviews = await obtenerResenas(token);

        const reviewsWithMovies = await Promise.all(
          reviews.map(async (resena) => {
            try {
              const movie = await getMovie(resena.pelicula_id_tmdb);

              return {
                ...resena,
                movie,
              };
            } catch {
              return resena;
            }
          })
        );

        setResenas(reviewsWithMovies);
      } catch (err) {
        console.error('Error cargando reseñas:', err);
        setError('No se pudieron cargar tus reseñas.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleEdit = (resena: ResenaConPelicula) => {
    setEditingId(resena.id);
    setEditRating(resena.calificacion);
    setEditText(resena.texto ?? '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditRating(0);
    setEditText('');
  };

  const handleUpdate = async (id: number) => {
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    if (editRating === 0) {
      return;
    }

    try {
      const updated = await actualizarResena(
        id,
        editRating,
        editText,
        token
      );

      setResenas((current) =>
        current.map((resena) =>
          resena.id === id
            ? {
                ...resena,
                calificacion: updated.calificacion,
                texto: updated.texto,
              }
            : resena
        )
      );

      handleCancelEdit();
    } catch (err) {
      console.error('Error actualizando reseña:', err);
      setError('No se pudo actualizar la reseña.');
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    try {
      await eliminarResena(id, token);

      setResenas((current) =>
        current.filter((resena) => resena.id !== id)
      );
    } catch (err) {
      console.error('Error eliminando reseña:', err);
      setError('No se pudo eliminar la reseña.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    navigate('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>

          <IonTitle>Mi perfil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonText>
        <div className="profile-container">
          <IonCard>
            <IonCardContent>
              <h1>{nombre || 'Usuario'}</h1>

              <p>
                <strong>Correo:</strong>{' '}
                {correo || 'No disponible'}
              </p>

              <IonButton
                fill="outline"
                onClick={handleLogout}
              >
                Cerrar sesión
              </IonButton>
            </IonCardContent>
          </IonCard>

          <h2>Mis reseñas</h2>

          {loading && (
            <div className="profile-loading">
              <IonSpinner />
              <p>Cargando reseñas...</p>
            </div>
          )}

          {error && (
            <p className="profile-error">
              {error}
            </p>
          )}

          {!loading && !localStorage.getItem('token') && (
            <IonCard>
              <IonCardContent>
                <p>
                  Inicia sesión para ver tus reseñas.
                </p>

                <IonButton
                  expand="block"
                  onClick={() => navigate('/login')}
                >
                  Iniciar sesión
                </IonButton>
              </IonCardContent>
            </IonCard>
          )}

          {!loading &&
            localStorage.getItem('token') &&
            resenas.length === 0 && (
              <IonCard>
                <IonCardContent>
                  <p>
                    Todavía no tienes reseñas.
                  </p>
                </IonCardContent>
              </IonCard>
            )}

          {resenas.map((resena) => (
            <IonCard key={resena.id}>
              <IonCardContent>
                <h3>
                  {resena.movie?.title ||
                    `Película #${resena.pelicula_id_tmdb}`}
                </h3>

                {editingId === resena.id ? (
                  <>
                    <h4>Editar calificación</h4>

                    <div className="rating-buttons">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <IonButton
                          key={value}
                          fill={
                            editRating === value
                              ? 'solid'
                              : 'outline'
                          }
                          onClick={() =>
                            setEditRating(value)
                          }
                        >
                          {value} ⭐
                        </IonButton>
                      ))}
                    </div>

                    <IonItem>
                      <IonLabel position="stacked">
                        Editar reseña
                      </IonLabel>

                      <IonTextarea
                        value={editText}
                        autoGrow
                        onIonInput={(event) =>
                          setEditText(
                            event.detail.value ?? ''
                          )
                        }
                      />
                    </IonItem>

                    <IonButton
                      onClick={() =>
                        handleUpdate(resena.id)
                      }
                    >
                      Guardar cambios
                    </IonButton>

                    <IonButton
                      fill="clear"
                      onClick={handleCancelEdit}
                    >
                      Cancelar
                    </IonButton>
                  </>
                ) : (
                  <>
                    <p>
                      {'⭐'.repeat(resena.calificacion)}
                    </p>

                    <p>
                      {resena.texto ||
                        'Sin comentario escrito.'}
                    </p>

                    <IonButton
                      fill="outline"
                      onClick={() => handleEdit(resena)}
                    >
                      Editar
                    </IonButton>

                    <IonButton
                      color="danger"
                      fill="outline"
                      onClick={() =>
                        handleDelete(resena.id)
                      }
                    >
                      Eliminar
                    </IonButton>
                  </>
                )}
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonText>
    </IonPage>
  );
};

export default Profile;