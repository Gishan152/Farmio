import React, { useState, useEffect } from 'react';
import {
    MagnifyingGlassIcon,
    InboxIcon,
    MapPinIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    UserGroupIcon,
    PhoneIcon,
    StarIcon
} from '@heroicons/react/24/outline';
import { useWasteAgent } from '../../../Contexts/Warehouse/WasteAgentContext';
import WasteAgentCard from '../../../Components/Warehouse/WasteAgentCard';
import HireRequestForm from '../../../Components/Warehouse/HireRequestForm';

export default function WasteAgent() {
    const { agents, hireRequests, loading, getNearbyAgents, sendHireRequest, getHireRequests } = useWasteAgent();
    
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [showHireForm, setShowHireForm] = useState(false);
    const [showRequests, setShowRequests] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [availabilityFilter, setAvailabilityFilter] = useState('all');

    // Mock warehouse GPS coordinates (Colombo)
    const warehouseLocation = { lat: 6.9271, lon: 79.8612 };

    useEffect(() => {
        // Load nearby agents on component mount
        getNearbyAgents(warehouseLocation.lat, warehouseLocation.lon, 50, searchTerm);
        getHireRequests();
    }, [getNearbyAgents, getHireRequests, searchTerm, warehouseLocation.lat, warehouseLocation.lon]);

    const handleHireRequest = (agent) => {
        setSelectedAgent(agent);
        setShowHireForm(true);
    };

    const handleSubmitHireRequest = async (requestData) => {
        try {
            await sendHireRequest(requestData);
            setShowHireForm(false);
            setSelectedAgent(null);
            // Show success message or toast
        } catch (error) {
            console.error('Error sending hire request:', error);
            // Show error message
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredAgents = agents.filter(agent => {
        if (typeFilter !== 'all' && agent.type !== typeFilter) return false;
        if (availabilityFilter !== 'all' && agent.availability !== availabilityFilter) return false;
        return true;
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <ClockIcon className="h-4 w-4 text-yellow-500" />;
            case 'accepted':
                return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
            case 'rejected':
                return <XCircleIcon className="h-4 w-4 text-red-500" />;
            default:
                return <ExclamationTriangleIcon className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getAvailabilityColor = (availability) => {
        switch (availability) {
            case 'available': return 'bg-green-400 text-green-900';
            case 'busy': return 'bg-yellow-400 text-yellow-900';
            case 'unavailable': return 'bg-red-400 text-red-900';
            default: return 'bg-gray-400 text-gray-900';
        }
    };

    const getTypeEmoji = (type) => {
        switch (type) {
            case 'compost': return '🌱';
            case 'recycler': return '♻️';
            case 'animal feed': return '🐄';
            default: return '🗂️';
        }
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-4">
                {/* Compact Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Waste Agent Management</h1>
                            <p className="text-gray-500 text-sm mt-1">Find and hire nearby waste management agents</p>
                        </div>
                        <button
                            onClick={() => setShowRequests(!showRequests)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200 text-sm"
                        >
                            <InboxIcon className="h-4 w-4" />
                            Requests ({hireRequests.length})
                        </button>
                    </div>

                    {/* Compact Search and Filters */}
                    <div className="grid grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="col-span-2 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search agents..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200 text-sm"
                            />
                        </div>

                        {/* Type Filter */}
                        <div>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200 text-sm"
                            >
                                <option value="all">All Types</option>
                                <option value="compost">Compost</option>
                                <option value="recycler">Recycler</option>
                                <option value="animal feed">Animal Feed</option>
                            </select>
                        </div>

                        {/* Availability Filter */}
                        <div>
                            <select
                                value={availabilityFilter}
                                onChange={(e) => setAvailabilityFilter(e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200 text-sm"
                            >
                                <option value="all">All Availability</option>
                                <option value="available">Available</option>
                                <option value="busy">Busy</option>
                                <option value="unavailable">Unavailable</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Compact Request Status Panel */}
                {showRequests && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">Hire Request Status</h2>
                        {hireRequests.length === 0 ? (
                            <div className="text-center py-6">
                                <div className="text-4xl mb-3">📋</div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Requests</h3>
                                <p className="text-gray-500 text-sm">No hire requests sent yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {hireRequests.map(request => (
                                    <div key={request.id} className="bg-gray-50 rounded-lg border border-gray-100 p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-sm">{request.agentName}</h3>
                                                <p className="text-xs text-gray-500">Request ID: {request.id}</p>
                                            </div>
                                            <div className="flex items-center">
                                                {getStatusIcon(request.status)}
                                                <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-2">
                                            <div className="bg-white rounded p-2 border border-gray-100">
                                                <span className="font-medium text-gray-600">Waste Type:</span>
                                                <p className="text-gray-900">{request.wasteType}</p>
                                            </div>
                                            <div className="bg-white rounded p-2 border border-gray-100">
                                                <span className="font-medium text-gray-600">Quantity:</span>
                                                <p className="text-gray-900">{request.quantity} kg</p>
                                            </div>
                                            <div className="bg-white rounded p-2 border border-gray-100">
                                                <span className="font-medium text-gray-600">Pickup Date:</span>
                                                <p className="text-gray-900">{request.pickupDate}</p>
                                            </div>
                                            <div className="bg-white rounded p-2 border border-gray-100">
                                                <span className="font-medium text-gray-600">Sent:</span>
                                                <p className="text-gray-900">{request.createdAt}</p>
                                            </div>
                                        </div>

                                        {request.message && (
                                            <div className="mb-2 bg-white rounded p-2 border border-gray-100">
                                                <span className="font-medium text-gray-600 text-xs">Message:</span>
                                                <p className="text-gray-900 text-xs">{request.message}</p>
                                            </div>
                                        )}

                                        {request.response && (
                                            <div className="bg-green-50 border border-green-100 rounded p-2">
                                                <span className="font-medium text-green-700 text-xs">Agent Response:</span>
                                                <p className="text-green-900 text-xs">{request.response}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Wide Agent Cards */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                            <p className="mt-2 text-gray-500 text-sm">Loading waste agents...</p>
                        </div>
                    ) : filteredAgents.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                                <div className="text-4xl mb-3">🗂️</div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Waste Agents Found</h3>
                                <p className="text-gray-500 text-sm mb-4">
                                    {searchTerm 
                                        ? 'Try adjusting your search criteria or filters'
                                        : 'No waste agents available in your area'
                                    }
                                </p>
                            </div>
                        </div>
                    ) : (
                        filteredAgents.map((agent) => (
                            <div key={agent.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                                <div className="flex">
                                    {/* Left Header Section */}
                                    <div className="bg-gradient-to-br from-green-50 to-green text-green-700 p-4 flex-shrink-0 w-64">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                                    <span className="text-lg">{getTypeEmoji(agent.type)}</span>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${getAvailabilityColor(agent.availability)}`}>
                                                {agent.availability?.toUpperCase() || 'UNKNOWN'}
                                            </span>
                                        </div>
                                        
                                        <h3 className="font-bold text-lg mb-2 truncate">
                                            {agent.name}
                                        </h3>
                                        {/* <p className="text-green-700 text-sm flex items-center mb-2">
                                            <MapPinIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                            <span className="truncate">{agent.location}</span>
                                        </p> */}
                                        <div className="flex items-center text-green-700 text-xs">
                                            <StarIcon className="w-3 h-3 mr-1" />
                                            <span>{agent.rating || '4.5'}</span>
                                            <span className="ml-1">({agent.reviews || '12'} reviews)</span>
                                        </div>
                                    </div>

                                    {/* Main Content Area */}
                                    <div className="flex-1 p-4 flex items-center">
                                        <div className="grid grid-cols-5 gap-4 w-full items-center">
                                            {/* Agent Type */}
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-semibold bg-green-50 text-green-700 border border-green-200">
                                                    <span className="text-base">{getTypeEmoji(agent.type)}</span>
                                                    <span className="capitalize">{agent.type}</span>
                                                </div>
                                                <span className="text-xs text-gray-500 mt-1 font-medium">
                                                    {agent.distance || '5.2'} km away
                                                </span>
                                            </div>

                                            {/* Experience */}
                                            <div className="text-center">
                                                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                                                    <div className="text-2xl font-bold text-green-700">{agent.experience || '3'}</div>
                                                    <div className="text-xs text-green-600 font-medium">Years Exp</div>
                                                </div>
                                            </div>

                                            {/* Capacity */}
                                            <div className="text-center">
                                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                                    <div className="text-l font-bold text-gray-700">{agent.capacity || '500'}</div>
                                                    <div className="text-xs text-gray-600 font-medium">kg/day</div>
                                                </div>
                                            </div>

                                            {/* Rate */}
                                            <div className="text-center">
                                                <div className="bg-green-100 rounded-lg p-3 border border-green-200">
                                                    <div className="text-xl font-bold text-green-800">Rs{agent.rate || '30'}</div>
                                                    <div className="text-xs text-green-700 font-medium">per kg</div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    onClick={() => handleHireRequest(agent)}
                                                    className="bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 text-sm font-medium flex items-center space-x-1"
                                                    title="Hire Agent"
                                                >
                                                    <UserGroupIcon className="h-4 w-4" />
                                                    <span className="hidden sm:inline">Hire</span>
                                                </button>
                                                {/* <button
                                                    className="bg-green-400 text-white py-2 px-3 rounded-lg hover:bg-green-500 transition-all duration-200 transform hover:scale-105 text-sm font-medium flex items-center space-x-1"
                                                    title="Contact"
                                                >
                                                    <PhoneIcon className="h-4 w-4" />
                                                    <span className="hidden sm:inline">Call</span>
                                                </button> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Hire Request Form Modal */}
                {showHireForm && selectedAgent && (
                    <HireRequestForm
                        agent={selectedAgent}
                        onSubmit={handleSubmitHireRequest}
                        onCancel={() => {
                            setShowHireForm(false);
                            setSelectedAgent(null);
                        }}
                    />
                )}
            </div>

            {/* CSS animations matching other components */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes scaleIn {
                    from { 
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to { 
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out;
                }
                
                .animate-scaleIn {
                    animation: scaleIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                }
            `}</style>
        </div>
    );
}