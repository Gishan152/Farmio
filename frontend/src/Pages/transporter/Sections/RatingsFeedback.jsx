import React, { useEffect, useState } from 'react';

const mockFeedback = [
  {
    id: 1,
    loadId: 'LD-6101',
    from: 'Colombo',
    to: 'Kandy',
    commenter: 'Nimal Jayasena',
    role: 'Buyer',
    rating: 4,
    comment: 'Driver arrived on time and was very polite.',
    date: '2025-07-12',
  },
  {
    id: 2,
    loadId: 'LD-6102',
    from: 'Galle',
    to: 'Negombo',
    commenter: 'Sunil Perera',
    role: 'Farmer',
    rating: 5,
    comment: 'Smooth and safe delivery. Thank you!',
    date: '2025-07-09',
  },
  {
    id: 3,
    loadId: 'LD-6103',
    from: 'Matale',
    to: 'Kurunegala',
    commenter: 'Ruwan Silva',
    role: 'Buyer',
    rating: 3,
    comment: 'Slight delay but handled well.',
    date: '2025-07-07',
  },
];

function RatingStars({ rating }) {
  return (
    <div className="flex gap-0.5 text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <span key={i}>{i < rating ? '★' : '☆'}</span>
      ))}
    </div>
  );
}

export default function RatingsFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [roleFilter, setRoleFilter] = useState('All');
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    // Replace with real API call
    setFeedback(mockFeedback);
  }, []);

  const averageRating =
    feedback.length > 0
      ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
      : 'N/A';

  const filtered = feedback.filter(
    (f) =>
      (roleFilter === 'All' || f.role === roleFilter) &&
      f.rating >= minRating
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Ratings & Feedback</h1>

      {/* Summary */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold">⭐ Average Rating: {averageRating}</h2>
        </div>

        <div className="flex gap-4">
          {/* Filter by Role */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="All">All Roles</option>
            <option value="Farmer">Farmer</option>
            <option value="Buyer">Buyer</option>
          </select>

          {/* Filter by Rating */}
          <select
            value={minRating}
            onChange={(e) => setMinRating(parseInt(e.target.value))}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value={0}>All Ratings</option>
            <option value={5}>Only 5 Stars</option>
            <option value={4}>4 Stars & Up</option>
            <option value={3}>3 Stars & Up</option>
            <option value={2}>2 Stars & Up</option>
            <option value={1}>1 Star & Up</option>
          </select>
        </div>
      </div>

      {/* Feedback Cards */}
      {filtered.length === 0 ? (
        <p className="text-gray-600">No feedback matches the filters.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-xl shadow border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">
                  Load: <strong>{item.loadId}</strong>
                </span>
                <RatingStars rating={item.rating} />
              </div>

              <p className="text-sm text-gray-700 mb-2">
                <strong>From:</strong> {item.commenter} ({item.role})
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Route:</strong> {item.from} → {item.to}
              </p>

              <p className="text-sm italic text-gray-600 mb-1">"{item.comment}"</p>
              <p className="text-xs text-gray-400 text-right">{item.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
