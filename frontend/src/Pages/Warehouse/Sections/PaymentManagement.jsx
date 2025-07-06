export default function PaymentManagement() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Payment Management</h1>
                <p className="text-gray-600">View payment history, detailed breakdowns, and escrow status</p>
            </div>
            
            <div className="bg-white rounded-lg shadow border">
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Payment History</h2>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg">Export Report</button>
                    </div>
                </div>
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">#BK001</td>
                            <td className="px-6 py-4 whitespace-nowrap">Rs. 2,500.00</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Settled</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">2024-01-15</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}