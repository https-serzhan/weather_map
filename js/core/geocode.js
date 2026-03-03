export async function reverseGeocode(lat, lon) {
  return {
    title: "Selected coordinates",
    subtitle: `${lat.toFixed(3)}, ${lon.toFixed(3)}`,
  };
}
