// **Script**

// Constante para recuperar el elemento contenedor bienvenida
/** @type {HTMLElement} */
const div = document.getElementById("contenedor-bienvenida");
// **Constantes para el contenido dinámico en el contenedor de bienvenida**
// Constante para escribir el h2  
/** @type {HTMLHeadingElement} */
const h2 = document.createElement("h2");
// Constante para escribir el p 
/** @type {HTMLParagraphElement} */
const p = document.createElement("p");

// **Funcionalidad para cambiar el color seleccionado por el usuario (aplicado al body)**  
// Constante para recuperar el body
/** @type {HTMLElement} */
const body = document.body;
// Get componente del input de color (la rueda de color)
/** @type {HTMLInputElement} */
const colorInput = document.getElementById("color");
// Escuchador de evento de botón
colorInput.addEventListener("input", () => {
    // Aplicar color seleccionado por el usuario    
    document.body.style.backgroundColor = colorInput.value;
});

// **Funcionalidad para modificar tema**
// Get input del selector de tema
/** @type {HTMLSelectElement} */
const modoInput = document.getElementById("modo");
// Añadir escuchador para comprobar si cambia el selector
modoInput.addEventListener("change", () => {
    // Si el usuario selecciona el modo oscuro, añadir clase de modo oscuro
    if (modoInput.value === "oscuro") {
        body.classList.add("oscuro");
    }
    // Si no selecciona el oscuro, utilizar el claro eliminando el oscuro
    else {
        body.classList.remove("oscuro");
    }
});

// **Acción del botón Guardar Preferencias** 
// Constante para el botón de Guardar
/** @type {HTMLButtonElement} */
const botonGuardar = document.getElementById("boton-guardar");
// Constantes para recuperar cada campo correspondiente a una cookie
/** @type {HTMLInputElement} */
const nombreInput = document.getElementById("nombre");
// const colorInput = document.getElementById("color"); Este ya está declarado arriba
// const modoInput = document.getElementById("modo"); Este ya está declarado arriba

// Escuchador de eventos del botón Guardar y funcionalidad de guardar cookies
botonGuardar.addEventListener("click", () => {
    // Constantes para calcular fecha de expiración en 7 días
    /**@type {Date} */
    const date = new Date();
    /**@type {number} */
    const sum = 7;
    /**@type {Date} */
    const newDate = new Date();
    // Comprobar fecha actual con log por consola
    console.log(date);
    // Obtener la fecha de expiración de las cookies (dentro de 7 días)
    newDate.setDate(date.getDate() + sum);
    // Comprobar fecha nueva con log por consola
    console.log(newDate);
    // Constantes para recuperar el valor de cada cookie
    const nombre = nombreInput.value;
    const color = colorInput.value;
    const modo = modoInput.value;
    // Si se ha pulsado el botón Guardar preferencias, guardar las cookies
    document.cookie = `nombre=${encodeURIComponent(nombre)}; expires=${newDate.toUTCString()}; path=/`;
    document.cookie = `color=${encodeURIComponent(color)}; expires=${newDate.toUTCString()}; path=/`;
    // Cookie modo es de sesión, así que no se configurará expires
    document.cookie = `modo=${encodeURIComponent(modo)}; path=/`;
    // Mostrar el mensaje de bienvenida tras haber pulsado el botón y guardar las cookies
    createWelcomeMessage(nombre);
});

// **Acción del botón Restablecer Interfaz**
// Constante para el botón de Restablecer Interfaz
/** @type {HTMLButtonElement} */
const botonReset = document.getElementById("boton-reset");

