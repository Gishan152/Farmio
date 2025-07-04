// src/buyer/pages/ReservedStorage.jsx
import React from "react";
import { useLoaderData } from "react-router-dom";
import { groupBy } from "lodash"; // install lodash
import { CheckBadgeIcon, ClockIcon } from "@heroicons/react/24/solid";
import warehouesImg1 from "../../../Assets/Buyer/Warehouses/warehouse.webp";
import warehouesImg2 from "../../../Assets/Buyer/Warehouses/warehouse2.webp";

export async function reservedLoader({ request }) {
    // TODO: fetch from API
    return [
        {
            warehouseId: 1,
            warehouseName: "Sunrise Warehouse",
            // warehouseImage: "/images/warehouse1.jpg",
            warehouseImage: warehouesImg1,
            owner: { name: "John Doe", avatarUrl: "https://randomuser.me/api/portraits/men/43.jpg", rating: 4.7 },
            reservationDate: "2025-07-10",
            slots: [
                { slotId: 101, status: "reserved", quantity: 5, reservedUntil: "3h 20m" },
                { slotId: 102, status: "reserved", quantity: 2, reservedUntil: "1d 2h" }
            ]
        },
        {
            warehouseId: 2,
            warehouseName: "Green Field Storage",
            // warehouseImage: "/images/warehouse2.jpg",
            warehouseImage: warehouesImg2,
            owner: { name: "Acme Farms", avatarUrl: "https://randomuser.me/api/portraits/men/44.jpg", rating: 4.3 },
            reservationDate: "2025-07-12",
            slots: [
                { slotId: 201, status: "reserved", quantity: 3, reservedUntil: "4h" }
            ]
        },
        {
            warehouseId: 2,
            warehouseName: "Green Field Storage",
            // warehouseImage: "/images/warehouse2.jpg",
            warehouseImage: warehouesImg2,
            owner: { name: "Acme Farms", avatarUrl: "https://randomuser.me/api/portraits/men/44.jpg", rating: 4.3 },
            reservationDate: "2025-07-12",
            slots: [
                { slotId: 201, status: "reserved", quantity: 3, reservedUntil: "4h" }
            ]
        },
        {
            warehouseId: 2,
            warehouseName: "Green Field Storage",
            // warehouseImage: "/images/warehouse2.jpg",
            warehouseImage: warehouesImg2,
            owner: { name: "Acme Farms", avatarUrl: "https://randomuser.me/api/portraits/men/44.jpg", rating: 4.3 },
            reservationDate: "2025-07-12",
            slots: [
                { slotId: 201, status: "reserved", quantity: 3, reservedUntil: "4h" }
            ]
        }
    ];
}

export default function ReservedStorage() {
    const reservations = useLoaderData();

    const grouped = groupBy(reservations, "warehouseId"); // group by warehouse
    const list = Object.values(grouped);

    return (
        <section className="p-6 space-y-8">
            <h1 className="text-2xl font-semibold dark:text-gray-100">Your Reserved Storage Units</h1>
            {list.map(group => {
                const first = group[0];
                return (
                    <div key={first.warehouseId} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg p-6 space-y-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                            <img src={first.warehouseImage} alt={first.warehouseName} className="h-20 w-20 object-cover rounded-lg shadow" />
                            <div className="flex-1">
                                <h2 className="text-xl font-bold dark:text-gray-100">{first.warehouseName}</h2>
                                <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 mt-1">
                                    <img src={first.owner.avatarUrl} alt={first.owner.name} className="h-8 w-8 rounded-full" />
                                    <span>{first.owner.name}</span>
                                    <CheckBadgeIcon className="h-5 w-5 text-blue-500" />
                                    <span>{first.owner.rating.toFixed(1)}</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Reserved on: <span className="font-medium">{first.reservationDate}</span>
                                </p>
                            </div>
                        </div>

                        <div className="border-t dark:border-gray-700 pt-4">
                            <h3 className="text-lg font-medium dark:text-gray-100 mb-3">Reserved Slots</h3>
                            <ul className="space-y-3">
                                {group.flatMap(r => r.slots).map(s => (
                                    <li key={s.slotId} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition hover:bg-gray-100 dark:hover:bg-gray-600">
                                        <div className="space-y-1">
                                            <p className="font-medium dark:text-gray-100">Slot #{s.slotId}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">Quantity: {s.quantity} kg</p>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                            <ClockIcon className="h-5 w-5 text-yellow-500" />
                                            <span>{s.reservedUntil}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}
