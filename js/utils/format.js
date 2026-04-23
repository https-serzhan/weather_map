export function formatCoordinate(value, axis) {
  const suffix = axis === "lat" ? (value >= 0 ? "N" : "S") : value >= 0 ? "E" : "W";
  return `${Math.abs(value).toFixed(3)}° ${suffix}`;
}

export function formatCurrency(value, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatTemperature(value) {
  return `${Math.round(value)}°C`;
}

export function formatWindSpeed(value) {
  return `${Number(value).toFixed(1)} m/s`;
}

export function formatPercent(value) {
  return `${Math.round(value)}%`;
}

export function formatPressure(value) {
  return `${Math.round(value)} hPa`;
}

export function toTitleCase(value) {
  return String(value)
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
