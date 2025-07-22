import React, { useState, useEffect } from 'react';
import CustomModal from '../../../Components/CustomModel';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    DocumentArrowDownIcon,
    XMarkIcon,
    CurrencyDollarIcon,
    BanknotesIcon,
    ReceiptRefundIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';
// TODO: Replace with actual buyer payment context/hook
// import { useBuyerPayment } from '../../../Contexts/Buyer/PaymentContext';

// Placeholder for payment data and actions
const useBuyerPayment = () => {
    // Replace with real data fetching and actions
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setPayments([
                // Warehouse Booking Payment
                {
                    id: 'PMT-001',
                    type: 'Warehouse Booking',
                    bookingId: 'BK-1001',
                    produce: 'Corn',
                    quantity: 100,
                    duration: 30,
                    paymentDate: '2025-07-01',
                    releaseDate: '2025-07-31',
                    baseCost: 12000,
                    bufferCost: 500,
                    baseFee: 1250,
                    totalAmount: 13750,
                    refundAmount: 0,
                    status: 'settled',
                    escrowStatus: 'settled',
                    payHereReceiptId: 'PH-123456',
                    buyerName: 'John Doe',
                    isEarlyRetrieval: false,
                    warehouse: 'Sunny Warehouse',
                },
                // Warehouse Extension Payment
                {
                    id: 'PMT-002',
                    type: 'Warehouse Extension',
                    bookingId: 'BK-1001',
                    produce: 'Corn',
                    quantity: 100,
                    duration: 10,
                    paymentDate: '2025-07-31',
                    releaseDate: '2025-08-10',
                    baseCost: 4000,
                    bufferCost: 200,
                    baseFee: 400,
                    totalAmount: 4600,
                    refundAmount: 0,
                    status: 'settled',
                    escrowStatus: 'settled',
                    payHereReceiptId: 'PH-123457',
                    buyerName: 'John Doe',
                    isEarlyRetrieval: false,
                    warehouse: 'Sunny Warehouse',
                },
                // Order Payment
                {
                    id: 'PMT-003',
                    type: 'Order',
                    orderId: 'ORD-2001',
                    produce: 'Wheat',
                    quantity: 50,
                    paymentDate: '2025-07-05',
                    totalAmount: 8000,
                    refundAmount: 0,
                    status: 'settled',
                    payHereReceiptId: 'PH-123458',
                    buyerName: 'John Doe',
                    sellerName: 'Golden Fields',
                },
                // Refunded Order Payment
                {
                    id: 'PMT-004',
                    type: 'Order',
                    orderId: 'ORD-2002',
                    produce: 'Tomato',
                    quantity: 20,
                    paymentDate: '2025-07-10',
                    totalAmount: 2000,
                    refundAmount: 500,
                    status: 'refunded',
                    payHereReceiptId: 'PH-123459',
                    buyerName: 'John Doe',
                    sellerName: 'Highland Farms',
                },
            ]);
            setLoading(false);
        }, 500);
    }, []);
    return {
        payments,
        loading,
        loadPayments: () => {},
        exportPayments: () => {},
    };
};

