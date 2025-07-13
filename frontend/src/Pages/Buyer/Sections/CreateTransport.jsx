import { useState } from 'react';
import { useToast } from '../../../Contexts/ToastContext';

export default function CreateTransportJob() {
    const toast = useToast();
    const [form, setForm] = useState({
        providerId: '',
        pickupLocation: '',
        dropoffLocation: '',
        date: '',
        cargo: '',
        weight: '',
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const errs = {};
        if (!form.providerId) errs.providerId = 'Select a provider';
        if (!form.pickupLocation) errs.pickupLocation = 'Required';
        if (!form.dropoffLocation) errs.dropoffLocation = 'Required';
        if (!form.date) errs.date = 'Required';
        if (!form.cargo) errs.cargo = 'Required';
        if (!form.weight || isNaN(form.weight) || +form.weight <= 0) errs.weight = 'Positive weight required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (!validate()) return;
        // TODO: call API to create job
        toast.push('Transport job created successfully!');
        // navigate('/transport/jobs');
    };

    const handleChange = e => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h1 className="text-2xl font-semibold mb-4 dark:text-gray-100">Create Transport Job</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium dark:text-gray-200">Provider</label>
                    <select
                        name="providerId"
                        value={form.providerId}
                        onChange={handleChange}
                        className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select provider</option>
                        <option value="1">FastMove Logistics</option>
                        <option value="2">Trusty Transport</option>
                    </select>
                    {errors.providerId && <p className="text-red-500 text-sm mt-1">{errors.providerId}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium dark:text-gray-200">Pickup Location</label>
                    <input
                        name="pickupLocation"
                        value={form.pickupLocation}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                        placeholder="City, Country"
                    />
                    {errors.pickupLocation && <p className="text-red-500 text-sm mt-1">{errors.pickupLocation}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium dark:text-gray-200">Drop-off Location</label>
                    <input
                        name="dropoffLocation"
                        value={form.dropoffLocation}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                        placeholder="City, Country"
                    />
                    {errors.dropoffLocation && <p className="text-red-500 text-sm mt-1">{errors.dropoffLocation}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium dark:text-gray-200">Pickup Date</label>
                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium dark:text-gray-200">Cargo Description</label>
                    <input
                        name="cargo"
                        value={form.cargo}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                        placeholder="E.g., 10 bags of wheat"
                    />
                    {errors.cargo && <p className="text-red-500 text-sm mt-1">{errors.cargo}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium dark:text-gray-200">Weight (kg)</label>
                    <input
                        name="weight"
                        type="number"
                        value={form.weight}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                        placeholder="Enter total weight"
                    />
                    {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Create Job
                </button>
            </form>
        </div>
    );
}
