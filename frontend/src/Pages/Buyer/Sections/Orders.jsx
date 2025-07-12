import { useState, useEffect } from "react";
import { PlusIcon, MinusIcon, TrashIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import wheat from "../../../Assets/Buyer/Crops/wheat.webp";
import { Link } from "react-router-dom";
import { useSavesContext } from "../../../Contexts/Buyer/SavesContext";
import { useOrderContext } from "../../../Contexts/Buyer/OrdersContexts";

export default function Orders() {
    const {
        orders,
    } = useOrderContext();

    const [subtotal, setSubtotal] = useState(0);
    const [openOrderIds, setOpenOrderIds] = useState([]);
    const [modalOpenOrderId, setModalOpenOrderId] = useState(null);

    const toggleOrder = (orderId) =>
        setOpenOrderIds((ids) =>
            ids.includes(orderId)
                ? ids.filter((id) => id !== orderId)
                : [...ids, orderId]
        );

    const openModalFor = (orderId) => setModalOpenOrderId(orderId);
    const closeModal = () => setModalOpenOrderId(null);

    const handleCreateTransport = (orderId, items) => {
        console.log("Creating transport for order", orderId, items);
        // call API or dispatch action...
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">Orders Placed</h1>
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow">
                        <div className="flex justify-between gap-10 items-center w-full p-4">
                            <div className="flex items-center gap-10">
                                <Link to={`./${order.id}`} className="text-m font-medium">Order {order.id}</Link>
                                <span className="text-m font-medium">{order.status}</span>
                                <span className="text-m font-medium">Rs. {order.items.reduce((sum, i) => sum + i.pricePerUnit * i.quantity, 0)}</span>
                            </div>
                            <div className="flex items-center gap-10">
                                {/* <button className="bg-green-500 hover:bg-green-300 text-white p-2 rounded-xl">Confirm Delivery</button>
                                <button className="bg-green-500 hover:bg-green-300 text-white p-2 rounded-xl" onClick={() => openModalFor(order.id)}>Add transport</button> */}
                                <button
                                    onClick={() => toggleOrder(order.id)}
                                    className="p-4"
                                >
                                    <ChevronRightIcon className={`w-8 h-8 ml-2 transform transition ${openOrderIds.includes(order.id) ? 'rotate-90' : ''}`} />
                                </button>
                            </div>
                        </div>

                        {modalOpenOrderId && (
                            <TransportJobModal
                                isOpen={modalOpenOrderId === order.id}
                                onClose={closeModal}
                                order={orders.find(o => o.id === modalOpenOrderId)}
                                onCreate={handleCreateTransport}
                            />
                        )}

                        {openOrderIds.includes(order.id) && (
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                <table className="w-full table-auto border-separate border-spacing-y-4">
                                    <thead className="text-left text-gray-600">
                                        <tr>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Quantity (Kg)</th>
                                            <th>Total</th>
                                            <th>Transport</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map((item) => (
                                            <tr key={item.id} className="bg-white dark:bg-gray-800 rounded-lg">
                                                <td className="flex items-center space-x-4 p-4">
                                                    <img
                                                        src={item.imageUrl}
                                                        alt=""
                                                        className="w-20 h-20 object-cover rounded"
                                                    />
                                                    <div>
                                                        <p className="font-medium">{item.type}</p>
                                                        <p className="text-sm text-gray-500">
                                                            Farm: {item.farm}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Location: {item.location}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="p-4">Rs. {item.pricePerUnit.toFixed(2)}</td>
                                                <td className="p-4">
                                                    <span className="px-2">{item.quantity}</span>
                                                </td>
                                                <td className="p-4 font-semibold">
                                                    Rs. {(item.pricePerUnit * item.quantity).toFixed(2)}
                                                </td>
                                                <td className="p-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.transportationRequired}
                                                        onChange={() => changeTransport(item.id)}
                                                    />
                                                </td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            < div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <Link
                    to="../crops"
                    className="underline text-gray-600 hover:text-gray-800"
                >
                    CONTINUE SEARCHING
                </Link>
                {/* <div className="mt-4 lg:mt-0 bg-white dark:bg-gray-800 p-6 rounded-lg shadow w-full lg:w-auto">
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Sub Total:{" "}
                        <span className="font-semibold">Rs. {subtotal.toFixed(2)}</span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Excl. Delivery charges
                    </p>
                    <Link
                        to="../order-confirmation"
                        className="block text-center mt-4 w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                        GO TO CHECKOUT
                    </Link>
                </div> */}
            </div>
        </div >
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
