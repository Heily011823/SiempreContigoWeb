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
// (textContent, innerHTML, classList.add/remove, fetch + manejo de errores)

const btnDetallesCita = document.getElementById("btnDetallesCita");
const detalleCita = document.getElementById("detalleCita");
let detalleAbierto = false;
let medicoCargado = false;

btnDetallesCita.addEventListener("click", async function () {
    detalleAbierto = !detalleAbierto;

    if (detalleAbierto) {
        // Mejor práctica: usamos classList.add()/remove() en vez de .style
        // directamente, porque mantiene el CSS separado del JS.
        detalleCita.classList.remove("oculto");
        btnDetallesCita.textContent = "Ocultar detalles";

        if (!medicoCargado) {
            // Primer cambio de contenido: texto plano con textContent
            detalleCita.textContent = "Consultando el Registro Único de Talento Humano en Salud...";

            try {
                const respuesta = await fetch(
                    "https://www.datos.gov.co/resource/my8c-6xkk.json?$limit=1"
                );

                if (!respuesta.ok) {
                    throw new Error("No se pudo obtener la información.");
                }

                const datos = await respuesta.json();
                console.log("Registro recibido:", datos[0]);

                if (datos.length > 0) {
                    const registro = datos[0];

                    // Tomamos los primeros 4 campos que traiga la API
                    // y los mostramos con el mismo formato visual
                    // (etiqueta en negrita + valor) usando innerHTML.
                    const claves = Object.keys(registro).slice(0, 4);

                    let contenido = "";

                    claves.forEach(function (clave) {
                        const etiqueta = clave.replace(/_/g, " ");
                        contenido += `<p><strong>${etiqueta}:</strong> ${registro[clave]}</p>`;
                    });

                    detalleCita.innerHTML = contenido;
                } else {
                    detalleCita.textContent = "No se encontraron registros.";
                }

                medicoCargado = true;

            } catch (error) {
                detalleCita.textContent = "No se pudo cargar la información. Revisa tu conexión.";
                console.error("Error al consultar la API:", error);
            }
        }
    } else {
        detalleCita.classList.add("oculto");
        btnDetallesCita.textContent = "Ver detalles";
    }
});


// 3. Marcar el medicamento como que se tomó
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


// 4. Agregar y eliminar medicamentos
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


// 5. Botón de emergencia
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


// 6. Propiedades del objeto window
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


// 7. Navegación entre secciones
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


// 8. Lectura de voz

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