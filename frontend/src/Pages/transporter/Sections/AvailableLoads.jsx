import React, { useState, useEffect } from 'react';

const mockLoads = [
  {
    id: 'LD-1052',
    from: 'Anuradhapura',
    to: 'Colombo',
    weight: '25kg',
    payment: 'Rs. 3,000',
    routeMatch: true,
  },
  {
    id: 'LD-1061',
    from: 'Matara',
    to: 'Kandy',
    weight: '40kg',
    payment: 'Rs. 5,200',
    routeMatch: false,
  },
];

export default function AvailableLoads() {
  const [loads, setLoads] = useState([]);

  useEffect(() => {
    // TODO: Replace with API call
    setLoads(mockLoads);
  }, []);

  const handleAccept = (loadId) => {
    alert(`You accepted load ${loadId}`);
    // TODO: call backend to assign load to this driver
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Available Loads</h1>

      <div className="grid grid-cols-1 gap-6">
        {loads.map((load) => (
          <div key={load.id} className="bg-white p-5 rounded-xl shadow border border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">{load.id}</h2>
              <p className="text-sm text-gray-600">
                <strong>From:</strong> {load.from} &nbsp;|&nbsp; 
                <strong>To:</strong> {load.to} &nbsp;|&nbsp; 
                <strong>Weight:</strong> {load.weight}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Payment:</strong> {load.payment}
              </p>
              {load.routeMatch ? (
                <span className="text-xs text-white bg-green-500 px-2 py-0.5 rounded-full mt-2 inline-block">Route Matches</span>
              ) : (
                <span className="text-xs text-white bg-gray-400 px-2 py-0.5 rounded-full mt-2 inline-block">Not on Your Route</span>
              )}
            </div>
            <div>
              <button
                onClick={() => handleAccept(load.id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Accept Load
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
