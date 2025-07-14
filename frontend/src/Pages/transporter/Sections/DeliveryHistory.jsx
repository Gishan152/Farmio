import React, { useEffect, useState } from 'react';

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
  },
];

export default function DeliveryHistory() {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    // Replace with API call
    setDeliveries(mockDeliveries);
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Delivery History</h1>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-xl shadow border border-gray-100">
          <thead className="bg-green-100 text-gray-700 text-sm">
            <tr>
              <th className="py-3 px-4 text-left">Load ID</th>
              <th className="py-3 px-4 text-left">From → To</th>
              <th className="py-3 px-4 text-left">Farmer → Buyer</th>
              <th className="py-3 px-4 text-left">Weight</th>
              <th className="py-3 px-4 text-left">Delivered On</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {deliveries.map((d) => (
              <tr key={d.id} className="border-t hover:bg-gray-50 transition">
                <td className="py-3 px-4 font-medium">{d.id}</td>
                <td className="py-3 px-4">{d.from} → {d.to}</td>
                <td className="py-3 px-4">{d.farmer} → {d.buyer}</td>
                <td className="py-3 px-4">{d.weight}</td>
                <td className="py-3 px-4">{d.deliveredOn}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      d.status === 'Delivered'
                        ? 'bg-green-100 text-green-700'
                        : d.status === 'Canceled'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}
                  >
                    {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
