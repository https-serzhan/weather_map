import { CONFIG } from "../config.js";
import { addTileLayer, removeTileLayer } from "./map.js";

const activeLayers = new Set();

function getTemplate(key) {
  const template = CONFIG.weatherTileUrls[key];

  if (
    !template ||
    !CONFIG.openWeatherMapApiKey ||
    CONFIG.openWeatherMapApiKey.includes("YOUR_")
  ) {
    console.warn("Внимание: Проверьте API-ключ OpenWeatherMap в config.js");
    return null;
  }

  return template.replace("%apiKey%", CONFIG.openWeatherMapApiKey);
}

export function toggleLayer(name) {
  if (activeLayers.has(name)) {
    removeLayer(name);
    return false;
  }

  // Очищение активных слоев перед выбором нового
  [...activeLayers].forEach((layer) => {
    removeLayer(layer);
  });

  const template = getTemplate(name);
  if (!template) return false;

  try {
    const targetMap = window.map;

    if (!targetMap) {
      console.error("Объект карты не найден в window.map");
      return false;
    }

    const newLayer = new ymaps.Layer(template, {
      projection: ymaps.projection.sphericalMercator,
      zIndex: 1000,
      transparent: true,
      opacity: 0.3,
    });

    if (!window.weatherLayers) window.weatherLayers = {};
    window.weatherLayers[name] = newLayer;

    // Наложение слоя поверх основной карты
    targetMap.layers.add(newLayer);

    activeLayers.add(name);
    renderLegend(name);
    return true;
  } catch (e) {
    console.error("Ошибка при добавлении слоя:", e);
    return false;
  }
}

export function removeLayer(name) {
  if (window.weatherLayers && window.weatherLayers[name] && window.map) {
    window.map.layers.remove(window.weatherLayers[name]);
    delete window.weatherLayers[name];
  }
  activeLayers.delete(name);
  removeLegend();
}

// Отрисовка визуальной шкалы (легенды)
function renderLegend(type) {
  let legend = document.getElementById("weather-legend");

  if (!legend) {
    legend = document.createElement("div");
    legend.id = "weather-legend";
    legend.className = "weather-legend";
    document.querySelector(".map-stage").appendChild(legend);
  }

  const titles = {
    temperature: "Temperature (°C)",
    wind: "wind speed (m/s)",
  };

  const scales = { temperature: "temp-scale", wind: "wind-scale" };

  const labels = {
    temperature:
      "<span>-40</span><span>-20</span><span>0</span><span>+20</span><span>+40</span>",
    wind: "<span>0</span><span>2</span><span>10</span><span>20</span><span>60</span>",
  };

  legend.innerHTML = `
    <div class="legend-title">${titles[type]}</div>
    <div class="legend-scale ${scales[type]}"></div>
    <div class="legend-labels">${labels[type]}</div>
  `;

  legend.style.display = "block";
}

// Скрытие шкалы
function removeLegend() {
  const legend = document.getElementById("weather-legend");
  if (legend && activeLayers.size === 0) {
    legend.style.display = "none";
  }
}

export function getActiveLayerNames() {
  return [...activeLayers];
}
