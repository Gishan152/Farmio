import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const mockAssignedLoads = [
  {
    id: 'LD-5001',
    from: 'Anuradhapura',
    to: 'Colombo',
    weight: '30kg',
    status: 'Pending Pickup',
    confirmedBy: {
      farmer: true,
      driverPickup: false,
      driverDelivery: false,
      buyer: false,
    },
  },
  {
    id: 'LD-5002',
    from: 'Matale',
    to: 'Kandy',
    weight: '50kg',
    status: 'In Transit',
    confirmedBy: {
      farmer: true,
      driverPickup: true,
      driverDelivery: false,
      buyer: false,
    },
  },
  {
    id: 'LD-5003',
    from: 'Jaffna',
    to: 'Negombo',
    weight: '60kg',
    status: 'Delivered',
    confirmedBy: {
      farmer: true,
      driverPickup: true,
      driverDelivery: true,
      buyer: true,
    },
  },
];

export default function AssignedLoads() {
  const [loads, setLoads] = useState([]);

  useEffect(() => {
    // Replace with API call
    setLoads(mockAssignedLoads);
  }, []);

  const handleConfirm = (loadId, type) => {
    alert(`Confirmed ${type} for Load ${loadId}`);
    
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Pending Pickup':
        return 'bg-yellow-500';
      case 'In Transit':
        return 'bg-blue-500';
      case 'Delivered':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Deliveries</h1>

      <div className="grid grid-cols-1 gap-6">
        {loads.map((load) => (
          <div
            key={load.id}
            className="bg-white p-5 rounded-xl shadow border border-gray-100"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">{load.id}</h2>
              <span
                className={`text-xs px-2 py-1 rounded-full text-white ${getStatusBadgeColor(
                  load.status
                )}`}
              >
                {load.status}
              </span>
            </div>

            <p className="text-sm text-gray-700 mb-2">
              <strong>From:</strong> {load.from} &nbsp; | &nbsp;
              <strong>To:</strong> {load.to} &nbsp; | &nbsp;
              <strong>Weight:</strong> {load.weight}
            </p>

            {/* Confirmation Overview */}
            <div className="text-sm text-gray-700 mb-4">
              <p>✅ Farmer Confirmed: {load.confirmedBy.farmer ? '✔️' : '❌'}</p>
              <p>✅ Driver Pickup: {load.confirmedBy.driverPickup ? '✔️' : '❌'}</p>
              <p>✅ Driver Delivery: {load.confirmedBy.driverDelivery ? '✔️' : '❌'}</p>
              <p>✅ Buyer Confirmed: {load.confirmedBy.buyer ? '✔️' : '❌'}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {!load.confirmedBy.driverPickup && load.status === 'Pending Pickup' && (
                <Link to={`confirm/${load.id}`} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition text-sm">Confirm Pickup</Link>
                // ...................complete this routing........................
                // <button
                //   onClick={() => handleConfirm(load.id, 'Pickup')}
                //   className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition text-sm"
                // >
                //   Confirm Pickup
                // </button>
              )}

              {!load.confirmedBy.driverDelivery && load.status === 'In Transit' && (
                <button
                  onClick={() => handleConfirm(load.id, 'Delivery')}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
                >
                  Confirm Delivery
                </button>
              )}

              {load.status === 'Delivered' && (
                <span className="text-sm text-green-600 font-semibold">
                  ✔️ All Confirmations Done
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
