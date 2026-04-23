import {
  formatPercent,
  formatPressure,
  formatTemperature,
  formatWindSpeed,
  toTitleCase,
} from "../utils/format.js";

function getSidebarElement() {
  return document.getElementById("sidebar");
}

function getLocationCardElement() {
  return document.getElementById("location-card");
}

function getSidebarToggleElement() {
  return document.getElementById("sidebar-toggle");
}

function createTextElement(tagName, text, className) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  element.textContent = text;
  return element;
}

function createMetric(label, value, wide = false) {
  const metric = document.createElement("div");
  metric.className = `metric${wide ? " metric--wide" : ""}`;

  metric.append(
    createTextElement("span", label, "panel__label"),
    createTextElement("strong", value),
  );

  return metric;
}

function clearLocationCard() {
  const locationCardElement = getLocationCardElement();

  if (locationCardElement) {
    locationCardElement.innerHTML = "";
  }
}

function syncSidebarToggle() {
  const sidebarElement = getSidebarElement();
  const sidebarToggleElement = getSidebarToggleElement();

  if (!sidebarElement || !sidebarToggleElement) {
    return;
  }

  const isClosed = sidebarElement.classList.contains("sidebar--closed");

  sidebarToggleElement.classList.toggle("is-visible", isClosed);
  sidebarToggleElement.setAttribute("aria-hidden", String(!isClosed));
  sidebarToggleElement.setAttribute("aria-expanded", String(!isClosed));
}

export function openSidebar() {
  const sidebarElement = getSidebarElement();

  if (!sidebarElement) {
    return;
  }

  sidebarElement.classList.remove("sidebar--closed");
  syncSidebarToggle();
}

export function closeSidebar() {
  const sidebarElement = getSidebarElement();

  if (!sidebarElement) {
    return;
  }

  sidebarElement.classList.add("sidebar--closed");
  syncSidebarToggle();
}

export function initializeSidebarState() {
  syncSidebarToggle();
}

export function renderLocation({ title, subtitle, coordinates }) {
  const locationCardElement = getLocationCardElement();

  if (!locationCardElement) {
    return;
  }

  clearLocationCard();

  locationCardElement.append(
    createTextElement("p", "Selected location", "panel__label"),
    createTextElement("h3", title),
  );

  if (subtitle) {
    locationCardElement.append(createTextElement("p", subtitle, "panel__muted"));
  }

  if (coordinates) {
    locationCardElement.append(
      createTextElement("p", coordinates, "panel__muted weather-card__coordinates"),
    );
  }
}

export function renderWeather(data) {
  const locationCardElement = getLocationCardElement();

  if (!locationCardElement) {
    return;
  }

  const metrics = document.createElement("div");
  metrics.className = "weather-card__metrics";

  if (data.iconUrl) {
    const summary = document.createElement("div");
    summary.className = "weather-card__summary";

    const icon = document.createElement("img");
    icon.className = "weather-card__icon";
    icon.src = data.iconUrl;
    icon.alt = data.description || "Weather icon";
    icon.width = 72;
    icon.height = 72;

    const summaryText = document.createElement("div");
    summaryText.append(
      createTextElement(
        "span",
        toTitleCase(data.description || "Current weather"),
        "weather-card__condition",
      ),
      createTextElement(
        "strong",
        formatTemperature(data.temperature),
        "weather-card__temperature",
      ),
    );

    summary.append(icon, summaryText);
    locationCardElement.append(summary);
  }

  metrics.append(
    createMetric("City", data.name || "Unknown"),
    createMetric("Country", data.country || "Unknown"),
    createMetric("Temperature", formatTemperature(data.temperature)),
    createMetric("Feels like", formatTemperature(data.feelsLike)),
    createMetric("Wind", formatWindSpeed(data.windSpeed)),
    createMetric("Humidity", formatPercent(data.humidity)),
    createMetric("Pressure", formatPressure(data.pressure)),
    createMetric("Code", String(data.weatherCode)),
    createMetric("Condition", toTitleCase(data.description || "Unavailable"), true),
  );

  locationCardElement.append(metrics);
}

export function renderError(message) {
  const locationCardElement = getLocationCardElement();

  if (!locationCardElement) {
    return;
  }

  clearLocationCard();

  locationCardElement.append(
    createTextElement("p", "Request failed", "panel__label"),
    createTextElement("h3", message),
    createTextElement(
      "p",
      "Check the configured API keys, network access, or upstream service status.",
      "panel__muted",
    ),
  );
}
