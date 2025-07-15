import React from "react";
import { useLoaderData } from "react-router-dom";
import { StarIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";
import corn from "../../../Assets/Farmer/Crops/corn.jpeg";

// Loader function to fetch product data
export async function MyProductDetailsLoader({ params }) {
    const { MyProductId } = params;
    // TODO: Replace with API call: fetch(`/api/crops/${MyProductId}`)
    const data = {
        id: MyProductId,
        type: "Corn",
        price: 12.5,
        farm: "Sunny Farm",
        location: "Iowa, USA",
        rating: 4.5,
        verified: true,
        imageUrl: corn,
        badges: ["Organic", "Non-GMO"],
        description:
            "High-quality, non-GMO corn grown on Sunny Farm. Rich in nutrients and ideal for both cooking and feeding.",
    };
    return data;
}

export default function MyProductDetails() {
    const crop = MyProductDetailsLoader();

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Image + badges */}
            <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img
                    src={crop?.imageUrl}
                    alt={crop?.type}
                    className="w-full h-64 object-cover"
                />
                {crop?.verified && (
                    <div className="absolute top-2 right-2 bg-white p-1 border-none rounded-[50%]">
                        <CheckBadgeIcon className="h-6 w-6 text-green-500" />
                    </div>
                )}
                <div className="absolute bottom-3 left-3 flex space-x-2">
                    {crop?.badges?.map((b) => (
                        <span
                            key={b}
                            className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 text-xs font-medium px-2 py-1 rounded"
                        >
                            {b}
                        </span>
                    ))}
                </div>
            </div>

            {/* Details card */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold dark:text-gray-100">
                        {crop?.type}
                    </h1>
                    <p className="text-2xl font-semibold dark:text-gray-200">
                        ${crop?.price?.toFixed(2)}
                    </p>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <p>
                        <span className="font-medium dark:text-gray-300">{crop?.farm}</span> •{" "}
                        {crop?.location}
                    </p>
                    <div className="flex items-center">
                        <StarIcon className="h-5 w-5 text-yellow-500" />
                        <span className="ml-1 dark:text-gray-300">{crop?.rating}</span>
                    </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300">{crop?.description}</p>

                <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    Contact Farmer
                </button>
            </div>
        </div>
    );
}