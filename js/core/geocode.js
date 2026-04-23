import { formatCoordinate } from "../utils/format.js";

function createFallbackLocation(lat, lon) {
  return {
    title: "Selected location",
    subtitle: "Resolved by coordinates only.",
    coordinates: `${formatCoordinate(lat, "lat")} · ${formatCoordinate(lon, "lon")}`,
  };
}

export async function reverseGeocode(lat, lon) {
  if (!window.ymaps?.geocode) {
    return createFallbackLocation(lat, lon);
  }

  try {
    const result = await window.ymaps.geocode([lat, lon], { results: 1 });
    const firstResult = result.geoObjects.get(0);

    if (!firstResult) {
      return createFallbackLocation(lat, lon);
    }

    const title =
      firstResult.properties.get("name") ||
      firstResult.properties.get("text") ||
      "Selected location";
    const description =
      firstResult.properties.get("description") ||
      firstResult.properties.get("text") ||
      "Resolved by Yandex geocoder.";

    return {
      title,
      subtitle: description === title ? "Resolved by Yandex geocoder." : description,
      coordinates: `${formatCoordinate(lat, "lat")} · ${formatCoordinate(lon, "lon")}`,
    };
  } catch (error) {
    return createFallbackLocation(lat, lon);
  }
}
