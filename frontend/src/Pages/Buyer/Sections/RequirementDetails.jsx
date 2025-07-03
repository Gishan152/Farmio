import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '../../../Contexts/ToastContext';
// Mock bids data
const mockBids = [
    { id: 'BID-1', provider: 'FastMove Logistics', price: 5000, proposedDate: '2025-07-10', notes: 'Can deliver within 2 days' },
    { id: 'BID-2', provider: 'Trusty Transport', price: 4800, proposedDate: '2025-07-08', notes: 'Quick transport' },
];

const sampleRequirements = [
  {
    id: '1692A1',
    crop: 'Carrots',
    quantity: 100,
    location: 'My Farm Village',
    duration: { years: 0, months: 1, days: 15 },
    note: 'Need early harvest variety',
    date: '2025-06-20'
  },
  {
    id: '1692B2',
    crop: 'Wheat',
    quantity: 200,
    location: 'Northern Plains',
    duration: { years: 0, months: 2, days: 0 },
    note: '',
    date: '2025-05-10'
  },
  {
    id: '1692C3',
    crop: 'Rice',
    quantity: 150,
    location: 'My Farm Village',
    duration: { years: 0, months: 0, days: 20 },
    note: 'Prefer organic suppliers',
    date: '2025-04-05'
  }
];

// Save to localStorage for testing:
// localStorage.setItem('requirements', JSON.stringify(sampleRequirements));


export default function RequirementDetails() {
    const { requirementId } = useParams();
    const toast = useToast();
    const [requirement, setRequirement] = useState(null);
    const [bids, setBids] = useState([]);

    useEffect(() => {
        // TODO: Replace with API call
        // const saved = JSON.parse(localStorage.getItem('requirements') || '[]');
        const saved = sampleRequirements;
        const req = saved.find(r => r.id === requirementId);
        setRequirement(req);
        setBids(mockBids);
    }, [requirementId]);

    if (!requirement) {
        return <div className="p-6 text-gray-600">Requirement not found.</div>;
    }

    const handleAccept = bid => {
        toast.push(`✅ Accepted bid from ${bid.provider}`);
        // TODO: API call for accept
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <nav className="text-gray-500 text-sm flex justify-between">
                <ul className="flex space-x-2">
                    <li><Link to="/requirements" className="hover:underline">Requirements</Link> /</li>
                    <li><span>{requirementId}</span></li>
                </ul>
            </nav>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold dark:text-gray-100">Requirement Details</h1>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h1 className="text-2xl font-bold dark:text-gray-100">{requirement.crop} — {requirement.quantity} kg</h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Location: {requirement.location}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                    Duration: {[
                        requirement.duration.years > 0 && `${requirement.duration.years}y`,
                        requirement.duration.months > 0 && `${requirement.duration.months}mo`,
                        requirement.duration.days > 0 && `${requirement.duration.days}d`
                    ].filter(Boolean).join(' ')}
                </p>
                {requirement.note && (
                    <p className="mt-2 text-gray-600 dark:text-gray-300">Note: {requirement.note}</p>
                )}
                <p className="text-sm text-gray-400 mt-1">Posted on {requirement.date}</p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">Bids Received</h2>
                {bids.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-300">No bids yet.</p>
                ) : (
                    <ul className="space-y-4">
                        {bids.map(bid => (
                            <li key={bid.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col md:flex-row justify-between items-start md:items-center">
                                <div>
                                    <p className="text-lg font-medium dark:text-gray-100">{bid.provider}</p>
                                    <p className="text-gray-600 dark:text-gray-300">Price: Rs. {bid.price}</p>
                                    <p className="text-gray-600 dark:text-gray-300">Delivery by: {bid.proposedDate}</p>
                                    {bid.notes && <p className="text-gray-600 dark:text-gray-300">Note: {bid.notes}</p>}
                                </div>
                                <button
                                    onClick={() => handleAccept(bid)}
                                    className="mt-4 md:mt-0 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Accept Bid
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
