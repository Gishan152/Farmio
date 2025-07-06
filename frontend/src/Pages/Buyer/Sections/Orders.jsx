import { useState, useEffect, use } from "react";
import { PlusIcon, MinusIcon, TrashIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import wheat from "../../../Assets/Buyer/Crops/wheat.webp";
import { Link } from "react-router-dom";
import { useSavesContext } from "../../../Contexts/Buyer/SavesContext";

const FREE_SHIPPING_THRESHOLD = 85;

export const orders = [
    {
        id: "ORD-1001",
        paymentStatus: "Paid",
        total: 1250,
        items: [
            {
                id: "CROP-1",
                type: "Corn",
                farm: "Sunny Farm",
                location: "Iowa, USA",
                pricePerUnit: 12.5,
                quantity: 20,
                imageUrl: "/images/corn.jpg",
                transportationRequired: true,
            },
            {
                id: "CROP-2",
                type: "Wheat",
                farm: "Golden Fields",
                location: "Kansas, USA",
                pricePerUnit: 9.0,
                quantity: 15,
                imageUrl: "/images/wheat.jpg",
                transportationRequired: false,
            },
        ],
    },
    {
        id: "ORD-1002",
        paymentStatus: "Paid",
        total: 1250,
        items: [
            {
                id: "CROP-3",
                type: "Rice",
                farm: "Riverbank Farm",
                location: "Arkansas, USA",
                pricePerUnit: 14.0,
                quantity: 25,
                imageUrl: "/images/rice.jpg",
                transportationRequired: true,
            },
        ],
    },
    {
        id: "ORD-1003",
        paymentStatus: "Paid",
        total: 1250,
        items: [
            {
                id: "CROP-4",
                type: "Barley",
                farm: "Mountain Grain",
                location: "Colorado, USA",
                pricePerUnit: 11.0,
                quantity: 30,
                imageUrl: "/images/barley.jpg",
                transportationRequired: false,
            },
            {
                id: "CROP-5",
                type: "Soybean",
                farm: "Green Acre",
                location: "Illinois, USA",
                pricePerUnit: 13.5,
                quantity: 10,
                imageUrl: "/images/soybean.jpg",
                transportationRequired: true,
            },
            {
                id: "CROP-6",
                type: "Oats",
                farm: "Valley Oats",
                location: "Washington, USA",
                pricePerUnit: 10.0,
                quantity: 40,
                imageUrl: "/images/oats.jpg",
                transportationRequired: false,
            },
        ],
    },
    {
        id: "ORD-1004",
        paymentStatus: "Paid",
        total: 1250,
        items: [
            {
                id: "CROP-7",
                type: "Millet",
                farm: "Prairie Farms",
                location: "Nebraska, USA",
                pricePerUnit: 8.5,
                quantity: 50,
                imageUrl: "/images/millet.jpg",
                transportationRequired: true,
            },
        ],
    },
    {
        id: "ORD-1005",
        paymentStatus: "Paid",
        total: 1250,
        items: [
            {
                id: "CROP-8",
                type: "Quinoa",
                farm: "Healthy Harvest",
                location: "Colorado, USA",
                pricePerUnit: 16.0,
                quantity: 12,
                imageUrl: "/images/quinoa.jpg",
                transportationRequired: false,
            },
            {
                id: "CROP-9",
                type: "Buckwheat",
                farm: "Rustic Farms",
                location: "Montana, USA",
                pricePerUnit: 15.0,
                quantity: 18,
                imageUrl: "/images/buckwheat.jpg",
                transportationRequired: true,
            },
        ],
    },
];


export default function Orders() {
    const {
        items,
        updateQty,
        removeItem,
        changeTransport,
    } = useSavesContext();

    const [subtotal, setSubtotal] = useState(0);
    const [openOrderIds, setOpenOrderIds] = useState([]);

    useEffect(() => {
        setSubtotal(
            items.reduce((sum, i) => sum + i.pricePerUnit * i.quantity, 0)
        );
    }, [items]);

    const toggleOrder = (orderId) =>
        setOpenOrderIds((ids) =>
            ids.includes(orderId)
                ? ids.filter((id) => id !== orderId)
                : [...ids, orderId]
        );

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">Orders Placed</h1>
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow">
                        <div className="flex justify-between gap-10 items-center w-full p-4">
                            <div className="flex items-center gap-10">
                                <span className="text-m font-medium">Order {order.id}</span>
                                <span className="text-m font-medium">{order.paymentStatus}</span>
                                <span className="text-m font-medium">Rs. {order.total}</span>
                            </div>
                            <div className="flex items-center gap-10">
                                <button className="bg-green-500 hover:bg-green-300 text-white p-2 rounded-xl">Add transport</button>
                                <button
                                    onClick={() => toggleOrder(order.id)}
                                    className="p-4"
                                >
                                    <ChevronRightIcon className={`w-8 h-8 ml-2 transform transition ${openOrderIds.includes(order.id) ? 'rotate-90' : ''}`} />
                                </button>
                            </div>
                        </div>

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

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <Link
                    to="../crops"
                    className="underline text-gray-600 hover:text-gray-800"
                >
                    CONTINUE SEARCHING
                </Link>
                <div className="mt-4 lg:mt-0 bg-white dark:bg-gray-800 p-6 rounded-lg shadow w-full lg:w-auto">
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
                </div>
            </div>
        </div>
    );
}