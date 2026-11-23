// 1. Elementos del DOM
// (getElementById, querySelector, querySelectorAll)

const titulo = document.getElementById("main-title");
const menu = document.querySelector(".menu");
const enlacesMenu = document.querySelectorAll(".menu-item");
const contenedorDinamico = document.getElementById("contenedorDinamico");

console.log("Título:", titulo);
console.log("Menú:", menu);
console.log("Enlaces del menú:", enlacesMenu);
console.log("Tabla de medicamentos:", contenedorDinamico);

// Navegación jerárquica del DOM (se muestra solo en consola)
console.log("Nodo padre de la tabla:", contenedorDinamico.parentElement);
console.log("Hijos de la tabla:", contenedorDinamico.children);
console.log("Primer medicamento:", contenedorDinamico.firstElementChild);
console.log("Último medicamento:", contenedorDinamico.lastElementChild);


// 2. Ver detalles de la cita
// (textContent, innerHTML, classList.add/remove — sin API, solo información propia)

const btnDetallesCita = document.getElementById("btnDetallesCita");
const detalleCita = document.getElementById("detalleCita");
let detalleAbierto = false;

btnDetallesCita.addEventListener("click", function () {
    detalleAbierto = !detalleAbierto;

    if (detalleAbierto) {
        // Mejor práctica: usamos classList.add()/remove() en vez de .style
        // directamente, porque mantiene el CSS separado del JS.
        detalleCita.classList.remove("oculto");
        btnDetallesCita.textContent = "Ocultar detalles";

        // Usamos innerHTML porque el contenido incluye formato (negritas)
        detalleCita.innerHTML = `
            <p><strong>Consultorio:</strong> Clínica San Rafael, Manizales</p>
            <p><strong>Motivo:</strong> Control general</p>
            <p><strong>Recomendación:</strong> Llegar 15 minutos antes</p>
        `;
    } else {
        detalleCita.classList.add("oculto");
        btnDetallesCita.textContent = "Ver detalles";
    }
});


// 3. Clima de hoy
// (fetch + manejo de errores, con la API pública Open-Meteo)

const climaContenido = document.getElementById("climaContenido");
const btnActualizarClima = document.getElementById("btnActualizarClima");

// Función de apoyo: traduce el código de clima de Open-Meteo a texto legible
function interpretarClima(codigo) {
    if (codigo === 0) return "Despejado. Buen día para salir.";
    if (codigo <= 3) return "Parcialmente nublado.";
    if (codigo <= 48) return "Con niebla, ten cuidado al salir.";
    if (codigo <= 67) return "Con lluvia, lleva paraguas.";
    if (codigo <= 86) return "Puede nevar (poco probable en tu zona).";
    return "Clima variable, revisa antes de salir.";
}

async function cargarClima() {
    // Primer cambio de contenido: texto plano con textContent
    climaContenido.textContent = "Consultando el clima...";

    try {
        const respuesta = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=5.0689&longitude=-75.5174&elevation=2150&current=temperature_2m,weather_code&timezone=auto"
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo obtener el clima.");
        }

        const datos = await respuesta.json();
        console.log("Datos del clima recibidos:", datos);

        const temperatura = datos.current.temperature_2m;
        const codigo = datos.current.weather_code;

        // Segundo cambio de contenido: con formato, usando innerHTML
        climaContenido.innerHTML = `
            <p class="temperatura-clima">${temperatura} °C</p>
            <p>${interpretarClima(codigo)}</p>
        `;

    } catch (error) {
        climaContenido.textContent = "No se pudo cargar el clima. Revisa tu conexión.";
        console.error("Error al consultar la API:", error);
    }
}

// Se carga automáticamente al abrir la app...
cargarClima();

// ...y también se puede volver a consultar con el botón "Actualizar"
btnActualizarClima.addEventListener("click", cargarClima);


// 4. Marcar el medicamento como que se tomó
// (classList.toggle)

contenedorDinamico.addEventListener("click", function (evento) {
    if (evento.target.classList.contains("btn-tomado")) {
        const fila = evento.target.closest("tr");

        fila.classList.toggle("medicamento-tomado");

        const yaTomado = fila.classList.contains("medicamento-tomado");
        evento.target.textContent = yaTomado ? "Deshacer" : "Marcar tomado";

        console.log("Medicamento actualizado:", fila);
    }
});


