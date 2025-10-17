// src/buyer/pages/Crops.jsx
import React, { useState , useEffect} from 'react';
// import { useLoaderData } from 'react-router-dom';
import { StarIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import wheat from "../../../Assets/Farmer/Crops/wheat.webp";
import corn from "../../../Assets/Farmer/Crops/corn.jpeg";
import { Link } from 'react-router-dom';
import { useSavesContext } from '../../../Contexts/Farmer/SavesContext';
import api from '../../../API/client';

export async function FarmercropsLoader() {

       try {
        // Get the current user's ID from our system function.
        const response = await api.get(`/api/products/all`);

        const products = response.data;
        const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL ;
        
        
        // Transform data to match frontend component's expected props
        return products.map(product => ({
            ...product, // includes id, location, badges, createdAt, updatedAt etc.
            id: product.id, 
            type: product.productName,
            stock: product.availableStock,
            pricePerUnit: product.pricePerUnit,
            transport: product.transportAvailability,
            return: product.returnAccepted,
            measurement: product.measurement,
            imageUrls: product.imageUrls.map(url => `${API_BASE_URL}${url}`),
            farm: 'My Farm', 
            location : product.location ,
            badges : product.badges, 
            rating: 4.5, // Placeholder rating
            verified: true, // Placeholder verification
        }));
    } catch (err) {
        console.error("Failed to fetch products:", err);
        return []; 
    }

//     return [
//   {
//             id: 1,
//             type: 'Corn',
//             pricePerUnit: 120,
//             farm: 'Sunny Farm',
//             location: 'Iowa, USA',
//             rating: 4.5,
//             verified: true,
//             imageUrls: [corn],
//             badges: ['Organic', 'On Sale'],
//             measurement: 'kg',
//             stock: 100,
//             transport: 'Yes',
//             return:'No',
//         },
//         {
//             id: 2,
//             type: 'Wheat',
//             pricePerUnit: 175,
//             farm: 'Golden Fields',
//             location: 'Kansas, USA',
//             rating: 4.2,
//             verified: false,
//             imageUrls: [wheat],
//             badges: [],
//             measurement: 'kg',
//             stock: 50,
//             transport: 'No',
//             return:'Yes',
//         },
//         {
//             id: 3,
//             type: 'Rice',
//             pricePerUnit: 110,
//             farm: 'Green Valley',
//             location: 'Kandy, Sri Lanka',
//             rating: 4.7,
//             verified: true,
//             imageUrls: [wheat],
//             badges: ['Organic'],
//             measurement: 'kg',
//             stock: 200,
//             transport: 'Yes',
//             return:'Yes',
//         },
//         {
//             id: 4,
//             type: 'Tomato',
//             pricePerUnit: 95,
//             farm: 'Highland Farms',
//             location: 'Nuwara Eliya, Sri Lanka',
//             rating: 4.0,
//             verified: false,
//             imageUrls: [wheat],
//             badges: ['On Sale'],
//             measurement: 'unit',
//             stock: 150,
//             transport: 'No',
//             return:'Yes',
//         },
//         {
//             id: 5,
//             type: 'Potato',
//             pricePerUnit: 80,
//             farm: 'Riverbend Farm',
//             location: 'Badulla, Sri Lanka',
//             rating: 4.3,
//             verified: true,
//             imageUrls: [wheat],
//             badges: [],
//             measurement: 'kg',
//             stock: 80,
//             transport: 'Yes',
//             return:'No',
//         },
//         {
//             id: 6,
//             type: 'Green Gram',
//             pricePerUnit: 210,
//             farm: 'AgroCare Co-op',
//             location: 'Kurunegala, Sri Lanka',
//             rating: 4.8,
//             verified: true,
//             imageUrls: [wheat],
//             badges: ['Organic', 'Certified'],
//             measurement: 'g',
//             stock: 300,
//             transport: 'Yes',
//             return:'Yes',
//         },
//     ];

}

export default function FarmerCrops() {
    // const crops = useLoaderData();
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);

    const [productNameFilter, setProductNameFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [transportFilter, setTransportFilter] = useState('');
    const [returnFilter, setReturnFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
      useEffect(() => {
            FarmercropsLoader().then((data) => {
            setCrops(data);
            setLoading(false);
            });
         }, []);

    const [open, setOpen] = useState(false);
    const [crop, setCrop] = useState(null);

    if (loading) return <p className="p-6 text-gray-500">Loading products...</p>;
    if (!loading ) {
   
    return (
        <section className="p-6">
            <h1 className="text-2xl font-semibold mb-6 dark:text-gray-100">Market Research</h1>
            <div className="mb-6 flex justify-center">
            <input
                type="text"
                placeholder="        Search by product name, farmer, or location"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                className="w-full sm:w-1/2 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {crops .filter((crop) => {
                        const term = searchTerm.toLowerCase();
                        return (
                        crop.type.toLowerCase().includes(term) ||
                        crop.farm.toLowerCase().includes(term) ||
                        crop.location.toLowerCase().includes(term)
                        );
                    }).map(crop => (
                    <div
                        key={crop.id}
                        className="flex flex-col justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-lg overflow-hidden transition"
                    >
                        <div>
                            <div className="relative h-48 bg-gray-200">
                                <img
                                    src={crop.imageUrls?.[0] || wheat} 
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
                                <p className="text-lg dark:text-gray-200">Rs{crop.pricePerUnit.toFixed(2)} per {crop.measurement}</p>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-medium dark:text-gray-300">{crop.farm}</span>{' '}
                                    • {crop.location}
                                </div>

                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-medium dark:text-gray-300">Transport Availability:</span>{' '}
                                     {crop.transport}
                                </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-medium dark:text-gray-300">Return Accepted:</span>{' '}
                                     {crop.return}
                                </div>
                                
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-medium dark:text-gray-300">Total Stock:</span>{' '}
                                     {crop.stock}
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
               
                     
                    </div>
                ))}
            </div>
        </section>
    ); }
}


