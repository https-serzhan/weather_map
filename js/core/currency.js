import { CONFIG } from "../config.js";
import { fetchJSON } from "../utils/api.js";

export async function convertCurrency(amount, from, to) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Enter an amount greater than 0.");
  }

  if (from === to) {
    return amount;
  }

  const url = new URL(`${CONFIG.currencyApiBaseUrl}/rate/${from}/${to}`);

  try {
    const data = await fetchJSON(url.toString(), {
      timeoutMs: CONFIG.requestTimeoutMs,
    });

    if (typeof data.rate !== "number") {
      throw new Error("Conversion rate is missing.");
    }

    return amount * data.rate;
  } catch (error) {
    throw new Error(`Unable to convert currency. ${error.message}`);
  }
}
