import React, { useState, useEffect, useMemo } from 'react';
import { TruckIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import api from "../../../API/client";

// Paid and Shipped card
export function PaidAndShipped({ order }) {
  const {
    id,
    orderId,
    buyerId,
    status,
    total,
    items = [],
  } = order;

  const transportData = { vehicleReg: '-', driverName: '-', driverPhone: '-', driverEmail: '-', loadNumber: '-', loadPicked: true, loadDelivered: true, buyerConfirmation: true };
  const [showDetails, setShowDetails] = useState(false);
  const totalNumber = typeof total === 'number' ? total : Number(total || 0);
  const firstItem = items?.[0];
  const itemSummary = firstItem ? `${firstItem.quantity} ${firstItem.unitMeasurement} of ${firstItem.__product?.type || ('#'+firstItem.cropId)}` : '—';

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
            { label: 'Order ID', value: id || orderId },
            { label: 'Buyer ID', value: buyerId },
            { label: 'Status', value: status },
            { label: 'Items', value: itemSummary },
            { label: 'Order Total', value: `$${totalNumber.toFixed(2)}` },
            { label: 'Earnings', value: `$${totalNumber.toFixed(2)}` },
          ].map(field => (
            <div key={field.label} className="flex flex-col">
              <span className="text-sm text-gray-500">{field.label}</span>
              <span className="text-md font-medium text-gray-800">{field.value}</span>
            </div>
          ))}
          <div className="col-span-2">
            <div className="mt-4 border-t pt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Order Items</p>
              <div className="space-y-1">
                {(items || []).map((it, idx) => (
                  <div key={idx} className="text-sm text-gray-700 flex gap-3">
                    <span className="min-w-24">Crop #{it.cropId}</span>
                    <span>
                      {Number(it.quantity || 0)} {it.unitMeasurement || ''}
                    </span>
                  </div>
                ))}
                {(!items || items.length === 0) && (
                  <div className="text-sm text-gray-500">No items</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Transport Info & Image */}
        <div className="flex flex-col items-center space-y-4">
          {/* Image omitted - backend does not provide */}
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
  const [error, setError] = useState("");
  const [productMap, setProductMap] = useState({});

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    api
      .get('/api/order/farmer/paid-and-shipped')
      .then(res => { if (mounted) setOrders(Array.isArray(res.data) ? res.data : []); })
      .catch(err => { setError(err?.response?.data || 'Failed to load orders'); })
      .finally(() => { if (mounted) setIsLoading(false); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const ids = Array.from(new Set(orders.flatMap(o => (o.items || []).map(it => it.cropId)).filter(Boolean)));
    if (ids.length === 0) { setProductMap({}); return; }
    api.post('/api/products/by-ids', ids)
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : [];
        const map = list.reduce((acc, p) => { acc[p.id] = p; return acc; }, {});
        setProductMap(map);
      })
      .catch(() => {})
  }, [orders]);

  const summary = useMemo(() => ({
    count: orders.length,
    totalQty: orders.reduce((sum, o) => sum + (o.items?.reduce((s,i)=> s + Number(i.quantity || 0), 0) || 0), 0),
    totalValue: orders.reduce((sum, o) => sum + Number(o.total || 0), 0)
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
        <>
          {error && (<div className="p-3 bg-red-50 text-red-700 rounded">{String(error)}</div>)}
          {orders.map(order => (
            <PaidAndShipped
              key={order.id || order.orderId}
              order={{
                ...order,
                items: (order.items || []).map(it => ({ ...it, __product: productMap[it.cropId] }))
              }}
            />
          ))}
        </>
      )}
    </section>
  );
}
