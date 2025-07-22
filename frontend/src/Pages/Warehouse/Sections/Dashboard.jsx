import { useState } from 'react';
import { 
    BuildingStorefrontIcon,
    CreditCardIcon,
    CalendarIcon,
    ExclamationTriangleIcon,
    ChartBarIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import { 
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function Dashboard() {
    const [stats] = useState({
        totalEarnings: 50250.75,
        occupancyRate: 78,
        pendingBookings: 7,
        maintenanceAlerts: 2,
        totalFacilities: 2,
        activeBookings: 15
    });

    const [facilities] = useState([
        {
            id: 1,
            name: "Colombo A",
            currentCapacity: 750,
            totalCapacity: 1000,
            status: "operational",
            temperature: 8,
            location: "Colombo"
        },
        {
            id: 2,
            name: "Kandy B",
            currentCapacity: 300,
            totalCapacity: 600,
            status: "operational",
            temperature: 12,
            location: "Kandy"
        }
    ]);

    const [recentActivity] = useState([
        { id: 1, message: "New booking from Farmer Kumara - Rice 500kg", time: "2 hours ago", type: "booking" },
        { id: 2, message: "Payment received - Rs. 17,500", time: "4 hours ago", type: "payment" },
        { id: 3, message: "Temperature alert resolved at Kandy B", time: "6 hours ago", type: "alert" },
        { id: 4, message: "Waste pickup completed - 50kg", time: "1 day ago", type: "waste" }
    ]);

    const [pendingBookings] = useState([
        { id: "BK-007", farmer: "Farmer Tharindu", produce: "Mangoes", quantity: "200kg", facility: "Colombo A" },
        { id: "BK-008", farmer: "Farmer Silva", produce: "Bananas", quantity: "150kg", facility: "Kandy B" },
        { id: "BK-009", farmer: "Green Valley Co-op", produce: "Rice", quantity: "500kg", facility: "Colombo A" }
    ]);

    // Simplified chart data
    const revenueData = {
        labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        datasets: [{
            label: 'Revenue (Rs.)',
            data: [25000, 32000, 28000, 45000, 38000, 42000, 50250],
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
        }]
    };

    const capacityData = {
        labels: facilities.map(f => f.name),
        datasets: [{
            data: facilities.map(f => (f.currentCapacity / f.totalCapacity) * 100),
            backgroundColor: ['#10B981', '#3B82F6'],
            borderWidth: 0
        }]
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-4">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                        <p className="text-gray-500 text-sm mt-1">Overview of your warehouse operations</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-green-500">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CreditCardIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Total Earnings</p>
                                <p className="text-xl font-semibold text-green-700">
                                    Rs. {stats.totalEarnings.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-green-400">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <BuildingStorefrontIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Occupancy Rate</p>
                                <p className="text-xl font-semibold text-green-600">{stats.occupancyRate}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-green-300">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <CalendarIcon className="h-6 w-6 text-green-500" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Pending Bookings</p>
                                <p className="text-xl font-semibold text-green-600">{stats.pendingBookings}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-amber-500">
                        <div className="flex items-center">
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Active Alerts</p>
                                <p className="text-xl font-semibold text-amber-600">{stats.maintenanceAlerts}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Facility Overview */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Facility Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {facilities.map(facility => (
                                <div key={facility.id} className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-medium text-gray-900">{facility.name}</h3>
                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                            Active
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600">Capacity</span>
                                                <span className="font-medium">
                                                    {facility.currentCapacity}/{facility.totalCapacity} kg
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-green-500 h-2 rounded-full" 
                                                    style={{ width: `${(facility.currentCapacity / facility.totalCapacity) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <span className="text-gray-600">Temperature</span>
                                                <p className="font-medium">{facility.temperature}°C</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Location</span>
                                                <p className="font-medium">{facility.location}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Capacity Chart */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Capacity Usage</h3>
                        <div className="h-48">
                            <Doughnut data={capacityData} options={{ 
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'bottom'
                                    }
                                }
                            }} />
                        </div>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h2>
                    <div className="h-64">
                        <Line data={revenueData} options={{ 
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }} />
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pending Bookings */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Pending Bookings ({pendingBookings.length})
                        </h2>
                        <div className="space-y-3">
                            {pendingBookings.slice(0, 3).map(booking => (
                                <div key={booking.id} className="border rounded-lg p-3 bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium text-gray-900">{booking.id}</h4>
                                            <p className="text-sm text-gray-600">{booking.farmer}</p>
                                            <p className="text-sm text-gray-500">
                                                {booking.produce} • {booking.quantity}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                                                Approve
                                            </button>
                                            <button className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600">
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                        <div className="space-y-3">
                            {recentActivity.map(activity => (
                                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1 rounded-full ${
                                            activity.type === 'booking' ? 'bg-blue-100' :
                                            activity.type === 'payment' ? 'bg-green-100' :
                                            activity.type === 'alert' ? 'bg-red-100' :
                                            'bg-gray-100'
                                        }`}>
                                            {activity.type === 'booking' && <CalendarIcon className="h-4 w-4 text-blue-600" />}
                                            {activity.type === 'payment' && <CreditCardIcon className="h-4 w-4 text-green-600" />}
                                            {activity.type === 'alert' && <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />}
                                            {activity.type === 'waste' && <ChartBarIcon className="h-4 w-4 text-gray-600" />}
                                        </div>
                                        <span className="text-sm text-gray-900">{activity.message}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}