export async function fetchJSON(url, options = {}) {
  const response = await fetch(url, options);
  

  if (!response.ok) {
    const message = `Request failed: ${response.status} ${response.statusText}`;
    throw new Error(message);
  }
  return response.json();
}
