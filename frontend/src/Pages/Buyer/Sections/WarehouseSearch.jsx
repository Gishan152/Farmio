import React, { useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Link } from "react-router-dom";
import { CheckBadgeIcon, StarIcon } from "@heroicons/react/24/solid";
import LocationPickerModal from "../../../Components/LocationPickerModel";
import warehouseAPI from "../../../API/warehouse";
import warehouesImg1 from "../../../Assets/Buyer/Warehouses/warehouse.webp";

const containerStyle = { width: "100%", height: "300px" };
const centerDefault = { lat: 6.9271, lng: 79.8612 };
const storageTypes = ["Cold", "Dry"];

function Warehouses({ warehouses, onBookWarehouse }) {
    return (
        <section className="py-6">
            {/* <h1 className="text-2xl font-semibold mb-6 dark:text-gray-100">Warehouses</h1> */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xlg:grid-cols-4">
                {warehouses.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">
                        No warehouses found matching your filters.
                    </div>
                ) : warehouses.map(w => (
                    <div
                        key={w.id}
                        className="flex flex-col justify-between bg-gradient-to-br from-green-50 to-white dark:from-green-900 dark:to-gray-900 border border-green-100 dark:border-green-800 rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <div>
                            <div className="p-5 space-y-2 relative">
                                {w.verified && (
                                    <div className="absolute top-2 right-2 bg-white p-1 border-none rounded-full shadow-md">
                                        <CheckBadgeIcon className="h-6 w-6 text-green-500" />
                                    </div>
                                )}
                                {w.distance && (
                                    <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                        {w.distance} km
                                    </div>
                                )}
                                <Link to={`../all/${w.id}`}>
                                    <h2 className="flex items-center text-xl font-bold text-green-700 dark:text-green-300">
                                        {w.name}
                                    </h2>
                                </Link>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{w.city}</p>
                                
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {w.badges.map(badge => (
                                        <span
                                            key={badge}
                                            className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded dark:bg-green-800 dark:text-green-100 border border-green-200 dark:border-green-700"
                                        >
                                            {badge}
                                        </span>
                                    ))}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Storage Type</span>
                                        <span className="font-semibold text-gray-800 dark:text-gray-100">{w.storageType}</span>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Available</span>
                                        <span className="font-semibold text-gray-800 dark:text-gray-100">{Math.round((w.availableCapacity || 0) / 1000)} tons</span>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Price</span>
                                        <span className="font-bold text-green-700 dark:text-green-300">Rs. {w.price}/kg/day</span>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Rating</span>
                                        <span className="flex items-center font-semibold text-yellow-600 dark:text-yellow-400">
                                            <StarIcon className="h-4 w-4 mr-1" />
                                            {w.rating || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 items-center p-4">
                            <Link
                                to={`../all/${w.id}`}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-semibold text-center border"
                            >
                                View Details
                            </Link>
                            <button
                                onClick={() => onBookWarehouse && onBookWarehouse(w)}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-semibold shadow-md"
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default function WarehouseSearch() {
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [radius, setRadius] = useState(50);
    const [storageType, setStorageType] = useState("");
    const [capacity, setCapacity] = useState("");
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mapCenter, setMapCenter] = useState(centerDefault);
    
    // Search filters
    const [searchCity, setSearchCity] = useState("");
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const [sortBy, setSortBy] = useState("distance"); // distance, price, rating
    
    // Booking form state
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [bookingData, setBookingData] = useState({
        productType: "",
        quantity: "",
        duration: "",
        notes: "",
        farmerName: "",
        farmerPhone: "",
        farmerEmail: ""
    });

    // const { isLoaded } = useJsApiLoader({
    //     id: "google-map-script",
    //     googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",
    // });

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation not supported");
            return;
        }
        navigator.geolocation.getCurrentPosition((pos) => {
            const newLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setLocation(newLocation);
            setMapCenter(newLocation);
            // Auto-search when location is obtained
            handleLocationSearch(newLocation);
        });
    };

    const handleLocationSearch = async (searchLocation = location) => {
        if (!searchLocation.lat || !searchLocation.lng) {
            alert("Please provide your location to search nearby warehouses");
            return;
        }

        try {
            setLoading(true);
            
            // First try the nearby API, fallback to public API with frontend filtering
            let response;
            let warehousesData = [];
            
            try {
                response = await warehouseAPI.getNearbyWarehouses({
                    latitude: searchLocation.lat,
                    longitude: searchLocation.lng,
                    radiusKm: radius,
                    storageType: storageType || undefined,
                    minCapacity: capacity || undefined,
                    limit: 20
                });
                warehousesData = response.data || [];
            } catch {
                console.log('Nearby API failed, falling back to public API with frontend filtering');
                // Fallback: Get all public warehouses and filter by distance on frontend
                response = await warehouseAPI.getPublicWarehouses({
                    storageType: storageType || undefined,
                    minCapacity: capacity || undefined
                });
                
                const allWarehouses = response.data || [];
                
                // Filter warehouses by distance on the frontend
                warehousesData = allWarehouses
                    .map(w => ({
                        ...w,
                        calculatedDistance: w.latitude && w.longitude ? 
                            calculateDistance(searchLocation.lat, searchLocation.lng, w.latitude, w.longitude) : 
                            null
                    }))
                    .filter(w => w.calculatedDistance !== null && w.calculatedDistance <= radius)
                    .sort((a, b) => (a.calculatedDistance || 0) - (b.calculatedDistance || 0))
                    .slice(0, 20);
            }
            
            processWarehouseResults(warehousesData, searchLocation);
        } catch (error) {
            console.error('Error searching nearby warehouses:', error);
            alert('Failed to search nearby warehouses. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const processWarehouseResults = (warehousesData, searchLocation = null) => {
        const transformedWarehouses = warehousesData.map(w => {
            // Calculate distance if location is provided
            let distance = null;
            if (searchLocation && w.latitude && w.longitude) {
                distance = calculateDistance(
                    searchLocation.lat, searchLocation.lng, 
                    w.latitude, w.longitude
                );
            }
            
            // Use already calculated distance from fallback API if available
            if (w.calculatedDistance !== undefined) {
                distance = w.calculatedDistance;
            }
            
            // Use distance from API if available
            if (w.distanceKm !== undefined && w.distanceKm !== null) {
                distance = w.distanceKm;
            }

            return {
                id: w.id,
                name: w.name,
                lat: w.latitude,
                lng: w.longitude,
                city: w.city || w.location,
                address: w.address,
                storageType: w.storageType?.toLowerCase() || 'unknown',
                availableCapacity: w.availableCapacityKg || (w.totalCapacity - (w.usedCapacity || 0)),
                price: w.pricePerKg || w.pricePerTonn / 1000,
                rating: w.rating || 4.0,
                verified: w.verified || false,
                badges: w.badges || ["Storage Facility"],
                imageUrl: w.imageUrl || warehouesImg1,
                distance: distance,
                description: w.description || `${w.name} offers ${w.storageType} storage facilities.`
            };
        });
        
        setWarehouses(transformedWarehouses);
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c * 100) / 100; // Round to 2 decimal places
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            
            let response;
            
            // If location is provided, use nearby search
            if (location.lat && location.lng) {
                response = await warehouseAPI.getNearbyWarehouses({
                    latitude: location.lat,
                    longitude: location.lng,
                    radiusKm: radius,
                    storageType: storageType || undefined,
                    minCapacity: capacity || undefined,
                    limit: 20
                });
            } else {
                // Fallback to general search without location
                response = await warehouseAPI.getPublicWarehouses({
                    storageType: storageType || undefined,
                    minCapacity: capacity || undefined,
                    verifiedOnly: true
                });
            }
            
            const warehousesData = response.data || [];
            
            // Transform the data to match frontend expectations
            const transformedWarehouses = warehousesData.map(w => ({
                id: w.id,
                name: w.name,
                lat: w.latitude,
                lng: w.longitude,
                distance: w.distanceKm,
                storageType: w.storageType?.toLowerCase() || 'unknown',
                availableSlots: w.slots || 0,
                capacityTons: w.capacityTons || 0,
                pricePerTonn: w.pricePerTonn || 0,
                imageUrl: w.imageUrl || warehouesImg1,
                verified: w.verified || false,
                owner: w.owner || `Warehouse #${w.id}`,
                rating: w.rating || 4.0,
                slots: w.slots || 0,
                badges: w.badges || ["Storage Facility"]
            }));

            setWarehouses(transformedWarehouses);
            if (transformedWarehouses.length > 0) {
                setMapCenter({ 
                    lat: transformedWarehouses[0].lat, 
                    lng: transformedWarehouses[0].lng 
                });
            }
        } catch (error) {
            console.error('Error searching warehouses:', error);
            alert('Failed to search warehouses. Please try again.');
            setWarehouses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBookWarehouse = (warehouse) => {
        setSelectedWarehouse(warehouse);
        setShowBookingForm(true);
    };

    const handleBookingSubmit = async () => {
        try {
            if (!selectedWarehouse) return;

            const requestPayload = {
                warehouseId: selectedWarehouse.id,
                quantity: parseFloat(bookingData.quantity),
                durationDays: parseInt(bookingData.duration),
                productType: bookingData.productType,
                notes: bookingData.notes,
                farmerName: bookingData.farmerName,
                farmerPhone: bookingData.farmerPhone,
                farmerEmail: bookingData.farmerEmail
            };

            // Create booking request using the slots API
            await warehouseAPI.createBookingRequest 
                ? warehouseAPI.createBookingRequest(selectedWarehouse.id, requestPayload)
                : fetch(`/api/slots/warehouse/${selectedWarehouse.id}/request-booking`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-User-Id': '1' // TODO: Get from auth context
                    },
                    body: JSON.stringify(requestPayload)
                }).then(res => res.json());

            alert('Booking request submitted successfully! The warehouse owner will review your request.');
            setShowBookingForm(false);
            setSelectedWarehouse(null);
            setBookingData({
                productType: "",
                quantity: "",
                duration: "",
                notes: "",
                farmerName: "",
                farmerPhone: "",
                farmerEmail: ""
            });
        } catch (error) {
            console.error('Error submitting booking request:', error);
            alert('Failed to submit booking request. Please try again.');
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-4 p-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-2">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Warehouse Search</h1>
                            <p className="text-gray-600 mt-1 text-sm">Find and reserve storage at trusted warehouses</p>
                        </div>
                    </div>
                </div>

                {/* Modern filter bar (Crops style) */}
                <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-wrap gap-3 items-center mb-6">
                    {/* Location */}
                    <div className="flex flex-col">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Location</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                step="any"
                                placeholder="Lat"
                                className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700"
                                value={location.lat ?? ""}
                                onChange={e => setLocation(loc => ({ ...loc, lat: parseFloat(e.target.value) }))}
                            />
                            <input
                                type="number"
                                step="any"
                                placeholder="Lng"
                                className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700"
                                value={location.lng ?? ""}
                                onChange={e => setLocation(loc => ({ ...loc, lng: parseFloat(e.target.value) }))}
                            />
                            <button
                                type="button"
                                onClick={getCurrentLocation}
                                className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 text-xs"
                            >
                                Use My Location
                            </button>
                            <LocationPickerModal
                                initialLocation={{ lat: 6.9271, lng: 79.8612 }}
                                onSelect={loc => setLocation(loc)}
                                buttonLabel="Pick Location"
                                buttonClassName="w-32 px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700 text-green-700 dark:text-green-200 font-semibold hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
                            />
                        </div>
                    </div>
                    {/* Radius */}
                    <div className="flex flex-col">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Radius (km)</label>
                        <input
                            type="number"
                            min={1}
                            max={100}
                            value={radius}
                            onChange={e => setRadius(Number(e.target.value))}
                            className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700"
                        />
                    </div>
                    {/* Storage Type */}
                    <div className="flex flex-col">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Storage Type</label>
                        <select
                            className="w-32 px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700"
                            value={storageType}
                            onChange={e => setStorageType(e.target.value)}
                        >
                            <option value="">Any</option>
                            {storageTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    {/* Capacity */}
                    <div className="flex flex-col">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Min Capacity (tons)</label>
                        <input
                            type="number"
                            min={0}
                            value={capacity}
                            onChange={e => setCapacity(Number(e.target.value))}
                            className="w-28 px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700"
                        />
                    </div>
                    {/* Search Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-5">
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 text-sm disabled:bg-gray-400"
                            disabled={loading}
                        >
                            {loading ? 'Searching...' : location.lat && location.lng ? 'Search Nearby' : 'Search All Warehouses'}
                        </button>

                    </div>
                </form>

                <Warehouses 
                    warehouses={warehouses} 
                    onBookWarehouse={handleBookWarehouse}
                />

                {/* Booking Form Modal */}
                {showBookingForm && selectedWarehouse && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">Book Storage</h2>
                                    <button 
                                        onClick={() => setShowBookingForm(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                    <h3 className="font-semibold text-gray-900">{selectedWarehouse.name}</h3>
                                    <p className="text-sm text-gray-600">{selectedWarehouse.city}</p>
                                    <p className="text-sm text-gray-600">Rs. {selectedWarehouse.price}/kg per day</p>
                                </div>

                                <form onSubmit={(e) => { e.preventDefault(); handleBookingSubmit(); }} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Type *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={bookingData.productType}
                                            onChange={(e) => setBookingData(prev => ({ ...prev, productType: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            placeholder="e.g., Rice, Vegetables"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Quantity (kg) *
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                min="1"
                                                value={bookingData.quantity}
                                                onChange={(e) => setBookingData(prev => ({ ...prev, quantity: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Duration (days) *
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                min="1"
                                                value={bookingData.duration}
                                                onChange={(e) => setBookingData(prev => ({ ...prev, duration: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Your Name *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={bookingData.farmerName}
                                                onChange={(e) => setBookingData(prev => ({ ...prev, farmerName: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={bookingData.farmerPhone}
                                                onChange={(e) => setBookingData(prev => ({ ...prev, farmerPhone: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={bookingData.farmerEmail}
                                                onChange={(e) => setBookingData(prev => ({ ...prev, farmerEmail: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Additional Notes
                                        </label>
                                        <textarea
                                            rows="3"
                                            value={bookingData.notes}
                                            onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            placeholder="Special requirements, handling instructions, etc."
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowBookingForm(false)}
                                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        >
                                            Submit Request
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-2">Map View</h3>
                    {isLoaded ? (
                        <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={10}>
                            {warehouses.map((wh) => (
                                <Marker key={wh.id} position={{ lat: wh.lat, lng: wh.lng }} />
                            ))}
                        </GoogleMap>
                    ) : (
                        <p>Loading map...</p>
                    )}
                </div> */}
            </div>
        </div>
    );
}
