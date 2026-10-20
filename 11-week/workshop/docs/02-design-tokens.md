# CP2 · Navegación y tokens de diseño

## Patrón de navegación: pestañas + pila

Movie Rater tiene dos secciones principales después de iniciar sesión: **Buscar** (Home) y **Mi perfil** (mis reseñas). Lo que más hace el usuario es buscar una película, abrirla y calificarla, y después revisar sus reseñas. Por eso:

- **Pestañas abajo** (`IonTabs`) para las dos secciones: siempre están a la vista y al alcance del pulgar. Antes el perfil solo se abría con un botón de texto que a 375 px se cortaba («MI»).
- **Pila** para el detalle: `/movie/:id` se abre encima de las pestañas con flecha de regreso, porque es un paso dentro de «Buscar», no una sección nueva.
- Login y registro quedan fuera de las pestañas: el usuario aún no ha entrado a la app.

| Ruta | Pantalla | Cómo se llega |
|---|---|---|
| `/tabs/buscar` | Home | Pestaña «Buscar», o después de iniciar sesión o registrarse |
| `/tabs/perfil` | Profile | Pestaña «Mi perfil» |
| `/movie/:id` | MovieDetail | Tocar una tarjeta de película; la flecha vuelve a `/tabs/buscar` |

Archivos: `app/src/pages/Tabs.tsx` (nuevo) y `app/src/App.tsx`.

## Tokens (`app/src/theme/variables.css`)

Tema oscuro siempre (`dark.always.css`): una app de películas se ve mejor con fondo oscuro y los pósteres resaltan más.

| Token | Valor | Uso |
|---|---|---|
| `--ion-color-primary` | `#f5b82e` | Botones principales, pestaña activa, calificación |
| `--ion-color-secondary` | `#7cc4fa` | Acciones de apoyo y enlaces |
| `--ion-color-success` | `#4ade80` | Reseña guardada |
| `--ion-color-danger` | `#ff6b6b` | Errores de red y de validación |
| `--ion-background-color` | `#121212` | Fondo de todas las pantallas |
| `--ion-card-background` | `#1e1e1e` | Tarjetas de película |
| `--ion-text-color` | `#f2f2f2` | Texto principal |
| `--mr-text-secondary` | `#b3b3b3` | Texto de apoyo (fechas, descripciones) |
| `--mr-font-size-sm / md / lg / xl` | `0.875rem / 1rem / 1.25rem / 1.75rem` | Tamaños de letra en `rem` |
| `--mr-space-xs / sm / md / lg / xl` | `4 / 8 / 16 / 24 / 32 px` | Márgenes y separaciones |

## Contraste de cada par texto / fondo (mínimo 4.5:1)

Calculado con la fórmula de luminancia relativa de WCAG 2.1, la misma que usa el verificador de contraste de WebAIM (https://webaim.org/resources/contrastchecker/).

| Texto | Fondo | Contraste | ¿Cumple 4.5:1? |
|---|---|---|---|
| Texto principal `#f2f2f2` | Fondo `#121212` | 16.73:1 | Sí |
| Texto principal `#f2f2f2` | Tarjeta `#1e1e1e` | 14.89:1 | Sí |
| Texto secundario `#b3b3b3` | Fondo `#121212` | 8.93:1 | Sí |
| Texto secundario `#b3b3b3` | Tarjeta `#1e1e1e` | 7.95:1 | Sí |
| Pestaña inactiva `#b3b3b3` | Barra de pestañas `#1f1f1f` | 7.86:1 | Sí |
| Pestaña activa (primario) `#f5b82e` | Barra de pestañas `#1f1f1f` | 9.24:1 | Sí |
| Primario `#f5b82e` | Fondo `#121212` | 10.51:1 | Sí |
| Texto de botón primario `#000000` | Primario `#f5b82e` | 11.78:1 | Sí |
| Secundario `#7cc4fa` | Tarjeta `#1e1e1e` | 8.84:1 | Sí |
| Éxito `#4ade80` | Fondo `#121212` | 10.75:1 | Sí |
| Error `#ff6b6b` | Fondo `#121212` | 6.75:1 | Sí |
| Error `#ff6b6b` | Tarjeta `#1e1e1e` | 6.01:1 | Sí |
| Texto de botón de error `#000000` | Error `#ff6b6b` | 7.57:1 | Sí |
