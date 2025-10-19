// src/buyer/pages/WarehouseDetails.jsx
import { useState, useEffect } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { StarIcon, CheckBadgeIcon, MapPinIcon, CurrencyDollarIcon, BuildingStorefrontIcon, TagIcon, UserIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";


export async function warehouseDetailsLoader({ params }) {
    const { warehouseId } = params;
    
    try {
        // Fetch warehouse data from API
        const response = await fetch(`http://localhost:8090/api/warehouses/public/${warehouseId}`);
        
        if (!response.ok) {
            throw new Error('Warehouse not found');
        }
        
        const warehouse = await response.json();
        
        return {
            id: warehouse.id,
            name: warehouse.name,
            address: warehouse.address,
            city: warehouse.city,
            owner: {
                name: warehouse.keeperName || warehouse.owner || "Warehouse Manager",
                contact: warehouse.keeperContact,
                email: warehouse.keeperEmail,
                rating: warehouse.rating || 4.0,
            },
            location: `${warehouse.address}, ${warehouse.city}`,
            warehouseRating: warehouse.rating || 4.0,
            totalSlots: warehouse.totalSlots,
            availableSlots: warehouse.slots,
            capacityTons: warehouse.capacityTons,
            totalCapacity: warehouse.totalCapacity,
            availableCapacity: warehouse.availableCapacityKg,
            usedCapacity: warehouse.usedCapacityKg,
            pricePerTonn: warehouse.pricePerTonn,
            pricePerKg: warehouse.pricePerKg,
            storageType: warehouse.storageType,
            temperatureMin: warehouse.temperatureMin,
            temperatureMax: warehouse.temperatureMax,
            verified: warehouse.verified || false,
            badges: warehouse.badges || [],
            certifications: warehouse.certifications,
            status: warehouse.status,
            description: warehouse.description,
            createdAt: warehouse.createdAt,
            updatedAt: warehouse.updatedAt,
            coordinates: {
                latitude: warehouse.latitude,
                longitude: warehouse.longitude
            }
        };
    } catch (error) {
        console.error('Error fetching warehouse details:', error);
        throw new Response("Warehouse not found", { status: 404 });
    }
}

export const warehouseSlots = [
    {
        id: 'SLOT-001',
        type: 'Pallet',
        capacityKg: 1000,
        temperatureControl: '+2 - +8 °C',
        humidityControl: '30 - 50 %',
        availability: 'Available',
        location: 'Floor 1 / Aisle 3',
        lastMaintenance: '2025-06-15',
        pricingPerKg: 2.5,
        allowedTypes: ['Grains', 'Vegetables', 'Packaged Goods'],
        insuranceStatus: 'Insured',
    },
    {
        id: 'SLOT-002',
        type: 'Bulk',
        capacityKg: 2000,
        temperatureControl: 'None',
        humidityControl: 'None',
        availability: 'Reserved',
        location: 'Floor 1 / Aisle 5',
        lastMaintenance: '2025-05-20',
        pricingPerKg: 1.8,
        allowedTypes: ['Raw Materials', 'Construction'],
        insuranceStatus: 'Not Insured',
    },
    {
        id: 'SLOT-003',
        type: 'Refrigerated Container',
        capacityKg: 500,
        temperatureControl: '-20 °C',
        humidityControl: '50 - 60 %',
        availability: 'Available',
        location: 'Floor 0 / Dock Level',
        lastMaintenance: '2025-06-30',
        pricingPerKg: 5.0,
        allowedTypes: ['Frozen Foods', 'Medicines'],
        insuranceStatus: 'Insured',
    },
    {
        id: 'SLOT-004',
        type: 'Shelf',
        capacityKg: 200,
        temperatureControl: 'Ambient',
        humidityControl: 'Ambient',
        availability: 'Available',
        location: 'Floor 2 / Section B',
        lastMaintenance: '2025-07-01',
        pricingPerKg: 1.0,
        allowedTypes: ['Electronics', 'Small Parts'],
        insuranceStatus: 'Insured',
    },
    {
        id: 'SLOT-005',
        type: 'Cold Room',
        capacityKg: 1500,
        temperatureControl: '0 - +4 °C',
        humidityControl: '60 - 70%',
        availability: 'Under Maintenance',
        location: 'Floor 0 / Section C',
        lastMaintenance: '2025-07-05',
        pricingPerKg: 3.5,
        allowedTypes: ['Dairy', 'Pharmaceutical'],
        insuranceStatus: 'Insured',
    },
];


export default function WarehouseDetails() {
    const w = useLoaderData();

    const [open, setOpen] = useState(false);

    const handleReserve = selectedSlots => {
        console.log('Reserved slots:', selectedSlots);
        // API call or state update here
    };


    return (
        <div className="container mx-auto p-6 space-y-6">
            <nav className="text-gray-500 text-sm flex justify-between">
                <ul className="flex space-x-2">
                    <li><Link to="/buyer/warehouses/all" className="hover:underline">warehouses</Link> /</li>
                    <li><span>warehouseId</span></li>
                </ul>
            </nav>
            {/* Warehouse Info Card */}
            <div className="w-full">
                <div className="space-y-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
                        <h1 className="text-3xl font-bold text-green-800 dark:text-green-200 flex items-center gap-2">
                            <BuildingStorefrontIcon className="h-7 w-7 text-green-500" />
                            {w.name}
                            {w.verified && (
                                <CheckBadgeIcon className="h-6 w-6 text-green-500" />
                            )}
                        </h1>
                        <span className="flex items-center gap-1 text-yellow-600 font-semibold ml-2">
                            <StarIcon className="h-5 w-5" />{w.warehouseRating}
                        </span>
                    </div>
                    {/* Badges row */}
                    {w.badges && w.badges.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1 mb-1">
                            {w.badges.map(b => (
                                <span key={b} className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 text-xs font-medium px-2 py-1 rounded shadow flex items-center">
                                    <TagIcon className="inline h-4 w-4 mr-1 align-text-bottom" />{b}
                                </span>
                            ))}
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <MapPinIcon className="h-5 w-5" />
                        <span>{w.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="h-8 w-8 rounded-full border-2 border-green-400 bg-green-100 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <span className="ml-2 font-medium text-gray-800 dark:text-gray-100 flex items-center gap-1">
                            <span>{w.owner.name}</span>
                        </span>
                        <span className="flex items-center gap-1 text-yellow-600 ml-2">
                            <StarIcon className="h-4 w-4" />{w.owner.rating}
                        </span>
                    </div>
                    
                    {/* Contact Information */}
                    <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        {w.owner.contact && (
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Contact:</span> {w.owner.contact}
                            </div>
                        )}
                        {w.owner.email && (
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Email:</span> {w.owner.email}
                            </div>
                        )}
                    </div>
                    <p className="mt-2 text-gray-700 dark:text-gray-200 text-base">{w.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <TagIcon className="h-5 w-5 text-green-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">Storage Type</span>
                            </div>
                            <span className="font-medium text-gray-800 dark:text-gray-100">{w.storageType}</span>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <ShieldCheckIcon className="h-5 w-5 text-blue-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">Total Capacity</span>
                            </div>
                            <span className="font-medium text-gray-800 dark:text-gray-100">{w.capacityTons} tons</span>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <CurrencyDollarIcon className="h-5 w-5 text-yellow-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">Price per Kg</span>
                            </div>
                            <span className="font-medium text-gray-800 dark:text-gray-100">Rs. {w.pricePerKg}/kg</span>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Slots</div>
                            <span className="font-medium text-gray-800 dark:text-gray-100">{w.totalSlots}</span>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Available Slots</div>
                            <span className="font-medium text-green-600">{w.availableSlots}</span>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Available Capacity</div>
                            <span className="font-medium text-green-600">{Math.round(w.availableCapacity/1000)} kg</span>
                        </div>
                        
                        {w.temperatureMin && w.temperatureMax && (
                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Temperature Range</div>
                                <span className="font-medium text-gray-800 dark:text-gray-100">{w.temperatureMin}°C - {w.temperatureMax}°C</span>
                            </div>
                        )}
                        
                        {w.certifications && (
                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Certifications</div>
                                <span className="font-medium text-gray-800 dark:text-gray-100">{w.certifications}</span>
                            </div>
                        )}
                        
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</div>
                            <span className={`font-medium ${w.status === 'OPEN' ? 'text-green-600' : 'text-gray-600'}`}>{w.status}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
            <div className="grid grid-cols-1 gap-6">
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Slot Type</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Capacity</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Temp. Control</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Humidity</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Location</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Last Maint.</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Price/Kg</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Allowed Types</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Insurance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {warehouseSlots.map(slot => (
                                <tr key={slot.id} className="odd:bg-white even:bg-gray-50 dark:even:bg-gray-900 hover:bg-green-50 dark:hover:bg-green-900 transition-colors">
                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100 font-semibold flex items-center gap-2">
                                        <TagIcon className="h-4 w-4 text-green-500" />{slot.type}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{slot.capacityKg} kg</td>
                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{slot.temperatureControl}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{slot.humidityControl}</td>
                                    <td className="px-4 py-2 text-sm font-medium">
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${slot.availability === 'Available'
                                            ? 'bg-green-100 text-green-700'
                                            : slot.availability === 'Reserved'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>{slot.availability}</span>
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{slot.location}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{slot.lastMaintenance}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">Rs. {slot.pricingPerKg.toFixed(2)}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">
                                        {slot.allowedTypes.map(type => (
                                            <span key={type} className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-2 py-0.5 mr-1 mb-1 text-xs font-medium">{type}</span>
                                        ))}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{slot.insuranceStatus}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ReserveSlotsModal
                isOpen={open}
                onClose={() => setOpen(false)}
                warehouseSlots={warehouseSlots.filter(s => s.availability === 'Available')}
                onReserve={handleReserve}
            />

            <div className="flex gap-4 mt-6">
                <button
                    onClick={() => setOpen(true)}
                    className="px-5 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition"
                >
                    Reserve Slots
                </button>
                <button className="px-5 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    Contact Owner
                </button>
            </div>
        </div>
    );
}

function ReserveSlotsModal({
    isOpen,
    onClose,
    warehouseSlots = [],
    onReserve
}) {
    const navigate = useNavigate();
    // Group slots by type and count available for each type
    const slotTypeMap = warehouseSlots.reduce((acc, slot) => {
        if (!acc[slot.type]) acc[slot.type] = [];
        acc[slot.type].push(slot);
        return acc;
    }, {});

    // selectedQuantities: { [slotType]: number }
    const [selectedQuantities, setSelectedQuantities] = useState({});

    useEffect(() => {
        if (!isOpen) setSelectedQuantities({});
    }, [isOpen]);

    const handleQuantityChange = (type, max, value) => {
        let v = parseInt(value, 10);
        if (isNaN(v) || v < 0) v = 0;
        if (v > max) v = max;
        setSelectedQuantities(prev => ({ ...prev, [type]: v }));
    };

    const handleReserve = () => {
        // For each type, pick the first N slots of that type
        let reserved = [];
        Object.entries(selectedQuantities).forEach(([type, qty]) => {
            if (qty > 0 && slotTypeMap[type]) {
                reserved = reserved.concat(slotTypeMap[type].slice(0, qty));
            }
        });
        if (reserved.length === 0) return;
        onReserve(reserved);
        // Redirect to confirmation page with reserved slots
        navigate("/buyer/warehouses/reservation-confirmation", { state: { reservedSlots: reserved } });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8 z-10 border border-green-100 dark:border-green-800">
                <h2 className="text-2xl font-bold mb-6 text-green-800 dark:text-green-200 flex items-center gap-2">
                    <TagIcon className="h-6 w-6 text-green-500" /> Reserve Storage Slots
                </h2>
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                    {Object.keys(slotTypeMap).length === 0 && (
                        <div className="text-center text-gray-500 py-8">No available slots.</div>
                    )}
                    {Object.entries(slotTypeMap).map(([type, slots]) => {
                        const slot = slots[0]; // All slots of this type have same properties except id
                        const maxQty = slots.length;
                        return (
                            <div key={type} className="flex items-center gap-4 p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900 transition">
                                <div className="flex-1 text-sm">
                                    <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                        <TagIcon className="h-4 w-4 text-green-500" />{type}
                                        <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-2 py-0.5">{slot.capacityKg} kg</span>
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-300 flex flex-wrap gap-2 mt-1">
                                        <span>Temp: {slot.temperatureControl}</span>
                                        <span>Humidity: {slot.humidityControl}</span>
                                        <span>Location: {slot.location}</span>
                                        <span>Rs. {slot.pricingPerKg}/kg</span>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Allowed: {slot.allowedTypes.join(', ')} | Insurance: {slot.insuranceStatus}
                                    </div>
                                </div>
                                <div className="flex flex-col items-center min-w-[120px]">
                                    <label className="text-xs text-gray-700 dark:text-gray-200 mb-1">Number of slots</label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={maxQty}
                                        value={selectedQuantities[type] || ''}
                                        onChange={e => handleQuantityChange(type, maxQty, e.target.value)}
                                        className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center focus:ring-2 focus:ring-green-400 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                        placeholder={`0 - ${maxQty}`}
                                    />
                                    <span className="text-xs text-gray-500 mt-1">of {maxQty} available</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleReserve}
                        disabled={!Object.values(selectedQuantities).some(qty => qty > 0)}
                        className="px-5 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                    >
                        Reserve Slots
                    </button>
                </div>
            </div>
        </div>
    );
}
