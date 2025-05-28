const express = require('express');
const path = require('path');
const crearArchivos = require('./logica.js');

const app = express();
const PORT = 5500;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/crear', async (req, res) => {
    const { cantidad } = req.body;
    console.log("Cantidad recibida:", cantidad); 

    try {
        await crearArchivos(cantidad);
        res.json({ mensaje: `✅ Se crearon ${cantidad} archivos.` });
    } catch (err) {
        console.error("Error creando archivos:", err); 
        res.status(500).json({ mensaje: '❌ Error al crear archivos.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});
