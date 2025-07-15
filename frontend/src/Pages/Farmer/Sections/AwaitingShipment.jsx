import React, { useState, useEffect, useMemo } from 'react';
import corn from "../../../Assets/Farmer/Crops/corn.jpeg";

// Reusable Transport Details Popup
function AddTransportDetailsPopup({ onClose, onSave }) {
  const [transportDetails, setTransportDetails] = useState({
    vehicleReg: '',
    driverName: '',
    driverPhone: '',
    driverEmail: '',
    loadNumber: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setTransportDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(transportDetails);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-60" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl w-11/12 max-w-2xl p-8 z-10 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon" class="h-6 w-6"><path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path></svg>
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add Transport Details</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-y-6 gap-x-8">
          {[
            { label: 'Vehicle Registration Number ', name: 'vehicleReg', type: 'text' },
            { label: 'Driver Name', name: 'driverName', type: 'text' },
            { label: 'Driver Phone', name: 'driverPhone', type: 'tel' },
            { label: 'Driver Email', name: 'driverEmail', type: 'email' },
            { label: 'Load Number', name: 'loadNumber', type: 'text' },
          ].map((field, idx) => (
            <div key={field.name} className={idx < 4 ? 'col-span-1' : 'col-span-2'}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={transportDetails[field.name]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          ))}

          <div className="col-span-2 flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Single awaiting shipment card
export function AwaitingShipment({ order, onTransportSave }) {
  const {
    id,
    buyerName,
    buyerAddress,
    buyerLocation,
    productName,
    quantity,
    totalPrice,
    imageUrl,
  } = order;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = details => {
    onTransportSave(order.id, details);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
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
            { label: 'Payout', value: `$${totalPrice.toFixed(2)}` },
          ].map(field => (
            <div key={field.label} className="flex flex-col">
              <span className="text-sm text-gray-500">{field.label}</span>
              <span className="text-md font-medium text-gray-800">{field.value}</span>
            </div>
          ))}
        </div>

        {/* Image & Action */}
        <div className="flex flex-col items-center space-y-4">
          {imageUrl && (
            <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
              <img src={imageUrl} alt={productName} className="object-cover w-full h-full" />
            </div>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-auto w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Add Transport Details
          </button>
        </div>
      </div>

      {isModalOpen && (
        <AddTransportDetailsPopup onClose={() => setIsModalOpen(false)} onSave={handleSave} />
      )}
    </div>
  );
}

// Awaiting shipments list with loader and summary
export default function AwaitingShipmentsList() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setOrders([
        {
          id: '123456', buyerName: 'John Doe', buyerAddress: '123 Main St', buyerLocation: 'Springfield, IL',
          productName: 'Wireless Headphones', quantity: 2, totalPrice: 199.98, imageUrl: corn
        },
        {
          id: '123457', buyerName: 'Jane Smith', buyerAddress: '456 Elm St', buyerLocation: 'Metropolis, NY',
          productName: 'Bluetooth Speaker', quantity: 1, totalPrice: 79.99, imageUrl: corn
        },
      ]);
      setIsLoading(false);
    }, 1500);
  }, []);

  const summary = useMemo(() => {
    const late = 0;
    const count = orders.length;
    const totalQty = orders.reduce((sum, o) => sum + o.quantity, 0);
    const totalValue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    return { late,count, totalQty, totalValue };
  }, [orders]);

  return (
    <section className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Awaiting Shipments</h1>

      {/* Summary */}
      {!isLoading && (
     <div className={`${summary.late > 0 ? 'bg-red-50' : 'bg-green-50'} p-4 rounded-lg shadow flex space-x-8`}
>
          <div>
            <p className="text-sm text-gray-500">Total Shipments</p>
            <p className="text-xl font-bold text-green-600">{summary.count}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Late Shipments</p>
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

      {/* Loader or list */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <svg className="animate-spin h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </div>
      ) : (
        orders.map(order => (
          <AwaitingShipment key={order.id} order={order} onTransportSave={() => {}} />
        ))
      )}
    </section>
  );
}
