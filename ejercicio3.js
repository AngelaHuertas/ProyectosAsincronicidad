function mostrarHoraActual() {
  const ahora = new Date();
  const hora = ahora.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  document.getElementById('hora-actual').textContent = `🕒 Hora actual: ${hora}`;
}

// URLs de las APIs
const urlWttrIn = 'https://wttr.in/Medellin?format=j1';
const urlOpenMeteo = 'https://api.open-meteo.com/v1/forecast?latitude=6.25184&longitude=-75.56359&current_weather=true';
const urlMetNo = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=6.25184&lon=75.56359';

// Fetch desde wttr.in
const fetchWttrIn = fetch(urlWttrIn)
  .then(res => res.json())
  .then(data => {
    const current = data.current_condition[0];
    const probPrecipitacion = data.weather[0]?.hourly[0]?.chanceofrain || 0;
    return {
      fuente: 'wttr.in',
      temperatura: current.temp_C,
      unidad: '°C',
      probprecipitacion: probPrecipitacion,
      humedad: current.humidity,
      viento: current.windspeedKmph
    };
  });

// Fetch desde Open-Meteo
const fetchOpenMeteo = fetch(urlOpenMeteo)
  .then(res => res.json())
  .then(data => {
    return {
      fuente: 'Open-Meteo',
      temperatura: data.current_weather.temperature,
      unidad: '°C',
      probprecipitacion: 0, // No disponible en esta API
      humedad: 0, // No disponible en current_weather
      viento: data.current_weather.windspeed
    };
  });

// Fetch desde MET Norway
const fetchMetNo = fetch(urlMetNo, {
  headers: {
    'User-Agent': 'clima-app-paula/1.0'
  }
})
  .then(res => res.json())
  .then(data => {
    const ts = data.properties.timeseries[0];
    return {
      fuente: 'MET Norway',
      temperatura: ts.data.instant.details.air_temperature,
      unidad: '°C',
      probprecipitacion: ts.data.next_12_hours?.summary?.precipitation_amount || 0,
      humedad: ts.data.instant.details.relative_humidity,
      viento: ts.data.instant.details.wind_speed
    };
  });

const loader = document.getElementById('loader');
const botonActualizar = document.getElementById('actualizar-btn');

async function obtenerClima() {
  loader.style.display = 'block';
  try {
    const resultado = await Promise.race([fetchOpenMeteo, fetchMetNo, fetchWttrIn]);

    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = `
      <strong>Clima actual en Medellín desde ${resultado.fuente}:</strong><br>
      🌡️ Temperatura: ${resultado.temperatura}${resultado.unidad}<br>
      🌧️ Probabilidad de lluvia: ${resultado.probprecipitacion} mm<br>
      💧 Humedad: ${resultado.humedad}%<br>
      🌬️ Viento: ${resultado.viento} m/s
    `;

    document.getElementById('error-container').classList.add('hidden');
  } catch (error) {
    console.error('Error al obtener el clima:', error.message);
    document.getElementById('weather-info').textContent = 'Error al obtener el clima.';
    document.getElementById('error-container').classList.remove('hidden');
    document.getElementById('error-message').textContent = error.message;
  } finally {
    loader.style.display = 'none';
  }
}

// Ejecutar al cargar la página
window.onload = () => {
  obtenerClima();
  setInterval(mostrarHoraActual, 1000);
};

// Evento del botón
botonActualizar.addEventListener('click', obtenerClima);
