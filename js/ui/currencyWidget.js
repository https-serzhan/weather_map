import { CONFIG } from "../config.js";
import { convertCurrency } from "../core/currency.js";
import { fetchJSON } from "../utils/api.js";
import { formatCurrency } from "../utils/format.js";

const EURO_COUNTRY_CODES = new Set([
  "AT",
  "BE",
  "CY",
  "DE",
  "EE",
  "ES",
  "FI",
  "FR",
  "GR",
  "HR",
  "IE",
  "IT",
  "LT",
  "LU",
  "LV",
  "MT",
  "NL",
  "PT",
  "SI",
  "SK",
]);

const COUNTRY_TO_CURRENCY = {
  AE: "AED",
  AU: "AUD",
  BR: "BRL",
  CA: "CAD",
  CH: "CHF",
  CN: "CNY",
  GB: "GBP",
  IN: "INR",
  JP: "JPY",
  KR: "KRW",
  KZ: "KZT",
  RU: "RUB",
  TR: "TRY",
  US: "USD",
};

let amountInput = null;
let fromSelect = null;
let toSelect = null;
let resultElement = null;
let availableCurrencyCodes = [...CONFIG.supportedCurrencies];
let loadSupportedCurrenciesPromise = null;
let syncRequestId = 0;
let conversionRequestId = 0;

const countryCurrencyCache = new Map();

function setResultMessage(message) {
  if (resultElement) {
    resultElement.textContent = message;
  }
}

function getCountryCurrency(countryCode) {
  if (!countryCode) {
    return CONFIG.fallbackLocalCurrency;
  }

  if (EURO_COUNTRY_CODES.has(countryCode)) {
    return "EUR";
  }

  return COUNTRY_TO_CURRENCY[countryCode] ?? CONFIG.fallbackLocalCurrency;
}

function getSortedCurrencyCodes(codes) {
  const uniqueCodes = [...new Set(codes)].filter(Boolean);

  uniqueCodes.sort((left, right) => {
    if (left === CONFIG.baseCurrency) {
      return -1;
    }

    if (right === CONFIG.baseCurrency) {
      return 1;
    }

    if (left === CONFIG.fallbackLocalCurrency) {
      return -1;
    }

    if (right === CONFIG.fallbackLocalCurrency) {
      return 1;
    }

    return left.localeCompare(right);
  });

  return uniqueCodes;
}

function getSupportedCurrencySet() {
  return new Set(availableCurrencyCodes);
}

function repopulateCurrencySelects() {
  if (!fromSelect || !toSelect) {
    return;
  }

  const currentFrom = fromSelect.value || CONFIG.baseCurrency;
  const currentTo = toSelect.value || CONFIG.fallbackLocalCurrency;

  populateCurrencies(fromSelect, currentFrom);
  populateCurrencies(toSelect, currentTo);
}

async function loadSupportedCurrencies() {
  if (loadSupportedCurrenciesPromise) {
    return loadSupportedCurrenciesPromise;
  }

  const url = new URL(`${CONFIG.currencyApiBaseUrl}/currencies`);

  loadSupportedCurrenciesPromise = fetchJSON(url.toString(), {
    timeoutMs: CONFIG.requestTimeoutMs,
  })
    .then((data) => {
      const currencyCodes = Array.isArray(data)
        ? data.map((item) => item?.iso_code)
        : Object.keys(data ?? {});

      if (currencyCodes.length > 0) {
        availableCurrencyCodes = getSortedCurrencyCodes(currencyCodes);
        repopulateCurrencySelects();
      }

      return getSupportedCurrencySet();
    })
    .catch(() => getSupportedCurrencySet());

  return loadSupportedCurrenciesPromise;
}

async function resolveCountryCurrency(countryCode) {
  const normalizedCountryCode = String(countryCode || "").toUpperCase();

  if (!normalizedCountryCode) {
    return CONFIG.fallbackLocalCurrency;
  }

  if (countryCurrencyCache.has(normalizedCountryCode)) {
    return countryCurrencyCache.get(normalizedCountryCode);
  }

  try {
    const url = new URL(`${CONFIG.countryApiBaseUrl}/alpha/${normalizedCountryCode}`);

    url.searchParams.set("fields", "currencies");

    const data = await fetchJSON(url.toString(), {
      timeoutMs: CONFIG.requestTimeoutMs,
    });
    const country = Array.isArray(data) ? data[0] : data;
    const currencies = country?.currencies;
    const resolvedCurrency = currencies ? Object.keys(currencies)[0] : null;

    if (resolvedCurrency) {
      countryCurrencyCache.set(normalizedCountryCode, resolvedCurrency);
      return resolvedCurrency;
    }
  } catch (error) {
    // Fall back to the local mapping below.
  }

  const fallbackCurrency = getCountryCurrency(normalizedCountryCode);

  countryCurrencyCache.set(normalizedCountryCode, fallbackCurrency);
  return fallbackCurrency;
}

function setCurrencyPair(fromCurrency, toCurrency) {
  if (!fromSelect || !toSelect) {
    return;
  }

  fromSelect.value = fromCurrency;
  toSelect.value = toCurrency;
}

async function submitConversion() {
  if (!amountInput || !fromSelect || !toSelect) {
    return;
  }

  const requestId = ++conversionRequestId;

  setResultMessage("Converting using the latest available FX rate...");

  try {
    const amount = Number(amountInput.value);
    const from = fromSelect.value;
    const to = toSelect.value;
    const converted = await convertCurrency(amount, from, to);

    if (requestId !== conversionRequestId) {
      return;
    }

    setResultMessage(`${formatCurrency(amount, from)} = ${formatCurrency(converted, to)}`);
  } catch (error) {
    if (requestId !== conversionRequestId) {
      return;
    }

    setResultMessage(error.message);
  }
}

export function initCurrencyWidget() {
  const form = document.getElementById("currency-form");

  amountInput = document.getElementById("currency-amount");
  fromSelect = document.getElementById("currency-from");
  toSelect = document.getElementById("currency-to");
  resultElement = document.getElementById("currency-result");

  populateCurrencies(fromSelect, CONFIG.baseCurrency);
  populateCurrencies(toSelect, CONFIG.fallbackLocalCurrency);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitConversion();
  });

  void loadSupportedCurrencies();
}

export async function syncCurrencyWithCountry(countryCode) {
  const requestId = ++syncRequestId;
  const [targetCurrency, supportedCurrencies] = await Promise.all([
    resolveCountryCurrency(countryCode),
    loadSupportedCurrencies(),
  ]);
  const nextToCurrency = supportedCurrencies.has(targetCurrency)
    ? targetCurrency
    : CONFIG.fallbackLocalCurrency;

  if (requestId !== syncRequestId) {
    return;
  }

  setCurrencyPair(CONFIG.baseCurrency, nextToCurrency);
  await submitConversion();
}

function populateCurrencies(selectElement, selectedValue) {
  selectElement.innerHTML = availableCurrencyCodes
    .map((currency) => `<option value="${currency}">${currency}</option>`)
    .join("");
  selectElement.value = availableCurrencyCodes.includes(selectedValue)
    ? selectedValue
    : CONFIG.fallbackLocalCurrency;
}
