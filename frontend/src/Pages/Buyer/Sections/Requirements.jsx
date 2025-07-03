import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Requirements() {
    const [requirements, setRequirements] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const addReq = req => setRequirements(r => [req, ...r]);

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold dark:text-gray-100">Crop Requirements</h1>
                <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">New Requirement</button>
            </div>

            <NewRequirementModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={addReq} />

            {requirements.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">No requirements yet.</p>
            ) : (
                <ul className="space-y-4">
                    {requirements.map(req => (
                        <li key={req.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-medium dark:text-gray-100">{req.crop} – {req.quantity} kg</h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Location: {req.location} • Duration:{" "}
                                    {[
                                        req.duration.years > 0 && `${req.duration.years}y`,
                                        req.duration.months > 0 && `${req.duration.months}mo`,
                                        req.duration.days > 0 && `${req.duration.days}d`
                                    ]
                                        .filter(Boolean)
                                        .join(" ")}
                                </p>
                                {req.note && <p className="text-gray-600 dark:text-gray-300 mt-1">Note: {req.note}</p>}
                                <p className="text-sm text-gray-400 mt-1">Posted on {req.date}</p>
                            </div>
                            <Link
                                to={`./${req.id}`}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
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

const BUYER_LOCATION = "BUYER_LOCATION"
const CROP_OPTIONS = ['Carrots', 'Wheat', 'Rice', 'Corn', 'Potatoes'];

function NewRequirementModal({ isOpen, onClose, onSave }) {
    const [form, setForm] = useState({
        crop: '',
        quantity: '',
        locationOption: 'buyer',
        customLocation: '',
        years: 0,
        months: 0,
        days: 0,
        note: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isOpen) {
            setForm({
                crop: '',
                quantity: '',
                locationOption: 'buyer',
                customLocation: '',
                years: 0,
                months: 0,
                days: 0,
                note: ''
            });
            setErrors({});
        }
    }, [isOpen]);

    const validate = () => {
        const errs = {};
        if (!form.crop) errs.crop = 'Select a crop';
        if (!form.quantity || isNaN(form.quantity) || +form.quantity <= 0)
            errs.quantity = 'Enter a positive number';
        if (form.locationOption === 'custom' && !form.customLocation)
            errs.customLocation = 'Enter location';
        if (
            form.years === 0 &&
            form.months === 0 &&
            form.days === 0
        )
            errs.duration = 'Specify duration';
        return errs;
    };

    const handleSubmit = () => {
        const errs = validate();
        if (Object.keys(errs).length) return setErrors(errs);

        onSave({
            id: Date.now().toString(),
            crop: form.crop,
            quantity: +form.quantity,
            location:
                form.locationOption === 'buyer'
                    ? BUYER_LOCATION
                    : form.customLocation,
            duration: { years: form.years, months: form.months, days: form.days },
            note: form.note,
            date: new Date().toLocaleDateString()
        });
        onClose();
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 z-50">
                <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">New Crop Requirement</h2>

                <div className="mb-3">
                    <label className="block text-sm font-medium dark:text-gray-200">Crop Type</label>
                    <select
                        value={form.crop}
                        onChange={e => setForm(f => ({ ...f, crop: e.target.value }))}
                        className="mt-1 w-full bg-gray-50 dark:bg-gray-700 border rounded px-3 py-2"
                    >
                        <option value="">Select crop</option>
                        {CROP_OPTIONS.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    {errors.crop && <p className="text-red-500 text-sm mt-1">{errors.crop}</p>}
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium dark:text-gray-200">Quantity (kg)</label>
                    <input
                        type="number"
                        value={form.quantity}
                        onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                        className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded"
                    />
                    {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium dark:text-gray-200">Location</label>
                    <div className="flex items-center gap-4 mt-1">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="locationOption"
                                value="buyer"
                                checked={form.locationOption === 'buyer'}
                                onChange={() => setForm(f => ({ ...f, locationOption: 'buyer' }))}
                            />
                            <span className="ml-2">My location</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="locationOption"
                                value="custom"
                                checked={form.locationOption === 'custom'}
                                onChange={() => setForm(f => ({ ...f, locationOption: 'custom' }))}
                            />
                            <span className="ml-2">Custom</span>
                        </label>
                    </div>
                    {form.locationOption === 'custom' && (
                        <input
                            type="text"
                            value={form.customLocation}
                            onChange={e => setForm(f => ({ ...f, customLocation: e.target.value }))}
                            placeholder="Enter custom location"
                            className="mt-2 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded"
                        />
                    )}
                    {errors.customLocation && <p className="text-red-500 text-sm mt-1">{errors.customLocation}</p>}
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium dark:text-gray-200">
                        Duration
                    </label>
                    <div className="mt-1 flex space-x-2">
                        {['years', 'months', 'days'].map((unit) => (
                            <div key={unit}>
                                <input
                                    type="number"
                                    min="0"
                                    name={unit}
                                    value={form[unit]}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            [unit]: Math.max(0, +e.target.value)
                                        }))
                                    }
                                    className="w-20 px-2 py-1 bg-gray-50 dark:bg-gray-700 border rounded text-center"
                                    placeholder={unit.charAt(0).toUpperCase()}
                                />
                                <span className="text-sm">{unit}</span>
                            </div>
                        ))}
                    </div>
                    {errors.duration && (
                        <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                    )}
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium dark:text-gray-200">Note</label>
                    <textarea
                        rows="3"
                        value={form.note}
                        onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                        className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded"
                    />
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
                </div>
            </div>
        </div>
    );
}
