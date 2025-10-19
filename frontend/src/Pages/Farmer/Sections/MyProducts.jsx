import React, { useState } from 'react';
import './MyProducts.css'
import { StarIcon, CheckBadgeIcon, PlusIcon , TrashIcon} from '@heroicons/react/24/solid';
import wheat from "../../../Assets/Farmer/Crops/wheat.webp";
import corn from "../../../Assets/Farmer/Crops/corn.jpeg";
import { Link } from 'react-router-dom';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import api from '../../../API/client';
import { useEffect } from 'react';

function getCurrentUserId() {
    const userId = localStorage.getItem('userId');
    return userId;
}

export async function MyProductsLoader() {
    try {
        // Get the current user's ID from our system function.
        const userId = getCurrentUserId();

           const response = await api.get(`/api/products/my-products`, {
            headers: {
                'X-User-Id': String(userId),
            },
        });

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
            rating: product.averageRating, // Placeholder rating
            verified: true, // Placeholder verification
        }));
    } catch (err) {
        console.error("Failed to fetch products:", err);
        return []; 
    }
//    return [
//         {
//                    id: 1,
//                    type: 'Corn',
//                    pricePerUnit: 120,
//                    farm: 'Sunny Farm',
//                    location: 'Iowa, USA',
//                    rating: 4.5,
//                    verified: true,
//                    imageUrls: [corn],
//                    badges: ['Organic', 'On Sale'],
//                    measurement: 'kg',
//                    stock: 100,
//                    transport: 'Yes',
//                    return:'No',
//                },
//                {
//                    id: 2,
//                    type: 'Wheat',
//                    pricePerUnit: 175,
//                    farm: 'Golden Fields',
//                    location: 'Kansas, USA',
//                    rating: 4.2,
//                    verified: false,
//                    imageUrls: [wheat],
//                    badges: [],
//                    measurement: 'kg',
//                    stock: 50,
//                    transport: 'No',
//                    return:'Yes',
//                },
//                {
//                    id: 3,
//                    type: 'Rice',
//                    pricePerUnit: 110,
//                    farm: 'Green Valley',
//                    location: 'Kandy, Sri Lanka',
//                    rating: 4.7,
//                    verified: true,
//                    imageUrls: [wheat],
//                    badges: ['Organic'],
//                    measurement: 'kg',
//                    stock: 200,
//                    transport: 'Yes',
//                    return:'Yes',
//                },
//                {
//                    id: 4,
//                    type: 'Tomato',
//                    pricePerUnit: 95,
//                    farm: 'Highland Farms',
//                    location: 'Nuwara Eliya, Sri Lanka',
//                    rating: 4.0,
//                    verified: false,
//                    imageUrls: [wheat],
//                    badges: ['On Sale'],
//                    measurement: 'unit',
//                    stock: 150,
//                    transport: 'No',
//                    return:'Yes',
//                },
//                {
//                    id: 5,
//                    type: 'Potato',
//                    pricePerUnit: 80,
//                    farm: 'Riverbend Farm',
//                    location: 'Badulla, Sri Lanka',
//                    rating: 4.3,
//                    verified: true,
//                    imageUrls: [wheat],
//                    badges: [],
//                    measurement: 'kg',
//                    stock: 80,
//                    transport: 'Yes',
//                    return:'No',
//                },
//                {
//                    id: 6,
//                    type: 'Green Gram',
//                    pricePerUnit: 210,
//                    farm: 'AgroCare Co-op',
//                    location: 'Kurunegala, Sri Lanka',
//                    rating: 4.8,
//                    verified: true,
//                    imageUrls: [wheat],
//                    badges: ['Organic', 'Certified'],
//                    measurement: 'g',
//                    stock: 300,
//                    transport: 'Yes',
//                    return:'Yes',
//                },
//     ];
}

