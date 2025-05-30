let index = 0; // dice cual imagen se está mostrando actualmente en el carrusel.
const contenedor = document.getElementById("contenedor"); // busca donde se contiene las imagenes
const total = contenedor.children.length; // busca y cuenta cuantos elementos tiene el contenedor        

function actualizarCarrusel() {//funcion para mover el carrusel
    contenedor.style.transform = `translateX(-${index * 100}%)`;// esto es para mover la imagen para mostrar la siguiente por medio de coordenadas
}

function anterior() { // funcion para volver a la imagen anterior
    index = (index - 1 + total) % total; // es para retroceder restando 1 segun en la imagen en que se encuentre
    actualizarCarrusel();// llama la funcion de actualizar para mover el carrusel a la nueva posición.
}

function siguiente() { //funcion es para ir a la imagen siguiente.
    index = (index + 1) % total; // es para avanzar sumando 1 segun en la imagen en que se encuentre
    actualizarCarrusel();//Mueve el carrusel a la nueva posición.
}

window.addEventListener("load", actualizarCarrusel); // Cuando la página termine de cargarse, se llama a actualizarCarrusel() para asegurar que todo se vea bien desde el inicio.
window.addEventListener("resize", actualizarCarrusel);// Si el usuario cambia el tamaño de la ventana (por ejemplo en el celular), esto ajusta la posición del carrusel para que se mantenga bien centrado.

