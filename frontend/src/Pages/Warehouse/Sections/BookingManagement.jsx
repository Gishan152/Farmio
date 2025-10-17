import { useState, useEffect, useCallback } from 'react';
import { 
    EyeIcon, 
    CheckIcon, 
    XMarkIcon, 
    ClockIcon,
    CalendarIcon,
    UserIcon,
    PhoneIcon,
    EnvelopeIcon,
    BuildingStorefrontIcon,
    FunnelIcon,
    ArrowPathIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useWarehouseContext } from '../../../Contexts/Warehouse/WarehouseContext';
import bookingsAPI from '../../../API/bookings';
import { formatSlotId } from '../../../Utils/slotUtils';

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
        warehouseName: "Colombo Cold Storage A",
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
        warehouseName: "Kandy Dry Storage Facility",
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
        warehouseName: "Colombo Cold Storage A",
        status: "rejected",
        requestDate: "2024-01-13",
        rejectionReason: "Insufficient cold storage capacity for requested quantity",
        pricePerKg: 0.35,
        totalAmount: 700
    }
];

export default function BookingManagement() {
    const { warehouses, loadWarehouses } = useWarehouseContext();
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEarlyRetrievalModal, setShowEarlyRetrievalModal] = useState(false);
    const [earlyRetrievalData, setEarlyRetrievalData] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedWarehouse, setSelectedWarehouse] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    // Dialog states for approve/reject
    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [actionBooking, setActionBooking] = useState(null);

    // Show notification helper
    const showNotification = useCallback((message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    }, []);

    const loadBookings = useCallback(async () => {
        setLoading(true);
        try {
            const response = await bookingsAPI.getBookings(
                selectedWarehouse !== 'all' ? selectedWarehouse : null,
                filterStatus,
                searchTerm
            );
            setBookings(response.data || []);
        } catch (error) {
            console.error('Error loading bookings:', error);
            // Fallback to sample data if API fails
            setBookings(sampleBookings);
            showNotification('Using sample data - API connection failed', 'warning');
        } finally {
            setLoading(false);
        }
    }, [selectedWarehouse, filterStatus, searchTerm, showNotification]);

    useEffect(() => {
        loadWarehouses();
        loadBookings();
    }, [loadWarehouses, loadBookings]);

    // Load bookings when filters change
    useEffect(() => {
        loadBookings();
    }, [selectedWarehouse, filterStatus, searchTerm, loadBookings]);

    const handleApproveBooking = async (bookingId) => {
        try {
            await bookingsAPI.approveBooking(bookingId);
            setBookings(prev => prev.map(booking => 
                booking.id === bookingId 
                    ? { ...booking, status: 'approved' }
                    : booking
            ));
            showNotification('Booking approved successfully!', 'success');
        } catch (error) {
            console.error('Error approving booking:', error);
            showNotification('Failed to approve booking. Please try again.', 'error');
        }
    };

    const handleRejectBooking = async (bookingId, reason) => {
        try {
            await bookingsAPI.rejectBooking(bookingId, { reason });
            setBookings(prev => prev.map(booking => 
                booking.id === bookingId 
                    ? { ...booking, status: 'rejected', rejectionReason: reason }
                    : booking
            ));
            setRejectionReason('');
            showNotification('Booking rejected successfully!', 'success');
        } catch (error) {
            console.error('Error rejecting booking:', error);
            showNotification('Failed to reject booking. Please try again.', 'error');
        }
    };

    const handleEarlyRetrievalApprove = async (bookingId) => {
        try {
            await bookingsAPI.handleEarlyRetrieval(bookingId, 'approve');
            setBookings(prev => prev.map(booking => 
                booking.id === bookingId 
                    ? { ...booking, hasEarlyRetrieval: false, status: 'completed' }
                    : booking
            ));
            setShowEarlyRetrievalModal(false);
            setEarlyRetrievalData(null);
            showNotification('Early retrieval approved successfully!', 'success');
        } catch (error) {
            console.error('Error approving early retrieval:', error);
            showNotification('Failed to approve early retrieval. Please try again.', 'error');
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
        // Status filter
        let statusMatch = true;
        if (filterStatus === 'early-retrieval') {
            statusMatch = booking.hasEarlyRetrieval;
        } else if (filterStatus !== 'all') {
            statusMatch = booking.status === filterStatus;
        }

        // Warehouse filter
        let warehouseMatch = true;
        if (selectedWarehouse !== 'all') {
            warehouseMatch = booking.warehouseId === selectedWarehouse || booking.warehouseId?.toString() === selectedWarehouse;
        }

        // Search filter
        let searchMatch = true;
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            searchMatch = 
                booking.farmerName?.toLowerCase().includes(searchLower) ||
                booking.id?.toLowerCase().includes(searchLower) ||
                booking.produce?.toLowerCase().includes(searchLower) ||
                booking.cropType?.toLowerCase().includes(searchLower) ||
                booking.warehouseName?.toLowerCase().includes(searchLower);
        }

        return statusMatch && warehouseMatch && searchMatch;
    });

    // Check if any modal is open
    const isModalOpen = showDetailsModal || showEarlyRetrievalModal || showApproveDialog || showRejectDialog;

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
                            {/* Warehouse Filter */}
                            <div className="relative">
                                <select
                                    value={selectedWarehouse}
                                    onChange={(e) => setSelectedWarehouse(e.target.value)}
                                    className="px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white pr-8 appearance-none"
                                >
                                    <option value="all">All Warehouses</option>
                                    {warehouses.map(warehouse => (
                                        <option key={warehouse.id} value={warehouse.id}>
                                            {warehouse.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDownIcon className="h-4 w-4 absolute right-2 top-3 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Status Filter */}
                            <div className="relative">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white pr-8 appearance-none"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="completed">Completed</option>
                                    <option value="early-retrieval">Early Retrieval</option>
                                </select>
                                <ChevronDownIcon className="h-4 w-4 absolute right-2 top-3 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Refresh Button */}
                            <button
                                onClick={loadBookings}
                                disabled={loading}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                <span>Refresh</span>
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-4">
                        <div className="relative max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FunnelIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by farmer name, booking ID, or produce..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <ClockIcon className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Pending</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {bookings.filter(b => b.status === 'pending').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Approved</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {bookings.filter(b => b.status === 'approved').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <XMarkIcon className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Rejected</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {bookings.filter(b => b.status === 'rejected').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <ArrowPathIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Early Retrieval</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {bookings.filter(b => b.hasEarlyRetrieval).length}
                                </p>
                            </div>
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Warehouse</th>
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
                                        <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                                            Loading bookings...
                                        </td>
                                    </tr>
                                ) : filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
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
                                                <div className="flex items-center">
                                                    <BuildingStorefrontIcon className="h-4 w-4 text-gray-400 mr-2" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{booking.warehouseName || 'Unknown Warehouse'}</div>
                                                        <div className="text-xs text-gray-500">Slot {formatSlotId(booking.slotId)}</div>
                                                    </div>
                                                </div>
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
                                                    {formatSlotId(booking.slotId)}
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
                                                            onClick={() => {
                                                                setActionBooking(booking);
                                                                setShowApproveDialog(true);
                                                            }}
                                                            className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50 transition-all duration-200"
                                                            title="Approve"
                                                        >
                                                            <CheckIcon className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setActionBooking(booking);
                                                                setShowRejectDialog(true);
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

            {/* Approve Dialog */}
            {showApproveDialog && actionBooking && (
                <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full border border-green-200 animate-scaleIn">
                        <h3 className="text-lg font-semibold mb-4">Approve Booking</h3>
                        <p>Are you sure you want to approve booking <span className="font-bold">{actionBooking.id}</span>?</p>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowApproveDialog(false);
                                    setActionBooking(null);
                                }}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleApproveBooking(actionBooking.id);
                                    setShowApproveDialog(false);
                                    setActionBooking(null);
                                }}
                                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                            >
                                Accept
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showRejectDialog && actionBooking && (
                <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full border border-green-200 animate-scaleIn">
                        <h3 className="text-lg font-semibold mb-4">Reject Booking</h3>
                        <p>Are you sure you want to reject booking <span className="font-bold">{actionBooking.id}</span>?</p>
                        <input
                            type="text"
                            placeholder="Reason for rejection"
                            value={rejectionReason}
                            onChange={e => setRejectionReason(e.target.value)}
                            className="w-full mt-4 px-3 py-2 border rounded"
                        />
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowRejectDialog(false);
                                    setActionBooking(null);
                                    setRejectionReason('');
                                }}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (rejectionReason.trim()) {
                                        handleRejectBooking(actionBooking.id, rejectionReason);
                                        setShowRejectDialog(false);
                                        setActionBooking(null);
                                        setRejectionReason('');
                                    } else {
                                        alert('Please provide a reason for rejection');
                                    }
                                }}
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                                    <h4 className="font-semibold text-green-800">Produce Details</h4>
                                    <div className="space-y-2 text-sm">
                                        <div><span className="font-medium">Crop Type:</span> {selectedBooking.cropType}</div>
                                        <div><span className="font-medium">Category:</span> {selectedBooking.produce}</div>
                                        <div><span className="font-medium">Quantity:</span> {selectedBooking.quantity} kg</div>
                                        <div><span className="font-medium">Slot:</span> {formatSlotId(selectedBooking.slotId)}</div>
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

            <style>{`
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

            {/* Custom Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 max-w-md w-full animate-fadeIn`}>
                    <div className={`rounded-lg shadow-lg p-4 flex items-center space-x-3 ${
                        notification.type === 'success' 
                            ? 'bg-green-500 text-white' 
                            : notification.type === 'error'
                            ? 'bg-red-500 text-white'
                            : notification.type === 'warning'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-blue-500 text-white'
                    }`}>
                        <div className="flex-shrink-0">
                            {notification.type === 'success' && (
                                <CheckIcon className="h-5 w-5" />
                            )}
                            {notification.type === 'error' && (
                                <XMarkIcon className="h-5 w-5" />
                            )}
                            {notification.type === 'warning' && (
                                <ClockIcon className="h-5 w-5" />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium">{notification.message}</p>
                        </div>
                        <button
                            onClick={() => setNotification(null)}
                            className="flex-shrink-0 text-white hover:text-gray-200 transition-colors"
                        >
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}