
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRequestsContext } from '../../../Contexts/Buyer/BuyerRequestContext';
import { ArchiveBoxIcon, CalendarIcon, ArrowPathIcon, EyeIcon, ChatBubbleLeftRightIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

export default function Requests() {
    const {requests, addRequest} = useRequestsContext();
    const [showModal, setShowModal] = useState(false);
    const addReq = req => addRequest({id: requests.length, ...req});

    // Filters state
    const [filters, setFilters] = useState({
        crop: '',
        quality: '',
        repeat: '',
        visibility: '',
        search: ''
    });

    // Filtering logic
    const filteredRequests = requests.filter(req => {
        if (filters.crop && req.crop !== filters.crop) return false;
        if (filters.quality && req.quality !== filters.quality) return false;
        if (filters.repeat && req.repeat !== filters.repeat) return false;
        if (filters.visibility && req.visibility !== filters.visibility) return false;
        if (filters.search && !(
            req.crop.toLowerCase().includes(filters.search.toLowerCase()) ||
            (req.notes && req.notes.toLowerCase().includes(filters.search.toLowerCase()))
        )) return false;
        return true;
    });

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <ArchiveBoxIcon className="h-8 w-8 text-green-600" />
                    <h1 className="text-3xl font-bold dark:text-gray-100">Buyer Requests</h1>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                >
                    <ArrowPathIcon className="h-5 w-5" />
                    New Request
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-wrap gap-3 items-center">
                <input
                    type="text"
                    placeholder="Search by crop or notes..."
                    value={filters.search}
                    onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                    className="w-full md:w-56 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700"
                />
                <select
                    value={filters.crop}
                    onChange={e => setFilters(f => ({ ...f, crop: e.target.value }))}
                    className="w-full md:w-40 px-2 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700"
                >
                    <option value="">All Crops</option>
                    {CROP_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                    value={filters.quality}
                    onChange={e => setFilters(f => ({ ...f, quality: e.target.value }))}
                    className="w-full md:w-36 px-2 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700"
                >
                    <option value="">All Qualities</option>
                    {QUALITY_OPTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
                <select
                    value={filters.repeat}
                    onChange={e => setFilters(f => ({ ...f, repeat: e.target.value }))}
                    className="w-full md:w-36 px-2 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700"
                >
                    <option value="">All Repeat</option>
                    {REPEAT_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <select
                    value={filters.visibility}
                    onChange={e => setFilters(f => ({ ...f, visibility: e.target.value }))}
                    className="w-full md:w-44 px-2 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700"
                >
                    <option value="">All Visibility</option>
                    {VISIBILITY_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
            </div>

            <NewRequestModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={addReq}
            />

            {filteredRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <ExclamationCircleIcon className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-gray-600 dark:text-gray-300 text-lg">No requests found.</p>
                </div>
            ) : (
                <ul className="grid gap-6 md:grid-cols-1">
                    {filteredRequests.map(req => (
                        <li
                            key={req.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 flex flex-col h-full p-5 relative group transition hover:shadow-lg"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <ArchiveBoxIcon className="h-6 w-6 text-green-500" />
                                <span className="text-lg font-semibold dark:text-gray-100">{req.crop}</span>
                                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                                    {req.quality || 'Any'}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-sm mb-2">
                                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{req.quantity} {req.unitMeasurement}</span>
                                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Rs {req.priceRange.min}–{req.priceRange.max}/kg</span>
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
                                <Link
                                    to={`./${req.id}`}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 text-xs font-medium shadow"
                                >
                                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                                    View Bids
                                </Link>
                            </div>
                            {/* Accent bar */}
                            <div className="absolute left-0 top-0 h-full w-1 bg-green-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition" />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}


const BUYER_LOCATION = "BUYER_LOCATION";
const CROP_OPTIONS = ['Carrots', 'Wheat', 'Rice', 'Corn', 'Potatoes'];
const MEASUREMENT_OPTIONS = ['kg', 'g', 'unit'];
const QUALITY_OPTIONS = ['A', 'B', 'C', 'Organic'];
const REPEAT_OPTIONS = ['One-time', 'Weekly', 'Monthly'];
const VISIBILITY_OPTIONS = ['Public', 'Verified farmers', 'Regional only'];

function NewRequestModal({ isOpen, onClose, onSave }) {
    const [form, setForm] = useState({
        crop: '',
        unitMeasurement: '',
        quantity: '',
        quality: '',
        priceMin: '',
        priceMax: '',
        locationOption: 'buyer',
        customLocation: '',
        deadline: '',
        repeat: 'One-time',
        notes: '',
        visibility: 'Public'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isOpen) {
            setForm({
                crop: '',
                unitMeasurement: '',
                quantity: '',
                quality: '',
                priceMin: '',
                priceMax: '',
                locationOption: 'buyer',
                customLocation: '',
                deadline: '',
                repeat: 'One-time',
                notes: '',
                visibility: 'Public'
            });
            setErrors({});
        }
    }, [isOpen]);

    const validate = () => {
        const errs = {};
        if (!form.crop) errs.crop = 'Select a crop';
        if (!form.unitMeasurement) errs.unitMeasurement = 'Select the unit of measurement';
        if (!form.quantity || isNaN(form.quantity) || +form.quantity <= 0)
            errs.quantity = 'Positive quantity required';
        if (form.priceMin === '' || form.priceMax === '' ||
            isNaN(form.priceMin) || isNaN(form.priceMax) ||
            +form.priceMin < 0 || +form.priceMin > +form.priceMax)
            errs.price = 'Enter valid price range';
        if (form.locationOption === 'custom' && !form.customLocation)
            errs.customLocation = 'Enter delivery location';
        if (!form.deadline) errs.deadline = 'Set a delivery timeline';
        return errs;
    };

    const handleSubmit = () => {
        const errs = validate();
        if (Object.keys(errs).length) return setErrors(errs);

        onSave({
            id: Date.now().toString(),
            crop: form.crop,
            unitMeasurement: form.unitMeasurement,
            quantity: +form.quantity,
            quality: form.quality,
            priceRange: { min: +form.priceMin, max: +form.priceMax },
            location: form.locationOption === 'buyer' ? BUYER_LOCATION : form.customLocation,
            deadline: form.deadline,
            repeat: form.repeat,
            notes: form.notes,
            visibility: form.visibility,
            date: new Date().toLocaleDateString()
        });
        onClose();
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 m-0 z-40 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full p-6 z-50 space-y-5 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                    <ArchiveBoxIcon className="h-6 w-6 text-green-500" />
                    <h2 className="text-xl font-semibold dark:text-gray-100">New Request</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Crop type */}
                    <div>
                        <label className="block text-xs font-medium dark:text-gray-200">Crop Type</label>
                        <select
                            value={form.crop}
                            onChange={e => setForm({ ...form, crop: e.target.value })}
                            className="mt-1 w-full bg-gray-50 dark:bg-gray-700 border rounded px-3 py-2"
                        >
                            <option value="">Select crop</option>
                            {CROP_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {errors.crop && <p className="text-red-500 text-xs mt-1">{errors.crop}</p>}
                    </div>
                    {/* Measurement */}
                    <div>
                        <label className="block text-xs font-medium dark:text-gray-200">Measurement</label>
                        <select
                            value={form.unitMeasurement}
                            onChange={e => setForm({ ...form, unitMeasurement: e.target.value })}
                            className="mt-1 w-full bg-gray-50 dark:bg-gray-700 border rounded px-3 py-2"
                        >
                            <option value="">Select</option>
                            {MEASUREMENT_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {errors.unitMeasurement && <p className="text-red-500 text-xs mt-1">{errors.unitMeasurement}</p>}
                    </div>
                    {/* Quantity */}
                    <div>
                        <label className="block text-xs font-medium dark:text-gray-200">Quantity</label>
                        <input
                            type="number"
                            value={form.quantity}
                            onChange={e => setForm({ ...form, quantity: e.target.value })}
                            className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded"
                        />
                        {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                    </div>
                    {/* Quality grade */}
                    <div>
                        <label className="block text-xs font-medium dark:text-gray-200">Quality Grade</label>
                        <select
                            value={form.quality}
                            onChange={e => setForm({ ...form, quality: e.target.value })}
                            className="mt-1 w-full bg-gray-50 dark:bg-gray-700 border rounded px-3 py-2"
                        >
                            <option value="">Any</option>
                            {QUALITY_OPTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                        </select>
                    </div>
                    {/* Price range */}
                    <div className="col-span-2">
                        <label className="block text-xs font-medium dark:text-gray-200">Price Range (/kg)</label>
                        <div className="flex space-x-2">
                            <input
                                type="number"
                                placeholder="Min"
                                value={form.priceMin}
                                onChange={e => setForm({ ...form, priceMin: e.target.value })}
                                className="mt-1 w-1/2 px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded"
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={form.priceMax}
                                onChange={e => setForm({ ...form, priceMax: e.target.value })}
                                className="mt-1 w-1/2 px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded"
                            />
                        </div>
                        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                    </div>
                    {/* Delivery location */}
                    <div className="col-span-2">
                        <label className="block text-xs font-medium dark:text-gray-200">Delivery Location</label>
                        <div className="flex gap-4 mt-1">
                            <label className="flex items-center">
                                <input type="radio" name="loc" checked={form.locationOption === 'buyer'} onChange={() => setForm({ ...form, locationOption: 'buyer' })} />
                                <span className="ml-2">My location</span>
                            </label>
                            <label className="flex items-center">
                                <input type="radio" name="loc" checked={form.locationOption === 'custom'} onChange={() => setForm({ ...form, locationOption: 'custom' })} />
                                <span className="ml-2">Custom</span>
                            </label>
                        </div>
                        {form.locationOption === 'custom' && (
                            <input
                                type="text"
                                placeholder="e.g. GPS or district"
                                value={form.customLocation}
                                onChange={e => setForm({ ...form, customLocation: e.target.value })}
                                className="mt-2 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded"
                            />
                        )}
                        {errors.customLocation && <p className="text-red-500 text-xs mt-1">{errors.customLocation}</p>}
                    </div>
                    {/* Delivery timeline */}
                    <div>
                        <label className="block text-xs font-medium dark:text-gray-200">Delivery Deadline</label>
                        <input
                            type="date"
                            value={form.deadline}
                            onChange={e => setForm({ ...form, deadline: e.target.value })}
                            className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded"
                        />
                        {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>}
                    </div>
                    {/* Repeat request */}
                    <div>
                        <label className="block text-xs font-medium dark:text-gray-200">Repeat</label>
                        <select
                            value={form.repeat}
                            onChange={e => setForm({ ...form, repeat: e.target.value })}
                            className="mt-1 w-full bg-gray-50 dark:bg-gray-700 border rounded px-3 py-2"
                        >
                            {REPEAT_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    {/* Visibility */}
                    <div>
                        <label className="block text-xs font-medium dark:text-gray-200">Visibility</label>
                        <select
                            value={form.visibility}
                            onChange={e => setForm({ ...form, visibility: e.target.value })}
                            className="mt-1 w-full bg-gray-50 dark:bg-gray-700 border rounded px-3 py-2"
                        >
                            {VISIBILITY_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                    </div>
                    {/* Additional notes */}
                    <div className="col-span-2">
                        <label className="block text-xs font-medium dark:text-gray-200">Additional Notes</label>
                        <textarea
                            rows="2"
                            value={form.notes}
                            onChange={e => setForm({ ...form, notes: e.target.value })}
                            className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded"
                            placeholder="Packaging, certifications, etc."
                        />
                    </div>
                </div>
                {/* Actions */}
                <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 text-sm">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Submit</button>
                </div>
            </div>
        </div>
    );
}
