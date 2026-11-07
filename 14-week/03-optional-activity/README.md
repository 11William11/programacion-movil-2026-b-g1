# Optimización y pruebas · Movie Rater (Semana 14)

Actividad opcional de refuerzo · Programación Móvil · 2026-B
**Autor:** William Erney Collo Narvaez (`11William11`)

Sobre la app con login de la [semana 13](../../13-week/03-optional-activity/) optimicé la
**lista de películas** para que no se vuelva a pedir a la API cada vez que el usuario regresa a
ella, medí el antes y el después, y agregué **2 pruebas unitarias** de la función que lo hace.

| Carpeta | Qué es |
|---|---|
| [`movie-rater-api/`](movie-rater-api/) | La API Express con JWT de la semana 13 (sin cambios) |
| [`movie-rater-app/`](movie-rater-app/) | La app Ionic React con la caché de la lista y las pruebas con **Vitest** |

## Cómo ejecutar

```bash
# API en http://localhost:3000
cd movie-rater-api && npm install && npm start

# App en http://localhost:8100 (usuario admin / movie123)
cd movie-rater-app && npm install && npm run dev

# Pruebas unitarias de la app
cd movie-rater-app && npm test
```

## 1. El problema

La lista se carga en `useIonViewWillEnter`, que se ejecuta **cada vez** que la pantalla vuelve a
mostrarse. Así aparece una película recién creada, pero también significa que ir al detalle y
regresar repite el `GET /peliculas` aunque nada haya cambiado. En el celular, cada petición
repetida gasta datos y batería, y la lista queda esperando la respuesta.

## 2. La optimización: caché de la lista con invalidación

[`src/services/cache.ts`](movie-rater-app/src/services/cache.ts) define `crearCache(cargar, vigenciaMs)`:

- Guarda el último resultado durante **60 s**. Mientras siga vigente, `obtener()` lo devuelve sin
  llamar a la API.
- `invalidar()` lo descarta. El servicio lo llama al **crear una película** (para que aparezca al
  volver), al **cerrar sesión** y cuando la API responde **401**.
- Si llegan dos pedidos mientras la petición está en curso, los dos esperan la misma petición.
- Si la petición falla, no se guarda nada y el siguiente intento vuelve a llamar a la API.

En [`peliculasApi.ts`](movie-rater-app/src/services/peliculasApi.ts) `listarPeliculas()` ahora
usa la caché. Las pantallas no cambiaron: siguen llamando a `listarPeliculas()` igual que antes.

## 3. Medición antes / después

**Escenario:** iniciar sesión, abrir la lista y hacer **5 idas y vueltas** lista → detalle → lista.
Se contaron las peticiones con `performance.getEntriesByType('resource')`, que es lo mismo que
muestra la pestaña *Network* de DevTools filtrando por `peliculas`. Fecha: 2026-11-07, app
compilada (`vite build` + `vite preview`) y API en el mismo computador.

| | `GET /peliculas` (lista) | `GET /peliculas/:id` (detalle) | Total |
|---|---|---|---|
| **Antes** (semana 13) | 6 | 5 | 11 |
| **Después** (con caché) | **1** | 5 | **6** |

- Las peticiones de la lista bajaron de 6 a 1 (**−83 %**), y el total del escenario de 11 a 6
  (**−45 %**).
- Al regresar a la lista, los datos salen de la memoria y se muestran sin esperar a la red.
- **La invalidación funciona:** después del escenario creé la película «Encanto (2021)». Hubo un
  `POST /peliculas` y **un** `GET /peliculas` nuevo, y al volver la lista ya mostraba «Encanto».

**Lo que se acepta a cambio:** si otro usuario crea una película, aquí no aparece hasta que pasen
los 60 s de vigencia (o se cierre sesión). Para una lista que cambia poco es un buen intercambio.

## 4. Pruebas unitarias

[`src/services/cache.test.ts`](movie-rater-app/src/services/cache.test.ts) prueba la función
`crearCache` con **Vitest**. La API se reemplaza por `vi.fn()` y el tiempo por un reloj falso, así
que las pruebas no dependen de la red ni de esperar 60 s de verdad.

| Prueba | Qué comprueba |
|---|---|
| No vuelve a llamar a la API mientras el dato está vigente, y sí cuando vence | 3 pedidos en los primeros 30 s → **1** llamada; a los 60 s → **2** llamadas |
| `invalidar()` obliga a pedir de nuevo | Después de invalidar, la siguiente lectura trae la lista nueva (con la película creada) |

**Resultado (2026-11-07):**

```text
 ✓ src/services/cache.test.ts > crearCache > no vuelve a llamar a la API mientras el dato está vigente, y sí cuando vence
 ✓ src/services/cache.test.ts > crearCache > invalidar() obliga a pedir de nuevo (lo que pasa al crear una película)

 Test Files  1 passed (1)
      Tests  2 passed (2)
```

`npm run build` (que también corre `tsc`) termina sin errores.
