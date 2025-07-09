// src/buyer/pages/WarehouseDetails.jsx
import React from "react";
import { useLoaderData } from "react-router-dom";
import { StarIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";
import warehouseImage from "../../../Assets/Farmer/Warehouses/warehouse.webp";

export async function FarmerwarehouseDetailsLoader({ params }) {
    const { warehouseId } = params;
    // TODO: fetch data from API
    return {
        id: warehouseId,
        name: "Sunrise Warehouse",
        owner: {
            name: "John Doe",
            // avatarUrl: "/images/owner-john.jpg",
            avatarUrl: "https://randomuser.me/api/portraits/men/44.jpg",
            rating: 4.7,
        },
        location: "Iowa, USA",
        warehouseRating: 4.6,
        slots: [
            { id: 1, status: "available" },
            { id: 2, status: "reserved", reservedUntil: "2h 30m" },
            { id: 3, status: "reserved", reservedUntil: "1d 4h" },
            // ...
        ],
        capacityTons: 250,
        pricePerTonn: 20,
        storageType: "Temperature controlled",
        verified: true,
        badges: ["24/7 Security", "Fumigation Certified"],
        // imageUrl: "/images/warehouse1.jpg",
        imageUrl: warehouseImage,
        description:
            "Sunrise Warehouse offers modern, secure & temperature controlled storage. Ideal for agricultural produce and packaged goods. Located near main roads with 24/7 security.",
    };
}

export default function FarmerWarehouseDetails() {
    const w = useLoaderData();

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="relative w-full lg:w-1/3 h-64 rounded-lg overflow-hidden shadow-lg">
                    <img
                        src={w.imageUrl}
                        alt={w.name}
                        className="object-cover w-full h-full"
                    />
                    {w.verified && (
                        <div className="absolute top-2 right-2 bg-white p-1 border-none rounded-[50%]">
                            <CheckBadgeIcon className="h-6 w-6 text-green-500" />
                        </div>
                    )}
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                        {w.badges.map(b => (
                            <span key={b} className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 text-xs font-medium px-2 py-1 rounded">
                                {b}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold">{w.name}</h1>
                        <div className="flex items-center">
                            <StarIcon className="h-5 w-5 text-yellow-500" />
                            <span className="ml-1">{w.warehouseRating}</span>
                        </div>
                    </div>
                    <p className="text-gray-600">{w.location}</p>

                        <div className="flex items-center">
                            <img src={w.owner.avatarUrl} alt={w.owner.name} className="h-8 w-8 rounded-full" />
                            <span className="ml-2">{w.owner.name}</span>
                            <StarIcon className="h-4 w-4 text-yellow-500 ml-2" />
                            <span className="ml-1">{w.owner.rating}</span>
                        </div>

                    <p className="mt-4 text-gray-800">{w.description}</p>
                    {/* <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4 shadow"> */}
                    <div className="grid lg:grid-cols-2 bg-white dark:bg-gray-800">
                        {/* <h2 className="text-xl font-semibold mb-2">Warehouse Details</h2> */}
                        <p><strong>Storage Type:</strong> {w.storageType}</p>
                        <p><strong>Capacity:</strong> {w.capacityTons} tons</p>
                        <p><strong>Price:</strong> ${w.pricePerTonn.toFixed(2)}/ton</p>
                        <p><strong>Total Slots:</strong> {w.slots.length}</p>
                        <p><strong>Available Slots:</strong> {w.slots.filter(s => s.status === "available").length}</p>
                    </div>
                </div>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
            <div className="grid grid-cols-1 gap-6">

                {/* <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow">
                    <h2 className="text-xl font-semibold mb-2">Slot Status</h2>
                    <ul className="space-y-2">
                        {w.slots.map(slot => (
                            <li key={slot.id} className="flex justify-between items-center">
                                <span>Slot #{slot.id}</span>
                                {slot.status === "available" ? (
                                    <span className="text-green-600">Available</span>
                                ) : (
                                    <span className="text-orange-500">
                                        Reserved ({slot.reservedUntil})
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div> */}
                <table
                    className="w-full"
                >
                    <tr>
                        <th>Slot type</th>
                        <th>Capacity</th>
                        <th>Temprature control</th>
                        <th>Humidity control</th>
                        <th>Availability Status</th>
                        <th>Floor/Section</th>
                        <th>Last Maintenance</th>
                        <th>Pricing(per Kg)</th>
                        <th>Allowed item types</th>
                        <th>Insurance Status</th>
                    </tr>
                </table>
            </div>

            <div className="flex gap-4">
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                    Book a Slot
                </button>
                <button className="px-4 py-2 border rounded hover:bg-gray-100">
                    Contact Owner
                </button>
            </div>
        </div>
    );
}
