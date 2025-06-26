import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../../components/warehouse/Sidebar';

const WasteManagementPage = () => {
    const [wasteProviders, setWasteProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        location: '',
        serviceType: ''
    });

    useEffect(() => {
        const loadWasteProviders = async () => {
            try {
                // Mock waste management providers data
                const mockWasteProviders = [
                    {
                        id: 7,
                        name: "Green Waste Solutions",
                        email: "contact@greenwaste.lk",
                        phone: "074-777-8888",
                        company: "Green Waste Solutions",
                        location: "Colombo",
                        rating: 4.3,
                        totalServices: 6,
                        activeServices: 1,
                        completedServices: 5,
                        status: "active",
                        verificationStatus: "verified",
                        notes: "Eco-friendly waste disposal specialist",
                        availability: "Mon-Fri 8AM-6PM",
                        incentives: "Free pickup for bulk waste",
                        serviceTypes: ["Organic Waste", "Compost Production"],
                        pricePerTon: 1500,
                        processingCapacity: "50 tons/month",
                        equipment: ["Composting Units", "Shredders", "Biogas Digesters"]
                    },
                    {
                        id: 8,
                        name: "Bio Compost Lanka",
                        email: "info@biocompost.lk",
                        phone: "076-666-7777",
                        company: "Bio Compost Lanka",
                        location: "Gampaha",
                        rating: 4.1,
                        totalServices: 4,
                        activeServices: 0,
                        completedServices: 4,
                        status: "active",
                        verificationStatus: "pending",
                        notes: "Specializes in converting waste to fertilizer",
                        availability: "Weekends preferred",
                        incentives: "20% discount for regular clients",
                        serviceTypes: ["Waste to Fertilizer", "Biogas Production"],
                        pricePerTon: 1200,
                        processingCapacity: "30 tons/month",
                        equipment: ["Fermentation Tanks", "Grinding Mills", "Drying Units"]
                    },
                    {
                        id: 9,
                        name: "EcoRecycle Solutions",
                        email: "admin@ecorecycle.lk",
                        phone: "075-888-9999",
                        company: "EcoRecycle Solutions",
                        location: "Kandy",
                        rating: 4.5,
                        totalServices: 12,
                        activeServices: 2,
                        completedServices: 10,
                        status: "active",
                        verificationStatus: "verified",
                        notes: "Full-service waste management and recycling",
                        availability: "24/7 emergency service",
                        incentives: "Volume discounts available",
                        serviceTypes: ["Organic Waste", "Packaging Waste", "Compost Production"],
                        pricePerTon: 1800,
                        processingCapacity: "100 tons/month",
                        equipment: ["Sorting Systems", "Composting Units", "Recycling Machines"]
                    }
                ];
                
                setWasteProviders(mockWasteProviders);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching waste providers:", error);
                setLoading(false);
            }
        };

        loadWasteProviders();
    }, []);

    const filteredProviders = wasteProviders.filter(provider => {
        return (
            (!filters.status || provider.status === filters.status) &&
            (!filters.location || provider.location.toLowerCase().includes(filters.location.toLowerCase())) &&
            (!filters.serviceType || provider.serviceTypes.some(type => 
                type.toLowerCase().includes(filters.serviceType.toLowerCase())
            ))
        );
    });

    const schedulePickup = (providerId) => {
        console.log(`Scheduling pickup with provider ${providerId}`);
        alert('Pickup request sent! The provider will contact you to confirm scheduling.');
    };

    const requestQuote = (providerId) => {
        console.log(`Requesting quote from provider ${providerId}`);
        alert('Quote request sent! You will receive pricing details within 24 hours.');
    };

    const contactProvider = (provider) => {
        alert(`Contact ${provider.name}:\nPhone: ${provider.phone}\nEmail: ${provider.email}`);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex justify-center items-center flex-1">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading waste management providers...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar - Full height and always visible */}
            <Sidebar />
            
            {/* Main Content */}
            <main className="flex-1">
                <div className="p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <Link 
                                to="/warehouse/service-providers"
                                className="text-green-600 hover:text-green-800 mb-4 inline-flex items-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Service Providers
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                                ♻️ Waste Management Partners
                            </h1>
                            <p className="text-gray-600 mb-6">Browse and connect with agricultural waste processing services</p>

                            {/* Filters */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold mb-4">Find Waste Management Providers</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <select
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={filters.status}
                                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                                    >
                                        <option value="">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>

                                    <input
                                        type="text"
                                        placeholder="Search by location"
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={filters.location}
                                        onChange={(e) => setFilters({...filters, location: e.target.value})}
                                    />

                                    <input
                                        type="text"
                                        placeholder="Search by service type"
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={filters.serviceType}
                                        onChange={(e) => setFilters({...filters, serviceType: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Providers Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredProviders.map(provider => (
                                <div key={provider.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl">
                                                ♻️
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                                                <p className="text-sm text-gray-600">{provider.company}</p>
                                                <p className="text-xs text-gray-500">{provider.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                provider.status === 'active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {provider.status}
                                            </span>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                provider.verificationStatus === 'verified'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {provider.verificationStatus}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">Rating</span>
                                            <p className="font-semibold">{provider.rating} ⭐</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Completed</span>
                                            <p className="font-semibold">{provider.completedServices}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Active Now</span>
                                            <p className="font-semibold text-green-600">{provider.activeServices}</p>
                                        </div>
                                    </div>

                                    {/* Service Types */}
                                    <div className="mb-4">
                                        <span className="text-sm text-gray-500">Services Offered:</span>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {provider.serviceTypes.map((type, index) => (
                                                <span key={index} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                                                    {type}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Processing Capacity & Equipment */}
                                    <div className="grid grid-cols-1 gap-3 mb-4 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Processing Capacity:</span>
                                            <span className="font-semibold">{provider.processingCapacity}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Equipment Available:</span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {provider.equipment.map((item, index) => (
                                                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span>{provider.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span>{provider.phone}</span>
                                        </div>
                                    </div>

                                    {/* Pricing & Incentives */}
                                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-600">Rate per Ton:</span>
                                            <span className="font-semibold text-gray-900">Rs. {provider.pricePerTon}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-600">Availability:</span>
                                            <span className="text-sm text-gray-900">{provider.availability}</span>
                                        </div>
                                        {provider.incentives && (
                                            <div className="mt-2 p-2 bg-green-50 rounded border-l-4 border-green-400">
                                                <p className="text-xs text-green-700 font-medium">💰 {provider.incentives}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Notes */}
                                    {provider.notes && (
                                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                            <p className="text-sm text-blue-800">📝 {provider.notes}</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => schedulePickup(provider.id)}
                                            className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            Schedule Pickup
                                        </button>
                                        <button 
                                            onClick={() => requestQuote(provider.id)}
                                            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Request Quote
                                        </button>
                                        <button 
                                            onClick={() => contactProvider(provider)}
                                            className="px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            Contact
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredProviders.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">♻️</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No waste management providers found</h3>
                                <p className="text-gray-600">
                                    {filters.status || filters.location || filters.serviceType 
                                        ? "Try adjusting your search criteria" 
                                        : "No waste management partners available at the moment"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default WasteManagementPage;