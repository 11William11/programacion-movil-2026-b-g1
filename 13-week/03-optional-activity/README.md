# Autenticación con token y conectividad · Movie Rater (Semana 13)

Actividad opcional de refuerzo · Programación Móvil · 2026-B
**Autor:** William Erney Collo Narvaez (`11William11`)

La app de películas de la [semana 12](../../12-week/03-optional-activity/) (Ionic React + Capacitor)
ahora pide **iniciar sesión**: obtiene un **JWT** de la API, lo guarda y lo envía en cada petición.
Si el token vence o no hay red, la app lo dice con mensajes claros.

| Carpeta | Qué es |
|---|---|
| [`movie-rater-api/`](movie-rater-api/) | API Express de la [semana 10](../../10-week/03-optional-activity/) + `POST /auth/login` y rutas de `/peliculas` protegidas con JWT |
| [`movie-rater-app/`](movie-rater-app/) | App Ionic React con pantalla de login, token guardado con `@capacitor/preferences` y manejo de 401 / sin red |

## Cómo ejecutar

```bash
# Terminal 1: API en http://localhost:3000
cd movie-rater-api
npm install
npm start

# Terminal 2: app en http://localhost:8100
cd movie-rater-app
npm install
npm run dev
```

Usuario de prueba: **`admin` / `movie123`**.

La dirección de la API se puede cambiar al compilar con `VITE_API_URL` (por ejemplo, la IP del
computador para probar en el celular): `VITE_API_URL=http://192.168.1.10:3000 npm run build`.

## 1. Login y petición protegida

**API** ([`src/auth.js`](movie-rater-api/src/auth.js), con la librería `jsonwebtoken`):

| Ruta | Respuesta |
|---|---|
| `POST /auth/login` con `{ "usuario", "contrasena" }` correctos | `200 { "token": "..." }`: JWT firmado que vence en 1 hora |
| `POST /auth/login` con contraseña incorrecta | `401 { "error": "Usuario o contraseña incorrectos" }` |
| `GET/POST /peliculas...` sin cabecera `Authorization` | `401 { "error": "Falta el token. Inicia sesión." }` |
| `GET/POST /peliculas...` con token vencido o firmado con otra clave | `401 { "error": "Token inválido o vencido" }` |

El usuario, la contraseña, la clave y el vencimiento se pueden cambiar con las variables de entorno
`AUTH_USUARIO`, `AUTH_CONTRASENA`, `JWT_SECRETO` y `JWT_EXPIRA_EN`
([`src/server.js`](movie-rater-api/src/server.js)).

**App:**

- La pantalla [`Login`](movie-rater-app/src/pages/Login.tsx) (`/login`) envía el usuario y la
  contraseña. Mientras espera, el botón muestra un spinner; si la API responde 401 muestra
  «Usuario o contraseña incorrectos».
- El token se guarda con [`@capacitor/preferences`](https://capacitorjs.com/docs/apis/preferences)
  ([`src/services/sesion.ts`](movie-rater-app/src/services/sesion.ts)): en Android queda en
  `SharedPreferences` y en iOS en `UserDefaults`, dentro del almacenamiento privado de la app, al
  que otras apps no tienen acceso. No está cifrado: para datos más sensibles habría que usar el
  Keystore de Android o el Keychain de iOS con un plugin de almacenamiento seguro.
- Cada petición a `/peliculas` lleva la cabecera `Authorization: Bearer <token>`.
- **Salir** (en la lista) borra el token y vuelve al login.

## 2. Manejo del 401 y de la falta de red

Todo se decide en un solo lugar, la función `pedir()` del servicio:

| Situación | Qué hace el servicio | Qué ve el usuario |
|---|---|---|
| No hay token guardado | Lanza `SesionRequeridaError` sin llamar a la API | Pantalla de login |
| La API responde **401** (token vencido o inválido) | Borra el token y lanza `SesionRequeridaError(vencida)` | Login con «Tu sesión expiró. Inicia sesión de nuevo.» |
| `fetch` falla y `navigator.onLine` es `false` | Lanza `SinConexionError` | «Sin conexión a internet. Revisa tu red e inténtalo de nuevo.» |
| `fetch` falla con red (API apagada) | Lanza un `Error` | «No se pudo conectar con el servidor. Inténtalo más tarde.» |
| Otro error HTTP (400, 404, 500) | Lanza un `Error` con el mensaje de la API | El mensaje de la API (p. ej. «No existe la película 99») |

Las pantallas solo distinguen dos casos: si el error es `SesionRequeridaError` navegan al login, y si
no, muestran el mensaje.

## 3. Servicio centralizado

[`src/services/peliculasApi.ts`](movie-rater-app/src/services/peliculasApi.ts) es el **único**
archivo que usa `fetch`. Exporta `iniciarSesion`, `cerrarSesion`, `listarPeliculas`,
`obtenerPelicula` y `crearPelicula`, y las pantallas solo llaman a esas funciones. Ninguna pantalla
arma URLs, agrega la cabecera del token ni revisa códigos HTTP.

## Pruebas

**API:** `npm test` → **11 pruebas, 0 fallos**: las 6 de la semana 10 (ahora con token) y 5 nuevas
de login y token:

| Prueba | Resultado esperado |
|---|---|
| Login con datos correctos | `200` con un JWT cuyo `sub` es `admin` |
| Login con contraseña incorrecta | `401` |
| `GET /peliculas` sin token | `401` |
| `GET /peliculas` con un token vencido | `401` |
| `GET /peliculas` con un token firmado con otra clave | `401` |

**En el navegador** (2026-11-07, API y app corriendo en el computador):

| Paso | Resultado |
|---|---|
| Abrir la app sin sesión | Va directo a `/login` |
| Login con contraseña incorrecta | `POST /auth/login → 401`, «Usuario o contraseña incorrectos» |
| Login con `admin` / `movie123` | `POST /auth/login → 200`, token guardado, `GET /peliculas → 200` con las 6 películas |
| Token inválido guardado y abrir `/peliculas` | `GET /peliculas → 401`, el token se borra y aparece el login con «Tu sesión expiró…» |
| Sin red (simulada: `navigator.onLine = false` y `fetch` fallando) y abrir un detalle | «Sin conexión a internet. Revisa tu red e inténtalo de nuevo.» |
| API detenida y abrir un detalle | «No se pudo conectar con el servidor. Inténtalo más tarde.» |
