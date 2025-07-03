import { Link, useNavigate } from "react-router-dom";
import { useSavesContext } from "../../../Contexts/Buyer/SavesContext";
import { } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { CheckBadgeIcon, CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useToast } from "../../../Contexts/ToastContext";

const FREE_SHIPPING_THRESHOLD = 85;

const OrderConfirmation = () => {

    const [subtotal, setSubtotal] = useState(0);
    const [orderPlaced, setOrderPlaced] = useState(false)
    const { items } = useSavesContext()
    const navigate = useNavigate()

    const { push } = useToast();

    useEffect(() => {
        setSubtotal(items.reduce((sum, i) => sum + i.pricePerUnit * i.quantity, 0));
    }, [items]);

    const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
    const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

    const handlePayment = () => {
        navigate("../transport-confirmation")
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Order confirmation</h1>
                <div className="mt-2 text-gray-600">
                    Confirm the order details listed below
                </div>
            </div>

            <div className="overflow-auto">
                <table className="w-full table-auto border-separate border-spacing-y-4">
                    <thead className="text-left text-gray-600">
                        <tr>
                            {/* <th>Product</th><th>Price</th><th>Quantity (Kg)</th><th>Total</th><th>Transpotation Required</th> */}
                            <th>Product</th><th>Price</th><th>Quantity (Kg)</th><th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.filter(v=>!v.unchecked).map(item => (
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
                                {/* <td>
                                    {item.transpotationRequired ? <CheckCircleIcon className="text-green-700 w-8 h-8" /> : <XMarkIcon className="text-red-700 w-8 h-8" />}
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <Link to="../saves" className="underline text-gray-600 hover:text-gray-800">
                    BACK TO SAVES
                </Link>
                <div className="mt-4 lg:mt-0 bg-white dark:bg-gray-800 p-6 rounded-lg shadow w-full lg:w-auto">
                    <p className="text-lg text-gray-600 dark:text-gray-300">Sub Total: <span className="font-semibold">Rs. {subtotal.toFixed(2)}</span></p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Excl. Delivery charges</p>
                    {orderPlaced ?
                        <button
                            onClick={handlePayment}
                            className="mt-4 w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        >
                            Make Payment
                        </button>
                        :
                        <button
                            onClick={() => {
                                push("⚡ Order placed")
                                setTimeout(() => {
                                    setOrderPlaced(true)
                                }, 2000)
                            }}
                            className="mt-4 w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        >
                            Place Order
                        </button>
                    }
                </div>
            </div>
        </div>
    );
}

export default OrderConfirmation;