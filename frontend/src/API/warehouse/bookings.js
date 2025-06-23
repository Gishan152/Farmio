// Simplified API for basic booking functionality

export async function fetchPendingBookings() {
  // Return sample data for now - replace with real API call later
  return [
    {
      id: 1,
      facilityId: 1,
      farmerName: "Kumara Perera",
      contact: "077-123-4567",
      cropType: "Rice",
      quantity: 50,
      startDate: "2025-07-01",
      endDate: "2025-08-15",
      status: "pending"
    }
  ];
}

export async function getActiveBookings() {
  // Return sample data for now - replace with real API call later
  return [
    {
      id: 101,
      facilityId: 1,
      farmerName: "Sunil Bandara",
      contact: "077-888-9999",
      cropType: "Rice",
      quantity: 75,
      startDate: "2025-06-15",
      endDate: "2025-07-30",
      status: "active"
    }
  ];
}

export async function approveBooking(bookingId) {
  // Simulate API call to approve booking
  console.log(`Approving booking ${bookingId}`);
  return { success: true };
}

export async function rejectBooking(bookingId) {
  // Simulate API call to reject booking
  console.log(`Rejecting booking ${bookingId}`);
  return { success: true };
}