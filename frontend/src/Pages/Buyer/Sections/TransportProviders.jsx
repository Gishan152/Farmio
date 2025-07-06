// src/buyer/pages/TransportProviders.jsx
import React from "react";
import { useLoaderData } from "react-router-dom";
import { StarIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";
import { TruckIcon } from "@heroicons/react/24/outline";

export function transportProvidersLoader() {
    return [
        {
            id: 1,
            name: "FastMove Logistics",
            rating: 4.8,
            verified: true,
            badges: ["24/7 Service", "Insurance Included"],
            pricePerKm: 1.5,
            available: true,
            imageUrl: "/images/truck1.jpg",
            contact: "John Smith",
            contactRating: 4.6,
        },
        {
            id: 2,
            name: "Trusty Transport",
            rating: 4.4,
            verified: false,
            badges: ["Temperature-Controlled"],
            pricePerKm: 2.0,
            available: false,
            imageUrl: "/images/truck2.jpg",
            contact: "Sarah Johnson",
            contactRating: 4.3,
        },
        // more providers…
    ];
}

export default function TransportProviders() {
    const providers = useLoaderData();

    return (
        <section className="p-6">
            <h1 className="text-2xl font-semibold mb-6 dark:text-gray-100">Transport Providers</h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {providers.map(p => (
                    <div key={p.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                        <div className="relative h-40 bg-gray-200">
                            <img src={p.imageUrl} alt={p.name} className="object-cover w-full h-full" />
                            <div className="absolute top-2 left-2 flex items-center space-x-1">
                                <TruckIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                                {p.verified && <CheckBadgeIcon className="h-6 w-6 text-blue-500" />}
                            </div>
                        </div>
                        <div className="p-4 space-y-2">
                            <h2 className="text-xl font-bold dark:text-gray-100">{p.name}</h2>
                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                                <StarIcon className="h-5 w-5 text-yellow-500" />
                                <span className="ml-1">{p.rating}</span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Price: ${p.pricePerKm.toFixed(2)}/km</p>
                            <p className={`text-sm font-medium ${p.available ? 'text-green-600' : 'text-red-500'}`}>
                                {p.available ? 'Available' : 'Currently Unavailable'}
                            </p>

                            <div className="flex items-center mt-2 text-gray-500 dark:text-gray-400">
                                <img src="https://randomuser.me/api/portraits/men/44.jpg" alt={p.contact} className="h-8 w-8 rounded-full mr-2" />
                                <div>
                                    <p>{p.contact}</p>
                                    <div className="flex items-center text-sm">
                                        <StarIcon className="h-4 w-4 text-yellow-500" />
                                        <span className="ml-1">{p.contactRating}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-2">
                                {p.badges.map(b => (
                                    <span key={b} className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 text-xs font-medium px-2 py-0.5 rounded">
                                        {b}
                                    </span>
                                ))}
                            </div>

                            <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
