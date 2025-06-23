import React, { useState, useEffect } from 'react';

// Sample data for demonstration
const SAMPLE_ACTIVE_BOOKINGS = [
  {
    id: 101,
    facilityId: 1,
    farmerName: "Sunil Bandara",
    contact: "077-888-9999",
    cropType: "Rice",
    quantity: 75,
    startDate: "2025-06-15",
    endDate: "2025-07-30",
    approvedDate: "2025-06-10",
    status: "active"
  },
  {
    id: 102,
    facilityId: 2,
    farmerName: "Priya Rajapakse",
    contact: "076-777-8888",
    cropType: "Fruits",
    quantity: 30,
    startDate: "2025-06-20",
    endDate: "2025-07-05",
    approvedDate: "2025-06-18",
    status: "active"
  }
];

const ActiveBookings = ({ facilityId, onViewDetails }) => {
  const [activeBookings, setActiveBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const facilityBookings = SAMPLE_ACTIVE_BOOKINGS.filter(b => b.facilityId === facilityId);
      setActiveBookings(facilityBookings);
      setLoading(false);
    }, 500);
  }, [facilityId]);

  const handleComplete = (bookingId) => {
    setActiveBookings(prev => prev.filter(b => b.id !== bookingId));
    alert('Booking marked as completed!');
  };

  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Active Bookings ({activeBookings.length})
        </h3>
      </div>

      <div className="space-y-4">
        {activeBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No active bookings</h3>
            <p className="text-gray-600">No currently active storage bookings.</p>
          </div>
        ) : (
          activeBookings.map(booking => {
            const daysRemaining = getDaysRemaining(booking.endDate);
            return (
              <div
                key={booking.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{booking.farmerName}</h4>
                        <p className="text-sm text-gray-600">Active since {booking.approvedDate}</p>
                      </div>
                      <div className="ml-auto">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          daysRemaining > 7 ? 'bg-green-100 text-green-800' : 
                          daysRemaining > 0 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Expired'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Crop</span>
                        <p className="text-sm font-medium text-gray-900">{booking.cropType}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Quantity</span>
                        <p className="text-sm font-medium text-gray-900">{booking.quantity} MT</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">End Date</span>
                        <p className="text-sm font-medium text-gray-900">{booking.endDate}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Contact</span>
                        <p className="text-sm font-medium text-gray-900">{booking.contact}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {daysRemaining <= 0 && (
                      <button
                        onClick={() => handleComplete(booking.id)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => onViewDetails(booking)}
                      className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ActiveBookings;