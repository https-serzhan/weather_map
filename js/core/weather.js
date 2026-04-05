import { fetchJSON } from "../utils/api.js";
import { describeWeatherCode } from "../utils/format.js";

export async function getCurrentWeather(lat, lon) {
  const url = new URL("https://api.openweathermap.org/data/2.5/weather");

  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("appid", "5bcecb727a605c8c9f42480e012392a8");

  try {
    const data = await fetchJSON(url.toString());
    console.log(data); // Чекаем, что выдает
    const current = data.weather;

    if (!current) {
      throw new Error("Current weather payload is missing.");
    }

    return {
      temperature: Math.round(((data.main.temp - 273.15) * 100) / 100),
      windSpeed: data.wind.speed,
      // weatherCode: current.weathercode,
      // description: describeWeatherCode(current.weathercode),
    };
  } catch (error) {
    throw new Error(`Unable to load weather data. ${error.message}`);
  }
}
