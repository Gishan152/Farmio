export default function Pickups() {
    const pickups = [
        { 
            id: 'PU-001', 
            customer: 'Green Valley Apartments',
            address: '123 Green Valley St',
            type: 'Organic Waste',
            requestedTime: '09:00 AM',
            estimatedWeight: '45 kg',
            status: 'Scheduled',
            priority: 'High'
        },
        { 
            id: 'PU-002', 
            customer: 'City Mall',
            address: '456 Downtown Ave',
            type: 'Recyclable',
            requestedTime: '11:30 AM',
            estimatedWeight: '120 kg',
            status: 'In Progress',
            priority: 'Medium'
        },
        { 
            id: 'PU-003', 
            customer: 'Tech Office Building',
            address: '789 Innovation Blvd',
            type: 'Electronic Waste',
            requestedTime: '02:00 PM',
            estimatedWeight: '25 kg',
            status: 'Pending',
            priority: 'Low'
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Scheduled': return 'bg-blue-100 text-blue-800';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pickup Requests</h1>
                <div className="flex space-x-3">
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium">
                        Filter
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                        Schedule Pickup
                    </button>
                </div>
            </div>

            {/* Pickup Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {pickups.map((pickup) => (
                    <div key={pickup.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{pickup.customer}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{pickup.id}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(pickup.status)}`}>
                                        {pickup.status}
                                    </span>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(pickup.priority)}`}>
                                        {pickup.priority}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {pickup.address}
                                </div>

                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {pickup.requestedTime}
                                </div>

                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    {pickup.type} • {pickup.estimatedWeight}
                                </div>
                            </div>

                            <div className="mt-6 flex space-x-3">
                                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                                    Assign Route
                                </button>
                                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                                    Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
