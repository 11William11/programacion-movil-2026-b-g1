# Kotlin básico y un componente Ionic React (Semana 7)

Actividad opcional de refuerzo · Programación Móvil · 2026-B
**Autor:** William Erney Collo Narvaez (`11William11`)

| Parte | Carpeta |
|---|---|
| 1. Clase `Producto` en Kotlin | [`kotlin-producto/`](kotlin-producto/) |
| 2. Componente `Saludo` en Ionic React | [`movie-rater-app/`](movie-rater-app/) (la app Movie Rater de la semana 6) |
| 3. Diferencias Kotlin / TypeScript | [más abajo](#3-dos-diferencias-entre-kotlin-y-typescript) |

## 1. Clase `Producto` en Kotlin

[`Producto.kt`](kotlin-producto/src/main/kotlin/Producto.kt)

```kotlin
data class Producto(
    val nombre: String,
    val precio: Double,
    val descripcion: String? = null,
) {
    init {
        require(nombre.isNotBlank()) { "El nombre no puede estar vacío" }
        require(precio >= 0) { "El precio debe ser mayor o igual a 0 (llegó $precio)" }
    }

    fun resumen(): String =
        "$nombre — $${"%,.0f".format(precio)} · ${descripcion ?: "sin descripción"}"

    companion object {
        fun desdeFormulario(nombre: String?, precioTexto: String?): Producto? {
            val precio = precioTexto?.toDoubleOrNull() ?: return null
            if (nombre.isNullOrBlank() || precio < 0) return null
            return Producto(nombre.trim(), precio)
        }
    }
}
```

| Concepto | Dónde se usa |
|---|---|
| **`val`** | Las tres propiedades son de solo lectura. Para "cambiar" el precio se usa `copy(...)`, que crea otro objeto. |
| **Validación** | `require(precio >= 0)` en el bloque `init`: si el precio es negativo lanza `IllegalArgumentException` y el objeto no se crea. |
| **Tipo nulable `String?`** | `descripcion` puede ser `null`; el compilador no deja usarla sin revisar ese caso. |
| **Operador Elvis `?:`** | `descripcion ?: "sin descripción"`: valor por defecto si es `null`. |
| **Llamada segura `?.`** | `descripcion?.length` devuelve `null` en vez de lanzar `NullPointerException`. |
| **Retorno nulable `Producto?`** | `desdeFormulario` devuelve `null` si los datos del formulario no sirven, en vez de lanzar error. |

### Ejecutarlo

Con Maven (JDK 17):

```bash
cd kotlin-producto
mvn -q compile exec:java
```

O con el compilador de Kotlin directamente:

```bash
kotlinc src/main/kotlin -include-runtime -d producto.jar
java -jar producto.jar
```

Salida ([`salida.txt`](kotlin-producto/salida.txt)):

```
== Productos válidos ==
Combo crispetas + gaseosa — $18.000 · Para ver la película
Chocolatina — $3.500 · sin descripción

== Manejo de nulos ==
Largo de la descripción del combo: 20
Largo de la descripción de la chocolatina: 0

== Validación: precio negativo ==
No se creó el producto: El precio debe ser mayor o igual a 0 (llegó -1000.0)

== Datos de un formulario (pueden venir null) ==
desdeFormulario(Boleta 2D, 12000) -> Boleta 2D — $12.000 · sin descripción
desdeFormulario(null, 5000) -> null (datos inválidos)
desdeFormulario(Boleta 3D, abc) -> null (datos inválidos)
desdeFormulario(Palomitas, -200) -> null (datos inválidos)

== val es de solo lectura; para 'cambiar' se crea una copia ==
Original:      Combo crispetas + gaseosa — $18.000 · Para ver la película
Con descuento: Combo crispetas + gaseosa — $16.200 · Para ver la película
```

## 2. Componente `Saludo` en Ionic React

[`src/components/Saludo.tsx`](movie-rater-app/src/components/Saludo.tsx)

```tsx
interface SaludoProps {
  nombre: string;
}

const Saludo: React.FC<SaludoProps> = ({ nombre }) => {
  const [saludado, setSaludado] = useState(false);

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardSubtitle>Componente Saludo</IonCardSubtitle>
        <IonCardTitle>{nombre}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p>{saludado ? `¡Hola, ${nombre}! Bienvenido a Movie Rater 🎬` : 'Toca el botón para saludar.'}</p>
        <IonButton expand="block" onClick={() => setSaludado(!saludado)}>
          {saludado ? 'Ocultar saludo' : 'Saludar'}
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};
```

- Recibe el **nombre por props** (`<Saludo nombre="William" />` en
  [`Home.tsx`](movie-rater-app/src/pages/Home.tsx)).
- Guarda en el **estado** (`useState`) si ya se saludó; al tocar el botón el
  estado cambia y React vuelve a pintar el mensaje y el texto del botón.
- Usa componentes de Ionic: `IonCard`, `IonButton` e `IonIcon`.

| Antes de tocar el botón | Después |
|---|---|
| <img src="capturas/saludo-antes.png" alt="Saludo antes" width="260"> | <img src="capturas/saludo-despues.png" alt="Saludo después" width="260"> |

### Ejecutarlo y probarlo

```bash
cd movie-rater-app
npm install
ionic serve       # http://localhost:8100
npx vitest run    # pruebas unitarias
```

[`Saludo.test.tsx`](movie-rater-app/src/components/Saludo.test.tsx) comprueba que
muestra el nombre y el botón, que al tocarlo aparece el saludo y al tocarlo otra
vez se oculta, y que usa el nombre que recibe por props:

```
 ✓ src/components/Saludo.test.tsx (3 tests)
 ✓ src/App.test.tsx (2 tests)
 Test Files  2 passed (2)
      Tests  5 passed (5)
```

## 3. Dos diferencias entre Kotlin y TypeScript

### Diferencia 1: la seguridad frente a nulos siempre está activa vs. es opcional

En **Kotlin** un `String` nunca puede ser `null`; para permitirlo hay que escribir
`String?`, y el compilador **no deja** usar esa variable sin manejar el caso nulo.
Es parte del lenguaje, siempre está activo.

En **TypeScript** también existe `string | null`, pero solo se revisa con
`strictNullChecks` (dentro de `strict: true` en `tsconfig.json`). Sin esa opción
`null` se puede asignar a cualquier tipo. Además los tipos desaparecen al
compilar a JavaScript: si una API devuelve `null` donde se esperaba texto, nada lo
detiene en tiempo de ejecución.

```kotlin
val descripcion: String? = null
descripcion.length        // ❌ no compila
descripcion?.length ?: 0  // ✅
```

```ts
let descripcion: string | null = null;
descripcion.length;          // ❌ error solo con strictNullChecks
descripcion?.length ?? 0;    // ✅ (?? en vez de ?:)
```

### Diferencia 2: `val` es inmutable vs. `const` solo fija la referencia

En **Kotlin** una propiedad `val` no se puede reasignar, y una `data class` con
todo `val` es un objeto inmutable: para cambiarlo se crea una copia con
`copy(precio = ...)`.

En **TypeScript** `const` solo impide reasignar la variable; el objeto se puede
seguir modificando (`producto.precio = -5` funciona). Para impedirlo hay que
agregar `readonly` a cada propiedad o usar `Object.freeze`, y `readonly` también
se borra al compilar a JavaScript.

```kotlin
val combo = Producto("Combo", 18000.0)
combo.precio = 0.0                   // ❌ no compila: precio es val
val otro = combo.copy(precio = 0.0)  // ✅ nuevo objeto
```

```ts
const combo = { nombre: 'Combo', precio: 18000 };
combo.precio = -5;            // ✅ compila, aunque combo sea const
combo = { ...combo };         // ❌ esto sí falla: no se puede reasignar const
```

Otras diferencias: Kotlin compila a bytecode de la JVM (y es el lenguaje oficial
de Android nativo), mientras TypeScript compila a JavaScript y corre en el
navegador o en Node, que es donde vive una app Ionic.
