import { useState, useEffect, use } from "react";
import { PlusIcon, MinusIcon, TrashIcon } from "@heroicons/react/24/solid";
import wheat from "../../../Assets/Buyer/Crops/wheat.webp";
import { Link, useParams } from "react-router-dom";
import { useOrderContext } from "../../../Contexts/Buyer/OrdersContexts";
import { useTransportsContext } from "../../../Contexts/Buyer/TransportContext";

const FREE_SHIPPING_THRESHOLD = 85;

export default function OrderDetails() {
    const {orders, changeTransport} = useOrderContext();
    const {addJob} = useTransportsContext();
    const {orderId} = useParams();

    const order = orders.find(order => order.id === orderId) 
    const items = order.items
    const [subtotal, setSubtotal] = useState(0);
    const [openTransportModel, setOpenTransportModel] = useState();

    const openModel = () => {
        setOpenTransportModel(true);
    }

    const closeModal = () => {
        setOpenTransportModel(false);
    }

    useEffect(() => {
        setSubtotal(items.reduce((sum, i) => sum + i.pricePerUnit * i.quantity, 0));
    }, [items]);

    const handleCreateTransport = (orderId) => {
        console.log("Creating transport for order", orderId);
        // call API or dispatch action...
        addJob({
            pickupLocations: ["farm1", "farm2", "farm3"],
            dropOffLocation: "buyer location",
            orderId,
            items
        })
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Breadcrumb & urgency banner */}
            <nav className="text-gray-500 text-sm flex justify-between">
                <ul className="flex space-x-2">
                    <li><Link to="/buyer/orders" className="hover:underline">Orders</Link> /</li>
                    <li><span>{orderId}</span></li>
                </ul>
            </nav>

            {/* Title and free shipping bar */}
            <div>
                <h1 className="text-3xl font-bold">Order Details</h1>
                <div className="mt-2 text-gray-600">
                    Only the checked items will be included in the order
                </div>
            </div>

            {/* Saves items table */}
            <div className="overflow-auto">
                <div className="flex justify-between items-start">
                    <table className="w-md table-auto border-separate border-spacing-y-4">
                        <thead className="text-left text-gray-600">
                            <tr>
                                <th>Order Id</th><th>Payment Status</th><th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white dark:bg-gray-800 rounded-lg">
                                <td><Link to={`./${order.id}`} className="text-m font-medium">{order.id}</Link></td>
                                <td><span className="text-m font-medium">{order.paymentStatus}</span></td>
                                <td><span className="text-m font-medium">Rs. {subtotal.toFixed(2)}</span></td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="flex gap-5 items-start">
                        {order.paymentStatus != "Paid" && <button className="w-fit h-fit bg-green-500 hover:bg-green-300 text-white p-2 rounded-md">Pay</button>}
                        <button className="w-fit h-fit bg-green-500 hover:bg-green-300 text-white p-2 rounded-md" onClick={openModel}>Add transport</button>
                        <button className="w-fit h-fit bg-green-500 hover:bg-green-300 text-white p-2 rounded-md" onClick={openModel}>Confirm Delivery</button>
                    </div>
                </div>
                <h3 className="text-2xl font-medium mt-8">Order Items</h3>
                <table className="w-full table-auto border-separate border-spacing-y-4">
                    <thead className="text-left text-gray-600">
                        <tr>
                            <th>Product</th><th>Price</th><th>Quantity (Kg)</th><th>Total</th><th>Transpotation status</th><th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id} className="bg-white dark:bg-gray-800 rounded-lg">
                                <td className="flex items-center space-x-4 p-4">
                                    <img src={item.imageUrl} alt="" className="w-20 h-20 object-cover rounded" />
                                    <div>
                                        <p className="font-medium">{item.type}</p>
                                        <p className="text-sm text-gray-500">Farm: {item.farm}</p>
                                        <p className="text-sm text-gray-500">Location: {item.location}</p>
                                    </div>
                                </td>
                                <td className="p-4">Rs. {item.pricePerUnit.toFixed(2)}</td>
                                <td className="p-4">
                                    <span className="px-2">{item.quantity}</span>
                                </td>
                                <td className="p-4 font-semibold">Rs. {(item.pricePerUnit * item.quantity).toFixed(2)}</td>
                                <td>Pending</td>
                                {/* <td><button className="w-fit h-fit bg-green-500 hover:bg-green-300 text-white p-2 rounded-md">Confirm Delivery</button></td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <TransportJobModal
                isOpen={openTransportModel}
                onClose={closeModal}
                order={order}
                onCreate={handleCreateTransport}
            />

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <Link to="../crops" className="underline text-gray-600 hover:text-gray-800">
                    CONTINUE SEARCHING
                </Link>
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
        // const items = order.items.filter(i => selectedItems[i.id]);
        // if (items.length === 0) return;
        onCreate(order.id);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 z-10">
                <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
                    Create a transport job(s) for Order {order.id}
                </h2>
                {/* <div className="max-h-64 overflow-y-auto">
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
                                    {item.quantity} kg @ Rs. {item.pricePerUnit.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div> */}
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        // disabled={!Object.values(selectedItems).some(Boolean)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                        Create Transport Jobs
                    </button>
                </div>
            </div>
        </div>
    );
}
