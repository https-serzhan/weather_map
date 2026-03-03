export const CONFIG = {
  yandexMapsApiKey: "YOUR_YANDEX_MAPS_API_KEY",
  openWeatherMapApiKey: "YOUR_OPENWEATHERMAP_API_KEY",
  defaultView: {
    center: [20, 0],
    zoom: 2,
  },
  supportedCurrencies: ["USD", "EUR", "KZT", "GBP", "JPY", "CNY"],
  weatherTileUrls: {
    temperature: "https://tile.openweathermap.org/map/temp_new/%z/%x/%y.png?appid=%apiKey%",
    wind: "https://tile.openweathermap.org/map/wind_new/%z/%x/%y.png?appid=%apiKey%",
  },
};
