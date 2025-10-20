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
        pendingApproval: [], // Phase 1: Awaiting warehouse owner approval
        pendingPayment: [],  // Phase 1: Approved by warehouse owner, awaiting payment
        paid: [],            // Phase 2: Payment completed, funds in escrow
        active: [],          // Storage is currently in use
        completed: []        // Booking has ended
    });
    const [activeTab, setActiveTab] = useState("pendingApproval");
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

                // Categorize bookings by status according to the phases
                const categorizedReservations = {
                    pendingApproval: allBookings.filter(booking => 
                        booking.status === 'SENT' || booking.status === 'SUBMITTED' || booking.status === 'REQUEST_SENT' || 
                        booking.status === 'PENDING_REVIEW' || booking.status === 'AWAITING_APPROVAL'
                    ),
                    pendingPayment: allBookings.filter(booking => 
                        booking.status === 'APPROVED_AWAITING_PAYMENT' || booking.status === 'PAYMENT_REQUIRED' || 
                        booking.status === 'PENDING_PAYMENT'
                    ),
                    paid: allBookings.filter(booking => 
                        booking.status === 'PAID' || booking.status === 'PAYMENT_COMPLETED' || 
                        booking.status === 'APPROVED' || booking.status === 'CONFIRMED' || booking.status === 'PAYMENT_IN_ESCROW'
                    ),
                    active: allBookings.filter(booking => 
                        booking.status === 'ACTIVE' || booking.status === 'IN_PROGRESS' || booking.status === 'ONGOING' ||
                        booking.status === 'STORAGE_IN_USE'
                    ),
                    completed: allBookings.filter(booking => 
                        booking.status === 'COMPLETED' || booking.status === 'FINISHED' || booking.status === 'DONE' ||
                        booking.status === 'RELEASED'
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
                    pendingApproval: [],
                    pendingPayment: [],
                    paid: [],
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
            // Phase 1: Pending Approval
            case 'SENT':
            case 'SUBMITTED':
            case 'REQUEST_SENT':
            case 'PENDING_REVIEW':
            case 'AWAITING_APPROVAL':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            
            // Phase 1: Payment Required
            case 'APPROVED_AWAITING_PAYMENT':
            case 'PAYMENT_REQUIRED':
            case 'PENDING_PAYMENT': 
                return 'bg-orange-100 text-orange-800 border-orange-200';
            
            // Phase 2: Payment Complete
            case 'APPROVED':
            case 'PAID':
            case 'PAYMENT_COMPLETED':
            case 'CONFIRMED':
            case 'PAYMENT_IN_ESCROW': 
                return 'bg-green-100 text-green-800 border-green-200';
            
            // Storage in use
            case 'ACTIVE':
            case 'IN_PROGRESS':
            case 'STORAGE_IN_USE':
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

    const SentRequestCard = ({ request }) => (
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
                    Awaiting Approval
                </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-sm text-gray-500">Sent Date</p>
                    <p className="font-medium">{formatDate(request.requestDate || request.createdAt)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Product Type</p>
                    <p className="font-medium capitalize">{request.productType || 'Not specified'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p className="font-medium">{request.quantity || request.quantityKg}kg</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{request.duration || request.durationDays} days</p>
                </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-purple-600 mr-2" />
                    <div>
                        <p className="text-sm font-medium text-purple-800">Awaiting Warehouse Response</p>
                        <p className="text-xs text-purple-600">Your request has been sent to the warehouse owner for review</p>
                    </div>
                </div>
            </div>
            
            <div className="flex gap-2">
                <button 
                    onClick={() => console.log('Edit request:', request)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                    Edit Request
                </button>
                <button 
                    onClick={() => console.log('Cancel request:', request)}
                    className="flex-1 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                >
                    Cancel Request
                </button>
            </div>
        </div>
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
                    Payment Required
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
                    Payment Complete
                </span>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <div>
                        <p className="text-sm font-medium text-green-800">Payment Complete - Funds in Escrow</p>
                        <p className="text-xs text-green-600">Slot Reserved: {booking.slotNumber || booking.slot?.slotNumber || 'TBD'}</p>
                    </div>
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
                        label="Pending Approval" 
                        isActive={activeTab === "pendingApproval"} 
                        onClick={() => setActiveTab("pendingApproval")}
                        count={reservations.pendingApproval?.length || 0}
                    />
                    <TabButton 
                        label="Payment Required" 
                        isActive={activeTab === "pendingPayment"} 
                        onClick={() => setActiveTab("pendingPayment")}
                        count={reservations.pendingPayment?.length || 0}
                    />
                    <TabButton 
                        label="Paid Bookings" 
                        isActive={activeTab === "paid"} 
                        onClick={() => setActiveTab("paid")}
                        count={reservations.paid?.length || 0}
                    />
                    <TabButton 
                        label="Active Storage" 
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
                    {activeTab === "pendingApproval" && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Approval</h2>
                            <p className="text-sm text-gray-600 mb-4">Requests sent to warehouse owners awaiting their approval</p>
                            {reservations.pendingApproval?.length === 0 ? (
                                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                                    <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No pending requests found</p>
                                    <p className="text-sm text-gray-400 mt-2">Your booking requests to warehouses will appear here</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {reservations.pendingApproval?.map(request => (
                                        <SentRequestCard key={request.id} request={request} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "pendingPayment" && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Required</h2>
                            <p className="text-sm text-gray-600 mb-4">Requests approved by warehouse owners - payment needed to confirm booking</p>
                            {reservations.pendingPayment?.length === 0 ? (
                                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                                    <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No payments pending</p>
                                    <p className="text-sm text-gray-400 mt-2">Approved requests requiring payment will appear here</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {reservations.pendingPayment?.map(request => (
                                        <PaymentPendingCard key={request.id} request={request} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "paid" && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Paid Bookings</h2>
                            <p className="text-sm text-gray-600 mb-4">Payment completed and funds held in escrow</p>
                            {reservations.paid?.length === 0 ? (
                                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                                    <CheckCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No paid bookings found</p>
                                    <p className="text-sm text-gray-400 mt-2">Your paid bookings will appear here</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {reservations.paid?.map(booking => (
                                        <ApprovedCard key={booking.id} booking={booking} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "active" && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Storage</h2>
                            <p className="text-sm text-gray-600 mb-4">Your products are currently in storage at these warehouses</p>
                            {reservations.active?.length === 0 ? (
                                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                                    <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No active storage bookings found</p>
                                    <p className="text-sm text-gray-400 mt-2">Your active storage will appear here</p>
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
                            <p className="text-sm text-gray-600 mb-4">Storage bookings that have been completed</p>
                            {reservations.completed?.length === 0 ? (
                                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                                    <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No completed bookings found</p>
                                    <p className="text-sm text-gray-400 mt-2">Your completed bookings will appear here</p>
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