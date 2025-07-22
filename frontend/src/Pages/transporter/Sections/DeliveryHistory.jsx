import React, { useState, useEffect } from 'react';
import { 
  TruckIcon,
  MapPinIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const mockDeliveries = [
  {
    id: 'LD-6101',
    from: 'Anuradhapura',
    to: 'Colombo',
    weight: '25kg',
    farmer: 'Sunil Perera',
    buyer: 'Nimal Jayasena',
    deliveredOn: '2025-07-10 14:30',
    status: 'Delivered',
    payment: 'Rs. 3,500',
    produce: 'Tomatoes',
    distance: '205 km',
    duration: '4 hours 30 mins',
    notes: 'Delivered in good condition'
  },
  {
    id: 'LD-6102',
    from: 'Kurunegala',
    to: 'Galle',
    weight: '50kg',
    farmer: 'Kumari Silva',
    buyer: 'Suresh Gunasekara',
    deliveredOn: '2025-07-08 10:00',
    status: 'Delivered',
    payment: 'Rs. 5,200',
    produce: 'Bananas',
    distance: '180 km',
    duration: '3 hours 45 mins',
    notes: 'Early delivery, buyer satisfied'
  },
  {
    id: 'LD-6103',
    from: 'Matale',
    to: 'Kalutara',
    weight: '35kg',
    farmer: 'Ruwan Fernando',
    buyer: 'Tharindu Ekanayake',
    deliveredOn: '2025-07-05 17:00',
    status: 'Canceled',
    payment: 'Rs. 4,100',
    produce: 'Carrots',
    distance: '120 km',
    duration: '2 hours 30 mins',
    notes: 'Canceled by buyer due to quality issues'
  },
];

export default function DeliveryHistory() {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Replace with API call
    setDeliveries(mockDeliveries);
  }, []);

  const filteredDeliveries = deliveries.filter(delivery => {
    if (searchTerm && !delivery.id.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && delivery.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      case 'Canceled':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  const formatDateTime = (dateTime) => {
    const [date, time] = dateTime.split(' ');
    return (
      <div className="flex items-center">
        <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
        <span className="mr-3">{date}</span>
        <ClockIcon className="h-4 w-4 mr-1 text-gray-500" />
        <span>{time}</span>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Delivery History</h1>
          <p className="text-gray-600 mt-2">
            {selectedDelivery ? 'Delivery details' : 'View your past deliveries'}
          </p>
        </div>

        {selectedDelivery ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {/* Back Button */}
            <div className="px-6 py-4 border-b border-gray-200">
              <button
                onClick={() => setSelectedDelivery(null)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to deliveries
              </button>
            </div>

            {/* Delivery Details */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedDelivery.id}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedDelivery.status === 'Delivered' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedDelivery.status}
                  </span>
                </div>
                <div className="text-lg font-bold">{selectedDelivery.payment}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Route Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 text-red-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">From</p>
                          <p className="font-medium">{selectedDelivery.from}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 text-green-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">To</p>
                          <p className="font-medium">{selectedDelivery.to}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <TruckIcon className="h-5 w-5 text-blue-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Distance & Duration</p>
                          <p className="font-medium">
                            {selectedDelivery.distance} • {selectedDelivery.duration}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Delivery Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Produce</p>
                        <p className="font-medium">{selectedDelivery.produce}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Weight</p>
                        <p className="font-medium">{selectedDelivery.weight}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Delivered On</p>
                        <div className="font-medium">
                          {formatDateTime(selectedDelivery.deliveredOn)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Parties Involved</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <UserIcon className="h-5 w-5 text-purple-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Farmer</p>
                          <p className="font-medium">{selectedDelivery.farmer}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <UserIcon className="h-5 w-5 text-indigo-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Buyer</p>
                          <p className="font-medium">{selectedDelivery.buyer}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Notes</h3>
                    <div className="p-3 bg-white rounded border border-gray-200">
                      <p className="text-gray-700">{selectedDelivery.notes}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Delivery Status</h3>
                    <div className="flex items-center">
                      {selectedDelivery.status === 'Delivered' ? (
                        <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
                      ) : (
                        <XCircleIcon className="h-8 w-8 text-red-500 mr-3" />
                      )}
                      <div>
                        <p className="font-medium">{selectedDelivery.status}</p>
                        <p className="text-sm text-gray-500">
                          {selectedDelivery.status === 'Delivered' 
                            ? 'Successfully delivered' 
                            : 'Delivery was canceled'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by load ID..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <p className="text-sm text-gray-500">
                    Showing {filteredDeliveries.length} of {deliveries.length} deliveries
                  </p>
                </div>
              </div>
            </div>

            {/* Deliveries List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Load ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Route
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parties
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDeliveries.map((delivery) => {
                      const statusColor = getStatusColor(delivery.status);
                      return (
                        <tr 
                          key={delivery.id} 
                          className="hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => setSelectedDelivery(delivery)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            {delivery.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <MapPinIcon className="h-4 w-4 text-red-500 mr-1" />
                              <span className="mr-2">{delivery.from}</span>
                              <span className="text-gray-400">→</span>
                              <MapPinIcon className="h-4 w-4 text-green-500 ml-2 mr-1" />
                              <span>{delivery.to}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <UserIcon className="h-4 w-4 text-purple-500 mr-1" />
                              <span className="mr-2">{delivery.farmer}</span>
                              <span className="text-gray-400">→</span>
                              <UserIcon className="h-4 w-4 text-indigo-500 ml-2 mr-1" />
                              <span>{delivery.buyer}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">Weight</p>
                                <p className="font-medium">{delivery.weight}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="font-medium">
                                  {delivery.deliveredOn.split(' ')[0]}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}>
                              {delivery.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}