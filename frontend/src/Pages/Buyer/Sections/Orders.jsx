import { useState, useEffect } from "react";
import { PlusIcon, MinusIcon, TrashIcon, ChevronRightIcon, ClipboardDocumentListIcon, CurrencyDollarIcon, CheckBadgeIcon, ClockIcon } from "@heroicons/react/24/solid";
import wheat from "../../../Assets/Buyer/Crops/wheat.webp";
import { Link } from "react-router-dom";
import { useSavesContext } from "../../../Contexts/Buyer/SavesContext";
import { useOrderContext } from "../../../Contexts/Buyer/OrdersContexts";

export default function Orders() {
    const { orders } = useOrderContext();
    const [loading, setLoading] = useState(true);
    // Stat cards
    const stats = {
        totalOrders: orders.length,
        totalAmount: orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.pricePerUnit * i.quantity, 0), 0),
        delivered: orders.filter(o => o.status === 'Delivered').length,
        pending: orders.filter(o => o.status !== 'Delivered').length
    };

    useEffect(() => {
        // Simulate loading effect (replace with real fetch if needed)
        setTimeout(() => {
            if (orders.length > 0) {
                setLoading(false);
            } else {
                setLoading(true);
            }
        }, 2000);
    }, [orders]);

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-4 p-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-2">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Orders Placed</h1>
                            <p className="text-gray-600 mt-1 text-sm">View your order history and details</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards (Crops style) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Total Orders */}
                    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-1 bg-green-500 rounded-l-lg" />
                        <ClipboardDocumentListIcon className="h-7 w-7 text-green-500 mr-3 z-10" />
                        <div className="z-10">
                            <p className="text-xs font-medium text-gray-500">Total Orders</p>
                            <p className="text-lg font-bold text-gray-900">{stats.totalOrders}</p>
                        </div>
                    </div>
                    {/* Total Amount */}
                    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-1 bg-yellow-500 rounded-l-lg" />
                        <CurrencyDollarIcon className="h-7 w-7 text-yellow-500 mr-3 z-10" />
                        <div className="z-10">
                            <p className="text-xs font-medium text-gray-500">Total Amount</p>
                            <p className="text-lg font-bold text-gray-900">Rs. {stats.totalAmount.toLocaleString()}</p>
                        </div>
                    </div>
                    {/* Delivered */}
                    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-l-lg" />
                        <CheckBadgeIcon className="h-7 w-7 text-blue-500 mr-3 z-10" />
                        <div className="z-10">
                            <p className="text-xs font-medium text-gray-500">Delivered</p>
                            <p className="text-lg font-bold text-gray-900">{stats.delivered}</p>
                        </div>
                    </div>
                    {/* Pending */}
                    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-1 bg-gray-400 rounded-l-lg" />
                        <ClockIcon className="h-7 w-7 text-gray-500 mr-3 z-10" />
                        <div className="z-10">
                            <p className="text-xs font-medium text-gray-500">Pending</p>
                            <p className="text-lg font-bold text-gray-900">{stats.pending}</p>
                        </div>
                    </div>
                </div>

                {/* Orders Table with loading spinner */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
                    </div>
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                            <p className="mt-2 text-gray-600 text-sm">Loading orders...</p>
                        </div>
                    ) : (
                        <div className="p-4 overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2 text-left font-semibold">Order ID</th>
                                        <th className="p-2 text-left font-semibold">Status</th>
                                        <th className="p-2 text-left font-semibold">Total</th>
                                        <th className="p-2 text-left font-semibold">Items</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-2">
                                                <Link to={`./${order.id}`} className="text-green-700 font-medium underline">Order {order.id}</Link>
                                            </td>
                                            <td className="p-2">
                                                {(() => {
                                                    // Color badge logic similar to Crops.jsx
                                                    let badgeClass = 'bg-gray-100 text-gray-700';
                                                    let status = order.status?.toUpperCase();
                                                    if (status === 'DELIVERED') badgeClass = 'bg-blue-100 text-blue-800';
                                                    else if (status === 'PENDING') badgeClass = 'bg-yellow-100 text-yellow-800';
                                                    else if (status === 'PROCESSING') badgeClass = 'bg-orange-100 text-orange-800';
                                                    else if (status === 'CANCELLED') badgeClass = 'bg-red-100 text-red-800';
                                                    else if (status === 'COMPLETED') badgeClass = 'bg-green-100 text-green-800';
                                                    // Humanize status: e.g. 'AWAITING_PICKUP' -> 'Awaiting Pickup'
                                                    let displayStatus = order.status
                                                        ? order.status
                                                            .toLowerCase()
                                                            .split('_')
                                                            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                                                            .join(' ')
                                                        : '';
                                                    return (
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>{displayStatus}</span>
                                                    );
                                                })()}
                                            </td>
                                            <td className="p-2 font-semibold">Rs. {order.items.reduce((sum, i) => sum + i.pricePerUnit * i.quantity, 0).toLocaleString()}</td>
                                            <td className="p-2">{order.items.length}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mt-6">
                    <Link
                        to="../crops"
                        className="underline text-gray-600 hover:text-gray-800"
                    >
                        CONTINUE SEARCHING
                    </Link>
                </div> */}
            </div>
        </div>
    );
}

function TransportJobModal({ isOpen, onClose, order, onCreate }) {
    const [selectedItems, setSelectedItems] = useState({});

    useEffect(() => {
        if (!isOpen) setSelectedItems({});
    }, [isOpen]);

    const toggleItem = (itemId) => {
        setSelectedItems(s => ({
            ...s,
            [itemId]: !s[itemId]
        }));
    };

    const handleCreate = () => {
        const items = order.items.filter(i => selectedItems[i.id]);
        if (items.length === 0) return;
        onCreate(order.id, items);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 z-10">
                <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
                    Select items from Order {order.id}
                </h2>
                <div className="max-h-64 overflow-y-auto">
                    {order.items.map(item => (
                        <div
                            key={item.id}
                            className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <input
                                type="checkbox"
                                className="mr-3"
                                checked={!!selectedItems[item.id]}
                                onChange={() => toggleItem(item.id)}
                            />
                            <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-gray-100">{item.type}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {item.quantity} kg @ Rs. {item.pricePerUnit.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={!Object.values(selectedItems).some(Boolean)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                        Create Transport Jobs
                    </button>
                </div>
            </div>
        </div>
    );
}
