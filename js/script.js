document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. SELECCIÓN DE ELEMENTOS (getElementById, querySelector, querySelectorAll)
    // ==========================================

    // getElementById
    const mainTitle = document.getElementById("main-title");
    const welcomeMessage = document.getElementById("welcome-message");
    const dynamicContainer = document.getElementById("dynamic-container");
    const windowInfo = document.getElementById("window-info");
    const apiResult = document.getElementById("api-result");

    // querySelector
    const mainParagraph = document.querySelector("#main-paragraph");
    const mainSidebar = document.querySelector("#main-sidebar");
    const servicesList = document.querySelector("#services-list");
    
    // Botones
    const btnChangeText = document.querySelector("#btn-change-text");
    const btnToggleStyle = document.querySelector("#btn-toggle-style");
    const btnDirectStyle = document.querySelector("#btn-direct-style");
    const btnAdd = document.querySelector("#btn-add");
    const btnRemove = document.querySelector("#btn-remove");
    const btnFetchApi = document.querySelector("#btn-fetch-api");

    // querySelectorAll
    const navItems = document.querySelectorAll(".nav-item");

    // Mapeo en consola exigido por la guía
    console.log("--- Elementos seleccionados ---");
    console.log("Título Lateral (getElementById):", mainTitle);
    console.log("Párrafo Bienvenida (querySelector):", mainParagraph);
    console.log("Opciones de menú (querySelectorAll):", navItems);

    // ==========================================
    // 2. NAVEGACIÓN JERÁRQUICA EN EL DOM
    // ==========================================
    console.log("--- Navegación Jerárquica ---");
    console.log("Nodo padre del menú:", servicesList.parentNode);
    console.log("Hijos del menú:", servicesList.children);
    console.log("Primer hijo de la lista:", servicesList.firstElementChild);
    console.log("Último hijo de la lista:", servicesList.lastElementChild);

    // ==========================================
    // 3. USO DEL OBJETO WINDOW (Petición explícita)
    // ==========================================
    console.log("URL Actual (location.href):", window.location.href);
    console.log("Posición de scroll (scrollY):", window.scrollY);

    function updateWindowSize() {
        // Mostrar propiedad innerWidth dinámicamente en pantalla
        windowInfo.textContent = `Ancho de ventana: ${window.innerWidth}px`;
    }
    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);

    // ==========================================
    // 4. CAMBIO DE TEXTO (textContent e innerHTML)
    // ==========================================
    let isChanged = false;

    btnChangeText.addEventListener("click", () => {
        if (!isChanged) {
            welcomeMessage.textContent = "¡Cita Confirmada con el Dr. Pérez!";
            mainParagraph.innerHTML = "Tu cita está agendada para la dirección: <strong>Consultorio 302</strong>.";
            isChanged = true;
        } else {
            welcomeMessage.textContent = "¡Buenos días, Cruz Elena!";
            mainParagraph.textContent = "¿Cómo te sientes hoy?";
            isChanged = false;
        }
    });

    // ==========================================
    // 5. ESTILOS: classList vs style (Con Explicación)
    // ==========================================

    /* 
      EXPLICACIÓN - MEJORES PRÁCTICAS:
      Es preferible usar classList.add/remove/toggle sobre style directos porque:
      1. Mantiene separados la estructura (HTML/JS) de la presentación (CSS).
      2. Permite reutilizar reglas completas y facilita el mantenimiento futuro del código.
    */

    // Modificación mediante classList.toggle
    btnToggleStyle.addEventListener("click", () => {
        mainSidebar.classList.toggle("dark-mode-sidebar");
    });

    // Modificación directa mediante style (Botón SOS)
    btnDirectStyle.addEventListener("click", () => {
        if (btnDirectStyle.style.backgroundColor === "orange") {
            btnDirectStyle.style.backgroundColor = "";
        } else {
            btnDirectStyle.style.backgroundColor = "orange";
        }
    });

    // ==========================================
    // 6. AGREGAR Y ELIMINAR ELEMENTOS DINÁMICOS (remove / removeChild)
    // ==========================================
    let reminderCount = 2;

    btnAdd.addEventListener("click", () => {
        reminderCount++;
        const newReminder = document.createElement("div");
        newReminder.classList.add("reminder-item");
        
        newReminder.innerHTML = `
            <span>💊 Tomar Agua #${reminderCount}</span>
            <span class="time">5:00 p.m.</span>
        `;
        
        dynamicContainer.appendChild(newReminder);
    });

    btnRemove.addEventListener("click", () => {
        const lastReminder = dynamicContainer.lastElementChild;
        if (lastReminder) {
            // Uso de remove() para eliminar el último elemento dinámico
            lastReminder.remove();
        } else {
            alert("No hay más recordatorios para eliminar.");
        }
    });

    // ==========================================
    // 7. CONSUMO DE API MEDIANTE FETCH
    // ==========================================
    btnFetchApi.addEventListener("click", () => {
        apiResult.innerHTML = "<p>Cargando datos desde la API...</p>";

        fetch("https://jsonplaceholder.typicode.com/todos/1")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la petición API");
                }
                return response.json();
            })
            .then(data => {
                // Mostrar datos consumidos en la tarjeta
                apiResult.innerHTML = `
                    <p>💊 <strong>${data.title}</strong></p>
                    <p>⏰ Estado: ${data.completed ? 'Tomado' : 'Pendiente 10:00 a.m.'}</p>
                `;
            })
            .catch(error => {
                console.error("Error API:", error);
                apiResult.innerHTML = `<p style="color:red;">Error al cargar datos de la API.</p>`;
            });
    });

});