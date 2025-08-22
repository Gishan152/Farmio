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
import { useUserContext } from '@/Contexts/UserContext';
import api from '@/API/client';
// TODO: Replace with actual buyer payment context/hook
// import { useBuyerPayment } from '../../../Contexts/Buyer/PaymentContext';

// Placeholder for payment data and actions
const useBuyerPayment = () => {
    // Replace with real data fetching and actions
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [walletData, setWalletData] = useState(null);
    const {user} = useUserContext();

    useEffect(()=>{
        async function fetchPayments(){
            try {
                setLoading(true);
                // Replace with real API call
                const response = await api.get(`/api/payment/wallet/${user.id}`);
                console.log("wallet data : ", response.data);
                setWalletData(response.data);
                
                // Convert payment history to payments format
                if (response.data.paymentHistory) {
                    const formattedPayments = response.data.paymentHistory.map(transaction => ({
                        id: transaction.transactionId,
                        type: transaction.type,
                        reference: transaction.reference,
                        amount: transaction.amount,
                        status: transaction.status.toLowerCase(),
                        paymentDate: new Date(transaction.timestamp).toISOString().split('T')[0],
                        description: transaction.description,
                        transactionType: transaction.type
                    }));
                    setPayments(formattedPayments);
                }
            } catch (error) {
                console.error("Failed to fetch wallet data:", error);
            } finally {
                setLoading(false);
            }
        }
        if (user?.id) {
            fetchPayments();
        }
    }, [user])


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
        walletData,
        loadPayments: () => {},
        exportPayments: () => {},
    };
};

