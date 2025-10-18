import React, { useState, useEffect } from 'react';
import { TruckIcon, CheckCircleIcon, XCircleIcon, MapPinIcon } from '@heroicons/react/24/outline';

const mockLoads = [
  {
    id: 'LD-1052',
    from: 'Anuradhapura',
    to: 'Colombo',
    weight: '25kg',
    payment: 'Rs. 3,000',
    routeMatch: true,
    pickupTime: '2023-05-15 08:30',
    estimatedDelivery: '2023-05-15 14:00',
    product: 'Vegetables'
  },
  {
    id: 'LD-1061',
    from: 'Matara',
    to: 'Kandy',
    weight: '40kg',
    payment: 'Rs. 5,200',
    routeMatch: false,
    pickupTime: '2023-05-16 09:15',
    estimatedDelivery: '2023-05-16 16:30',
    product: 'Fruits'
  },
];

export default function AvailableLoads() {
  const [loads, setLoads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [routeFilter, setRouteFilter] = useState('all');

  useEffect(() => {
    // Simulate fetching loads from backend
    setLoads(mockLoads);
  }, []);

  const handleAccept = (loadId) => {
    setLoads(prevLoads => prevLoads.filter(load => load.id !== loadId));
  };

  const filteredLoads = loads.filter(load => {
    if (searchTerm && !load.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (routeFilter === 'matched' && !load.routeMatch) return false;
    if (routeFilter === 'unmatched' && load.routeMatch) return false;
    return true;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Available Loads</h1>
          <p className="text-gray-600 mt-2">Browse and accept available transportation loads</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Loads</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by load ID..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Route Match</label>
              <select
                value={routeFilter}
                onChange={(e) => setRouteFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              >
                <option value="all">All Loads</option>
                <option value="matched">Matching Route</option>
                <option value="unmatched">Non-Matching Route</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-500">
                <span className="font-semibold">Showing:</span> {filteredLoads.length} of {loads.length} loads
              </div>
            </div>
          </div>
        </div>

        {/* Loads List */}
        {filteredLoads.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
            <div className="text-4xl mb-4">🚛</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Loads Available</h3>
            <p className="text-gray-500">
              {loads.length === 0 
                ? "There are currently no loads available for transport." 
                : "No loads match your current filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredLoads.map((load) => (
              <div key={load.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
                {/* Load Header */}
                <div className={`px-6 py-4 ${load.routeMatch ? 'bg-green-50 border-b border-green-100' : 'bg-gray-50 border-b border-gray-100'}`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${load.routeMatch ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <TruckIcon className={`h-6 w-6 ${load.routeMatch ? 'text-green-600' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">{load.id}</h2>
                        <p className={`text-sm ${load.routeMatch ? 'text-green-600' : 'text-gray-600'}`}>
                          {load.routeMatch ? 'ROUTE MATCH' : 'OTHER ROUTE'}
                        </p>
                      </div>
                    </div>
                    <div className="text-xl font-bold">
                      {load.payment}
                    </div>
                  </div>
                </div>

                {/* Load Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Route */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">Route</h3>
                      <div className="flex items-center space-x-2">
                        <MapPinIcon className="h-5 w-5 text-red-500" />
                        <span className="font-medium">{load.from}</span>
                        <span className="text-gray-400">→</span>
                        <MapPinIcon className="h-5 w-5 text-green-500" />
                        <span className="font-medium">{load.to}</span>
                      </div>
                    </div>

                    {/* Weight */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">Weight</h3>
                      <p className="font-medium">{load.weight}</p>
                    </div>

                    {/* Produce */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">Product</h3>
                      <p className="font-medium">{load.product}</p>
                    </div>

                    {/* Schedule */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">Schedule</h3>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Pickup:</span> {new Date(load.pickupTime).toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit'})}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Delivery:</span> {new Date(load.estimatedDelivery).toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={() => handleAccept(load.id)}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                      <span>Accept</span>
                    </button>
                    <button
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <XCircleIcon className="h-5 w-5" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}