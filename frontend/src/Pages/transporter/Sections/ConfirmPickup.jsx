import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ConfirmPickup({params}) {
  const { id } = useParams(); // Load ID from route
  const [photo, setPhoto] = useState(null);
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Pickup confirmed for Load ${id}`);
    // TODO: Send photo + note + timestamp to API
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
          />
        </div>

        <button
          type="submit"
          className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 transition"
        >
          Confirm Pickup
        </button>
      </form>
    </div>
  );
}
