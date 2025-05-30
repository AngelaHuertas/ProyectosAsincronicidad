async function enviarMensajeADiscord(mensaje) {
  const userId = ""; // ID del usuario 

  try {
    const res = await fetch('http://localhost:3000/send-discord', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje, userId }) // Enviamos el mensaje y el userId
    });

    const data = await res.json();

    if (data.success) {
      mostrarMensaje("✅ " + data.message);
    } else {
      mostrarMensaje("❌ " + data.message);
    }
  } catch (error) {
    console.error("Error al enviar mensaje a Discord:", error);
    mostrarMensaje("❌ " + "no se pudo conectar con el usuario");
  }
}


// Función para mostrar mensajes en la interfaz
function mostrarMensaje(mensaje) {
  const messagesContainer = document.getElementById("messages-container");
  const messageElement = document.createElement("div");
  messageElement.textContent = mensaje;
  messagesContainer.appendChild(messageElement);
}

// Ejemplo de uso
const sendButton = document.getElementById("send-button");
sendButton.addEventListener("click", () => {
  const userInput = document.getElementById("user-input").value;
  enviarMensajeADiscord(userInput);
});
