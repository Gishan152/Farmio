import { useState, useEffect } from 'react';
import slotsAPI from '../../API/slots';
import warehouseAPI from '../../API/warehouse';
import { useUserContext } from '../../Contexts/UserContext'; // ← gives user.role

export default function SlotBookingPanel({ warehouseId }) {
  const { user } = useUserContext();               // ← role + id
  const [booked, setBooked] = useState([]);        // real DB rows
  const [warehouseInfo, setWarehouseInfo] = useState(null); // warehouse capacity info
  const [allSlots, setAllSlots] = useState([]);    // every slot row
  const [availableCapacity, setAvailableCapacity] = useState(0); // total available capacity
  const [totalCapacity, setTotalCapacity] = useState(0); // warehouse total capacity
  const [pricePerUnit, setPricePerUnit] = useState(0); // price per kg
  const [newSlotForm, setNewSlotForm] = useState({
    capacityKg: '',
    productType: '',
    temperature: '',
    notes: ''
  });
  const [showCreateSlotForm, setShowCreateSlotForm] = useState(false);

  /* 1.  load real data  */
  useEffect(() => {
    // Load booked slots
    slotsAPI.getSlotsByWarehouse(warehouseId)
      .then(res => {
        const slots = res.data || [];
        setBooked(slots);
        setAllSlots(slots);
        
        // Calculate used capacity
        const usedCapacity = slots.reduce((sum, slot) => sum + (slot.totalStoredKg || 0), 0);
        const reservedCapacity = slots.reduce((sum, slot) => sum + (slot.reservedLoadKg || 0), 0);
        setAvailableCapacity(Math.max(0, totalCapacity - usedCapacity - reservedCapacity));
      });
      
    // Load warehouse information
    warehouseAPI.getWarehouses()
      .then(res => {
        const warehouse = res.data.find(w => w.id === warehouseId);
        if (warehouse) {
          setWarehouseInfo(warehouse);
          // Fix: Use correct field name priority
          const warehouseCapacity = warehouse.totalCapacity || warehouse.totalCapacityKg || 0;
          const warehousePrice = warehouse.pricePerKg || warehouse.price || 0;
          
          setTotalCapacity(warehouseCapacity);
          setPricePerUnit(warehousePrice);
          
          // Calculate available capacity
          const usedCapacity = allSlots.reduce((sum, slot) => sum + (slot.totalStoredKg || 0), 0);
          const reservedCapacity = allSlots.reduce((sum, slot) => sum + (slot.reservedLoadKg || 0), 0);
          setAvailableCapacity(Math.max(0, warehouseCapacity - usedCapacity - reservedCapacity));
        }
      });
  }, [warehouseId, totalCapacity, allSlots]);

  /* 2. Create new slot (for warehouse owner) */
  const handleCreateSlot = async () => {
    if (user.role !== 'warehouse_owner' && user.role !== 'keeper') {
      alert('Only warehouse owners can create slots');
      return;
    }
    
    if (!newSlotForm.capacityKg || !newSlotForm.productType) {
      alert('Please fill in capacity and product type');
      return;
    }
    
    if (parseFloat(newSlotForm.capacityKg) > availableCapacity) {
      alert('Slot capacity exceeds available warehouse capacity');
      return;
    }

    const payload = {
      slotNumber: `S-${String(allSlots.length + 1).padStart(3, '0')}`,
      capacityKg: parseFloat(newSlotForm.capacityKg),
      reservedLoadKg: 0,
      productType: newSlotForm.productType,
      temperature: newSlotForm.temperature ? parseFloat(newSlotForm.temperature) : null,
      storedItems: [],
      reservedUntil: new Date(Date.now() + 86400000 * 7).toISOString(),
      notes: newSlotForm.notes,
      status: 'AVAILABLE'
    };
    
    try {
      const { data } = await slotsAPI.createBooking(warehouseId, payload);
      setBooked(prev => [...prev, data]);
      setAllSlots(prev => [...prev, data]);
      setAvailableCapacity(prev => prev - parseFloat(newSlotForm.capacityKg));
      setNewSlotForm({ capacityKg: '', productType: '', temperature: '', notes: '' });
      setShowCreateSlotForm(false);
      alert('Slot created successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Slot creation failed');
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
      {/* ----------  WAREHOUSE CAPACITY OVERVIEW  ---------- */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Warehouse Capacity Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalCapacity.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Total Capacity (kg)</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{availableCapacity.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Available (kg)</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">{Math.max(0, totalCapacity - availableCapacity).toLocaleString()}</div>
            <div className="text-xs text-gray-600">Used (kg)</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-orange-600">Rs. {pricePerUnit.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Price per kg</div>
          </div>
        </div>
        
        {/* Capacity Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Utilization</span>
            <span>{totalCapacity > 0 ? Math.round(((totalCapacity - availableCapacity) / totalCapacity) * 100) : 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalCapacity > 0 ? Math.min(((totalCapacity - availableCapacity) / totalCapacity) * 100, 100) : 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* ----------  SLOT CREATION (WAREHOUSE OWNER ONLY)  ---------- */}
      {(user.role === 'warehouse_owner' || user.role === 'keeper') && (
        <div className="bg-white rounded-lg shadow border p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-md font-semibold text-gray-700">Slot Management</h3>
            <button
              onClick={() => setShowCreateSlotForm(!showCreateSlotForm)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              {showCreateSlotForm ? 'Cancel' : 'Create New Slot'}
            </button>
          </div>
          
          {showCreateSlotForm && (
            <div className="bg-gray-50 rounded-lg p-4 mt-3">
              <h4 className="font-medium text-gray-800 mb-3">Create New Slot</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={newSlotForm.capacityKg}
                    onChange={(e) => setNewSlotForm(prev => ({ ...prev, capacityKg: e.target.value }))}
                    placeholder="Enter slot capacity"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    max={availableCapacity}
                  />
                  <p className="text-xs text-gray-500 mt-1">Available capacity: {availableCapacity} kg</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newSlotForm.productType}
                    onChange={(e) => setNewSlotForm(prev => ({ ...prev, productType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Select product type</option>
                    <option value="Grains">Grains</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Dairy">Dairy Products</option>
                    <option value="Meat">Meat Products</option>
                    <option value="General">General Storage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
                  <input
                    type="number"
                    value={newSlotForm.temperature}
                    onChange={(e) => setNewSlotForm(prev => ({ ...prev, temperature: e.target.value }))}
                    placeholder="Optional temperature"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <input
                    type="text"
                    value={newSlotForm.notes}
                    onChange={(e) => setNewSlotForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Optional notes"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => setShowCreateSlotForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSlot}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  Create Slot
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------  BOOKED SLOTS  –  warehouse owner & farmer see this  ---------- */}
      <div className="bg-white rounded-lg shadow border p-4">
        <h3 className="text-md font-semibold text-gray-700 mb-3">
          Active Slots ({booked.length})
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {booked.map(s => (
            <div key={s.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-800">Slot {s.slotNumber}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  s.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                  s.status === 'RESERVED' ? 'bg-orange-100 text-orange-700' :
                  s.status === 'OCCUPIED' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {s.status}
                </span>
              </div>

              {/*  real DB columns  */}
              <div className="text-sm text-gray-600 space-y-1">
                <div><span className="font-medium">Product:</span> {s.productType || '-'}</div>
                <div><span className="font-medium">Capacity:</span> {s.capacityKg} kg</div>
                <div><span className="font-medium">Used:</span> {s.totalStoredKg || 0} kg</div>
                <div><span className="font-medium">Available:</span> {s.capacityKg - (s.totalStoredKg || 0)} kg</div>
                {s.temperature && <div><span className="font-medium">Temp:</span> {s.temperature}°C</div>}
                <div><span className="font-medium">Duration:</span> {calcDuration(new Date(), s.reservedUntil)}</div>
              </div>

              {/*  farmer / buyer name & contact – from users table  */}
              {(s.status === 'RESERVED' || s.status === 'OCCUPIED') && s.reservedByUserName && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-800">Booked by: {s.reservedByUserName}</div>
                  {s.reservedByUserContact && (
                    <div className="text-xs text-gray-500">{s.reservedByUserContact}</div>
                  )}
                </div>
              )}

              {/*  stored items – real JSON  */}
              {s.storedItems?.length > 0 && (
                <div className="mt-2 text-xs text-gray-500 bg-gray-100 rounded p-2">
                  <span className="font-medium">Items:</span> {s.storedItems.map(it => `${it.name} (${it.kg}kg)`).join(', ')}
                </div>
              )}

              {s.notes && (
                <div className="text-xs text-gray-500 mt-2 italic">{s.notes}</div>
              )}
            </div>
          ))}
        </div>
        
        {booked.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📦</div>
            <p>No active slots found</p>
            <p className="text-sm">Slots will appear here when they are created and booked</p>
          </div>
        )}
      </div>
    </div>
  );
}