const YANDEX_MAPS_API_URL = "https://api-maps.yandex.ru/2.1/";

function hasPlaceholder(value) {
  return !value || value.includes("YOUR_");
}

export function loadYandexMaps(apiKey) {
  if (window.ymaps) {
    return Promise.resolve(window.ymaps);
  }

  if (hasPlaceholder(apiKey)) {
    return Promise.reject(new Error("Yandex Maps API key is missing."));
  }

  const existingScript = document.querySelector('script[data-yandex-maps="true"]');

  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener("load", () => resolve(window.ymaps), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Yandex Maps JS API.")), {
        once: true,
      });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const url = new URL(YANDEX_MAPS_API_URL);

    url.searchParams.set("apikey", apiKey);
    url.searchParams.set("lang", "en_US");

    script.src = url.toString();
    script.async = true;
    script.defer = true;
    script.dataset.yandexMaps = "true";
    script.addEventListener("load", () => resolve(window.ymaps), { once: true });
    script.addEventListener("error", () => reject(new Error("Failed to load Yandex Maps JS API.")), {
      once: true,
    });

    document.head.append(script);
  });
}
