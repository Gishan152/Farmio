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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Warehouse Booking Management</h1>
            
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Select Facility:</label>
              <select
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={selectedFacility.id}
                onChange={e => setSelectedFacility(facilities.find(f => f.id === parseInt(e.target.value)))}
              >
                {facilities.map(facility => (
                  <option key={facility.id} value={facility.id}>
                    {facility.name} - {facility.location}
                  </option>
                ))}
              </select>
              
              <div className="ml-auto text-sm text-gray-600">
                Capacity: {selectedFacility.capacity} MT | Type: {selectedFacility.storageType}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex border-b border-gray-200 bg-white rounded-lg">
              <button
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'pending' 
                    ? 'border-green-600 text-green-600 bg-green-50' 
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('pending')}
              >
                New Requests
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'active' 
                    ? 'border-green-600 text-green-600 bg-green-50' 
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('active')}
              >
                Active Bookings
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'calendar' 
                    ? 'border-green-600 text-green-600 bg-green-50' 
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('calendar')}
              >
                Calendar View
              </button>
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

          {/* Simple Modal for booking details */}
          {showModal && selectedBooking && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Booking Details</h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Farmer Name</label>
                      <p className="text-gray-900">{selectedBooking.farmerName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Contact</label>
                      <p className="text-gray-900">{selectedBooking.contact}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Crop Type</label>
                      <p className="text-gray-900">{selectedBooking.cropType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Quantity</label>
                      <p className="text-gray-900">{selectedBooking.quantity} MT</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Start Date</label>
                      <p className="text-gray-900">{selectedBooking.startDate}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">End Date</label>
                      <p className="text-gray-900">{selectedBooking.endDate}</p>
                    </div>
                  </div>
                  {selectedBooking.notes && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Notes</label>
                      <p className="text-gray-900">{selectedBooking.notes}</p>
                    </div>
                  )}
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