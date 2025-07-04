import React from "react";
import { useLoaderData, Link } from "react-router-dom";
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
        price: 10.0,
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
        price: 11.5,
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
        price: 9.75,
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
        price: 12.5,
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
        price: 14.0,
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
        price: 12.5,
        farm: "Sunny Farm",
        location: "Iowa, USA",
        rating: 4.5,
        verified: true,
        imageUrl: corn,
        badges: ["Organic", "Non‑GMO"],
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
    const crop = useLoaderData();

    const { items: savedItems, addItem, removeItem } = useSavesContext();

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <nav className="text-gray-500 text-sm flex justify-between">
                <ul className="flex space-x-2">
                    <li><Link to="/buyer/crops" className="hover:underline">crops</Link> /</li>
                    <li><span>{crop.id}</span></li>
                </ul>
            </nav>

            {/* Image & Info */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="relative rounded-lg overflow-hidden shadow">
                    <img src={crop.imageUrl} alt={crop.type} className="w-full h-96 object-cover" />
                    {crop.verified && (
                        <div className="absolute top-4 right-4 bg-white p-1 rounded-full">
                            <CheckBadgeIcon className="h-6 w-6 text-green-500" />
                        </div>
                    )}
                </div>
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold dark:text-gray-100">{crop.type}</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-2xl font-semibold dark:text-gray-200">${crop.price.toFixed(2)}/kg</span>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 rounded text-xs">
                            In stock: {crop.stock} kg
                        </span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                        <p><span className="font-medium dark:text-gray-200">{crop.farm}</span> • {crop.location}</p>
                        <div className="flex items-center">
                            <StarIcon className="h-5 w-5 text-yellow-500" />
                            <span className="ml-1 dark:text-gray-200">{crop.rating.toFixed(1)}</span>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        {savedItems?.find(v => crop.id == v.id) ?
                            <button className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700" onClick={() => removeItem(crop.id)}>Remove from Saves</button>
                            :
                            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" onClick={() => addItem(crop, 0)}>Add to Saves</button>
                        }
                        <button className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Contact Farmer</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {crop.badges.map(b => (
                            <span key={b} className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 text-xs font-medium px-2 py-1 rounded">{b}</span>
                        ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{crop.description}</p>
                </div>
            </div>

            {/* Specifications & Q&A */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold dark:text-gray-100">Details</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
                    {Object.entries(crop.specifications).map(([key, val]) => (
                        <li key={key}><span className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}:</span> {val}</li>
                    ))}
                </ul>
            </div>

            {/* Reviews Section */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold dark:text-gray-100">Customer Reviews ({reviews.length})</h2>
                <ul className="space-y-4">
                    {reviews.map(r => (
                        <li key={r.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <img src={r.avatar} alt={r.user} className="h-10 w-10 rounded-full" />
                                    <div>
                                        <p className="font-medium dark:text-gray-100">{r.user}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{r.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon key={i} className={`h-5 w-5 ${i < r.rating ? 'text-yellow-500' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                            </div>
                            <p className="mt-2 text-gray-700 dark:text-gray-300">{r.comment}</p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Related Products Placeholder */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold dark:text-gray-100">You May Also Like</h2>
                <div className="flex space-x-4 overflow-x-auto pb-2">
                    {relatedCrops.map(crop => (
                        <RelatedCropCard key={crop.id} crop={crop} />
                    ))}
                </div>
            </div>

        </div>
    );
}

function RelatedCropCard({ crop }) {
    return (
        <div className="w-60 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48 bg-gray-200">
                <img
                    src={crop.imageUrl}
                    alt={crop.type}
                    className="object-cover w-full h-full"
                />
                {crop.verified && (
                    <div className="absolute top-2 right-2 bg-white p-1 rounded-full">
                        <CheckBadgeIcon className="h-6 w-6 text-green-500" />
                    </div>
                )}
            </div>

            <div className="p-4 space-y-2">
                <Link to={`./${crop.id}`}>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:underline">
                        {crop.type}
                    </h2>
                </Link>
                <p className="text-lg font-semibold dark:text-gray-200">
                    Rs {crop.price.toFixed(2)}
                </p>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium dark:text-gray-300">{crop.farm}</span> • {crop.location}
                </div>

                <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <StarIcon className="h-5 w-5 text-yellow-500" />
                    <span className="ml-1">{crop.rating.toFixed(1)}</span>
                </div>

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
    );
}