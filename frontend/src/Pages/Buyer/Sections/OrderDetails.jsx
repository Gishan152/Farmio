import { useState, useEffect } from "react";
import { PlusIcon, MinusIcon, TrashIcon, ArrowLeftIcon, CheckBadgeIcon, ClockIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useOrderContext } from "../../../Contexts/Buyer/OrdersContexts";
import { useTransportsContext } from "../../../Contexts/Buyer/TransportContext";
import CustomModal from "../../../Components/CustomModel";
import wheat from "../../../Assets/Buyer/Crops/wheat.webp";
import corn from "../../../Assets/Buyer/Crops/corn.jpeg";
import api from "@/API/client";
import { useUserContext } from "@/Contexts/UserContext";

export default function OrderDetails() {
    const { orders, updateOrder, loading } = useOrderContext();
    const { addJob } = useTransportsContext();
    const { orderId } = useParams();
    const navigate = useNavigate();

    // Always compute order from context
    const order = orders.find(order => order.id === orderId);
    const items = order?.items || [];
    const [subtotal, setSubtotal] = useState(0);
    const [modelDetails, setModelDetails] = useState({
        isOpen: false,
        model: "",
    });

    // Check for order_id in URL and trigger payment status check
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const redirectedOrderId = params.get('order_id');
        if (redirectedOrderId) {
            checkPaymentStatus();
        }
    }, [order]);

    // Optionally, check payment status on mount or after payment
    useEffect(() => {
        checkPaymentStatus();
    }, [order]);

    // Check payment status and update order state
    const checkPaymentStatus = async () => {
        try {
            if(order && order.status === "PENDING"){
                // const res = await api.get(`/api/order/payment-status/${orderId}`);
                // console.log('payment status response : ', res.data);
                // if (res.data && res.data.status === true) {
                //     updateOrder(orderId, { status: "PROCESSING" });
                // }
            }
        } catch (err) {
            console.error("Failed to check payment status:", err);
        }
    };

    const openModel = (model) => {
        setModelDetails(prev => {
            prev.isOpen = true
            prev.model = model
            return { ...prev }
        })
    }

    const closeModal = () => {
        setModelDetails(prev => {
            prev.isOpen = false
            return { ...prev }
        })
    }


    useEffect(() => {
        setSubtotal(items.reduce((sum, i) => sum + i.pricePerUnit * i.quantity, 0));
    }, [items]);

    if (!order && !loading) {
        // TODO : Try to fetch the order from the backend
        // TODO : If the order cannot be found in that way either, show 404
        return (
            <div>
                <p>Order cannot be found.</p>
            </div>
        );
    }

    const handleMakePayment = async () => {
        try {
            // Call backend to make payment
            const res = await api.post('/api/order/pay', { orderId });
            console.log("init pay : ", res.data);
            // return
            // If all required PayHere params are present, create and submit a form
            if (res.data && res.data.hash) {
                // Required PayHere params from backend response
                const params = {
                    merchant_id: res.data.merchantId,
                    return_url: `http://localhost:5173/buyer/orders/${orderId}`, // Hardcoded
                    cancel_url: `http://localhost:5173/buyer/orders/${orderId}`, // Hardcoded
                    notify_url: "https://wfbdh-61-245-171-3.a.free.pinggy.link/api/payment/payhere/notify", // Hardcoded
                    first_name: res.data.firstName,
                    last_name: res.data.lastName,
                    email: res.data.email,
                    phone: res.data.phone,
                    address: res.data.address,
                    city: res.data.city,
                    country: res.data.country,
                    order_id: res.data.orderId,
                    items: res.data.description,
                    currency: res.data.currency,
                    amount: Number(res.data.amount).toFixed(2),
                    hash: res.data.hash,
                    custom_1: res.data.paymentId
                };

                console.log("PayHere params: ", params);
                // return
                // Create form
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = 'https://sandbox.payhere.lk/pay/checkout';
                Object.entries(params).forEach(([key, value]) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = value;
                    form.appendChild(input);
                });
                document.body.appendChild(form);
                form.submit();
                // After redirect, you may want to check payment status
                // Optionally, you can call checkPaymentStatus here or on return page
            } else {
                // Fallback: update local state if hash not present
                updateOrder(orderId, { status: res.data?.status || "PROCESSING", paymentId: res.data?.paymentId });
            }
        } catch (err) {
            console.error("Payment failed:", err);
            // Optionally show error to user
        } finally {
            closeModal();
        }
    }

    const handleCreateTransport = () => {
        console.log("Creating transport for order", orderId);
        updateOrder(orderId, { transport: "BY_BUYER_SYSTEM" });
        const job = {
            id: "TJ-10001",
            orderId,
            status: "PENDING",
            vehicleType: 'Small Van',
            items: items.map(i => { i.load_id = "LD-1001"; i.pickup_confirmation = "PENDING"; return i }),
            createdAt: '2025-07-01',
            // pickupLocations: ["farm1", "farm2", "farm3"],
            pickupLocation: "farm location",
            dropOffLocation: "buyer location",
        };
        addJob(job);
        closeModal();
    };

    const handleViewTransport = () => {
        navigate(`/buyer/transport/schedules/of-order/${orderId}`)
    }

    const handleCancelTransport = () => {
        // TODO : Call API to cancel transport job
        updateOrder(orderId, { transport: "BY_BUYER" })
        closeModal();
    }

    const handleCancelOrder = () => {
        api.post(`/api/order/cancel/${orderId}`)
            .then(() => {
                updateOrder(orderId, { status: "CANCELED" })
                closeModal();
            }).catch(err => {
                console.error("Error canceling order: ", err);
            })
    }

    const handleConfirmDelivery = () => {
        updateOrder(orderId, { status: "DELIVERED" })
        closeModal();
    }

    const handleRefundRequest = () => {
        closeModal();
    }

    const modelValues = {
        MAKE_PAYMENT: {
            title: "Make Payment",
            description: "Proceed to complete the order payment securely.",
            submitText: "Pay Now",
            onSubmit: handleMakePayment
        },
        ADD_TRANSPORT: {
            title: "Add Transport Job",
            description: "Assign transport jobs to fulfill the order.",
            submitText: "Create Transport",
            onSubmit: handleCreateTransport
        },
        CANCEL_TRANSPORT: {
            title: "Cancel Transport Job",
            description: "You are about to cancel the transport job. This may affect delivery timelines.",
            submitText: "Confirm Cancellation",
            onSubmit: handleCancelTransport
        },
        CANCEL_ORDER: {
            title: "Cancel Order",
            description: "You are about to cancel the order.",
            submitText: "Confirm Cancellation",
            onSubmit: handleCancelOrder
        },
        CONFIRM_DELIVERY: {
            title: "Confirm Delivery",
            description: "Confirm that the order has been delivered to the buyer.",
            submitText: "Mark as Delivered",
            onSubmit: handleConfirmDelivery
        },
        REQUEST_FUND: {
            title: "Request Fund Release",
            description: "Request release of funds held in escrow after confirmation.",
            submitText: "Request Funds",
            onSubmit: handleRefundRequest
        }
    };


    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-4 p-4">
                {/* Back button */}
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-green-700 mb-2">
                    <ArrowLeftIcon className="h-5 w-5" />
                    Back
                </button>


                {/* Header Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
                    <p className="text-gray-600 mt-1 text-sm">Review your order, manage payment and transport</p>
                </div>

                {/* Order Details & Actions Card */}
                {/* Order Items Table */}
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                        <p className="mt-2 text-gray-600 text-sm">Loading orders...</p>
                    </div>
                ) :
                    (
                        <>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-500">Order ID:</span>
                                        <span className="font-semibold text-green-700">{order.id}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-500">Status:</span>
                                        {(() => {
                                            let badgeClass = 'bg-gray-100 text-gray-700';
                                            let icon = <ClockIcon className="h-4 w-4 mr-1" />;
                                            if (order.status === 'DELIVERED') { badgeClass = 'bg-blue-100 text-blue-800'; icon = <CheckBadgeIcon className="h-4 w-4 mr-1" />; }
                                            else if (order.status === 'PENDING') { badgeClass = 'bg-yellow-100 text-yellow-800'; icon = <ClockIcon className="h-4 w-4 mr-1" />; }
                                            else if (order.status === 'PROCESSING') { badgeClass = 'bg-orange-100 text-orange-800'; icon = <ClockIcon className="h-4 w-4 mr-1" />; }
                                            else if (order.status === 'CANCELED') { badgeClass = 'bg-red-100 text-red-800'; icon = <XCircleIcon className="h-4 w-4 mr-1" />; }
                                            else if (order.status === 'COMPLETED') { badgeClass = 'bg-green-100 text-green-800'; icon = <CheckBadgeIcon className="h-4 w-4 mr-1" />; }
                                            return <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>{icon}{order.status}</span>;
                                        })()}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-500">Transport:</span>
                                        <span className="font-semibold text-gray-800">{order.transport}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-500">Total:</span>
                                        <span className="font-semibold text-green-700">Rs. {subtotal.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {order.status === "PENDING" && <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow" onClick={() => openModel("MAKE_PAYMENT")}>Make Payment</button>}
                                    {(order.status === "PROCESSING" || order.status === "AWAITING_PICKUP") && (
                                        <>
                                            {order.transport === "BY_BUYER" && <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow" onClick={() => openModel("ADD_TRANSPORT")}>Add Transport</button>}
                                            {order.transport === "BY_FARMER_SYSTEM" && <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow" onClick={handleViewTransport}>View Transport</button>}
                                            {order.transport === "BY_BUYER_SYSTEM" && (
                                                <>
                                                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow" onClick={handleViewTransport}>View Transport</button>
                                                    <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow" onClick={() => openModel("CANCEL_TRANSPORT")}>Cancel Transport</button>
                                                </>
                                            )}
                                        </>
                                    )}
                                    {(order.status === "IN_TRANSPORT" || order.status === "DELIVERED") && <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow" onClick={handleViewTransport}>View Transport</button>}
                                    {(order.status === "PENDING" || order.status === "PROCESSING" || order.status === "AWAITING_PICKUP") && (
                                        <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow" onClick={() => openModel("CANCEL_ORDER")}>Cancel Order</button>
                                    )}
                                    {order.status === "IN_TRANSPORT" && (
                                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow" onClick={() => openModel("CONFIRM_DELIVERY")}>Confirm Delivery</button>
                                    )}
                                    {order.status === "DELIVERED" && (
                                        <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold shadow" onClick={() => openModel("REQUEST_REFUND")}>Request Refund</button>
                                    )}
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-2">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="p-2 text-left font-semibold">Product</th>
                                                <th className="p-2 text-left font-semibold">Price</th>
                                                <th className="p-2 text-left font-semibold">Quantity (Kg)</th>
                                                <th className="p-2 text-left font-semibold">Total</th>
                                                <th className="p-2 text-left font-semibold">Transportation Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map(item => (
                                                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="flex items-center space-x-4 p-4">
                                                        <img src={item.imageUrl || (Math.random() >= 0.5 ? wheat : corn)} alt="" className="w-20 h-20 object-cover rounded border border-gray-200" />
                                                        <div>
                                                            <p className="font-medium text-green-900">{item.type}</p>
                                                            <p className="text-sm text-gray-500">Farm: {item.farm}</p>
                                                            <p className="text-sm text-gray-500">Location: {item.location}</p>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-green-700 font-semibold">Rs. {item.pricePerUnit.toFixed(2)}</td>
                                                    <td className="p-4">{item.quantity}</td>
                                                    <td className="p-4 font-semibold text-green-800">Rs. {(item.pricePerUnit * item.quantity).toFixed(2)}</td>
                                                    <td className="p-4">
                                                        <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">Pending</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}



                {/* Modal */}
                <CustomModal
                    isOpen={modelDetails.isOpen}
                    onClose={closeModal}
                    title={modelValues[modelDetails.model]?.title}
                    description={modelValues[modelDetails.model]?.description}
                    submitText={modelValues[modelDetails.model]?.submitText}
                    onSubmit={modelValues[modelDetails.model]?.onSubmit}
                />

                {/* Continue Searching Button */}
                <div className="flex justify-end mt-6">
                    <Link to="../crops" className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition font-semibold">
                        Continue Searching
                    </Link>
                </div>
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