/**
 * Producto con validación en el constructor.
 *
 * - `val`: las propiedades son de solo lectura; un Producto no cambia después de crearse.
 * - `descripcion: String?`: puede ser null; Kotlin obliga a manejar ese caso.
 * - `init` + `require`: si el precio es negativo el objeto ni siquiera se crea.
 */
data class Producto(
    val nombre: String,
    val precio: Double,
    val descripcion: String? = null,
) {
    init {
        require(nombre.isNotBlank()) { "El nombre no puede estar vacío" }
        require(precio >= 0) { "El precio debe ser mayor o igual a 0 (llegó $precio)" }
    }

    /** Operador Elvis (?:) para dar un valor cuando la descripción es null. */
    fun resumen(): String =
        "$nombre — $${"%,.0f".format(precio)} · ${descripcion ?: "sin descripción"}"

    companion object {
        /**
         * Crea un Producto a partir de datos que pueden venir incompletos (por ejemplo,
         * de un formulario). Devuelve null en vez de lanzar una excepción.
         */
        fun desdeFormulario(nombre: String?, precioTexto: String?): Producto? {
            val precio = precioTexto?.toDoubleOrNull() ?: return null
            if (nombre.isNullOrBlank() || precio < 0) return null
            return Producto(nombre.trim(), precio)
        }
    }
}
