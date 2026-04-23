import { CONFIG } from "../config.js";
import { createEmitter } from "../utils/events.js";

const mapEvents = createEmitter();

let map = null;
let currentMarker = null;
let activeWeatherLayer = null;
let activeWeatherLayerName = null;

function getLatitudeBounds() {
  const fallbackBounds = [-70, 70];
  const configuredBounds = CONFIG.worldBounds;

  if (!Array.isArray(configuredBounds) || configuredBounds.length < 2) {
    return fallbackBounds;
  }

  const minLat = configuredBounds[0]?.[0];
  const maxLat = configuredBounds[1]?.[0];

  if (typeof minLat !== "number" || typeof maxLat !== "number") {
    return fallbackBounds;
  }

  return [minLat, maxLat];
}

function assertYandexMaps() {
  if (!window.ymaps) {
    throw new Error("Yandex Maps JS API is not available.");
  }
}

function ensureMapReady() {
  if (!map) {
    throw new Error("Map is not initialized.");
  }
}

function emitLocationSelected(coords) {
  mapEvents.emit("location:selected", {
    lat: coords[0],
    lon: coords[1],
  });
}

function handleMapClick(event) {
  const coords = event.get("coords");

  addMarker(coords[0], coords[1]);
  emitLocationSelected(coords);
}

function handleBoundsChange() {
  if (!map) {
    return;
  }

  const center = map.getCenter();

  if (!Array.isArray(center) || center.length < 2) {
    return;
  }

  const [minLat, maxLat] = getLatitudeBounds();
  let lat = center[0];
  const lon = center[1];

  if (lat < minLat) {
    lat = minLat;
  }

  if (lat > maxLat) {
    lat = maxLat;
  }

  if (lat !== center[0]) {
    map.setCenter([lat, lon], map.getZoom(), {
      duration: 0,
    });
  }
}

function createMap(containerId = "map") {
  if (map) {
    return map;
  }

  const container = document.getElementById(containerId);

  if (!container) {
    throw new Error(`Map container with id "${containerId}" was not found.`);
  }

  map = new window.ymaps.Map(
    containerId,
    {
      center: CONFIG.defaultView.center,
      zoom: CONFIG.defaultView.zoom,
      controls: ["zoomControl"],
    },
    {
      suppressMapOpenBlock: true,
      maxZoom: 15,
      minZoom: CONFIG.defaultView.zoom,
    },
  );

  map.events.add("click", handleMapClick);
  map.events.add("boundschange", handleBoundsChange);

  return map;
}

export function initMap(containerId = "map") {
  assertYandexMaps();

  if (map) {
    return Promise.resolve(map);
  }

  return new Promise((resolve) => {
    window.ymaps.ready(() => {
      resolve(createMap(containerId));
    });
  });
}

export function addMarker(lat, lon) {
  ensureMapReady();

  const coords = [lat, lon];

  if (currentMarker) {
    map.geoObjects.remove(currentMarker);
  }

  currentMarker = new window.ymaps.Placemark(
    coords,
    {},
    {
      preset: "islands#nightDotIcon",
    },
  );

  map.geoObjects.add(currentMarker);
}

export function onLocationSelected(callback) {
  return mapEvents.on("location:selected", callback);
}

export function setActiveTileLayer(layerName, template) {
  ensureMapReady();

  if (activeWeatherLayerName === layerName) {
    return;
  }

  clearActiveTileLayer();

  activeWeatherLayer = new window.ymaps.Layer(template, {
    projection: window.ymaps.projection.sphericalMercator,
    zIndex: 1000,
    transparent: true,
    tileTransparent: true,
    opacity: CONFIG.weatherTileOpacity,
  });

  map.layers.add(activeWeatherLayer);
  activeWeatherLayerName = layerName;
}

export function clearActiveTileLayer() {
  if (!map || !activeWeatherLayer) {
    activeWeatherLayer = null;
    activeWeatherLayerName = null;
    return;
  }

  map.layers.remove(activeWeatherLayer);
  activeWeatherLayer = null;
  activeWeatherLayerName = null;
}

export function getActiveTileLayerName() {
  return activeWeatherLayerName;
}
