import fetch from 'node-fetch';
import readline from 'readline';

const TOKEN = "token";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function resumirTexto(texto) {
  const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: texto })
  });

  const data = await response.json();
  return data[0]?.summary_text || "No se pudo generar resumen.";
}

rl.question("Introduce el texto que deseas resumir:\n", async (input) => {
  console.log("\nProcesando resumen...\n");

  try {
    const resumen = await resumirTexto(input);
    console.log("Resumen generado:\n", resumen);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    rl.close();
  }
});