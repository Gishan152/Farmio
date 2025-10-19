import { useState, useEffect } from 'react';
import slotsAPI from '../../API/slots';
import { useUserContext } from '../../Contexts/UserContext'; // ← gives user.role

export default function SlotBookingPanel({ warehouseId }) {
  const { user } = useUserContext();               // ← role + id
  const [booked, setBooked] = useState([]);        // real DB rows
  const [available, setAvailable] = useState([]);  // generated numbers
  const [allSlots, setAllSlots] = useState([]);    // every slot row

  /* 1.  load real data  */
  useEffect(() => {
    slotsAPI.getBookedAndAvailable(warehouseId)
      .then(res => {
        setBooked(res.data.booked);
        setAvailable(res.data.availableNumbers);
      });
    slotsAPI.getSlotsByWarehouse(warehouseId)
      .then(res => setAllSlots(res.data || []));
  }, [warehouseId]);

  /* 2.  farmer / buyer can book  */
  const handleBook = async (num) => {
    if (user.role !== 'farmer' && user.role !== 'buyer') {
      alert('Only farmers or buyers can book slots');
      return;
    }
    const payload = {
      slotNumber: num.toString().padStart(3, '0'),
      capacityKg: 1000,
      reservedLoadKg: 0,
      productType: '',
      storedItems: [],
      reservedUntil: new Date(Date.now() + 86400000 * 7).toISOString(),
      notes: ''
    };
    try {
      const { data } = await slotsAPI.createBooking(warehouseId, payload);
      setBooked(prev => [...prev, data]);
      setAllSlots(prev => [...prev, data]);
      setAvailable(prev => prev.filter(n => n !== num));
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    }
  };

  /* 3.  helper  */
  const calcDuration = (from, to) => {
    if (!from || !to) return '-';
    const days = Math.ceil((new Date(to) - new Date(from)) / 86400000);
    return days <= 0 ? '-' : `${days} day(s)`;
  };

  /* 4.  render  */
  return (
    <div className="space-y-4">
      {/* ----------  BOOKED SLOTS  –  warehouse owner & farmer see this  ---------- */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {booked.map(s => (
          <div key={s.id} className="bg-white rounded-lg shadow border p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-800">Slot {s.slotNumber}</span>
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">{s.status}</span>
            </div>

            {/*  real DB columns  */}
            <div className="text-sm text-gray-600">Product: {s.productType || '-'}</div>
            <div className="text-sm text-gray-600">Kg: {s.totalStoredKg || 0} / {s.capacityKg}</div>
            <div className="text-sm text-gray-600">Temp: {s.temperature ?? '-'} °C</div>
            <div className="text-sm text-gray-600">Duration: {calcDuration(new Date(), s.reservedUntil)}</div>
            <div className="text-sm text-gray-600">Storage: {s.warehouseName || '-'}</div>

            {/*  farmer / buyer name & contact – from users table  */}
            <div className="text-sm text-gray-600">Booked by: {s.reservedByUserName} ({s.reservedByUserContact})</div>

            {/*  stored items – real JSON  */}
            {s.storedItems?.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                Items: {s.storedItems.map(it => `${it.name} (${it.kg}kg)`).join(', ')}
              </div>
            )}

            <div className="text-sm text-gray-500 mt-1">{s.notes || '-'}</div>
          </div>
        ))}
      </div>

      {/*  farmer / buyer sees the available strip  */}
      {(user.role === 'farmer' || user.role === 'buyer') && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Available slot numbers</h3>
            <span className="text-xs text-gray-500">{available.length} slots</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {available.map(n => (
              <button
                key={n}
                onClick={() => handleBook(n)}
                className="px-3 py-1 bg-white border rounded hover:bg-green-50 hover:border-green-400 text-sm"
              >
                {n.toString().padStart(3, '0')}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}