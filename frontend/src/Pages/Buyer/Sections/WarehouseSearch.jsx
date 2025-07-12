import React, { useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Link } from "react-router-dom";
import { CheckBadgeIcon, StarIcon } from "@heroicons/react/24/solid";
import LocationPickerModal from "../../../Components/LocationPickerModel";

const containerStyle = { width: "100%", height: "300px" };
const centerDefault = { lat: 6.9271, lng: 79.8612 };
const storageTypes = ["Cold", "Dry"];

function Warehouses({ warehouses }) {
    return (
        <section className="py-6">
            <h1 className="text-2xl font-semibold mb-6 dark:text-gray-100">Warehouses</h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {warehouses.length === 0 && <p>No warehouses found matching criteria.</p>}
                {warehouses.map((w) => (
                    <div
                        key={w.id}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                    >
                        <div className="relative h-40 bg-gray-200">
                            <img src={w.imageUrl} alt={w.name} className="object-cover w-full h-full" />
                            {w.verified && (
                                <div className="absolute top-2 right-2 bg-white p-1 rounded-full">
                                    <CheckBadgeIcon className="h-6 w-6 text-green-500" />
                                </div>
                            )}
                        </div>
                        <div className="p-4 space-y-2">
                            <h2 className="text-xl font-bold dark:text-gray-100">{w.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Owner: {w.owner}</p>
                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                                <StarIcon className="h-5 w-5 text-yellow-500" />
                                <span className="ml-1">{w.rating}</span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                <p>Slots available: {w.slots}</p>
                                <p>Capacity: {w.capacityTons} tons</p>
                                <p>Price: ${w.pricePerTonn.toFixed(2)}/ton</p>
                                <p>Type: {w.storageType}</p>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {w.badges.map((b) => (
                                    <span
                                        key={b}
                                        className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 text-xs font-medium px-2 py-0.5 rounded"
                                    >
                                        {b}
                                    </span>
                                ))}
                            </div>
                            <Link
                                to={`../all/${w.id}`}
                                className="block text-center mt-4 w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
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
                imageUrl: "https://via.placeholder.com/400x160",
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
                imageUrl: "https://via.placeholder.com/400x160",
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
        <div className="p-6 max-w-7xl">
            <h2 className="text-2xl font-semibold mb-4">Warehouse Search</h2>
            <form onSubmit={handleSearch} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Location (lat, lng)</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            step="any"
                            placeholder="Latitude"
                            className="border rounded p-2 w-1/2"
                            value={location.lat ?? ""}
                            onChange={(e) =>
                                setLocation((loc) => ({ ...loc, lat: parseFloat(e.target.value) }))
                            }
                        />
                        <input
                            type="number"
                            step="any"
                            placeholder="Longitude"
                            className="border rounded p-2 w-1/2"
                            value={location.lng ?? ""}
                            onChange={(e) =>
                                setLocation((loc) => ({ ...loc, lng: parseFloat(e.target.value) }))
                            }
                        />
                        <button
                            type="button"
                            onClick={getCurrentLocation}
                            className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
                        >
                            Use Current Location
                        </button>
                        <LocationPickerModal
                            initialLocation={{ lat: 6.9271, lng: 79.8612 }}
                            onSelect={(loc) => setLocation(loc)}
                            buttonLabel="Pick a warehouse location"
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-1 font-medium">Search Radius (km)</label>
                    <input
                        type="number"
                        min={1}
                        max={100}
                        value={radius}
                        onChange={(e) => setRadius(Number(e.target.value))}
                        className="border rounded p-2 w-24"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Storage Type</label>
                    <select
                        className="border rounded p-2 w-48"
                        value={storageType}
                        onChange={(e) => setStorageType(e.target.value)}
                    >
                        <option value="">Any</option>
                        {storageTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-medium">Minimum Capacity (tons)</label>
                    <input
                        type="number"
                        min={0}
                        value={capacity}
                        onChange={(e) => setCapacity(Number(e.target.value))}
                        className="border rounded p-2 w-48"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
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
