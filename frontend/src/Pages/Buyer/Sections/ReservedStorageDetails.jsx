import React from "react";
import { useLoaderData, Link, useParams } from "react-router-dom";
import { CheckBadgeIcon, ClockIcon, StarIcon } from "@heroicons/react/24/solid";
import warehouseImage from "../../../Assets/Buyer/Warehouses/warehouse.webp";
import { sortedLastIndex } from "lodash";

const sampleReservations = [
    {
        id: 1,
        name: "Sunrise Warehouse",
        owner: {
            name: "John Doe",
            // avatarUrl: "/images/owner-john.jpg",
            avatarUrl: "https://randomuser.me/api/portraits/men/44.jpg",
            rating: 4.7,
        },
        location: "Iowa, USA",
        warehouseRating: 4.6,
        capacityTons: 250,
        pricePerTonn: 20,
        storageType: "Temperature controlled",
        verified: true,
        badges: ["24/7 Security", "Fumigation Certified"],
        // imageUrl: "/images/warehouse1.jpg",
        imageUrl: warehouseImage,
        description:
            "Sunrise Warehouse offers modern, secure & temperature controlled storage. Ideal for agricultural produce and packaged goods. Located near main roads with 24/7 security.",
        reservationDate: "2025-07-10",
        slots: [
            {
                id: 'SLOT-001',
                type: 'Pallet',
                capacityKg: 1000,
                temperatureControl: '+2 - +8 °C',
                humidityControl: '30 - 50 %',
                availability: 'Available',
                location: 'Floor 1 / Aisle 3',
                lastMaintenance: '2025-06-15',
                pricingPerKg: 2.5,
                allowedTypes: ['Grains', 'Vegetables', 'Packaged Goods'],
                insuranceStatus: 'Insured',
            },
            {
                id: 'SLOT-002',
                type: 'Bulk',
                capacityKg: 2000,
                temperatureControl: 'None',
                humidityControl: 'None',
                availability: 'Reserved',
                location: 'Floor 1 / Aisle 5',
                lastMaintenance: '2025-05-20',
                pricingPerKg: 1.8,
                allowedTypes: ['Raw Materials', 'Construction'],
                insuranceStatus: 'Not Insured',
            },
            {
                id: 'SLOT-003',
                type: 'Refrigerated Container',
                capacityKg: 500,
                temperatureControl: '-20 °C',
                humidityControl: '50 - 60 %',
                availability: 'Available',
                location: 'Floor 0 / Dock Level',
                lastMaintenance: '2025-06-30',
                pricingPerKg: 5.0,
                allowedTypes: ['Frozen Foods', 'Medicines'],
                insuranceStatus: 'Insured',
            }
        ]
    },
    {
        sortedLastIndex: 2,
        warehouseName: "Green Field Storage",
        warehouseImage: "warehouse2.jpg",
        owner: {
            name: "Acme Farms",
            avatarUrl: "https://randomuser.me/api/portraits/men/44.jpg",
            rating: 4.3
        },
        reservationDate: "2025-07-12",
        slots: [
            {
                id: 'SLOT-004',
                type: 'Shelf',
                capacityKg: 200,
                temperatureControl: 'Ambient',
                humidityControl: 'Ambient',
                availability: 'Available',
                location: 'Floor 2 / Section B',
                lastMaintenance: '2025-07-01',
                pricingPerKg: 1.0,
                allowedTypes: ['Electronics', 'Small Parts'],
                insuranceStatus: 'Insured',
            },
            {
                id: 'SLOT-005',
                type: 'Cold Room',
                capacityKg: 1500,
                temperatureControl: '0 - +4 °C',
                humidityControl: '60 - 70%',
                availability: 'Under Maintenance',
                location: 'Floor 0 / Section C',
                lastMaintenance: '2025-07-05',
                pricingPerKg: 3.5,
                allowedTypes: ['Dairy', 'Pharmaceutical'],
                insuranceStatus: 'Insured',
            }
        ]
    }
];

// Usage for loader simulation:
localStorage.setItem("reservations", JSON.stringify(sampleReservations));


// Loader to fetch specific warehouse reservations
export function warehouseReservationLoader({ params }) {
    const warehouseId = Number(params.warehouseId);
    console.log("warehouseId: ", params.warehouseId);
    // TODO: Replace with API call, e.g. fetch(`/api/reservations?warehouseId=${warehouseId}`)
    // const all = await reservedLoader(); // import or inline JSON from your loader
    const all = sampleReservations;
    console.log("all : ", all);
    const filtered = all.find(r => r.id === warehouseId);
    console.log("warehouse : ", filtered);
    return filtered;
}

export default function WarehouseReservationDetails() {
    // const reservations = useLoaderData();
    // const { id } = useParams();
    // if (!reservations.length) return <div className="p-6">No reservations found.</div>;

    // const { warehouseName, warehouseImage, owner } = reservations[0];
    // const allSlots = reservations.flatMap(r => r.slots);
    const w = useLoaderData();
    const warehouseSlots = w.slots;

    return (
        <div className="container mx-auto p-6 space-y-6">
            <nav className="text-gray-500 text-sm flex justify-between">
                <ul className="flex space-x-2">
                    <li><Link to="/buyer/warehouses/all" className="hover:underline">warehouses</Link> /</li>
                    <li><span>warehouseId</span></li>
                </ul>
            </nav>
            <div>
                <h1 className="text-3xl font-bold">Reservation Details</h1>
            </div>
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
                        {w.badges?.map(b => (
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
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                {['Slot type', 'Capacity', 'Temperature control', 'Humidity control', 'Availability Status', 'Floor/Section', 'Last Maintenance', 'Pricing (per Kg)', 'Allowed item types', 'Insurance Status'].map(header => (
                                    <th key={header} className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {warehouseSlots?.map(slot => (
                                <tr key={slot.id} className="odd:bg-white even:bg-gray-50 dark:even:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{slot.type}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{slot.capacityKg} kg</td>
                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{slot.temperatureControl}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{slot.humidityControl}</td>
                                    <td className={`px-4 py-2 text-sm font-medium ${slot.availability === 'Available'
                                        ? 'text-green-600'
                                        : slot.availability === 'Reserved'
                                            ? 'text-yellow-600'
                                            : 'text-red-600'
                                        } dark:font-semibold`}>
                                        {slot.availability}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{slot.location}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{slot.lastMaintenance}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">Rs. {slot.pricingPerKg.toFixed(2)}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">
                                        {slot.allowedTypes.join(', ')}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{slot.insuranceStatus}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => setOpen(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Reserve Slots
                </button>
                <button className="px-4 py-2 border rounded hover:bg-gray-100">
                    Contact Owner
                </button>
            </div>
        </div>
    );
}
