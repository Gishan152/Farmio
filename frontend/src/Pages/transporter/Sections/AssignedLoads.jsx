import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TruckIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ArrowPathIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import api from "../../../API/client"

export async function AssignedLoadsLoader() {
  try {
    // Fetch all loads assigned to the current driver
    const response = await api.get("/transport/load/all");

    const loads = response.data;
    const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL;

    // Transform data into frontend-friendly structure
    return loads
    .filter((load) => load.status === "accepted" || load.status === "in_transit" || load.status === "delivered")
    .map((load) => ({
      id: load.id,
      crop: load.cropType || "Unknown Crop",
      quantity: `${load.quantity} ${load.unit || "kg"}`,
      pickupLocation: load.pickupLocation || "N/A",
      deliveryLocation: load.deliveryLocation || "N/A",
      status: load.status || "Pending Pickup",
      confirmedBy: {
        driverPickup: load.driverPickupConfirmed || false,
        driverDelivery: load.driverDeliveryConfirmed || false,
        buyer: load.buyerConfirmed || false,
      },
      pickupTime: load.pickupTime,
      estimatedDelivery: load.estimatedDeliveryTime,
      imageUrls: load.imageUrls
        ? load.imageUrls.map((url) => `${API_BASE_URL}${url}`)
        : [],
    }));
  } catch (error) {
    console.error("Failed to fetch assigned loads:", error);
    return [];
  }
}

const AssignedLoads = () => {
  const navigate = useNavigate();
  // const [loads, setLoads] = useState([
  //   {
  //     id: 1,
  //     crop: 'Tomatoes',
  //     quantity: '50 kg',
  //     pickupLocation: 'Galle',
  //     deliveryLocation: 'Colombo',
  //     status: 'Pending Pickup',
  //     confirmedBy: {
  //       driverPickup: false,
  //       driverDelivery: false,
  //       buyer: false,
  //     },
  //     pickupTime: '2023-05-15 08:30',
  //     estimatedDelivery: '2023-05-15 14:00'
  //   },
  //   {
  //     id: 2,
  //     crop: 'Bananas',
  //     quantity: '30 kg',
  //     pickupLocation: 'Matara',
  //     deliveryLocation: 'Kandy',
  //     status: 'In Transit',
  //     confirmedBy: {
  //       driverPickup: true,
  //       driverDelivery: false,
  //       buyer: false,
  //     },
  //     pickupTime: '2023-05-16 09:15',
  //     estimatedDelivery: '2023-05-16 16:30'
  //   },
  //   {
  //     id: 3,
  //     crop: 'Carrots',
  //     quantity: '20 kg',
  //     pickupLocation: 'Nuwara Eliya',
  //     deliveryLocation: 'Gampaha',
  //     status: 'Delivered',
  //     confirmedBy: {
  //       driverPickup: true,
  //       driverDelivery: true,
  //       buyer: true,
  //     },
  //     pickupTime: '2023-05-14 10:00',
  //     estimatedDelivery: '2023-05-14 18:00'
  //   },
  // ]);
  const [loads, setLoads] = useState([]);

  useEffect(() => {
    const fetchLoads = async () => {
      const data = await AssignedLoadsLoader();
      setLoads(data);
    };
    fetchLoads();
  }, []);
  const handleConfirm = (loadId, type) => {
    setLoads((prevLoads) =>
      prevLoads.map((load) => {
        if (load.id === loadId) {
          const updatedConfirmedBy = {
            ...load.confirmedBy,
            driverPickup: type === 'Pickup' ? true : load.confirmedBy.driverPickup,
            driverDelivery: type === 'Delivery' ? true : load.confirmedBy.driverDelivery,
          };

          let updatedStatus = load.status;

          if (type === 'Pickup') {
            updatedStatus = 'In Transit';
          } else if (type === 'Delivery' && !load.confirmedBy.buyer) {
            updatedStatus = 'Awaiting Buyer';
          } else if (
            updatedConfirmedBy.driverPickup &&
            updatedConfirmedBy.driverDelivery &&
            updatedConfirmedBy.buyer
          ) {
            updatedStatus = 'Delivered';
          }

          return {
            ...load,
            confirmedBy: updatedConfirmedBy,
            status: updatedStatus,
          };
        }
        return load;
      })
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Pickup':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
      case 'In Transit':
        return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
      case 'Awaiting Buyer':
        return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' };
      case 'Delivered':
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Assigned Loads</h1>
          <p className="text-gray-600 mt-2">Manage your currently assigned transportation loads</p>
        </div>

        {/* Loads List */}
        <div className="space-y-6">
          {loads.map((load) => {
            const statusColor = getStatusColor(load.status);
            
            return (
              <div 
                key={load.id} 
                className={`bg-white rounded-xl shadow-lg overflow-hidden border ${statusColor.border} hover:shadow-xl transition-all duration-300`}
              >
                {/* Load Header */}
                <div className={`px-6 py-4 ${statusColor.bg} border-b ${statusColor.border}`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${statusColor.bg}`}>
                        <TruckIcon className={`h-6 w-6 ${statusColor.text}`} />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">{load.crop}</h2>
                        <p className={`text-sm font-medium ${statusColor.text}`}>
                          {load.status}
                        </p>
                      </div>
                    </div>
                    <div className="text-lg font-bold">
                      {load.quantity}
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
                        <ArrowUpTrayIcon className="h-5 w-5 text-red-500" />
                        <span className="font-medium">{load.pickupLocation}</span>
                        <span className="text-gray-400">→</span>
                        <ArrowDownTrayIcon className="h-5 w-5 text-green-500" />
                        <span className="font-medium">{load.deliveryLocation}</span>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">Pickup Time</h3>
                      <p className="font-medium">
                        {new Date(load.pickupTime).toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>

                    {/* Delivery Time */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">Estimated Delivery</h3>
                      <p className="font-medium">
                        {new Date(load.estimatedDelivery).toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>

                    {/* Confirmations */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">Confirmations</h3>
                      <div className="flex space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${load.confirmedBy.driverPickup ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          Pickup {load.confirmedBy.driverPickup ? '✓' : '✗'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${load.confirmedBy.driverDelivery ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          Delivery {load.confirmedBy.driverDelivery ? '✓' : '✗'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${load.confirmedBy.buyer ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          Buyer {load.confirmedBy.buyer ? '✓' : '✗'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex justify-end space-x-4">
                    {/* Pickup Confirmation */}
                    {!load.confirmedBy.driverPickup && load.status === 'Pending Pickup' && (
                      <button
                        onClick={() => navigate(`/transporter/confirmPickup/${load.id}`)}
                        className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                        <span>Confirm Pickup</span>
                      </button>
                    )}

                    {/* Delivery Confirmation */}
                    {!load.confirmedBy.driverDelivery && load.status === 'In Transit' && (
                      <button
                        onClick={() => navigate(`/transporter/confirmDelivery/${load.id}`)}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                        <span>Confirm Delivery</span>
                      </button>
                    )}

                    {/* Awaiting Buyer Confirmation */}
                    {load.confirmedBy.driverDelivery &&
                      !load.confirmedBy.buyer &&
                      load.status === 'Awaiting Buyer' && (
                        <div className="flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-lg">
                          <ClockIcon className="h-5 w-5 mr-2" />
                          <span>Awaiting Buyer Confirmation</span>
                        </div>
                    )}

                    {/* All Confirmed */}
                    {load.status === 'Delivered' && (
                      <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                        <CheckBadgeIcon className="h-5 w-5 mr-2" />
                        <span>Delivery Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AssignedLoads;