import React, { useState, useEffect } from "react";
import { 
    CreditCardIcon, 
    CheckCircleIcon, 
    ClockIcon, 
    MapPinIcon,
    DocumentTextIcon
} from "@heroicons/react/24/outline";
import axios from "axios";

export default function ReservedStorage() {
    const [reservations, setReservations] = useState({
        paymentPending: [],
        approved: [],
        active: [],
        completed: []
    });
    const [activeTab, setActiveTab] = useState("paymentPending");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // API base URL - adjust according to your backend configuration
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

    // Fetch reservations from backend
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log('Fetching reservations from:', API_BASE_URL);

                // Get authentication token if using JWT
                const token = localStorage.getItem('authToken');
                const headers = { 
                    'X-User-Id': '1', // Replace with actual user ID from auth context
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` })
                };

                console.log('Request headers:', headers);

                // Try fetching user's bookings - first try the bookings endpoint
                let bookingsResponse;
                try {
                    bookingsResponse = await axios.get(`${API_BASE_URL}/bookings`, { headers });
                    console.log('Bookings response:', bookingsResponse.data);
                } catch (bookingsError) {
                    console.warn('Bookings endpoint failed, trying warehouse service directly:', bookingsError.message);
                    // Fallback: try warehouse service directly
                    bookingsResponse = await axios.get(`http://localhost:8090/api/bookings`, { headers });
                    console.log('Warehouse service response:', bookingsResponse.data);
                }

                const allBookings = bookingsResponse.data || [];
                console.log('All bookings found:', allBookings.length);

                // Categorize bookings by status
                const categorizedReservations = {
                    paymentPending: allBookings.filter(booking => 
                        booking.status === 'PENDING' || booking.status === 'PENDING_APPROVAL' || booking.status === 'APPROVED_AWAITING_PAYMENT'
                    ),
                    approved: allBookings.filter(booking => 
                        booking.status === 'PAID' || booking.status === 'APPROVED' || booking.status === 'CONFIRMED'
                    ),
                    active: allBookings.filter(booking => 
                        booking.status === 'ACTIVE' || booking.status === 'IN_PROGRESS' || booking.status === 'ONGOING'
                    ),
                    completed: allBookings.filter(booking => 
                        booking.status === 'COMPLETED' || booking.status === 'FINISHED' || booking.status === 'DONE'
                    )
                };

                console.log('Categorized reservations:', categorizedReservations);
                setReservations(categorizedReservations);
            } catch (err) {
                console.error('Error fetching reservations:', err);
                console.error('Error details:', {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status
                });
                setError(`Failed to load reservations: ${err.response?.data?.message || err.message}. Please try again later.`);
                // Set empty data on error
                setReservations({
                    paymentPending: [],
                    approved: [],
                    active: [],
                    completed: []
                });
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [API_BASE_URL]);

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'PENDING':
            case 'PENDING_APPROVAL':
            case 'APPROVED_AWAITING_PAYMENT': 
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'APPROVED':
            case 'PAID':
            case 'CONFIRMED': 
                return 'bg-green-100 text-green-800 border-green-200';
            case 'ACTIVE':
            case 'IN_PROGRESS':
            case 'ONGOING': 
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'COMPLETED':
            case 'FINISHED':
            case 'DONE': 
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default: 
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const TabButton = ({ label, isActive, onClick, count }) => (
        <button
            id={`tab-${label.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={onClick}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                isActive 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
            {label} {count > 0 && <span className="ml-1">({count})</span>}
        </button>
    );

    const PaymentPendingCard = ({ request }) => (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {request.warehouseName || `Warehouse ID: ${request.warehouseId || 'Unknown'}`}
                    </h3>
                    <div className="flex items-center text-gray-600 mt-1">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">{request.city || request.warehouseLocation || 'Location TBD'}</span>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                    Payment Pending
                </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-sm text-gray-500">Request Date</p>
                    <p className="font-medium">{formatDate(request.requestDate || request.createdAt)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Storage Period</p>
                    <p className="font-medium">{request.durationDays || request.duration || 'N/A'} days</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p className="font-medium">{request.quantityKg || request.quantity || 0} kg</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Product Type</p>
                    <p className="font-medium">{request.productType || 'Not specified'}</p>
                </div>
            </div>
            
            <div className="flex gap-2">
                <button 
                    id={`pay-now-${request.id || 'unknown'}`}
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                    <CreditCardIcon className="h-4 w-4 inline mr-2" />
                    Pay Now
                </button>
                <button 
                    id={`view-details-${request.id || 'unknown'}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    View Details
                </button>
            </div>
        </div>
    );

    const ApprovedCard = ({ booking }) => (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{booking.warehouseName || 'Warehouse'}</h3>
                    <div className="flex items-center text-gray-600 mt-1">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">{booking.city || booking.warehouseLocation || 'N/A'}</span>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                    Approved
                </span>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span className="font-medium text-green-800">
                        Slot Reserved: {booking.slotNumber || booking.slot?.slotNumber || 'TBD'}
                    </span>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium">{formatDate(booking.startDate || booking.startTime)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{booking.duration || 'N/A'} days</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p className="font-medium">{booking.quantity || 0} kg</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Total Paid</p>
                    <p className="font-bold text-green-600">{formatCurrency(booking.totalAmount || booking.totalCost || 0)}</p>
                </div>
            </div>
            
            <div className="flex gap-2">
                <button 
                    id={`download-receipt-${booking.id || 'unknown'}`}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                    <DocumentTextIcon className="h-4 w-4 inline mr-2" />
                    Download Receipt
                </button>
                <button 
                    id={`contact-owner-${booking.id || 'unknown'}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Contact Owner
                </button>
            </div>
        </div>
    );

    const ActiveBookingCard = ({ booking }) => (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{booking.warehouseName}</h3>
                    <div className="flex items-center text-gray-600 mt-1">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">{booking.city}</span>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                    Active
                </span>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="font-medium text-blue-800">
                            {booking.daysRemaining} days remaining
                        </span>
                    </div>
                    <span className="text-sm text-blue-600">
                        {booking.occupancyPercentage}% occupied
                    </span>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-sm text-gray-500">Slot Numbers</p>
                    <p className="font-medium">{booking.slotNumbers?.join(', ')}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="font-medium">{formatDate(booking.endDate)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Storage Type</p>
                    <p className="font-medium">{booking.storageType?.replace('_', ' ')}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Last Inspection</p>
                    <p className="font-medium">{formatDate(booking.lastInspection)}</p>
                </div>
            </div>
            
            <div className="flex gap-2">
                <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors">
                    View Live Status
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    Extend Booking
                </button>
            </div>
        </div>
    );

    const CompletedBookingCard = ({ booking }) => (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{booking.warehouseName}</h3>
                    <div className="flex items-center text-gray-600 mt-1">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">{booking.city}</span>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                    Completed
                </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-sm text-gray-500">Completed Date</p>
                    <p className="font-medium">{formatDate(booking.completedDate)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{booking.duration} days</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Total Cost</p>
                    <p className="font-bold text-green-600">{formatCurrency(booking.totalAmount)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Rating</p>
                    <p className="font-medium">⭐ {booking.rating}/5</p>
                </div>
            </div>
            
            {booking.feedback && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700 italic">"{booking.feedback}"</p>
                </div>
            )}
            
            <div className="flex gap-2">
                <button className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors">
                    Download Invoice
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    Book Again
                </button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading reservations...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                    <button 
                        id="retry-button"
                        onClick={() => window.location.reload()} 
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Reserved Storage</h1>
                    <p className="text-gray-600">Manage your warehouse reservations and bookings</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                    <TabButton 
                        label="Payment Pending" 
                        isActive={activeTab === "paymentPending"} 
                        onClick={() => setActiveTab("paymentPending")}
                        count={reservations.paymentPending?.length || 0}
                    />
                    <TabButton 
                        label="Approved Requests" 
                        isActive={activeTab === "approved"} 
                        onClick={() => setActiveTab("approved")}
                        count={reservations.approved?.length || 0}
                    />
                    <TabButton 
                        label="Active Bookings" 
                        isActive={activeTab === "active"} 
                        onClick={() => setActiveTab("active")}
                        count={reservations.active?.length || 0}
                    />
                    <TabButton 
                        label="Completed Bookings" 
                        isActive={activeTab === "completed"} 
                        onClick={() => setActiveTab("completed")}
                        count={reservations.completed?.length || 0}
                    />
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {activeTab === "paymentPending" && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Pending</h2>
                            {reservations.paymentPending?.length === 0 ? (
                                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                                    <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No pending payments found</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {reservations.paymentPending?.map(request => (
                                        <PaymentPendingCard key={request.id} request={request} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "approved" && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Approved Requests</h2>
                            {reservations.approved?.length === 0 ? (
                                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                                    <CheckCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No approved requests found</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {reservations.approved?.map(booking => (
                                        <ApprovedCard key={booking.id} booking={booking} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "active" && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Bookings</h2>
                            {reservations.active?.length === 0 ? (
                                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                                    <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No active bookings found</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {reservations.active?.map(booking => (
                                        <ActiveBookingCard key={booking.id} booking={booking} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "completed" && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Completed Bookings</h2>
                            {reservations.completed?.length === 0 ? (
                                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                                    <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No completed bookings found</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {reservations.completed?.map(booking => (
                                        <CompletedBookingCard key={booking.id} booking={booking} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}