document.addEventListener("DOMContentLoaded", () => {
    const btnCrear = document.getElementById("btnCrear");
    const estado = document.getElementById("estado");
    const inputCantidad = document.getElementById("cantidad");

    btnCrear.addEventListener("click", async () => {
        const cantidad = parseInt(inputCantidad.value);

        if (!cantidad || cantidad <= 0) {
            estado.textContent = "❗ Ingresa una cantidad válida.";
            return;
        }

        estado.textContent = "⌛ Creando archivos...";

        try {
            const res = await fetch('/crear', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cantidad })
            });

            const data = await res.json();
            estado.textContent = data.mensaje;
        } catch (error) {
            estado.textContent = "❌ Error en la conexión.";
        }
    });
});
