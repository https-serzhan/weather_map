export async function reverseGeocode(lat, lon) {
  return {
    title: "Selected coordinates",
    subtitle: `${lat.toFixed(3)}, ${lon.toFixed(3)}`,
  };
}

// export async function reversName(name) {
//   return {
//     title: "country",
//     subtitle: name,
//   };
// }
