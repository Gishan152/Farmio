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

    // Stat values
    const totalItems = job.items.length;
    const totalQty = job.items.reduce((sum, i) => sum + (i.quantity || 0), 0);
    const delivered = job.items.filter(i => i.pickup_confirmation === 'Delivered').length;

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8">
            {/* Top-left back button */}
            <div className="flex items-center gap-2 mb-2">
                <Link to="/buyer/transport/schedules" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                    <ArrowLeftIcon className="w-5 h-5 inline-block mr-1" />
                </Link>
                <span className="text-gray-500 text-sm">Back to Jobs</span>
            </div>

            {/* Title & subtitle */}
            <div>
                <h1 className="text-3xl font-bold dark:text-gray-100">Transport Job <span className="text-green-700 dark:text-green-300">{job.id}</span></h1>
                <div className="mt-1 text-gray-600 dark:text-gray-300 text-lg">Detailed information and actions for this transport job.</div>
            </div>

            {/* Stat/info cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center border border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-500">Total Items</span>
                    <span className="text-2xl font-bold text-green-700 dark:text-green-300">{totalItems}</span>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center border border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-500">Total Qty (kg)</span>
                    <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalQty}</span>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center border border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-500">Delivered</span>
                    <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">{delivered}</span>
                </div>
            </div>

            {/* Job info card */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4 border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="mb-2">
                            <span className="font-semibold text-gray-700 dark:text-gray-200">Order:</span> {job.orderId ? <Link to={`/buyer/orders/${job.orderId}`} className="text-green-700 hover:underline dark:text-green-300">{job.orderId}</Link> : <span className="text-gray-400">Not associated</span>}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold text-gray-700 dark:text-gray-200">Status:</span> <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold 
                                ${job.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                                    job.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                                    job.status === 'Pending' ? 'bg-gray-100 text-gray-700' :
                                    'bg-gray-200 text-gray-800'}`}>{job.status}</span>
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold text-gray-700 dark:text-gray-200">Vehicle Type:</span> {job.vehicleType}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold text-gray-700 dark:text-gray-200">Created at:</span> {job.createdAt}
                        </div>
                    </div>
                    <div>
                        <div className="mb-2">
                            <span className="font-semibold text-gray-700 dark:text-gray-200">Pickup location:</span> {job.pickupLocation}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold text-gray-700 dark:text-gray-200">Drop off location:</span> {job.dropOffLocation}
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                    {job.status === "PENDING" && <button className="w-fit h-fit bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold shadow" onClick={() => openModel("MAKE_PAYMENT")}>Make Payment</button>}
                    {(job.status === "PENDING" || job.status === "PROCESSING" || job.status === "AWAITING_PICKUP") && (
                        <button className="w-fit h-fit bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold shadow" onClick={() => openModel("CANCEL_TRANSPORT")}>Cancel Transport</button>
                    )}
                    {job.status === "IN_TRANSPORT" && (
                        <button className="w-fit h-fit bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold shadow" onClick={() => openModel("CONFIRM_DELIVERY")}>Confirm Delivery</button>
                    )}
                </div>
            </div>

            {/* Assigned Items Table */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Assigned Items</h2>
                <div className="overflow-auto">
                    <table className="w-full table-auto border-separate border-spacing-y-4">
                        <thead className="text-left text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th>Load Id</th>
                                <th>Product</th>
                                <th>Qty (kg)</th>
                                <th>Pickup confirmation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {job.items.map(item => (
                                <tr key={item.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <td className="p-2">{item.load_id}</td>
                                    <td className="p-2">{item.type}</td>
                                    <td className="p-2">{item.quantity}</td>
                                    <td className="p-2">{item.pickup_confirmation}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
