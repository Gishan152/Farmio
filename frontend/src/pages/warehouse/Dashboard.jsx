import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/warehouse/Sidebar';
import Header from '../../components/warehouse/Header';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Dummy data
const revenueData = [
  { month: 'Apr', value: 180 },
  { month: 'May', value: 220 },
  { month: 'Jun', value: 245 },
];

const maintenanceAlerts = [
  { id: 1, message: 'Cold Storage C scheduled for maintenance', date: '2024-07-10' },
  { id: 2, message: 'Routine cleaning required in Cold Storage B', date: '2024-07-12' },
];

const Dashboard = () => {
  const [stats] = useState({
    totalFacilities: 3,
    facilities: [
      { id: 1, name: 'Cold Storage A', location: 'Colombo', capacity: 500, currentLoad: 435, status: 'Active' },
      { id: 2, name: 'Cold Storage B', location: 'Kandy', capacity: 200, currentLoad: 180, status: 'Active' },
      { id: 3, name: 'Cold Storage C', location: 'Galle', capacity: 300, currentLoad: 0, status: 'Maintenance' },
    ],
    inventory: { fruits: 400, vegetables: 350, nearExpiry: 18 },
    bookings: { pending: 5, active: 12, completed: 120 },
    recentActivity: [
      { action: 'New booking from Sunil Perera', time: '2h ago', type: 'booking' },
      { action: 'Payment received Rs.45,000', time: '4h ago', type: 'payment' },
      { action: 'Maintenance completed', time: '1d ago', type: 'maintenance' },
    ],
    revenue: { total: 650000, thisMonth: 245000, lastMonth: 220000 },
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);

  // Memoize capacity calculations
  const { totalCapacity, usedCapacity, usedPercent } = useMemo(() => {
    const total = stats.facilities.reduce((a, f) => a + f.capacity, 0);
    const used = stats.facilities.reduce((a, f) => a + f.currentLoad, 0);
    return {
      totalCapacity: total,
      usedCapacity: used,
      usedPercent: Math.round((used / total) * 100),
    };
  }, [stats.facilities]);

  // Chart data for Space Utilization (Doughnut)
  const doughnutData = {
    labels: ['Used', 'Available'],
    datasets: [
      {
        data: [usedCapacity, totalCapacity - usedCapacity],
        backgroundColor: ['#16a34a', '#e5e7eb'],
        borderWidth: 0,
      },
    ],
  };

  // Chart data for Revenue Trends (Bar)
  const barData = {
    labels: revenueData.map(d => d.month),
    datasets: [
      {
        label: 'Revenue (Rs. k)',
        data: revenueData.map(d => d.value),
        backgroundColor: '#16a34a',
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-60 bg-white shadow-lg z-40 transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <Sidebar />
      </div>

      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-green-600 text-white rounded-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      <main className="lg:ml-60 pt-[72px] p-6 sm:p-8 min-h-screen transition-all duration-300">
        {/* Header */}
        <Header
          dashboard={true}
          user={{ name: "Kithmini", profilePic: "/alex.jpg" }}
        />

        {/* KPI Cards */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SmallCard title="Facilities" value={stats.totalFacilities} icon="🏭" />
          <SmallCard title="Occupancy" value={`${usedPercent}%`} icon="📦" />
          <SmallCard title="Active Bookings" value={stats.bookings.active} icon="📅" />
          <SmallCard title="Pending Bookings" value={stats.bookings.pending} icon="⏳" />
        </div>


        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Facilities & Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Facilities Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">Facilities Status</h2>
              <div className="space-y-4">
                {stats.facilities.map(facility => (
                  <button
                    key={facility.id}
                    className="w-full p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-green-50 rounded-lg transition"
                    onClick={() => setSelectedFacility(facility)}
                    aria-label={`View details for ${facility.name}`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-green-900">{facility.name}</h3>
                        <span
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            facility.status === 'Active'
                              ? 'bg-green-100 text-green-700'
                              : facility.status === 'Maintenance'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {facility.status}
                        </span>
                      </div>
                      <p className="text-sm text-green-700 mt-1 flex items-center gap-1">
                        <span className="text-pink-500">●</span> {facility.location}
                      </p>
                    </div>
                    <div className="flex gap-4 text-sm text-green-700">
                      <span>
                        Load: <span className="font-semibold">{facility.currentLoad}T</span>
                      </span>
                      <span>
                        Capacity: <span className="font-semibold">{facility.capacity}T</span>
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Space Utilization */}
              <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
                <h2 className="text-lg font-semibold text-green-800 mb-4">Space Utilization</h2>
                <div className="flex justify-center">
                  <div className="w-48 h-48">
                    <Doughnut
                      data={doughnutData}
                      options={{
                        plugins: {
                          legend: { position: 'bottom', labels: { font: { size: 12 } } },
                          tooltip: { enabled: true },
                        },
                        cutout: '70%',
                      }}
                    />
                  </div>
                </div>
                <div className="text-center text-sm text-green-700 mt-4">
                  {usedCapacity}T / {totalCapacity}T used
                </div>
              </div>

              {/* Revenue Trends */}
              <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
                <h2 className="text-lg font-semibold text-green-800 mb-4">Revenue Trends</h2>
                <div className="h-64">
                  <Bar
                    data={barData}
                    options={{
                      plugins: { legend: { display: false } },
                      scales: {
                        y: { beginAtZero: true, title: { display: true, text: 'Revenue (Rs. k)' } },
                        x: { title: { display: true, text: 'Month' } },
                      },
                    }}
                  />
                </div>
                <div className="mt-4 text-sm text-green-700 space-y-1">
                  <div>
                    This Month: <span className="font-semibold">Rs.{stats.revenue.thisMonth.toLocaleString()}</span>
                  </div>
                  <div>
                    Last Month: <span className="font-semibold">Rs.{stats.revenue.lastMonth.toLocaleString()}</span>
                  </div>
                  <div>
                    Total: <span className="font-semibold">Rs.{stats.revenue.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Bookings, Inventory, Maintenance, Activity */}
          <div className="space-y-6">
            {/* Bookings Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
              <h2 className="text-lg font-semibold text-green-800 mb-4">Bookings Overview</h2>
              <div className="space-y-2 text-sm text-green-700">
                <div>
                  Pending: <span className="font-semibold">{stats.bookings.pending}</span>
                </div>
                <div>
                  Active: <span className="font-semibold">{stats.bookings.active}</span>
                </div>
                <div>
                  Completed: <span className="font-semibold">{stats.bookings.completed}</span>
                </div>
              </div>
            </div>

            {/* Inventory Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
              <h2 className="text-lg font-semibold text-green-800 mb-4">Inventory Breakdown</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-700">Vegetables</span>
                  <span className="font-semibold text-green-900">{stats.inventory.vegetables} items</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-700">Fruits</span>
                  <span className="font-semibold text-green-900">{stats.inventory.fruits} items</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-orange-600">Near Expiry</span>
                  <span className="font-semibold text-orange-700">{stats.inventory.nearExpiry} items</span>
                </div>
              </div>
            </div>

            {/* Maintenance Alerts */}
            <div className="bg-white rounded-xl shadow-sm border border-yellow-200 p-6">
              <h2 className="text-lg font-semibold text-yellow-800 mb-4">Maintenance Alerts</h2>
              {maintenanceAlerts.length === 0 ? (
                <div className="text-sm text-green-700">No upcoming maintenance tasks.</div>
              ) : (
                <ul className="space-y-3">
                  {maintenanceAlerts.map(alert => (
                    <li key={alert.id} className="flex items-center gap-3 text-sm">
                      <span className="text-yellow-600">⚠️</span>
                      <span className="text-green-700">{alert.message}</span>
                      <span className="ml-auto text-xs text-gray-500">{alert.date}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
              <h2 className="text-lg font-semibold text-green-800 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {stats.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === 'booking'
                          ? 'bg-green-600'
                          : activity.type === 'payment'
                          ? 'bg-green-400'
                          : 'bg-green-300'
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm text-green-900 font-medium">{activity.action}</p>
                      <p className="text-xs text-green-700">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Facility Details Modal */}
        {selectedFacility && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-green-800 mb-4">{selectedFacility.name}</h2>
              <div className="space-y-2 text-sm text-green-700">
                <p>
                  <span className="font-semibold">Location:</span> {selectedFacility.location}
                </p>
                <p>
                  <span className="font-semibold">Status:</span> {selectedFacility.status}
                </p>
                <p>
                  <span className="font-semibold">Current Load:</span> {selectedFacility.currentLoad}T
                </p>
                <p>
                  <span className="font-semibold">Capacity:</span> {selectedFacility.capacity}T
                </p>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  onClick={() => setSelectedFacility(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const SmallCard = ({ title, value, icon }) => (
  <div className="bg-green-100 rounded-xl p-5 flex items-center gap-4 shadow-sm border border-green-100 hover:shadow-md transition hover:-translate-y-1">
    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-2xl">
      {icon}
    </div>
    <div>
      <p className="text-l text-black-700">{title}</p>
      <p className="text-2xl font-bold text-black-900">{value}</p>
    </div>
  </div>
);

export default Dashboard;