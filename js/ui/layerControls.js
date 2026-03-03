import { getActiveLayerNames, toggleLayer } from "../core/layers.js";

const LAYERS = [
  { id: "temperature", title: "Temperature", meta: "OpenWeatherMap tile overlay" },
  { id: "wind", title: "Wind", meta: "OpenWeatherMap wind tile overlay" },
];

export function initLayerControls(onError) {
  const container = document.getElementById("layer-controls");

  container.innerHTML = "";

  for (const layer of LAYERS) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "layer-button";
    button.dataset.layer = layer.id;
    button.innerHTML = `
      <span>${layer.title}</span>
      <span class="layer-button__meta">${layer.meta}</span>
    `;

    button.addEventListener("click", () => {
      try {
        toggleLayer(layer.id);
        syncLayerControls(container);
      } catch (error) {
        onError(error.message);
      }
    });

    container.append(button);
  }

  syncLayerControls(container);
}

function syncLayerControls(container) {
  const active = new Set(getActiveLayerNames());

  container.querySelectorAll(".layer-button").forEach((button) => {
    button.classList.toggle("is-active", active.has(button.dataset.layer));
  });
}
