import React, { useState } from "react";
import Sidebar from "../../../components/warehouse/Sidebar";
import PageHeader from "../../../components/warehouse/PageHeader";
import { useNavigate } from "react-router-dom";

const warehouses = [
  {
    id: 1,
    name: "Colombo A",
    location: "Colombo",
    storageType: "Cold Storage",
    capacity: 1000,
    used: 750,
    paymentStatus: "Paid",
    recentPayment: 17000,
    recentPaymentId: 123,
    pending: 0,
  },
  {
    id: 2,
    name: "Kandy B",
    location: "Kandy",
    storageType: "Dry Storage",
    capacity: 1000,
    used: 500,
    paymentStatus: "Pending",
    recentPayment: 5000,
    recentPaymentId: 124,
    pending: 2,
  },
];

const PaymentOverview = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState(warehouses[0]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredWarehouses = warehouses.filter(
    (w) =>
      (!filter || w.paymentStatus === filter) &&
      (w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.location.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white-50 flex">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-60 z-30">
        <Sidebar />
      </div>
      {/* Header */}
      <div className="fixed top-0 left-60 right-0 z-20">
        <PageHeader
          title="Payment Overview"
          subtitle="Manage and review all warehouse payments and transactions."
          user={{ name: "Kithmini", profilePic: "/alex.jpg" }}
        />
      </div>
      {/* Main Content */}
      <main className="flex-1 lg:ml-60 pt-[72px] p-6 lg:p-10 transition-all duration-300 mt-20">
        <div className="max-w-7xl mx-auto">
          {/* Notification Banner */}
          <div className="mb-4">
            <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded">
              Rs. 17,000 received for Colombo A
            </div>
          </div>
          {/* Header & Stats */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <select
                className="border border-green-300 rounded px-3 py-2"
                value={selectedWarehouse.id}
                onChange={e =>
                  setSelectedWarehouse(
                    warehouses.find(w => w.id === Number(e.target.value))
                  )
                }
              >
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
              <div className="bg-green-50 rounded px-4 py-2 text-green-900 font-semibold">
                Earnings: Rs. 50,000
              </div>
              <div className="bg-yellow-50 rounded px-4 py-2 text-yellow-900 font-semibold">
                Pending: Rs. 10,000 (2)
              </div>
            </div>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={() => navigate("/warehouse/payment/history")}
            >
              View Payment History
            </button>
          </div>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              className="border border-gray-300 rounded px-3 py-2"
              placeholder="Search by name/location"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="border border-gray-300 rounded px-3 py-2"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="">All Payment Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          {/* Warehouse List */}
          <div className="space-y-4">
            {filteredWarehouses.map(w => (
              <div
                key={w.id}
                className="bg-white rounded-xl shadow border p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <div className="font-bold text-lg text-green-900">{w.name}</div>
                  <div className="text-gray-600">{w.storageType}, {w.capacity} kg, {Math.round((w.used / w.capacity) * 100)}% full</div>
                  <div className="text-sm mt-1">
                    {w.paymentStatus === "Paid" ? (
                      <span className="text-green-700">Paid: Rs. {w.recentPayment} (#{w.recentPaymentId})</span>
                    ) : (
                      <span className="text-yellow-700">Pending: Rs. {w.recentPayment} (#{w.recentPaymentId})</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => navigate(`/warehouse/payment/details/${w.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentOverview;