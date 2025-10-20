// ConfirmPickup.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../../../API/client"; // Assuming your API client is available here
import { ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline'; // For loading/success icons

export default function ConfirmPickup() {
  const { id } = useParams(); // Load ID from route
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // 1. Build the payload for the LoadDetailsDto update
    const updateData = {
        // These fields are sent to the backend's LoadController -> updateLoad
        driverPickupConfirmed: true,
        status: 'in_transit', 
        driverPickupNote: note,
        // (Photo upload logic would be complex and is omitted for this simple example)
    };

    try {
        // 2. Call the general update endpoint
        await api.put(`/api/transport/updateLoad/${id}`, updateData);

        setSuccess(true);
        // 3. Navigate back to the assigned loads list
        setTimeout(() => {
            navigate('/transporter/assignedLoads');
        }, 1500);

    } catch (err) {
        console.error("Failed to confirm pickup:", err);
        setError("Failed to confirm pickup. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Confirm Pickup</h1>
      <p className="text-sm text-gray-600 mb-4">You’re about to confirm pickup for <strong>{id}</strong>.</p>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-xl">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Photo Proof (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="w-full border rounded p-2"
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="e.g., Package received from farmer"
            className="w-full border rounded p-2"
            disabled={loading}
          />
        </div>

        {/* Status Messages */}
        {loading && (
            <div className="flex items-center space-x-2 text-yellow-600 mb-4">
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                <span>Confirming pickup...</span>
            </div>
        )}
        {success && (
            <div className="flex items-center space-x-2 text-green-600 mb-4">
                <CheckCircleIcon className="h-5 w-5" />
                <span>Pickup Confirmed! Redirecting...</span>
            </div>
        )}
        {error && (
            <div className="text-red-500 mb-4">Error: {error}</div>
        )}

        <button
          type="submit"
          className={`px-6 py-2 rounded transition ${loading ? 'bg-gray-400' : 'bg-yellow-600 hover:bg-yellow-700 text-white'}`}
          disabled={loading || success}
        >
          {loading ? 'Processing...' : 'Confirm Pickup'}
        </button>
      </form>
    </div>
  );
}