import { useRef, useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { useGoogleMaps } from '../../Contexts/GoogleMapContext';

export default function LocationInput({ 
    value, 
    onChange, 
    onLocationSelect, 
    placeholder = "Enter address...",
    className = "",
    required = false,
    id = "location-input",
    name = "address"
}) {
    const { isLoaded, loadError } = useGoogleMaps();
    const autocompleteRef = useRef(null);
    const [fallbackMode, setFallbackMode] = useState(false);

    const handlePlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            
            if (place.geometry) {
                const location = place.geometry.location;
                const lat = location.lat();
                const lng = location.lng();
                const address = place.formatted_address || place.name || '';
                
                // Extract city from address components
                let city = '';
                if (place.address_components) {
                    const cityComponent = place.address_components.find(
                        component => 
                            component.types.includes('locality') ||
                            component.types.includes('administrative_area_level_2')
                    );
                    if (cityComponent) {
                        city = cityComponent.long_name;
                    }
                }

                // Call the callback with all location data
                onLocationSelect({
                    address,
                    lat,
                    lng,
                    city,
                    placeId: place.place_id
                });
            }
        }
    };

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        onChange(newValue);
        
        // In fallback mode, try to extract basic location info
        if (fallbackMode && onLocationSelect) {
            // Simple parsing for common address formats
            const parts = newValue.split(',').map(part => part.trim());
            const city = parts.length > 1 ? parts[parts.length - 2] : '';
            
            onLocationSelect({
                address: newValue,
                lat: null,
                lng: null,
                city: city,
                placeId: null,
                fallback: true
            });
        }
    };

    // Show loading state
    if (!isLoaded && !loadError && !fallbackMode) {
        return (
            <div className="relative">
                <input
                    type="text"
                    id={id}
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    placeholder="Loading Google Maps..."
                    className={className}
                    disabled
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full"></div>
                </div>
            </div>
        );
    }

    // Show error state with fallback option
    if (loadError || fallbackMode) {
        return (
            <div className="space-y-2">
                <div className="relative">
                    <input
                        type="text"
                        id={id}
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        className={className}
                        required={required}
                    />
                    {loadError && !fallbackMode && (
                        <button
                            type="button"
                            onClick={() => setFallbackMode(true)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-yellow-600 hover:text-yellow-800"
                            title="Switch to basic mode"
                        >
                            ⚠️
                        </button>
                    )}
                </div>
                {loadError && !fallbackMode && (
                    <div className="text-xs text-yellow-600">
                        ⚠️ Google Maps unavailable. 
                        <button 
                            type="button"
                            onClick={() => setFallbackMode(true)}
                            className="underline hover:text-yellow-800"
                        >
                            Use basic input
                        </button>
                    </div>
                )}
                {fallbackMode && (
                    <div className="text-xs text-blue-600">
                        📍 Basic mode: Enter address manually (e.g., "123 Main St, Colombo")
                    </div>
                )}
            </div>
        );
    }

    // Google Maps is loaded successfully
    try {
        return (
            <Autocomplete
                onLoad={(autocomplete) => {
                    autocompleteRef.current = autocomplete;
                }}
                onPlaceChanged={handlePlaceChanged}
                options={{
                    types: ['address', 'establishment'],
                    componentRestrictions: { country: 'lk' }, // Restrict to Sri Lanka
                }}
            >
                <input
                    type="text"
                    id={id}
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className={className}
                    required={required}
                />
            </Autocomplete>
        );
    } catch (error) {
        console.error('Google Maps Autocomplete error:', error);
        // Fallback to basic input on error
        return (
            <div className="space-y-2">
                <input
                    type="text"
                    id={id}
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className={className}
                    required={required}
                />
                <div className="text-xs text-yellow-600">
                    ⚠️ Google Maps error. Using basic input mode.
                </div>
            </div>
        );
    }
}