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
    ChevronDownIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import { useWarehouseContext } from '../../../Contexts/Warehouse/WarehouseContext';
import { useUserContext } from '../../../Contexts/UserContext';
import bookingsAPI from '../../../API/bookings';
import slotsAPI from '../../../API/slots';
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
    const { user } = useUserContext();
    const { warehouses, loadWarehouses } = useWarehouseContext();
    const [bookings, setBookings] = useState([]);
    const [bookingRequests, setBookingRequests] = useState([]);
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
    const [viewMode, setViewMode] = useState('requests'); // 'requests' or 'bookings'

    // Dialog states for approve/reject
    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [showSlotCreationDialog, setShowSlotCreationDialog] = useState(false);
    const [actionBooking, setActionBooking] = useState(null);
    
    // Slot creation form
    const [slotForm, setSlotForm] = useState({
        capacityKg: '',
        productType: '',
        temperature: '',
        notes: ''
    });

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

    const loadBookingRequests = useCallback(async () => {
        if (selectedWarehouse === 'all') return;
        
        setLoading(true);
        try {
            const response = await slotsAPI.getBookingRequests(selectedWarehouse, filterStatus);
            setBookingRequests(response.data || []);
        } catch (error) {
            console.error('Error loading booking requests:', error);
            // Fallback to sample data if API fails
            setBookingRequests([
                {
                    id: "REQ001",
                    farmerId: "F001",
                    farmerName: "Farmer Kumara",
                    farmerPhone: "+94771234567",
                    farmerEmail: "kumara@email.com",
                    produce: "Rice",
                    cropType: "Basmati Rice",
                    quantity: 500,
                    duration: 14,
                    requestDate: "2024-01-15",
                    startDate: "2024-01-20",
                    endDate: "2024-02-03",
                    status: "pending",
                    notes: "Need temperature controlled storage"
                }
            ]);
        } finally {
            setLoading(false);
        }
    }, [selectedWarehouse, filterStatus]);

    useEffect(() => {
        loadWarehouses();
        loadBookings();
        loadBookingRequests();
    }, [loadWarehouses, loadBookings, loadBookingRequests]);

    // Load bookings when filters change
    useEffect(() => {
        loadBookings();
        loadBookingRequests();
    }, [selectedWarehouse, filterStatus, searchTerm, loadBookings, loadBookingRequests]);

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

    // New functions for booking request workflow
    const handleApproveBookingRequest = async (requestId) => {
        if (!slotForm.capacityKg || !slotForm.productType) {
            showNotification('Please fill in slot capacity and product type', 'error');
            return;
        }

        try {
            const slotPayload = {
                slotNumber: `S-${String(Date.now()).slice(-6)}`, // Generate unique slot number
                capacityKg: parseFloat(slotForm.capacityKg),
                productType: slotForm.productType,
                temperature: slotForm.temperature ? parseFloat(slotForm.temperature) : null,
                notes: slotForm.notes
            };

            await slotsAPI.approveBookingRequest(selectedWarehouse, requestId, slotPayload);
            
            // Remove from requests and add to bookings
            setBookingRequests(prev => prev.filter(req => req.id !== requestId));
            
            // Reset form and close dialog
            setSlotForm({ capacityKg: '', productType: '', temperature: '', notes: '' });
            setShowSlotCreationDialog(false);
            setActionBooking(null);
            
            showNotification('Booking request approved and slot created!', 'success');
            
            // Reload bookings to show the new booking
            loadBookings();
        } catch (error) {
            console.error('Error approving booking request:', error);
            showNotification('Failed to approve booking request. Please try again.', 'error');
        }
    };

    const handleRejectBookingRequest = async (requestId, reason) => {
        try {
            await slotsAPI.rejectBookingRequest(selectedWarehouse, requestId, reason);
            
            setBookingRequests(prev => prev.filter(req => req.id !== requestId));
            setRejectionReason('');
            setShowRejectDialog(false);
            setActionBooking(null);
            
            showNotification('Booking request rejected!', 'success');
        } catch (error) {
            console.error('Error rejecting booking request:', error);
            showNotification('Failed to reject booking request. Please try again.', 'error');
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
    const isModalOpen = showDetailsModal || showEarlyRetrievalModal || showApproveDialog || showRejectDialog || showSlotCreationDialog;

    return (
        <div className="p-6 bg-gradient-to-br white min-h-screen">
            <div className={`max-w-7xl mx-auto space-y-6 transition-all duration-300 ${isModalOpen ? 'backdrop-blur-sm' : ''}`}>
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md border border-green-200 p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
                            <p className="text-gray-600 mt-1">Manage booking requests and approved bookings</p>
                            
                            {/* View Mode Toggle */}
                            <div className="flex mt-4 space-x-2">
                                <button
                                    onClick={() => setViewMode('requests')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        viewMode === 'requests' 
                                            ? 'bg-green-600 text-white shadow-md' 
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    📋 Booking Requests ({bookingRequests.filter(req => req.status === 'pending').length})
                                </button>
                                <button
                                    onClick={() => setViewMode('bookings')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        viewMode === 'bookings' 
                                            ? 'bg-green-600 text-white shadow-md' 
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    ✅ Approved Bookings ({filteredBookings.filter(b => b.status === 'approved').length})
                                </button>
                            </div>
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
                    {viewMode === 'requests' ? (
                        <>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-200">
                                <div className="flex items-center">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <ClockIcon className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {bookingRequests.filter(r => r.status === 'pending').length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200">
                                <div className="flex items-center">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <CheckIcon className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-500">Approved Today</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {bookingRequests.filter(r => r.status === 'approved' && 
                                                new Date(r.approvedDate || '').toDateString() === new Date().toDateString()).length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-red-200">
                                <div className="flex items-center">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <XMarkIcon className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-500">Rejected</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {bookingRequests.filter(r => r.status === 'rejected').length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-200">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <PlusIcon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-500">Slots Created</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {bookings.filter(b => new Date(b.createdDate || '').toDateString() === new Date().toDateString()).length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200">
                                <div className="flex items-center">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <CheckIcon className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-500">Active Bookings</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {bookings.filter(b => b.status === 'approved' || b.status === 'occupied').length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-200">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <BuildingStorefrontIcon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-500">Occupied Slots</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {bookings.filter(b => b.status === 'occupied').length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-200">
                                <div className="flex items-center">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <ArrowPathIcon className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-500">Early Retrieval</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {bookings.filter(b => b.hasEarlyRetrieval).length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <CalendarIcon className="h-6 w-6 text-gray-600" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-500">Completed</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {bookings.filter(b => b.status === 'completed').length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Main Content - Conditional based on view mode */}
                {viewMode === 'requests' ? (
                    /* Booking Requests Table */
                    <div className="bg-white rounded-lg shadow-md border border-orange-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-6 py-4 border-b border-orange-200">
                            <h3 className="text-lg font-semibold text-orange-800">📋 Pending Booking Requests</h3>
                            <p className="text-sm text-orange-600 mt-1">Review and approve/reject customer booking requests</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-orange-100 to-yellow-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">Request ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">Produce</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">Duration</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">Request Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-orange-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                                Loading booking requests...
                                            </td>
                                        </tr>
                                    ) : bookingRequests.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-12 text-center">
                                                <div className="text-gray-500">
                                                    <div className="text-4xl mb-2">📋</div>
                                                    <p className="text-lg font-medium">No booking requests</p>
                                                    <p className="text-sm">Pending requests will appear here</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        bookingRequests.filter(req => req.status === 'pending').map((request) => (
                                            <tr key={request.id} className="hover:bg-orange-50 transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="font-medium text-gray-900">{request.id}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{request.farmerName}</div>
                                                    <div className="text-sm text-gray-500">{request.farmerPhone}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{request.produce}</div>
                                                    <div className="text-sm text-gray-500">{request.cropType}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {request.quantity} kg
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {request.duration} days
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(request.requestDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                        Pending Review
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setActionBooking(request);
                                                            setShowSlotCreationDialog(true);
                                                        }}
                                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
                                                        title="Approve & Create Slot"
                                                    >
                                                        ✅ Approve
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setActionBooking(request);
                                                            setShowRejectDialog(true);
                                                        }}
                                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
                                                        title="Reject Request"
                                                    >
                                                        ❌ Reject
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedBooking(request);
                                                            setShowDetailsModal(true);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-all duration-200"
                                                        title="View Details"
                                                    >
                                                        <EyeIcon className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* Approved Bookings Table */
                    <div className="bg-white rounded-lg shadow-md border border-green-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b border-green-200">
                            <h3 className="text-lg font-semibold text-green-800">✅ Approved Bookings & Active Slots</h3>
                            <p className="text-sm text-green-600 mt-1">Manage approved bookings and active storage slots</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-green-100 to-green-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Booking ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Customer</th>
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
                                                Loading approved bookings...
                                            </td>
                                        </tr>
                                    ) : filteredBookings.filter(b => b.status !== 'pending').length === 0 ? (
                                        <tr>
                                            <td colSpan="9" className="px-6 py-12 text-center">
                                                <div className="text-gray-500">
                                                    <div className="text-4xl mb-2">✅</div>
                                                    <p className="text-lg font-medium">No approved bookings</p>
                                                    <p className="text-sm">Approved requests will appear here</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredBookings.filter(b => b.status !== 'pending').map((booking) => (
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
                )}
            </div>

            {/* Slot Creation Dialog for Booking Request Approval */}
            {showSlotCreationDialog && actionBooking && (
                <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full border border-green-200 animate-scaleIn">
                        <h3 className="text-xl font-semibold mb-4 text-green-800">✅ Approve Request & Create Slot</h3>
                        <p className="text-gray-600 mb-4">
                            Create a slot for booking request <span className="font-bold">{actionBooking.id}</span> from {actionBooking.farmerName}
                        </p>
                        
                        <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
                            <div><span className="font-medium">Requested:</span> {actionBooking.quantity} kg of {actionBooking.produce}</div>
                            <div><span className="font-medium">Duration:</span> {actionBooking.duration} days</div>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Slot Capacity (kg) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={slotForm.capacityKg}
                                    onChange={(e) => setSlotForm(prev => ({ ...prev, capacityKg: e.target.value }))}
                                    placeholder="Enter slot capacity"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                                    min={actionBooking.quantity}
                                />
                                <p className="text-xs text-gray-500 mt-1">Minimum: {actionBooking.quantity} kg (requested amount)</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={slotForm.productType}
                                    onChange={(e) => setSlotForm(prev => ({ ...prev, productType: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Select product type</option>
                                    <option value="Grains">Grains</option>
                                    <option value="Fruits">Fruits</option>
                                    <option value="Vegetables">Vegetables</option>
                                    <option value="Dairy">Dairy Products</option>
                                    <option value="Meat">Meat Products</option>
                                    <option value="General">General Storage</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
                                <input
                                    type="number"
                                    value={slotForm.temperature}
                                    onChange={(e) => setSlotForm(prev => ({ ...prev, temperature: e.target.value }))}
                                    placeholder="Optional temperature requirement"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea
                                    value={slotForm.notes}
                                    onChange={(e) => setSlotForm(prev => ({ ...prev, notes: e.target.value }))}
                                    placeholder="Optional notes about the slot"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                                    rows="2"
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowSlotCreationDialog(false);
                                    setActionBooking(null);
                                    setSlotForm({ capacityKg: '', productType: '', temperature: '', notes: '' });
                                }}
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleApproveBookingRequest(actionBooking.id)}
                                disabled={!slotForm.capacityKg || !slotForm.productType}
                                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Create Slot & Approve
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border border-red-200 animate-scaleIn">
                        <h3 className="text-lg font-semibold mb-4 text-red-800">❌ Reject {viewMode === 'requests' ? 'Request' : 'Booking'}</h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to reject {viewMode === 'requests' ? 'request' : 'booking'} <span className="font-bold">{actionBooking.id}</span>?
                        </p>
                        
                        <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
                            <div><span className="font-medium">Customer:</span> {actionBooking.farmerName}</div>
                            <div><span className="font-medium">Produce:</span> {actionBooking.produce} ({actionBooking.quantity} kg)</div>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reason for rejection <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Please provide a reason for rejection..."
                                value={rejectionReason}
                                onChange={e => setRejectionReason(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                rows="3"
                            />
                        </div>
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
                                        if (viewMode === 'requests') {
                                            handleRejectBookingRequest(actionBooking.id, rejectionReason);
                                        } else {
                                            handleRejectBooking(actionBooking.id, rejectionReason);
                                            setShowRejectDialog(false);
                                            setActionBooking(null);
                                            setRejectionReason('');
                                        }
                                    } else {
                                        alert('Please provide a reason for rejection');
                                    }
                                }}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium"
                            >
                                Reject {viewMode === 'requests' ? 'Request' : 'Booking'}
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