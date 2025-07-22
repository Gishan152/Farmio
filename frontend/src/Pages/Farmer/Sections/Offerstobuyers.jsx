import React, { useState, useEffect } from 'react';
import { useFarmerBids } from '../../../Contexts/Farmer/FarmerBidsContext';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  CubeIcon,
} from '@heroicons/react/24/solid';

export default function Offers() {
  const { bids, fetchBids, loading, error } = useFarmerBids();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBids();
  }, []);

const statusConfig = {
  PENDING: {
    color: 'bg-yellow-100 text-yellow-800',
    icon: <ClockIcon className="h-5 w-5 text-yellow-500 mr-2" />,
    label: 'Pending',
  },
  ACCEPTED: {
    color: 'bg-green-100 text-green-800',
    icon: <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />,
    label: 'Accepted',
  },
  REJECTED: {
    color: 'bg-red-100 text-red-800',
    icon: <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />,
    label: 'Rejected',
  },
};

  // Show bids with their buyer request details (using new DTO fields)
  const filteredBids = Array.isArray(bids)
    ? bids.filter((bid) => {
        return [bid.crop, bid.buyerLocation, bid.buyerNotes || '', '']
          .some((field) => (field || '').toLowerCase().includes(searchQuery.toLowerCase()));
      })
    : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-black mb-4">Status Of Offers</h1>
      <input
        type="text"
        placeholder="Search buyer requests..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      {loading && <div className="text-gray-500">Loading your bids...</div>}
      {/* {error && <div className="text-red-500">{error}</div>} */}
      <div className="grid gap-6">
        {filteredBids.map((bid) => {
          const status = statusConfig[bid.bidStatus] || {};
          return (
            <div
              key={bid.id}
              className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6"
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold text-green-700 mb-2">{bid.crop}</h2>
                <div
                  className={`flex items-center px-3 py-1 rounded-full text-base font-medium ${status.color}`}
                >
                  {status.icon}
                  {status.label || bid.bidStatus}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-[17px] text-gray-800">
                <div className="space-y-2">
                  <p>
                    <span className="font-medium text-gray-600">Buyer User ID:</span>{' '}
                    {bid.buyerUserId}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Quantity:</span>{' '}
                    {bid.quantity} {bid.unitMeasurement}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Quality:</span>{' '}
                    {bid.quality}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Price Range:</span>{' '}
                    Rs. {bid.priceMin} - {bid.priceMax}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Location:</span>{' '}
                    {bid.buyerLocation}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Visibility:</span>{' '}
                    {bid.visibility}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Date Posted:</span>{' '}
                    {bid.date}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Request State:</span>{' '}
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${bid.state === 'OPEN' ? 'bg-green-100 text-green-700' : bid.state === 'CLOSED' ? 'bg-gray-200 text-gray-700' : 'bg-red-100 text-red-700'}`}>{bid.state}</span>
                  </p>
                  {bid.buyerNotes && (
                    <p>
                      <span className="font-medium text-gray-600">Buyer Notes:</span>{' '}
                      {bid.buyerNotes}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium text-gray-600">Your Bid Price:</span>{' '}
                    {bid.biddingPrice}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Bid Deadline:</span>{' '}
                    {bid.deadline}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Bid Notes:</span>{' '}
                    {bid.notes}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}