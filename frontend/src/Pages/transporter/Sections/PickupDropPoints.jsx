import React, { useEffect, useState } from 'react';

const mockRouteData = [
  {
    id: 'LD-3001',
    from: 'Anuradhapura',
    to: 'Colombo',
    pickupLocation: 'Anuradhapura Town Center',
    dropLocation: 'Colombo Wholesale Market',
    status: 'In Transit',
  },
  {
    id: 'LD-3002',
    from: 'Polonnaruwa',
    to: 'Kandy',
    pickupLocation: 'Polonnaruwa Farmer Zone',
    dropLocation: 'Kandy Main Depot',
    status: 'Pending Pickup',
  },
];

export default function PickupDropPoints() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    // Replace with API fetch
    setRoutes(mockRouteData);
  }, []);

  const handleArrived = (loadId, type) => {
    alert(`Marked Load ${loadId} as arrived at ${type}`);
    // TODO: Update status via API
  };

  const grouped = {
    'Pending Pickup': routes.filter((r) => r.status === 'Pending Pickup'),
    'In Transit': routes.filter((r) => r.status === 'In Transit'),
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Pickup & Drop Points</h1>

      {Object.entries(grouped).map(([status, items]) => (
        <div key={status} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {status === 'Pending Pickup' ? '🟡 Pending Pickup' : '🔵 In Transit'}
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {items.map((route) => (
              <div
                key={route.id}
                className="bg-white p-5 rounded-xl shadow border border-gray-100"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{route.id}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      route.status === 'Pending Pickup'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    {route.status}
                  </span>
                </div>

                <div className="mb-3 text-sm text-gray-700">
                  <p><strong>Pickup:</strong> {route.pickupLocation}</p>
                  <p><strong>Drop-off:</strong> {route.dropLocation}</p>
                </div>

                <div className="flex gap-4 flex-wrap">
                  <a
                    href={`https://www.google.com/maps/dir/${encodeURIComponent(route.pickupLocation)}/${encodeURIComponent(route.dropLocation)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
                  >
                    View Route on Google Maps
                  </a>

                  {route.status === 'Pending Pickup' && (
                    <button
                      onClick={() => handleArrived(route.id, 'Pickup Location')}
                      className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition text-sm"
                    >
                      Arrived at Pickup Location
                    </button>
                  )}

                  {route.status === 'In Transit' && (
                    <button
                      onClick={() => handleArrived(route.id, 'Drop Location')}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
                    >
                      Arrived at Drop Location
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
