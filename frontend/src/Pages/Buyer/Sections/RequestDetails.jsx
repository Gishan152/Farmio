import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '../../../Contexts/ToastContext';
import { useRequestsContext } from '../../../Contexts/Buyer/BuyerRequestContext';
// Mock bids data
// src/data/sampleRequests.js
export const sampleRequests = [
    {
        id: 'REQ-1001',
        crop: 'Carrots',
        quantity: 100,
        quality: 'A',
        priceRange: { min: 10, max: 12 },
        location: 'My Farm Village',
        deadline: '2025-08-01',
        repeat: 'One-time',
        visibility: 'Public',
        notes: 'Need early harvest variety',
        date: '2025-06-20'
    },
    {
        id: 'REQ-1002',
        crop: 'Wheat',
        quantity: 200,
        quality: 'Organic',
        priceRange: { min: 9, max: 11 },
        location: 'Northern Plains',
        deadline: '2025-09-15',
        repeat: 'Monthly',
        visibility: 'Verified farmers',
        notes: '',
        date: '2025-05-10'
    }
];

export const mockBids = [
    {
        id: 'BID-1',
        provider: 'FastMove Logistics',
        price: 5000,
        proposedDate: '2025-07-10',
        notes: 'Can deliver within 2 days'
    },
    {
        id: 'BID-2',
        provider: 'Trusty Transport',
        price: 4800,
        proposedDate: '2025-07-08',
        notes: 'Quick transport'
    }
];


// Save to localStorage for testing:
// localStorage.setItem('requests', JSON.stringify(sampleRequests));


export default function RequestDetails() {
    const {requests, requestBids, updateBids} = useRequestsContext();
    const { requestId } = useParams();
    const toast = useToast();
    const [req, setReq] = useState(null);
    const [bids, setBids] = useState([]);

    useEffect(() => {
        const found = requests.find(r => r.id === requestId);
        setReq(found);
        // TODO : fetch bids of the request
        updateBids(requestId, mockBids);
        setBids(requestBids[requestId]);
        // setBids()
        // if (found) setBids(mockBids);
    }, [requestId]);

    if (!req) {
        return <div className="p-6 text-gray-600">Request not found.</div>;
    }

    const durationStr = [
        req.duration?.years && `${req.duration.years}y`,
        req.duration?.months && `${req.duration.months}mo`,
        req.duration?.days && `${req.duration.days}d`
    ].filter(Boolean).join(' ');

    const handleAccept = bid => {
        toast.push(`✅ Accepted bid from ${bid.provider}`);
        // TODO: API call
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <nav className="text-gray-500 text-sm flex justify-between">
                <ul className="flex space-x-2">
                    <li><Link to="/buyer/requests" className="hover:underline">Requests</Link> /</li>
                    <li><span>{req.id}</span></li>
                </ul>
            </nav>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-3">
                <h1 className="text-2xl font-bold dark:text-gray-100">{req.crop} — {req.quantity} kg</h1>
                <p className="text-gray-600 dark:text-gray-300">Location: {req.location}</p>
                <p className="text-gray-600 dark:text-gray-300">Preferred grade: {req.quality || 'Any'}</p>
                <p className="text-gray-600 dark:text-gray-300">
                    Price range: Rs {req.priceRange.min} – Rs {req.priceRange.max}/kg
                </p>
                <p className="text-gray-600 dark:text-gray-300">Timeline: before {req.deadline}</p>
                <p className="text-gray-600 dark:text-gray-300">Repeat: {req.repeat}</p>
                <p className="text-gray-600 dark:text-gray-300">Visibility: {req.visibility}</p>
                {req.notes && (
                    <p className="mt-2 text-gray-600 dark:text-gray-300">Notes: {req.notes}</p>
                )}
                <p className="text-sm text-gray-400">Posted on {req.date}</p>
            </div>

            <section>
                <h2 className="text-xl font-semibold dark:text-gray-100">Bids Received ({bids.length})</h2>
                {bids.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-300">No bids yet.</p>
                ) : (
                    <ul className="space-y-4">
                        {bids.map(bid => (
                            <li key={bid.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col md:flex-row justify-between">
                                <div>
                                    <p className="text-lg font-medium dark:text-gray-100">{bid.provider}</p>
                                    <p className="text-gray-600 dark:text-gray-300">Price: Rs {bid.price}</p>
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
            </section>
        </div>
    );
}