// Escuchador de eventos del botón al pulsar el botón Restablecer
botonReset.addEventListener("click", () => {
    // Si se ha pulsado el botón Restablecer Interfaz, aplicar fecha pasada para que expiren y se eliminen las preferencias guardadas
    document.cookie = `nombre=; expires=Sun, 01 Nov 2026 00:00:00 UTC; path=/`;
    document.cookie = `color=; expires=Sun, 01 Nov 2026 00:00:00 UTC; path=/`;
    // La cookie de modo es de sesión, pero se elimina manualmente de todas formas
    document.cookie = `modo=; expires=Sun, 01 Nov 2026 00:00:00 UTC; path=/`;

    // Eliminar el color de fondo, resetando a que el estilo quede vacío y se aplique el CSS por defecto
    body.style.backgroundColor = "";
    // Eliminar el tema aplicado
    body.classList.remove("oscuro");
    // Eliminar el mensaje de bienvenida borrando los dos elementos
    if (div.contains(h2)) {
        div.removeChild(h2);
        div.removeChild(p);
    }
    // Resetear los campos del formulario
    nombreInput.value = "";
    colorInput.value = "#ffffff"; // En este caso, resetear es devolver el fondo a blanco
    modoInput.value = "";
});

/**
 * Función para cargar la página cargando el DOM con su contenido
 * La función carga las cookies llamando a la función que recoge las cookies guardadas y las aplica.
 * También llama a la función para crear el mensaje personalizado, pintándolo e incluyendo el nombre guardado por el usuario
 * @returns {void}
 */
function loadDOM() {
    // Escuchador de evento de cargar el DOM
    document.addEventListener("DOMContentLoaded", () => {
        // Cargar las cookies guardadas en la página
        loadCookies();
        // Pintar el mensaje de bienvenida pasando el valor del input (nombre del usuario) cargado por las cookies
        createWelcomeMessage(nombreInput.value);
    });
}

/**
 * Función para cargar cookies
 * Recupera las cookies almacenadas para los campos nombre, color y modo en el formulario
 * Si revisa el campo y existe porque el usuario así lo ha seleccionado, asigna el valor y lo guarda
 * @returns {void}
 */
function loadCookies() {
    //Constantes para recuperar las cookies
    const nombre = getCookie("nombre");
    const color = getCookie("color");
    const modo = getCookie("modo");
    // **Cargar las preferencias almacenadas en las cookies al cargar la página**
    // Si el nombre existe, asignarlo al campo de nombre
    if (nombre) {
        nombreInput.value = nombre;
    }
    // Si el color existe, aplicarle el color de fondo al body
    if (color) {
        document.body.style.backgroundColor = color;
    }
    // Si ha seleccionado un modo, aplicarle el que haya seleccionado
    if (modo) {
        modoInput.value = modo;
        if (modo === "oscuro") {
            body.classList.add("oscuro");
        }
        else {
            body.classList.remove("oscuro");
        }
    }
}

/**
 * Función para crear el mensaje de bienvenida. Si el usuario se ha registrado con un nombre, se detecta y se pinta el mensaje de bienvenida insertando los elementos h2 y p en el HTML. Si no se introduce nombre, se muestra "invitado".
 * @param {string} [nombre] - Nombre del usuario a mostrar en el mensaje de bienvenida.
 * @returns {void} No devuelve nada
 */
function createWelcomeMessage(nombre) {
    // Si el usuario no ha introducido nombre o está vacío, asignar "invitado" a nombre
    nombre = nombre || "invitado";
    // Escribir contenido en los elementos del contenedor
    h2.textContent = "Generación Dinámica del DOM";
    p.textContent = `Bienvenido al registro del formulario, ${nombre}. Te has registrado correctamente y puedes hacer uso de nuestras funciones. Gracias por tu tiempo y diviértete.`;
    // Añadir los dos elementos creados al contenedor vacío si no lo están
    if (!div.contains(h2)) {
        div.appendChild(h2);
        div.appendChild(p);
    }
}

/**
 * Función para devolver cookie, que descompone la string de cookies y busca la que se quiere devolver, encontrándola, decodificándola y devolviéndola
 * @param {string} nombre - Nombre (clave) de la cookie a buscar.
 * @returns {string|null} Devuelve cookie descompuesta de acuerdo al tipo que le entró por parámetro o null si no existe.
 */
function getCookie(nombre) {
    const pares = document.cookie.split("; ");
    for (let par of pares) {
        const [clave, valor] = par.split("=");
        if (clave === nombre) {
            return decodeURIComponent(valor);
        }
    }
    return null;
}

// Llamar a la función loadDOM para cargar el DOM
loadDOM();
