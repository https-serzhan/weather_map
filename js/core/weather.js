import { CONFIG } from "../config.js";
import { fetchJSON } from "../utils/api.js";

function resolveWeatherApiKey() {
  return CONFIG.openWeatherMapApiKey || CONFIG.openWeatherMapTilesApiKey;
}

export async function getCurrentWeather(lat, lon) {
  const apiKey = resolveWeatherApiKey();

  if (!apiKey || apiKey.includes("YOUR_")) {
    throw new Error("OpenWeatherMap API key is missing.");
  }

  const url = new URL(CONFIG.openWeatherMapWeatherUrl);

  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("appid", apiKey);
  url.searchParams.set("units", CONFIG.weatherUnits);
  url.searchParams.set("lang", CONFIG.weatherLanguage);

  try {
    const data = await fetchJSON(url.toString(), {
      timeoutMs: CONFIG.requestTimeoutMs,
    });
    const primaryWeather = data.weather?.[0];

    if (!data.main || !data.wind || !primaryWeather) {
      throw new Error("Current weather payload is missing expected fields.");
    }

    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: Number(data.wind.speed ?? 0),
      windDirection: data.wind.deg,
      name: data.name,
      country: data.sys?.country,
      weatherCode: primaryWeather.id,
      description: primaryWeather.description,
      iconUrl: primaryWeather.icon
        ? `https://openweathermap.org/img/wn/${primaryWeather.icon}@2x.png`
        : null,
    };
  } catch (error) {
    throw new Error(`Unable to load weather data. ${error.message}`);
  }
}
