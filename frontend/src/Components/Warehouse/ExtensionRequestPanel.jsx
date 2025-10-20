import React from 'react';
import { 
    CheckIcon,
    XMarkIcon, 
    EyeIcon, 
    ArrowRightIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';

export default function ExtensionRequestPanel({ 
    requests = [], 
    loading = false, 
    onApprove, 
    onReject, 
    onViewDetails 
}) {
    return (
        <div className="bg-white rounded-lg shadow-md border border-blue-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800">
                    <ArrowRightIcon className="inline-block h-6 w-6 mr-2" />
                    Storage Extension Requests
                </h3>
                <p className="text-sm text-blue-600 mt-1">Process customer requests for extending their storage period</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-100 to-indigo-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Request ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Booking ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Original End Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Requested End Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Additional Days</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Request Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-blue-100">
                        {loading ? (
                            <tr>
                                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                    Loading extension requests...
                                </td>
                            </tr>
                        ) : requests.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="px-6 py-12 text-center">
                                    <div className="text-gray-500">
                                        <div className="text-4xl mb-2">
                                            <CalendarIcon className="h-12 w-12 mx-auto text-blue-300" />
                                        </div>
                                        <p className="text-lg font-medium">No extension requests</p>
                                        <p className="text-sm">When customers request to extend their storage period, they will appear here</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            requests.map((request) => (
                                <tr key={request.id} className="hover:bg-blue-50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-medium text-gray-900">{request.id}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-medium text-blue-600">{request.bookingId}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{request.farmerName}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(request.originalEndDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(request.proposedEndDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                                            {request.additionalDays} days
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(request.requestDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => onApprove(request.id)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
                                            title="Approve Request"
                                        >
                                            <CheckIcon className="h-4 w-4 inline mr-1" />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => onReject(request.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
                                            title="Reject Request"
                                        >
                                            <XMarkIcon className="h-4 w-4 inline mr-1" />
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => onViewDetails(request)}
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
    );
}