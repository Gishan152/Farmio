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
    const [filterProvider, setFilterProvider] = useState('');
    const [filterPriceMin, setFilterPriceMin] = useState('');
    const [filterPriceMax, setFilterPriceMax] = useState('');
    const [filterDate, setFilterDate] = useState('');
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

    // Filtering logic
    const filteredBids = (bids || []).filter(bid => {
        const matchesProvider = filterProvider === '' || bid.provider.toLowerCase().includes(filterProvider.toLowerCase());
        const matchesPriceMin = filterPriceMin === '' || Number(bid.price) >= Number(filterPriceMin);
        const matchesPriceMax = filterPriceMax === '' || Number(bid.price) <= Number(filterPriceMax);
        const matchesDate = filterDate === '' || bid.proposedDate === filterDate;
        return matchesProvider && matchesPriceMin && matchesPriceMax && matchesDate;
    });

    const handleAccept = bid => {
        toast.push(`✅ Accepted bid from ${bid.provider}`);
        // TODO: API call
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-4 p-4">
                {/* Header Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-2 flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition shadow"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                        Back
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Request Details</h1>
                        <p className="text-gray-600 mt-1 text-sm">View and manage your crop request and bids</p>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-1 bg-green-500 rounded-l-lg" />
                        <ArchiveBoxIcon className="h-7 w-7 text-green-500 mr-3 z-10" />
                        <div className="z-10">
                            <p className="text-xs font-medium text-gray-500">Crop</p>
                            <p className="text-lg font-bold text-gray-900">{req.crop}</p>
                        </div>
                    </div>
                    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-l-lg" />
                        <span className="h-7 w-7 text-blue-500 mr-3 z-10 font-bold text-xl flex items-center justify-center">Q</span>
                        <div className="z-10">
                            <p className="text-xs font-medium text-gray-500">Quality</p>
                            <p className="text-lg font-bold text-gray-900">{req.quality || 'Any'}</p>
                        </div>
                    </div>
                    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-1 bg-yellow-500 rounded-l-lg" />
                        <span className="h-7 w-7 text-yellow-500 mr-3 z-10 font-bold text-xl flex items-center justify-center">{req.unitMeasurement || 'kg'}</span>
                        <div className="z-10">
                            <p className="text-xs font-medium text-gray-500">Quantity</p>
                            <p className="text-lg font-bold text-gray-900">{req.quantity} {req.unitMeasurement}</p>
                        </div>
                    </div>
                    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-1 bg-gray-400 rounded-l-lg" />
                        <span className="h-7 w-7 text-gray-500 mr-3 z-10 font-bold text-xl flex items-center justify-center">₹</span>
                        <div className="z-10">
                            <p className="text-xs font-medium text-gray-500">Price Range</p>
                            <p className="text-lg font-bold text-gray-900">Rs {req.priceMin || req.priceRange?.min}–{req.priceMax || req.priceRange?.max}/kg</p>
                        </div>
                    </div>
                </div>

                {/* Details Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 flex flex-col h-full p-6 relative group transition hover:shadow-lg mt-4">
                    <div className="absolute left-0 top-0 h-full w-1 bg-green-500 rounded-l-xl opacity-100 transition" />
                    <div className="flex flex-wrap gap-2 text-sm mb-2">
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Deadline: {req.deadline}</span>
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Repeat: {req.repeat}</span>
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Visibility: {req.visibility}</span>
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Location: {req.location}</span>
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

                {/* Bids Section */}
                <section>
                    <h2 className="text-xl font-semibold dark:text-gray-100 mb-4 mt-8">Bids Received ({filteredBids.length})</h2>
                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 mb-4 items-end bg-white p-3 rounded-lg border border-gray-200">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Provider</label>
                            <input
                                type="text"
                                value={filterProvider}
                                onChange={e => setFilterProvider(e.target.value)}
                                placeholder="Search provider"
                                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Min Price</label>
                            <input
                                type="number"
                                value={filterPriceMin}
                                onChange={e => setFilterPriceMin(e.target.value)}
                                placeholder="Min"
                                className="border border-gray-300 rounded px-2 py-1 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-green-200"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Max Price</label>
                            <input
                                type="number"
                                value={filterPriceMax}
                                onChange={e => setFilterPriceMax(e.target.value)}
                                placeholder="Max"
                                className="border border-gray-300 rounded px-2 py-1 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-green-200"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Delivery Date</label>
                            <input
                                type="date"
                                value={filterDate}
                                onChange={e => setFilterDate(e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setFilterProvider('');
                                setFilterPriceMin('');
                                setFilterPriceMax('');
                                setFilterDate('');
                            }}
                            className="ml-auto px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition"
                        >
                            Clear Filters
                        </button>
                    </div>
                    {filteredBids.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <p className="text-gray-600 dark:text-gray-300 text-lg">No bids found.</p>
                        </div>
                    ) : (
                        <ul className="grid gap-4 md:grid-cols-1">
                            {filteredBids.map(bid => (
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
        </div>
    );
}
