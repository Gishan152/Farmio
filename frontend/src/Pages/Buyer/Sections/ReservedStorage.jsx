import { useLoaderData } from "react-router-dom";
import React, { useState, useEffect } from "react";
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

const sampleBookings = [
    {
        id: "BK-1001",
        warehouseName: "Sunrise Warehouse",
        produce: "Rice",
        quantity: 1000,           // in kg
        ratePerDay: 2,            // Rs per kg per day
        startDate: "2025-07-01",
        endDate: "2025-07-15",
        status: "Active"
    },
    {
        id: "BK-1002",
        warehouseName: "Cold Storage Colombo",
        produce: "Bananas",
        quantity: 500,
        ratePerDay: 3,
        startDate: "2025-06-20",
        endDate: "2025-06-27",
        status: "Completed"
    },
    {
        id: "BK-1003",
        warehouseName: "Negombo Dry Store",
        produce: "Maize",
        quantity: 750,
        ratePerDay: 1.5,
        startDate: "2025-07-05",
        endDate: "2025-07-25",
        status: "Active"
    }
];


export default function BookingManagement({ farmerId }) {
    const [bookings, setBookings] = useState([]);
    const [sel, setSel] = useState(null); // selected booking for modal
    const [type, setType] = useState(null); // "retrieve" or "extend"
    const [days, setDays] = useState(0);

    useEffect(() => {
        fetch(`/bookings/farmer/${farmerId}`)
            .then(res => res.json())
            .then(setBookings);
    }, [farmerId]);

    useEffect(() => {
        setBookings(sampleBookings);
    }, []);


    const openModal = (booking, mode) => {
        setSel(booking);
        setType(mode);
        setDays(1);
    };

    const closeModal = () => setSel(null);

    const submitRequest = () => {
        const url = type === "retrieve"
            ? `/bookings/${sel.id}/retrieval`
            : `/bookings/${sel.id}/extend`;
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ days }),
        })
            .then(res => res.json())
            .then(updated => {
                setBookings(b => b.map(x => x.id === updated.id ? updated : x));
                closeModal();
            });
    };

    const calcRefund = b => {
        const unused = Math.max(0, (new Date(b.endDate) - new Date()) / (1000 * 60 * 60 * 24));
        const base = unused * b.ratePerDay * b.quantity;
        const buffer = base * 0.1;
        return base + buffer - (base * 0.1);
    };

    const calcExtension = b => {
        const base = days * b.ratePerDay * b.quantity;
        const buffer = base * 0.1;
        return base + buffer;
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold dark:text-gray-100">My Bookings</h1>
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-separate border-spacing-y-4">
                    <thead className="text-left text-gray-600">
                        <tr>
                            {["ID", "Warehouse", "Product", "Qty", "Duration", "Status", "End Date", "Actions"].map(h => (
                                <th key={h} className="px-3 py-2">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(b => (
                            <tr key={b.id} className="bg-white dark:bg-gray-800 rounded-lg">
                                <td className="px-3 py-2">{b.id}</td>
                                <td className="px-3 py-2">{b.warehouseName}</td>
                                <td className="px-3 py-2">{b.produce}</td>
                                <td className="px-3 py-2">{b.quantity}</td>
                                <td className="px-3 py-2">
                                    {b.startDate} - {b.endDate}
                                </td>
                                <td className="px-3 py-2">{b.status}</td>
                                <td className="px-3 py-2">{new Date(b.endDate).toLocaleDateString()}</td>
                                <td className="px-3 py-2 space-x-2">
                                    {b.status === "Active" && (
                                        <>
                                            <button
                                                onClick={() => openModal(b, "retrieve")}
                                                className="px-2 py-1 bg-yellow-500 text-white rounded"
                                            >Early Retr.</button>
                                            <button
                                                onClick={() => openModal(b, "extend")}
                                                className="px-2 py-1 bg-blue-600 text-white rounded"
                                            >Extend</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {sel && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div
                        className="fixed inset-0 bg-black opacity-50 flex items-center justify-center z-50"
                        onClick={() => { closeModal() }}
                    ></div>
                    <div className="relative z-50 bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
                        <h3 className="text-lg font-semibold">
                            {type === "retrieve" ? "Request Early Retrieval" : "Request Extension"}
                        </h3>
                        <div>
                            <label className="block">Days {type === "extend" ? "to add" : "unused"}</label>
                            <input
                                type="number"
                                min="1"
                                max={type === "extend" ? 30 : calcRefund(sel) / sel.ratePerDay / sel.quantity}
                                value={days}
                                onChange={e => setDays(Number(e.target.value))}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        <div className="bg-gray-100 p-3 rounded">
                            {type === "retrieve"
                                ? `Estimated Refund: Rs. ${calcRefund(sel).toFixed(2)}`
                                : `Estimated Additional Cost: Rs. ${calcExtension(sel).toFixed(2)}`
                            }
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded">
                                Cancel
                            </button>
                            <button onClick={submitRequest} className="px-4 py-2 bg-green-600 text-white rounded">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
