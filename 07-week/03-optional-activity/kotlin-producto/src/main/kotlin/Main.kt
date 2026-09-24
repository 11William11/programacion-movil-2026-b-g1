fun main() {
    println("== Productos válidos ==")
    val combo = Producto("Combo crispetas + gaseosa", 18000.0, "Para ver la película")
    val chocolatina = Producto("Chocolatina", 3500.0)
    println(combo.resumen())
    println(chocolatina.resumen())

    println()
    println("== Manejo de nulos ==")
    // Llamada segura (?.): si descripcion es null, no se llama a length y el resultado es null.
    println("Largo de la descripción del combo: ${combo.descripcion?.length}")
    println("Largo de la descripción de la chocolatina: ${chocolatina.descripcion?.length ?: 0}")

    println()
    println("== Validación: precio negativo ==")
    try {
        Producto("Boleta", -1000.0)
    } catch (e: IllegalArgumentException) {
        println("No se creó el producto: ${e.message}")
    }

    println()
    println("== Datos de un formulario (pueden venir null) ==")
    val entradas = listOf(
        "Boleta 2D" to "12000",
        null to "5000",
        "Boleta 3D" to "abc",
        "Palomitas" to "-200",
    )
    for ((nombre, precio) in entradas) {
        val producto = Producto.desdeFormulario(nombre, precio)
        println("desdeFormulario($nombre, $precio) -> ${producto?.resumen() ?: "null (datos inválidos)"}")
    }

    println()
    println("== val es de solo lectura; para 'cambiar' se crea una copia ==")
    val conDescuento = combo.copy(precio = combo.precio * 0.9)
    println("Original:      ${combo.resumen()}")
    println("Con descuento: ${conDescuento.resumen()}")
}
