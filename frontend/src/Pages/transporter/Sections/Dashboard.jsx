import { useState } from 'react';
import { 
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import api from '../../../API/client';

export default function Dashboard() {
  // Sample data
  const [stats] = useState({
    activeLoads: 3,
    completedDeliveries: 21,
    assignedLoads: 2,
    monthlyIncome: 48500,
    incomeGoal: 75000
  });

  const [assignedDeliveries] = useState([
    {
      id: "LD-1023",
      from: "Anuradhapura",
      to: "Colombo",
      weight: "25kg",
      status: "in-transit",
      pickupTime: "2023-05-15 08:30",
      estimatedDelivery: "2023-05-15 14:00"
    },
    {
      id: "LD-1024",
      from: "Polonnaruwa",
      to: "Gampaha",
      weight: "40kg",
      status: "picked-up",
      pickupTime: "2023-05-15 09:15",
      estimatedDelivery: "2023-05-15 16:30"
    }
  ]);

  const [recentActivity] = useState([
    { id: 1, message: "Load LD-1023 picked up from Anuradhapura", time: "2 hours ago", type: "pickup" },
    { id: 2, message: "Payment received for delivery #DL-0042 - Rs. 12,500", time: "1 day ago", type: "payment" },
    { id: 3, message: "New delivery assigned - LD-1024 (Polonnaruwa to Gampaha)", time: "1 day ago", type: "assignment" },
    { id: 4, message: "Delivery completed - LD-1019 (Kandy to Colombo)", time: "2 days ago", type: "delivery" }
  ]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-left">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, Chamath 
          </h1>
          <p className="text-gray-600 mt-1">
            Overview of your transport operations
          </p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <TruckIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Loads</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.activeLoads}
                </p>
                <p className="text-xs text-green-600 mt-1">Currently on the road</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <CheckCircleIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Deliveries</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedDeliveries}</p>
                <p className="text-xs text-blue-600 mt-1">This month</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-yellow-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                <ClockIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned Loads</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.assignedLoads}</p>
                <p className="text-xs text-yellow-600 mt-1">Awaiting pickup</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <CurrencyDollarIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Income</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  Rs. {stats.monthlyIncome.toLocaleString()}
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" 
                    style={{ width: `${(stats.monthlyIncome / stats.incomeGoal) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-purple-600 mt-1">
                  {Math.round((stats.monthlyIncome / stats.incomeGoal) * 100)}% of Rs. {stats.incomeGoal.toLocaleString()} goal
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Assigned Deliveries */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <TruckIcon className="h-6 w-6 text-blue-500 mr-2" />
              Assigned Deliveries
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium dark:bg-blue-900 dark:text-blue-200">
                {assignedDeliveries.length} Active
              </span>
            </h2>
          </div>
          
          <div className="space-y-4">
            {assignedDeliveries.map(delivery => (
              <div key={delivery.id} className="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-md transition-all duration-300 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{delivery.id}</h3>
                    <div className="flex items-center mt-2">
                      <MapPinIcon className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {delivery.from} → {delivery.to}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    delivery.status === 'in-transit' 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                      : delivery.status === 'picked-up'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {delivery.status === 'in-transit' ? 'IN TRANSIT' : 
                     delivery.status === 'picked-up' ? 'PICKED UP' : 'DELIVERED'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Weight</div>
                    <div className="text-lg font-bold text-blue-900 dark:text-blue-100">{delivery.weight}</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-100 dark:border-purple-800">
                    <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Est. Delivery</div>
                    <div className="text-lg font-bold text-purple-900 dark:text-purple-100">
                      {new Date(delivery.estimatedDelivery).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Pickup:</span> {new Date(delivery.pickupTime).toLocaleString()}
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium hover:bg-green-200 transition-colors dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800">
                        Update Status
                      </button>
                      <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <ArrowPathIcon className="h-6 w-6 text-indigo-500 mr-2" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'pickup' ? 'bg-blue-100 dark:bg-blue-900' :
                    activity.type === 'payment' ? 'bg-green-100 dark:bg-green-900' :
                    activity.type === 'assignment' ? 'bg-yellow-100 dark:bg-yellow-900' :
                    'bg-purple-100 dark:bg-purple-900'
                  }`}>
                    {activity.type === 'pickup' && <TruckIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                    {activity.type === 'payment' && <CurrencyDollarIcon className="h-5 w-5 text-green-600 dark:text-green-400" />}
                    {activity.type === 'assignment' && <CheckBadgeIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />}
                    {activity.type === 'delivery' && <CheckCircleIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
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