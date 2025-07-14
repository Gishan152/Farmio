import React, { useEffect, useState } from 'react';
import { BellIcon } from '@heroicons/react/24/solid';

const mockNotifications = [
  {
    id: 1,
    message: 'You have been assigned to Load ID LD-6101 (Anuradhapura → Colombo)',
    type: 'Assignment',
    timestamp: '2025-07-14 09:30',
    read: false,
  },
  {
    id: 2,
    message: 'Farmer confirmed shipment for Load ID LD-6101',
    type: 'Status',
    timestamp: '2025-07-14 10:00',
    read: false,
  },
  {
    id: 3,
    message: 'Load ID LD-6100 was successfully delivered.',
    type: 'Status',
    timestamp: '2025-07-13 18:45',
    read: true,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Replace with real API call
    setNotifications(mockNotifications);
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <BellIcon className="w-6 h-6 text-green-600" />
        Notifications
      </h1>

      {notifications.length === 0 ? (
        <p className="text-gray-600">No notifications available.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`p-4 border rounded-xl bg-white shadow-sm flex justify-between items-start ${
                n.read ? 'opacity-70' : 'bg-green-50'
              }`}
            >
              <div>
                <p className="text-sm text-gray-800">{n.message}</p>
                <p className="text-xs text-gray-500 mt-1">{n.timestamp}</p>
              </div>
              {!n.read && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="text-green-600 text-xs hover:underline"
                >
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