function PaymentTable({ payments }) {
    return (
        <table className="min-w-full text-sm">
            <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="p-2 text-left font-semibold">Type</th>
                    <th className="p-2 text-left font-semibold">Reference</th>
                    <th className="p-2 text-left font-semibold">Produce</th>
                    <th className="p-2 text-left font-semibold">Quantity</th>
                    <th className="p-2 text-left font-semibold">Total Paid</th>
                    <th className="p-2 text-left font-semibold">Status</th>
                    <th className="p-2 text-left font-semibold">Payment Date</th>
                </tr>
            </thead>
            <tbody>
                {payments.map(p => (
                    <tr key={p.id} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="p-2">{p.type || (p.orderId ? 'Order' : p.bookingId ? 'Warehouse Booking' : '')}</td>
                        <td className="p-2">{p.type === 'Order' ? p.orderId : p.bookingId}</td>
                        <td className="p-2">{p.produce}</td>
                        <td className="p-2">{p.quantity} kg</td>
                        <td className="p-2">Rs. {p.totalAmount.toLocaleString()}</td>
                        <td className="p-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.status === 'settled' ? 'bg-green-100 text-green-800' : p.status === 'refunded' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}`}>{p.status}</span>
                        </td>
                        <td className="p-2">{p.paymentDate}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default function PaymentManagement() {
    const { payments, loading, loadPayments } = useBuyerPayment();
    // Wallet state (mocked for demo)
    const [wallet, setWallet] = useState(15000); // Rs. 15,000 in wallet
    const [withdrawModal, setWithdrawModal] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawError, setWithdrawError] = useState('');

    // Simple CSV export for buyer payments
    const exportPayments = () => {
        if (!payments.length) return;
        const headers = ['Type','Reference','Produce','Quantity','Total Paid','Status','Payment Date'];
        const rows = payments.map(p => [
            p.type || (p.orderId ? 'Order' : p.bookingId ? 'Warehouse Booking' : ''),
            p.type === 'Order' ? p.orderId : p.bookingId,
            p.produce,
            p.quantity,
            p.totalAmount,
            p.status,
            p.paymentDate
        ]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'buyer_payments.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        type: 'all',
        minAmount: '',
        maxAmount: '',
        startDate: '',
        endDate: '',
        search: ''
    });

    // Filtering logic (extended)
    const filteredPayments = payments.filter(payment => {
        if (filters.status !== 'all' && payment.status !== filters.status) return false;
        if (filters.type !== 'all' && payment.type !== filters.type) return false;
        if (filters.minAmount && payment.totalAmount < Number(filters.minAmount)) return false;
        if (filters.maxAmount && payment.totalAmount > Number(filters.maxAmount)) return false;
        if (filters.startDate && payment.paymentDate < filters.startDate) return false;
        if (filters.endDate && payment.paymentDate > filters.endDate) return false;
        if (filters.search && !(
            (payment.bookingId && payment.bookingId.toLowerCase().includes(filters.search.toLowerCase())) ||
            (payment.orderId && payment.orderId.toLowerCase().includes(filters.search.toLowerCase()))
        )) return false;
        return true;
    });

    const stats = {
        totalPaid: payments.reduce((sum, p) => sum + p.totalAmount, 0),
        refunds: payments.reduce((sum, p) => sum + p.refundAmount, 0),
        settled: payments.filter(p => p.status === 'settled').length,
        refunded: payments.filter(p => p.status === 'refunded').length,
        warehousePayments: payments.filter(p => p.type === 'Warehouse Booking').length,
        extensionPayments: payments.filter(p => p.type === 'Warehouse Extension').length,
        orderPayments: payments.filter(p => p.type === 'Order').length
    };

    // Withdraw handler
    const handleWithdraw = () => {
        setWithdrawError('');
        const amount = parseFloat(withdrawAmount);
        if (isNaN(amount) || amount <= 0) {
            setWithdrawError('Please enter a valid amount.');
            return;
        }
        if (amount > wallet) {
            setWithdrawError('Insufficient wallet balance.');
            return;
        }
        setWallet(w => w - amount);
        setWithdrawModal(false);
        setWithdrawAmount('');
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-4 p-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
                            <p className="text-gray-600 mt-1 text-sm">View your payment history and details</p>
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
                                onClick={() => exportPayments('csv')}
                                className="flex items-center bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
                            >
                                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                                Export
                            </button>
                            <button
                                className="flex items-center bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors duration-200 text-sm font-semibold shadow border border-green-400"
                                onClick={() => setWithdrawModal(true)}
                            >
                                <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                                Withdraw
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards + Wallet Card */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Wallet Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-green-400 p-4 flex flex-col justify-between">
                        <div className="flex items-center">
                            <CurrencyDollarIcon className="h-7 w-7 text-green-600" />
                            <div className="ml-3">
                                <p className="text-xs font-medium text-gray-500">Wallet Balance</p>
                                <p className="text-xl font-bold text-green-700">Rs. {wallet.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    {/* Other Stat Cards */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center">
                            <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                            <div className="ml-3">
                                <p className="text-xs font-medium text-gray-500">Total Paid</p>
                                <p className="text-lg font-bold text-gray-900">Rs. {stats.totalPaid.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center">
                            <ReceiptRefundIcon className="h-6 w-6 text-blue-600" />
                            <div className="ml-3">
                                <p className="text-xs font-medium text-gray-500">Refunds</p>
                                <p className="text-lg font-bold text-gray-900">Rs. {stats.refunds.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center">
                            <BanknotesIcon className="h-6 w-6 text-yellow-600" />
                            <div className="ml-3">
                                <p className="text-xs font-medium text-gray-500">Warehouse Bookings</p>
                                <p className="text-lg font-bold text-gray-900">{stats.warehousePayments}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center">
                            <CalendarIcon className="h-6 w-6 text-purple-600" />
                            <div className="ml-3">
                                <p className="text-xs font-medium text-gray-500">Order Payments</p>
                                <p className="text-lg font-bold text-gray-900">{stats.orderPayments}</p>
                            </div>
                        </div>
                    </div>
                </div>
            {/* Withdraw Modal */}
            <CustomModal
                isOpen={withdrawModal}
                onClose={() => { setWithdrawModal(false); setWithdrawError(''); setWithdrawAmount(''); }}
                title="Withdraw Funds"
                description="Enter the amount you want to withdraw from your wallet."
                submitText="Withdraw"
                onSubmit={handleWithdraw}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Available Balance</label>
                        <div className="p-2 bg-gray-100 rounded text-green-700 font-bold">Rs. {wallet.toLocaleString()}</div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Withdraw Amount</label>
                        <input
                            type="number"
                            className="w-full border rounded px-3 py-2"
                            placeholder="Enter amount"
                            value={withdrawAmount}
                            onChange={e => setWithdrawAmount(e.target.value)}
                            min={1}
                            max={wallet}
                        />
                    </div>
                    {withdrawError && <div className="text-red-600 text-sm font-medium">{withdrawError}</div>}
                </div>
            </CustomModal>

                {/* Filters Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-end">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={filters.status}
                                onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="all">All Statuses</option>
                                <option value="settled">Settled</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                            <select
                                value={filters.type}
                                onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="all">All Types</option>
                                <option value="Warehouse Booking">Warehouse Booking</option>
                                <option value="Warehouse Extension">Warehouse Extension</option>
                                <option value="Order">Order</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Min Amount</label>
                            <input
                                type="number"
                                value={filters.minAmount}
                                onChange={e => setFilters(f => ({ ...f, minAmount: e.target.value }))}
                                placeholder="Min"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Max Amount</label>
                            <input
                                type="number"
                                value={filters.maxAmount}
                                onChange={e => setFilters(f => ({ ...f, maxAmount: e.target.value }))}
                                placeholder="Max"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={filters.startDate}
                                onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                            <input
                                type="date"
                                value={filters.endDate}
                                onChange={e => setFilters(f => ({ ...f, endDate: e.target.value }))}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
                            <div className="relative">
                                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search by booking/order ID..."
                                    value={filters.search}
                                    onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                                    className="w-full pl-8 pr-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFilters({ status: 'all', type: 'all', minAmount: '', maxAmount: '', startDate: '', endDate: '', search: '' })}
                            className="ml-auto px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

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
                        <div className="p-4 overflow-x-auto">
                            <PaymentTable payments={filteredPayments} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
