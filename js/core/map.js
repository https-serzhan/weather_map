import { CONFIG } from "../config.js";

let mapInstance;
let markerInstance;
const locationCallbacks = [];
const tileLayers = new Map();

function assertYandexMaps() {
  if (!window.ymaps) {
    throw new Error("Yandex Maps JS API is not available.");
  }
}

function createLayerFromTemplate(template) {
  return new window.ymaps.Layer(template, {
    tileTransparent: true,
    zIndex: 320,
  });
}

function ensureMapReady() {
  if (!mapInstance) {
    throw new Error("Map is not initialized.");
  }
}

export async function initMap(containerId) {
  assertYandexMaps();

  await new Promise((resolve) => window.ymaps.ready(resolve));

  mapInstance = new window.ymaps.Map(
    containerId,
    {
      center: CONFIG.defaultView.center,
      zoom: CONFIG.defaultView.zoom,
      controls: ["zoomControl", "typeSelector"],
    },
    {
      suppressMapOpenBlock: true,
    }
  );

  mapInstance.events.add("click", (event) => {
    const [lat, lon] = event.get("coords");
    addMarker(lat, lon);
    locationCallbacks.forEach((callback) => callback({ lat, lon }));
  });

  return mapInstance;
}

export function addMarker(lat, lon) {
  ensureMapReady();

  if (markerInstance) {
    mapInstance.geoObjects.remove(markerInstance);
  }

  markerInstance = new window.ymaps.Placemark(
    [lat, lon],
    {},
    {
      preset: "islands#nightCircleDotIcon",
    }
  );

  mapInstance.geoObjects.add(markerInstance);
  mapInstance.setCenter([lat, lon], Math.max(mapInstance.getZoom(), 5), {
    duration: 240,
  });
}

export function onLocationSelected(callback) {
  locationCallbacks.push(callback);
}

export function addTileLayer(layerName, template) {
  ensureMapReady();

  if (tileLayers.has(layerName)) {
    mapInstance.setType(tileLayers.get(layerName));
    return;
  }

  const layer = createLayerFromTemplate(template);
  const mapTypeName = `custom#${layerName}`;

  window.ymaps.layer.storage.add(mapTypeName, () => layer);
  window.ymaps.mapType.storage.add(
    mapTypeName,
    new window.ymaps.MapType(mapTypeName, [layer, "yandex#map"])
  );

  mapInstance.setType(mapTypeName);
  tileLayers.set(layerName, mapTypeName);
}

export function removeTileLayer(layerName) {
  ensureMapReady();

  if (!tileLayers.has(layerName)) {
    return;
  }

  tileLayers.delete(layerName);
  mapInstance.setType("yandex#map");
}

export function getMapInstance() {
  return mapInstance;
}
