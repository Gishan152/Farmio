import { useState, useEffect } from 'react';
import { 
    EyeIcon, 
    CheckIcon, 
    XMarkIcon, 
    ClockIcon,
    CalendarIcon,
    UserIcon,
    PhoneIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline';

export default function BookingManagement() {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEarlyRetrievalModal, setShowEarlyRetrievalModal] = useState(false);
    const [earlyRetrievalData, setEarlyRetrievalData] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(false);

    // Sample booking data
    const sampleBookings = [
        {
            id: "BK001",
            farmerId: "F001",
            farmerName: "Farmer Kumara",
            farmerPhone: "+94771234567",
            farmerEmail: "kumara@email.com",
            produce: "Rice",
            cropType: "Basmati Rice",
            quantity: 500,
            duration: 14,
            slotId: "S-15",
            status: "pending",
            requestDate: "2024-01-15",
            startDate: "2024-01-20",
            endDate: "2024-02-03",
            pricePerKg: 0.25,
            totalAmount: 1750,
            hasEarlyRetrieval: false
        },
        {
            id: "BK002",
            farmerId: "F002",
            farmerName: "Green Valley Co-op",
            farmerPhone: "+94777654321",
            farmerEmail: "info@greenvalley.lk",
            produce: "Vegetables",
            cropType: "Mixed Vegetables",
            quantity: 300,
            duration: 7,
            slotId: "S-08",
            status: "approved",
            requestDate: "2024-01-14",
            startDate: "2024-01-18",
            endDate: "2024-01-25",
            pricePerKg: 0.30,
            totalAmount: 630,
            hasEarlyRetrieval: true,
            earlyRetrievalRequest: {
                requestDate: "2024-01-22",
                proposedEndDate: "2024-01-23",
                unusedDays: 2,
                usedDays: 5,
                refundAmount: 180,
                ownerAmount: 450
            }
        },
        {
            id: "BK003",
            farmerId: "F003",
            farmerName: "Silva Farms",
            farmerPhone: "+94712345678",
            farmerEmail: "silva@farms.lk",
            produce: "Fruits",
            cropType: "Mangoes",
            quantity: 200,
            duration: 10,
            slotId: "S-12",
            status: "rejected",
            requestDate: "2024-01-13",
            rejectionReason: "Insufficient cold storage capacity for requested quantity",
            pricePerKg: 0.35,
            totalAmount: 700
        }
    ];

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        setLoading(true);
        try {
            // TODO: Replace with actual API call
            // const response = await fetch(`/api/bookings/warehouse/${warehouseId}`);
            // const data = await response.json();
            setBookings(sampleBookings);
        } catch (error) {
            console.error('Error loading bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveBooking = async (bookingId) => {
        try {
            // TODO: Replace with actual API call
            // await fetch(`/api/bookings/${bookingId}/approve`, { method: 'POST' });
            setBookings(prev => prev.map(booking => 
                booking.id === bookingId 
                    ? { ...booking, status: 'approved' }
                    : booking
            ));
        } catch (error) {
            console.error('Error approving booking:', error);
        }
    };

    const handleRejectBooking = async (bookingId, reason) => {
        try {
            // TODO: Replace with actual API call
            // await fetch(`/api/bookings/${bookingId}/reject`, { 
            //     method: 'POST',
            //     body: JSON.stringify({ reason })
            // });
            setBookings(prev => prev.map(booking => 
                booking.id === bookingId 
                    ? { ...booking, status: 'rejected', rejectionReason: reason }
                    : booking
            ));
            setRejectionReason('');
        } catch (error) {
            console.error('Error rejecting booking:', error);
        }
    };

    const handleEarlyRetrievalApprove = async (bookingId) => {
        try {
            // TODO: Replace with actual API call
            setBookings(prev => prev.map(booking => 
                booking.id === bookingId 
                    ? { ...booking, hasEarlyRetrieval: false, status: 'completed' }
                    : booking
            ));
            setShowEarlyRetrievalModal(false);
            setEarlyRetrievalData(null);
        } catch (error) {
            console.error('Error approving early retrieval:', error);
        }
    };

    const handleEarlyRetrievalReject = async (bookingId, reason) => {
        try {
            // TODO: Replace with actual API call
            setBookings(prev => prev.map(booking => 
                booking.id === bookingId 
                    ? { 
                        ...booking, 
                        earlyRetrievalRequest: {
                            ...booking.earlyRetrievalRequest,
                            status: 'rejected',
                            rejectionReason: reason
                        }
                    }
                    : booking
            ));
            setShowEarlyRetrievalModal(false);
            setEarlyRetrievalData(null);
            setRejectionReason('');
        } catch (error) {
            console.error('Error rejecting early retrieval:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredBookings = bookings.filter(booking => {
        if (filterStatus === 'all') return true;
        if (filterStatus === 'early-retrieval') return booking.hasEarlyRetrieval;
        return booking.status === filterStatus;
    });

    // Check if any modal is open
    const isModalOpen = showDetailsModal || showEarlyRetrievalModal;

        return (
        <div className="p-6 bg-gradient-to-br white min-h-screen">
            <div className={`max-w-7xl mx-auto space-y-6 transition-all duration-300 ${isModalOpen ? 'backdrop-blur-sm' : ''}`}>
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md border border-green-200 p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
                            <p className="text-gray-600 mt-1">Approve/reject bookings and manage early retrievals</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                            >
                                <option value="all">All Bookings</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="early-retrieval">Early Retrieval</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="bg-white rounded-lg shadow-md border border-green-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-green-100 to-green-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Booking ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Farmer/Buyer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Produce</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Duration</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Slot</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-green-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                            Loading bookings...
                                        </td>
                                    </tr>
                                ) : filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                            No bookings found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-green-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className="font-medium text-gray-900">{booking.id}</span>
                                                    {booking.hasEarlyRetrieval && (
                                                        <ClockIcon className="h-4 w-4 text-orange-500 ml-2" title="Early Retrieval Request" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{booking.farmerName}</div>
                                                <div className="text-sm text-gray-500">{booking.farmerPhone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{booking.produce}</div>
                                                <div className="text-sm text-gray-500">{booking.cropType}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {booking.quantity} kg
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {booking.duration} days
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                                                    {booking.slotId}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedBooking(booking);
                                                        setShowDetailsModal(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-all duration-200"
                                                    title="View Details"
                                                >
                                                    <EyeIcon className="h-4 w-4" />
                                                </button>
                                                
                                                {booking.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApproveBooking(booking.id)}
                                                            className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50 transition-all duration-200"
                                                            title="Approve"
                                                        >
                                                            <CheckIcon className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const reason = prompt('Please provide a reason for rejection:');
                                                                if (reason) handleRejectBooking(booking.id, reason);
                                                            }}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-all duration-200"
                                                            title="Reject"
                                                        >
                                                            <XMarkIcon className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                )}
                                                
                                                {booking.hasEarlyRetrieval && (
                                                    <button
                                                        onClick={() => {
                                                            setEarlyRetrievalData(booking);
                                                            setShowEarlyRetrievalModal(true);
                                                        }}
                                                        className="text-orange-600 hover:text-orange-900 p-1 rounded-md hover:bg-orange-50 transition-all duration-200"
                                                        title="Handle Early Retrieval"
                                                    >
                                                        <ClockIcon className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Booking Details Modal */}
            {showDetailsModal && selectedBooking && (
                <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn border border-green-200">
                        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold">Booking Details - {selectedBooking.id}</h3>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="text-white hover:text-gray-200 p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-all duration-200"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Contact Information */}
                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                    <UserIcon className="h-5 w-5 text-green-600 mr-2" />
                                    Contact Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium">Name:</span> {selectedBooking.farmerName}
                                    </div>
                                    <div className="flex items-center">
                                        <PhoneIcon className="h-4 w-4 text-green-500 mr-2" />
                                        {selectedBooking.farmerPhone}
                                    </div>
                                    <div className="flex items-center md:col-span-2">
                                        <EnvelopeIcon className="h-4 w-4 text-green-500 mr-2" />
                                        {selectedBooking.farmerEmail}
                                    </div>
                                </div>
                            </div>

                            {/* Booking Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900 text-green-800">Produce Details</h4>
                                    <div className="space-y-2 text-sm">
                                        <div><span className="font-medium">Crop Type:</span> {selectedBooking.cropType}</div>
                                        <div><span className="font-medium">Category:</span> {selectedBooking.produce}</div>
                                        <div><span className="font-medium">Quantity:</span> {selectedBooking.quantity} kg</div>
                                        <div><span className="font-medium">Slot:</span> {selectedBooking.slotId}</div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-green-800">Duration & Pricing</h4>
                                    <div className="space-y-2 text-sm">
                                        <div><span className="font-medium">Duration:</span> {selectedBooking.duration} days</div>
                                        <div><span className="font-medium">Start Date:</span> {selectedBooking.startDate}</div>
                                        <div><span className="font-medium">End Date:</span> {selectedBooking.endDate}</div>
                                        <div><span className="font-medium">Price per kg:</span> Rs. {selectedBooking.pricePerKg}</div>
                                        <div><span className="font-medium">Total Amount:</span> Rs. {selectedBooking.totalAmount}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Information */}
                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                <h4 className="font-semibold text-green-800 mb-2">Status Information</h4>
                                <div className="flex items-center space-x-4">
                                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedBooking.status)}`}>
                                        {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        Requested on: {selectedBooking.requestDate}
                                    </span>
                                </div>
                                {selectedBooking.rejectionReason && (
                                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                                        <span className="font-medium text-red-800">Rejection Reason:</span>
                                        <p className="text-red-700 mt-1">{selectedBooking.rejectionReason}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Early Retrieval Modal */}
            {showEarlyRetrievalModal && earlyRetrievalData && (
                <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full animate-scaleIn border border-green-200">
                        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold">Early Retrieval Request</h3>
                                <button
                                    onClick={() => setShowEarlyRetrievalModal(false)}
                                    className="text-white hover:text-gray-200 p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-all duration-200"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div className="text-center">
                                <h4 className="font-semibold text-gray-900">Booking ID: {earlyRetrievalData.id}</h4>
                                <p className="text-gray-600">{earlyRetrievalData.farmerName}</p>
                            </div>

                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                <h5 className="font-semibold text-green-800 mb-2">Retrieval Details</h5>
                                <div className="text-sm space-y-1">
                                    <div>Proposed End Date: {earlyRetrievalData.earlyRetrievalRequest.proposedEndDate}</div>
                                    <div>Days Used: {earlyRetrievalData.earlyRetrievalRequest.usedDays}</div>
                                    <div>Unused Days: {earlyRetrievalData.earlyRetrievalRequest.unusedDays}</div>
                                </div>
                            </div>

                            <div className="bg-green-100 rounded-lg p-4 border border-green-300">
                                <h5 className="font-semibold text-green-800 mb-2">Payment Breakdown</h5>
                                <div className="text-sm space-y-1">
                                    <div className="flex justify-between">
                                        <span>Refund to Customer:</span>
                                        <span className="font-medium">Rs. {earlyRetrievalData.earlyRetrievalRequest.refundAmount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Amount to Owner:</span>
                                        <span className="font-medium">Rs. {earlyRetrievalData.earlyRetrievalRequest.ownerAmount}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Reason for rejection (optional)"
                                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    rows="3"
                                />
                                
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => handleEarlyRetrievalApprove(earlyRetrievalData.id)}
                                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                                    >
                                        Approve Retrieval
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (rejectionReason.trim()) {
                                                handleEarlyRetrievalReject(earlyRetrievalData.id, rejectionReason);
                                            } else {
                                                alert('Please provide a reason for rejection');
                                            }
                                        }}
                                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                                    >
                                        Reject Retrieval
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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