import { CONFIG } from "../config.js";
import { clearActiveTileLayer, setActiveTileLayer } from "./map.js";

const activeLayers = new Set();

function resolveTilesApiKey() {
  return CONFIG.openWeatherMapTilesApiKey || CONFIG.openWeatherMapApiKey;
}

function getTemplate(layerName) {
  const template = CONFIG.weatherTileUrls[layerName];
  const apiKey = resolveTilesApiKey();

  if (!template) {
    throw new Error(`Unknown weather layer: ${layerName}`);
  }

  if (!apiKey || apiKey.includes("YOUR_")) {
    throw new Error("OpenWeatherMap weather tiles key is missing.");
  }

  return template.replace("%apiKey%", apiKey);
}

export function toggleLayer(layerName) {
  if (activeLayers.has(layerName)) {
    removeLayer(layerName);
    return false;
  }

  const template = getTemplate(layerName);

  clearActiveTileLayer();
  activeLayers.clear();

  setActiveTileLayer(layerName, template);
  activeLayers.add(layerName);
  renderLegend(layerName);

  return true;
}

export function removeLayer(layerName) {
  if (!activeLayers.has(layerName)) {
    return;
  }

  clearActiveTileLayer();
  activeLayers.delete(layerName);
  removeLegend();
}

function renderLegend(layerName) {
  let legend = document.getElementById("weather-legend");

  if (!legend) {
    legend = document.createElement("div");
    legend.id = "weather-legend";
    legend.className = "weather-legend";
    document.querySelector(".map-stage").append(legend);
  }

  const titles = {
    temperature: "Temperature (deg C)",
    wind: "Wind speed (m/s)",
  };

  const scales = {
    temperature: "temp-scale",
    wind: "wind-scale",
  };

  const labels = {
    temperature:
      "<span>-40</span><span>-20</span><span>0</span><span>20</span><span>40+</span>",
    wind: "<span>0</span><span>2</span><span>10</span><span>20</span><span>60+</span>",
  };

  legend.innerHTML = `
    <div class="legend-title">${titles[layerName]}</div>
    <div class="legend-scale ${scales[layerName]}"></div>
    <div class="legend-labels">${labels[layerName]}</div>
  `;
  legend.hidden = false;
}

function removeLegend() {
  const legend = document.getElementById("weather-legend");

  if (legend) {
    legend.hidden = true;
  }
}

export function getActiveLayerNames() {
  return [...activeLayers];
}
