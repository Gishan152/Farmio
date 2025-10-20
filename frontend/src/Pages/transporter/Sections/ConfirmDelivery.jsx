// ConfirmDelivery.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../../../API/client"; 
import { ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline'; 

export default function ConfirmDelivery() {
  const { id } = useParams();
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
        driverDeliveryConfirmed: true,
        status: 'awaiting_buyer', 
        driverDeliveryNote: note,
        // (Photo upload logic is omitted for this simple example)
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
        console.error("Failed to confirm delivery:", err);
        setError("Failed to confirm delivery. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Confirm Delivery</h1>
      <p className="text-sm text-gray-600 mb-4">You’re about to confirm delivery for <strong>{id}</strong>.</p>

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
            placeholder="e.g., Delivered to warehouse gate"
            className="w-full border rounded p-2"
            disabled={loading}
          />
        </div>

        {/* Status Messages */}
        {loading && (
            <div className="flex items-center space-x-2 text-blue-600 mb-4">
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                <span>Confirming delivery...</span>
            </div>
        )}
        {success && (
            <div className="flex items-center space-x-2 text-green-600 mb-4">
                <CheckCircleIcon className="h-5 w-5" />
                <span>Delivery Confirmed! Redirecting...</span>
            </div>
        )}
        {error && (
            <div className="text-red-500 mb-4">Error: {error}</div>
        )}

        <button
          type="submit"
          className={`px-6 py-2 rounded transition ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          disabled={loading || success}
        >
          {loading ? 'Processing...' : 'Confirm Delivery'}
        </button>
      </form>
    </div>
  );
}