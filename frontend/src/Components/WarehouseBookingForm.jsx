import React, { useState } from 'react';
import { XMarkIcon, CalendarIcon, CurrencyDollarIcon, ScaleIcon } from '@heroicons/react/24/outline';
import { BuildingStorefrontIcon, CheckIcon } from '@heroicons/react/24/solid';

const WarehouseBookingForm = ({ warehouse, isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        // Product Details
        productType: '',
        productName: '',
        productCategory: '',
        quantity: '',
        quantityUnit: 'kg',
        
        // Storage Requirements
        storageDuration: '',
        storageUnit: 'months',
        startDate: '',
        endDate: '',
        temperatureRequirement: '',
        humidityRequirement: '',
        specialRequirements: '',
        
        // Quality & Safety
        organicCertified: false,
        pesticidesUsed: false,
        fumigationRequired: false,
        
        // Contact & Delivery
        farmerName: '',
        farmerPhone: '',
        farmerEmail: '',
        farmLocation: '',
        deliveryDate: '',
        pickupArrangement: 'farmer_delivery',
        
        // Additional Information
        packaging: '',
        insuranceRequired: false,
        estimatedValue: '',
        additionalNotes: ''
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState({});

    const steps = [
        { id: 1, title: 'Product Details', description: 'Tell us about your product' },
        { id: 2, title: 'Storage Requirements', description: 'Specify storage needs' },
        { id: 3, title: 'Contact & Delivery', description: 'Your contact information' },
        { id: 4, title: 'Review & Submit', description: 'Confirm your booking request' }
    ];

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};
        
        switch (step) {
            case 1:
                if (!formData.productType) newErrors.productType = 'Product type is required';
                if (!formData.productName) newErrors.productName = 'Product name is required';
                if (!formData.quantity) newErrors.quantity = 'Quantity is required';
                if (formData.quantity && formData.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0';
                break;
            case 2:
                if (!formData.storageDuration) newErrors.storageDuration = 'Storage duration is required';
                if (!formData.startDate) newErrors.startDate = 'Start date is required';
                break;
            case 3:
                if (!formData.farmerName) newErrors.farmerName = 'Name is required';
                if (!formData.farmerPhone) newErrors.farmerPhone = 'Phone number is required';
                if (!formData.farmerEmail) newErrors.farmerEmail = 'Email is required';
                if (!formData.farmLocation) newErrors.farmLocation = 'Farm location is required';
                break;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateStep(3)) {
            const bookingRequest = {
                warehouseId: warehouse.id,
                ...formData,
                requestDate: new Date().toISOString(),
                status: 'pending'
            };
            onSubmit(bookingRequest);
        }
    };

    const calculateEstimatedCost = () => {
        const quantity = parseFloat(formData.quantity) || 0;
        const duration = parseFloat(formData.storageDuration) || 0;
        const pricePerKgPerMonth = 2; // Example pricing
        return (quantity * duration * pricePerKgPerMonth).toFixed(2);
    };

    const renderStep1 = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Product Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Product Type *
                    </label>
                    <select
                        name="productType"
                        value={formData.productType}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white ${errors.productType ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    >
                        <option value="">Select product type</option>
                        <option value="grains">Grains</option>
                        <option value="fruits">Fruits</option>
                        <option value="vegetables">Vegetables</option>
                        <option value="dairy">Dairy Products</option>
                        <option value="meat">Meat Products</option>
                        <option value="processed">Processed Food</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.productType && <p className="text-red-500 text-xs mt-1">{errors.productType}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Product Name *
                    </label>
                    <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleInputChange}
                        placeholder="e.g., Organic Wheat, Fresh Apples"
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white ${errors.productName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    />
                    {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Quantity *
                    </label>
                    <div className="flex">
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            min="0"
                            step="0.1"
                            className={`flex-1 px-3 py-2 border rounded-l-md focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white ${errors.quantity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                        />
                        <select
                            name="quantityUnit"
                            value={formData.quantityUnit}
                            onChange={handleInputChange}
                            className="px-3 py-2 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md dark:bg-gray-700 dark:text-white"
                        >
                            <option value="kg">Kg</option>
                            <option value="tons">Tons</option>
                            <option value="units">Units</option>
                            <option value="boxes">Boxes</option>
                        </select>
                    </div>
                    {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Product Category
                    </label>
                    <input
                        type="text"
                        name="productCategory"
                        value={formData.productCategory}
                        onChange={handleInputChange}
                        placeholder="e.g., Organic, Premium, Export Quality"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="organicCertified"
                        checked={formData.organicCertified}
                        onChange={handleInputChange}
                        className="rounded text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Organic Certified</span>
                </label>

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="pesticidesUsed"
                        checked={formData.pesticidesUsed}
                        onChange={handleInputChange}
                        className="rounded text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Pesticides Used</span>
                </label>

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="fumigationRequired"
                        checked={formData.fumigationRequired}
                        onChange={handleInputChange}
                        className="rounded text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Fumigation Required</span>
                </label>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Storage Requirements</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Storage Duration *
                    </label>
                    <div className="flex">
                        <input
                            type="number"
                            name="storageDuration"
                            value={formData.storageDuration}
                            onChange={handleInputChange}
                            min="1"
                            className={`flex-1 px-3 py-2 border rounded-l-md focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white ${errors.storageDuration ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                        />
                        <select
                            name="storageUnit"
                            value={formData.storageUnit}
                            onChange={handleInputChange}
                            className="px-3 py-2 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md dark:bg-gray-700 dark:text-white"
                        >
                            <option value="days">Days</option>
                            <option value="weeks">Weeks</option>
                            <option value="months">Months</option>
                            <option value="years">Years</option>
                        </select>
                    </div>
                    {errors.storageDuration && <p className="text-red-500 text-xs mt-1">{errors.storageDuration}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Date *
                    </label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white ${errors.startDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    />
                    {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Temperature Requirement
                    </label>
                    <input
                        type="text"
                        name="temperatureRequirement"
                        value={formData.temperatureRequirement}
                        onChange={handleInputChange}
                        placeholder="e.g., 2-8°C, Room temperature"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Humidity Requirement
                    </label>
                    <input
                        type="text"
                        name="humidityRequirement"
                        value={formData.humidityRequirement}
                        onChange={handleInputChange}
                        placeholder="e.g., 60-70%, Low humidity"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Special Requirements
                </label>
                <textarea
                    name="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Any special handling, storage conditions, or requirements..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Packaging Details
                </label>
                <input
                    type="text"
                    name="packaging"
                    value={formData.packaging}
                    onChange={handleInputChange}
                    placeholder="e.g., Jute bags, Plastic crates, Cardboard boxes"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                />
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Contact & Delivery Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Your Name *
                    </label>
                    <input
                        type="text"
                        name="farmerName"
                        value={formData.farmerName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white ${errors.farmerName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    />
                    {errors.farmerName && <p className="text-red-500 text-xs mt-1">{errors.farmerName}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number *
                    </label>
                    <input
                        type="tel"
                        name="farmerPhone"
                        value={formData.farmerPhone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white ${errors.farmerPhone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    />
                    {errors.farmerPhone && <p className="text-red-500 text-xs mt-1">{errors.farmerPhone}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address *
                    </label>
                    <input
                        type="email"
                        name="farmerEmail"
                        value={formData.farmerEmail}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white ${errors.farmerEmail ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    />
                    {errors.farmerEmail && <p className="text-red-500 text-xs mt-1">{errors.farmerEmail}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Farm Location *
                    </label>
                    <input
                        type="text"
                        name="farmLocation"
                        value={formData.farmLocation}
                        onChange={handleInputChange}
                        placeholder="City, State/District"
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white ${errors.farmLocation ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    />
                    {errors.farmLocation && <p className="text-red-500 text-xs mt-1">{errors.farmLocation}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Preferred Delivery Date
                    </label>
                    <input
                        type="date"
                        name="deliveryDate"
                        value={formData.deliveryDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Delivery Arrangement
                    </label>
                    <select
                        name="pickupArrangement"
                        value={formData.pickupArrangement}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="farmer_delivery">I will deliver to warehouse</option>
                        <option value="warehouse_pickup">Warehouse pickup service</option>
                        <option value="third_party">Third-party logistics</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Estimated Product Value
                    </label>
                    <input
                        type="number"
                        name="estimatedValue"
                        value={formData.estimatedValue}
                        onChange={handleInputChange}
                        placeholder="For insurance purposes"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div className="flex items-center">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="insuranceRequired"
                            checked={formData.insuranceRequired}
                            onChange={handleInputChange}
                            className="rounded text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Insurance Coverage Required</span>
                    </label>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Additional Notes
                </label>
                <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Any additional information or special requests..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                />
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Review Your Booking Request</h3>
            
            {/* Warehouse Info */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                    <BuildingStorefrontIcon className="h-5 w-5 mr-2 text-green-600" />
                    Warehouse Details
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {warehouse.name} - {warehouse.city}, {warehouse.address}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Storage Type: {warehouse.storageType}
                </p>
            </div>

            {/* Product Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                    <ScaleIcon className="h-5 w-5 mr-2 text-green-600" />
                    Product Summary
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="font-medium">Product:</span> {formData.productName}</div>
                    <div><span className="font-medium">Type:</span> {formData.productType}</div>
                    <div><span className="font-medium">Quantity:</span> {formData.quantity} {formData.quantityUnit}</div>
                    <div><span className="font-medium">Duration:</span> {formData.storageDuration} {formData.storageUnit}</div>
                </div>
            </div>

            {/* Cost Estimate */}
            <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                    <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-600" />
                    Estimated Cost
                </h4>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${calculateEstimatedCost()}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    *Final cost will be confirmed by warehouse owner
                </p>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Contact Information</h4>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>{formData.farmerName}</p>
                    <p>{formData.farmerPhone} | {formData.farmerEmail}</p>
                    <p>{formData.farmLocation}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Warehouse Booking Request
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                                    currentStep >= step.id 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                }`}>
                                    {currentStep > step.id ? <CheckIcon className="h-5 w-5" /> : step.id}
                                </div>
                                <div className="ml-2 hidden sm:block">
                                    <p className={`text-sm font-medium ${
                                        currentStep >= step.id 
                                            ? 'text-green-600 dark:text-green-400' 
                                            : 'text-gray-500 dark:text-gray-400'
                                    }`}>
                                        {step.title}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-4 ${
                                        currentStep > step.id 
                                            ? 'bg-green-600' 
                                            : 'bg-gray-200 dark:bg-gray-700'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-6">
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                    {currentStep === 4 && renderStep4()}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            Previous
                        </button>

                        {currentStep < 4 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                            >
                                Submit Request
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WarehouseBookingForm;