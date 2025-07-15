import React, { useState } from 'react';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  CubeIcon,
} from '@heroicons/react/24/solid';

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
    status: 'Pending',
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
    status: 'Approved',
  },
  {
    id: 3,
    crop: 'Onions',
    quantity: '300',
    qualityGrade: 'B',
    priceMin: '30',
    priceMax: '35',
    location: 'Galle',
    deliveryDate: '2025-07-22',
    repeat: 'One-time',
    visibility: 'Public',
    transport: 'Yes',
    notes: '',
    buyerName: 'Kasun Jayawardena',
    buyerAddress: '789 Beach Road, Galle',
    status: 'Rejected',
  },
];

const statusConfig = {
  Pending: {
    color: 'bg-yellow-100 text-yellow-800',
    icon: <ClockIcon className="h-5 w-5 text-yellow-500 mr-2" />,
  },
  Approved: {
    color: 'bg-green-100 text-green-800',
    icon: <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />,
  },
  Rejected: {
    color: 'bg-red-100 text-red-800',
    icon: <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />,
  },
};

export default function Offers() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = buyerRequests.filter((req) =>
    [req.crop, req.buyerName, req.location, req.notes || '']
      .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
      <div className="grid gap-6">
        {filteredRequests.map((req) => {
          const status = statusConfig[req.status] || {};
          return (
            <div
              key={req.id}
              className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6"
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold text-green-700 mb-2">{req.crop}</h2>
                <div
                  className={`flex items-center px-3 py-1 rounded-full text-base font-medium ${status.color}`}
                >
                  {status.icon}
                  {req.status}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-[17px] text-gray-800">
                <div className="space-y-2">
                  <p>
                    <span className="font-medium text-gray-600">Buyer Name:</span>{' '}
                    {req.buyerName}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Address:</span>{' '}
                    {req.buyerAddress}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Quantity:</span>{' '}
                    {req.quantity} kg
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Quality Grade:</span>{' '}
                    {req.qualityGrade}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Price Range:</span>{' '}
                    Rs. {req.priceMin} - {req.priceMax}/kg
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Delivery Location:</span>{' '}
                    {req.location}
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium text-gray-600">Delivery Deadline:</span>{' '}
                    {req.deliveryDate}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Repeat:</span>{' '}
                    {req.repeat}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Transport Provided:</span>{' '}
                    {req.transport}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Visibility:</span>{' '}
                    {req.visibility}
                  </p>
                  {req.notes && (
                    <p>
                      <span className="font-medium text-gray-600">Notes:</span>{' '}
                      {req.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}