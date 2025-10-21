import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../../../API/client"; // FIX: Adjusted path depth to resolve compilation error
import { ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline'; // For loading/success icons

export default function ConfirmPickup() {
  const { id } = useParams();
  const { driverId } = useParams();
  const navigate = useNavigate();
  // Removed photo state: const [photo, setPhoto] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const updateData = {
        driverPickupConfirmed: true,
        status: 'in_transport', 
        driverPickupNote: note,
    };

    try {
        // 2. Call the general update endpoint
        await api.put(`/api/transport/acceptPickupDriver/${id}/${driverId}`);

        setSuccess(true);
        // 3. Navigate back to the assigned loads list
        setTimeout(() => {
            navigate('/transporter/assignedLoads/all');
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
        {/* Removed Photo Upload Section */}

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
