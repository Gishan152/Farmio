import { useState, useEffect } from "react";
import { useLoaderData, Link, useNavigate } from "react-router-dom";
import {
    StarIcon,
    CheckBadgeIcon,
    ChevronDownIcon
} from "@heroicons/react/24/solid";
import corn from "../../../Assets/Buyer/Crops/corn.jpeg";
import { useSavesContext } from "../../../Contexts/Buyer/SavesContext";

// Mock reviews
const reviews = [
    {
        id: 1,
        user: "Alice",
        avatar: "https://randomuser.me/api/portraits/women/65.jpg",
        rating: 5,
        date: "2025-06-15",
        comment: "Excellent quality, packed beautifully!"
    },
    {
        id: 2,
        user: "Bob",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 4,
        date: "2025-05-30",
        comment: "Good crop but a bit pricey."
    }
];

const relatedCrops = [
    {
        id: 'CROP-201',
        type: 'Wheat',
        pricePerUnit: 10.0,
        farm: 'Golden Fields',
        location: 'Kansas, USA',
        rating: 4.2,
        verified: false,
        // imageUrl: '/images/wheat.jpg',
        imageUrl: corn,
        badges: ['Whole Grain']
    },
    {
        id: 'CROP-202',
        type: 'Rice',
        pricePerUnit: 11.5,
        farm: 'Riverbank Farm',
        location: 'Arkansas, USA',
        rating: 4.8,
        verified: true,
        // imageUrl: '/images/rice.jpg',
        imageUrl: corn,
        badges: ['Organic', 'Gluten-Free']
    },
    {
        id: 'CROP-203',
        type: 'Barley',
        pricePerUnit: 9.75,
        farm: 'Mountain Grain',
        location: 'Colorado, USA',
        rating: 4.1,
        verified: false,
        // imageUrl: '/images/barley.jpg',
        imageUrl: corn,
        badges: []
    },
    {
        id: 'CROP-204',
        type: 'Corn',
        pricePerUnit: 12.5,
        farm: 'Sunny Farm',
        location: 'Iowa, USA',
        rating: 4.5,
        verified: true,
        // imageUrl: '/images/corn.jpg',
        imageUrl: corn,
        badges: ['Organic', 'Non‑GMO']
    },
    {
        id: 'CROP-205',
        type: 'Soybean',
        pricePerUnit: 14.0,
        farm: 'Green Acre',
        location: 'Illinois, USA',
        rating: 4.3,
        verified: true,
        // imageUrl: '/images/soybean.jpg',
        imageUrl: corn,
        badges: ['Non‑GMO']
    },
];


export async function cropDetailsLoader({ params }) {
    const { cropId } = params;

    return {
        id: cropId,
        type: "Corn",
        pricePerUnit: 12.5,
        farm: "Sunny Farm",
        location: "Iowa, USA",
        rating: 4.5,
        verified: true,
        imageUrl: corn,
        unitMeasurement: "kg",
        transpotationAvailable: true,
        returnsAccepted: false,
        badges: ["Organic", "Non-GMO"],
        stock: 120,
        sku: "CRN-001",
        description:
            "High-quality, non-GMO corn grown on Sunny Farm. Rich in nutrients ideal for cooking and feeding.",
        specifications: {
            moisture: "12%",
            size: "Large",
            packaging: "Bulk bag"
        }
    };
}

