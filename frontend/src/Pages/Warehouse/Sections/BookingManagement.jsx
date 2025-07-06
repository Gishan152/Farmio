export default function BookingManagement() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Booking Management</h1>
                <p className="text-gray-600">Approve/reject bookings and manage early retrievals</p>
            </div>
            
            <div className="bg-white rounded-lg shadow border">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farmer/Buyer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produce</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">#BK001</td>
                            <td className="px-6 py-4 whitespace-nowrap">Farmer Kumara</td>
                            <td className="px-6 py-4 whitespace-nowrap">Rice</td>
                            <td className="px-6 py-4 whitespace-nowrap">500 kg</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Pending</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">Approve</button>
                                <button className="bg-red-600 text-white px-3 py-1 rounded text-sm">Reject</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}