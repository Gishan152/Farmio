import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import { StarIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";
import warehouesImg1 from "../../../Assets/Buyer/Warehouses/warehouse.webp";
import warehouesImg2 from "../../../Assets/Buyer/Warehouses/warehouse2.webp";

export function warehousesLoader() {
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
            // imageUrl: "/images/warehouse1.jpg",
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
            // imageUrl: "/images/warehouse2.jpg",
            imageUrl: warehouesImg2
        },
        // Add more entries...
    ];
}

export default function Warehouses() {
    // const warehouses = useLoaderData();
    const warehouses = warehousesLoader();

    return (
        <section className="p-6">
            <h1 className="text-2xl font-semibold mb-6 dark:text-gray-100">Warehouses</h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {warehouses.map(w => (
                    <div
                        key={w.id}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                    >
                        <div className="relative h-40 bg-gray-200">
                            <img src={w.imageUrl} alt={w.name} className="object-cover w-full h-full" />
                            {w.verified && (
                                <div className="absolute top-2 right-2 bg-white p-1 border-none rounded-[50%]">
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
                                <p>Capacity: {w.capacityTons} tons</p>
                                <p>Price: ${w.pricePerTonn.toFixed(2)}/ton</p>
                                <p>Type: {w.storageType}</p>
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
                            <Link to={`../${w.id}`} className="block text-center mt-4 w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
