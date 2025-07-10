// src/buyer/pages/Crops.jsx
import React, { useState } from 'react';
// import { useLoaderData } from 'react-router-dom';
import { StarIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import wheat from "../../../Assets/Buyer/Crops/wheat.webp";
import corn from "../../../Assets/Buyer/Crops/corn.jpeg";
import { Link } from 'react-router-dom';
import { useSavesContext } from '../../../Contexts/Buyer/SavesContext';

export function cropsLoader() {
    return [
        {
            id: 1,
            type: 'Corn',
            pricePerUnit: 120,
            farm: 'Sunny Farm',
            location: 'Iowa, USA',
            rating: 4.5,
            verified: true,
            imageUrl: corn,
            badges: ['Organic', 'On Sale'],
        },
        {
            id: 2,
            type: 'Wheat',
            pricePerUnit: 175,
            farm: 'Golden Fields',
            location: 'Kansas, USA',
            rating: 4.2,
            verified: false,
            imageUrl: wheat,
            badges: [],
        },
        {
            id: 3,
            type: 'Rice',
            pricePerUnit: 110,
            farm: 'Green Valley',
            location: 'Kandy, Sri Lanka',
            rating: 4.7,
            verified: true,
            imageUrl: wheat,
            badges: ['Organic'],
        },
        {
            id: 4,
            type: 'Tomato',
            pricePerUnit: 95,
            farm: 'Highland Farms',
            location: 'Nuwara Eliya, Sri Lanka',
            rating: 4.0,
            verified: false,
            imageUrl: wheat,
            badges: ['On Sale'],
        },
        {
            id: 5,
            type: 'Potato',
            pricePerUnit: 80,
            farm: 'Riverbend Farm',
            location: 'Badulla, Sri Lanka',
            rating: 4.3,
            verified: true,
            imageUrl: wheat,
            badges: [],
        },
        {
            id: 6,
            type: 'Green Gram',
            pricePerUnit: 210,
            farm: 'AgroCare Co-op',
            location: 'Kurunegala, Sri Lanka',
            rating: 4.8,
            verified: true,
            imageUrl: wheat,
            badges: ['Organic', 'Certified'],
        }
    ];

}

export default function Crops() {
    // const crops = useLoaderData();
    const crops = cropsLoader();
    const { items: savedItems, addItem: addItemToSaves, removeItem: removeItemFromSaves } = useSavesContext();

    const [open, setOpen] = useState(false);
    const [crop, setCrop] = useState(null);

    const handleAdd = qty => {
        console.log(`Adding ${qty} kg of`, crop.type);
        addItemToSaves(crop, qty);
    };

    const handleRemove = crop => {
        removeItemFromSaves(crop.id)
    }

    return (
        <section className="p-6">
            <h1 className="text-2xl font-semibold mb-6 dark:text-gray-100">Available Crops</h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {crops.map(crop => (
                    <div
                        key={crop.id}
                        className="flex flex-col justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-lg overflow-hidden transition"
                    >
                        <div>
                            <div className="relative h-48 bg-gray-200">
                                <img
                                    src={crop.imageUrl}
                                    alt={crop.type}
                                    className="object-cover w-full h-full"
                                />
                                {crop.verified && (
                                    <div className="absolute top-2 right-2 bg-white p-1 border-none rounded-[50%]">
                                        <CheckBadgeIcon className="h-6 w-6 text-green-500" />
                                    </div>
                                )}
                            </div>

                            <div className="p-4 space-y-2">
                                <Link to={`./${21321}`}>
                                    <h2 className="flex items-center text-xl font-bold dark:text-gray-100">
                                        {crop.type}
                                    </h2>
                                </Link>
                                <p className="text-lg dark:text-gray-200">Rs{crop.pricePerUnit.toFixed(2)}</p>

                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-medium dark:text-gray-300">{crop.farm}</span>{' '}
                                    • {crop.location}
                                </div>

                                <div className="flex items-center text-gray-700 dark:text-gray-300">
                                    <StarIcon className="h-5 w-5 text-yellow-500" />
                                    <span className="ml-1">{crop.rating}</span>
                                </div>

                                {/* Additional badges */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {crop.badges.map(badge => (
                                        <span
                                            key={badge}
                                            className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-green-800 dark:text-green-100"
                                        >
                                            {badge}
                                        </span>
                                    ))}
                                </div>

                            </div>
                        </div>
                        <div className="p-4 space-y-2">
                            {
                                savedItems?.find(v=>crop.id==v.id) ? 
                                <button
                                    className="w-full py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                                    onClick={() => {
                                        handleRemove(crop)
                                    }}>
                                    Remove from Cart
                                </button> 
                                :
                                <button
                                    className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                    onClick={() => {
                                        setCrop(crop)
                                        setOpen(true)
                                    }}>
                                    Add to Cart
                                </button>
                            }
                        </div>
                        <QuantityModal
                            isOpen={open}
                            onClose={() => setOpen(false)}
                            onConfirm={handleAdd}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}

function QuantityModal({ isOpen, onClose, onConfirm }) {
    const [qty, setQty] = useState(10);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (qty < 10) {
            setError('Minimum quantity is 10 kg');
            return;
        }
        onConfirm(qty);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
                className="absolute inset-0 bg-black opacity-50"
                onClick={onClose}
            />
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 z-10 w-full max-w-sm">
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">
                    Select Quantity (kg)
                </h3>
                <input
                    type="number"
                    min="10"
                    value={qty}
                    onChange={e => {
                        setQty(+e.target.value);
                        if (error) setError('');
                    }}
                    className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
                {error && <p className="mt-1 text-red-500">{error}</p>}
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
