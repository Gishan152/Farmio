import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { sampleJobs } from './TransportSchedules';

export default function TransportJobDetails() {
    const { jobId } = useParams();
    const job = sampleJobs.find(j => j.id === jobId);
    const [status, setStatus] = useState(job?.status);

    if (!job) return <div className="p-6">Job not found.</div>;

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
                <p><strong>Order:</strong> <Link to={`/orders/${job.orderId}`}>{job.orderId}</Link></p>
                <p><strong>Status:</strong> {status}</p>
                <p><strong>Vehicle Type:</strong> {job.vehicleType}</p>
                <p><strong>Created at:</strong> {job.createdAt}</p>
                <button
                    onClick={() => setStatus('Completed')}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Mark as Completed
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Assigned Items</h2>
                <ul className="space-y-2">
                    {job.items.map(item => (
                        <li
                            key={item.id}
                            className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                            <span>{item.type}</span>
                            <span>{item.quantity} kg</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
