# Global Interactive Weather Map

Frontend-only weather map built with vanilla JavaScript and the Yandex Maps JS API.

## What It Does

- Renders a fullscreen interactive world map
- Lets users click anywhere to inspect current weather
- Resolves clicked coordinates into human-readable locations with Yandex geocoding
- Overlays OpenWeatherMap temperature and wind tiles
- Includes a browser-side currency converter backed by Frankfurter

## Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES modules)
- Yandex Maps JS API
- OpenWeatherMap Current Weather API
- OpenWeatherMap Weather Tiles API
- Frankfurter currency API

## Run Locally

1. Start a static server from the project root:

```bash
python3 -m http.server 4173
```

2. Open `http://localhost:4173`.

## Configuration

API settings live in `js/config.js`.

Current frontend configuration expects:

- `yandexMapsApiKey`
- `openWeatherMapApiKey`
- `openWeatherMapTilesApiKey`

This project is intentionally frontend-only, so any API key used here is visible in the browser. For production use, protect sensitive APIs behind a backend proxy and apply domain/referrer restrictions wherever the provider supports them.

## Notes

- The currency widget uses Frankfurter because it works client-side without an API key.
- OpenWeatherMap is used both for current weather data and weather tile overlays.
- If you want stricter key separation later, `openWeatherMapApiKey` and `openWeatherMapTilesApiKey` are already split in config.
