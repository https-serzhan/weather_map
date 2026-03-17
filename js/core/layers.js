import { CONFIG } from "../config.js";
import { addTileLayer, removeTileLayer } from "./map.js";

const activeLayers = new Set();

function getTemplate(key) {
  const template = CONFIG.weatherTileUrls[key];

  if (!template || !CONFIG.openWeatherMapApiKey || CONFIG.openWeatherMapApiKey.includes("YOUR_")) {
    throw new Error("OpenWeatherMap API key is missing in js/api-config.js");
  }

  return template.replace("%apiKey%", CONFIG.openWeatherMapApiKey);
}

export function addTemperatureLayer() {
  addTileLayer("temperature", getTemplate("temperature"));
  activeLayers.clear();
  activeLayers.add("temperature");
}

export function addWindLayer() {
  addTileLayer("wind", getTemplate("wind"));
  activeLayers.clear();
  activeLayers.add("wind");
}

export function removeLayer(name) {
  removeTileLayer(name);
  activeLayers.delete(name);
}

export function toggleLayer(name) {
  if (activeLayers.has(name)) {
    removeLayer(name);
    return false;
  }

  if (name === "temperature") {
    addTemperatureLayer();
  } else if (name === "wind") {
    addWindLayer();
  } else {
    throw new Error(`Unknown layer: ${name}`);
  }

  return true;
}

export function getActiveLayerNames() {
  return [...activeLayers];
}
