import React, { useState, useEffect } from 'react';
import { useFarmerBids } from '../../../Contexts/Farmer/FarmerBidsContext';

const BuyerRequests = () => {
  const { buyerRequests, bids, loading, error, fetchBuyerRequests, fetchBids, placeBid } = useFarmerBids();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [location, setLocation] = useState('');
  const [biddingPrice, setBiddingPrice] = useState('');
  const [bidDeadline, setBidDeadline] = useState('');
  const [bidNotes, setBidNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [bidLoading, setBidLoading] = useState(false);
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');
  // Get farmerId from localStorage or auth context (adjust as needed)
  const farmerId = localStorage.getItem('userId');
  // Fetch bids for this farmer on mount
  useEffect(() => {
    if (farmerId) fetchBids();
  }, [farmerId]);

  const openPopup = (request) => {
    setSelectedRequest(request);
    setLocation('');
    setBiddingPrice('');
    setBidDeadline('');
    setBidNotes('');
    setBidError('');
    setBidSuccess('');
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedRequest(null);
    setLocation('');
    setBiddingPrice('');
    setBidDeadline('');
    setBidNotes('');
    setBidError('');
    setBidSuccess('');
  };

  const confirmOffer = async () => {
    setBidError('');
    setBidSuccess('');
    if (!location.trim()) {
      setBidError('Please enter your location.');
      return;
    }
    if (!biddingPrice || isNaN(biddingPrice) || Number(biddingPrice) <= 0) {
      setBidError('Please enter a valid bidding price.');
      return;
    }
    if (!bidDeadline) {
      setBidError('Please select a deadline.');
      return;
    }
    setBidLoading(true);
    try {
      await placeBid(selectedRequest.id, {
        location,
        biddingPrice: Number(biddingPrice),
        deadline: bidDeadline,
        notes: bidNotes
      });
      setBidSuccess('Bid placed successfully!');
      setTimeout(() => {
        closePopup();
      }, 1200);
    } catch (err) {
      setBidError('Failed to place bid. Please try again.');
    } finally {
      setBidLoading(false);
    }
  };

  // Ensure buyerRequests is always an array before filtering
  const safeBuyerRequests = Array.isArray(buyerRequests) ? buyerRequests : [];
  const filteredRequests = safeBuyerRequests.filter((req) =>
    (req.crop || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (req.buyerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (req.location || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log("Bids : ", bids)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold">Buyer Requests</h1> <br />
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search buyer requests..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      {loading && <div className="text-gray-500">Loading buyer requests...</div>}
      {/* {error && <div className="text-red-500">{error}</div>} */}
      <div className="grid gap-6">
        {filteredRequests.map((req) => {
          // Check if this farmer has already placed a bid for this request (using new DTO structure)
          const hasBid = Array.isArray(bids) && bids.some(bid => bid.buyerRequestId === req.id);
          return (
            <div
              key={req.id}
              className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-green-700 mb-2">{req.crop}</h2>
                  <p><span className="font-medium text-gray-600 dark:text-gray-400">Request ID:</span> {req.id}</p>
                  <p><span className="font-medium text-gray-600 dark:text-gray-400">State:</span> <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${req.state === 'OPEN' ? 'bg-green-100 text-green-700' : req.state === 'CLOSED' ? 'bg-gray-200 text-gray-700' : 'bg-red-100 text-red-700'}`}>{req.state}</span></p>
                  <p><span className="font-medium text-gray-600 dark:text-gray-400">Buyer User ID:</span> {req.userId}</p>
                  <p><span className="font-medium text-gray-600 dark:text-gray-400">Unit Measurement:</span> {req.unitMeasurement}</p>
                  <p><span className="font-medium text-gray-600 dark:text-gray-400">Quantity:</span> {req.quantity}</p>
                  <p><span className="font-medium text-gray-600 dark:text-gray-400">Quality:</span> {req.quality}</p>
                  <p><span className="font-medium text-gray-600 dark:text-gray-400">Price Range:</span> Rs. {req.priceMin} - {req.priceMax}</p>
                  <p><span className="font-medium text-gray-600 dark:text-gray-400">Location:</span> {req.location}</p>
                  <p><span className="font-medium text-gray-600 dark:text-gray-400">Deadline:</span> {req.deadline}</p>
                  <p><span className="font-medium text-gray-600 dark:text-gray-400">Notes:</span> {req.notes}</p>
                  <p><span className="font-medium text-gray-600 dark:text-gray-400">Visibility:</span> {req.visibility}</p>
                  <p><span className="font-medium text-gray-600 dark:text-gray-400">Date Posted:</span> {req.date}</p>
                </div>
                <div className="space-y-2">
                  <div className="mt-4">
                    <button
                      onClick={() => openPopup(req)}
                      className="w-full md:w-auto px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
                      disabled={hasBid}
                    >
                      {hasBid ? 'Bid Already Placed' : 'Offer Supply'}
                    </button>
                    {hasBid && <div className="text-green-700 text-sm mt-2">You have already placed a bid for this request.</div>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isPopupOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="relative bg-white rounded-2xl w-11/12 max-w-md p-8 z-10 shadow-2xl">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closePopup}
              disabled={bidLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon" className="h-6 w-6">
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"></path>
              </svg>
            </button>
            <h2 className="text-xl font-semibold mb-4">Place Your Bid</h2>
            <div className="mb-2 text-gray-700">
              <span className="font-semibold">Crop:</span> {selectedRequest.crop}
            </div>
            <div className="mb-2 text-gray-700">
              <span className="font-semibold">Quantity:</span> {selectedRequest.quantity} {selectedRequest.unitMeasurement}
            </div>
            <div className="mb-2 text-gray-700">
              <span className="font-semibold">Location:</span> {selectedRequest.location}
            </div>
            <form onSubmit={e => { e.preventDefault(); confirmOffer(); }}>
              <label className="block mb-2 text-gray-700 font-medium">Your Location</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={bidLoading}
              />
              <label className="block mb-2 text-gray-700 font-medium">Bidding Price (per {selectedRequest.unitMeasurement})</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="Enter your bidding price"
                value={biddingPrice}
                onChange={(e) => setBiddingPrice(e.target.value)}
                min="1"
                step="0.01"
                disabled={bidLoading}
              />
              <label className="block mb-2 text-gray-700 font-medium">Delivery Deadline</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                value={bidDeadline}
                onChange={(e) => setBidDeadline(e.target.value)}
                disabled={bidLoading}
              />
              <label className="block mb-2 text-gray-700 font-medium">Notes (optional)</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="Add any notes for the buyer..."
                value={bidNotes}
                onChange={(e) => setBidNotes(e.target.value)}
                rows={2}
                disabled={bidLoading}
              />
              {bidError && <div className="text-red-500 mb-2">{bidError}</div>}
              {bidSuccess && <div className="text-green-600 mb-2">{bidSuccess}</div>}
              <button
                type="submit"
                className={`w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 ${bidLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={bidLoading}
              >
                {bidLoading ? 'Placing Bid...' : 'Place Bid'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerRequests;