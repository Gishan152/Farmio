import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function HireRequestForm({ agent, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        wasteType: '',
        quantity: '',
        pickupDate: '',
        message: '',
        urgency: 'normal'
    });

    const [errors, setErrors] = useState({});

    const wasteTypes = [
        'Spoiled produce',
        'Vegetable scraps',
        'Fruit waste',
        'Packaging materials',
        'Organic waste',
        'Mixed recyclables',
        'Other'
    ];

    const urgencyLevels = [
        { value: 'low', label: 'Low Priority' },
        { value: 'normal', label: 'Normal' },
        { value: 'high', label: 'High Priority' },
        { value: 'urgent', label: 'Urgent' }
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.wasteType) newErrors.wasteType = 'Waste type is required';
        if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Valid quantity is required';
        if (!formData.pickupDate) newErrors.pickupDate = 'Pickup date is required';
        
        const today = new Date().toISOString().split('T')[0];
        if (formData.pickupDate < today) {
            newErrors.pickupDate = 'Pickup date cannot be in the past';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit({
                agentId: agent.id,
                agentName: agent.name,
                ...formData,
                quantity: parseInt(formData.quantity)
            });
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const minDate = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    const maxDateStr = maxDate.toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">Hire Request</h3>
                            <p className="text-green-100 text-sm">{agent.name}</p>
                        </div>
                        <button
                            onClick={onCancel}
                            className="text-white hover:text-gray-200 p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-all duration-200"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Waste Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Waste Type *
                        </label>
                        <select
                            value={formData.wasteType}
                            onChange={(e) => handleChange('wasteType', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 text-sm ${
                                errors.wasteType ? 'border-red-300' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Select waste type</option>
                            {wasteTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        {errors.wasteType && (
                            <p className="mt-1 text-sm text-red-600">{errors.wasteType}</p>
                        )}
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Quantity (kg) *
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="10000"
                            value={formData.quantity}
                            onChange={(e) => handleChange('quantity', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 text-sm ${
                                errors.quantity ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Enter quantity in kg"
                        />
                        {errors.quantity && (
                            <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                        )}
                    </div>

                    {/* Pickup Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Preferred Pickup Date *
                        </label>
                        <input
                            type="date"
                            min={minDate}
                            max={maxDateStr}
                            value={formData.pickupDate}
                            onChange={(e) => handleChange('pickupDate', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 text-sm ${
                                errors.pickupDate ? 'border-red-300' : 'border-gray-300'
                            }`}
                        />
                        {errors.pickupDate && (
                            <p className="mt-1 text-sm text-red-600">{errors.pickupDate}</p>
                        )}
                    </div>

                    {/* Urgency */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Urgency Level
                        </label>
                        <select
                            value={formData.urgency}
                            onChange={(e) => handleChange('urgency', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                        >
                            {urgencyLevels.map(level => (
                                <option key={level.value} value={level.value}>{level.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Additional Message
                        </label>
                        <textarea
                            rows="3"
                            value={formData.message}
                            onChange={(e) => handleChange('message', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                            placeholder="Any additional details or special requirements..."
                        />
                    </div>

                    {/* Agent Info */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 text-sm">Agent Details</h4>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <p><span className="font-medium">Type:</span> {agent.type}</p>
                            <p><span className="font-medium">Capacity:</span> {agent.capacity}</p>
                            <p><span className="font-medium">Price Range:</span> {agent.priceRange}</p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-200 text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
                        >
                            Send Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}