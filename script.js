

// Se verifica si ya se encuentra almacenado en memoria el string con listado de letras permitidas.
if (localStorage.getItem("JSON_stringAbecedario") === null) {

    // En caso negativo (primera ejecución histórica), se almacena lista de letras en memoria para posteriores ejecuciones del sitio.   
    localStorage.setItem("JSON_stringAbecedario", '["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]');

}

// Se arma array con letras permitidas, a partir de contenido recuperado desde local storage.
const array_Abecedario = JSON.parse(localStorage.getItem("JSON_stringAbecedario"));


let obj_progreso = {};
let palabra_elegida = '';
let errores = 0;
let images = [];



//-------------- DEFINICIÓN DE FUNCIONES

// Búsqueda de caracter dentro de string y retorno de posiciones con acierto.
function getIndicesOf(searchStr, str) {

    let startIndex = 0;
    let indices = [];

    if (searchStr.length === 0) {

        // Si no hay acierto de la letra en la palabra, se retorna array vacío.
        return [];

    } else {   ///

        while ((x = str.indexOf(searchStr, startIndex)) > -1) {

            // Si letra se encuentra contenida en string, se 'descubre' dentro del objeto de progreso, añadiendo entrada.        
            indices.push(x);
            startIndex = x + searchStr.length;

        }

        return indices;

    }

}


// Función para pre-carga de imágenes.
function preload() {
    for (let i = 0; i < arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload.arguments[i];

    }
}


// Función que retorna valor comprendido entre 0 y X (parámetro MAX de entrada)
function getRandomInt(max) {

    return Math.floor((Math.random() * max));

}


// Función para lectura de listado de animales desde archivo JSON.
async function consultarAnimales() {

    const response = await fetch('./animales.json');
    const animales = await response.json();

    return animales;

}



// Se pasan rutas de imágenes a pre-cargarse en la memoria.
preload(
    "./images/avance_0.png",
    "./images/avance_1.png",
    "./images/avance_2.png",
    "./images/avance_3.png",
    "./images/avance_4.png",
    "./images/avance_5.png",
    "./images/avance_6.png"
)


// Declaración de constantes para elementos de pantalla.
const cont_div1 = document.getElementById("div1");
const cont_div2 = document.getElementById("div2");
const cont_div3 = document.getElementById("div3");
const cont_div4 = document.getElementById("div4");


cont_div1.innerHTML = `<input id ="refresh" type="image" src="./images/repeat.svg"  class="button buttonHover"/>`;
cont_div2.innerHTML = `<img src="${images[errores].src}"></img>`;
cont_div3.innerHTML = `<p id="palabra" class="palabra">`;


// Llamado a función para obtención de listado de animales y selección de animal individual a adivinar.
consultarAnimales().then(animales => {

    // Llamado a función para elección aleatoria de palabra del array.
    palabra_elegida = animales[getRandomInt(animales.length)].nombre.toUpperCase();


    // Se arma objeto con X cantidad de propiedades, de acuerdo a X cantidad de letras posee la palabra elegida aleatoriamente.
    for (let a = 0; a < palabra_elegida.length; a++) {

        let campo = 'letra_' + a;

        Object.defineProperty(obj_progreso, campo, { value: '_', enumerable: true, writable: true });

        // Se aprovecha la cantidad de iteraciones para imprimir ayuda visual en pantalla.
        cont_div3.innerHTML += `_ `;

    }

})


cont_div3.innerHTML += `</p>`;

array_Abecedario.forEach((element, index) => {

    // Se arma variable con nombre de botón a crearse en iteración actual del array.
    const nombreBoton = `btn_${index}`;

    cont_div4.innerHTML += `<button id="${nombreBoton}" class="button buttonHover">${element}</button>`;

})



//-------------- LÓGICA DE EVENTOS DE USUARIO

// Reinicio del juego.
cont_div1.onclick = (e) => {

    if (e.target.id == 'refresh') {
        location.reload()
    }

}


// Selección de letra a adivinar.
cont_div4.onclick = (e) => {

    // Se verifica que elemento clickeado sea de tipo botón.
    if (e.target.nodeName == 'BUTTON') {

        let btn = document.getElementById(e.target.id);

        btn.disabled = true;                        // Luego de presionar un botón, se deshabilita su uso.
        btn.classList.remove("buttonHover");        // Se deshabilita la clase que realiza la animación de resaltado del botón.


        if (palabra_elegida.includes(e.target.textContent)) {

            btn.classList.add('buttonOK');          // Se asocia clase a botón, la cual provoca que se pinte de verde (acierto correcto).  

            // Se obtienen posiciones de aciertos de la letra dentro de la palabra.
            let indices = getIndicesOf(e.target.textContent, palabra_elegida);

            for (let i = 0; i < indices.length; i++) {

                // Dentro del objeto de progreso, se descubren las posiciones de la letra correcta adivinada.
                campo = 'letra_' + indices[i];
                obj_progreso[campo] = e.target.textContent;

            }


            // Se verifica si palabra aún posee letras pendientes a adivinar.   
            if (!(Object.values(obj_progreso).includes('_'))) {

                // Impresión final del progreso (palabra completa)           
                console.log(Object.values(obj_progreso));
                victoria = 'X';

                // Se deshabilita el uso de todas las letras y su animación de resaltado.
                array_Abecedario.forEach((element, index) => {

                    nombreBoton = `btn_${index}`;
                    btn = document.getElementById(nombreBoton);
                    btn.disabled = true;
                    btn.classList.remove("buttonHover");

                })

                // Se muestra mensaje de fin de juego exitoso.
                Swal.fire({
                    title: '¡Felicitaciones!',
                    text: `El animal era: ${palabra_elegida}`,
                    icon: 'success',
                    color: 'green',
                    background: '#d2eede',
                    iconColor: 'green',
                    customClass: 'swal-border-ok',
                    allowOutsideClick: false,

                })

            }


        } else {

            errores++;
            btn.classList.add('buttonError');       // Se asocia clase a botón, la cual provoca que se pinte de rojo (elección errónea).       

        }

        cont_div1.innerHTML = `<input id ="refresh" type="image" src="./images/repeat.svg" class="button buttonHover"/> `;
        cont_div2.innerHTML = `<img src="${images[errores].src}"></img>`;
        cont_div3.innerHTML = `<p id="palabra" class="palabra">`;


        // Se refresca impresión de progreso en pantalla.
        for (let a = 0; a < palabra_elegida.length; a++) {

            campo = 'letra_' + a;
            cont_div3.innerHTML += `${obj_progreso[campo]} `;

        }

        cont_div3.innerHTML += `</p>`;


        // Se verifica si se ha alcanzado la cantidad máxima de errores posibles. 
        if (errores == 6) {

            array_Abecedario.forEach((element, index) => {

                // Se arma variable con nombre de botón a crearse en iteración actual del array.
                nombreBoton = `btn_${index}`;
                btn = document.getElementById(nombreBoton);
                btn.disabled = true;                        // Luego de presionar un botón, se deshabilita su uso.
                btn.classList.remove("buttonHover");        // Se deshabilita la clase que realiza la animación de resaltado del botón.

            })


            // Se muestra mensaje de fin de juego fallido.
            Swal.fire({
                title: '¡Mejor suerte para la próxima!',
                text: `El animal era: ${palabra_elegida}`,
                icon: 'error',
                background: '#ffe7e4',
                iconColor: 'red',
                customClass: 'swal-border-error',
                allowOutsideClick: false,

            })

        }

    }

}