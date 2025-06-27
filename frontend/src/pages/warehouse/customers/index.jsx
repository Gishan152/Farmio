import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/warehouse/Sidebar';

const CustomersIndex = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                // Mock customer data - only farmers and buyers (customers who book storage)
                const mockCustomers = [
                    // Farmers
                    {
                        id: 1,
                        name: "Kumara Perera",
                        email: "kumara@example.com",
                        phone: "077-123-4567",
                        type: "farmer",
                        company: "Perera Organic Farm",
                        location: "Colombo",
                        rating: 4.5,
                        totalBookings: 25,
                        activeBookings: 2,
                        completedBookings: 23,
                        joinDate: "2024-01-15",
                        lastBooking: "2024-12-20",
                        totalRevenue: 125000,
                        status: "active",
                        verificationStatus: "verified",
                        notes: "Regular customer, prefers cold storage",
                        profileImage: null
                    },
                    {
                        id: 2,
                        name: "Mary Fernando",
                        email: "mary@fernandofarms.com",
                        phone: "078-444-5555",
                        type: "farmer",
                        company: "Fernando Organic Farms",
                        location: "Matara",
                        rating: 4.7,
                        totalBookings: 32,
                        activeBookings: 3,
                        completedBookings: 29,
                        joinDate: "2023-11-05",
                        lastBooking: "2024-12-22",
                        totalRevenue: 180000,
                        status: "active",
                        verificationStatus: "verified",
                        notes: "Premium organic produce supplier",
                        profileImage: null
                    },
                    // Buyers
                    {
                        id: 3,
                        name: "Nimal Silva",
                        email: "nimal@silvatrading.com",
                        phone: "076-987-6543",
                        type: "buyer",
                        company: "Silva Trading Co.",
                        location: "Kandy",
                        rating: 4.8,
                        totalBookings: 18,
                        activeBookings: 1,
                        completedBookings: 17,
                        joinDate: "2024-03-10",
                        lastBooking: "2024-12-18",
                        totalRevenue: 95000,
                        status: "active",
                        verificationStatus: "verified",
                        notes: "Bulk buyer, excellent payment history",
                        profileImage: null
                    },
                    {
                        id: 4,
                        name: "Rajesh Exports",
                        email: "info@rajeshexports.com",
                        phone: "071-888-9999",
                        type: "buyer",
                        company: "Rajesh International Exports",
                        location: "Colombo",
                        rating: 4.6,
                        totalBookings: 12,
                        activeBookings: 2,
                        completedBookings: 10,
                        joinDate: "2024-07-20",
                        lastBooking: "2024-12-21",
                        totalRevenue: 245000,
                        status: "active",
                        verificationStatus: "pending",
                        notes: "Export buyer, high quality standards",
                        profileImage: null
                    }
                ];
                
                setCustomers(mockCustomers);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching customers:", error);
                setLoading(false);
            }
        };

        loadCustomers();
    }, []);

    const navigateToCustomerType = (customerType) => {
        navigate(`/warehouse/customers/${customerType}`);
    };

    // Get customer type statistics
    const getCustomerStats = () => {
        const stats = {
            farmers: customers.filter(c => c.type === 'farmer').length,
            buyers: customers.filter(c => c.type === 'buyer').length,
        };
        return stats;
    };

    const stats = getCustomerStats();

    if (loading) {
        return (
            <div className="flex min-h-screen bg-green-50">
                <Sidebar />
                <div className="flex justify-center items-center flex-1">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-green-700">Loading customers...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-white-50">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl lg:text-3xl font-bold text-green-900 flex items-center gap-2">
                            <span className="text-3xl lg:text-4xl">👥</span> Customer Management
                        </h1>
                        <p className="text-green-700 mt-1 text-sm">View and manage profiles of farmers and buyers using your storage services.</p>
                    </div>
                    
                    {/* Overview Banner */}
                    <div className="mb-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full transform translate-x-20 -translate-y-20"></div>
                        <div className="relative z-10">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2 hover:bg-white/30 transition-colors">
                                        <span className="text-xl">🌾</span>
                                    </div>
                                    <h3 className="text-sm font-medium">Farmers</h3>
                                    <p className="text-green-100 text-xs">Producers</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2 hover:bg-white/30 transition-colors">
                                        <span className="text-xl">🏪</span>
                                    </div>
                                    <h3 className="text-sm font-medium">Buyers</h3>
                                    <p className="text-green-100 text-xs">Purchasers</p>
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
                                        <span className="text-xl">💬</span>
                                    </div>
                                    <h3 className="text-sm font-medium">Messaging</h3>
                                    <p className="text-green-100 text-xs">Direct Communication</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Type Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {/* Farmers Card */}
                        <div 
                            onClick={() => navigateToCustomerType('farmers')}
                            className="bg-white rounded-xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-4xl">🌾</div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-700">{stats.farmers}</div>
                                    <div className="text-xs text-green-600">Registered</div>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-green-900 mb-2">Farmers</h3>
                            <p className="text-green-700 text-sm mb-4">
                                Producers storing their crops in your warehouse facilities.
                            </p>
                            <div className="space-y-2 text-sm text-green-600 mb-4">
                                <div className="flex justify-between">
                                    <span>Total Bookings:</span>
                                    <span className="font-medium">
                                        {customers.filter(c => c.type === 'farmer').reduce((sum, c) => sum + c.totalBookings, 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Revenue:</span>
                                    <span className="font-medium">
                                        Rs. {(customers.filter(c => c.type === 'farmer').reduce((sum, c) => sum + c.totalRevenue, 0) / 1000).toFixed(0)}k
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Avg Rating:</span>
                                    <span className="font-medium">
                                        {stats.farmers > 0 ? (customers.filter(c => c.type === 'farmer').reduce((sum, c) => sum + c.rating, 0) / stats.farmers).toFixed(1) : '0'} ⭐
                                    </span>
                                </div>
                            </div>
                            <div className="text-green-700 group-hover:text-green-800 flex items-center text-sm font-medium">
                                View All Farmers
                                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>

                        {/* Buyers Card */}
                        <div 
                            onClick={() => navigateToCustomerType('buyers')}
                            className="bg-white rounded-xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-4xl">🏪</div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-700">{stats.buyers}</div>
                                    <div className="text-xs text-green-600">Registered</div>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-green-900 mb-2">Buyers</h3>
                            <p className="text-green-700 text-sm mb-4">
                                Wholesalers and exporters purchasing stored agricultural products.
                            </p>
                            <div className="space-y-2 text-sm text-green-600 mb-4">
                                <div className="flex justify-between">
                                    <span>Total Bookings:</span>
                                    <span className="font-medium">
                                        {customers.filter(c => c.type === 'buyer').reduce((sum, c) => sum + c.totalBookings, 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Revenue:</span>
                                    <span className="font-medium">
                                        Rs. {(customers.filter(c => c.type === 'buyer').reduce((sum, c) => sum + c.totalRevenue, 0) / 1000).toFixed(0)}k
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Avg Rating:</span>
                                    <span className="font-medium">
                                        {stats.buyers > 0 ? (customers.filter(c => c.type === 'buyer').reduce((sum, c) => sum + c.rating, 0) / stats.buyers).toFixed(1) : '0'} ⭐
                                    </span>
                                </div>
                            </div>
                            <div className="text-green-700 group-hover:text-green-800 flex items-center text-sm font-medium">
                                View All Buyers
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

export default CustomersIndex;