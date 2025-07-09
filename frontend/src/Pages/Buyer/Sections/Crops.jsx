// src/buyer/pages/Crops.jsx
import React, { useEffect, useState } from 'react';
// import { useLoaderData } from 'react-router-dom';
import { StarIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import wheat from "../../../Assets/Buyer/Crops/wheat.webp";
import corn from "../../../Assets/Buyer/Crops/corn.jpeg";
import { Link, useNavigate } from 'react-router-dom';
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
            unitMeasurement: "kg",
            transpotationAvailable: true,
            returnsAccepted: false,
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
            unitMeasurement: "kg",
            transpotationAvailable: true,
            returnsAccepted: false,
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
            unitMeasurement: "kg",
            transpotationAvailable: true,
            returnsAccepted: false,
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
            unitMeasurement: "kg",
            transpotationAvailable: true,
            returnsAccepted: false,
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
            unitMeasurement: "kg",
            transpotationAvailable: true,
            returnsAccepted: false,
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
            unitMeasurement: "kg",
            transpotationAvailable: true,
            returnsAccepted: false,
            badges: ['Organic', 'Certified'],
        }
    ];

}

export default function Crops() {
    // const crops = useLoaderData();
    const crops = cropsLoader();
    const { items: savedItems, addItem: addItemToSaves, removeItem: removeItemFromSaves } = useSavesContext();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [selectedCrop, setSelectedCrop] = useState(null);

    const handleAdd = qty => {
        console.log(`Adding ${qty} kg of`, selectedCrop.data.type);
        addItemToSaves(selectedCrop.data, qty);
    };

    const handleRemove = crop => {
        removeItemFromSaves(crop.id)
    }

    const handleBuy = (qty) => {
        const item = selectedCrop.data;
        item.quantity = qty;
        navigate("../order-confirmation", { state: { items: [item] } })
    }

    const handleConfirm = (qty) => {
        if(selectedCrop.operation === "save"){
            handleAdd(qty);
        }else{
            handleBuy(qty);
        }
    }

    return (
        <section className="p-6">
            <h1 className="text-2xl font-semibold mb-6 dark:text-gray-100">Available Crops</h1>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xlg:grid-cols-4">
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
                                <p className="text-lg dark:text-gray-200">Rs{crop.pricePerUnit.toFixed(2)} per {crop.unitMeasurement}</p>

                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-medium dark:text-gray-300">{crop.farm}</span>{' '}
                                    • {crop.location}
                                </div>

                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-medium dark:text-gray-300">{crop.transpotationAvailable ? "Transpotation Available" : "Transpotation Not Available"}</span>
                                </div>

                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-medium dark:text-gray-300">{crop.totalStock} {crop.unitMeasurement} Available</span>
                                </div>

                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-medium dark:text-gray-300">{crop.returnsAccepted ? "Returns Accepted" : "No Returns"}</span>
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
                        <div className="flex gap-2 items-center p-4 space-y-2">
                            {
                                savedItems?.find(v => crop.id == v.id) ?
                                    <button
                                        className="p-2 m-0 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                                        onClick={() => {
                                            handleRemove(crop)
                                        }}>
                                        Remove from Saves
                                    </button>
                                    :
                                    <button
                                        className="p-2 m-0 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                        onClick={() => {
                                            setSelectedCrop({operation: "save", data: crop})
                                            setOpen(true)
                                        }}>
                                        Add to Saves
                                    </button>
                            }
                            <button
                                onClick={() => {
                                    setSelectedCrop({operation: "order", data: crop})
                                    setOpen(true)
                                }}
                                className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                                Buy now
                            </button>
                        </div>
                        <QuantityModal
                            isOpen={open}
                            onClose={() => setOpen(false)}
                            onConfirm={handleConfirm}
                            submitButtonText={selectedCrop.operation === "save" ? "Add to Saves" : "Order"}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}

function QuantityModal({ isOpen, onClose, onConfirm, submitButtonText }) {
    const [qty, setQty] = useState(10);
    const [error, setError] = useState('');

    // Reset when modal opens
    useEffect(() => {
        if (!isOpen) {
            setQty(10);
            setError('');
        }
    }, [isOpen]);

    const handleConfirm = () => {
        if (qty < 10) {
            setError('Minimum quantity is 10 kg');
            return;
        }
        onConfirm(qty);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black opacity-15"
                onClick={onClose}
            />

            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 z-10">
                <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
                    Select Quantity (kg)
                </h2>

                <input
                    type="number"
                    min="10"
                    value={qty}
                    onChange={e => {
                        setQty(+e.target.value);
                        if (error) setError('');
                    }}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        {submitButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
}