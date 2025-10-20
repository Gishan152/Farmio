import { Link, useLocation } from "react-router-dom";
import { CheckBadgeIcon, BuildingStorefrontIcon, TagIcon } from "@heroicons/react/24/solid";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

// Format slot ID with S- prefix
const formatSlotId = (id) => {
    if (typeof id === 'string' && id.startsWith('S-')) {
        return id; // Already formatted
    }
    return `S-${String(id).padStart(3, '0')}`;
};

export default function ReservationConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  // Expecting reservation details to be passed via state
  const { reservedSlots = [] } = location.state || {};

  // Group slots by type for summary
  const slotSummary = reservedSlots.reduce((acc, slot) => {
    if (!acc[slot.type]) acc[slot.type] = [];
    acc[slot.type].push(slot);
    return acc;
  }, {});

  // Booking/payment state
  const [bookingPlaced, setBookingPlaced] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  // Simulate booking placement
  const handlePlaceBooking = () => {
    setBookingPlaced(true);
  };

  // Simulate payment
  const handleMakePayment = () => {
    setPaymentDone(true);
  };

  return (
    <div className="container mx-auto max-w-7xl p-6 flex flex-col items-center">
      <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-green-100 dark:border-green-800 mt-10 relative">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-6 top-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition shadow"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>
        <CheckBadgeIcon className="h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-2">
          {paymentDone ? "Payment Successful!" : bookingPlaced ? "Booking Placed!" : "Reservation Confirmed!"}
        </h1>
        <p className="text-gray-700 dark:text-gray-200 mb-6 text-center">
          {paymentDone
            ? "Your payment was successful. Thank you for booking with us!"
            : bookingPlaced
              ? "Your booking has been placed. Please proceed to payment to complete your reservation."
              : "Your warehouse slot reservation has been successfully placed. Below are your reservation details:"}
        </p>
        <div className="w-full mb-6">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <BuildingStorefrontIcon className="h-6 w-6 text-green-500" /> Reserved Slots
          </h2>
          <div className="space-y-3">
            {Object.entries(slotSummary).map(([type, slots]) => (
              <div key={type} className="bg-green-50 dark:bg-green-900 rounded-lg p-4 flex items-center gap-4">
                <TagIcon className="h-5 w-5 text-green-500" />
                <div className="flex-1">
                  <div className="font-semibold text-green-900 dark:text-green-100">{type}</div>
                  <div className="text-xs text-gray-700 dark:text-gray-200">{slots.length} slot(s) reserved</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {slots.map(slot => (
                      <span key={slot.id} className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-2 py-0.5 mr-1 mb-1 text-xs font-medium">
                        {formatSlotId(slot.id)} ({slot.capacityKg}kg)
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {!bookingPlaced && !paymentDone && (
          <button
            onClick={handlePlaceBooking}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Place Booking
          </button>
        )}
        {bookingPlaced && !paymentDone && (
          <button
            onClick={handleMakePayment}
            className="mt-4 px-6 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition"
          >
            Make Payment
          </button>
        )}
        {paymentDone && (
          <Link
            to="/buyer/warehouses/all"
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Back to Warehouses
          </Link>
        )}
      </div>
    </div>
  );
}
