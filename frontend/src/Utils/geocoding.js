// src/utils/geocoding.js

/**
 * Get coordinates from city name using Google Maps Geocoding API
 * @param {string} city - City name
 * @param {string} apiKey - Google Maps API key
 * @returns {Promise<{lat: number, lng: number, formattedAddress: string}>}
 */
export const geocodeCity = async (city, apiKey) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
        placeId: result.place_id
      };
    } else {
      throw new Error(`Geocoding failed: ${data.status}`);
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

/**
 * Get coordinates from full address using Google Maps Geocoding API
 * @param {string} address - Full address
 * @param {string} apiKey - Google Maps API key
 * @returns {Promise<{lat: number, lng: number, formattedAddress: string}>}
 */
export const geocodeAddress = async (address, apiKey) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      
      // Extract city from address components
      let city = '';
      const cityComponent = result.address_components.find(
        component => component.types.includes('locality') || 
                    component.types.includes('administrative_area_level_2')
      );
      if (cityComponent) {
        city = cityComponent.long_name;
      }
      
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
        city: city,
        placeId: result.place_id
      };
    } else {
      throw new Error(`Geocoding failed: ${data.status}`);
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

/**
 * Fallback: Get approximate coordinates for Sri Lankan cities
 * Use this when Google Maps API is unavailable
 */
export const getSriLankanCityCoordinates = (city) => {
  const cityCoordinates = {
    'colombo': { lat: 6.9271, lng: 79.8612 },
    'kandy': { lat: 7.2906, lng: 80.6337 },
    'galle': { lat: 6.0535, lng: 80.2210 },
    'jaffna': { lat: 9.6615, lng: 80.0255 },
    'negombo': { lat: 7.2008, lng: 79.8358 },
    'trincomalee': { lat: 8.5874, lng: 81.2152 },
    'batticaloa': { lat: 7.7310, lng: 81.6747 },
    'anuradhapura': { lat: 8.3114, lng: 80.4037 },
    'polonnaruwa': { lat: 7.9403, lng: 81.0188 },
    'matara': { lat: 5.9549, lng: 80.5550 },
    'kurunegala': { lat: 7.4863, lng: 80.3623 },
    'ratnapura': { lat: 6.7056, lng: 80.3847 },
    'badulla': { lat: 6.9934, lng: 81.0550 },
    'nuwara eliya': { lat: 6.9497, lng: 80.7891 },
    'hambantota': { lat: 6.1429, lng: 81.1212 },
    'vavuniya': { lat: 8.7542, lng: 80.4982 },
    'kilinochchi': { lat: 9.3961, lng: 80.4036 },
    'mannar': { lat: 8.9810, lng: 79.9044 },
    'puttalam': { lat: 8.0362, lng: 79.8283 },
    'kegalle': { lat: 7.2513, lng: 80.3464 },
    'monaragala': { lat: 6.8728, lng: 81.3507 },
    'ampara': { lat: 7.2974, lng: 81.6681 },
    'kalutara': { lat: 6.5854, lng: 79.9607 }
  };
  
  const normalizedCity = city.toLowerCase().trim();
  return cityCoordinates[normalizedCity] || null;
};

/**
 * Smart geocoding that tries Google Maps first, then falls back to hardcoded values
 * @param {string} city - City name
 * @param {string} apiKey - Google Maps API key (optional)
 * @returns {Promise<{lat: number, lng: number, source: string}>}
 */
export const smartGeocode = async (city, apiKey = null) => {
  // Try Google Maps Geocoding if API key is available
  if (apiKey && apiKey !== 'undefined' && apiKey.trim() !== '') {
    try {
      const result = await geocodeCity(city, apiKey);
      return {
        ...result,
        source: 'google_maps'
      };
    } catch (error) {
      console.warn('Google Maps geocoding failed, trying fallback...', error?.message || error);
    }
  }
  
  // Fallback to hardcoded coordinates for Sri Lankan cities
  const fallbackCoords = getSriLankanCityCoordinates(city);
  if (fallbackCoords) {
    return {
      ...fallbackCoords,
      formattedAddress: city,
      source: 'fallback'
    };
  }

  // Try a fuzzy match for partial or misspelled city names (e.g. 'colomb' -> 'colombo')
  try {
    const normalized = city.toLowerCase().trim();
    if (normalized.length >= 3) {
      // Build keys from the static map above
      const cityKeys = [
        'colombo','kandy','galle','jaffna','negombo','trincomalee','batticaloa','anuradhapura','polonnaruwa','matara','kurunegala','ratnapura','badulla','nuwara eliya','hambantota','vavuniya','kilinochchi','mannar','puttalam','kegalle','monaragala','ampara','kalutara'
      ];

      // find startsWith or includes match
      const fuzzy = cityKeys.find(k => k.startsWith(normalized) || k.includes(normalized));
      if (fuzzy) {
        const coords = getSriLankanCityCoordinates(fuzzy);
        if (coords) {
          console.warn(`Fuzzy matched city '${city}' -> '${fuzzy}'`);
          return {
            ...coords,
            formattedAddress: fuzzy,
            source: 'fallback_fuzzy',
            matchedCity: fuzzy
          };
        }
      }
    }
  } catch (e) {
    // non-fatal
    console.warn('Fuzzy fallback failed', e);
  }

  throw new Error(`Unable to geocode city: ${city}`);
};