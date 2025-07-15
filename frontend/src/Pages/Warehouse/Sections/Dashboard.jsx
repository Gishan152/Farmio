import { useState } from 'react';
import { 
    BuildingStorefrontIcon,
    CreditCardIcon,
    CalendarIcon,
    ExclamationTriangleIcon,
    ChartBarIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    BellIcon,
    TrashIcon
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
import { Line, Bar, Pie } from 'react-chartjs-2';

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
        activeBookings: 15,
        wasteRequests: 3
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

    const [recentActivity, setRecentActivity] = useState([
        { id: 1, message: "New booking from Farmer Kumara - Rice 500kg", time: "2 hours ago", type: "booking" },
        { id: 2, message: "Payment received for Booking #BK-001 - Rs. 17,500", time: "4 hours ago", type: "payment" },
        { id: 3, message: "Temperature alert resolved at Kandy B", time: "6 hours ago", type: "alert" },
        { id: 4, message: "Waste pickup completed - 50kg at Colombo A", time: "1 day ago", type: "waste" },
        { id: 5, message: "Early retrieval approved for Booking #BK-003", time: "1 day ago", type: "booking" }
    ]);

    const [pendingBookings, setPendingBookings] = useState([
        { id: "BK-007", farmer: "Farmer Tharindu", produce: "Mangoes", quantity: "200kg", duration: "7 days", facility: "Colombo A" },
        { id: "BK-008", farmer: "Farmer Silva", produce: "Bananas", quantity: "150kg", duration: "5 days", facility: "Kandy B" },
        { id: "BK-009", farmer: "Green Valley Co-op", produce: "Rice", quantity: "500kg", duration: "14 days", facility: "Colombo A" }
    ]);

    const [wasteRequests] = useState([
        { id: "WR-001", type: "Organic waste", quantity: "75kg", facility: "Colombo A", status: "pending", agent: null },
        { id: "WR-002", type: "Packaging waste", quantity: "25kg", facility: "Kandy B", status: "accepted", agent: "EcoWaste Solutions" },
        { id: "WR-003", type: "Damaged produce", quantity: "40kg", facility: "Colombo A", status: "pending", agent: null }
    ]);

    const [maintenanceAlerts] = useState([
        { id: 1, facility: "Colombo A", task: "Cooling system maintenance", dueDate: "2025-01-20", priority: "high" },
        { id: 2, facility: "Kandy B", task: "Cleaning and sanitization", dueDate: "2025-01-18", priority: "medium" }
    ]);

    // Chart data with balanced green colors
    const revenueData = {
        labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        datasets: [{
            label: 'Revenue (Rs.)',
            data: [25000, 32000, 28000, 45000, 38000, 42000, 50250],
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: 'rgb(34, 197, 94)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
        }]
    };

    const occupancyData = {
        labels: facilities.map(f => f.name),
        datasets: [{
            data: facilities.map(f => (f.currentCapacity / f.totalCapacity) * 100),
            backgroundColor: [
                'rgba(34, 197, 94, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)'
            ],
            borderColor: [
                'rgb(34, 197, 94)',
                'rgb(59, 130, 246)',
                'rgb(245, 158, 11)',
                'rgb(239, 68, 68)'
            ],
            borderWidth: 2,
            hoverOffset: 8
        }]
    };

    const bookingTrendsData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
            label: 'New Bookings',
            data: [12, 8, 15, 10],
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
        }]
    };

    const handleApproveBooking = (bookingId) => {
        setPendingBookings(prev => prev.filter(b => b.id !== bookingId));
        setRecentActivity(prev => [
            { id: Date.now(), message: `Booking ${bookingId} approved`, time: "Just now", type: "booking" },
            ...prev.slice(0, 4)
        ]);
    };

    const handleRejectBooking = (bookingId) => {
        setPendingBookings(prev => prev.filter(b => b.id !== bookingId));
        setRecentActivity(prev => [
            { id: Date.now(), message: `Booking ${bookingId} rejected`, time: "Just now", type: "booking" },
            ...prev.slice(0, 4)
        ]);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header with green gradient */}
                <div className="text-left">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Warehouse Dashboard
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Complete overview of your warehouse operations
                    </p>
                </div>

                {/* Enhanced Stats Cards with balanced colors */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                                <CreditCardIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Earnings</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Rs. {stats.totalEarnings.toLocaleString()}
                                </p>
                                <p className="text-xs text-green-600 mt-1">+12.5% from last month</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                                <BuildingStorefrontIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Occupancy</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.occupancyRate}%</p>
                                <p className="text-xs text-blue-600 mt-1">Optimal range</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-yellow-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                                <CalendarIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Bookings</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingBookings}</p>
                                <p className="text-xs text-yellow-600 mt-1">Awaiting approval</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-red-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center">
                            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                                <ExclamationTriangleIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Alerts</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.maintenanceAlerts + stats.wasteRequests}
                                </p>
                                <p className="text-xs text-red-600 mt-1">Requires attention</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Facility Overview */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Facility Overview</h2>
                        <div className="flex space-x-2">
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                {facilities.length} Active Facilities
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {facilities.map(facility => (
                            <div key={facility.id} className="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-md transition-all duration-300 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{facility.name}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        facility.status === 'operational' 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }`}>
                                        ● {facility.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Capacity Usage</span>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                {facility.currentCapacity}/{facility.totalCapacity} kg
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                                            <div 
                                                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 ease-out shadow-inner" 
                                                style={{ width: `${(facility.currentCapacity / facility.totalCapacity) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="mt-1 text-xs text-green-600 dark:text-green-400">
                                            {Math.round((facility.currentCapacity / facility.totalCapacity) * 100)}% utilized
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                                            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Temperature</div>
                                            <div className="text-lg font-bold text-blue-900 dark:text-blue-100">{facility.temperature}°C</div>
                                        </div>
                                        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-100 dark:border-purple-800">
                                            <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Location</div>
                                            <div className="text-lg font-bold text-purple-900 dark:text-purple-100">{facility.location}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enhanced Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            Revenue Trends
                        </h3>
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
                                        beginAtZero: true,
                                        grid: {
                                            color: 'rgba(0, 0, 0, 0.1)'
                                        }
                                    },
                                    x: {
                                        grid: {
                                            display: false
                                        }
                                    }
                                }
                            }} />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                            Facility Occupancy
                        </h3>
                        <div className="h-64">
                            <Pie data={occupancyData} options={{ 
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                        labels: {
                                            padding: 20,
                                            usePointStyle: true
                                        }
                                    }
                                }
                            }} />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                            Booking Trends
                        </h3>
                        <div className="h-64">
                            <Bar data={bookingTrendsData} options={{ 
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        grid: {
                                            color: 'rgba(0, 0, 0, 0.1)'
                                        }
                                    },
                                    x: {
                                        grid: {
                                            display: false
                                        }
                                    }
                                }
                            }} />
                        </div>
                    </div>
                </div>

                {/* Enhanced Pending Bookings & Maintenance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <CalendarIcon className="h-6 w-6 text-blue-500 mr-2" />
                            Pending Bookings
                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {pendingBookings.length}
                            </span>
                        </h2>
                        <div className="space-y-4">
                            {pendingBookings.map(booking => (
                                <div key={booking.id} className="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white">{booking.id}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{booking.farmer}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {booking.produce} • {booking.quantity} • {booking.duration}
                                            </p>
                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
                                                📍 {booking.facility}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <button 
                                            onClick={() => handleApproveBooking(booking.id)}
                                            className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                                        >
                                            ✓ Approve
                                        </button>
                                        <button 
                                            onClick={() => handleRejectBooking(booking.id)}
                                            className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                                        >
                                            ✗ Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <ExclamationTriangleIcon className="h-6 w-6 text-orange-500 mr-2" />
                            Maintenance & Alerts
                            <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                                {maintenanceAlerts.length}
                            </span>
                        </h2>
                        <div className="space-y-4">
                            {maintenanceAlerts.map(alert => (
                                <div key={alert.id} className={`border-2 rounded-lg p-4 transition-all duration-300 ${
                                    alert.priority === 'high' 
                                        ? 'border-red-300 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30' 
                                        : alert.priority === 'medium' 
                                        ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30' 
                                        : 'border-gray-300 bg-gray-50 dark:bg-gray-700'
                                }`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-full ${
                                            alert.priority === 'high' ? 'bg-red-100 dark:bg-red-900' :
                                            alert.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900' :
                                            'bg-gray-100 dark:bg-gray-600'
                                        }`}>
                                            <ExclamationTriangleIcon className={`h-5 w-5 ${
                                                alert.priority === 'high' ? 'text-red-600 dark:text-red-400' :
                                                alert.priority === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                                                'text-gray-500'
                                            }`} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 dark:text-white">{alert.task}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                📍 {alert.facility} • 📅 Due: {alert.dueDate}
                                            </p>
                                            <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-semibold ${
                                                alert.priority === 'high' ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' :
                                                alert.priority === 'medium' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200' :
                                                'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                                            }`}>
                                                {alert.priority.toUpperCase()} PRIORITY
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Enhanced Waste Management */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <TrashIcon className="h-6 w-6 text-purple-500 mr-2" />
                        Waste Management
                        <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                            {wasteRequests.length} Active
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {wasteRequests.map(request => (
                            <div key={request.id} className="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                                        <TrashIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">{request.id}</h4>
                                    <span className={`ml-auto px-2 py-1 rounded-full text-xs font-semibold ${
                                        request.status === 'pending' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200' :
                                        request.status === 'accepted' ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200' :
                                        'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                                    }`}>
                                        {request.status.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{request.type}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{request.quantity}</p>
                                <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-1">📍 {request.facility}</p>
                                {request.agent && (
                                    <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-2 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                                        👤 {request.agent}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enhanced Recent Activity with balanced colors */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <ClockIcon className="h-6 w-6 text-indigo-500 mr-2" />
                        Recent Activity
                    </h2>
                    <div className="space-y-3">
                        {recentActivity.map(activity => (
                            <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${
                                        activity.type === 'booking' ? 'bg-blue-100 dark:bg-blue-900' :
                                        activity.type === 'payment' ? 'bg-green-100 dark:bg-green-900' :
                                        activity.type === 'alert' ? 'bg-red-100 dark:bg-red-900' :
                                        'bg-purple-100 dark:bg-purple-900'
                                    }`}>
                                        {activity.type === 'booking' && <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                                        {activity.type === 'payment' && <CreditCardIcon className="h-5 w-5 text-green-600 dark:text-green-400" />}
                                        {activity.type === 'alert' && <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />}
                                        {activity.type === 'waste' && <TrashIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">{activity.message}</span>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600">
                                    {activity.time}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}