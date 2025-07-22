import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckBadgeIcon, CheckCircleIcon, XMarkIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useToast } from "../../../Contexts/ToastContext";
import { useOrderContext } from "../../../Contexts/Buyer/OrdersContexts";
import api from "@/API/client";

const FREE_SHIPPING_THRESHOLD = 85;

const OrderConfirmation = () => {

    const [subtotal, setSubtotal] = useState(0);
    const {orders, addOrders} = useOrderContext();
    const [orderPlaced, setOrderPlaced] = useState(false)
    const [loadingOrder, setLoadingOrder] = useState(false);
    const [loadingPayment, setLoadingPayment] = useState(false);
    // const { items } = useSavesContext()
    const location = useLocation();
    console.log("location : ", location)
    const { items } = location.state;
    const navigate = useNavigate()

    const { push } = useToast();

    useEffect(() => {
        setSubtotal(items.reduce((sum, i) => sum + i.pricePerUnit * i.quantity, 0));
    }, [items]);

    const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
    const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

    const handlePlaceOrder = () => {
        setLoadingOrder(true);
        console.log("items : ", items)
        api.post('/api/order/create', {
            items: items.map(item => ({ 
                cropId: item.id,
                quantity: item.quantity,
                pricePerUnit: item.pricePerUnit,
                unitMeasurement: item.unitMeasurement
            }))
        }).then(res => {
            console.log("Order placed successfully: ", res.data);
            addOrders(res.data)
            push("⚡ Order placed")
            setTimeout(() => {
                setOrderPlaced(true)
                setLoadingOrder(false);
            }, 2000)
        }).catch(err => {
            console.error("Error placing order: ", err);
            push("❌ Error placing order. Please try again.")
            setLoadingOrder(false);
        })
            // return;
        // addOrders({
        //     id: String(orders.length),
        //     status: "PENDING",
        //     total: subtotal,
        //     transport: "BY_BUYER",
        //     items
        // })
        // push("⚡ Order placed")
        // setTimeout(() => {
        //     setOrderPlaced(true)
        // }, 2000)
    }

    const handlePayment = () => {
        setLoadingPayment(true);
        // Simulate payment process
        setTimeout(() => {
            setLoadingPayment(false);
            // navigate("../transport-confirmation")
        }, 2000);
    }

    return (
        <div className="container mx-auto max-w-4xl p-6 flex flex-col items-center">
            <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-green-100 dark:border-green-800 w-full mb-8 relative">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="absolute left-6 top-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition shadow"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Back
                </button>
                <CheckBadgeIcon className="h-16 w-16 text-green-500 mb-4" />
                <h1 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                    <ShoppingCartIcon className="h-8 w-8 text-green-500" /> Order Confirmation
                </h1>
                <p className="text-gray-700 dark:text-gray-200 mb-6 text-center">
                    {orderPlaced ? "Order placed! Please proceed to payment." : "Confirm the order details listed below."}
                </p>
                <div className="w-full overflow-auto mb-6">
                    <table className="w-full table-auto border-separate border-spacing-y-4">
                        <thead className="text-left text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th>Product</th><th>Price</th><th>Quantity (Kg)</th><th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                    <td className="flex items-center space-x-4 p-4">
                                        <img src={item.imageUrl} alt="" className="w-20 h-20 object-cover rounded border border-gray-200 dark:border-gray-700" />
                                        <div>
                                            <p className="font-medium text-lg text-green-900 dark:text-green-100">{item.type}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Farm: {item.farm}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Location: {item.location}</p>
                                        </div>
                                    </td>
                                    <td className="p-4 text-green-700 dark:text-green-300 font-semibold">Rs. {item.pricePerUnit.toFixed(2)}</td>
                                    <td className="p-4"><span className="px-2">{item.quantity}</span></td>
                                    <td className="p-4 font-semibold text-green-800 dark:text-green-200">Rs. {(item.pricePerUnit * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="w-full flex flex-col md:flex-row justify-end items-start md:items-center gap-4">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow w-full md:w-auto border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg text-gray-600 dark:text-gray-300">Sub Total:</span>
                            <span className="font-semibold text-green-700 dark:text-green-300 text-lg">Rs. {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Excl. Delivery charges</div>
                        {/* <div className="w-full bg-gray-100 dark:bg-gray-800 rounded h-3 mb-2">
                            <div className="bg-green-400 h-3 rounded transition-all" style={{ width: `${progress}%` }} />
                        </div> */}
                        {/* <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            {progress < 100 ? `Add Rs. ${remaining.toFixed(2)} more for free shipping!` : "You have qualified for free shipping!"}
                        </div> */}
                        {orderPlaced ? (
                            <button
                                onClick={handlePayment}
                                className={`mt-4 w-full py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition flex items-center justify-center gap-2 ${loadingPayment ? 'opacity-70 cursor-not-allowed' : ''}`}
                                disabled={loadingPayment}
                            >
                                {loadingPayment && (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                                )}
                                {loadingPayment ? "Processing..." : "Make Payment"}
                            </button>
                        ) : (
                            <button
                                onClick={handlePlaceOrder}
                                className={`mt-4 w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 ${loadingOrder ? 'opacity-70 cursor-not-allowed' : ''}`}
                                disabled={loadingOrder}
                            >
                                {loadingOrder && (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                                )}
                                {loadingOrder ? "Placing Order..." : "Place Order"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderConfirmation;