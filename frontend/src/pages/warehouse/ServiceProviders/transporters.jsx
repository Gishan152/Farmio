import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../../components/warehouse/Sidebar';

const TransportersPage = () => {
    const [transporters, setTransporters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        location: '',
        rating: ''
    });

    useEffect(() => {
        // Mock transporters data
        const mockTransporters = [
            {
                id: 5,
                name: "Priya Transport",
                email: "priya@priyalogistics.com",
                phone: "071-555-9999",
                company: "Priya Logistics",
                location: "Galle",
                rating: 4.2,
                totalServices: 8,
                activeServices: 0,
                completedServices: 8,
                joinDate: "2024-06-20",
                lastService: "2024-11-30",
                totalEarnings: 35000,
                status: "inactive",
                verificationStatus: "verified",
                notes: "Specialized in refrigerated transport",
                availability: "Available weekdays",
                vehicleTypes: ["Refrigerated Truck", "Dry Van"],
                pricePerKm: 25
            },
            {
                id: 6,
                name: "Lanka Express Cargo",
                email: "operations@lankaexpress.com",
                phone: "077-333-4444",
                company: "Lanka Express Cargo",
                location: "Negombo",
                rating: 4.4,
                totalServices: 15,
                activeServices: 3,
                completedServices: 12,
                joinDate: "2024-02-12",
                lastService: "2024-12-19",
                totalEarnings: 68000,
                status: "active",
                verificationStatus: "verified",
                notes: "Reliable for long-distance transport",
                availability: "24/7 service",
                vehicleTypes: ["Container Truck", "Flatbed"],
                pricePerKm: 30
            }
        ];
        const loadTransporters = async () => {
            try {
                setTransporters(mockTransporters);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching transporters:", error);
                setTransporters(mockTransporters);
                setLoading(false);
            }
        };

        loadTransporters();
    }, []);

    const handleStatusChange = (transporterId, newStatus) => {
        setTransporters(prev => 
            prev.map(t => 
                t.id === transporterId 
                    ? { ...t, status: newStatus }
                    : t
            )
        );
    };

    const filteredTransporters = transporters.filter(transporter => {
        return (
            (!filters.status || transporter.status === filters.status) &&
            (!filters.location || transporter.location.toLowerCase().includes(filters.location.toLowerCase())) &&
            (!filters.rating || transporter.rating >= parseFloat(filters.rating))
        );
    });

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex justify-center items-center flex-1">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading transporters...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            
            <main className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <Link 
                                    to="/warehouse/service-providers"
                                    className="text-yellow-600 hover:text-yellow-800 mb-2 inline-flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back to Service Providers
                                </Link>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                    🚛 Transport Partners
                                </h1>
                                <p className="text-gray-600 mt-1">Manage your logistics and transport service providers</p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                            <h3 className="text-lg font-semibold mb-4">Filter Transporters</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <select
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    value={filters.status}
                                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                                >
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>

                                <input
                                    type="text"
                                    placeholder="Filter by location"
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    value={filters.location}
                                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                                />

                                <select
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    value={filters.rating}
                                    onChange={(e) => setFilters({...filters, rating: e.target.value})}
                                >
                                    <option value="">All Ratings</option>
                                    <option value="4.5">4.5+ Stars</option>
                                    <option value="4.0">4.0+ Stars</option>
                                    <option value="3.5">3.5+ Stars</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Transporters Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredTransporters.map(transporter => (
                            <div key={transporter.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-xl">
                                            🚛
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{transporter.name}</h3>
                                            <p className="text-sm text-gray-600">{transporter.company}</p>
                                            <p className="text-xs text-gray-500">{transporter.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            transporter.status === 'active' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {transporter.status}
                                        </span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            transporter.verificationStatus === 'verified'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {transporter.verificationStatus}
                                        </span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Rating</span>
                                        <p className="font-semibold">{transporter.rating} ⭐</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Total Jobs</span>
                                        <p className="font-semibold">{transporter.totalServices}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Active Jobs</span>
                                        <p className="font-semibold">{transporter.activeServices}</p>
                                    </div>
                                </div>

                                {/* Vehicle Types */}
                                <div className="mb-4">
                                    <span className="text-sm text-gray-500">Vehicle Types:</span>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {transporter.vehicleTypes.map((type, index) => (
                                            <span key={index} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs">
                                                {type}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-2 mb-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span>{transporter.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span>{transporter.phone}</span>
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Rate per KM:</span>
                                        <span className="font-semibold text-gray-900">Rs. {transporter.pricePerKm}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-sm text-gray-600">Availability:</span>
                                        <span className="text-sm text-gray-900">{transporter.availability}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button className="flex-1 px-3 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors">
                                        Contact
                                    </button>
                                    <button className="flex-1 px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">
                                        View Details
                                    </button>
                                    <button 
                                        onClick={() => handleStatusChange(transporter.id, transporter.status === 'active' ? 'inactive' : 'active')}
                                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                                            transporter.status === 'active'
                                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                        }`}
                                    >
                                        {transporter.status === 'active' ? 'Deactivate' : 'Activate'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredTransporters.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">🚛</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No transporters found</h3>
                            <p className="text-gray-600">
                                {filters.status || filters.location || filters.rating 
                                    ? "Try adjusting your search criteria" 
                                    : "No transport partners available at the moment"}
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TransportersPage;