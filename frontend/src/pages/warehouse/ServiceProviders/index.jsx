import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/warehouse/Sidebar';

const ServiceProvidersIndex = () => {
    const [serviceProviders, setServiceProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Mock service providers data - only transporters and waste management
    const mockServiceProviders = [
        // Transporters
        {
            id: 5,
            name: "Priya Transport",
            email: "priya@priyalogistics.com",
            phone: "071-555-9999",
            type: "transporter",
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
            vehicleTypes: ["Refrigerated Truck", "Dry Van"]
        },
        {
            id: 6,
            name: "Lanka Express Cargo",
            email: "operations@lankaexpress.com",
            phone: "077-333-4444",
            type: "transporter",
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
            vehicleTypes: ["Container Truck", "Flatbed"]
        },
        // Waste Management Agents
        {
            id: 7,
            name: "Green Waste Solutions",
            email: "contact@greenwaste.lk",
            phone: "074-777-8888",
            type: "waste_management",
            company: "Green Waste Solutions",
            location: "Colombo",
            rating: 4.3,
            totalServices: 6,
            activeServices: 1,
            completedServices: 5,
            joinDate: "2024-08-15",
            lastService: "2024-12-10",
            totalEarnings: 28000,
            status: "active",
            verificationStatus: "verified",
            notes: "Eco-friendly waste disposal specialist",
            availability: "Mon-Fri 8AM-6PM",
            incentives: "Free pickup for bulk waste",
            serviceTypes: ["Organic Waste", "Compost Production"]
        },
        {
            id: 8,
            name: "Bio Compost Lanka",
            email: "info@biocompost.lk",
            phone: "076-666-7777",
            type: "waste_management",
            company: "Bio Compost Lanka",
            location: "Gampaha",
            rating: 4.1,
            totalServices: 4,
            activeServices: 0,
            completedServices: 4,
            joinDate: "2024-09-30",
            lastService: "2024-11-25",
            totalEarnings: 15000,
            status: "active",
            verificationStatus: "pending",
            notes: "Specializes in converting waste to fertilizer",
            availability: "Weekends preferred",
            incentives: "20% discount for regular clients",
            serviceTypes: ["Waste to Fertilizer", "Biogas Production"]
        }
    ];

    useEffect(() => {
        const loadServiceProviders = async () => {
            try {
                setServiceProviders(mockServiceProviders);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching service providers:", error);
                setServiceProviders(mockServiceProviders);
                setLoading(false);
            }
        };

        loadServiceProviders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const navigateToServiceType = (serviceType) => {
        navigate(`/warehouse/service-providers/${serviceType}`);
    };

    // Get service provider type statistics
    const getServiceStats = () => {
        const stats = {
            transporters: serviceProviders.filter(sp => sp.type === 'transporter').length,
            wasteManagement: serviceProviders.filter(sp => sp.type === 'waste_management').length,
        };
        return stats;
    };

    const stats = getServiceStats();

    if (loading) {
        return (
            <div className="min-h-screen bg-green-50 flex">
                {/* Fixed Sidebar */}
                <div className="fixed top-0 left-0 h-screen w-64 z-30">
                    <Sidebar />
                </div>
                <div className="flex-1 ml-64 flex justify-center items-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-green-700">Loading service providers...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white-50">
            {/* Fixed Sidebar */}
            <div className="fixed top-0 left-0 h-screen w-64 z-30">
                <Sidebar />
            </div>
            {/* Main Content with left margin */}
            <main className="ml-64 p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl lg:text-3xl font-bold text-green-900 flex items-center gap-2">
                            <span className="text-3xl lg:text-4xl">🌿</span> Service Providers
                        </h1>
                        <p className="text-green-700 mt-1">Collaborate with transport and waste management partners to streamline warehouse operations.</p>
                    </div>

                    {/* Overview Banner */}
                    <div className="mb-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full transform translate-x-20 -translate-y-20"></div>
                        <div className="relative z-10">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2 hover:bg-white/30 transition-colors">
                                        <span className="text-xl">🚚</span>
                                    </div>
                                    <h3 className="text-sm font-medium">Transport</h3>
                                    <p className="text-green-100 text-xs">Reliable Logistics</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2 hover:bg-white/30 transition-colors">
                                        <span className="text-xl">♻️</span>
                                    </div>
                                    <h3 className="text-sm font-medium">Waste Management</h3>
                                    <p className="text-green-100 text-xs">Eco Solutions</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2 hover:bg-white/30 transition-colors">
                                        <span className="text-xl">⭐</span>
                                    </div>
                                    <h3 className="text-sm font-medium">Ratings</h3>
                                    <p className="text-green-100 text-xs">Quality Feedback</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2 hover:bg-white/30 transition-colors">
                                        <span className="text-xl">📅</span>
                                    </div>
                                    <h3 className="text-sm font-medium">Scheduling</h3>
                                    <p className="text-green-100 text-xs">Seamless Coordination</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Service Provider Type Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {/* Transporters Card */}
                        <div 
                            onClick={() => navigateToServiceType('transporters')}
                            className="bg-white rounded-xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-4xl">🚚</div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-700">{stats.transporters}</div>
                                    <div className="text-xs text-green-600">Available</div>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-green-900 mb-2">Transport Partners</h3>
                            <p className="text-green-700 text-sm mb-4">
                                Coordinate with logistics providers for efficient product delivery to and from your warehouse.
                            </p>
                            <div className="space-y-2 text-sm text-green-600 mb-4">
                                <div className="flex justify-between">
                                    <span>Total Services:</span>
                                    <span className="font-medium">
                                        {serviceProviders.filter(sp => sp.type === 'transporter').reduce((sum, sp) => sum + sp.totalServices, 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Active Now:</span>
                                    <span className="font-medium">
                                        {serviceProviders.filter(sp => sp.type === 'transporter').reduce((sum, sp) => sum + sp.activeServices, 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Avg Rating:</span>
                                    <span className="font-medium">
                                        {stats.transporters > 0 ? (serviceProviders.filter(sp => sp.type === 'transporter').reduce((sum, sp) => sum + sp.rating, 0) / stats.transporters).toFixed(1) : '0'} ⭐
                                    </span>
                                </div>
                            </div>
                            <div className="text-green-700 group-hover:text-green-800 flex items-center text-sm font-medium">
                                Manage Transport Partners
                                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>

                        {/* Waste Management Card */}
                        <div 
                            onClick={() => navigateToServiceType('waste-management')}
                            className="bg-white rounded-xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-4xl">♻️</div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-700">{stats.wasteManagement}</div>
                                    <div className="text-xs text-green-600">Available</div>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-green-900 mb-2">Waste Management</h3>
                            <p className="text-green-700 text-sm mb-4">
                                Partner with eco-friendly services to process agricultural waste and by-products.
                            </p>
                            <div className="space-y-2 text-sm text-green-600 mb-4">
                                <div className="flex justify-between">
                                    <span>Total Services:</span>
                                    <span className="font-medium">
                                        {serviceProviders.filter(sp => sp.type === 'waste_management').reduce((sum, sp) => sum + sp.totalServices, 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Active Now:</span>
                                    <span className="font-medium">
                                        {serviceProviders.filter(sp => sp.type === 'waste_management').reduce((sum, sp) => sum + sp.activeServices, 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Avg Rating:</span>
                                    <span className="font-medium">
                                        {stats.wasteManagement > 0 ? (serviceProviders.filter(sp => sp.type === 'waste_management').reduce((sum, sp) => sum + sp.rating, 0) / stats.wasteManagement).toFixed(1) : '0'} ⭐
                                    </span>
                                </div>
                            </div>
                            <div className="text-green-700 group-hover:text-green-800 flex items-center text-sm font-medium">
                                Manage Waste Partners
                                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ServiceProvidersIndex;