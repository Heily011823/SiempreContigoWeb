/* =====================================================
   SIEMPRE CONTIGO
   JavaScript puro - Taller práctico
   ===================================================== */


/* =====================================================
   1. SELECCIÓN DE ELEMENTOS DEL DOM
   ===================================================== */

// Selección utilizando getElementById()
const mensaje = document.getElementById("mensaje");

// Selección utilizando querySelector()
const informacion = document.querySelector("#informacion");

// Selección utilizando querySelectorAll()
const elementosLista = document.querySelectorAll("#listaInformacion li");

// Guardamos el contenedor dinámico
const contenedor = document.getElementById("contenedorDinamico");

// Guardamos los botones
const btnTexto = document.getElementById("btnTexto");
const btnEstilo = document.getElementById("btnEstilo");
const btnAgregar = document.getElementById("btnAgregar");
const btnEliminar = document.getElementById("btnEliminar");
const btnApi = document.getElementById("btnApi");


// Mostrar elementos seleccionados en la consola
console.log("Elemento con getElementById:", mensaje);
console.log("Elemento con querySelector:", informacion);
console.log("Elementos con querySelectorAll:", elementosLista);


/* =====================================================
   2. NAVEGACIÓN JERÁRQUICA DEL DOM
   ===================================================== */

console.log("Nodo padre de la información:", informacion.parentElement);
console.log("Hijos de la información:", informacion.children);
console.log("Primer hijo:", informacion.firstElementChild);
console.log("Último hijo:", informacion.lastElementChild);


/* =====================================================
   3. CAMBIAR TEXTO CON textContent
   ===================================================== */

btnTexto.addEventListener("click", function () {

    mensaje.textContent =
        "¡Hola! Recuerda tomar tus medicamentos y revisar tus citas.";

    console.log("Se modificó el texto usando textContent.");
});


/* =====================================================
   4. CAMBIAR TEXTO CON innerHTML
   ===================================================== */

informacion.addEventListener("click", function () {

    informacion.innerHTML = `
        <h2>¡Siempre Contigo!</h2>
        <p>
            Estamos aquí para ayudarte con tus medicamentos,
            citas y recordatorios.
        </p>
    `;

    console.log("Se modificó el contenido usando innerHTML.");
});


/* =====================================================
   5. MODIFICACIÓN DE ESTILOS
   ===================================================== */

btnEstilo.addEventListener("click", function () {

    // Modificación directa utilizando la propiedad style
    informacion.style.backgroundColor = "#e8f8fa";
    informacion.style.border = "3px solid #159caf";

    // classList.toggle() agrega o quita la clase.
    informacion.classList.toggle("estiloEspecial");

    console.log("Se modificaron los estilos.");
});


/* =====================================================
   6. classList.add() Y classList.remove()
   ===================================================== */

// Agregar una clase
mensaje.classList.add("estiloEspecial");

// Después podemos quitarla
// mensaje.classList.remove("estiloEspecial");


/*
   MEJOR PRÁCTICA:

   Considero que classList es mejor práctica para estilos
   porque permite mantener el diseño en el archivo CSS
   y evita colocar demasiados estilos directamente
   desde JavaScript.
*/


/* =====================================================
   7. CREAR ELEMENTOS DINÁMICAMENTE
   ===================================================== */

btnAgregar.addEventListener("click", function () {

    const nuevoRecordatorio = document.createElement("div");

    nuevoRecordatorio.classList.add("recordatorio");

    nuevoRecordatorio.textContent =
        "Nuevo recordatorio agregado correctamente.";

    contenedor.appendChild(nuevoRecordatorio);

    console.log("Se creó un nuevo elemento:", nuevoRecordatorio);
});


/* =====================================================
   8. ELIMINAR EL ÚLTIMO ELEMENTO CREADO
   ===================================================== */

btnEliminar.addEventListener("click", function () {

    const ultimoElemento = contenedor.lastElementChild;

    if (ultimoElemento) {

        ultimoElemento.remove();

        console.log("Se eliminó el último elemento creado.");

    } else {

        console.log("No hay elementos para eliminar.");
    }
});


/* =====================================================
   9. OBJETO WINDOW
   ===================================================== */

// Obtener información de la ventana
console.log("Ancho de la ventana:", window.innerWidth);
console.log("Posición del scroll:", window.scrollY);
console.log("URL actual:", window.location.href);


// Mostrar información de window dentro de la página
const infoWindow = document.getElementById("infoWindow");

function actualizarWindow() {

    infoWindow.textContent =
        "Ancho de la ventana: " + window.innerWidth +
        " px | Scroll: " + window.scrollY + " px";
}

actualizarWindow();


// Actualizar cuando cambie el tamaño de la ventana
window.addEventListener("resize", actualizarWindow);

// Actualizar cuando se haga scroll
window.addEventListener("scroll", actualizarWindow);


/* =====================================================
   10. CONSUMO DE UNA API PÚBLICA
   ===================================================== */

// API pública de medicamentos de OpenFDA
const urlApi =
    "https://api.fda.gov/drug/drugsfda.json?limit=3";


btnApi.addEventListener("click", async function () {

    const resultado = document.getElementById("resultadoApi");

    resultado.innerHTML = "Consultando información...";

    try {

        // Realizamos la petición a la API
        const respuesta = await fetch(urlApi);

        // Comprobamos si hubo un error
        if (!respuesta.ok) {
            throw new Error("No se pudo consultar la API.");
        }

        // Convertimos la respuesta a formato JSON
        const datos = await respuesta.json();

        console.log("Datos recibidos de la API:", datos);

        // Limpiamos el contenedor
        resultado.innerHTML = "";

        // Mostramos los datos obtenidos en el DOM
        datos.results.forEach(function (medicamento) {

            const elemento = document.createElement("div");

            elemento.classList.add("recordatorio");

            elemento.innerHTML = `
                <strong>Medicamento:</strong>
                ${medicamento.products?.[0]?.brand_name || "Sin nombre"}
                <br>
                <strong>Fabricante:</strong>
                ${medicamento.sponsor_name || "No disponible"}
            `;

            resultado.appendChild(elemento);
        });

    } catch (error) {

        console.error("Error al consumir la API:", error);

        resultado.innerHTML =
            "⚠️ No fue posible obtener los datos de la API.";
    }
});


/* =====================================================
   FIN DEL SCRIPT
   ===================================================== */

console.log("JavaScript cargado correctamente.");