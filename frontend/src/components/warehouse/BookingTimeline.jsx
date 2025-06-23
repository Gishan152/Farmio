import React from "react";

const BookingTimeline = ({ bookings = [] }) => (
  <div className="booking-timeline">
    <h3>Active Bookings Timeline</h3>
    {bookings.length === 0 ? (
      <p>No active bookings.</p>
    ) : (
      <ul>
        {bookings.map((booking, i) => (
          <li key={i}>
            {booking.customer} ({booking.startDate} - {booking.endDate})
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default BookingTimeline;