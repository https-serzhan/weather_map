let map = null;
let currentMarker = null;
const tileLayers = new Map();

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

function createLayerFromTemplate(template) {
  return new window.ymaps.Layer(template, {
    tileTransparent: true,
    zIndex: 320,
  });
}

function notifyLocationSelected(coords) {
  if (typeof window.onLocationSelected === "function") {
    window.onLocationSelected({
      lat: coords[0],
      lon: coords[1],
    });
  }
}

function handleMapClick(e) {
  const coords = e.get("coords");

  console.log("Map click:", coords);
  addMarker(coords[0], coords[1]);
  notifyLocationSelected(coords);
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
      center: [20, 0],
      zoom: 2,
      controls: ["zoomControl"],
    },
    {
      suppressMapOpenBlock: true,
    }
  );

  map.events.add("click", function (e) {
    handleMapClick(e);
  });

  return map;
}

export function initMap(containerId = "map") {
  assertYandexMaps();

  if (map) {
    return Promise.resolve(map);
  }

  return new Promise((resolve) => {
    window.ymaps.ready(function () {
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

  currentMarker = new window.ymaps.Placemark(coords);
  map.geoObjects.add(currentMarker);
}

export function onLocationSelected(callback) {
  window.onLocationSelected = callback;
}

export function addTileLayer(layerName, template) {
  ensureMapReady();

  if (tileLayers.has(layerName)) {
    map.setType(tileLayers.get(layerName));
    return;
  }

  const layer = createLayerFromTemplate(template);
  const mapTypeName = `custom#${layerName}`;

  window.ymaps.layer.storage.add(mapTypeName, function () {
    return layer;
  });
  window.ymaps.mapType.storage.add(
    mapTypeName,
    new window.ymaps.MapType(mapTypeName, [layer, "yandex#map"])
  );

  map.setType(mapTypeName);
  tileLayers.set(layerName, mapTypeName);
}

export function removeTileLayer(layerName) {
  ensureMapReady();

  if (!tileLayers.has(layerName)) {
    return;
  }

  tileLayers.delete(layerName);
  map.setType("yandex#map");
}

export function getMapInstance() {
  return map;
}

window.MapModule = {
  initMap,
};

if (window.ymaps) {
  window.ymaps.ready(function () {
    createMap("map");
  });
}
