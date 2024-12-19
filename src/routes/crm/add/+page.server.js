import { getCountryCodes, getCountryNames } from '$lib/countryCodes.js';

export const load = async () => {
  const countryCodes = getCountryCodes(); // Fetch formatted country codes
  const countryNames = getCountryNames();
//   console.log(countryNames)
  return { countryCodes, countryNames }; // Return as JSON
};
