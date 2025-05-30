async function sendToGemini() { //CREA LA FUNCION- async declara la funcion como asíncrona 
    const responseContainer = document.getElementById('messages-container'); // busca caja para resultado
    const loader = document.getElementById('loader');                       // busca animación de carga
    const userInput = document.getElementById('user-input').value;          // lee texto del usuario

    // verifica si el usuario no escribió nada
    if (!userInput.trim()) {
        responseContainer.textContent = "Escribe algo para poder clasificar.";
        return; // detiene la función
    }

    responseContainer.textContent = "";
    loader.style.display = 'block';          // muestra el loader mientras llega respuesta

    try {
        // llama al backend en lugar de a Gemini directamente
        const res = await fetch('/api/gemini', {
            method: 'POST',                                        // método POST
            headers: { 'Content-Type': 'application/json' },       // cuerpo en JSON
            body: JSON.stringify({ input: userInput })             // envía { input: "tu texto" }
        });

        loader.style.display = 'none';       // oculta loader al recibir respuesta

        // si tu servidor devolvió un error HTTP
        if (!res.ok) {
            const err = await res.json();
            responseContainer.textContent = `Error: ${err.error}`;
            return;                             // detiene aquí
        }

        const data = await res.json();        // parsea { result: "positivo" }
        const raw = data.result || "";
        const clasificacion = raw.toLowerCase().trim(); // normaliza

        responseContainer.textContent = clasificacion;  // muestra el texto

        // guarda en sessionStorage si es positivo/negativo/neutral
        if (["positivo", "negativo", "neutral"].includes(clasificacion)) {
            sessionStorage.setItem("clasificacion", clasificacion);
            sessionStorage.setItem("comentario", userInput);
            window.open("./templates/gracias.html", "_blank"); // abre página de gracias
        }
        // si no tiene que ver con ropa, se muestra el comentario en la caja de texto
        else if (clasificacion === "el comentario no tiene que ver con el producto") {
        }
        else {
            console.warn("Respuesta inesperada:", raw); // alerta en consola
        }

    } catch (e) {                             // captura fallos de conexión
        loader.style.display = 'none';
        console.error("Error de conexión:", e);
        responseContainer.textContent = "Error al conectar con el servidor.";
    }
}
