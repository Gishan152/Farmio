import React, { useState, useEffect, useMemo } from 'react';
import api from "../../../API/client";

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
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon" className="h-6 w-6"><path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"></path></svg>
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
export function AwaitingShipment({ order, onMarkAwaitingPickup, onMarkInTransport }) {
  const {
    id,
    orderId,
    buyerId,
    status,
    total,
    items = [],
  } = order;

  console.log("Order items : ", items);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const normStatus = (status || '').toString().trim().toUpperCase();
  const anyTransportAvailable = (items || []).some(it => it.__product?.transportationAvailable);
  console.log("anyTransportAvailable : ", anyTransportAvailable)

  const handleSave = details => {
    // Optional: Persist transport details if backend supports it; for now, directly mark in-transport
    if (order?.status === 'AWAITING_PICKUP') {
      onMarkInTransport(id || orderId);
    }
    setIsModalOpen(false);
  };

  const primaryAction = () => {
    const oid = id || orderId;
    if (!oid) return;
    if (normStatus === 'PROCESSING') return onMarkAwaitingPickup(oid);
    if (normStatus === 'AWAITING_PICKUP' && anyTransportAvailable) return setIsModalOpen(true);
  };

  const primaryLabel = (
    normStatus === 'PROCESSING'
      ? 'Mark Ready for Pickup'
      : normStatus === 'AWAITING_PICKUP'
        ? (anyTransportAvailable ? 'Add Transport Details' : 'Transport Not Available')
        : 'No Actions Available'
  );

  const firstItem = items?.[0];
  const itemSummary = firstItem ? `${firstItem.quantity} ${firstItem.unitMeasurement} of ${firstItem.__product?.type || ('#'+firstItem.cropId)}` : '—';
  const totalNumber = typeof total === 'number' ? total : Number(total || 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
      <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="sm:col-span-2 grid grid-cols-2 gap-4">
          {[
            { label: 'Order ID', value: id || orderId },
            { label: 'Buyer ID', value: buyerId },
            { label: 'Status', value: status },
            { label: 'Items', value: itemSummary },
            { label: 'Order Total', value: `$${totalNumber.toFixed(2)}` },
            { label: 'Payout', value: `$${totalNumber.toFixed(2)}` },
          ].map(field => (
            <div key={field.label} className="flex flex-col">
              <span className="text-sm text-gray-500">{field.label}</span>
              <span className="text-md font-medium text-gray-800">{field.value}</span>
            </div>
          ))}
          {/* Detailed items list */}
          <div className="col-span-2">
            <div className="mt-4 border-t pt-3">
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

        {/* Image & Action */}
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={primaryAction}
            disabled={!(normStatus === 'PROCESSING' || (normStatus === 'AWAITING_PICKUP' && anyTransportAvailable))}
            className={`mt-auto w-full py-2 rounded-lg text-white ${(normStatus === 'PROCESSING' || (normStatus === 'AWAITING_PICKUP' && anyTransportAvailable)) ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            {primaryLabel}
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
  const [error, setError] = useState("");
  const [productMap, setProductMap] = useState({});
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    api
      .get('/api/order/farmer/awaiting-shipment')
      .then(res => {
        if (!mounted) return;
        setOrders(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error('Failed to load awaiting-shipment orders', err);
        setError(err?.response?.data || 'Failed to load orders');
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  // Fetch product details for all cropIds present in current orders
  useEffect(() => {
    const ids = Array.from(
      new Set(
        orders.flatMap(o => (o.items || []).map(it => it.cropId)).filter(Boolean)
      )
    );
    if (ids.length === 0) { setProductMap({}); return; }
    setProductsLoading(true);
    api.post('/api/products/by-ids', ids)
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : [];
        const map = list.reduce((acc, p) => { acc[p.id] = p; return acc; }, {});
        console.log("product map : ", map)
        setProductMap(map);
      })
      .catch(err => {
        console.error('Failed to fetch product details', err);
      })
      .finally(() => setProductsLoading(false));
  }, [orders]);

  const summary = useMemo(() => {
    const late = 0;
    const count = orders.length;
    const totalQty = orders.reduce((sum, o) => sum + (o.items?.reduce((s,i)=> s + Number(i.quantity || 0), 0) || 0), 0);
    const totalValue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    return { late, count, totalQty, totalValue };
  }, [orders]);

  const refresh = () => {
    setIsLoading(true);
    api.get('/api/order/farmer/awaiting-shipment')
      .then(res => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(err => setError(err?.response?.data || 'Failed to refresh orders'))
      .finally(() => setIsLoading(false));
  };

  const handleMarkAwaitingPickup = async (orderId) => {
    try {
      await api.post(`/api/order/farmer/mark-awaiting-pickup/${orderId}`);
      refresh();
    } catch (e) {
      alert(e?.response?.data || 'Failed to mark ready for pickup');
    }
  };

  const handleMarkInTransport = async (orderId) => {
    try {
      await api.post(`/api/order/farmer/mark-in-transport/${orderId}`);
      refresh();
    } catch (e) {
      alert(e?.response?.data || 'Failed to mark in transport');
    }
  };

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
        <>
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded">{String(error)}</div>
          )}
          {orders.map(order => (
            <AwaitingShipment
              key={order.id || order.orderId}
              order={{
                ...order,
                // Augment the item summary using product names where available
                items: (order.items || []).map(it => ({
                  ...it,
                  __product: productMap[it.cropId]
                }))
              }}
              onMarkAwaitingPickup={handleMarkAwaitingPickup}
              onMarkInTransport={handleMarkInTransport}
            />
          ))}
        </>
      )}
    </section>
  );
}
