import React, { useState } from 'react';
import Sidebar from '../../components/warehouse/Sidebar';

// Dummy chart bar heights for revenue
const revenueData = [
  { month: 'Apr', value: 180 },
  { month: 'May', value: 220 },
  { month: 'Jun', value: 245 }
];

const Dashboard = () => {
  const [stats] = useState({
    totalFacilities: 3,
    occupancyRate: 87,
    monthlyRevenue: 245000,
    maintenanceAlerts: 1,
    facilities: [
      { id: 1, name: "Cold Storage A", location: "Colombo", capacity: "500T", currentLoad: "435T", status: "Active" },
      { id: 2, name: "Grain Storage B", location: "Kandy", capacity: "200T", currentLoad: "180T", status: "Green" },
      { id: 3, name: "Processing Hub C", location: "Galle", capacity: "300T", currentLoad: "0T", status: "Maintenance" }
    ],
    recentActivity: [
      { action: "New booking from Sunil Perera", time: "2h ago", type: "booking" },
      { action: "Payment received Rs.45,000", time: "4h ago", type: "payment" },
      { action: "Maintenance completed", time: "1d ago", type: "maintenance" }
    ],
    notifications: [
      { message: "Maintenance scheduled for Processing Hub C", type: "alert" },
      { message: "All systems operational", type: "success" },
      { message: "New booking request received", type: "info" }
    ]
  });

  // Calculate total and used capacity
  const totalCapacity = stats.facilities.reduce((a, f) => a + parseInt(f.capacity), 0);
  const usedCapacity = stats.facilities.reduce((a, f) => a + parseInt(f.currentLoad), 0);
  const usedPercent = Math.round((usedCapacity / totalCapacity) * 100);

  return (
    <div className="flex bg-green-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-green-900 flex items-center gap-2">
              <span role="img" aria-label="warehouse">🏭</span> Warehouse Owner Dashboard
            </h1>
            <p className="text-lg text-green-800 mt-1">Warehouse Management Overview</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800 transition text-base font-semibold shadow">
              + New Booking
            </button>
            <button className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition text-base font-semibold shadow">
              + Add Facility
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SmallCard title="Facilities" value={stats.totalFacilities} icon="🏭" />
          <SmallCard title="Occupancy" value={`${stats.occupancyRate}%`} icon="📦" />
          <SmallCard title="Revenue" value={`Rs${(stats.monthlyRevenue/1000)}k`} icon="💰" />
          <SmallCard title="Alerts" value={stats.maintenanceAlerts} icon="⚠️" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Facilities & Charts */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Facilities */}
            <div className="bg-white rounded-2xl shadow border border-green-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-green-800">Storage Facilities</h2>
                <button className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 transition text-sm font-semibold">
                  + Add
                </button>
              </div>
              <div className="divide-y divide-green-50">
                {stats.facilities.map(facility => (
                  <div key={facility.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-green-50 transition rounded">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-green-900">{facility.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          facility.status === 'Active' || facility.status === 'Green'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {facility.status}
                        </span>
                      </div>
                      <p className="text-xs text-green-700 mt-1 flex items-center gap-1">
                        <span className="text-pink-500">●</span> {facility.location}
                      </p>
                    </div>
                    <div className="flex gap-4 text-sm text-green-700">
                      <span>Load: <span className="font-bold">{facility.currentLoad}</span></span>
                      <span>Capacity: <span className="font-bold">{facility.capacity}</span></span>
                    </div>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <button className="bg-green-100 text-green-700 px-4 py-1 rounded text-xs font-semibold hover:bg-green-200 transition">View</button>
                      <button className="bg-gray-100 text-green-700 px-4 py-1 rounded text-xs font-semibold hover:bg-gray-200 transition">Manage</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Capacity Indicator */}
              <div className="bg-white rounded-2xl shadow border border-green-100 p-6 flex flex-col items-center">
                <h2 className="text-lg font-bold text-green-800 mb-3">Capacity Usage</h2>
                <div className="flex flex-col items-center">
                  <div className="relative w-28 h-28 mb-2">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <circle
                        className="text-green-100"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        cx="18" cy="18" r="16"
                      />
                      <circle
                        className="text-green-600"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${usedPercent},100`}
                        cx="18" cy="18" r="16"
                        style={{ strokeLinecap: 'round', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-green-700">{usedPercent}%</span>
                  </div>
                  <div className="text-base text-green-700 font-medium">
                    {usedCapacity}T / {totalCapacity}T used
                  </div>
                </div>
              </div>
              {/* Revenue Chart */}
              <div className="bg-white rounded-2xl shadow border border-green-100 p-6">
                <h2 className="text-lg font-bold text-green-800 mb-3">Monthly Revenue</h2>
                <div className="flex items-end gap-5 h-32 mt-4">
                  {revenueData.map((d, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className="w-8 rounded-t bg-green-600"
                        style={{ height: `${d.value / 2.5}px` }}
                        title={`Rs${d.value}k`}
                      ></div>
                      <span className="text-xs text-green-700 mt-2">{d.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Activity & Notifications */}
          <div className="flex flex-col gap-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow border border-green-100 p-6">
              <h2 className="text-lg font-bold text-green-800 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded hover:bg-green-50 transition">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'booking' ? 'bg-green-600' :
                      activity.type === 'payment' ? 'bg-green-400' : 'bg-green-300'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-green-900 font-medium">{activity.action}</p>
                      <p className="text-xs text-green-700">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Notifications - pushed to bottom */}
            <div className="flex-1"></div>
            <div className="bg-white rounded-2xl shadow border border-green-100 p-6 mt-4">
              <h2 className="text-lg font-bold text-green-800 mb-4">Notifications</h2>
              <ul className="space-y-3">
                {stats.notifications.map((n, i) => (
                  <li key={i} className={`text-sm flex items-center gap-2 font-medium ${
                    n.type === 'alert' ? 'text-red-600' :
                    n.type === 'success' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {n.type === 'alert' && <span>⚠️</span>}
                    {n.type === 'success' && <span>✅</span>}
                    {n.type === 'info' && <span>🛈</span>}
                    {n.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Compact Card Component
const SmallCard = ({ title, value, icon }) => (
  <div className="rounded-xl p-5 flex items-center gap-4 shadow border border-green-100 bg-green-100 hover:shadow-md transition">
    <div className="w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-inner text-2xl">
      {icon}
    </div>
    <div>
      <p className="text-sm text-green-700">{title}</p>
      <p className="text-2xl font-bold text-green-900">{value}</p>
    </div>
  </div>
);

export default Dashboard;