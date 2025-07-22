
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRequestsContext } from '../../../Contexts/Buyer/BuyerRequestContext';
import { ArchiveBoxIcon, CalendarIcon, ArrowPathIcon, EyeIcon, ChatBubbleLeftRightIcon, ExclamationCircleIcon, ClipboardDocumentListIcon, GlobeAltIcon, UsersIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import api from '@/API/client';

export default function Requests() {
    const { requests, addRequest, fetchRequests, loading } = useRequestsContext();
    const [showModal, setShowModal] = useState(false);
    const addReq = req => addRequest({ id: requests.length, ...req });

    console.log("requets ======================== : ", requests)

    useEffect(() => {
        fetchRequests();
        // eslint-disable-next-line
    }, []);

    // Filters state
    const [filters, setFilters] = useState({
        crop: '',
        quality: '',
        repeat: '',
        visibility: '',
        search: ''
    });

    // Stat cards
    const stats = {
        total: requests.length,
        public: requests.filter(r => r.visibility === 'Public').length,
        verified: requests.filter(r => r.visibility === 'Verified farmers').length,
        regional: requests.filter(r => r.visibility === 'Regional only').length
    };

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
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-4 p-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-2">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Requests Placed</h1>
                            <p className="text-gray-600 mt-1 text-sm">View your crop requests and manage bids</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                        >
                            <ArrowPathIcon className="h-5 w-5" />
                            New Request
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Total Requests */}
                    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-1 bg-green-500 rounded-l-lg" />
                        <ClipboardDocumentListIcon className="h-7 w-7 text-green-500 mr-3 z-10" />
                        <div className="z-10">
                            <p className="text-xs font-medium text-gray-500">Total Requests</p>
                            <p className="text-lg font-bold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                    {/* Public */}
                    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-l-lg" />
                        <GlobeAltIcon className="h-7 w-7 text-blue-500 mr-3 z-10" />
                        <div className="z-10">
                            <p className="text-xs font-medium text-gray-500">Public</p>
                            <p className="text-lg font-bold text-gray-900">{stats.public}</p>
                        </div>
                    </div>
                    {/* Verified */}
                    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-1 bg-yellow-500 rounded-l-lg" />
                        <UsersIcon className="h-7 w-7 text-yellow-500 mr-3 z-10" />
                        <div className="z-10">
                            <p className="text-xs font-medium text-gray-500">Verified</p>
                            <p className="text-lg font-bold text-gray-900">{stats.verified}</p>
                        </div>
                    </div>
                    {/* Regional */}
                    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-1 bg-gray-400 rounded-l-lg" />
                        <EyeSlashIcon className="h-7 w-7 text-gray-500 mr-3 z-10" />
                        <div className="z-10">
                            <p className="text-xs font-medium text-gray-500">Regional</p>
                            <p className="text-lg font-bold text-gray-900">{stats.regional}</p>
                        </div>
                    </div>
                </div>

                {/* Filters Card (Crops style) */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Search by crop or notes..."
                                value={filters.search}
                                onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Crop</label>
                            <select
                                value={filters.crop}
                                onChange={e => setFilters(f => ({ ...f, crop: e.target.value }))}
                                className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">All Crops</option>
                                {CROP_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Quality</label>
                            <select
                                value={filters.quality}
                                onChange={e => setFilters(f => ({ ...f, quality: e.target.value }))}
                                className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">All Qualities</option>
                                {QUALITY_OPTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Repeat</label>
                            <select
                                value={filters.repeat}
                                onChange={e => setFilters(f => ({ ...f, repeat: e.target.value }))}
                                className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">All Repeat</option>
                                {REPEAT_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Visibility</label>
                            <select
                                value={filters.visibility}
                                onChange={e => setFilters(f => ({ ...f, visibility: e.target.value }))}
                                className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">All Visibility</option>
                                {VISIBILITY_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFilters({ crop: '', quality: '', repeat: '', visibility: '', search: '' })}
                            className="ml-auto px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                <NewRequestModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={addReq}
                />

                {/* Requests Table with loading spinner */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Request History</h2>
                    </div>
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                            <p className="mt-2 text-gray-600 text-sm">Loading requests...</p>
                        </div>
                    ) : (
                        <div className="p-4 overflow-x-auto">
                            {filteredRequests.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                    <ClipboardDocumentListIcon className="h-12 w-12 mb-2 text-gray-300" />
                                    <p className="text-lg font-semibold">No requests found</p>
                                    <p className="text-sm text-gray-400 mt-1">You haven't placed any requests yet.</p>
                                </div>
                            ) : (
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="p-2 text-left font-semibold">Request ID</th>
                                            <th className="p-2 text-left font-semibold">Crop</th>
                                            <th className="p-2 text-left font-semibold">Visibility</th>
                                            <th className="p-2 text-left font-semibold">Quantity</th>
                                            <th className="p-2 text-left font-semibold">Price Range</th>
                                            <th className="p-2 text-left font-semibold">Deadline</th>
                                            <th className="p-2 text-left font-semibold">State</th>
                                            <th className="p-2 text-left font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRequests.map(req => (
                                            <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="p-2 font-medium text-green-700">Req {req.id}</td>
                                                <td className="p-2">{req.crop} <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">{req.quality || 'Any'}</span></td>
                                                <td className="p-2">
                                                    {(() => {
                                                        let badgeClass = 'bg-gray-100 text-gray-700';
                                                        let icon = null;
                                                        if (req.visibility === 'Public') { badgeClass = 'bg-blue-100 text-blue-800'; icon = <GlobeAltIcon className="h-4 w-4 inline mr-1" />; }
                                                        else if (req.visibility === 'Verified farmers') { badgeClass = 'bg-yellow-100 text-yellow-800'; icon = <UsersIcon className="h-4 w-4 inline mr-1" />; }
                                                        else if (req.visibility === 'Regional only') { badgeClass = 'bg-gray-200 text-gray-800'; icon = <EyeSlashIcon className="h-4 w-4 inline mr-1" />; }
                                                        return <span className={`w-fit px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${badgeClass}`}>{icon}{req.visibility}</span>;
                                                    })()}
                                                </td>
                                                <td className="p-2">{req.quantity} {req.unitMeasurement}</td>
                                                <td className="p-2">Rs {req.priceRange?.min}–{req.priceRange?.max}/kg</td>
                                                <td className="p-2">{req.deadline}</td>
                                                <td className="p-2">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${req.state === 'OPEN' ? 'bg-green-100 text-green-700' : req.state === 'CLOSED' ? 'bg-gray-200 text-gray-700' : 'bg-red-100 text-red-700'}`}>{req.state}</span>
                                                </td>
                                                <td className="p-2">
                                                    <Link
                                                        to={`./${req.id}`}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 text-xs font-medium shadow"
                                                    >
                                                        <ChatBubbleLeftRightIcon className="h-4 w-4" />
                                                        View Bids
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>
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
        // repeat: 'One-time',
        notes: '',
        visibility: 'Public'
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

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
                // repeat: 'One-time',
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

    const handleSubmit = async () => {
        setApiError(null);
        const errs = validate();
        if (Object.keys(errs).length) return setErrors(errs);
        setLoading(true);
        try {
            const payload = {
                crop: form.crop,
                unitMeasurement: form.unitMeasurement,
                quantity: +form.quantity,
                quality: form.quality,
                priceMin: +form.priceMin,
                priceMax: +form.priceMax,
                location: form.locationOption === 'buyer' ? BUYER_LOCATION : form.customLocation,
                deadline: form.deadline,
                notes: form.notes,
                visibility: form.visibility,
                date: new Date().toISOString().slice(0, 10)
            };
            const res = await api.post('/api/order/buyer-requests', payload);
            onSave(res.data);
            onClose();
        } catch (err) {
            setApiError(err?.response?.data?.message || 'Failed to create request.');
        } finally {
            setLoading(false);
        }
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
                {apiError && <div className="text-red-500 text-sm mb-2">{apiError}</div>}
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
                    {/* Repeat request (commented out)
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
                    */}
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
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 text-sm" disabled={loading}>Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm disabled:opacity-60" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
}