export default function MyProducts() {
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

     useEffect(() => {
        MyProductsLoader().then((data) => {
        setCrops(data);
        setLoading(false);
        });
     }, []);

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setIsEditPopupOpen(true);
    };

     
    if (loading) return <p className="p-6 text-gray-500">Loading products...</p>;
    if (!loading ) {
    return (
        <section className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold dark:text-gray-100">My Products</h1>
                <button
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
                    onClick={() => setIsAddPopupOpen(true)}
                >
                    <PlusIcon className="h-5 w-5" />
                    <span>Add New Product</span>
                </button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {crops.map((crop) => (
                    <div
                        key={crop.id}
                        className="flex flex-col justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-lg overflow-hidden transition"
                    >
                        <div>
                            <div className="relative h-48 bg-gray-200">
                            
                                <img
                                    src={crop.imageUrls?.[0] || wheat} // Use first image from array
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
                                <Link to={`./${crop.id}`}>
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
                                    <span className="font-medium dark:text-gray-300">{crop.farm}</span>{' '}
                                    • {crop.imageUrls}
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
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {crop.badges.map((badge) => (
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
                            <button
                                className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                onClick={() => handleEditProduct(crop)}
                            >
                                Edit Product
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {isAddPopupOpen && <AddProductPopup onClose={() => setIsAddPopupOpen(false)} />}
            {isEditPopupOpen && (
                <EditProductPopup
                    onClose={() => setIsEditPopupOpen(false)}
                    product={selectedProduct}
                />
            )}
        </section>
    ); }
}

function AddProductPopup({ onClose }) {
    const [productName, setProductName] = useState('');
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [measurement, setMeasurement] = useState('');
    const [pricePerUnit, setPricePerUnit] = useState('');
    const [availableStock, setAvailableStock] = useState('');
    const [location, setLocation] = useState('');
    const [transportAvailability, setTransportAvailability] = useState('No');
    const [returnAccepted, setReturnAccepted] = useState('No');
    const [badges, setBadges] = useState([]);
    const [newBadge, setNewBadge] = useState('');

    const handleAddBadge = () => {
        if (newBadge.trim() && !badges.includes(newBadge.trim())) {
            setBadges((prev) => [...prev, newBadge.trim()]);
            setNewBadge('');
        }
    };

    const handleDeleteBadge = (badgeToRemove) => {
        setBadges((prev) => prev.filter((badge) => badge !== badgeToRemove));
    };

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        const previews = [];

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                previews.push(reader.result);
                if (previews.length === files.length) {
                    setImagePreviews((prev) => [...prev, ...previews]);
                    setImages((prev) => [...prev, ...files]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleDeleteImage = (indexToRemove) => {
        setImagePreviews((prev) => prev.filter((_, index) => index !== indexToRemove));
        setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('measurement', measurement);
        formData.append('pricePerUnit', pricePerUnit);
        formData.append('availableStock', availableStock);
        formData.append('location', location);
        formData.append('transportAvailability', transportAvailability);
        formData.append('returnAccepted', returnAccepted);
        badges.forEach((badge, index) => {
            formData.append(`badges[${index}]`, badge);
        });
        images.forEach((image) => {
            formData.append('images', image); // API should accept multiple files under 'images'
        });
         console.log("form data : ", formData);
         console.log("process.env.VITE_API_GATEWAY_URL: ", import.meta.env.VITE_API_GATEWAY_URL)

        try {
            await api.post('/api/products/createproduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onClose(); // Close popup on success
        } catch (error) {
            console.error('Error adding product:', error);
            // Optionally, add error handling UI here
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 z-10 w-full max-w-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold dark:text-gray-100">Add Product</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                    <div className="upload-container">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            id="fileInput"
                            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 hidden"
                            onChange={handleImageChange}
                        />
                        <label htmlFor="fileInput" className="upload-box">
                            <div className="plus-mark"></div>
                        </label>
                        <div className="image-previews mt-2 flex flex-wrap gap-2">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-20 h-9.5 object-cover rounded border"
                                    />
                                    <button
                                        onClick={() => handleDeleteImage(index)}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition"
                                        aria-label="Delete image"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <select
                        value={measurement}
                        onChange={(e) => setMeasurement(e.target.value)}
                        className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    >
                        <option value="">Select Measurement</option>
                        <option value="unit">Unit</option>
                        <option value="kg">Kilogram</option>
                        <option value="g">Gram</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Price per Unit"
                        value={pricePerUnit}
                        onChange={(e) => setPricePerUnit(e.target.value)}
                        className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                    <input
                        type="number"
                        placeholder="Available Stock"
                        value={availableStock}
                        onChange={(e) => setAvailableStock(e.target.value)}
                        className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300">Transport Availability:</label>
                        <select
                            value={transportAvailability}
                            onChange={(e) => setTransportAvailability(e.target.value)}
                            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300">Return Accepted:</label>
                        <select
                            value={returnAccepted}
                            onChange={(e) => setReturnAccepted(e.target.value)}
                            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300">Badges:</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {badges.map((badge, index) => (
                                <div key={index} className="flex items-center bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-green-800 dark:text-green-100">
                                    {badge}
                                    <button
                                        onClick={() => handleDeleteBadge(badge)}
                                        className="ml-1 text-black hover:text-gray-700"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={newBadge}
                                onChange={(e) => setNewBadge(e.target.value)}
                                placeholder="Enter new badge"
                                className="flex-1 px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            />
                            <button
                                onClick={handleAddBadge}
                                className="flex items-center justify-center px-3 py-2 text-3xl text-black hover:text-gray-400 focus:outline-none h-[2.5rem]"
                                aria-label="Add badge"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}


function EditProductPopup({ onClose, product }) {
    const [id] = useState(product?.id || '');
    const [productName, setProductName] = useState(product?.type || '');
    const [price, setPrice] = useState(product?.pricePerUnit || '');
    const [measurement, setMeasurement] = useState(product?.measurement || '');
    const [stock, setStock] = useState(product?.stock || '');
    const [transport, setTransport] = useState(product?.transport || 'No');
    const [returnAccepted, setReturnAccepted] = useState(product?.return || 'No');
    const [address, setAddress] = useState(product?.location || '');
    const [images, setImages] = useState(product?.imageUrls.map(url => ({ type: 'existing', url })) || []);
    const [badges, setBadges] = useState(product?.badges || []);
    const [newBadge, setNewBadge] = useState('');

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map(file => ({
            type: 'new',
            url: URL.createObjectURL(file),
            file
        }));
        setImages(prev => [...prev, ...newImages]);
    };

    const handleDeleteImage = (indexToRemove) => {
        setImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleAddBadge = () => {
        if (newBadge.trim() && !badges.includes(newBadge.trim())) {
            setBadges(prev => [...prev, newBadge.trim()]);
            setNewBadge('');
        }
    };

    const handleDeleteBadge = (badgeToRemove) => {
        setBadges(prev => prev.filter(badge => badge !== badgeToRemove));
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('price', price);
        formData.append('measurement', measurement);
        formData.append('stock', stock);
        formData.append('transport', transport);
        formData.append('returnAccepted', returnAccepted);
        formData.append('address', address);
        badges.forEach(badge => formData.append('badges', badge));
        const existingImages = images.filter(img => img.type === 'existing').map(img => img.url);
        existingImages.forEach(url => formData.append('existingImages', url));
        const newImageFiles = images.filter(img => img.type === 'new').map(img => img.file);
        newImageFiles.forEach(file => formData.append('newImages', file));

        try {
            await api.put(`api/products/editproduct/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onClose();
        } catch (error) {
            console.error('Error updating product:', error);
            // Add error handling UI if needed
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 z-10 w-full max-w-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold dark:text-gray-100">Edit Product</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                    <div className="upload-container">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            id="fileInput"
                            className="w-full px-3 py-0.5 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 hidden"
                            onChange={handleImageChange}
                        />
                        <label htmlFor="fileInput" className="upload-box">
                            <div className="plus-mark"></div>
                        </label>
                        <div className="image-previews mt-2 flex flex-wrap gap-2">
                            {images.map((img, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={img.url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-20 h-9.5 object-cover rounded border"
                                    />
                                    <button
                                        onClick={() => handleDeleteImage(index)}
                                        className="absolute top-0 right-0 bg-white-100 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition"
                                        aria-label="Delete image"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <select
                        value={measurement}
                        onChange={(e) => setMeasurement(e.target.value)}
                        className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    >
                        <option value="">Select Measurement</option>
                        <option value="unit">Unit</option>
                        <option value="kg">Kilogram</option>
                        <option value="g">Gram</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Price per Unit"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                    <input
                        type="number"
                        placeholder="Available Stock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                    <input
                        type="text"
                        placeholder="Location"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300">Transport Availability:</label>
                        <select
                            value={transport}
                            onChange={(e) => setTransport(e.target.value)}
                            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300">Return Accepted:</label>
                        <select
                            value={returnAccepted}
                            onChange={(e) => setReturnAccepted(e.target.value)}
                            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300">Badges:</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {badges.map((badge, index) => (
                                <div key={index} className="flex items-center bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-green-800 dark:text-green-100">
                                    {badge}
                                   <button
                                        onClick={() => handleDeleteBadge(badge)}
                                        className="ml-1 text-black hover:text-gray-700"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={newBadge}
                                onChange={(e) => setNewBadge(e.target.value)}
                                placeholder="Enter new badge"
                                className="flex-1 px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            />
                            <button
                                onClick={handleAddBadge}
                                className="flex items-center justify-center px-3 py-2 text-3xl text-black hover:text-gray-400 focus:outline-none h-[2.5rem]"
                                aria-label="Add badge"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
