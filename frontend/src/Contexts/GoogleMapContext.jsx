import { createContext, useContext, useEffect, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

// Static libraries array to prevent LoadScript reloading
const libraries = ["places"];

const GoogleMapsContext = createContext({
  isLoaded: false,
  loadError: null,
  hasApiKey: false,
  apiKey: null,
  retryCount: 0,
});

export function GoogleMapsProvider({ apiKey, children }) {
  // Check if API key is available and valid
  const hasApiKey = apiKey && 
    apiKey !== 'undefined' && 
    apiKey.trim() !== '' && 
    apiKey !== 'your_api_key_here' &&
    apiKey !== 'YOUR_ACTUAL_API_KEY_HERE';
  
  const [retryCount, setRetryCount] = useState(0);
  const [customError, setCustomError] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: hasApiKey ? apiKey : undefined,
    id: "google-maps-root",
    libraries,
    // Add more specific configuration to avoid CORS issues
    loadingElement: <div />,
    preventGoogleFontsLoading: true,
    version: "weekly",
    // Add defer loading to prevent CORS issues
    defer: true,
  });

  // Monitor load errors and provide better error messages
  useEffect(() => {
    if (loadError) {
      console.error('Google Maps load error:', loadError);
      
      // Set custom error messages based on common issues
      if (loadError.message.includes('API key') || loadError.message.includes('InvalidKeyMapError')) {
        setCustomError('Invalid API key. Please check your Google Cloud Console settings.');
      } else if (loadError.message.includes('quota') || loadError.message.includes('OverQuotaMapError')) {
        setCustomError('Google Maps quota exceeded. Please check your billing.');
      } else if (loadError.message.includes('network') || loadError.message.includes('CORS')) {
        setCustomError('Network error or CORS issue. Google Maps may be blocked.');
      } else if (loadError.message.includes('MissingKeyMapError')) {
        setCustomError('Google Maps API key is missing.');
      } else {
        setCustomError(`Google Maps error: ${loadError.message}`);
      }
    } else {
      setCustomError(null);
    }
  }, [loadError]);

  // Enhanced context value with more error information
  const contextValue = {
    isLoaded: hasApiKey ? isLoaded : false,
    loadError: customError ? new Error(customError) : loadError,
    hasApiKey,
    apiKey: hasApiKey ? apiKey : null,
    retryCount,
    retry: () => {
      setRetryCount(prev => prev + 1);
      setCustomError(null);
      window.location.reload();
    }
  };

  return (
    <GoogleMapsContext.Provider value={contextValue}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

// Hook to use Google Maps context
export function useGoogleMaps() {
  return useContext(GoogleMapsContext);
}