function PaymentTable({ payments }) {
    return (
        <table className="min-w-full text-sm">
            <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="p-2 text-left font-semibold">Transaction ID</th>
                    <th className="p-2 text-left font-semibold">Type</th>
                    <th className="p-2 text-left font-semibold">Reference</th>
                    <th className="p-2 text-left font-semibold">Amount</th>
                    <th className="p-2 text-left font-semibold">Status</th>
                    <th className="p-2 text-left font-semibold">Date</th>
                    <th className="p-2 text-left font-semibold">Description</th>
                </tr>
            </thead>
            <tbody>
                {payments.map(p => (
                    <tr key={p.id} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="p-2 font-mono text-xs">{p.id}</td>
                        <td className="p-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                p.transactionType === 'CREDIT' ? 'bg-green-100 text-green-800' : 
                                p.transactionType === 'ESCROW' ? 'bg-yellow-100 text-yellow-800' : 
                                p.transactionType === 'DEBIT' ? 'bg-red-100 text-red-800' :
                                p.transactionType === 'REFUND' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {p.transactionType}
                            </span>
                        </td>
                        <td className="p-2">{p.reference}</td>
                        <td className="p-2 font-semibold">Rs. {(p.amount ?? 0).toLocaleString()}</td>
                        <td className="p-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.status === 'settled' ? 'bg-green-100 text-green-800' : p.status === 'refunded' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}`}>{p.status}</span>
                        </td>
                        <td className="p-2">{p.paymentDate}</td>
                        <td className="p-2 text-xs text-gray-600">{p.description}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default function PaymentManagement() {
    const { payments, loading, walletData, loadPayments } = useBuyerPayment();
    // Wallet state (now from API)
    const [withdrawModal, setWithdrawModal] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawError, setWithdrawError] = useState('');

    // Bank details state
    const [bankDetailsModal, setBankDetailsModal] = useState(false);
    const [viewBankDetailsModal, setViewBankDetailsModal] = useState(false);
    const [bankDetails, setBankDetails] = useState({
        accountNumber: '',
        accountHolderName: '',
        bank: '',
        branch: '',
        swiftCode: ''
    });
    const [currentBankDetails, setCurrentBankDetails] = useState(null);
    const [bankDetailsError, setBankDetailsError] = useState('');
    const [bankDetailsLoading, setBankDetailsLoading] = useState(false);

    // Simple CSV export for buyer payments
    const exportPayments = () => {
        if (!payments.length) return;
        const headers = ['Transaction ID','Type','Reference','Amount','Status','Date','Description'];
        const rows = payments.map(p => [
            p.id,
            p.transactionType,
            p.reference,
            p.amount,
            p.status,
            p.paymentDate,
            p.description
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

    // Filtering logic (updated for new data structure)
    const filteredPayments = payments.filter(payment => {
        if (filters.status !== 'all' && payment.status !== filters.status) return false;
        if (filters.type !== 'all' && payment.transactionType !== filters.type) return false;
        if (filters.minAmount && payment.amount < Number(filters.minAmount)) return false;
        if (filters.maxAmount && payment.amount > Number(filters.maxAmount)) return false;
        if (filters.startDate && payment.paymentDate < filters.startDate) return false;
        if (filters.endDate && payment.paymentDate > filters.endDate) return false;
        if (filters.search && !(
            payment.reference.toLowerCase().includes(filters.search.toLowerCase()) ||
            payment.description.toLowerCase().includes(filters.search.toLowerCase())
        )) return false;
        return true;
    });

    const stats = {
        totalPaid: payments.filter(p => p.transactionType === 'CREDIT').reduce((sum, p) => sum + p.amount, 0),
        totalEscrow: payments.filter(p => p.transactionType === 'ESCROW').reduce((sum, p) => sum + p.amount, 0),
        refunds: payments.filter(p => p.transactionType === 'REFUND').reduce((sum, p) => sum + p.amount, 0),
        completed: payments.filter(p => p.status === 'completed').length,
        pending: payments.filter(p => p.status === 'pending').length,
        creditTransactions: payments.filter(p => p.transactionType === 'CREDIT').length,
        escrowTransactions: payments.filter(p => p.transactionType === 'ESCROW').length
    };

    // Withdraw handler
    const { user } = useUserContext();
    
    // Fetch bank details
    const fetchBankDetails = async () => {
        try {
            setBankDetailsLoading(true);
            const response = await api.get(`/api/payment/bank-details/${user.id}`);
            setCurrentBankDetails(response.data);
        } catch (error) {
            console.error("Failed to fetch bank details:", error);
            setCurrentBankDetails(null);
        } finally {
            setBankDetailsLoading(false);
        }
    };

    // Load bank details on component mount
    useEffect(() => {
        if (user?.id) {
            fetchBankDetails();
        }
    }, [user]);

    // Bank details handlers
    const handleBankDetailsSubmit = async () => {
        setBankDetailsError('');
        
        // Validation
        if (!bankDetails.accountNumber || !bankDetails.accountHolderName || 
            !bankDetails.bank || !bankDetails.branch || !bankDetails.swiftCode) {
            setBankDetailsError('All fields are required.');
            return;
        }

        try {
            await api.post('/api/payment/bank-details', {
                userId: user.id,
                ...bankDetails
            });
            setBankDetailsModal(false);
            setBankDetails({
                accountNumber: '',
                accountHolderName: '',
                bank: '',
                branch: '',
                swiftCode: ''
            });
            // Refresh bank details
            fetchBankDetails();
        } catch (err) {
            setBankDetailsError('Failed to save bank details: ' + (err?.response?.data?.message || err.message));
        }
    };

    const openBankDetailsModal = () => {
        // Pre-fill form if details exist
        if (currentBankDetails) {
            setBankDetails({
                accountNumber: currentBankDetails.accountNumber || '',
                accountHolderName: currentBankDetails.accountHolderName || '',
                bank: currentBankDetails.bank || '',
                branch: currentBankDetails.branch || '',
                swiftCode: currentBankDetails.swiftCode || ''
            });
        }
        setBankDetailsModal(true);
    };

    const handleWithdraw = async () => {
        setWithdrawError('');
        const amount = parseFloat(withdrawAmount);
        if (isNaN(amount) || amount <= 0) {
            setWithdrawError('Please enter a valid amount.');
            return;
        }
        if (amount > (walletData?.amount || 0)) {
            setWithdrawError('Insufficient wallet balance.');
            return;
        }
        try {
            const response = await api.post('/api/payment/withdraw', {
                userId: user.id,
                amount,
                description: 'User withdrawal from wallet'
            });
            if (response.data.status === 'SUCCESS') {
                // Optionally refresh wallet data here
                setWithdrawModal(false);
                setWithdrawAmount('');
            } else {
                setWithdrawError(response.data.message || 'Withdrawal failed.');
            }
        } catch (err) {
            setWithdrawError('Withdrawal failed: ' + (err?.response?.data?.message || err.message));
        }
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
                                onClick={() => setViewBankDetailsModal(true)}
                                className="flex items-center bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-200 text-sm font-semibold shadow border border-blue-400"
                            >
                                <BanknotesIcon className="h-4 w-4 mr-2" />
                                Bank Details
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
                                <p className="text-xs font-medium text-gray-500">Available Balance</p>
                                <p className="text-xl font-bold text-green-700">Rs. {(walletData?.amount || 0).toLocaleString()}</p>
                                <p className="text-xs text-gray-500 mt-1">Escrow: Rs. {(walletData?.escrowAmount || 0).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    {/* Other Stat Cards */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center">
                            <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                            <div className="ml-3">
                                <p className="text-xs font-medium text-gray-500">Total Credits</p>
                                <p className="text-lg font-bold text-gray-900">Rs. {stats.totalPaid.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center">
                            <BanknotesIcon className="h-6 w-6 text-yellow-600" />
                            <div className="ml-3">
                                <p className="text-xs font-medium text-gray-500">Total Escrow</p>
                                <p className="text-lg font-bold text-gray-900">Rs. {stats.totalEscrow.toLocaleString()}</p>
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
                            <CalendarIcon className="h-6 w-6 text-purple-600" />
                            <div className="ml-3">
                                <p className="text-xs font-medium text-gray-500">Total Transactions</p>
                                <p className="text-lg font-bold text-gray-900">{payments.length}</p>
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
                        <div className="p-2 bg-gray-100 rounded text-green-700 font-bold">Rs. {(walletData?.amount || 0).toLocaleString()}</div>
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
                            max={walletData?.amount || 0}
                        />
                    </div>
                    {withdrawError && <div className="text-red-600 text-sm font-medium">{withdrawError}</div>}
                </div>
            </CustomModal>

            {/* Bank Details Modal */}
            <CustomModal
                isOpen={bankDetailsModal}
                onClose={() => { 
                    setBankDetailsModal(false); 
                    setBankDetailsError(''); 
                    setBankDetails({
                        accountNumber: '',
                        accountHolderName: '',
                        bank: '',
                        branch: '',
                        swiftCode: ''
                    }); 
                }}
                title="Bank Details"
                description="Enter or update your bank account details for withdrawals."
                submitText="Save"
                onSubmit={handleBankDetailsSubmit}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Account Number</label>
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2"
                            placeholder="Enter account number"
                            value={bankDetails.accountNumber}
                            onChange={e => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Account Holder Name</label>
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2"
                            placeholder="Enter account holder name"
                            value={bankDetails.accountHolderName}
                            onChange={e => setBankDetails(prev => ({ ...prev, accountHolderName: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Bank Name</label>
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2"
                            placeholder="Enter bank name"
                            value={bankDetails.bank}
                            onChange={e => setBankDetails(prev => ({ ...prev, bank: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Branch Name</label>
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2"
                            placeholder="Enter branch name"
                            value={bankDetails.branch}
                            onChange={e => setBankDetails(prev => ({ ...prev, branch: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">SWIFT Code</label>
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2"
                            placeholder="Enter SWIFT code"
                            value={bankDetails.swiftCode}
                            onChange={e => setBankDetails(prev => ({ ...prev, swiftCode: e.target.value }))}
                        />
                    </div>
                    {bankDetailsError && <div className="text-red-600 text-sm font-medium">{bankDetailsError}</div>}
                </div>
            </CustomModal>

            {/* View Bank Details Modal */}
            <CustomModal
                isOpen={viewBankDetailsModal}
                onClose={() => setViewBankDetailsModal(false)}
                title="Bank Account Details"
                description="Your registered bank account information."
                showFooter={false}
            >
                <div className="space-y-4">
                    {bankDetailsLoading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <p className="mt-2 text-gray-600 text-sm">Loading bank details...</p>
                        </div>
                    ) : currentBankDetails ? (
                        <>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Account Number</label>
                                    <p className="text-gray-900 font-mono">{currentBankDetails.accountNumber}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Account Holder Name</label>
                                    <p className="text-gray-900">{currentBankDetails.accountHolderName}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                                    <p className="text-gray-900">{currentBankDetails.bank}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Branch Name</label>
                                    <p className="text-gray-900">{currentBankDetails.branch}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">SWIFT Code</label>
                                    <p className="text-gray-900">{currentBankDetails.swiftCode}</p>
                                </div>
                            </div>
                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={() => {
                                        setViewBankDetailsModal(false);
                                        openBankDetailsModal();
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Edit Details
                                </button>
                                <button
                                    onClick={() => setViewBankDetailsModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                >
                                    Close
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <BanknotesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-4">No bank details found</p>
                            <button
                                onClick={() => {
                                    setViewBankDetailsModal(false);
                                    setBankDetailsModal(true);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Add Bank Details
                            </button>
                        </div>
                    )}
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
                                <option value="CREDIT">Credit</option>
                                <option value="ESCROW">Escrow</option>
                                <option value="DEBIT">Debit</option>
                                <option value="REFUND">Refund</option>
                                <option value="WITHDRAWAL">Withdrawal</option>
                                <option value="RELEASE">Release</option>
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
                                    placeholder="Search by reference or description..."
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
