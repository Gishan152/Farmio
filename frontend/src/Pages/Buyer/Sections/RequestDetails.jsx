import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../../Contexts/ToastContext';
import { useRequestsContext } from '../../../Contexts/Buyer/BuyerRequestContext';
import { ArchiveBoxIcon, CalendarIcon, ArrowPathIcon, EyeIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
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
    const {requests, requestBids, updateBids, loading} = useRequestsContext();
    const { requestId } = useParams();
    const toast = useToast();
    const [req, setReq] = useState(null);
    const [bids, setBids] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const found = requests.find(r => String(r.id) === String(requestId));
        setReq(found);
        updateBids(requestId, mockBids);
        setBids(requestBids[requestId]);
    }, [requestId, requests, requestBids, updateBids]);

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <p className="mt-2 text-gray-600 text-sm">Loading request...</p>
            </div>
        );
    }

    if (!req) {
        return <div className="p-6 text-gray-600">Request not found.</div>;
    }

    console.log("Request details: ", req);

    const handleAccept = bid => {
        toast.push(`✅ Accepted bid from ${bid.provider}`);
        // TODO: API call
    };

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8">
            <div className="relative">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="absolute -left-30 -top-0 inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition shadow"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Back
                </button>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 flex flex-col h-full p-6 relative group transition hover:shadow-lg mt-8">
                    {/* Accent bar */}
                    <div className="absolute left-0 top-0 h-full w-1 bg-green-500 rounded-l-xl opacity-100 transition" />
                    <div className="flex items-center gap-3 mb-2">
                        <ArchiveBoxIcon className="h-6 w-6 text-green-500" />
                        <span className="text-lg font-semibold dark:text-gray-100">{req.crop}</span>
                        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                            {req.quality || 'Any'}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm mb-2">
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{req.quantity} kg</span>
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Rs {req.priceMin}–{req.priceMax}/kg</span>
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded flex items-center gap-1"><CalendarIcon className="h-4 w-4 inline text-gray-400" /> {req.deadline}</span>
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded flex items-center gap-1"><ArrowPathIcon className="h-4 w-4 inline text-gray-400" /> {req.repeat}</span>
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded flex items-center gap-1"><EyeIcon className="h-4 w-4 inline text-gray-400" /> {req.visibility}</span>
                    </div>
                    <div className="mb-2 text-gray-600 dark:text-gray-300 text-sm">
                        <span className="font-medium">Location:</span> {req.location}
                    </div>
                    {req.notes && (
                        <div className="mb-2 text-gray-500 dark:text-gray-400 text-xs italic">Note: {req.notes}</div>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-2">
                        <span className="text-xs text-gray-400">Posted on {req.date}</span>
                        <span className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded text-xs font-medium shadow">
                            <ChatBubbleLeftRightIcon className="h-4 w-4" />
                            Bids
                        </span>
                    </div>
                </div>
            </div>

            <section>
                <h2 className="text-xl font-semibold dark:text-gray-100 mb-4 mt-8">Bids Received ({bids.length})</h2>
                {bids.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <p className="text-gray-600 dark:text-gray-300 text-lg">No bids yet.</p>
                    </div>
                ) : (
                    <ul className="grid gap-4 md:grid-cols-1">
                        {bids.map(bid => (
                            <li key={bid.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center group hover:shadow-lg transition">
                                <div className="flex-1">
                                    <p className="text-lg font-medium dark:text-gray-100">{bid.provider}</p>
                                    <div className="flex flex-wrap gap-2 text-sm mb-1 mt-1">
                                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Price: Rs {bid.price}</span>
                                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Delivery by: {bid.proposedDate}</span>
                                    </div>
                                    {bid.notes && <p className="text-gray-500 dark:text-gray-400 text-xs italic">Note: {bid.notes}</p>}
                                </div>
                                <button
                                    onClick={() => handleAccept(bid)}
                                    className="mt-4 md:mt-0 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow"
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
