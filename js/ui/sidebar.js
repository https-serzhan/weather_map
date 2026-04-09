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
  `;
}
// <p class="panel__muted">${coordinates}</p>

export function renderWeather(data) {
  console.log('123', data);
  
  locationCardElement.insertAdjacentHTML(
    "beforeend",
    `
      <div class="weather-card__metrics">
        <div class="metric">
          <span class="panel__label">City</span>
          <strong>${data.name || "¯\\\_(ツ)_/¯"}</strong>
        </div>
        <div class="metric">
          <span class="panel__label">Country</span>
          <strong>${data?.country ?? '¯\\\_(ツ)_/¯'}</strong>
        </div>
        <div class="metric">
          <span class="panel__label">Temperature</span>
          <strong>${data.temperature}°C</strong>
        </div>
        <div class="metric">
          <span class="panel__label">Wind</span>
          <strong>${data.windSpeed.toFixed(1)} m/s</strong>
        </div>
        <div class="metric">
          <span class="panel__label">Description</span>
          <strong>${data}</strong>
        </div>
        <div class="metric">
          <span class="panel__label">Code</span>
          <strong>${data.cod}</strong>
        </div>
      </div>
    `,
  );
}

export function renderError(message) {
  locationCardElement.innerHTML = `
    <p class="panel__label">Request failed</p>
    <h3>${message}</h3>
    <p class="panel__muted">Check API keys, network access, or service availability.</p>
  `;
}