// 5. Agregar y eliminar medicamentos
// (crear elementos dinámicamente y removeChild)

const btnAgregar = document.getElementById("btnAgregar");
const btnEliminar = document.getElementById("btnEliminar");
const formMedicamento = document.getElementById("formMedicamento");

btnAgregar.addEventListener("click", function () {
    formMedicamento.classList.toggle("oculto");
});

formMedicamento.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nombre = document.getElementById("inputNombre").value;
    const frecuencia = document.getElementById("inputFrecuencia").value;
    const inicio = document.getElementById("inputInicio").value;
    const fin = document.getElementById("inputFin").value;
    const dosis = document.getElementById("inputDosis").value;

    const nuevaFila = document.createElement("tr");
    nuevaFila.classList.add("fila-dinamica");

    nuevaFila.innerHTML = `
        <td>${nombre}</td>
        <td>${frecuencia}</td>
        <td>${inicio}</td>
        <td>${fin}</td>
        <td>${dosis}</td>
        <td><button class="btn-tomado">Marcar tomado</button></td>
    `;

    contenedorDinamico.appendChild(nuevaFila);

    formMedicamento.reset();
    formMedicamento.classList.add("oculto");

    console.log("Se agregó un nuevo medicamento. Hijos actuales:", contenedorDinamico.children);
});

btnEliminar.addEventListener("click", function () {
    const ultimaFila = contenedorDinamico.lastElementChild;

    if (ultimaFila) {
        contenedorDinamico.removeChild(ultimaFila);
        console.log("Se eliminó el último medicamento agregado.");
    } else {
        alert("No hay más medicamentos para eliminar.");
    }
});


// 6. Botón de emergencia
// (modificación directa de la propiedad style)

const btnEmergencia = document.getElementById("btnEmergencia");

btnEmergencia.addEventListener("click", function () {
    // Aquí usamos .style directamente porque es un efecto visual
    // puntual e inmediato (una alerta momentánea), no un estilo
    // reutilizable, así que no vale la pena crear una clase CSS solo para esto.
    btnEmergencia.style.backgroundColor = "#7a1408";
    btnEmergencia.style.transform = "scale(0.97)";

    setTimeout(function () {
        btnEmergencia.style.backgroundColor = "";
        btnEmergencia.style.transform = "";
    }, 300);

    console.log("Alerta de emergencia enviada al cuidador.");
});


// 7. Propiedades del objeto window
// (scrollY, innerWidth, location.href)

const btnVolverArriba = document.getElementById("btnVolverArriba");

// scrollY: mostrado dinámicamente en pantalla con un botón flotante
window.addEventListener("scroll", function () {
    if (window.scrollY > 200) {
        btnVolverArriba.classList.remove("oculto");
    } else {
        btnVolverArriba.classList.add("oculto");
    }
});

btnVolverArriba.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// innerWidth y location.href: se registran en consola
console.log("Ancho de la ventana:", window.innerWidth);
console.log("URL actual:", window.location.href);


// 8. Navegación entre secciones
// (usa location.href/hash para actualizar el título de la pestaña)

const vistas = document.querySelectorAll(".vista");

enlacesMenu.forEach(function (enlace) {
    enlace.addEventListener("click", function (evento) {
        evento.preventDefault();

        const idDestino = enlace.getAttribute("href").substring(1);
        const vistaDestino = document.getElementById(idDestino);

        if (vistaDestino) {
            vistas.forEach(function (vista) {
                vista.classList.add("oculto");
            });

            vistaDestino.classList.remove("oculto");

            enlacesMenu.forEach(function (item) {
                item.classList.remove("activo");
            });

            enlace.classList.add("activo");

            document.title = "Siempre Contigo - " + enlace.querySelector("span").textContent;

            console.log("Se abrió la sección:", idDestino, "| URL:", window.location.href);
        }
    });
});


// 9. Lectura de voz

const btnEscuchar = document.getElementById("btnEscuchar");

btnEscuchar.addEventListener("click", function () {
    if ("speechSynthesis" in window) {
        const texto = new SpeechSynthesisUtterance(
            "Bienvenida a Siempre Contigo. " +
            "Recuerda revisar tus medicamentos y recordatorios."
        );

        texto.lang = "es-CO";

        window.speechSynthesis.speak(texto);
    } else {
        alert("Tu navegador no permite la lectura de voz.");
    }
});


console.log("JavaScript cargado correctamente.");