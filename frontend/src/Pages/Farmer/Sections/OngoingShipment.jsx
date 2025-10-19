import React, { useState, useEffect, useMemo } from 'react';
import { TruckIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import api from "../../../API/client";

// Single ongoing shipment card
export function OngoingShipment({ order, onMarkDelivered }) {
  const {
    id,
    orderId,
    buyerId,
    status,
    total,
    items = [],
  } = order;

  // In absence of explicit transport fields in backend, render placeholders
  const transportData = { vehicleReg: '-', driverName: '-', driverPhone: '-', driverEmail: '-', loadNumber: '-', loadPicked: true, loadDelivered: false, buyerConfirmation: false };
  const [showDetails, setShowDetails] = useState(false);
  const totalNumber = typeof total === 'number' ? total : Number(total || 0);
  const firstItem = items?.[0];
  const itemSummary = firstItem ? `${firstItem.quantity} ${firstItem.unitMeasurement} of ${firstItem.__product?.type || ('#'+firstItem.cropId)}` : '—';

  return (
    <div className="max-w mx-auto bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
      <div className="flex flex-col sm:flex-row">
        {/* Info Section */}
     <div className="m-8 max-w-sm min-w-sm">
      <div className="sm:col-span-2 grid grid-cols-2 gap-5">
        {[
          { label: 'Order ID', value: id || orderId },
          { label: 'Buyer ID', value: buyerId },
          { label: 'Status', value: status },
          { label: 'Items', value: itemSummary },
          { label: 'Order Total', value: `$${totalNumber.toFixed(2)}` },
          { label: 'Payout', value: `$${totalNumber.toFixed(2)}` },
        ].map(field => (
          <div key={field.label} className="flex flex-col space-y-1">
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
          <button
            onClick={() => onMarkDelivered(id || orderId)}
            className="mt-4 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
          >
            Mark Delivered
          </button>
        </div>

        {/* Items list */}
        <div className="sm:w-1/3 p-6 border-l border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Order Items</p>
          <div className="space-y-1">
            {(items || []).map((it, idx) => (
              <div key={idx} className="text-sm text-gray-700 flex gap-3">
                <span className="min-w-24">{it.__product?.type || `Crop #${it.cropId}`}</span>
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
  );
}

// List of multiple ongoing shipments with loader and details summary
export default function OngoingShipmentsList() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [productMap, setProductMap] = useState({});

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    api
      .get('/api/order/farmer/ongoing-shipment')
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

  // Details summary
  const summary = useMemo(() => {
    const late = 0;
    const count = orders.length;
    const totalQty = orders.reduce((sum, o) => sum + (o.items?.reduce((s,i)=> s + Number(i.quantity || 0), 0) || 0), 0);
    const totalValue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    return { late,count, totalQty, totalValue };
  }, [orders]);

  const refresh = () => {
    setIsLoading(true);
    api.get('/api/order/farmer/ongoing-shipment')
      .then(res => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(err => setError(err?.response?.data || 'Failed to refresh orders'))
      .finally(() => setIsLoading(false));
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      await api.post(`/api/order/farmer/mark-delivered/${orderId}`);
      refresh();
    } catch (e) {
      alert(e?.response?.data || 'Failed to mark delivered');
    }
  };

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
        <>
          {error && (<div className="p-3 bg-red-50 text-red-700 rounded">{String(error)}</div>)}
          {orders.map(order => (
            <OngoingShipment
              key={order.id || order.orderId}
              order={{
                ...order,
                items: (order.items || []).map(it => ({ ...it, __product: productMap[it.cropId] }))
              }}
              onMarkDelivered={handleMarkDelivered}
            />
          ))}
        </>
      )}
    </section>
  );
}