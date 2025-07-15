import React, { useState } from 'react';
import { 
    EyeIcon, 
    ArrowUpIcon, 
    ArrowDownIcon,
    BanknotesIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function PaymentTable({ payments, onViewDetails, onReleasePayment, onProcessRefund }) {
    const [sortField, setSortField] = useState('paymentDate');
    const [sortDirection, setSortDirection] = useState('desc');

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedPayments = [...payments].sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (sortField === 'paymentDate' || sortField === 'releaseDate') {
            aValue = new Date(aValue || '1970-01-01');
            bValue = new Date(bValue || '1970-01-01');
        } else if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'settled': return 'bg-green-100 text-green-800';
            case 'held': return 'bg-yellow-100 text-yellow-800';
            case 'refunded': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getEscrowStatusIcon = (escrowStatus) => {
        switch (escrowStatus) {
            case 'held':
                return <ClockIcon className="h-3 w-3 text-yellow-500" title="Funds in Escrow" />;
            case 'released':
                return <CheckCircleIcon className="h-3 w-3 text-green-500" title="Funds Released" />;
            default:
                return <ExclamationTriangleIcon className="h-3 w-3 text-gray-500" />;
        }
    };

    const SortHeader = ({ field, children }) => (
        <th 
            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center space-x-1">
                <span>{children}</span>
                {sortField === field && (
                    sortDirection === 'asc' 
                        ? <ArrowUpIcon className="h-3 w-3" />
                        : <ArrowDownIcon className="h-3 w-3" />
                )}
            </div>
        </th>
    );

    return (
        <div className="w-full">
            <table className="min-w-full table-fixed">
                <thead className="bg-gray-50">
                    <tr>
                        <SortHeader field="bookingId">ID</SortHeader>
                        <SortHeader field="farmerName">Customer</SortHeader>
                        <SortHeader field="produce">Produce</SortHeader>
                        <SortHeader field="quantity">Qty</SortHeader>
                        <SortHeader field="totalAmount">Amount</SortHeader>
                        <SortHeader field="status">Status</SortHeader>
                        <SortHeader field="paymentDate">Date</SortHeader>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Escrow</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sortedPayments.length === 0 ? (
                        <tr>
                            <td colSpan="9" className="px-3 py-4 text-center text-gray-500 text-sm">
                                No payments found
                            </td>
                        </tr>
                    ) : (
                        sortedPayments.map((payment) => (
                            <tr key={payment.id} className="hover:bg-gray-50 transition-colors duration-200">
                                <td className="px-3 py-3 text-sm">
                                    <div className="flex items-center">
                                        <span className="font-medium text-gray-900 truncate">{payment.bookingId}</span>
                                        {payment.isEarlyRetrieval && (
                                            <ClockIcon className="h-3 w-3 text-orange-500 ml-1" title="Early Retrieval" />
                                        )}
                                    </div>
                                </td>
                                <td className="px-3 py-3 text-sm">
                                    <div className="font-medium text-gray-900 truncate max-w-24">
                                        {payment.farmerName || payment.buyerName}
                                    </div>
                                </td>
                                <td className="px-3 py-3 text-sm">
                                    <div className="font-medium text-gray-900 truncate">{payment.produce}</div>
                                </td>
                                <td className="px-3 py-3 text-sm text-gray-900">
                                    {payment.quantity}kg
                                </td>
                                <td className="px-3 py-3 text-sm">
                                    <div className="font-medium text-gray-900">
                                        Rs. {(payment.totalAmount / 1000).toFixed(1)}k
                                    </div>
                                    {payment.refundAmount > 0 && (
                                        <div className="text-xs text-blue-600">
                                            Refunded: Rs. {(payment.refundAmount / 1000).toFixed(1)}k
                                        </div>
                                    )}
                                </td>
                                <td className="px-3 py-3">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-3 py-3 text-sm text-gray-900">
                                    {new Date(payment.paymentDate).toLocaleDateString('en-GB', { 
                                        day: '2-digit', 
                                        month: '2-digit' 
                                    })}
                                </td>
                                <td className="px-3 py-3">
                                    <div className="flex items-center">
                                        {getEscrowStatusIcon(payment.escrowStatus)}
                                        <span className="ml-1 text-xs text-gray-600">
                                            {payment.escrowStatus === 'held' ? 'Held' : 'Released'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-3 py-3 text-sm">
                                    <div className="flex items-center space-x-1">
                                        <button
                                            onClick={() => onViewDetails(payment)}
                                            className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-all duration-200"
                                            title="View Details"
                                        >
                                            <EyeIcon className="h-4 w-4" />
                                        </button>
                                        
                                        {payment.escrowStatus === 'held' && payment.status !== 'refunded' && (
                                            <button
                                                onClick={() => onReleasePayment(payment)}
                                                className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50 transition-all duration-200"
                                                title="Release Payment"
                                            >
                                                <BanknotesIcon className="h-4 w-4" />
                                            </button>
                                        )}
                                        
                                        {payment.isEarlyRetrieval && payment.status !== 'refunded' && onProcessRefund && (
                                            <button
                                                onClick={() => onProcessRefund(payment)}
                                                className="text-orange-600 hover:text-orange-900 p-1 rounded-md hover:bg-orange-50 transition-all duration-200"
                                                title="Process Refund"
                                            >
                                                <ClockIcon className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}