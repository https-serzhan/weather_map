import { initMap, onLocationSelected } from "./core/map.js";
import { reverseGeocode } from "./core/geocode.js";
import { getCurrentWeather } from "./core/weather.js";
import { initCurrencyWidget } from "./ui/currencyWidget.js";
import { initLayerControls } from "./ui/layerControls.js";
import {
  closeSidebar,
  openSidebar,
  renderError,
  renderLocation,
  renderWeather,
} from "./ui/sidebar.js";
import { formatCoordinate } from "./utils/format.js";

function bindSidebarControls() {
  document
    .getElementById("sidebar-toggle")
    .addEventListener("click", openSidebar);
  document
    .getElementById("sidebar-close")
    .addEventListener("click", closeSidebar);
}

async function bootstrap() {
  bindSidebarControls();
  initCurrencyWidget();
  initLayerControls((message) => {
    renderError(message);
    openSidebar();
  });

  try {
    await initMap("map");
  } catch (error) {
    renderError(
      `${error.message} Check the Yandex Maps API key and script loading.`,
    );
    return;
  }

  onLocationSelected(async ({ lat, lon }) => {
    openSidebar();

    renderLocation({
      title: "Loading",
      subtitle: "Fetching weather details",
      coordinates: `${formatCoordinate(lat, "lat")} · ${formatCoordinate(lon, "lon")}`,
    });

    try {
      const [place, weather] = await Promise.all([
        reverseGeocode(lat, lon),
        getCurrentWeather(lat, lon),
      ]);

      renderLocation({
        title: place.title,
        subtitle: place.subtitle,
        // coordinates: `${formatCoordinate(lat, "lat")} · ${formatCoordinate(lon, "lon")}`,
      });
      console.log("погода", weather);
      console.log("место", place);
      renderWeather(weather);
    } catch (error) {
      renderError(error.message);
    }
  });
}

bootstrap();
