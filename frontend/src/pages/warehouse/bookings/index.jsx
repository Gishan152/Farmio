import React, { useState } from 'react';
import SimplePendingBookings from './pending';
import SimpleActiveBookings from './active';
import SimpleCalendar from './calendar';
import Sidebar from '../../../components/warehouse/Sidebar';

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
    name: "Grain Storage",
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
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 z-30">
        <Sidebar />
      </div>
      
      {/* Main Content with left margin */}
      <div className="ml-64 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-green-900 flex items-center gap-2 mb-4">
              <span className="text-3xl lg:text-4xl">📅</span> Booking Management
            </h1>
            <p className="text-green-700 text-sm">Manage storage requests, active bookings, and facility availability.</p>
          </div>

          {/* Facility Selection Card */}
          <div className="bg-white rounded-2xl shadow border border-green-100 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <label className="text-sm font-medium text-green-700 mb-1 block">Select Facility:</label>
                  <select
                    className="px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-green-900 font-medium"
                    value={selectedFacility.id}
                    onChange={e => setSelectedFacility(facilities.find(f => f.id === parseInt(e.target.value)))}
                  >
                    {facilities.map(facility => (
                      <option key={facility.id} value={facility.id}>
                        {facility.name} - {facility.location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="ml-auto bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="text-sm text-green-700">
                  <div className="flex items-center gap-4">
                    <span><strong>Capacity:</strong> {selectedFacility.capacity} MT</span>
                    <span><strong>Type:</strong> <span className="capitalize">{selectedFacility.storageType}</span> Storage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="bg-white rounded-2xl shadow border border-green-100 overflow-hidden">
              <div className="flex border-b border-green-100">
                <button
                  className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'pending' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white text-green-700 hover:bg-green-50'
                  }`}
                  onClick={() => setActiveTab('pending')}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    New Requests
                  </div>
                </button>
                <button
                  className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'active' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white text-green-700 hover:bg-green-50'
                  }`}
                  onClick={() => setActiveTab('active')}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Active Bookings
                  </div>
                </button>
                <button
                  className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'calendar' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white text-green-700 hover:bg-green-50'
                  }`}
                  onClick={() => setActiveTab('calendar')}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Calendar View
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
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
      </div>
    </div>
  );
};

export default BookingIndex;