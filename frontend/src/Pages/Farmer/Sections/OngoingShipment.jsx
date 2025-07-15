import React, { useState, useEffect, useMemo } from 'react';
import { TruckIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import corn from "../../../Assets/Farmer/Crops/corn.jpeg";

// Single ongoing shipment card
export function OngoingShipment({ order }) {
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

  const transportData = { vehicleReg, driverName, driverPhone, driverEmail, loadNumber, loadPicked: true, loadDelivered: false, buyerConfirmation: false };
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="max-w mx-auto bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
      <div className="flex flex-col sm:flex-row">
        {/* Info Section */}
     <div className="m-8 max-w-sm min-w-sm">
      <div className="sm:col-span-2 grid grid-cols-2 gap-5">
        {[
          { label: 'Order ID', value: id },
          { label: 'Buyer', value: buyerName },
          { label: 'Address', value: buyerAddress },
          { label: 'Location', value: buyerLocation },
          { label: 'Product', value: productName },
          { label: 'Quantity', value: quantity },
          { label: 'Order Total', value: `$${totalPrice.toFixed(2)}` },
          { label: 'Payout', value: `$${totalPrice.toFixed(2)}` },
        ].map(field => (
          <div key={field.label} className="flex flex-col space-y-1">
            <span className="text-sm text-gray-500">{field.label}</span>
            <span className="text-md font-medium text-gray-800">{field.value}</span>
          </div>
        ))}
      </div>
    </div>

        {/* Transport Section */}
       
        <div className="flex-1 p-6 space-y-3 border-l border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Transport </h2>
          {!showDetails ? (
            <button
              onClick={() => setShowDetails(true)}
              className="flex items-center space-x-2 p-3 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-md"
            >
              <TruckIcon className="h-6 w-6" />
              <span className="font-semibold">Show </span>
            </button>
          ) : (
            <>
              {['vehicleReg', 'driverName', 'driverPhone', 'driverEmail', 'loadNumber'].map(key => (
                <p key={key}>
                  <span className="font-medium">{key.replace(/([A-Z])/g, ' $1')}:</span> {transportData[key]}
                </p>
              ))}
              <div className="flex items-center space-x-4 mt-4">
                {['loadPicked', 'loadDelivered', 'buyerConfirmation'].map(flag => (
                  <div key={flag} className="flex items-center space-x-1">
                    {transportData[flag] ? <CheckIcon className="h-5 w-5 text-green-500" /> : <XMarkIcon className="h-5 w-5 text-red-500" />}
                    <span className="text-sm text-gray-700">{flag.replace(/([A-Z])/g, ' $1')}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="mt-4 px-4 py-2 rounded-full border hover:bg-gray-100 shadow-md"
              >
                Hide Details
              </button>
            </>
          )}
        </div>

        {/* Image Section */}
        {imageUrl && (
          <div className="sm:w-1/3 bg-gray-100 flex items-center justify-center">
            <img src={imageUrl} alt={productName} className="object-cover h-full w-full" />
          </div>
        )}
      </div>
    </div>
  );
}

// List of multiple ongoing shipments with loader and details summary
export default function OngoingShipmentsList() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetch
  useEffect(() => {
    setTimeout(() => {
      setOrders([
        { id: '223456', buyerName: 'Alice Green', buyerAddress: '142 nisalagiri uyana boralugoda poruwadanda', buyerLocation: 'Gotham, NJ', productName: 'Smart Watch', quantity: 3, totalPrice: 299.97, imageUrl: corn, vehicleReg: 'CAN1677', driverName: 'Manuja', driverPhone: '0789656563', driverEmail: 'ransara@example.com', loadNumber: 'LD-8975' },
        { id: '223457', buyerName: 'Bob Blue', buyerAddress: '321 Pine Rd', buyerLocation: 'Star City, CA', productName: 'Drone', quantity: 1, totalPrice: 499.99, imageUrl: corn, vehicleReg: 'CAN8921', driverName: 'Rana', driverPhone: '0771234567', driverEmail: 'rana@example.com', loadNumber: 'LD-1234' },
        // add more orders here
      ]);
      setIsLoading(false);
    }, 1500);
  }, []);

  // Details summary
  const summary = useMemo(() => {
    const late = 0;
    const count = orders.length;
    const totalQty = orders.reduce((sum, o) => sum + o.quantity, 0);
    const totalValue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    return { late,count, totalQty, totalValue };
  }, [orders]);

  return (
    <section className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Ongoing Shipments</h1>

      {/* Summary Details */}
      {!isLoading && (
          <div className={`${summary.late > 0 ? 'bg-red-50' : 'bg-green-50'} p-4 rounded-lg shadow flex space-x-8`}>
          <div>
            <p className="text-sm text-gray-500">Total Shipments</p>
            <p className="text-xl font-bold text-green-600">{summary.count}</p>
          </div>
           <div>
            <p className="text-sm text-gray-500">Late Delivery</p>
            <p className={`text-xl font-bold ${summary.late === 0 ? 'text-green-600' : 'text-red-600'}`}>
              {summary.late}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Quantity</p>
            <p className="text-xl font-bold text-green-600">{summary.totalQty}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Value ($)</p>
            <p className="text-xl font-bold text-green-600">{summary.totalValue.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Loader or List */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <svg className="animate-spin h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </div>
      ) : (
        orders.map(order => (
          <OngoingShipment key={order.id} order={order} />
        ))
      )}
    </section>
  );
}