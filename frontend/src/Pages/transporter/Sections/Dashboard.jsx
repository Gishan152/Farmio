import React from 'react';

export default function Dashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Welcome back, Hanifa 👋</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
          <h2 className="text-sm text-gray-500 mb-1">Active Loads</h2>
          <p className="text-2xl font-semibold text-green-600">3</p>
        </div>

        <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
          <h2 className="text-sm text-gray-500 mb-1">Completed Deliveries</h2>
          <p className="text-2xl font-semibold text-blue-600">21</p>
        </div>

        <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
          <h2 className="text-sm text-gray-500 mb-1">Assigned Loads</h2>
          <p className="text-2xl font-semibold text-yellow-600">2</p>
        </div>

        <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
          <h2 className="text-sm text-gray-500 mb-2">Income This Month</h2>
          <p className="text-2xl font-semibold text-purple-600 mb-2">Rs. 48,500</p>
          <div className="w-full h-2 bg-gray-200 rounded">
            <div className="h-2 bg-purple-500 rounded" style={{ width: '65%' }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Goal: Rs. 75,000</p>
        </div>
      </div>

      {/* Assigned Deliveries Table */}
      <div className="bg-white rounded-xl shadow border border-gray-100">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Assigned Deliveries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Load ID</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">From</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">To</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Weight</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-6 py-4 font-medium">LD-1023</td>
                <td className="px-6 py-4">Anuradhapura</td>
                <td className="px-6 py-4">Colombo</td>
                <td className="px-6 py-4">25kg</td>
                <td className="px-6 py-4">
                  <span className="text-xs text-white bg-yellow-500 px-2 py-1 rounded-full">In Transit</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium">LD-1024</td>
                <td className="px-6 py-4">Polonnaruwa</td>
                <td className="px-6 py-4">Gampaha</td>
                <td className="px-6 py-4">40kg</td>
                <td className="px-6 py-4">
                  <span className="text-xs text-white bg-green-500 px-2 py-1 rounded-full">Picked Up</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
