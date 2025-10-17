import React, { useState, useEffect } from 'react';
import { 
  BellIcon,
  CheckCircleIcon,
  TruckIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';
import { 
  ArrowPathIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const mockNotifications = [
  {
    id: 1,
    message: 'You have been assigned to Load ID LD-6101 (Anuradhapura → Colombo)',
    type: 'assignment',
    timestamp: '2025-07-14 09:30',
    read: false,
    details: {
      loadId: 'LD-6101',
      from: 'Anuradhapura',
      to: 'Colombo',
      weight: '25kg',
      farmer: 'Sunil Perera',
      pickupTime: '2025-07-15 08:00',
      payment: 'Rs. 3,500'
    }
  },
  {
    id: 2,
    message: 'Farmer confirmed shipment for Load ID LD-6101',
    type: 'confirmation',
    timestamp: '2025-07-14 10:00',
    read: false,
    details: {
      loadId: 'LD-6101',
      farmer: 'Sunil Perera',
      confirmedAt: '2025-07-14 09:45',
      produce: 'Tomatoes'
    }
  },
  {
    id: 3,
    message: 'Load ID LD-6100 was successfully delivered',
    type: 'delivery',
    timestamp: '2025-07-13 18:45',
    read: true,
    details: {
      loadId: 'LD-6100',
      buyer: 'Nimal Jayasena',
      deliveredAt: '2025-07-13 18:30',
      paymentReceived: true
    }
  },
  {
    id: 4,
    message: 'New payment received for Load ID LD-6098',
    type: 'payment',
    timestamp: '2025-07-12 11:20',
    read: true,
    details: {
      loadId: 'LD-6098',
      amount: 'Rs. 4,200',
      paymentMethod: 'Bank Transfer',
      paymentDate: '2025-07-12'
    }
  }
];

const NotificationIcon = ({ type }) => {
  const iconClass = "h-6 w-6";
  
  switch (type) {
    case 'assignment':
      return <TruckIcon className={`${iconClass} text-blue-500`} />;
    case 'confirmation':
      return <ClipboardDocumentCheckIcon className={`${iconClass} text-green-500`} />;
    case 'delivery':
      return <CheckCircleIcon className={`${iconClass} text-purple-500`} />;
    case 'payment':
      return <CheckCircleIcon className={`${iconClass} text-yellow-500`} />;
    default:
      return <BellIcon className={`${iconClass} text-gray-500`} />;
  }
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    // Replace with real API call
    setNotifications(mockNotifications);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter !== 'all' && n.type !== filter) return false;
    if (showUnreadOnly && n.read) return false;
    return true;
  });

  const getNotificationColor = (type) => {
    switch (type) {
      case 'assignment':
        return 'bg-blue-50 border-blue-100';
      case 'confirmation':
        return 'bg-green-50 border-green-100';
      case 'delivery':
        return 'bg-purple-50 border-purple-100';
      case 'payment':
        return 'bg-yellow-50 border-yellow-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  const formatDateTime = (timestamp) => {
    const [date, time] = timestamp.split(' ');
    return (
      <div className="flex items-center text-xs text-gray-500">
        <CalendarIcon className="h-3 w-3 mr-1" />
        <span className="mr-2">{date}</span>
        <ClockIcon className="h-3 w-3 mr-1" />
        <span>{time}</span>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <BellIcon className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={markAllAsRead}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center"
              >
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Mark All as Read
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Type</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              >
                <option value="all">All Types</option>
                <option value="assignment">Assignments</option>
                <option value="confirmation">Confirmations</option>
                <option value="delivery">Deliveries</option>
                <option value="payment">Payments</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showUnreadOnly}
                  onChange={(e) => setShowUnreadOnly(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Show unread only</span>
              </label>
            </div>
            <div className="flex items-end justify-end">
              <p className="text-sm text-gray-500">
                Showing {filteredNotifications.length} of {notifications.length} notifications
              </p>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
            <div className="text-4xl mb-3">🔔</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Notifications Found</h3>
            <p className="text-gray-500">
              {notifications.length === 0 
                ? "You don't have any notifications yet." 
                : "No notifications match your current filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 ${
                  notification.read ? 'opacity-80' : 'border-l-4 border-green-500'
                }`}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                        <NotificationIcon type={notification.type} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{notification.message}</h3>
                        <div className="mt-1">
                          {formatDateTime(notification.timestamp)}
                        </div>
                      </div>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
                      >
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Mark as Read
                      </button>
                    )}
                  </div>

                  {selectedNotification?.id === notification.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {notification.details.loadId && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Load ID</p>
                            <p className="font-medium">{notification.details.loadId}</p>
                          </div>
                        )}
                        {notification.details.from && notification.details.to && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Route</p>
                            <div className="flex items-center">
                              <MapPinIcon className="h-4 w-4 text-red-500 mr-1" />
                              <span className="mr-2">{notification.details.from}</span>
                              <span className="text-gray-400">→</span>
                              <MapPinIcon className="h-4 w-4 text-green-500 ml-2 mr-1" />
                              <span>{notification.details.to}</span>
                            </div>
                          </div>
                        )}
                        {notification.details.farmer && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Farmer</p>
                            <div className="flex items-center">
                              <UserIcon className="h-4 w-4 text-purple-500 mr-2" />
                              <span className="font-medium">{notification.details.farmer}</span>
                            </div>
                          </div>
                        )}
                        {notification.details.payment && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Payment</p>
                            <p className="font-medium">{notification.details.payment}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => 
                        setSelectedNotification(selectedNotification?.id === notification.id ? null : notification)
                      }
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {selectedNotification?.id === notification.id ? (
                        <span className="flex items-center">
                          <XMarkIcon className="h-4 w-4 mr-1" />
                          Hide Details
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <ArrowPathIcon className="h-4 w-4 mr-1" />
                          Show Details
                        </span>
                      )}
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