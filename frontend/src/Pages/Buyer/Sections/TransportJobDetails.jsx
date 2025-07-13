import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useTransportsContext } from '../../../Contexts/Buyer/TransportContext';
import CustomModal from '../../../Components/CustomModel';

export default function TransportJobDetails() {
    const { jobId } = useParams();
    const { jobs, updateJob } = useTransportsContext();
    const job = jobs.find(j => j.id === jobId);

    if (!job) return <div className="p-6">Job not found.</div>;

    const [modelDetails, setModelDetails] = useState({
        isOpen: false,
        model: "",
    });

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

    const handleMakePayment = () => {
        updateJob(jobId, {status: "AWAITING_PICKUP"})
        closeModal();
    }

    const handleCancelTransport = () => {
        updateJob(jobId, { status: "CANCELED" })
        closeModal();
    }

    const handleConfirmDelivery = () => {
        updateJob(jobId, { status: "DELIVERED" })
        closeModal();
    }

    const modelValues = {
        MAKE_PAYMENT: {
            title: "Make Payment",
            description: "Proceed to complete the transport payment securely.",
            submitText: "Pay Now",
            onSubmit: handleMakePayment
        },
        CANCEL_TRANSPORT: {
            title: "Cancel Transport Job",
            description: "You are about to cancel the transport job. This may affect delivery timelines.",
            submitText: "Confirm Cancellation",
            onSubmit: handleCancelTransport
        },
        CONFIRM_DELIVERY: {
            title: "Confirm Delivery",
            description: "Confirm that the order has been delivered to the buyer.",
            submitText: "Mark as Delivered",
            onSubmit: handleConfirmDelivery
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <nav className="text-gray-500 text-sm flex justify-between">
                <ul className="flex space-x-2">
                    <li><Link to="/buyer/transport/schedules" className="hover:underline">Jobs</Link> /</li>
                    <li><span>{jobId}</span></li>
                </ul>
            </nav>
            <h1 className="text-3xl font-bold">Transport Job {job.id}</h1>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
                <div>
                    {job.orderId ? 
                        <p><strong>Order:</strong> <Link to={`/buyer/orders/${job.orderId}`}>{job.orderId}</Link></p>
                        :
                        <p><strong>Order:</strong> Not associated with an Order</p>
                    }
                    <p><strong>Status:</strong> {job.status}</p>
                    <p><strong>Vehicle Type:</strong> {job.vehicleType}</p>
                    <p><strong>Created at:</strong> {job.createdAt}</p>
                    <p><strong>Pickup location:</strong> {job.pickupLocation}</p>
                    <p><strong>Drop off location:</strong> {job.dropOffLocation}</p>
                    {/* <button
                        onClick={() => setStatus('Completed')}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Confirm Delivery
                    </button> */}
                </div>
                <div className="flex gap-5 items-start">
                    {job.status === "PENDING" && <button className="w-fit h-fit bg-green-500 hover:bg-green-300 text-white p-2 rounded-md" onClick={() => openModel("MAKE_PAYMENT")}>Make payment</button>}
                    {(job.status === "PENDING" || job.status === "PROCESSING" || job.status === "AWAITING_PICKUP") && (
                        <button className="w-fit h-fit bg-green-500 hover:bg-green-300 text-white p-2 rounded-md" onClick={() => openModel("CANCEL_TRANSPORT")}>Cancel Transport</button>
                    )}
                    {job.status === "IN_TRANSPORT" && (
                        <button className="w-fit h-fit bg-green-500 hover:bg-green-300 text-white p-2 rounded-md" onClick={() => openModel("CONFIRM_DELIVERY")}>Confirm Delivery</button>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Assigned Items</h2>
                <ul className="space-y-2">
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <table className="w-full table-auto border-separate border-spacing-y-4">
                            <thead className="text-left text-gray-600">
                                <tr>
                                    <th>Load Id</th>
                                    <th>Product</th>
                                    <th>Qty (kg)</th>
                                    {/* <th>Price/kg</th>
                                        <th>Total</th> */}
                                    <th>Pickup confirmation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {job.items.map(item => (
                                    <tr key={item.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <td className="p-2">{item.load_id}</td>
                                        <td className="p-2">{item.type}</td>
                                        <td className="p-2">{item.quantity}</td>
                                        {/* <td className="p-2">Rs. {item.pricePerUnit.toFixed(2)}</td>
                                            <td className="p-2 font-semibold">
                                                Rs. {(item.quantity * item.pricePerUnit).toFixed(2)}
                                            </td> */}
                                        <td>{item.pickup_confirmation}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </ul>
            </div>

            <CustomModal
                isOpen={modelDetails.isOpen}
                onClose={closeModal}
                title={modelValues[modelDetails.model]?.title}
                description={modelValues[modelDetails.model]?.description}
                submitText={modelValues[modelDetails.model]?.submitText}
                onSubmit={modelValues[modelDetails.model]?.onSubmit}
            />
        </div>
    );
}
