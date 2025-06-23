import React from "react";

const BookingCard = ({ booking }) => {
  if (!booking) {
    return (
      <div className="booking-card border-gray bg-light" style={{ padding: '1rem', marginBottom: '1rem' }}>
        <p>No booking data available.</p>
      </div>
    );
  }

  return (
    <div className="booking-card border-gray bg-light" style={{ padding: '1rem', marginBottom: '1rem' }}>
      <h3 className="accent-yellow">{booking.title}</h3>
      <p className="text-dark">Customer: {booking.customer}</p>
      <p>Status: {booking.status}</p>
      <p>
        {booking.startDate} - {booking.endDate}
      </p>
    </div>
  );
};

export default BookingCard;