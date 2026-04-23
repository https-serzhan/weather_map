import { initMap, onLocationSelected } from "./core/map.js";
import { reverseGeocode } from "./core/geocode.js";
import { getCurrentWeather } from "./core/weather.js";
import { initCurrencyWidget, syncCurrencyWithCountry } from "./ui/currencyWidget.js";
import { initLayerControls } from "./ui/layerControls.js";
import {
  closeSidebar,
  initializeSidebarState,
  openSidebar,
  renderError,
  renderLocation,
  renderWeather,
} from "./ui/sidebar.js";
import { formatCoordinate } from "./utils/format.js";

let latestSelectionRequestId = 0;
const MAP_OVERLAY_STORAGE_KEY = "weather-map:intro-overlay-dismissed";

function dismissMapOverlay() {
  const overlay = document.getElementById("map-overlay");

  if (!overlay || overlay.hidden) {
    return;
  }

  overlay.hidden = true;
  document.documentElement.dataset.mapOverlayDismissed = "true";

  try {
    window.localStorage.setItem(MAP_OVERLAY_STORAGE_KEY, "true");
  } catch (error) {
    console.warn("Unable to persist intro overlay state.", error);
  }
}

function initializeMapOverlay() {
  let isDismissed = false;

  try {
    isDismissed = window.localStorage.getItem(MAP_OVERLAY_STORAGE_KEY) === "true";
  } catch (error) {
    console.warn("Unable to read intro overlay state.", error);
  }

  if (!isDismissed) {
    return;
  }

  const overlay = document.getElementById("map-overlay");

  if (overlay) {
    overlay.hidden = true;
  }

  document.documentElement.dataset.mapOverlayDismissed = "true";
}

function bindSidebarControls() {
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebarClose = document.getElementById("sidebar-close");

  sidebarToggle?.addEventListener("click", openSidebar);
  sidebarClose?.addEventListener("click", closeSidebar);
}

async function inspectLocation(lat, lon) {
  const requestId = ++latestSelectionRequestId;

  openSidebar();
  renderLocation({
    title: "Loading weather",
    subtitle: "Fetching place details and current conditions.",
    coordinates: `${formatCoordinate(lat, "lat")} · ${formatCoordinate(lon, "lon")}`,
  });

  try {
    const [place, weather] = await Promise.all([
      reverseGeocode(lat, lon),
      getCurrentWeather(lat, lon),
    ]);

    if (requestId !== latestSelectionRequestId) {
      return;
    }

    renderLocation(place);
    renderWeather(weather);
    syncCurrencyWithCountry(weather.country);
  } catch (error) {
    if (requestId !== latestSelectionRequestId) {
      return;
    }

    renderError(error.message);
  }
}

async function bootstrap() {
  initializeMapOverlay();
  initializeSidebarState();
  bindSidebarControls();
  initCurrencyWidget();
  initLayerControls((message) => {
    renderError(message);
    openSidebar();
  });

  try {
    await initMap("map");
  } catch (error) {
    renderError(`${error.message} Check the Yandex Maps API key and script loading.`);
    return;
  }

  onLocationSelected(({ lat, lon }) => {
    dismissMapOverlay();
    void inspectLocation(lat, lon);
  });
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      void bootstrap();
    },
    { once: true },
  );
} else {
  void bootstrap();
}
