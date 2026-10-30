# GPS con Capacitor · Movie Rater (Semana 12)

Actividad opcional de refuerzo · Programación Móvil · 2026-B
**Autor:** William Erney Collo Narvaez (`11William11`)

A la app de películas de la [semana 10](../../10-week/03-optional-activity/) (Ionic React) le agregué
la pantalla **Mi ubicación**: usa el plugin
[`@capacitor/geolocation`](https://capacitorjs.com/docs/apis/geolocation) para mostrar la latitud y la
longitud del dispositivo, pide el permiso de ubicación y maneja el caso en que el usuario lo niega.
El proyecto está en [`movie-rater-app/`](movie-rater-app/).

## Cómo ejecutar

```bash
cd movie-rater-app
npm install
npm run dev        # http://localhost:8100/ubicacion
```

En la lista de películas, el botón **Ubicación** del encabezado abre la pantalla nueva. La lista
sigue necesitando la API de la semana 10 encendida; la pantalla de ubicación no.

**Versión publicada para probar en el celular:**
<https://11william11.github.io/programacion-movil-2026-b-g1/ubicacion>. El navegador del celular
solo deja usar el GPS en páginas `https`, por eso se publicó en GitHub Pages
(`npm run build:pages` genera esa versión).

## 1. Plugin integrado

| Archivo | Qué hace |
|---|---|
| [`src/services/ubicacion.ts`](movie-rater-app/src/services/ubicacion.ts) | Único lugar que usa el plugin: pide el permiso y llama a `Geolocation.getCurrentPosition()` |
| [`src/pages/MiUbicacion.tsx`](movie-rater-app/src/pages/MiUbicacion.tsx) | Pantalla con el botón **Obtener mi ubicación** y los estados |
| [`capacitor.config.ts`](movie-rater-app/capacitor.config.ts) | Configuración de Capacitor (`appId`, `webDir: dist`) |
| `src/App.tsx` | Ruta nueva `/ubicacion` |

Dependencias nuevas: `@capacitor/core`, `@capacitor/geolocation` y `@capacitor/cli` (versión 8).

La pantalla muestra **latitud**, **longitud** (6 decimales) y la **precisión** en metros.

## 2. Permisos (incluido el caso negado)

- **En Android/iOS** (`Capacitor.isNativePlatform()`): primero `checkPermissions()`. Si el permiso
  todavía no se ha pedido, `requestPermissions()` muestra el diálogo del sistema. Si queda en
  `denied`, no se llama al GPS.
- **En el navegador** `requestPermissions()` no existe: el propio `getCurrentPosition()` muestra el
  aviso de permiso, y si se niega responde con el error de código `1` (`PERMISSION_DENIED`).
- En los dos casos el servicio lanza `PermisoDenegadoError` y la pantalla muestra
  **«Permiso de ubicación denegado»**, con la indicación de activarlo en los ajustes. El botón
  permite volver a intentarlo.
- Si el GPS está apagado o no responde en 15 s, se muestra «No se pudo obtener la ubicación. Revisa
  que el GPS esté encendido.».

| Estado | Qué ve el usuario |
|---|---|
| Cargando | El botón se deshabilita y muestra un spinner |
| Ubicación obtenida | Latitud, longitud y precisión |
| Permiso negado | «Permiso de ubicación denegado» y cómo activarlo |
| Otro error | «No se pudo obtener la ubicación…» |

Probado en el navegador del computador (2026-10-30): con el permiso negado aparece el mensaje de
permiso denegado, y con una posición simulada aparecen el spinner y luego la latitud, longitud y
precisión.

## 3. Prueba en dispositivo real

**Pendiente:** las capturas se toman en el celular abriendo la versión publicada. Hacen falta dos:

1. Permitir la ubicación → se ven la latitud y la longitud.
2. Negar la ubicación (o quitarla en los permisos del sitio) → «Permiso de ubicación denegado».

Para generar un APK e instalarlo como app nativa hace falta Android Studio:

```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Antes de compilar hay que agregar `ACCESS_COARSE_LOCATION` y `ACCESS_FINE_LOCATION` a
`android/app/src/main/AndroidManifest.xml`, como indica la documentación del plugin.
