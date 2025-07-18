import React, { useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Link } from "react-router-dom";
import { CheckBadgeIcon, StarIcon } from "@heroicons/react/24/solid";
import LocationPickerModal from "../../../Components/LocationPickerModel";
import warehouesImg1 from "../../../Assets/Buyer/Warehouses/warehouse.webp";
import warehouesImg2 from "../../../Assets/Buyer/Warehouses/warehouse2.webp";

const containerStyle = { width: "100%", height: "300px" };
const centerDefault = { lat: 6.9271, lng: 79.8612 };
const storageTypes = ["Cold", "Dry"];

function Warehouses({ warehouses }) {
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
                            <div className="relative h-48 bg-gray-200">
                                <img
                                    src={w.imageUrl}
                                    alt={w.name}
                                    className="object-cover w-full h-full"
                                />
                                {w.verified && (
                                    <div className="absolute top-2 right-2 bg-white p-1 border-none rounded-full shadow-md">
                                        <CheckBadgeIcon className="h-6 w-6 text-green-500" />
                                    </div>
                                )}
                            </div>
                            <div className="p-5 space-y-2">
                                <Link to={`../all/${w.id}`}>
                                    <h2 className="flex items-center text-xl font-bold text-green-700 dark:text-green-300">
                                        {w.name}
                                    </h2>
                                </Link>
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
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Owner</span>
                                        <span className="font-semibold text-gray-800 dark:text-gray-100">{w.owner}</span>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Type</span>
                                        <span className="font-semibold text-gray-800 dark:text-gray-100">{w.storageType}</span>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Slots</span>
                                        <span className="font-semibold text-gray-800 dark:text-gray-100">{w.slots}</span>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Capacity</span>
                                        <span className="font-semibold text-gray-800 dark:text-gray-100">{w.capacityTons} tons</span>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Price</span>
                                        <span className="font-bold text-green-700 dark:text-green-300">${w.pricePerTonn.toFixed(2)}/ton</span>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Rating</span>
                                        <span className="flex items-center font-semibold text-yellow-600 dark:text-yellow-400"><StarIcon className="h-4 w-4 mr-1" />{w.rating}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 items-center p-4">
                            <Link
                                to={`../all/${w.id}`}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-semibold shadow-md text-center"
                            >
                                View Details
                            </Link>
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
    const [mapCenter, setMapCenter] = useState(centerDefault);

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
            setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            setMapCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!location.lat || !location.lng) {
            alert("Please provide a location");
            return;
        }
        // Simulate fetching filtered warehouses — replace with real API call
        const data = [
            {
                id: 1,
                name: "Colombo Cold Storage",
                lat: 6.9271,
                lng: 79.8612,
                distance: 0,
                storageType: "Cold",
                availableSlots: 10,
                capacityTons: 500,
                pricePerTonn: 15,
                imageUrl: warehouesImg1,
                verified: true,
                owner: "John Doe",
                rating: 4.5,
                slots: 10,
                badges: ["Certified", "24/7 Access"],
            },
            {
                id: 2,
                name: "Dry Warehouse Negombo",
                lat: 7.2081,
                lng: 79.835,
                distance: 35,
                storageType: "Dry",
                availableSlots: 5,
                capacityTons: 300,
                pricePerTonn: 10,
                imageUrl: warehouesImg2,
                verified: false,
                owner: "Jane Smith",
                rating: 4.0,
                slots: 5,
                badges: ["Secure", "Affordable"],
            },
        ].filter(
            (wh) =>
                (!storageType || wh.storageType === storageType) &&
                (!capacity || wh.capacityTons >= capacity)
        );

        setWarehouses(data);
        if (data.length > 0) setMapCenter({ lat: data[0].lat, lng: data[0].lng });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-4 p-4">
            <h2 className="text-2xl font-semibold mb-4">Warehouse Search</h2>
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
                {/* Search Button */}
                <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 text-sm mt-5"
                >
                    Search
                </button>
            </form>

            <Warehouses warehouses={warehouses} />

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
    );
}
