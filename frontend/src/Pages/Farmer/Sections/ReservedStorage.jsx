// src/buyer/pages/ReservedStorage.jsx
import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { groupBy } from "lodash";
import { 
  CheckBadgeIcon, 
  ClockIcon, 
  XMarkIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  UserIcon,
  StarIcon
} from "@heroicons/react/24/solid";
import warehouesImg1 from "../../../Assets/Farmer/Warehouses/warehouse.webp";
import warehouesImg2 from "../../../Assets/Farmer/Warehouses/warehouse2.webp";

export async function FarmerreservedLoader({ request }) {
    // TODO: fetch from API
    return [
        {
            bookingId: "BK001",
            warehouseId: 1,
            warehouseName: "Sunrise Warehouse",
            warehouseImage: warehouesImg1,
            owner: { 
                name: "John Doe", 
                avatarUrl: "https://randomuser.me/api/portraits/men/43.jpg", 
                rating: 4.7 
            },
            slotNumber: "A-101",
            product: "Rice",
            quantity: 500,
            unit: "kg",
            duration: "30 days",
            status: "Active",
            startDate: "2025-07-10",
            endDate: "2025-08-09",
            totalCost: 2500,
            baseFee: 200,
            dailyRate: 75,
            location: "Colombo, Sri Lanka",
            reservedUntil: "3h 20m"
        },
        {
            bookingId: "BK002",
            warehouseId: 2,
            warehouseName: "Green Field Storage",
            warehouseImage: warehouesImg2,
            owner: { 
                name: "Acme Farms", 
                avatarUrl: "https://randomuser.me/api/portraits/men/44.jpg", 
                rating: 4.3 
            },
            slotNumber: "B-205",
            product: "Wheat",
            quantity: 300,
            unit: "kg",
            duration: "45 days",
            status: "Active",
            startDate: "2025-07-12",
            endDate: "2025-08-26",
            totalCost: 3375,
            baseFee: 200,
            dailyRate: 70,
            location: "Kandy, Sri Lanka",
            reservedUntil: "1d 2h"
        },
        {
            bookingId: "BK003",
            warehouseId: 2,
            warehouseName: "Green Field Storage",
            warehouseImage: warehouesImg2,
            owner: { 
                name: "Acme Farms", 
                avatarUrl: "https://randomuser.me/api/portraits/men/44.jpg", 
                rating: 4.3 
            },
            slotNumber: "C-102",
            product: "Corn",
            quantity: 750,
            unit: "kg",
            duration: "60 days",
            status: "Expiring Soon",
            startDate: "2025-06-20",
            endDate: "2025-08-19",
            totalCost: 4400,
            baseFee: 200,
            dailyRate: 70,
            location: "Kandy, Sri Lanka",
            reservedUntil: "4h"
        }
    ];
}

