// Ejercicio 3: Obtener el clima actual en Medellín desde tres APIs diferentes

// URLs de las APIs
const urlopenWttrIn = ('https://wttr.in/Medellin?format=j1')
const urlOpenMeteo = 'https://api.open-meteo.com/v1/forecast?latitude=6.25184&longitude=-75.56359&current_weather=true';
const urlMetNo = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=6.25184&lon=75.56359';

// Funciones que retornan promesas de clima

// wttr.in
const fetchWttrIn = fetch(urlopenWttrIn)
  .then(res => res.json())
  .then(data => {
    const temperatura = data.current_condition[0].temp_C;
    return {
      fuente: 'wttr.in',
      temperatura,
      unidad: '°C'
    };
  });

// Open-Meteo
const fetchOpenMeteo = fetch(urlOpenMeteo)
  .then(res => res.json())
  .then(data => ({
    fuente: 'Open-Meteo',
    temperatura: data.current_weather.temperature,
    unidad: '°C'
  }));
// MET Norway
const fetchMetNo = fetch(urlMetNo, {
  headers: {
    'User-Agent': 'clima-app-paula/1.0'
  }
})
  .then(res => res.json())
  .then(data => {

    
    const temperatura = data.properties.timeseries[0].data.instant.details.air_temperature;
    return {
      fuente: 'MET Norway',
      temperatura,
      unidad: '°C'
    };
  });


async function obtenerClima() {
  try {
    // Ejecutar Promise.race para obtener el clima de la primera API que responda
    const resultado = await Promise.race([fetchOpenMeteo, fetchMetNo, fetchWttrIn]);
    console.log(` Clima actual en Medellín desde ${resultado.fuente}: ${resultado.temperatura}${resultado.unidad}`);
  
   if (resultado.error) {
            // Si hay un error, muestra un mensaje en el DOM
            document.getElementById('weather-info').textContent = 'Error al obtener el clima desde alguna API.';
            document.getElementById('error-container').classList.remove('hidden');
        } else {
            // muestra el clima en el DOM
            const weatherInfo = document.getElementById('weather-info');
            weatherInfo.textContent = `Clima actual en Medellín desde ${resultado.fuente}: ${resultado.temperatura}${resultado.unidad}`;

            // Oculta el contenedor de error si no hay errores
            document.getElementById('error-container').classList.add('hidden');
        }

  } catch (error) {
    console.error(' Error al obtener el clima:', error.message);
  // Mostrar el error en el DOM
        const errorMessage = document.getElementById('error-message');
       document.getElementById('weather-info').textContent = 'Error al obtener el clima';
        document.getElementById('error-container').classList.remove('hidden');
    }
  
  }
// Llamar a la función para obtener el clima
window.onload = obtenerClima;
