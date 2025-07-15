import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { StarIcon, CheckBadgeIcon, TrashIcon } from "@heroicons/react/24/solid";
import { TruckIcon } from "@heroicons/react/24/outline";
import tp1 from "../../../Assets/Farmer/Transport/tp.webp";
import tp2 from "../../../Assets/Farmer/Transport/tp2.jpg";

export function FarmertransportProvidersLoader() {
    return [
        {
            id: 1,
            name: "FastMove Logistics",
            rating: 4.8,
            verified: true,
            badges: ["24/7 Service", "Insurance Included"],
            pricePerKm: 1.5,
            available: true,
            // imageUrl: "/images/truck1.jpg",
            imageUrl: tp1,
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
            // imageUrl: "/images/truck2.jpg",
            imageUrl: tp2,
            contact: "Sarah Johnson",
            contactRating: 4.3,
        },
        // more providers…
    ];
}

export default function FarmerTransportProviders() {
    const [modalOpen, setModalOpen] = useState();
    const providers = useLoaderData();

    return (
        <section className="p-6">
            <h1 className="text-2xl font-semibold mb-6 dark:text-gray-100">Transport Providers</h1>
            <div className="flex justify-between items-center">
                <div></div>
                <button className="w-fit p-2 bg-green-600 text-white rounded hover:bg-green-700 transition" onClick={()=>setModalOpen(true)}>Create Job</button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {providers.map(p => (
                    <div key={p.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                        <div className="relative h-40 bg-gray-200">
                            <img src={p.imageUrl} alt={p.name} className="object-cover w-full h-full" />
                            <div className="absolute top-2 left-2 flex items-center space-x-1">
                                <div className="bg-white p-1 border-none rounded-[50%]">
                                    <TruckIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                                </div>
                                {p.verified &&
                                    <div className="bg-white p-1 border-none rounded-[50%]">
                                        <CheckBadgeIcon className="h-6 w-6 text-green-500" />
                                    </div>
                                }
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

                            <button className="mt-4 w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <FarmerTransportJobFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={data => {
                    console.log('New transport job data:', data);
                    // call API or add to state...
                }}
            />

        </section>
    );
}

function FarmerTransportJobFormModal({ isOpen, onClose, onSubmit }) {
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [items, setItems] = useState([{ description: '', quantity: '' }]);

    useEffect(() => {
        if (!isOpen) {
            setPickup('');
            setDropoff('');
            setItems([{ description: '', quantity: '' }]);
        }
    }, [isOpen]);

    const addItem = () => {
        if (items.length < 10) {
            setItems(prev => [...prev, { description: '', quantity: '' }]);
        }
    };

    const removeItem = idx => {
        setItems(prev => prev.filter((_, i) => i !== idx));
    };

    const updateItem = (idx, field, value) => {
        setItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: value } : it));
    };

    const handleSubmit = () => {
        onSubmit({ pickup, dropoff, items });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6 z-10">
                <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
                    Create Transport Job
                </h2>

                <div className="space-y-4 mb-4">
                    <input
                        type="text"
                        placeholder="Pickup Location Address"
                        value={pickup}
                        onChange={e => setPickup(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Drop-off Location Address"
                        value={dropoff}
                        onChange={e => setDropoff(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div className="mt-4">
                    <h3 className="font-semibold mb-2 dark:text-gray-100">Items ({items.length})</h3>
                    {items.map((item, idx) => (
                        <div key={idx} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="Item description"
                                value={item.description}
                                onChange={e => updateItem(idx, 'description', e.target.value)}
                                className="flex-1 border p-2 rounded"
                            />
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={item.quantity}
                                onChange={e => updateItem(idx, 'quantity', e.target.value)}
                                className="w-25 border p-2 rounded"
                            />
                            {items.length > 1 && (
                                <button onClick={() => removeItem(idx)} className="text-red-500"><TrashIcon className="w-5 h-5"/></button>
                            )}
                        </div>
                    ))}
                    {items.length < 10 && (
                        <button onClick={addItem} className="mt-2 text-blue-600 hover:underline">
                            + Add item
                        </button>
                    )}
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Create Job
                    </button>
                </div>
            </div>
        </div>
    );
}