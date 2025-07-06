import { useState, useEffect } from 'react';
import { 
    BuildingStorefrontIcon,
    CreditCardIcon,
    CalendarIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalEarnings: 15240.50,
        occupancyRate: 78,
        pendingBookings: 12,
        maintenanceAlerts: 3
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Warehouse Dashboard</h1>
                <p className="text-gray-600">Overview of your warehouse operations</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow border">
                    <div className="flex items-center">
                        <CreditCardIcon className="h-8 w-8 text-green-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                            <p className="text-2xl font-bold text-gray-900">Rs. {stats.totalEarnings.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border">
                    <div className="flex items-center">
                        <BuildingStorefrontIcon className="h-8 w-8 text-blue-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Occupancy Rate</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.occupancyRate}%</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border">
                    <div className="flex items-center">
                        <CalendarIcon className="h-8 w-8 text-yellow-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Pending Bookings</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border">
                    <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Maintenance Alerts</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.maintenanceAlerts}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow border p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span>New booking from Farmer Kumara</span>
                        <span className="text-sm text-gray-500">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span>Payment received for Booking #1234</span>
                        <span className="text-sm text-gray-500">4 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span>Early retrieval approved for Booking #1232</span>
                        <span className="text-sm text-gray-500">1 day ago</span>
                    </div>
                </div>
            </div>
        </div>
    );
}