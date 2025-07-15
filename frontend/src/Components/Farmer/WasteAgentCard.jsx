import React from 'react';
import {
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    StarIcon,
    CheckBadgeIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function WasteAgentCard({ agent, onHireRequest }) {
    const getTypeColor = (type) => {
        switch (type) {
            case 'compost': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
            case 'recycler': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
            case 'animal feed': return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'compost': return '🌱';
            case 'recycler': return '♻️';
            case 'animal feed': return '🐄';
            default: return '🗂️';
        }
    };

    const getAvailabilityColor = (availability) => {
        switch (availability) {
            case 'available': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
            case 'busy': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
            case 'unavailable': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <StarIconSolid key={i} className="h-3 w-3 text-yellow-400" />
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <div key={i} className="relative">
                        <StarIcon className="h-3 w-3 text-gray-300" />
                        <StarIconSolid className="h-3 w-3 text-yellow-400 absolute top-0 left-0" 
                                      style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} />
                    </div>
                );
            } else {
                stars.push(
                    <StarIcon key={i} className="h-3 w-3 text-gray-300" />
                );
            }
        }
        return stars;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200  min-h-64">
            {/* Header */}
            <div className="bg-green-600 text-white p-3 min-h-22">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center mb-1">
                            <h3 className="font-semibold text-sm">{agent.name}</h3>
                            {agent.verified && (
                                <CheckBadgeIcon className="h-4 w-4 ml-2 text-green-200" title="Verified Agent" />
                            )}
                        </div>
                        <div className="flex items-center text-green-100 text-xs">
                            <MapPinIcon className="h-3 w-3 mr-1" />
                            <span>{agent.distance} km away</span>
                        </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAvailabilityColor(agent.availability)}`}>
                        {agent.availability}
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="p-3 space-y-3">
                {/* Type and Rating */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <span className="text-sm mr-2">{getTypeIcon(agent.type)}</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getTypeColor(agent.type)}`}>
                            {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center mr-1">
                            {renderStars(agent.rating)}
                        </div>
                        <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{agent.rating}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({agent.reviewCount})</span>
                    </div>
                </div>

                {/* Specialties */}
                <div>
                    <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Specialties:</h4>
                    <div className="flex flex-wrap gap-1 min-h-11">
                        {agent.specialties.slice(0, 2).map((specialty, index) => (
                            <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                                {specialty}
                            </span>
                        ))}
                        {agent.specialties.length > 2 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">+{agent.specialties.length - 2} more</span>
                        )}
                    </div>
                </div>

                {/* Capacity and Price */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Capacity:</span>
                        <p className="text-gray-900 dark:text-gray-100">{agent.capacity}</p>
                    </div>
                    <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Price:</span>
                        <p className="text-gray-900 dark:text-gray-100">{agent.priceRange}</p>
                    </div>
                </div>

                {/* Contact */}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                    <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <div className="flex items-center">
                            <PhoneIcon className="h-3 w-3 mr-1" />
                            <span>{agent.contact.phone}</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{agent.contact.address}</p>
                </div>

                {/* Action Button */}
                <button
                    onClick={() => onHireRequest(agent)}
                    disabled={agent.availability === 'unavailable'}
                    className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors duration-200 ${
                        agent.availability === 'unavailable'
                            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700'
                    }`}
                >
                    {agent.availability === 'unavailable' ? 'Unavailable' : 'Send Request'}
                </button>
            </div>
        </div>
    );
}