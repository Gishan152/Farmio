import React, { useState } from 'react';

const buyerRequests = [
  {
    id: 1,
    crop: 'Tomatoes',
    quantity: '500',
    qualityGrade: 'A',
    priceMin: '40',
    priceMax: '50',
    location: 'Colombo',
    deliveryDate: '2025-07-15',
    repeat: 'Weekly',
    visibility: 'Public',
    transport: 'Yes',
    notes: 'Needs organic certification',
    buyerName: 'Ruwan Perera',
    buyerAddress: '123 Main Street, Colombo',
  },
  {
    id: 2,
    crop: 'Potatoes',
    quantity: '1000',
    qualityGrade: 'Any',
    priceMin: '60',
    priceMax: '75',
    location: 'Custom - Kandy',
    deliveryDate: '2025-07-20',
    repeat: 'One-time',
    visibility: 'Private',
    transport: 'No',
    notes: '',
    buyerName: 'Nadeesha Silva',
    buyerAddress: '456 Lake Road, Kandy',
  },
];

export default function BuyerRequests() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const openPopup = (request) => {
    setSelectedRequest(request);
    setLocation('');
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedRequest(null);
    setLocation('');
  };

  const confirmOffer = () => {
    if (location.trim() === '') {
      alert('Please enter your location.');
      return;
    }
    console.log(`Offer sent for ${selectedRequest.crop} to ${selectedRequest.buyerName} from ${location}`);
    closePopup();
  };

  // Filter buyer requests based on search query
  const filteredRequests = buyerRequests.filter((req) =>
    req.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold">Buyer Requests</h1> <br></br>
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search buyer requests..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <div className="grid gap-6">
        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-green-700 mb-2">{req.crop}</h2>
                <p><span className="font-medium text-gray-600 dark:text-gray-400">Buyer Name:</span> {req.buyerName}</p>
                <p><span className="font-medium text-gray-600 dark:text-gray-400">Address:</span> {req.buyerAddress}</p>
                <p><span className="font-medium text-gray-600 dark:text-gray-400">Quantity:</span> {req.quantity} kg</p>
                <p><span className="font-medium text-gray-600 dark:text-gray-400">Quality Grade:</span> {req.qualityGrade}</p>
                <p><span className="font-medium text-gray-600 dark:text-gray-400">Price Range:</span> Rs. {req.priceMin} - {req.priceMax}/kg</p>
                <p><span className="font-medium text-gray-600 dark:text-gray-400">Delivery Location:</span> {req.location}</p>
              </div>
              <div className="space-y-2">
                <p><span className="font-medium text-gray-600 dark:text-gray-400">Delivery Deadline:</span> {req.deliveryDate}</p>
                <p><span className="font-medium text-gray-600 dark:text-gray-400">Repeat:</span> {req.repeat}</p>
                <p><span className="font-medium text-gray-600 dark:text-gray-400">Transport Provided:</span> {req.transport}</p>
                <p><span className="font-medium text-gray-600 dark:text-gray-400">Visibility:</span> {req.visibility}</p>
                {req.notes && (
                  <p><span className="font-medium text-gray-600 dark:text-gray-400">Notes:</span> {req.notes}</p>
                )}
                <div className="mt-4">
                  <button
                    onClick={() => openPopup(req)}
                    className="w-full md:w-auto px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
                  >
                    Offer Supply
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isPopupOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="relative bg-white rounded-2xl w-11/12 max-w-md p-8 z-10 shadow-2xl">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closePopup}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon" className="h-6 w-6">
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"></path>
              </svg>
            </button>
            <h2 className="text-xl font-semibold mb-4">Confirm Offer</h2>
            <p className="mb-4">
              Offer supply for {selectedRequest.crop} to {selectedRequest.buyerName}
            </p>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Enter your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              onClick={confirmOffer}
            >
              Confirm Offer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};