import { fetchJSON } from "../utils/api.js";

export async function convertCurrency(amount, from, to) {
  const url = new URL("https://api.exchangerate.host/convert");
  url.searchParams.set("amount", amount);
  url.searchParams.set("from", from);
  url.searchParams.set("to", to);

  try {
    const data = await fetchJSON(url.toString());

    if (typeof data.result !== "number") {
      throw new Error("Conversion result is missing.");
    }

    return data.result;
  } catch (error) {
    throw new Error(`Unable to convert currency. ${error.message}`);
  }
}
