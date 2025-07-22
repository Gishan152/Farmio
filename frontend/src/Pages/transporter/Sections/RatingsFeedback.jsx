import React, { useEffect, useState } from 'react';
import { 
  StarIcon,
  UserIcon,
  MapPinIcon,
  ArrowPathIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

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
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <StarIcon 
          key={i} 
          className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
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
      ? Number((feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1))
    : 0;

  const filtered = feedback.filter(
    (f) =>
      (roleFilter === 'All' || f.role === roleFilter) &&
      f.rating >= minRating
  );

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return (
      <div className="flex items-center text-xs text-gray-500">
        <CalendarIcon className="h-3 w-3 mr-1" />
        <span>{`${year}-${month}-${day}`}</span>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-yellow-50 border border-yellow-100">
                <StarIcon className="h-6 w-6 text-yellow-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Ratings & Feedback</h1>
            </div>
            <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Average Rating:</span>
              <span className="text-xl font-bold text-green-600">
                {averageRating.toFixed(1)} <span className="text-gray-400">/5</span>
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              >
                <option value="All">All Roles</option>
                <option value="Farmer">Farmer</option>
                <option value="Buyer">Buyer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              >
                <option value={0}>All Ratings</option>
                <option value={1}>1 Star & Up</option>
                <option value={2}>2 Stars & Up</option>
                <option value={3}>3 Stars & Up</option>
                <option value={4}>4 Stars & Up</option>
                <option value={5}>Only 5 Stars</option>
              </select>
            </div>
            <div className="flex items-end justify-end">
              <p className="text-sm text-gray-500">
                Showing {filtered.length} of {feedback.length} feedback items
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Cards */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Feedback Found</h3>
            <p className="text-gray-500">
              {feedback.length === 0 
                ? "You haven't received any feedback yet." 
                : "No feedback matches your current filters."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-full bg-blue-50 border border-blue-100">
                        <UserIcon className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{item.commenter}</h3>
                        <span className="text-xs text-gray-500">{item.role}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <RatingStars rating={item.rating} />
                      <span className="text-xs text-gray-400 mt-1">Load: {item.loadId}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <MapPinIcon className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-gray-700">{item.from}</span>
                    <span className="text-gray-400">→</span>
                    <MapPinIcon className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">{item.to}</span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg mb-3">
                    <p className="text-sm italic text-gray-600">"{item.comment}"</p>
                  </div>

                  <div className="flex justify-between items-center">
                    {formatDate(item.date)}
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      <ArrowPathIcon className="h-4 w-4 mr-1" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}