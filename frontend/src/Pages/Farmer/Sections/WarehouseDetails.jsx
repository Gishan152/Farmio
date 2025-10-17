import { React, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { StarIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";
import warehouseImage from "../../../Assets/Farmer/Warehouses/warehouse.webp";
import warehouseImage2 from "../../../Assets/Farmer/Warehouses/warehouse2.webp";

// Format slot ID with S- prefix
const formatSlotId = (id) => {
    if (typeof id === 'string' && id.startsWith('S-')) {
        return id; // Already formatted
    }
    return `S-${String(id).padStart(3, '0')}`;
};

export async function FarmerwarehouseDetailsLoader({ params }) {
    const { warehouseId } = params;
    // TODO: Replace with actual API call to GET /warehouses/{id}
    return {
        id: warehouseId,
        name: "Sunrise Warehouse",
        address: "123 Farm Road, Iowa, USA",
        owner: {
            name: "John Doe",
            avatarUrl: "https://randomuser.me/api/portraits/men/44.jpg",
            rating: 4.7,
        },
        location: "Iowa, USA",
        warehouseRating: 4.6,
        description: "Sunrise Warehouse offers modern, secure & temperature controlled storage. Ideal for agricultural produce and packaged goods. Located near main roads with 24/7 security.",
        storageType: "Temperature controlled",
        temperatureRange: "5°C to 15°C",
        totalCapacityTons: 250,
        pricePerKgPerDay: 0.5, // Rs. per kg per day
        certifications: ["ISO 9001", "Organic Certified"],
        images: [warehouseImage, warehouseImage2, warehouseImage],
        slots: [
            {
                id: 1,
                capacityKg: 100,
                temperatureControl: true,
                humidityControl: true,
                status: "available",
                floor: "1",
                section: "A",
                lastMaintenance: "2023-01-01",
                allowedItemTypes: ["Vegetables", "Fruits"],
                insuranceStatus: "Covered",
            },
            {
                id: 2,
                capacityKg: 150,
                temperatureControl: false,
                humidityControl: true,
                status: "reserved",
                reservedUntil: "2023-06-01",
                floor: "2",
                section: "B",
                lastMaintenance: "2023-02-01",
                allowedItemTypes: ["Grains"],
                insuranceStatus: "Not Covered",
            },
        ],
        reviews: [
            { user: "Jane Smith", rating: 5, comment: "Great warehouse, very secure." },
            { user: "Bob Johnson", rating: 4, comment: "Good service, but could improve on cleanliness." },
        ],
        verified: true,
        badges: ["24/7 Security", "Fumigation Certified"],
    };
}

export default function FarmerWarehouseDetails() {
    const w = useLoaderData();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState("");
    const [produceType, setProduceType] = useState("");
    const [quantity, setQuantity] = useState("");
    const [duration, setDuration] = useState("");
    const [isPaymentComplete, setIsPaymentComplete] = useState(false);

    const availableSlots = w.slots.filter((s) => s.status === "available");
    const selectedSlotData = availableSlots.find((s) => s.id === parseInt(selectedSlot));
    const selectedSlotCapacity = selectedSlotData ? selectedSlotData.capacityKg : 0;

    // Payment breakdown calculation
    const storageCost = quantity && duration ? quantity * w.pricePerKgPerDay * duration : 0;
    const baseFee = storageCost * 0.1; // 10% base fee
    const totalCost = storageCost + baseFee;

    // Form validation
    const isFormValid =
        selectedSlot &&
        produceType &&
        quantity > 0 &&
        quantity <= selectedSlotCapacity &&
        duration > 0;

    const handleProceedToPayment = () => {
        if (isFormValid) {
            // Simulate PayHere redirect (replace with actual PayHere integration)
            console.log("Redirecting to PayHere with:", {
                slot: selectedSlot,
                produceType,
                quantity,
                duration,
                totalCost,
            });
            // Simulate payment completion
            setTimeout(() => {
                setIsPaymentComplete(true);
            }, 1000); // Simulate network delay
        }
    };

    const resetForm = () => {
        setSelectedSlot("");
        setProduceType("");
        setQuantity("");
        setDuration("");
        setIsPaymentComplete(false);
        setIsModalOpen(false);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="relative w-50 lg:w-1/4 min-w-80">
                        <img
                            src={w.images[currentImageIndex]}
                            alt={w.name}
                            className="object-cover w-80 h-80"
                        />
                        {w.verified && (
                            <div className="absolute top-2 right-2 bg-white p-1 border-none rounded-[50%]">
                                <CheckBadgeIcon className="h-6 w-6 text-green-500" />
                            </div>
                        )}
                        <div className="absolute bottom-0 left-3 flex flex-wrap gap-2">
                            {w.badges.map((b) => (
                                <span
                                    key={b}
                                    className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 text-xs font-medium px-2 py-1 rounded"
                                >
                                    {b}
                                </span>
                            ))}
                        </div>
                        <br />
                        {/* Thumbnail Gallery */}
                        <div className="flex gap-2">
                            {w.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Warehouse image ${index + 1}`}
                                    className={`w-24 h-24 object-cover rounded cursor-pointer transition-all ${
                                        index === currentImageIndex
                                            ? "border-2 border-green-500"
                                            : "border-2 border-transparent"
                                    } hover:border-green-300`}
                                    onClick={() => setCurrentImageIndex(index)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-bold">{w.name}</h1>
                            <div className="flex items-center min-w-65">
                                <StarIcon className="h-5 w-5 text-yellow-500" />
                                <span className="ml-1">{w.warehouseRating}</span>
                            </div>
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Book a Slot
                            </button>
                        </div>
                        <p className="text-gray-600">{w.location}</p>
                        <p className="text-gray-600">{w.address}</p>
                        <div className="flex items-center">
                            <img src={w.owner.avatarUrl} alt={w.owner.name} className="h-8 w-8 rounded-full" />
                            <span className="ml-2">{w.owner.name}</span>
                            <StarIcon className="h-4 w-4 text-yellow-500 ml-2" />
                            <span className="ml-1">{w.owner.rating}</span>
                        </div>
                        <p className="mt-4 text-gray-800">{w.description}</p>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">Storage Type:</span>
                                <span className="text-sm text-gray-700">{w.storageType}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">Temperature Range:</span>
                                <span className="text-sm text-gray-700">{w.temperatureRange}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">Total Capacity:</span>
                                <span className="text-sm text-gray-700">{w.totalCapacityTons} tons</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">Price per Kg per Day:</span>
                                <span className="text-sm text-gray-700">Rs. {w.pricePerKgPerDay.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">Certifications:</span>
                                <span className="text-sm text-gray-700">{w.certifications.join(", ")}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">Total Slots:</span>
                                <span className="text-sm text-gray-700">{w.slots.length}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">Available Slots:</span>
                                <span className="text-sm text-gray-700">{w.slots.filter(s => s.status === "available").length}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">Address:</span>
                                <span className="text-sm text-gray-700">{w.address}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slot Details Table */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-green-50 dark:bg-green-300">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">Slot Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">Capacity (kg)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">Temperature Control</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">Humidity Control</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">Availability Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">Floor/Section</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">Last Maintenance</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">Pricing (Rs./kg/day)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">Allowed Item Types</th>
                            <th className="px-6 py-daad2px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">Insurance Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                        {w.slots.map(slot => (
                            <tr key={slot.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{formatSlotId(slot.id)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{slot.capacityKg}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {slot.temperatureControl ? (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Yes
                                        </span>
                                    ) : (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                            No
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {slot.humidityControl ? (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Yes
                                        </span>
                                    ) : (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                            No
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {slot.status === "available" ? (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Available
                                        </span>
                                    ) : (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                            Reserved until {slot.reservedUntil}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">Floor {slot.floor}, Section {slot.section}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{slot.lastMaintenance}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{w.pricePerKgPerDay.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-wrap gap-1">
                                        {slot.allowedItemTypes.map((type) => (
                                            <span key={type} className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full dark:bg-gray-700 dark:text-gray-200">
                                                {type}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{slot.insuranceStatus}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Booking Preview */}
            <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-black-400">Booking Preview</h3>
                <dl className="mt-4 space-y-2">
                    <div className="flex justify-between">
                        <dt className="text-gray-600">Available Slots</dt>
                        <dd className="font-medium">{w.slots.filter(s => s.status === "available").length}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-gray-600">Storage Cost (100 kg, 5 days)</dt>
                        <dd className="font-medium">Rs. {(100 * w.pricePerKgPerDay * 5).toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-gray-600">Base Fee (10%)</dt>
                        <dd className="font-medium">Rs. {(0.1 * 100 * w.pricePerKgPerDay * 5).toFixed(2)}</dd>
                    </div>
                </dl>
            </div>

            {/* Customer Reviews */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h3 className="text-xl font-bold text-black-400">Customer Reviews</h3>
                <div className="mt-4 space-y-4 h-40">
                    {w.reviews.map((review, index) => (
                        <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                            <div className="flex items-center space-x-2">
                                <strong className="text-gray-800">{review.user}</strong>
                                <div className="flex items-center">
                                    <span className="text-gray-600">{review.rating}</span>
                                    <StarIcon className="h-5 w-5 text-yellow-500 ml-1" />
                                </div>
                            </div>
                            <p className="mt-2 text-gray-600">{review.comment}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Booking Popup Modal */}
            {isModalOpen && (
                 <div>
                    <div className="absolute inset-0 bg-black opacity-60"></div>
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                          
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                     
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Book a Slot</h2>
                            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        {!isPaymentComplete ? (
                            <div className="space-y-4">
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Select Slot</label>
                                    <select
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        value={selectedSlot}
                                        onChange={(e) => setSelectedSlot(e.target.value)}
                                    >
                                        <option value="">Choose a slot</option>
                                        {availableSlots.map(slot => (
                                            <option key={slot.id} value={slot.id}>
                                                Slot {formatSlotId(slot.id)} - Capacity: {slot.capacityKg} kg
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Produce Type</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        value={produceType}
                                        onChange={(e) => setProduceType(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Quantity (kg)</label>
                                    <input
                                        type="number"
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        min="1"
                                        max={selectedSlotCapacity}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
                                    <input
                                        type="number"
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        min="1"
                                    />
                                </div>
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <h3 className="text-lg font-semibold">Payment Breakdown</h3>
                                    <div className="mt-2 space-y-1">
                                        <p>Storage Cost: Rs. {storageCost.toFixed(2)}</p>
                                        <p>Base Fee (10%): Rs. {baseFee.toFixed(2)}</p>
                                        <p className="font-semibold">Total: Rs. {totalCost.toFixed(2)}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className={`w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition ${!isFormValid && "opacity-50 cursor-not-allowed"}`}
                                    onClick={handleProceedToPayment}
                                    disabled={!isFormValid}
                                >
                                    Proceed to Payment
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-green-600">Booking Confirmed!</h3>
                                <p>Your slot has been booked successfully. Funds are held in escrow until confirmation.</p>
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <p><strong>Slot:</strong> {selectedSlot}</p>
                                    <p><strong>Produce Type:</strong> {produceType}</p>
                                    <p><strong>Quantity:</strong> {quantity} kg</p>
                                    <p><strong>Duration:</strong> {duration} days</p>
                                    <p><strong>Total Paid:</strong> Rs. {totalCost.toFixed(2)}</p>
                                    <p><a href="#" className="text-blue-500 hover:underline">View PayHere Receipt</a></p>
                                </div>
                                <button
                                    type="button"
                                    className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                    onClick={resetForm}
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div> </div>
            )}
        </div>
    );
}