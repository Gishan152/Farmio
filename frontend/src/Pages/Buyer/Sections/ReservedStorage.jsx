import { useState, useEffect } from "react";
import { ClipboardDocumentListIcon, CurrencyDollarIcon, CheckBadgeIcon, ClockIcon } from "@heroicons/react/24/solid";
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
        slotId: "S-101",
        warehouseName: "Sunrise Warehouse",
        produce: "Rice",
        quantity: 1000,           // in kg
        capacity: 1200,           // in kg
        ratePerDay: 2,            // Rs per kg per day
        startDate: "2025-07-01",
        endDate: "2025-07-15",
        status: "Active"
    },
    {
        id: "BK-1002",
        slotId: "S-202",
        warehouseName: "Cold Storage Colombo",
        produce: "Bananas",
        quantity: 500,
        capacity: 600,
        ratePerDay: 3,
        startDate: "2025-06-20",
        endDate: "2025-06-27",
        status: "Completed"
    },
    {
        id: "BK-1003",
        slotId: "S-303",
        warehouseName: "Negombo Dry Store",
        produce: "Maize",
        quantity: 750,
        capacity: 1000,
        ratePerDay: 1.5,
        startDate: "2025-07-05",
        endDate: "2025-07-25",
        status: "Active"
    }
];

export default function ReservedStorage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Stat cards
    const stats = {
        totalBookings: bookings.length,
        totalAmount: bookings.reduce((sum, b) => sum + b.quantity * b.ratePerDay * (new Date(b.endDate) - new Date(b.startDate)) / (1000 * 60 * 60 * 24), 0),
        active: bookings.filter(b => b.status === 'Active').length,
        completed: bookings.filter(b => b.status === 'Completed').length
    };

    useEffect(() => {
        setTimeout(() => {
            setBookings(sampleBookings);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-4 p-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-2">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Reserved Storage</h1>
                            <p className="text-gray-600 mt-1 text-sm">View your reserved warehouse storage and details</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Total Bookings */}
                    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-1 bg-green-500 rounded-l-lg" />
                        <ClipboardDocumentListIcon className="h-7 w-7 text-green-500 mr-3 z-10" />
                        <div className="z-10">
                            <p className="text-xs font-medium text-gray-500">Total Bookings</p>
                            <p className="text-lg font-bold text-gray-900">{stats.totalBookings}</p>
                        </div>
                    </div>
                    {/* Total Amount */}
                    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-1 bg-yellow-500 rounded-l-lg" />
                        <CurrencyDollarIcon className="h-7 w-7 text-yellow-500 mr-3 z-10" />
                        <div className="z-10">
                            <p className="text-xs font-medium text-gray-500">Total Amount</p>
                            <p className="text-lg font-bold text-gray-900">Rs. {stats.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </div>
                    </div>
                    {/* Active */}
                    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-l-lg" />
                        <CheckBadgeIcon className="h-7 w-7 text-blue-500 mr-3 z-10" />
                        <div className="z-10">
                            <p className="text-xs font-medium text-gray-500">Active</p>
                            <p className="text-lg font-bold text-gray-900">{stats.active}</p>
                        </div>
                    </div>
                    {/* Completed */}
                    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-1 bg-gray-400 rounded-l-lg" />
                        <ClockIcon className="h-7 w-7 text-gray-500 mr-3 z-10" />
                        <div className="z-10">
                            <p className="text-xs font-medium text-gray-500">Completed</p>
                            <p className="text-lg font-bold text-gray-900">{stats.completed}</p>
                        </div>
                    </div>
                </div>

                {/* Bookings Table with loading spinner */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Booking History</h2>
                    </div>
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                            <p className="mt-2 text-gray-600 text-sm">Loading bookings...</p>
                        </div>
                    ) : (
                        <div className="p-4 overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2 text-left font-semibold">Booking ID</th>
                                        <th className="p-2 text-left font-semibold">Slot</th>
                                        <th className="p-2 text-left font-semibold">Status</th>
                                        <th className="p-2 text-left font-semibold">Total</th>
                                        <th className="p-2 text-left font-semibold">Product</th>
                                        <th className="p-2 text-left font-semibold">Capacity</th>
                                        <th className="p-2 text-left font-semibold">Used</th>
                                        <th className="p-2 text-left font-semibold">Warehouse</th>
                                        <th className="p-2 text-left font-semibold">Duration</th>
                                        <th className="p-2 text-left font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(b => {
                                        let badgeClass = 'bg-gray-100 text-gray-700';
                                        let status = b.status?.toUpperCase();
                                        if (status === 'COMPLETED') badgeClass = 'bg-blue-100 text-blue-800';
                                        else if (status === 'ACTIVE') badgeClass = 'bg-green-100 text-green-800';
                                        else if (status === 'CANCELLED') badgeClass = 'bg-red-100 text-red-800';
                                        // Humanize status
                                        let displayStatus = b.status
                                            ? b.status
                                                .toLowerCase()
                                                .split('_')
                                                .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                                                .join(' ')
                                            : '';
                                        return (
                                            <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="p-2 font-medium text-green-700">{b.id}</td>
                                                <td className="p-2">{b.slotId}</td>
                                                <td className="p-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>{displayStatus}</span>
                                                </td>
                                                <td className="p-2 font-semibold">Rs. {(b.quantity * b.ratePerDay * ((new Date(b.endDate) - new Date(b.startDate)) / (1000 * 60 * 60 * 24))).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                                <td className="p-2">{b.produce}</td>
                                                <td className="p-2">{b.capacity} kg</td>
                                                <td className="p-2">{b.quantity} kg</td>
                                                <td className="p-2">{b.warehouseName}</td>
                                                <td className="p-2">{b.startDate} - {b.endDate}</td>
                                                <td className="p-2 space-x-2">
                                                    {status === 'ACTIVE' && (
                                                        <>
                                                            <button className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">Early Retrieval</button>
                                                            <button className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Extend</button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
