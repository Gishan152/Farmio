import { useState } from 'react';
import { smartGeocode } from '../../Utils/geocoding';

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
    const [localError] = useState(null);

    // No Google Maps usage: always operate in fallback/manual mode

    // No Autocomplete: we use manual input and try to geocode city/address via smartGeocode when possible

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        onChange(newValue);
        // In manual mode, try to extract a city and auto-geocode it (if it looks like a city)
        if (onLocationSelect) {
            const parts = newValue.split(',').map(part => part.trim()).filter(Boolean);
            const possibleCity = parts.length > 0 ? parts[parts.length - 1] : '';

            // If the last part looks like a city (>=3 chars), attempt smartGeocode
            if (possibleCity && possibleCity.length >= 3) {
                    smartGeocode(possibleCity)
                        .then(coords => {
                            onLocationSelect({
                                address: newValue,
                                lat: coords.lat || null,
                                lng: coords.lng || null,
                                city: coords.city || possibleCity,
                                placeId: coords.placeId || null,
                                fallback: true,
                                geocodeSource: coords.source || 'fallback'
                            });
                        })
                        .catch(() => {
                            // Still call onLocationSelect to update address, but without coords
                            onLocationSelect({
                                address: newValue,
                                lat: null,
                                lng: null,
                                city: possibleCity || '',
                                placeId: null,
                                fallback: true
                            });
                        });
            } else {
                // Not enough input to geocode yet
                onLocationSelect({
                    address: newValue,
                    lat: null,
                    lng: null,
                    city: possibleCity || '',
                    placeId: null,
                    fallback: true
                });
            }
        }
    };

    // Simple manual input rendering
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
            {localError && (
                <div className="text-xs text-red-600 bg-red-50 p-2 rounded border-l-4 border-red-400">
                    ❌ {localError}
                </div>
            )}
            <div className="text-xs text-gray-600">
                📍 Manual input mode (no Google Maps required)
            </div>
        </div>
    );
}