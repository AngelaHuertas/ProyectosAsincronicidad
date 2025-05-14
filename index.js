const fs = require('fs').promises;

async function crearArchivos(cantidad) {
    const tareas = [];

    for (let i = 1; i <= cantidad; i++) {
        const nombre = `archivo_${i}.txt`;
        const contenido = `Este es el contenido del archivo número ${i}`;
        tareas.push(fs.writeFile(nombre, contenido));
    }

    await Promise.all(tareas);
    console.log(`Se crearon ${cantidad} archivos.`);
}

crearArchivos(10).catch(console.error, "Hay un error");