import React, { useState, useEffect } from 'react';
import { 
    MagnifyingGlassIcon,
    FunnelIcon,
    DocumentArrowDownIcon,
    XMarkIcon,
    BanknotesIcon,
    ReceiptRefundIcon,
    CurrencyDollarIcon,
    PhoneIcon,
    EnvelopeIcon,
    CalendarIcon,
    ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { usePayment } from '../../../Contexts/Warehouse/PaymentContext';
import PaymentTable from '../../../Components/Warehouse/PaymentTable';

export default function PaymentManagement() {
    const { payments, loading, loadPayments, releasePayment, processRefund, exportPayments } = usePayment();
    
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showReleaseModal, setShowReleaseModal] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    
    const [filters, setFilters] = useState({
        status: 'all',
        warehouseId: 'all',
        startDate: '',
        endDate: '',
        search: ''
    });

    const [refundData, setRefundData] = useState({
        reason: '',
        refundAmount: 0,
        ownerAmount: 0
    });

    // Only reload when filters change, not on every render
    useEffect(() => {
        // Create a stable filter object to avoid infinite loops
        const filterParams = {
            status: filters.status,
            warehouseId: filters.warehouseId,
            startDate: filters.startDate,
            endDate: filters.endDate
        };
        
        loadPayments(filterParams);
    }, [filters.status, filters.warehouseId, filters.startDate, filters.endDate, loadPayments]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleViewDetails = (payment) => {
        setSelectedPayment(payment);
        setShowDetailsModal(true);
    };

    const handleReleasePayment = (payment) => {
        setSelectedPayment(payment);
        setShowReleaseModal(true);
    };

    const confirmReleasePayment = async () => {
        try {
            await releasePayment(selectedPayment.id);
            setShowReleaseModal(false);
            setSelectedPayment(null);
        } catch (error) {
            console.error('Error releasing payment:', error);
        }
    };

    const handleProcessRefund = (payment) => {
        setSelectedPayment(payment);
        if (payment.isEarlyRetrieval && payment.earlyRetrievalDetails) {
            setRefundData({
                reason: 'Early retrieval request',
                refundAmount: payment.earlyRetrievalDetails.refundAmount,
                ownerAmount: payment.earlyRetrievalDetails.ownerAmount
            });
        }
        setShowRefundModal(true);
    };

    const confirmProcessRefund = async () => {
        try {
            await processRefund(selectedPayment.id, refundData);
            setShowRefundModal(false);
            setSelectedPayment(null);
            setRefundData({ reason: '', refundAmount: 0, ownerAmount: 0 });
        } catch (error) {
            console.error('Error processing refund:', error);
        }
    };

    const handleExport = async (format) => {
        try {
            await exportPayments(format, filters);
        } catch (error) {
            console.error('Error exporting payments:', error);
        }
    };

    const openPayHereReceipt = (receiptId) => {
        const receiptUrl = `https://sandbox.payhere.lk/receipt/${receiptId}`;
        window.open(receiptUrl, '_blank');
    };

    // Apply search filter on the frontend to avoid API calls on every keystroke
    const filteredPayments = payments.filter(payment => {
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            return (
                payment.bookingId.toLowerCase().includes(searchTerm) ||
                payment.farmerName?.toLowerCase().includes(searchTerm) ||
                payment.buyerName?.toLowerCase().includes(searchTerm) ||
                payment.produce.toLowerCase().includes(searchTerm)
            );
        }
        return true;
    });

    const stats = {
        totalRevenue: payments.reduce((sum, p) => sum + (p.totalAmount - p.refundAmount), 0),
        escrowHeld: payments.filter(p => p.escrowStatus === 'held').reduce((sum, p) => sum + p.totalAmount, 0),
        refundsProcessed: payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.refundAmount, 0),
        settledPayments: payments.filter(p => p.status === 'settled').length
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-4 p-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
                            <p className="text-gray-600 mt-1 text-sm">View payment history, detailed breakdowns, and escrow status</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm"
                            >
                                <FunnelIcon className="h-4 w-4 mr-2" />
                                Filters
                            </button>
                            <button
                                onClick={() => handleExport('csv')}
                                className="flex items-center bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
                            >
                                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                                Export
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center">
                            <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                            <div className="ml-3">
                                <p className="text-xs font-medium text-gray-500">Total Revenue</p>
                                <p className="text-lg font-bold text-gray-900">Rs. {stats.totalRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center">
                            <BanknotesIcon className="h-6 w-6 text-yellow-600" />
                            <div className="ml-3">
                                <p className="text-xs font-medium text-gray-500">Escrow Held</p>
                                <p className="text-lg font-bold text-gray-900">Rs. {stats.escrowHeld.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center">
                            <ReceiptRefundIcon className="h-6 w-6 text-blue-600" />
                            <div className="ml-3">
                                <p className="text-xs font-medium text-gray-500">Refunds Processed</p>
                                <p className="text-lg font-bold text-gray-900">Rs. {stats.refundsProcessed.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center">
                            <CalendarIcon className="h-6 w-6 text-purple-600" />
                            <div className="ml-3">
                                <p className="text-xs font-medium text-gray-500">Settled Payments</p>
                                <p className="text-lg font-bold text-gray-900">{stats.settledPayments}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="settled">Settled</option>
                                    <option value="held">Held</option>
                                    <option value="refunded">Refunded</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={filters.startDate}
                                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    value={filters.endDate}
                                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
                                <div className="relative">
                                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Search by booking ID, customer, or produce..."
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        className="w-full pl-8 pr-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
                    </div>
                    
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                            <p className="mt-2 text-gray-600 text-sm">Loading payments...</p>
                        </div>
                    ) : (
                        <div className="p-4">
                            <PaymentTable
                                payments={filteredPayments}
                                onViewDetails={handleViewDetails}
                                onReleasePayment={handleReleasePayment}
                                onProcessRefund={handleProcessRefund}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* All modals remain the same */}
            {/* Payment Details Modal */}
            {showDetailsModal && selectedPayment && (
                <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
                        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold">Payment Details - {selectedPayment.bookingId}</h3>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="text-white hover:text-gray-200 p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-all duration-200"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Customer Information */}
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium">Name:</span> {selectedPayment.farmerName || selectedPayment.buyerName}
                                    </div>
                                    <div className="flex items-center">
                                        <PhoneIcon className="h-4 w-4 text-gray-500 mr-2" />
                                        Contact Info Available
                                    </div>
                                </div>
                            </div>

                            {/* Payment Breakdown */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900">Booking Details</h4>
                                    <div className="space-y-2 text-sm">
                                        <div><span className="font-medium">Produce:</span> {selectedPayment.produce}</div>
                                        <div><span className="font-medium">Quantity:</span> {selectedPayment.quantity} kg</div>
                                        <div><span className="font-medium">Duration:</span> {selectedPayment.duration} days</div>
                                        <div><span className="font-medium">Payment Date:</span> {selectedPayment.paymentDate}</div>
                                        {selectedPayment.releaseDate && (
                                            <div><span className="font-medium">Release Date:</span> {selectedPayment.releaseDate}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900">Cost Breakdown</h4>
                                    <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                                        <div className="flex justify-between">
                                            <span>Base Cost ({selectedPayment.duration} days):</span>
                                            <span>Rs. {selectedPayment.baseCost.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>3-Day Buffer:</span>
                                            <span>Rs. {selectedPayment.bufferCost.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Base Fee (10%):</span>
                                            <span>Rs. {selectedPayment.baseFee.toLocaleString()}</span>
                                        </div>
                                        <hr className="border-gray-300" />
                                        <div className="flex justify-between font-semibold">
                                            <span>Total Paid:</span>
                                            <span>Rs. {selectedPayment.totalAmount.toLocaleString()}</span>
                                        </div>
                                        {selectedPayment.refundAmount > 0 && (
                                            <div className="flex justify-between text-blue-600">
                                                <span>Refunded:</span>
                                                <span>Rs. {selectedPayment.refundAmount.toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Early Retrieval Details */}
                            {selectedPayment.isEarlyRetrieval && selectedPayment.earlyRetrievalDetails && (
                                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                                    <h4 className="font-semibold text-gray-900 mb-3">Early Retrieval Details</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>Days Used: {selectedPayment.earlyRetrievalDetails.usedDays}</div>
                                        <div>Unused Days: {selectedPayment.earlyRetrievalDetails.unusedDays}</div>
                                        <div>Refund Amount: Rs. {selectedPayment.earlyRetrievalDetails.refundAmount.toLocaleString()}</div>
                                        <div>Owner Amount: Rs. {selectedPayment.earlyRetrievalDetails.ownerAmount.toLocaleString()}</div>
                                    </div>
                                </div>
                            )}

                            {/* PayHere Receipt */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Payment Receipt</h4>
                                <div className="flex items-center justify-between">
                                    <div className="text-sm">
                                        <span className="font-medium">PayHere Receipt ID:</span> {selectedPayment.payHereReceiptId}
                                    </div>
                                    <button
                                        onClick={() => openPayHereReceipt(selectedPayment.payHereReceiptId)}
                                        className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
                                        View Receipt
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-4">
                                {selectedPayment.escrowStatus === 'held' && selectedPayment.status !== 'refunded' && (
                                    <button
                                        onClick={() => {
                                            setShowDetailsModal(false);
                                            handleReleasePayment(selectedPayment);
                                        }}
                                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
                                    >
                                        Release Payment
                                    </button>
                                )}
                                {selectedPayment.isEarlyRetrieval && selectedPayment.status !== 'refunded' && (
                                    <button
                                        onClick={() => {
                                            setShowDetailsModal(false);
                                            handleProcessRefund(selectedPayment);
                                        }}
                                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Process Refund
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Release Payment Modal */}
            {showReleaseModal && selectedPayment && (
                <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-scaleIn">
                        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl">
                            <h3 className="text-xl font-semibold">Release Payment</h3>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <p className="text-gray-600">
                                Are you sure you want to release the payment for booking <strong>{selectedPayment.bookingId}</strong>?
                            </p>
                            
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm space-y-1">
                                    <div className="flex justify-between">
                                        <span>Amount to Release:</span>
                                        <span className="font-medium">Rs. {selectedPayment.totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Customer:</span>
                                        <span>{selectedPayment.farmerName || selectedPayment.buyerName}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowReleaseModal(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmReleasePayment}
                                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
                                >
                                    Release Payment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Refund Modal */}
            {showRefundModal && selectedPayment && (
                <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-scaleIn">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
                            <h3 className="text-xl font-semibold">Process Refund</h3>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Refund Breakdown</h4>
                                <div className="text-sm space-y-1">
                                    <div className="flex justify-between">
                                        <span>Refund to Customer:</span>
                                        <span className="font-medium">Rs. {refundData.refundAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Amount to Owner:</span>
                                        <span className="font-medium">Rs. {refundData.ownerAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                                <textarea
                                    id="refund-reason"
                                    name="refund-reason"
                                    value={refundData.reason}
                                    onChange={(e) => setRefundData(prev => ({ ...prev, reason: e.target.value }))}
                                    placeholder="Reason for refund"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows="3"
                                />
                            </div>
                            
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowRefundModal(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmProcessRefund}
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Process Refund
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}