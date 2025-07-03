import React, { useState } from "react";
import Sidebar from "../../../components/warehouse/Sidebar";

const mockPayments = [
  {
    id: 1,
    bookingId: 123,
    warehouse: "Colombo A",
    farmer: "Farmer A",
    produce: "Mangoes",
    quantity: 100,
    duration: 20,
    amount: 23000,
    status: "Paid",
    date: "2025-07-15",
  },
  {
    id: 2,
    bookingId: 124,
    warehouse: "Kandy B",
    farmer: "Farmer B",
    produce: "Bananas",
    quantity: 50,
    duration: 10,
    amount: 8000,
    status: "Pending",
    date: "2025-07-14",
  },
];

const PaymentHistory = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterWarehouse, setFilterWarehouse] = useState("");

  const filtered = mockPayments.filter(
    (t) =>
      (!filterWarehouse || t.warehouse === filterWarehouse) &&
      (!filterStatus || t.status === filterStatus) &&
      (t.bookingId.toString().includes(search) ||
        t.farmer.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white-50 flex">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10">
        <h2 className="text-2xl font-bold mb-6">Payment History</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            className="border border-gray-300 rounded px-3 py-2"
            placeholder="Search by booking/farmer"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="border border-gray-300 rounded px-3 py-2"
            value={filterWarehouse}
            onChange={e => setFilterWarehouse(e.target.value)}
          >
            <option value="">All Warehouses</option>
            <option value="Colombo A">Colombo A</option>
            <option value="Kandy B">Kandy B</option>
          </select>
          <select
            className="border border-gray-300 rounded px-3 py-2"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <table className="min-w-full bg-white rounded-xl shadow border">
          <thead>
            <tr>
              <th className="p-3 text-left">Booking ID</th>
              <th className="p-3 text-left">Warehouse</th>
              <th className="p-3 text-left">Farmer</th>
              <th className="p-3 text-left">Produce</th>
              <th className="p-3 text-left">Duration</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id}>
                <td className="p-3">{t.bookingId}</td>
                <td className="p-3">{t.warehouse}</td>
                <td className="p-3">{t.farmer}</td>
                <td className="p-3">{t.produce}</td>
                <td className="p-3">{t.duration} days</td>
                <td className="p-3">Rs. {t.amount}</td>
                <td className="p-3">{t.status}</td>
                <td className="p-3">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Export button can be added here */}
      </main>
    </div>
  );
};

export default PaymentHistory;