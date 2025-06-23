import React, { useState, useEffect } from 'react';

// Sample data for demonstration
const SAMPLE_PENDING_BOOKINGS = [
  {
    id: 1,
    facilityId: 1,
    farmerName: "Kumara Perera",
    contact: "077-123-4567",
    cropType: "Rice",
    quantity: 50,
    startDate: "2025-07-01",
    endDate: "2025-08-15",
    requestDate: "2025-06-20",
    status: "pending",
    notes: "Need dry storage for paddy rice"
  },
  {
    id: 2,
    facilityId: 1,
    farmerName: "Nimal Silva",
    contact: "076-987-6543",
    cropType: "Coconut",
    quantity: 25,
    startDate: "2025-06-28",
    endDate: "2025-07-28",
    requestDate: "2025-06-22",
    status: "pending",
    notes: "Copra storage required"
  },
  {
    id: 3,
    facilityId: 2,
    farmerName: "Kamala Fernando",
    contact: "071-555-9999",
    cropType: "Vegetables",
    quantity: 15,
    startDate: "2025-07-05",
    endDate: "2025-07-12",
    requestDate: "2025-06-23",
    status: "pending",
    notes: "Cold storage for fresh vegetables"
  }
];

const PendingBookings = ({ facilityId, onViewDetails }) => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const facilityBookings = SAMPLE_PENDING_BOOKINGS.filter(b => b.facilityId === facilityId);
      setPendingBookings(facilityBookings);
      setLoading(false);
    }, 500);
  }, [facilityId]);

  const handleApprove = (bookingId) => {
    setPendingBookings(prev => prev.filter(b => b.id !== bookingId));
    alert('Booking approved successfully!');
  };

  const handleReject = (bookingId) => {
    setPendingBookings(prev => prev.filter(b => b.id !== bookingId));
    alert('Booking rejected successfully!');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
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
          Pending Booking Requests ({pendingBookings.length})
        </h3>
      </div>

      <div className="space-y-4">
        {pendingBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
            <p className="text-gray-600">All booking requests have been processed.</p>
          </div>
        ) : (
          pendingBookings.map(booking => (
            <div
              key={booking.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{booking.farmerName}</h4>
                      <p className="text-sm text-gray-600">Requested on {booking.requestDate}</p>
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
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Duration</span>
                      <p className="text-sm font-medium text-gray-900">
                        {booking.startDate} to {booking.endDate}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Contact</span>
                      <p className="text-sm font-medium text-gray-900">{booking.contact}</p>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mb-3">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Notes</span>
                      <p className="text-sm text-gray-700">{booking.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleApprove(booking.id)}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(booking.id)}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => onViewDetails(booking)}
                    className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PendingBookings;