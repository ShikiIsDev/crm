import countryCodes from 'country-codes-list';

export const getCountryCodes = () => {
  const result = countryCodes.customList(
    'countryCode',
    '{countryCode}: +{countryCallingCode}'
  );

  const mappedList = Object.entries(result).map(([code, label]) => ({
    code,
    value: label.split(': ')[1], // Extract the calling code (e.g., +65)
    label, // Full display label (e.g., SG: +65)
  }));

  // Place Singapore (SG) at the top
  const singapore = mappedList.find(item => item.code === 'SG');
  const otherCountries = mappedList.filter(item => item.code !== 'SG');

  return singapore ? [singapore, ...otherCountries] : mappedList;
};

export const getCountryNames = () => {
  const result = countryCodes.customList(
    'countryNameEn',
    '{countryNameEn}' // Get only the country name
  );

  const mappedList = Object.entries(result).map(([code, name]) => ({
    code, // Country code (e.g., SG)
    name, // Country name (e.g., Singapore)
  }));

  // Place Singapore (SG) at the top
  const singapore = mappedList.find(item => item.code === 'Singapore');
  const otherCountries = mappedList.filter(item => item.code !== 'Singapore');

  return singapore ? [singapore, ...otherCountries] : mappedList;
};
