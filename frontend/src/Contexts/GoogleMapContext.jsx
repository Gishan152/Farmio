import { createContext, useContext } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

// Static libraries array to prevent LoadScript reloading
const libraries = ["places"];

const GoogleMapsContext = createContext({
  isLoaded: false,
  loadError: null,
  hasApiKey: false,
  apiKey: null,
});

export const GoogleMapsProvider = ({ apiKey, children }) => {
  // Check if API key is available
  const hasApiKey = apiKey && apiKey !== 'undefined' && apiKey.trim() !== '';
  
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: hasApiKey ? apiKey : undefined,
    id: "google-maps-root",
    libraries,
    // Add more specific configuration
    loadingElement: <div />,
    preventGoogleFontsLoading: true, // Prevent additional font loading
  });

  // Enhanced context value with more error information
  const contextValue = {
    isLoaded: hasApiKey ? isLoaded : false,
    loadError: hasApiKey ? loadError : new Error('Google Maps API key not configured'),
    hasApiKey,
    apiKey: hasApiKey ? apiKey : null
  };

  return (
    <GoogleMapsContext.Provider value={contextValue}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => useContext(GoogleMapsContext);
