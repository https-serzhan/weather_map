# Global Interactive Weather Map

Vanilla JS weather map MVP with a fullscreen world map, click-to-load weather, weather tile overlays, a sliding sidebar, and a browser-side currency converter.

## Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES modules)
- Yandex Maps JS API
- Open-Meteo API
- OpenWeatherMap Tile API
- exchangerate.host API

## Structure

```text
.
├── index.html
├── css/
├── js/
│   ├── app.js
│   ├── config.js
│   ├── core/
│   ├── ui/
│   └── utils/
└── README.md
```

## Setup

1. Open `js/api-config.js`.
2. Replace `YOUR_YANDEX_MAPS_API_KEY` and `YOUR_OPENWEATHERMAP_API_KEY`.
3. Start a static server from the project root, for example:

```bash
python3 -m http.server 4173
```

4. Open `http://localhost:4173`.

## MVP Features

- Fullscreen world map
- Click any point to fetch current weather
- Sidebar with location and weather details
- Temperature and wind tile layer toggles
- Currency converter widget

## Notes

- `geocode.js` currently returns coordinate-based labels. Reverse geocoding can be added as the next step.
- Weather tile overlays require a valid OpenWeatherMap key.
