import React, { useState, useEffect, useMemo } from 'react';
import { TruckIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import corn from "../../../Assets/Farmer/Crops/corn.jpeg";

// Paid and Shipped card
export function PaidAndShipped({ order }) {
  const {
    id,
    buyerName,
    buyerAddress,
    buyerLocation,
    productName,
    quantity,
    totalPrice,
    imageUrl,
    vehicleReg,
    driverName,
    driverPhone,
    driverEmail,
    loadNumber,
  } = order;

  const transportData = { vehicleReg, driverName, driverPhone, driverEmail, loadNumber, loadPicked: true, loadDelivered: true, buyerConfirmation: true };
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
      {/* Order Successful Text */}
      <div className="px-6 pt-6">
        <span className="text-green-600 font-semibold text-lg">Order Successful!</span>
      </div>
      
      <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="sm:col-span-2 grid grid-cols-2 gap-4">
          {[
            { label: 'Order ID', value: id },
            { label: 'Buyer', value: buyerName },
            { label: 'Address', value: buyerAddress },
            { label: 'Location', value: buyerLocation },
            { label: 'Product', value: productName },
            { label: 'Quantity', value: quantity },
            { label: 'Order Total', value: `$${totalPrice.toFixed(2)}` },
            { label: 'Earnings', value: `$${totalPrice.toFixed(2)}` },
          ].map(field => (
            <div key={field.label} className="flex flex-col">
              <span className="text-sm text-gray-500">{field.label}</span>
              <span className="text-md font-medium text-gray-800">{field.value}</span>
            </div>
          ))}
        </div>

        {/* Transport Info & Image */}
        <div className="flex flex-col items-center space-y-4">
          {imageUrl && (
            <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
              <img src={imageUrl} alt={productName} className="object-cover w-full h-full" />
            </div>
          )}
          {!showDetails ? (
            <button
              onClick={() => setShowDetails(true)}
              className="flex items-center space-x-2 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <TruckIcon className="h-5 w-5" />
              <span>View Transport</span>
            </button>
          ) : (
            <>
              <div className="w-full space-y-2">
                {['vehicleReg','driverName','driverPhone','driverEmail','loadNumber'].map(key => (
                  <p key={key} className="text-gray-800">
                    <span className="font-medium">{key.replace(/([A-Z])/g,' $1')}:</span> {transportData[key]}
                  </p>
                ))}
                <div className="flex items-center space-x-4 mt-2">
                  {['loadPicked','loadDelivered','buyerConfirmation'].map(flag => (
                    <div key={flag} className="flex items-center space-x-1">
                      {transportData[flag] ? <CheckIcon className="h-5 w-5 text-green-500" /> : <XMarkIcon className="h-5 w-5 text-red-500" />}
                      <span className="text-sm text-gray-700">{flag.replace(/([A-Z])/g,' $1')}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="mt-4 py-2 px-4 border rounded-lg hover:bg-gray-100"
              >
                Hide Transport
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Dashboard listing Paid & Shipped
export default function PaidAndShippedList() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setOrders([
        {
          id: '323456', buyerName: 'Charlie Black', buyerAddress: '654 Elm St', buyerLocation: 'Central City, TX',
          productName: 'Gaming Laptop', quantity: 1, totalPrice: 1299.99, imageUrl: corn,
          vehicleReg: 'CAR1234', driverName: 'Nimal', driverPhone: '0712345678', driverEmail: 'nimal@example.com', loadNumber: 'LN-5678'
        },
        {
          id: '323457', buyerName: 'Dana White', buyerAddress: '987 Maple Rd', buyerLocation: 'Coast City, FL',
          productName: '4K Monitor', quantity: 2, totalPrice: 799.98, imageUrl: corn,
          vehicleReg: 'CAR5678', driverName: 'Sunil', driverPhone: '0723456789', driverEmail: 'sunil@example.com', loadNumber: 'LN-1234'
        },
      ]);
      setIsLoading(false);
    }, 1500);
  }, []);

  const summary = useMemo(() => ({
    count: orders.length,
    totalQty: orders.reduce((sum, o) => sum + o.quantity, 0),
    totalValue: orders.reduce((sum, o) => sum + o.totalPrice, 0)
  }), [orders]);

  return (
    <section className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Paid & Shipped Orders</h1>

      {!isLoading && (
        <div className="bg-green-50 p-4 rounded-lg shadow flex space-x-8">
          <div>
            <p className="text-sm text-gray-500">Total Shipped</p>
            <p className="text-xl font-bold text-green-600">{summary.count}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Total Quantity</p>
            <p className="text-xl font-bold text-green-600">{summary.totalQty}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Revenue ($)</p>
            <p className="text-xl font-bold text-green-600">{summary.totalValue.toFixed(2)}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-10">
          <svg className="animate-spin h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </div>
      ) : (
        orders.map(order => <PaidAndShipped key={order.id} order={order} />)
      )}
    </section>
  );
}
