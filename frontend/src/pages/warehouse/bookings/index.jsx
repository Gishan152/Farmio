import React, { useState } from 'react';
import SimplePendingBookings from './pending';
import SimpleActiveBookings from './active';
import SimpleCalendar from './calendar';
import Sidebar from '../../../components/warehouse/Sidebar';
import PageHeader from '../../../components/warehouse/PageHeader';

// Simplified facilities data
const facilities = [
  {
    id: 1,
    name: "Main Warehouse",
    storageType: "dry",
    capacity: 1000,
    location: "Colombo"
  },
  {
    id: 2,
    name: "Cold Storage Unit",
    storageType: "cold", 
    capacity: 500,
    location: "Kandy"
  },
  {
    id: 3,
    name: "Dry Storage",
    storageType: "dry",
    capacity: 800,
    location: "Galle"
  }
];

const BookingIndex = () => {
  const [selectedFacility, setSelectedFacility] = useState(facilities[0]);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-white-50">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-60 z-30">
        <Sidebar />
      </div>
      {/* Header */}
      <div className="fixed top-0 left-60 right-0 z-20">
        <PageHeader
          title="Warehouse Bookings"
          subtitle="Manage storage requests, active bookings, and facility availability."
          user={{ name: "Kithmini", profilePic: "/alex.jpg" }}
        />
      </div>
      {/* Main Content */}
      <main className="lg:ml-60 pt-[72px] p-4 sm:p-6 lg:p-8 transition-all duration-300 mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Compact Filter & Tabs Section */}
          <div className="bg-white rounded-2xl shadow border border-green-100 p-3 sm:p-4 mb-6 flex flex-col md:flex-row md:items-center gap-4">
            {/* Facility Filter */}
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 bg-green-100 rounded-xl">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <select
                className="px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-green-900 font-medium"
                value={selectedFacility.id}
                onChange={e => setSelectedFacility(facilities.find(f => f.id === parseInt(e.target.value)))}
              >
                {facilities.map(facility => (
                  <option key={facility.id} value={facility.id}>
                    {facility.name} - {facility.location}
                  </option>
                ))}
              </select>
              <span className="hidden sm:inline text-xs text-green-700 ml-2">
                <strong>Capacity:</strong> {selectedFacility.capacity} MT, <strong>Type:</strong> <span className="capitalize">{selectedFacility.storageType}</span>
              </span>
            </div>
            {/* Tabs */}
            <div className="flex gap-1 md:gap-2 flex-1 md:justify-end">
              <button
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === 'pending'
                    ? 'bg-green-600 text-white shadow'
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
                onClick={() => setActiveTab('pending')}
              >
                New Requests
              </button>
              <button
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === 'active'
                    ? 'bg-green-600 text-white shadow'
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
                onClick={() => setActiveTab('active')}
              >
                Active Bookings
              </button>
              <button
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === 'calendar'
                    ? 'bg-green-600 text-white shadow'
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
                onClick={() => setActiveTab('calendar')}
              >
                Calendar View
              </button>
            </div>
          </div>

          {/* Content */}
          <div>
            {activeTab === 'pending' && (
              <SimplePendingBookings 
                facilityId={selectedFacility.id} 
                onViewDetails={openModal}
              />
            )}
            {activeTab === 'active' && (
              <SimpleActiveBookings 
                facilityId={selectedFacility.id} 
                onViewDetails={openModal}
              />
            )}
            {activeTab === 'calendar' && (
              <SimpleCalendar 
                facilityId={selectedFacility.id} 
                facilityName={selectedFacility.name}
              />
            )}
          </div>

          {/* Modal for booking details */}
          {showModal && selectedBooking && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-t-2xl">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Booking Details
                    </h3>
                    <button
                      onClick={closeModal}
                      className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <label className="text-sm font-semibold text-green-700 uppercase tracking-wide">Farmer Name</label>
                      <p className="text-lg font-medium text-green-900">{selectedBooking.farmerName}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <label className="text-sm font-semibold text-green-700 uppercase tracking-wide">Contact</label>
                      <p className="text-lg font-medium text-green-900">{selectedBooking.contact}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <label className="text-sm font-semibold text-green-700 uppercase tracking-wide">Crop Type</label>
                      <p className="text-lg font-medium text-green-900">{selectedBooking.cropType}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <label className="text-sm font-semibold text-green-700 uppercase tracking-wide">Quantity</label>
                      <p className="text-lg font-medium text-green-900">{selectedBooking.quantity} MT</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <label className="text-sm font-semibold text-green-700 uppercase tracking-wide">Start Date</label>
                      <p className="text-lg font-medium text-green-900">{selectedBooking.startDate}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <label className="text-sm font-semibold text-green-700 uppercase tracking-wide">End Date</label>
                      <p className="text-lg font-medium text-green-900">{selectedBooking.endDate}</p>
                    </div>
                  </div>
                  {selectedBooking.notes && (
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <label className="text-sm font-semibold text-green-700 uppercase tracking-wide">Notes</label>
                      <p className="text-green-900">{selectedBooking.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end pt-4 border-t border-green-100">
                    <button
                      onClick={closeModal}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookingIndex;