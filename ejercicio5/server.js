import express from 'express';         // importa Express para crear el servidor
import dotenv from 'dotenv';           // para leer variables de entorno desde .env
import fetch from 'node-fetch';        // para hacer peticiones HTTP a la API de Gemini
import cors from 'cors';               // para permitir solicitudes desde el navegador

dotenv.config();                       // carga GEMINI_API_KEY desde .env
const app = express();
const PORT = process.env.PORT || 3000; // el puerto donde correrá el servidor

app.use(cors());                       // habilita CORS para que el frontend pueda llamar
app.use(express.json());               // para entender JSON en los cuerpo de las peticiones
app.use(express.static('public'));     // sirve todo lo que esté dentro de /public

// RUTA POST que recibe tu comentario y llama a Gemini de forma segura
app.post('/api/gemini', async (req, res) => {
    try {
        const userInput = req.body.input; // toma el texto que envía el frontend
        // crea el prompt para la IA, concatenando tu mensaje
        const prompt = `
Clasifica el siguiente comentario exclusivamente como positivo, negativo o neutral,
solo si se refiere a un producto de ropa (camisetas, pantalones, zapatos, etc.).
Si el comentario no está relacionado con ropa, responde exactamente:
"El comentario no tiene que ver con el producto".
Tu respuesta debe ser **solo** una de estas opciones:
"positivo", "negativo", "neutral", o
"El comentario no tiene que ver con el producto",
sin añadir explicaciones.
${userInput}`;

        const apiKey = process.env.GEMINI_API_KEY; // tu token está SOLO en el servidor
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const requestBody = { contents: [{ parts: [{ text: prompt }] }] };

        // envío de la petición a la API de Gemini
        const response = await fetch(API_URL, {
            method: 'POST',                          // método POST para enviar datos
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)      // cuerpo en JSON con el prompt
        });

        // si Gemini responde con error, retornamos el código y el mensaje
        if (!response.ok) {
            const err = await response.json();
            return res
                .status(response.status)
                .json({ error: err.error?.message || 'error desconocido' });
        }

        const data = await response.json();       // parsea la respuesta de Gemini
        // extrae el texto de la IA, o cadena vacía si falla
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text.trim() || '';
        res.json({ result: text });               // envía solo la clasificación al frontend

    } catch (error) {
        console.error('Error al llamar a Gemini:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