export default function CropDetails() {
    const [open, setOpen] = useState();
    const crop = useLoaderData();
    const navigate = useNavigate();

    const { items: savedItems, addItem, removeItem } = useSavesContext();
    const handleBuy = (qty) => {
        const item = crop;
        item.quantity = qty;
        navigate("../order-confirmation", { state: { items: [item] } })
    }


    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-10">
            {/* Breadcrumb */}
            <nav className="text-gray-500 text-sm mb-2">
                <ul className="flex space-x-2">
                    <li><Link to="/buyer/crops" className="hover:underline">Crops</Link> /</li>
                    <li><span className="capitalize text-gray-700 dark:text-gray-200">{crop.type}</span></li>
                </ul>
            </nav>

            {/* Main Product Section */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Image Gallery */}
                <div className="flex-1 min-w-[320px] max-w-lg">
                    <div className="relative rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-gray-900 lg:sticky lg:top-24">
                        <img src={crop.imageUrl} alt={crop.type} className="w-full h-80 md:h-96 object-cover" />
                        {crop.verified && (
                            <div className="absolute top-4 right-4 bg-white p-1 rounded-full shadow">
                                <CheckBadgeIcon className="h-7 w-7 text-green-500" />
                            </div>
                        )}
                    </div>
                    {/* Gallery thumbnails could go here in future */}
                </div>

                {/* Product Info & Actions */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Title & Badges */}
                    <h1 className="text-3xl md:text-4xl font-bold dark:text-gray-100 mb-2 flex items-center gap-2">
                        {crop.type}
                    </h1>
                    <div className="flex flex-wrap gap-2 mb-1">
                        {crop.badges.map(b => (
                            <span key={b} className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 text-xs font-semibold px-2 py-1 rounded">
                                {b}
                            </span>
                        ))}
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded text-xs font-semibold">SKU: {crop.sku}</span>
                    </div>

                    {/* Price & Stock */}
                    <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-2xl font-bold text-green-700 dark:text-green-300">Rs {crop.pricePerUnit.toFixed(2)} <span className="text-base font-normal text-gray-500 dark:text-gray-400">/ {crop.unitMeasurement}</span></span>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 rounded text-xs font-semibold">
                            In stock: {crop.stock} {crop.unitMeasurement}
                        </span>
                    </div>

                    {/* Farm, Location, Rating */}
                    <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 flex-wrap">
                        <span><span className="font-medium dark:text-gray-200">{crop.farm}</span> • {crop.location}</span>
                        <span className="flex items-center"><StarIcon className="h-5 w-5 text-yellow-500" /><span className="ml-1 dark:text-gray-200">{crop.rating.toFixed(1)}</span></span>
                    </div>

                    {/* Status Chips */}
                    <div className="flex flex-wrap gap-3">
                        {crop.transpotationAvailable && <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Transport Available</span>}
                        {crop.returnsAccepted ? <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Returns Accepted</span> : <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">No Returns</span>}
                    </div>

                    {/* Description */}
                    <div>
                        <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">{crop.description}</p>
                    </div>

                    {/* Product Details (Specifications & Info) */}
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold dark:text-gray-100">Product Details</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(crop.specifications).map(([key, val]) => (
                                <li
                                    key={key}
                                    className="flex items-center bg-green-50 dark:bg-green-900/60 rounded-lg px-4 py-3 border border-green-100 dark:border-green-800 shadow-sm"
                                >
                                    <span className="font-semibold capitalize text-green-700 dark:text-green-300 mr-2 min-w-[90px]">{key}:</span>
                                    <span className="text-gray-700 dark:text-gray-200">{val}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Shipping & Returns Info */}
                    <div className="flex flex-col md:flex-row gap-4 text-sm">
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded p-2">
                            <span className="font-semibold text-green-700 dark:text-green-300">Shipping:</span>
                            <span className="text-gray-600 dark:text-gray-300">Ships within 2-3 days</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded p-2">
                            <span className="font-semibold text-green-700 dark:text-green-300">Returns:</span>
                            <span className="text-gray-600 dark:text-gray-300">{crop.returnsAccepted ? 'Accepted within 7 days' : 'Not accepted'}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col md:flex-row gap-3">
                        {savedItems?.find(v => crop.id == v.id) ?
                            <button className="flex-1 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold shadow" onClick={() => removeItem(crop.id)}>Remove from Saves</button>
                            :
                            <button className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow" onClick={() => { setOpen(true); setTimeout(() => { document.activeElement.blur(); }, 100); }}>Add to Saves</button>
                        }
                        <button
                            onClick={()=>setOpen(true)}
                            className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>



            {/* Reviews Section */}
            <div className="space-y-6 mt-8">
                <h2 className="text-2xl font-semibold dark:text-gray-100 flex items-center gap-2">
                    Customer Reviews
                    <span className="text-base text-gray-500 dark:text-gray-400 font-normal">({reviews.length})</span>
                </h2>
                <ul className="flex flex-col gap-6">
                    {reviews.map(r => (
                        <li key={r.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg flex border border-gray-100 dark:border-gray-700 overflow-hidden">
                            {/* Accent bar */}
                            <div className="w-2 bg-gradient-to-b from-green-400 via-green-500 to-green-600 dark:from-green-700 dark:via-green-600 dark:to-green-500" />
                            <div className="flex-1 p-6 flex flex-col gap-3">
                                <div className="flex items-center gap-4">
                                    <img src={r.avatar} alt={r.user} className="h-12 w-12 rounded-full border-2 border-green-200 dark:border-green-700 shadow" />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-lg dark:text-gray-100">{r.user}</p>
                                            <span className="text-xs text-gray-400">{r.date}</span>
                                        </div>
                                        <div className="flex items-center mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon key={i} className={`h-5 w-5 ${i < r.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="pl-16">
                                    <p className="text-gray-700 dark:text-gray-300 text-base italic">“{r.comment}”</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-end">
                    <button className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow transition">Write a Review</button>
                </div>
            </div>


            {/* Related Products */}
            <div className="space-y-4 mt-8">
                <h2 className="text-2xl font-semibold dark:text-gray-100 flex items-center gap-2">
                    <span>You May Also Like</span>
                    <span className="text-base text-gray-500 dark:text-gray-400 font-normal">({relatedCrops.length})</span>
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {relatedCrops.map(crop => (
                        <RelatedCropCard key={crop.id} crop={crop} />
                    ))}
                </div>
            </div>

            {/* Sticky Action Bar for mobile */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 shadow-inner flex gap-2 px-4 py-3 md:hidden border-t border-gray-200 dark:border-gray-700">
                {savedItems?.find(v => crop.id == v.id) ?
                    <button
                        className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold shadow"
                        onClick={() => removeItem(crop.id)}
                    >
                        Remove from Saves
                    </button>
                    :
                    <button
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow"
                        onClick={() => { setOpen(true); setTimeout(() => { document.activeElement.blur(); }, 100); }}
                    >
                        Add to Saves
                    </button>
                }
                <button
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow"
                    onClick={()=>setOpen(true)}
                >
                    Buy Now
                </button>
            </div>

            <QuantityModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={handleBuy}
            />

        </div>
    );
}

function RelatedCropCard({ crop }) {
    return (
        <div className="flex flex-col justify-between bg-gradient-to-br from-green-50 to-white dark:from-green-900 dark:to-gray-900 border border-green-100 dark:border-green-800 rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1">
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
                    <Link to={`./${crop.id}`}>
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
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${crop.transpotationAvailable ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}`}>{crop.transpotationAvailable ? 'Transport Available' : 'No Transport'}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${crop.returnsAccepted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>{crop.returnsAccepted ? 'Returns Accepted' : 'No Returns'}</span>
                        {crop.totalStock && <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">{crop.totalStock} {crop.unitMeasurement} Available</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}

function QuantityModal({ isOpen, onClose, onConfirm }) {
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
                className="absolute inset-0 bg-black opacity-50"
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
                        Add to Saves
                    </button>
                </div>
            </div>
        </div>
    );
}