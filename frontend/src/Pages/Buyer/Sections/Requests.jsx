import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRequestsContext } from '../../../Contexts/Buyer/BuyerRequestContext';

export default function Requests() {
    const {requests, addRequest} = useRequestsContext();
    // const [requests, setRequests] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const addReq = req => addRequest({id: requests.length, ...req});

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold dark:text-gray-100">Buyer Requests</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    New Request
                </button>
            </div>

            <NewRequestModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={addReq}
            />

            {requests.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">No requests yet.</p>
            ) : (
                <ul className="space-y-4">
                    {requests.map(req => (
                        <li
                            key={req.id}
                            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col md:flex-row md:justify-between"
                        >
                            <div className="space-y-2">
                                <h2 className="text-xl font-medium dark:text-gray-100">
                                    {req.crop} – {req.quantity} kg{" "}
                                    <span className="text-sm font-light dark:text-gray-300">
                                        ({req.quality || 'Any'})
                                    </span>
                                </h2>

                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    Price: Rs {req.priceRange.min}–{req.priceRange.max}/kg
                                </p>

                                <p className="text-gray-600 dark:text-gray-300">
                                    Location: {req.location}
                                </p>

                                <p className="text-gray-600 dark:text-gray-300">
                                    Deadline: {req.deadline} • Repeat: {req.repeat}
                                </p>

                                <p className="text-gray-600 dark:text-gray-300">
                                    Visibility: {req.visibility}
                                </p>

                                {req.notes && (
                                    <p className="text-gray-600 dark:text-gray-300">Note: {req.notes}</p>
                                )}

                                <p className="text-sm text-gray-400">Posted on {req.date}</p>
                            </div>

                            <Link
                                to={`./${req.id}`}
                                className="mt-4 md:mt-0 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 self-start"
                            >
                                View Bids
                            </Link>
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 z-50 space-y-4">
                <h2 className="text-xl font-semibold dark:text-gray-100">New Request</h2>

                {/* Crop type */}
                <div>
                    <label className="block text-sm font-medium dark:text-gray-200">Crop Type</label>
                    <select
                        value={form.crop}
                        onChange={e => setForm({ ...form, crop: e.target.value })}
                        className="mt-1 w-full bg-gray-50 dark:bg-gray-700 border rounded px-3 py-2"
                    >
                        <option value="">Select crop</option>
                        {CROP_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.crop && <p className="text-red-500 text-sm">{errors.crop}</p>}
                </div>

                {/* Measurement */}
                <div>
                    <label className="block text-sm font-medium dark:text-gray-200">Select Measurement</label>
                    <select
                        value={form.unitMeasurement}
                        onChange={e => setForm({ ...form, unitMeasurement: e.target.value })}
                        className="mt-1 w-full bg-gray-50 dark:bg-gray-700 border rounded px-3 py-2"
                    >
                        <option value="">Select Measurement</option>
                        {MEASUREMENT_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.unitMeasurement && <p className="text-red-500 text-sm">{errors.unitMeasurement}</p>}
                </div>

                {/* Quantity */}
                <div>
                    <label className="block text-sm font-medium dark:text-gray-200">Quantity Required (kg)</label>
                    <input
                        type="number"
                        value={form.quantity}
                        onChange={e => setForm({ ...form, quantity: e.target.value })}
                        className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded"
                    />
                    {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
                </div>

                {/* Quality grade */}
                <div>
                    <label className="block text-sm font-medium dark:text-gray-200">Preferred Quality Grade</label>
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
                <div>
                    <label className="block text-sm font-medium dark:text-gray-200">Expected Price Range (/kg)</label>
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
                    {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                </div>

                {/* Delivery location */}
                <div>
                    <label className="block text-sm font-medium dark:text-gray-200">Delivery Location</label>
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
                    {errors.customLocation && <p className="text-red-500 text-sm">{errors.customLocation}</p>}
                </div>

                {/* Delivery timeline */}
                <div>
                    <label className="block text-sm font-medium dark:text-gray-200">Delivery Timeline (deadline/date)</label>
                    <input
                        type="date"
                        value={form.deadline}
                        onChange={e => setForm({ ...form, deadline: e.target.value })}
                        className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded"
                    />
                    {errors.deadline && <p className="text-red-500 text-sm">{errors.deadline}</p>}
                </div>

                {/* Repeat request */}
                <div>
                    <label className="block text-sm font-medium dark:text-gray-200">Repeat Request</label>
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
                    <label className="block text-sm font-medium dark:text-gray-200">Visibility Option</label>
                    <select
                        value={form.visibility}
                        onChange={e => setForm({ ...form, visibility: e.target.value })}
                        className="mt-1 w-full bg-gray-50 dark:bg-gray-700 border rounded px-3 py-2"
                    >
                        {VISIBILITY_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>

                {/* Additional notes */}
                <div>
                    <label className="block text-sm font-medium dark:text-gray-200">Additional Notes</label>
                    <textarea
                        rows="3"
                        value={form.notes}
                        onChange={e => setForm({ ...form, notes: e.target.value })}
                        className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded"
                        placeholder="Packaging, certifications, etc."
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Submit</button>
                </div>
            </div>
        </div>
    );
}
