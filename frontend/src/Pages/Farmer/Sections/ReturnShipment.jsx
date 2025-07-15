import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import corn from "../../../Assets/Farmer/Crops/corn.jpeg";

const sampleOrders = [
  {
    id: '123456',
    buyerName: 'John Doe',
    buyerAddress: '123 Main St, Springfield',
    buyerLocation: 'Springfield, IL',
    productName: 'Rice',
    quantity: '200kg',
    totalPrice: '$199.98',
    imageUrl: corn,
    returnTransport: {
      vehicleReg: 'RET 1234',
      driverName: 'Return Driver',
      driverPhone: '123-456-7890',
      driverEmail: 'return@example.com',
      loadNumber: 'RET-5678',
    },
    refundProcessed: false,
  },
  {
    id: '654321',
    buyerName: 'Jane Smith',
    buyerAddress: '789 South Rd, Shelbyville',
    buyerLocation: 'Shelbyville, IL',
    productName: 'Corn',
    quantity: '100kg',
    totalPrice: '$149.99',
    imageUrl: corn,
    returnTransport: null,
    refundProcessed: true,
  },
];

export default function ReturnDashboard({ onRefund }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isRefundPopupOpen, setRefundPopupOpen] = useState(false);
  const [isTransportPopupOpen, setTransportPopupOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setOrders(sampleOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleRefund = (id) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, refundProcessed: true } : order
      )
    );
    onRefund && onRefund(id);
  };

  return (
    <section className="p-6 space-y-10 max-w-7xl mx-auto">
       <h2 className="text-2xl font-semibold mb-6 text-gray-800">Returns</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold">Total Returns</h3>
          <p className="text-2xl text-green-600">{orders.length}</p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold">Refunds Processed</h3>
          <p className="text-2xl text-green-600">{orders.filter(o => o.refundProcessed).length}</p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold">Pending Refunds</h3>
          <p className="text-2xl text-red-500">{orders.filter(o => !o.refundProcessed).length}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <svg className="animate-spin h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl shadow-lg p-8 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4">
                <img src={order.imageUrl} alt={order.productName} className="rounded-2xl h-40 w-full object-cover" />
              </div>
              <div className="flex-1 space-y-3">
                <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                <h2 className="text-2xl font-bold text-green-700">{order.productName} ({order.quantity})</h2>
                <p className="text-lg text-gray-800"><span className="font-medium">Buyer:</span> {order.buyerName}</p>
                <p className="text-lg text-gray-800"><span className="font-medium">Total Price:</span> {order.totalPrice}</p>
                <p className="text-lg">
                  <span className="font-medium">Refund Status:</span>
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${order.refundProcessed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {order.refundProcessed ? 'Refunded' : 'Pending'}
                  </span>
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <button
                    className={`px-5 py-2 text-white rounded-lg font-medium transition ${order.refundProcessed ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    disabled={order.refundProcessed}
                    onClick={() => {
                      setSelectedOrder(order);
                      setRefundPopupOpen(true);
                    }}
                  >
                    Process Refund
                  </button>

                  <button
                    className="px-5 py-2 bg-white text-green-600 border border-green-600 rounded-lg font-medium hover:bg-green-50"
                    onClick={() => {
                      setSelectedOrder(order);
                      setTransportPopupOpen(true);
                    }}
                  >
                    Transport Info
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isRefundPopupOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-60" onClick={() => setRefundPopupOpen(false)} />
          <div className="bg-white rounded-xl shadow-xl p-6 z-10 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Confirm Refund</h3>
              <button onClick={() => setRefundPopupOpen(false)} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-3 text-gray-800">
              <p>Make sure you get the return.</p>
              <p>Refund <strong>{selectedOrder.totalPrice}</strong> for:</p>
              <p>Order ID:{selectedOrder.id}</p>
              <p>Product: {selectedOrder.productName}</p>
              <p>Buyer: {selectedOrder.buyerName}</p>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setRefundPopupOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleRefund(selectedOrder.id);
                  setRefundPopupOpen(false);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {isTransportPopupOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-60" onClick={() => setTransportPopupOpen(false)} />
          <div className="bg-white rounded-xl shadow-xl p-6 z-10 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Return Transport Details</h3>
              <button onClick={() => setTransportPopupOpen(false)} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            {selectedOrder.returnTransport ? (
              <div className="space-y-2 text-gray-800">
                <p>Vehicle Reg: {selectedOrder.returnTransport.vehicleReg}</p>
                <p>Driver Name: {selectedOrder.returnTransport.driverName}</p>
                <p>Driver Phone: {selectedOrder.returnTransport.driverPhone}</p>
                <p>Driver Email: {selectedOrder.returnTransport.driverEmail}</p>
                <p>Load Number: {selectedOrder.returnTransport.loadNumber}</p>
              </div>
            ) : (
              <p className="text-gray-500">Transport details not available.</p>
            )}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setTransportPopupOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}