export default function FarmerReservedStorage() {
    const reservations = useLoaderData();
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showEarlyRetrievalModal, setShowEarlyRetrievalModal] = useState(false);
    const [showExtensionModal, setShowExtensionModal] = useState(false);
    const [extensionDays, setExtensionDays] = useState(7);
    const [retrievalReason, setRetrievalReason] = useState("");

    const calculateEarlyRetrievalRefund = (booking) => {
        const today = new Date();
        const endDate = new Date(booking.endDate);
        const unusedDays = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));
        const unusedAmount = unusedDays * booking.dailyRate;
        const buffer = unusedAmount * 0.1; // 10% buffer
        const refund = unusedAmount - buffer - booking.baseFee;
        return {
            unusedDays,
            unusedAmount,
            buffer,
            baseFee: booking.baseFee,
            refund: Math.max(0, refund)
        };
    };

    const calculateExtensionCost = (booking, days) => {
        const extensionCost = days * booking.dailyRate;
        const buffer = extensionCost * 0.1;
        const totalCost = extensionCost + buffer;
        return {
            extensionCost,
            buffer,
            totalCost
        };
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Active":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
            case "Expiring Soon":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
            case "Expired":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
        }
    };

    const Modal = ({ isOpen, onClose, title, children }) => {
        if (!isOpen) return null;

        return (
              <div>
                 <div className="absolute inset-0 bg-black opacity-60"></div>
            <div className="fixed inset-0  flex items-center justify-center z-50 p-4">
                  
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                   
                    <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
                        <h3 className="text-lg font-semibold dark:text-gray-100">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>  </div>
        );
    };

    const EarlyRetrievalModal = () => {
        if (!selectedBooking) return null;
        
        const refundDetails = calculateEarlyRetrievalRefund(selectedBooking);

        return (
            <Modal
                isOpen={showEarlyRetrievalModal}
                onClose={() => setShowEarlyRetrievalModal(false)}
                title="Early Retrieval Request"
            >
                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-medium dark:text-gray-100 mb-2">Booking Details</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Booking ID: {selectedBooking.bookingId}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Product: {selectedBooking.product} ({selectedBooking.quantity} {selectedBooking.unit})
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            End Date: {selectedBooking.endDate}
                        </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                        <h4 className="font-medium dark:text-gray-100 mb-2">Refund Preview</h4>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span>Unused Days:</span>
                                <span>{refundDetails.unusedDays} days</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Unused Amount:</span>
                                <span>Rs. {refundDetails.unusedAmount}</span>
                            </div>
                            <div className="flex justify-between text-red-600">
                                <span>Buffer (10%):</span>
                                <span>- Rs. {refundDetails.buffer}</span>
                            </div>
                            <div className="flex justify-between text-red-600">
                                <span>Base Fee:</span>
                                <span>- Rs. {refundDetails.baseFee}</span>
                            </div>
                            <div className="flex justify-between font-bold border-t pt-1">
                                <span>Total Refund:</span>
                                <span>Rs. {refundDetails.refund}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-gray-100">
                            Reason for Early Retrieval
                        </label>
                        <textarea
                            value={retrievalReason}
                            onChange={(e) => setRetrievalReason(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                            rows="3"
                            placeholder="Please provide a reason for early retrieval..."
                        />
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowEarlyRetrievalModal(false)}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                // Handle early retrieval request
                                console.log("Early retrieval requested for", selectedBooking.bookingId);
                                setShowEarlyRetrievalModal(false);
                            }}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 dark:border-orange-600 dark:text-orange-400 dark:hover:bg-orange-900 transition-colors"
                           
                        >
                            Request Retrieval
                        </button>
                    </div>
                </div>
            </Modal>
        );
    };

    const ExtensionModal = () => {
        if (!selectedBooking) return null;
        
        const extensionDetails = calculateExtensionCost(selectedBooking, extensionDays);

        return (
            <Modal
                isOpen={showExtensionModal}
                onClose={() => setShowExtensionModal(false)}
                title="Extension Request"
            >
                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-medium dark:text-gray-100 mb-2">Current Booking</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Booking ID: {selectedBooking.bookingId}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Current End Date: {selectedBooking.endDate}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Daily Rate: Rs. {selectedBooking.dailyRate}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-gray-100">
                            Extension Duration
                        </label>
                        <select
                            value={extensionDays}
                            onChange={(e) => setExtensionDays(parseInt(e.target.value))}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                        >
                            <option value={7}>7 days</option>
                            <option value={14}>14 days</option>
                            <option value={30}>30 days</option>
                            <option value={60}>60 days</option>
                        </select>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                        <h4 className="font-medium dark:text-gray-100 mb-2">Cost Breakdown</h4>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span>Extension Cost ({extensionDays} days):</span>
                                <span>Rs. {extensionDetails.extensionCost}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Buffer (10%):</span>
                                <span>Rs. {extensionDetails.buffer}</span>
                            </div>
                            <div className="flex justify-between font-bold border-t pt-1">
                                <span>Total Cost:</span>
                                <span>Rs. {extensionDetails.totalCost}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                <span>New End Date:</span>
                                <span>{new Date(new Date(selectedBooking.endDate).getTime() + extensionDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowExtensionModal(false)}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                // Handle extension request
                                console.log("Extension requested for", selectedBooking.bookingId);
                                setShowExtensionModal(false);
                            }}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Request Extension
                        </button>
                    </div>
                </div>
            </Modal>
        );
    };

    return (
        <section className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold mb-6 dark:text-gray-100">Your Storage Bookings</h1>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {reservations.length} active bookings
                </div>
            </div>

            <div className="grid gap-6">
                {reservations.map((booking) => (
                    <div
                        key={booking.bookingId}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                    >
                        <div className="md:flex">
                            {/* Content Section */}
                            <div className="w-full p-6 relative">
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {/* Header */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-xl font-bold dark:text-gray-100 mb-1">
                                                {booking.warehouseName}
                                            </h2>
                                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                                <span className="font-medium">Booking ID:</span>
                                                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                    {booking.bookingId}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font text-black-600 dark:text-green-400">
                                                Rs. {booking.totalCost}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Total Cost
                                            </div>
                                        </div>
                                    </div>

                                    {/* Owner Info */}
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <img
                                            src={booking.owner.avatarUrl}
                                            alt={booking.owner.name}
                                            className="h-10 w-10 rounded-full"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <UserIcon className="h-4 w-4 text-gray-400" />
                                                <span className="font-medium dark:text-gray-100">
                                                    {booking.owner.name}
                                                </span>
                                                <CheckBadgeIcon className="h-4 w-4 text-blue-500" />
                                            </div>
                                            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                                                <StarIcon className="h-4 w-4 text-yellow-500" />
                                                <span>{booking.owner.rating}</span>
                                            </div>
                                        </div>
                                        <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center space-x-1">
                                                <MapPinIcon className="h-4 w-4" />
                                                <span>{booking.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Booking Details Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                Slot Number
                                            </div>
                                            <div className="font-medium dark:text-gray-100">
                                                {booking.slotNumber}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                Product
                                            </div>
                                            <div className="font-medium dark:text-gray-100">
                                                {booking.product}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                Quantity
                                            </div>
                                            <div className="font-medium dark:text-gray-100">
                                                {booking.quantity} {booking.unit}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                Duration
                                            </div>
                                            <div className="font-medium dark:text-gray-100">
                                                {booking.duration}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date Range */}
                                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
                                            <span className="text-sm font-medium dark:text-gray-100">
                                                {booking.startDate} → {booking.endDate}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-orange-600 dark:text-orange-400">
                                            <ClockIcon className="h-4 w-4" />
                                            <span>Expires in {booking.reservedUntil}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-3 pt-2">
                                        <button
                                            onClick={() => {
                                                setSelectedBooking(booking);
                                                setShowEarlyRetrievalModal(true);
                                            }}
                                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 dark:border-orange-600 dark:text-orange-400 dark:hover:bg-orange-900 transition-colors"
                                        >
                                            <ArrowDownTrayIcon className="h-4 w-4" />
                                            <span>Early Retrieval</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedBooking(booking);
                                                setShowExtensionModal(true);
                                            }}
                                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            <PlusIcon className="h-4 w-4" />
                                            <span>Extend Booking</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals */}
            <EarlyRetrievalModal />
            <ExtensionModal />
        </section>
    );
}