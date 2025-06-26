import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/warehouse/Sidebar';

const BuyersPage = () => {
    const [buyers, setBuyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [filterBy, setFilterBy] = useState('all');
    const [selectedBuyer, setSelectedBuyer] = useState(null);
    const [modalType, setModalType] = useState(null);
    const navigate = useNavigate();

    // Mock buyers data
    const mockBuyers = [
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
            profileImage: null,
            businessType: "Wholesale",
            specialization: "Organic Products"
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
            profileImage: null,
            businessType: "Exporter",
            specialization: "International Markets"
        },
        {
            id: 10,
            name: "Green Valley Retailers",
            email: "contact@greenvalley.lk",
            phone: "077-555-4444",
            type: "buyer",
            company: "Green Valley Retail Chain",
            location: "Colombo",
            rating: 4.4,
            totalBookings: 22,
            activeBookings: 3,
            completedBookings: 19,
            joinDate: "2023-12-15",
            lastBooking: "2024-12-23",
            totalRevenue: 165000,
            status: "active",
            verificationStatus: "verified",
            notes: "Large retail chain, consistent orders",
            profileImage: null,
            businessType: "Retail Chain",
            specialization: "Fresh Produce"
        }
    ];

    useEffect(() => {
        const loadBuyers = async () => {
            try {
                setBuyers(mockBuyers);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching buyers:", error);
                setBuyers(mockBuyers);
                setLoading(false);
            }
        };

        loadBuyers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredAndSortedBuyers = buyers
        .filter(buyer => {
            const matchesSearch = buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                buyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                buyer.company.toLowerCase().includes(searchTerm.toLowerCase());
            
            if (filterBy === 'all') return matchesSearch;
            if (filterBy === 'active') return matchesSearch && buyer.status === 'active';
            if (filterBy === 'verified') return matchesSearch && buyer.verificationStatus === 'verified';
            if (filterBy === 'pending') return matchesSearch && buyer.verificationStatus === 'pending';
            
            return matchesSearch;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'rating':
                    return b.rating - a.rating;
                case 'bookings':
                    return b.totalBookings - a.totalBookings;
                case 'revenue':
                    return b.totalRevenue - a.totalRevenue;
                case 'joinDate':
                    return new Date(b.joinDate) - new Date(a.joinDate);
                default:
                    return 0;
            }
        });

    const openModal = (buyer, type) => {
        setSelectedBuyer(buyer);
        setModalType(type);
    };

    const closeModal = () => {
        setSelectedBuyer(null);
        setModalType(null);
    };

    const handleSendMessage = (messageData) => {
        console.log('Sending message:', messageData);
        closeModal();
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-green-50">
                <Sidebar />
                <div className="flex justify-center items-center flex-1">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-green-700">Loading buyers...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-green-50">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-4 mb-2">
                            <button 
                                onClick={() => navigate('/warehouse/customers')}
                                className="text-green-600 hover:text-green-800 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h1 className="text-2xl lg:text-3xl font-bold text-green-900 flex items-center gap-2">
                                <span className="text-3xl lg:text-4xl">🏪</span> Buyer Management
                            </h1>
                        </div>
                        <p className="text-green-700">Manage your buyer customers who purchase stored agricultural products from your warehouse.</p>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white rounded-lg shadow-sm border border-green-200 p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Search buyers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="name">Sort by Name</option>
                                    <option value="rating">Sort by Rating</option>
                                    <option value="bookings">Sort by Bookings</option>
                                    <option value="revenue">Sort by Revenue</option>
                                    <option value="joinDate">Sort by Join Date</option>
                                </select>
                            </div>
                            <div>
                                <select
                                    value={filterBy}
                                    onChange={(e) => setFilterBy(e.target.value)}
                                    className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="all">All Buyers</option>
                                    <option value="active">Active Only</option>
                                    <option value="verified">Verified Only</option>
                                    <option value="pending">Pending Verification</option>
                                </select>
                            </div>
                            <div className="text-sm text-green-600 flex items-center">
                                Showing {filteredAndSortedBuyers.length} of {buyers.length} buyers
                            </div>
                        </div>
                    </div>

                    {/* Buyers Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAndSortedBuyers.map((buyer) => (
                            <div key={buyer.id} className="bg-white rounded-lg shadow-sm border border-green-200 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                                <span className="text-xl">🏪</span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-green-900">{buyer.name}</h3>
                                                <p className="text-sm text-green-600">{buyer.company}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                buyer.status === 'active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {buyer.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-green-600">Location:</span>
                                            <span className="text-green-900">{buyer.location}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-green-600">Business Type:</span>
                                            <span className="text-green-900">{buyer.businessType}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-green-600">Specialization:</span>
                                            <span className="text-green-900">{buyer.specialization}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-green-600">Rating:</span>
                                            <span className="text-green-900">{buyer.rating} ⭐</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-green-600">Total Bookings:</span>
                                            <span className="text-green-900">{buyer.totalBookings}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-green-600">Revenue:</span>
                                            <span className="text-green-900">Rs. {(buyer.totalRevenue / 1000).toFixed(0)}k</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openModal(buyer, 'view')}
                                            className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700 transition-colors"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => openModal(buyer, 'message')}
                                            className="px-3 py-2 border border-green-600 text-green-600 rounded-md text-sm hover:bg-green-50 transition-colors"
                                        >
                                            💬
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredAndSortedBuyers.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🏪</div>
                            <h3 className="text-lg font-medium text-green-900 mb-2">No buyers found</h3>
                            <p className="text-green-600">Try adjusting your search or filter criteria.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* View Modal */}
            {modalType === 'view' && selectedBuyer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xl font-bold text-green-900">Buyer Details</h3>
                                <button
                                    onClick={closeModal}
                                    className="text-green-600 hover:text-green-800"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-green-700">Name</label>
                                        <p className="text-green-900">{selectedBuyer.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-green-700">Company</label>
                                        <p className="text-green-900">{selectedBuyer.company}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-green-700">Email</label>
                                        <p className="text-green-900">{selectedBuyer.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-green-700">Phone</label>
                                        <p className="text-green-900">{selectedBuyer.phone}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-green-700">Location</label>
                                        <p className="text-green-900">{selectedBuyer.location}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-green-700">Business Type</label>
                                        <p className="text-green-900">{selectedBuyer.businessType}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-green-700">Specialization</label>
                                    <p className="text-green-900">{selectedBuyer.specialization}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-green-700">Notes</label>
                                    <p className="text-green-900">{selectedBuyer.notes}</p>
                                </div>

                                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-700">{selectedBuyer.totalBookings}</div>
                                        <div className="text-sm text-green-600">Total Bookings</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-700">{selectedBuyer.rating}</div>
                                        <div className="text-sm text-green-600">Rating ⭐</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-700">Rs. {(selectedBuyer.totalRevenue / 1000).toFixed(0)}k</div>
                                        <div className="text-sm text-green-600">Total Revenue</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Message Modal */}
            {modalType === 'message' && selectedBuyer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xl font-bold text-green-900">Send Message</h3>
                                <button
                                    onClick={closeModal}
                                    className="text-green-600 hover:text-green-800"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                handleSendMessage({
                                    to: selectedBuyer.email,
                                    subject: formData.get('subject'),
                                    message: formData.get('message')
                                });
                            }}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-green-700 mb-1">To</label>
                                        <p className="text-green-900">{selectedBuyer.name} ({selectedBuyer.email})</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-green-700 mb-1">Subject</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="Enter subject"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-green-700 mb-1">Message</label>
                                        <textarea
                                            name="message"
                                            rows="4"
                                            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="Enter your message"
                                            required
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                                    >
                                        Send Message
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuyersPage;