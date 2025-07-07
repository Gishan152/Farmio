import React, { useState, useEffect } from 'react';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    InboxIcon,
    MapPinIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon
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
    }, [getNearbyAgents, getHireRequests, searchTerm]);

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
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
            case 'accepted': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
            case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Waste Agent Management</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">View nearby waste agents and send hire requests</p>
                    </div>
                    <button
                        onClick={() => setShowRequests(!showRequests)}
                        className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                    >
                        <InboxIcon className="h-4 w-4 mr-2" />
                        Requests ({hireRequests.length})
                    </button>
                </div>

                {/* Search and Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search agents by name, type, or specialties..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                                />
                            </div>
                        </div>

                        {/* Type Filter */}
                        <div>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
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
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                            >
                                <option value="all">All Availability</option>
                                <option value="available">Available</option>
                                <option value="busy">Busy</option>
                                <option value="unavailable">Unavailable</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Request Status Panel */}
                {showRequests && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
                        <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">Hire Request Status</h2>
                        {hireRequests.length === 0 ? (
                            <div className="text-center py-6">
                                <InboxIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500 dark:text-gray-400 text-sm">No hire requests sent yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {hireRequests.map(request => (
                                    <div key={request.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{request.agentName}</h3>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Request ID: {request.id}</p>
                                            </div>
                                            <div className="flex items-center">
                                                {getStatusIcon(request.status)}
                                                <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-2">
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Waste Type:</span>
                                                <p className="text-gray-900 dark:text-gray-100">{request.wasteType}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
                                                <p className="text-gray-900 dark:text-gray-100">{request.quantity} kg</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Pickup Date:</span>
                                                <p className="text-gray-900 dark:text-gray-100">{request.pickupDate}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Sent:</span>
                                                <p className="text-gray-900 dark:text-gray-100">{request.createdAt}</p>
                                            </div>
                                        </div>

                                        {request.message && (
                                            <div className="mb-2">
                                                <span className="font-medium text-gray-700 dark:text-gray-300 text-xs">Message:</span>
                                                <p className="text-gray-900 dark:text-gray-100 text-xs">{request.message}</p>
                                            </div>
                                        )}

                                        {request.response && (
                                            <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                                                <span className="font-medium text-gray-700 dark:text-gray-300 text-xs">Agent Response:</span>
                                                <p className="text-gray-900 dark:text-gray-100 text-xs">{request.response}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Agents Grid */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold dark:text-gray-100">
                            Nearby Waste Agents 
                            {searchTerm ? (
                                <span className="text-gray-500 dark:text-gray-400 font-normal text-sm"> - Search Results</span>
                            ) : (
                                <span className="text-gray-500 dark:text-gray-400 font-normal text-sm"> (50km radius)</span>
                            )}
                        </h2>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            {filteredAgents.length} agents found
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-6">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                            <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">Loading waste agents...</p>
                        </div>
                    ) : filteredAgents.length === 0 ? (
                        <div className="text-center py-6">
                            <div className="text-4xl mb-3">🗂️</div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Waste Agents Found</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {searchTerm 
                                    ? 'Try adjusting your search criteria or filters'
                                    : 'No waste agents available in your area'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredAgents.map(agent => (
                                <WasteAgentCard
                                    key={agent.id}
                                    agent={agent}
                                    onHireRequest={handleHireRequest}
                                />
                            ))}
                        </div>
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