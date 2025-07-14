import React, { useState } from "react";
import { Star, ShieldCheck, Search } from "lucide-react";
import warehouesImg1 from "../../../Assets/Farmer/Warehouses/warehouse.webp";
import warehouesImg2 from "../../../Assets/Farmer/Warehouses/warehouse2.webp";

export function FarmerwarehousesLoader() {
    return [
        {
            id: 1,
            name: "Sunrise Warehouse",
            owner: "John Doe",
            rating: 4.7,
            slots: 125,
            capacityTons: 250,
            pricePerTonn: 20,
            storageType: "Temperature controlled",
            verified: true,
            badges: ["24/7 Security", "Fumigation Certified"],
            service_location:"Horana",
            imageUrl: warehouesImg1
        },
        {
            id: 2,
            name: "Green Field Storage",
            owner: "Acme Farms",
            rating: 4.3,
            slots: 80,
            capacityTons: 150,
            pricePerTonn: 15,
            storageType: "Dry storage",
            verified: false,
            badges: ["Accessible Loading Dock"],
            service_location:"Horana",
            imageUrl: warehouesImg2
        },
        {
            id: 3,
            name: "Colombo Vegetables",
            owner: "Naleeka",
            rating: 4.3,
            slots: 80,
            capacityTons: 150,
            pricePerTonn: 15,
            storageType: "Dry storage",
            verified: false,
            badges: ["Accessible Loading Dock"],
            service_location:"Horana",
            imageUrl: warehouesImg1
        },
        {
            id: 4,
            name: "Kandy supermarts",
            owner: "John Doe",
            rating: 4.7,
            slots: 125,
            capacityTons: 250,
            pricePerTonn: 20,
            storageType: "Temperature controlled",
            verified: true,
            badges: ["24/7 Security", "Fumigation Certified"],
            service_location:"Horana",
            imageUrl: warehouesImg2
        },
        {
            id: 5,
            name: "Galle Rice",
            owner: "Acme Farms",
            rating: 4.3,
            slots: 80,
            capacityTons: 150,
            pricePerTonn: 15,
            storageType: "Dry storage",
            verified: false,
            badges: ["Accessible Loading Dock"],
            service_location:"Horana",
            imageUrl: warehouesImg1
        },
        {
            id: 6,
            name: "Kaluthara coconout oil",
            owner: "Naleeka",
            rating: 4.3,
            slots: 80,
            capacityTons: 150,
            pricePerTonn: 15,
            storageType: "Dry storage",
            verified: false,
            badges: ["Accessible Loading Dock"],
            service_location:"Horana",
            imageUrl: warehouesImg2
        },
    ];
}

export default function FarmerWarehouses() {
    const warehouses = FarmerwarehousesLoader();
    const [searchTerm, setSearchTerm] = useState("");

    // Filter warehouses based on search term
    const filteredWarehouses = warehouses.filter(w => {
        const searchLower = searchTerm.toLowerCase();
        return (
            w.name.toLowerCase().includes(searchLower) ||
            w.owner.toLowerCase().includes(searchLower) ||
            w.storageType.toLowerCase().includes(searchLower) ||
            w.service_location.toLowerCase().includes(searchLower) ||
            w.badges.some(badge => badge.toLowerCase().includes(searchLower)) ||
            w.rating.toString().includes(searchLower) ||
            w.slots.toString().includes(searchLower) ||
            w.capacityTons.toString().includes(searchLower) ||
            w.pricePerTonn.toString().includes(searchLower)
        );
    });

    return (
        <section className="p-6">
            <h1 className="text-2xl font-semibold mb-6 dark:text-gray-100">Warehouses</h1>
            
            {/* Search Field */}
            <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="     Search warehouses by name, owner, location, storage type"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                             placeholder-gray-500 dark:placeholder-gray-400 
                             focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
            </div>

            {/* Results count */}
            {searchTerm && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Found {filteredWarehouses.length} warehouse{filteredWarehouses.length !== 1 ? 's' : ''}
                </p>
            )}

            {/* Warehouse Grid - NOW USING filteredWarehouses */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredWarehouses.map(w => (
                    <div
                        key={w.id}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                    >
                        <div className="relative h-40 bg-gray-200">
                            <img src={w.imageUrl} alt={w.name} className="object-cover w-full h-full" />
                            {w.verified && (
                                <div className="absolute top-2 right-2 bg-white p-1 border-none rounded-[50%]">
                                    <ShieldCheck className="h-6 w-6 text-green-500" />
                                </div>
                            )}
                        </div>
                        <div className="p-4 space-y-2">
                            <h2 className="text-xl font-bold dark:text-gray-100">{w.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Owner: {w.owner}</p>
                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                                <span className="ml-1">{w.rating}</span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                <p>Slots available: {w.slots}</p>
                                <p>Capacity: {w.capacityTons} tons</p>
                                <p>Price: ${w.pricePerTonn.toFixed(2)}/ton</p>
                                <p>Type: {w.storageType}</p>
                                <p>Location: {w.service_location}</p>
                            </div>
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {w.badges.map(b => (
                                    <span
                                        key={b}
                                        className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 text-xs font-medium px-2 py-0.5 rounded"
                                    >
                                        {b}
                                    </span>
                                ))}
                            </div>
                            <button className="block text-center mt-4 w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* No results message */}
            {filteredWarehouses.length === 0 && searchTerm && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                        No warehouses found matching "{searchTerm}"
                    </p>
                </div>
            )}
        </section>
    );
}