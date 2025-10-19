// src/buyer/pages/Crops.jsx
import React, { useEffect, useState } from 'react';
// import { useLoaderData } from 'react-router-dom';
import { StarIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import wheat from "../../../Assets/Buyer/Crops/wheat.webp";
import corn from "../../../Assets/Buyer/Crops/corn.jpeg";
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { useSavesContext } from '../../../Contexts/Buyer/SavesContext';
import api from '@/API/client';

export async function cropsLoader() {

    const res = await api.get('/api/products/suggest')
    // const products = res.data;
    console.log("Products loaded: ", res.data);

    // Map ProductResponseDTO fields to match current frontend expectations
    // const crops = products.map(product => ({
    //     id: product.id,
    //     type: product.productName,
    //     pricePerUnit: product.pricePerUnit,
    //     farm: `Farmer ${product.userId}`,  // TODO: Fetch actual farmer name
    //     location: product.location,
    //     rating: product.averageRating,
    //     ratingCount: product.ratingCount,
    //     verified: true,  // Default to true, could add verification logic
    //     imageUrl: product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : null,
    //     unitMeasurement: product.measurement,
    //     transportationAvailable: product.transportAvailability === "Yes" ? true : false,
    //     returnsAccepted: product.returnAccepted === "Yes" ? true : false,
    //     badges: product.badges || [],
    //     totalStock: product.availableStock,
    //     createdAt: product.createdAt,
    //     updatedAt: product.updatedAt,
    // }));
    const crops = res.data.map(crop=>{
        crop.totalStock = crop.availableStock;
        console.log("crop : ", crop);
        return crop;
    });

    return crops;

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
            transpotationAvailable: false,
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
            returnsAccepted: true,
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
    let allCrops = useLoaderData();
    console.log("All crops : ", allCrops)
    allCrops = allCrops.map(crop => {
        crop.imageUrl = Math.random() >= 0.5 ? wheat : corn;
        return crop;
    });
    // const allCrops = cropsLoader();
    const { items: savedItems, addItem: addItemToSaves, removeItem: removeItemFromSaves } = useSavesContext();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [selectedCrop, setSelectedCrop] = useState(null);

    // Filter state
    const [search, setSearch] = useState("");
    const [type, setType] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minRating, setMinRating] = useState("");
    const [badge, setBadge] = useState("");

    // Unique crop types and badges for filter dropdowns
    const cropTypes = Array.from(new Set(allCrops.map(c => c.type)));
    const allBadges = Array.from(new Set(allCrops.flatMap(c => c.badges)));

    // Filtering logic
    const crops = allCrops.filter(crop => {
        if (search && !crop.type.toLowerCase().includes(search.toLowerCase()) && !crop.farm.toLowerCase().includes(search.toLowerCase()) && !crop.location.toLowerCase().includes(search.toLowerCase())) return false;
        if (type && crop.type !== type) return false;
        if (minPrice && crop.pricePerUnit < +minPrice) return false;
        if (maxPrice && crop.pricePerUnit > +maxPrice) return false;
        if (minRating && crop.rating < +minRating) return false;
        if (badge && !crop.badges.includes(badge)) return false;
        return true;
    });

    const handleAdd = qty => {
        addItemToSaves(selectedCrop.data, qty);
    };

    const handleRemove = crop => {
        removeItemFromSaves(crop.id)
    }

    const handleBuy = (qty) => {
        const item = selectedCrop.data;
        item.quantity = qty;
        console.log("item selected : g : ", item)
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


            {/* Filter Bar - Warehouse WasteAgent style */}
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
                <form
                    className="flex flex-wrap gap-x-3 gap-y-2 items-center"
                    onSubmit={e => e.preventDefault()}
                >
                    {/* Search */}
                    <div className="flex flex-col min-w-[180px] max-w-xs flex-1">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Search</label>
                        <div className="relative">
                            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search crops, farm, or location..."
                                className="w-full pl-9 pr-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                                style={{ minWidth: 0 }}
                            />
                        </div>
                    </div>
                    {/* Type Filter */}
                    <div className="flex flex-col max-w-[120px] min-w-0">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Type</label>
                        <select
                            value={type}
                            onChange={e => setType(e.target.value)}
                            className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                        >
                            <option value="">All Types</option>
                            {cropTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    {/* Badge Filter */}
                    <div className="flex flex-col max-w-[120px] min-w-0">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Badge</label>
                        <select
                            value={badge}
                            onChange={e => setBadge(e.target.value)}
                            className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                        >
                            <option value="">All Badges</option>
                            {allBadges.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                    {/* Min Price */}
                    <div className="flex flex-col max-w-[100px] min-w-0">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Min Price</label>
                        <input
                            type="number"
                            value={minPrice}
                            onChange={e => setMinPrice(e.target.value)}
                            placeholder="Min Price"
                            className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                            min="0"
                        />
                    </div>
                    {/* Max Price */}
                    <div className="flex flex-col max-w-[100px] min-w-0">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Max Price</label>
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={e => setMaxPrice(e.target.value)}
                            placeholder="Max Price"
                            className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                            min="0"
                        />
                    </div>
                    {/* Min Rating */}
                    <div className="flex flex-col max-w-[150px] min-w-0">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Min Rating</label>
                        <select
                            value={minRating}
                            onChange={e => setMinRating(e.target.value)}
                            className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                        >
                            <option value="">Any Rating</option>
                            {[5,4.5,4,3.5,3].map(r => <option key={r} value={r}>{r}+</option>)}
                        </select>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            setSearch(""); setType(""); setMinPrice(""); setMaxPrice(""); setMinRating(""); setBadge("");
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold text-sm whitespace-nowrap mt-5"
                    >
                        <FunnelIcon className="h-4 w-4" />
                        Clear Filters
                    </button>
                </form>
            </div>

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xlg:grid-cols-4">
                {crops.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">
                        No crops found matching your filters.
                    </div>
                ) : crops.map(crop => (
                    <div
                        key={crop.id}
                        className="flex flex-col justify-between bg-gradient-to-br from-green-50 to-white dark:from-green-900 dark:to-gray-900 border border-green-100 dark:border-green-800 rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <div>
                            <div className="relative h-48 bg-gray-200">
                                <img
                                    src={crop.imageUrl}
                                    alt={crop.type}
                                    className="object-cover w-full h-full"
                                />
                                {crop.verified && (
                                    <div className="absolute top-2 right-2 bg-white p-1 border-none rounded-full shadow-md">
                                        <CheckBadgeIcon className="h-6 w-6 text-green-500" />
                                    </div>
                                )}
                            </div>
                            <div className="p-5 space-y-2">
                                <Link to={`./${21321}`}>
                                    <h2 className="flex items-center text-xl font-bold text-green-700 dark:text-green-300">
                                        {crop.type}
                                    </h2>
                                </Link>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {crop.badges.map(badge => (
                                        <span
                                            key={badge}
                                            className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded dark:bg-green-800 dark:text-green-100 border border-green-200 dark:border-green-700"
                                        >
                                            {badge}
                                        </span>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Price</span>
                                        <span className="font-bold text-green-700 dark:text-green-300">Rs{crop.pricePerUnit.toFixed(2)}/{crop.unitMeasurement}</span>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Farm</span>
                                        <span className="font-semibold text-gray-800 dark:text-gray-100">{crop.farm}</span>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Location</span>
                                        <span className="font-semibold text-gray-800 dark:text-gray-100">{crop.location}</span>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Rating</span>
                                        <span className="flex items-center font-semibold text-yellow-600 dark:text-yellow-400"><StarIcon className="h-4 w-4 mr-1" />{crop.rating}</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${crop.transportationAvailable ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}`}>{crop.transportationAvailable ? 'Transport Available' : 'No Transport'}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${crop.returnsAccepted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>{crop.returnsAccepted ? 'Returns Accepted' : 'No Returns'}</span>
                                    {crop.totalStock && <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">{crop.totalStock} {crop.unitMeasurement} Available</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 items-center p-4">
                            {
                                savedItems?.find(v => crop.id == v.id) ?
                                    <button
                                        className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 font-semibold shadow-md"
                                        onClick={() => {
                                            handleRemove(crop)
                                        }}>
                                        Remove from Saves
                                    </button>
                                    :
                                    <button
                                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-semibold shadow-md"
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
                                className="flex-1 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-all duration-200 font-semibold shadow-md"
                            >
                                Buy now
                            </button>
                        </div>
                    </div>
                ))}
                <QuantityModal
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    onConfirm={handleConfirm}
                    submitButtonText={selectedCrop?.operation === "save" ? "Add to Saves" : "Order"}
                />
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
        <div className="fixed inset-0 z-51 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black opacity-30"
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