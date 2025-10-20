import { useState, useEffect } from 'react';
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
import { Line } from 'react-chartjs-2';
import warehouseAPI from '../../../API/warehouse';
import bookingsAPI from '../../../API/bookings';
import slotsAPI from '../../../API/slots';
import { useWarehouseContext } from '../../../Contexts/Warehouse/WarehouseContext';

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

// Utility functions for date and number formatting
const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if date is today or yesterday
    if (date.toDateString() === today.toDateString()) {
        return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
        // Format date based on how far in the past it is
        const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 7) {
            // Less than a week ago
            const options = { weekday: 'long', hour: '2-digit', minute: '2-digit' };
            return date.toLocaleDateString('en-US', options);
        } else if (diffDays < 365) {
            // Less than a year ago
            const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            return date.toLocaleDateString('en-US', options);
        } else {
            // More than a year ago
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        }
    }
};

export default function Dashboard() {
    const { warehouses, loadWarehouses } = useWarehouseContext();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalEarnings: 0,
        occupancyRate: 0,
        pendingBookings: 0,
        maintenanceAlerts: 0,
        totalFacilities: 0,
        activeBookings: 0
    });

    const [facilities, setFacilities] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [pendingBookings, setPendingBookings] = useState([]);
    const [revenueHistory, setRevenueHistory] = useState([]);

    // Fetch warehouse data and stats
    useEffect(() => {
        const fetchDashboardData = async () => {
                setIsLoading(true);
            try {
                // Load warehouses if not already loaded
                if (warehouses.length === 0) {
                    await loadWarehouses();
                }

                // Fetch booking stats
                const statsResponse = await bookingsAPI.getBookingStats();
                const bookingStats = statsResponse.data || {};
                setError(null);                // Fetch facilities data for each warehouse
                const facilitiesData = [];
                let totalOccupied = 0;
                let totalCapacity = 0;
                
                // Use warehouses from context or fetch them if needed
                const warehousesData = warehouses.length > 0 ? warehouses : 
                    (await warehouseAPI.getWarehouses()).data || [];
                
                // Process each warehouse to get capacity data
                for (const warehouse of warehousesData) {
                    try {
                        // Log the warehouse data to check available fields
                        console.log("Warehouse data:", JSON.stringify(warehouse));
                        
                        const capacityResponse = await warehouseAPI.getWarehouseCapacity(warehouse.id);
                        const capacityData = capacityResponse.data || {};
                        
                        // Calculate temperature status and ranges
                        const getTemperatureStatus = (temp) => {
                            const temperature = temp || 10; // default if not available
                            
                            // Define temperature ranges with min and max values
                            if (temperature < 2) {
                                return { 
                                    value: temperature, 
                                    status: 'critical', 
                                    message: 'Too Cold',
                                    range: '0-2°C',
                                    idealRange: '4-15°C'
                                };
                            }
                            
                            if (temperature > 18) {
                                return { 
                                    value: temperature, 
                                    status: 'critical', 
                                    message: 'Too Hot',
                                    range: '18-25°C',
                                    idealRange: '4-15°C'
                                };
                            }
                            
                            if (temperature < 4 || temperature > 15) {
                                return { 
                                    value: temperature, 
                                    status: 'warning', 
                                    message: 'Suboptimal',
                                    range: temperature < 4 ? '2-4°C' : '15-18°C',
                                    idealRange: '4-15°C'
                                };
                            }
                            
                            return { 
                                value: temperature, 
                                status: 'normal', 
                                message: 'Optimal',
                                range: '4-15°C',
                                idealRange: '4-15°C'
                            };
                        };
                        
                        // Calculate capacity usage
                        const currentCap = capacityData.currentCapacity || 0;
                        const totalCap = capacityData.totalCapacity || 1000;
                        
                        // Get temperature data with status
                        const temperatureData = getTemperatureStatus(capacityData.temperature);
                        
                        // Parse location details - simplify to just city
                        let cityName = "Unknown";
                        
                        // Prioritize direct city field first
                        console.log("City field:", warehouse.city);
                        if (warehouse.city) {
                            // Direct city property from the database
                            cityName = warehouse.city;
                        } else if (warehouse.location) {
                            // Fallback: Extract from location string (format: "City, Region, Country")
                            const locationParts = warehouse.location.split(',');
                            if (locationParts.length > 0) {
                                cityName = locationParts[0].trim();
                            }
                        } else if (warehouse.address) {
                            // Fallback: Extract from address object/string
                            if (typeof warehouse.address === 'object' && warehouse.address.city) {
                                cityName = warehouse.address.city;
                            } else if (typeof warehouse.address === 'string') {
                                const addressParts = warehouse.address.split(',');
                                if (addressParts.length > 0) {
                                    cityName = addressParts[0].trim();
                                }
                            }
                        }
                        
                        // Fallback to warehouse name if no location found
                        if (cityName === "Unknown" && warehouse.name) {
                            // Try to extract location from name (e.g. "Colombo Fresh Warehouse")
                            const commonCities = ["Colombo", "Kandy", "Galle", "Jaffna", "Trincomalee", "Batticaloa", 
                                                "Anuradhapura", "Negombo", "Kalmunai", "Matara"];
                            for (const city of commonCities) {
                                if (warehouse.name.includes(city)) {
                                    cityName = city;
                                    break;
                                }
                            }
                        }
                        
                        // Determine storage type from warehouse name or default to "Storage"
                        let storageType = "Storage";
                        const name = warehouse.name || "";
                        
                        if (name.toLowerCase().includes("produce")) {
                            storageType = "Dry Storage";
                        } else if (name.toLowerCase().includes("fresh")) {
                            storageType = "Cold Storage";
                        } else if (name.toLowerCase().includes("dry")) {
                            storageType = "Dry Storage";
                        } else if (name.toLowerCase().includes("green")) {
                            storageType = "Cold Storage";
                        } else if (name.toLowerCase().includes("cold")) {
                            storageType = "Cold Storage";
                        }
                        
                        // Build facility data object with simplified fields
                        facilitiesData.push({
                            id: warehouse.id,
                            name: warehouse.name,
                            currentCapacity: currentCap,
                            totalCapacity: totalCap,
                            status: capacityData.status || "operational",
                            temperature: temperatureData.value,
                            temperatureStatus: temperatureData.status,
                            city: cityName,
                            storageType: storageType
                        });
                        
                        totalOccupied += currentCap;
                        totalCapacity += totalCap;
                    } catch (error) {
                        console.error(`Error fetching capacity for warehouse ${warehouse.id}:`, error);
                    }
                }
                
                // Log the final facilities data to check city values
                console.log("Final facilities data:", facilitiesData.map(f => ({ id: f.id, name: f.name, city: f.city })));
                
                setFacilities(facilitiesData);

                // Fetch pending booking requests
                let pendingBookingData = [];
                for (const warehouse of warehousesData) {
                    try {
                        const bookingResponse = await slotsAPI.getBookingRequests(warehouse.id, 'pending');
                        const bookings = bookingResponse.data || [];
                        
                        pendingBookingData = [...pendingBookingData, ...bookings.map(booking => ({
                            id: booking.id || `BK-${Math.floor(Math.random() * 1000)}`,
                            farmer: booking.farmerName || booking.userId || "Unknown Farmer",
                            produce: booking.produceType || "Mixed Produce",
                            quantity: `${booking.quantity || 0}kg`,
                            facility: warehousesData.find(w => w.id === booking.warehouseId)?.name || "Unknown"
                        }))];
                    } catch (error) {
                        console.error(`Error fetching bookings for warehouse ${warehouse.id}:`, error);
                    }
                }
                
                setPendingBookings(pendingBookingData);
                
                // Calculate occupancy rate
                const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;
                
                // Set stats
                setStats({
                    totalEarnings: bookingStats.totalRevenue || 0,
                    occupancyRate: occupancyRate,
                    pendingBookings: pendingBookingData.length,
                    maintenanceAlerts: bookingStats.maintenanceAlerts || 0,
                    totalFacilities: facilitiesData.length,
                    activeBookings: bookingStats.activeBookings || 0
                });
                
                // Set recent activity based on booking history
                const recentActivityData = [];
                // We would normally fetch this from a dedicated activity API
                // For now, let's use some placeholder data based on booking stats
                if (bookingStats.recentBookings && bookingStats.recentBookings.length) {
                    bookingStats.recentBookings.forEach(booking => {
                        recentActivityData.push({
                            id: booking.id,
                            message: `New booking from ${booking.farmerName || 'Farmer'} - ${booking.produceType || 'Produce'} ${booking.quantity || ''}kg`,
                            time: formatDate(booking.createdAt),
                            type: "booking"
                        });
                    });
                    
                    // Add payment activities if available
                    if (bookingStats.recentPayments && bookingStats.recentPayments.length) {
                        bookingStats.recentPayments.forEach(payment => {
                            recentActivityData.push({
                                id: `payment-${payment.id}`,
                                message: `Payment received - Rs. ${payment.amount ? payment.amount.toLocaleString() : 0}`,
                                time: formatDate(payment.createdAt),
                                type: "payment"
                            });
                        });
                    }
                } else {
                    // Placeholder data if we don't have real activity data
                    const today = new Date();
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);
                    
                    recentActivityData.push(
                        { 
                            id: 1, 
                            message: "New booking from Farmer Kumara - Rice 500kg", 
                            time: formatDate(today.toISOString()), 
                            type: "booking" 
                        },
                        { 
                            id: 2, 
                            message: "Payment received - Rs. 17,500", 
                            time: formatDate(yesterday.toISOString()), 
                            type: "payment" 
                        }
                    );
                }
                
                setRecentActivity(recentActivityData);
                
                // Set revenue history from stats
                if (bookingStats.revenueHistory && bookingStats.revenueHistory.length) {
                    setRevenueHistory(bookingStats.revenueHistory);
                } else {
                    // Placeholder revenue history if we don't have real data
                    const totalRevenue = bookingStats.totalRevenue || 0;
                    setRevenueHistory([
                        { month: 'Jul', value: 25000 },
                        { month: 'Aug', value: 32000 },
                        { month: 'Sep', value: 28000 },
                        { month: 'Oct', value: 45000 },
                        { month: 'Nov', value: 38000 },
                        { month: 'Dec', value: 42000 },
                        { month: 'Jan', value: totalRevenue }
                    ]);
                }
                
            } catch (err) {
                console.error("Error loading dashboard data:", err);
                setError(err.message || "Failed to load dashboard data");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchDashboardData();
    }, [warehouses, loadWarehouses]);

    // Prepare chart data
    const revenueData = {
        labels: revenueHistory.map(item => item.month),
        datasets: [{
            label: 'Revenue (Rs.)',
            data: revenueHistory.map(item => item.value),
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
        }]
    };

    if (isLoading) {
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
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
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
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
                        <p className="font-medium">Error loading dashboard data</p>
                        <p className="text-sm">{error}</p>
                        <button 
                            className="mt-2 px-3 py-1 bg-red-100 text-red-800 text-sm rounded-md hover:bg-red-200"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                                    <h3 className="font-semibold text-lg text-gray-900 mb-3">{facility.name}</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <div className="p-1.5 rounded-md bg-purple-100">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                                                    className="w-5 h-5 text-purple-600">
                                                    <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" />
                                                    <path fillRule="evenodd" d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.163 3.75A.75.75 0 0110 12h4a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="ml-3 font-medium text-gray-800">{facility.storageType || 'General Storage'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="p-1.5 rounded-md bg-blue-100">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                                                    className="w-5 h-5 text-blue-600">
                                                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="ml-3 font-medium text-gray-800">{facility.city}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Capacity Usage */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Capacity Usage</h3>
                        <div className="space-y-6">
                            {facilities.map((facility) => {
                                // Calculate capacity usage percentage
                                const usagePercent = Math.round((facility.currentCapacity / facility.totalCapacity) * 100);
                                
                                // Generate color based on usage percentage
                                const getColor = (percent) => {
                                    if (percent < 50) return '#10B981'; // green for low usage
                                    if (percent < 75) return '#F59E0B'; // amber for medium usage
                                    return '#EF4444'; // red for high usage
                                };
                                
                                // Format capacity numbers with commas
                                const formatCapacity = (value) => {
                                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                };
                                
                                return (
                                    <div key={facility.id} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-800">{facility.name}</span>
                                            <span className="text-sm font-semibold" style={{ color: getColor(usagePercent) }}>
                                                {usagePercent}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div 
                                                className="rounded-full h-3" 
                                                style={{ 
                                                    width: `${usagePercent}%`, 
                                                    backgroundColor: getColor(usagePercent),
                                                    transition: 'width 1s ease-in-out'
                                                }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Current: {formatCapacity(facility.currentCapacity)}kg</span>
                                            <span>Total: {formatCapacity(facility.totalCapacity)}kg</span>
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {/* Overall capacity summary */}
                            {facilities.length > 0 && (
                                <div className="mt-6 pt-4 border-t">
                                    <h4 className="font-medium text-gray-800 mb-2">Overall Capacity</h4>
                                    {(() => {
                                        // Calculate overall capacity usage
                                        const totalUsed = facilities.reduce((sum, f) => sum + f.currentCapacity, 0);
                                        const totalCapacity = facilities.reduce((sum, f) => sum + f.totalCapacity, 0);
                                        const overallPercent = Math.round((totalUsed / totalCapacity) * 100);
                                        
                                        // Determine status text based on percentage
                                        const getStatusText = (percent) => {
                                            if (percent < 50) return 'Low Utilization';
                                            if (percent < 75) return 'Moderate Utilization';
                                            if (percent < 90) return 'High Utilization';
                                            return 'Critical Utilization';
                                        };
                                        
                                        const statusColor = overallPercent < 50 ? 'text-green-600' : 
                                                          overallPercent < 75 ? 'text-amber-600' : 
                                                          'text-red-600';
                                        
                                        return (
                                            <div className="flex flex-col">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className={`font-medium ${statusColor}`}>
                                                        {getStatusText(overallPercent)}
                                                    </span>
                                                    <span className="text-lg font-bold">{overallPercent}%</span>
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {totalUsed.toLocaleString()}kg used of {totalCapacity.toLocaleString()}kg total
                                                </span>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}
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