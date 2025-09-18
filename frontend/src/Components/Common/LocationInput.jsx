import { useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { useGoogleMaps } from '../../Contexts/GoogleMapContext';

export default function LocationInput({ 
    value, 
    onChange, 
    onLocationSelect, 
    placeholder = "Enter address...",
    className = "",
    required = false 
}) {
    const { isLoaded } = useGoogleMaps();
    const autocompleteRef = useRef(null);

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
        onChange(e.target.value);
    };

    if (!isLoaded) {
        return (
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                placeholder="Loading Google Maps..."
                className={className}
                disabled
            />
        );
    }

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
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder}
                className={className}
                required={required}
            />
        </Autocomplete>
    );
}