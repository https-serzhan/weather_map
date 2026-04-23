export async function fetchJSON(url, options = {}) {
  const { timeoutMs = 12000, signal, ...fetchOptions } = options;
  const controller = signal ? null : new AbortController();
  const timeoutId = window.setTimeout(() => {
    controller?.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: signal ?? controller?.signal,
    });
    const contentType = response.headers.get("content-type") ?? "";
    const isJSON = contentType.includes("application/json");
    const payload = isJSON ? await response.json() : null;

    if (!response.ok) {
      const details =
        payload?.message ??
        payload?.error?.message ??
        `Request failed: ${response.status} ${response.statusText}`;

      throw new Error(details);
    }

    if (!isJSON) {
      throw new Error("Expected a JSON response.");
    }

    return payload;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out.");
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}
