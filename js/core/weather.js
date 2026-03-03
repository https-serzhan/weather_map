import { fetchJSON } from "../utils/api.js";
import { describeWeatherCode } from "../utils/format.js";

export async function getCurrentWeather(lat, lon) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lon);
  url.searchParams.set("current_weather", "true");

  try {
    const data = await fetchJSON(url.toString());
    const current = data.current_weather;

    if (!current) {
      throw new Error("Current weather payload is missing.");
    }

    return {
      temperature: current.temperature,
      windSpeed: current.windspeed,
      weatherCode: current.weathercode,
      description: describeWeatherCode(current.weathercode),
    };
  } catch (error) {
    throw new Error(`Unable to load weather data. ${error.message}`);
  }
}
