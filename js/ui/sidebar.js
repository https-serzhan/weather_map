const sidebarElement = document.getElementById("sidebar");
const locationCardElement = document.getElementById("location-card");

export function openSidebar() {
  sidebarElement.classList.remove("sidebar--closed");
}

export function closeSidebar() {
  sidebarElement.classList.add("sidebar--closed");
}

export function renderLocation({ title, subtitle, coordinates }) {
  locationCardElement.innerHTML = `
    <p class="panel__label">${title}</p>
    <h3>${subtitle}</h3>
    <p class="panel__muted">${coordinates}</p>
  `;
}

export function renderWeather(data) {
  locationCardElement.insertAdjacentHTML(
    "beforeend",
    `
      <div class="weather-card__metrics">
        <div class="metric">
          <span class="panel__label">Temperature</span>
          <strong>${data.temperature}°C</strong>
        </div>
        <div class="metric">
          <span class="panel__label">Wind</span>
          <strong>${data.windSpeed} km/h</strong>
        </div>
        <div class="metric">
          <span class="panel__label">Code</span>
          <strong>${data.weatherCode}</strong>
        </div>
        <div class="metric">
          <span class="panel__label">Condition</span>
          <strong>${data.description}</strong>
        </div>
      </div>
    `
  );
}

export function renderError(message) {
  locationCardElement.innerHTML = `
    <p class="panel__label">Request failed</p>
    <h3>${message}</h3>
    <p class="panel__muted">Check API keys, network access, or service availability.</p>
  `;
}
