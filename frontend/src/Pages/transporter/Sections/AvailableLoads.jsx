import React, { useState, useEffect } from 'react';
import { TruckIcon, CheckCircleIcon, XCircleIcon, MapPinIcon } from '@heroicons/react/24/outline';
import api from '../../../API/client';
import {useUserContext} from '../../../Contexts/UserContext'

// const mockLoads = [
//   {
//     id: 'LD-1052',
//     from: 'Anuradhapura',
//     to: 'Colombo',
//     weight: '25kg',
//     payment: 'Rs. 3,000',
//     pickupTime: '2023-05-15 08:30',
//     estimatedDelivery: '2023-05-15 14:00',
//     product: 'Vegetables'
//   },
//   {
//     id: 'LD-1061',
//     from: 'Matara',
//     to: 'Kandy',
//     weight: '40kg',
//     payment: 'Rs. 5,200',
//     pickupTime: '2023-05-16 09:15',
//     estimatedDelivery: '2023-05-16 16:30',
//     product: 'Fruits'
//   },
// ];

export async function AvailableLoadsLoader() {
  try {
    // Fetch all loads - filter for available/pending loads
    const response = await api.get("/api/transport/getAllLoads");
    console.log("Raw API Response:", response.data);

    // Filter for loads that are pending and not yet assigned to a driver
    const loads = response.data.filter(load => 
      load.driverStatus?.toLowerCase() === "pending" && !load.driverId
    );
    console.log("Filtered Loads (pending & unassigned):", loads);

    // Transform data into frontend-friendly structure
    const transformedLoads = loads.map((load) => ({
      id: load.id,
      loadId: load.loadId,
      from: load.fromLocation,
      to: load.toLocation,
      weight: `${load.weight} kg`,
      payment: `Rs. ${load.payment?.toLocaleString()}`,
      pickupTime: load.pickupTime,
      estimatedDelivery: load.estimatedDelivery,
      product: load.product,
      seller: load.seller,
      buyer: load.buyer,
      driverStatus: load.driverStatus,
      buyerStatus: load.buyerStatus,
      sellerStatus: load.sellerStatus,
    }));
    
    console.log("Transformed Loads for Display:", transformedLoads);
    return transformedLoads;
  } catch (error) {
    console.error("Failed to fetch available loads:", error);
    return [];
  }
}

export default function AvailableLoads() {
  
  const [loads, setLoads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useUserContext();

  useEffect(() => {
    const fetchLoads = async () => {
      const data = await AvailableLoadsLoader();
      console.log("Available Loads Set to State:", data);
      setLoads(data);
    };
    fetchLoads();
  }, []);

  const handleAccept = async(loadId) => {
    try {
      const driverId = user?.id;
      
      if (!driverId) {
        alert("Driver ID not found. Please log in again.");
        return;
      }

      await api.put(`/api/transport/acceptLoadDriver/${loadId}/${driverId}`);

      // Remove the accepted load from the list
      setLoads(prevLoads => prevLoads.filter(load => load.id !== loadId));
      
      // alert("Load accepted successfully!");

    } catch (error) {
      console.error("Failed to accept load:", error);
      alert("Failed to accept load. Please try again.");
    }
  };

  const filteredLoads = loads.filter(load =>
    !searchTerm || 
    load.loadId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    load.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    load.to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    load.product?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Loads</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by load ID..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              />
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
              <div
                key={load.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                {/* Load Header */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-gray-100">
                        <TruckIcon className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">{load.loadId}</h2>
                        <p className="text-sm text-gray-600">Available for Transport</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600">
                        {load.payment}
                      </div>
                      <div className="text-sm text-gray-500">
                        {load.weight}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Load Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* Route */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">Route</h3>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <MapPinIcon className="h-4 w-4 text-green-500" />
                          <span className="font-medium text-sm">{load.from}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400 ml-4">↓</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPinIcon className="h-4 w-4 text-red-500" />
                          <span className="font-medium text-sm">{load.to}</span>
                        </div>
                      </div>
                    </div>

                    {/* Product & Parties */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">Product Details</h3>
                      <p className="font-medium">{load.product}</p>
                      <div className="text-xs text-gray-500 space-y-1 mt-2">
                        <p><span className="font-medium">Seller:</span> {load.seller}</p>
                        <p><span className="font-medium">Buyer:</span> {load.buyer}</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">Status</h3>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            {load.driverStatus}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Seller: <span className="font-medium">{load.sellerStatus}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          Buyer: <span className="font-medium">{load.buyerStatus}</span>
                        </p>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">Schedule</h3>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Pickup:</span>
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(load.pickupTime).toLocaleString([], {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="text-sm mt-2">
                          <span className="font-medium">Delivery:</span>
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(load.estimatedDelivery).toLocaleString([], {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
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