import React, { useState } from "react";
import Sidebar from "../../components/warehouse/Sidebar";
import PageHeader from "../../components/warehouse/PageHeader";

// Example notifications data
const initialNotifications = [
  {
    id: 1,
    type: "info",
    message: "Your booking for Cold Storage A has been approved.",
    date: "2024-07-01 10:30",
  },
  {
    id: 2,
    type: "warning",
    message: "Cold Storage C scheduled for maintenance on 2024-07-10.",
    date: "2024-06-30 09:00",
  },
  {
    id: 3,
    type: "success",
    message: "Payment of Rs. 45,000 received for Booking #1234.",
    date: "2024-06-29 15:45",
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleClear = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-white-50 flex">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-60 z-30">
        <Sidebar />
      </div>
      {/* Header */}
      <div className="fixed top-0 left-60 right-0 z-20">
        <PageHeader
          title="Notifications"
          subtitle="View your recent notifications and alerts."
          user={{ name: "Kithmini", profilePic: "/Images/warehouse/user.jpg" }}
        />
      </div>
      {/* Main Content */}
      <main className="flex-1 lg:ml-60 pt-[72px] p-2 sm:p-4 md:p-8 transition-all duration-300 mt-20">
        <div className="w-full bg-white rounded-2xl shadow border border-green-100 p-2 sm:p-6 md:p-10">
          
          {notifications.length === 0 ? (
            <div className="text-center text-gray-500 py-12">No notifications.</div>
          ) : (
            <ul className="space-y-4">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`flex items-start gap-4 p-4 rounded-xl border ${
                    n.type === "success"
                      ? "border-green-200 bg-green-50"
                      : n.type === "warning"
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex-shrink-0 pt-1">
                    {n.type === "success" && (
                      <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                    )}
                    {n.type === "warning" && (
                      <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full"></span>
                    )}
                    {n.type === "info" && (
                      <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-green-900 font-medium break-words">{n.message}</div>
                    <div className="text-xs text-gray-500 mt-1">{n.date}</div>
                  </div>
                  <button
                    className="ml-2 text-xs text-green-700 hover:text-green-900"
                    onClick={() => handleClear(n.id)}
                  >
                    Clear
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default Notifications;