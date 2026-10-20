const API_URL = 'http://localhost:3000/api';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
}

export interface AuthResponse {
  usuario: Usuario;
  token: string;
}

export interface Resena {
  id: number;
  usuario_id: number;
  pelicula_id_tmdb: number;
  calificacion: number;
  texto: string | null;
}

export const registrarUsuario = async (
  nombre: string,
  correo: string,
  contrasena: string
): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/registro`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nombre,
      correo,
      contrasena,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al registrar usuario');
  }

  return data;
};

export const iniciarSesion = async (
  correo: string,
  contrasena: string
): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      correo,
      contrasena,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al iniciar sesión');
  }

  return data;
};

export const crearResena = async (
  peliculaId: number,
  calificacion: number,
  texto: string,
  token: string
): Promise<Resena> => {
  const response = await fetch(`${API_URL}/resenas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      pelicula_id_tmdb: peliculaId,
      calificacion,
      texto,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al guardar la reseña');
  }

  return data;
};

export const obtenerResenas = async (
  token: string
): Promise<Resena[]> => {
  const response = await fetch(`${API_URL}/resenas`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al obtener las reseñas');
  }

  return data;
};

export const actualizarResena = async (
  id: number,
  calificacion: number,
  texto: string,
  token: string
): Promise<Resena> => {
  const response = await fetch(`${API_URL}/resenas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      calificacion,
      texto,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al actualizar la reseña');
  }

  return data;
};

export const eliminarResena = async (
  id: number,
  token: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/resenas/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // El backend responde 204 (sin cuerpo) al eliminar; solo los errores traen JSON.
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Error al eliminar la reseña');
  }
};
