export const CONFIG = {
  yandexMapsApiKey: "d6495f04-73df-4d68-b319-31a18776e9f2",
  openWeatherMapApiKey: "c6005872ccdeb15a3c2b2276e57c93a3",
  defaultView: {
    center: [20, 0],
    zoom: 2,
  },
  supportedCurrencies: ["USD", "EUR", "KZT", "GBP", "JPY", "CNY"],
  weatherTileUrls: {
    temperature:
      "https://tile.openweathermap.org/map/temp_new/%z/%x/%y.png?appid=%apiKey%",
    wind: "https://tile.openweathermap.org/map/wind_new/%z/%x/%y.png?appid=%apiKey%",
  },
};
