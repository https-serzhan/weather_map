import { CONFIG } from "../config.js";
import { convertCurrency } from "../core/currency.js";
import { formatCurrency } from "../utils/format.js";

export function initCurrencyWidget() {
  const form = document.getElementById("currency-form");
  const amountInput = document.getElementById("currency-amount");
  const fromSelect = document.getElementById("currency-from");
  const toSelect = document.getElementById("currency-to");
  const resultElement = document.getElementById("currency-result");

  populateCurrencies(fromSelect, "USD");
  populateCurrencies(toSelect, "KZT");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    resultElement.textContent = "Converting...";

    try {
      const amount = Number(amountInput.value);
      const from = fromSelect.value;
      const to = toSelect.value;
      const converted = await convertCurrency(amount, from, to);

      resultElement.textContent = `${formatCurrency(amount, from)} = ${formatCurrency(converted, to)}`;
    } catch (error) {
      resultElement.textContent = error.message;
    }
  });
}

function populateCurrencies(selectElement, selectedValue) {
  selectElement.innerHTML = CONFIG.supportedCurrencies
    .map((currency) => `<option value="${currency}">${currency}</option>`)
    .join("");
  selectElement.value = selectedValue;
}
