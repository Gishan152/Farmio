import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const ReviewsRatings = () => {
  const [reviews, setReviews] = useState([
    {
      id: "REV-2025-001",
      orderId: "WO-2025-002",
      farmer: "Nuwara Eliya Fresh Co.",
      wasteType: "Vegetable Trimmings",
      transactionDate: "2025-01-06",
      myRating: 5,
      myReview: "Excellent quality waste material. Well organized pickup process and farmer was very cooperative.",
      farmerRating: 4,
      farmerReview: "Waste agent was punctual and professional. Payment was made promptly.",
      status: "Complete",
      tags: ["Quality Material", "On Time", "Professional"],
    },
    {
      id: "REV-2025-002",
      orderId: "WO-2025-005",
      farmer: "Galle Sugar Mills",
      wasteType: "Sugarcane Bagasse",
      transactionDate: "2025-01-06",
      myRating: 4,
      myReview: "Good quality bagasse, though location was a bit hard to find. Overall satisfied with the transaction.",
      farmerRating: 5,
      farmerReview: "Great waste agent! Very understanding about the location and paid quickly.",
      status: "Complete",
      tags: ["Good Quality", "Patient", "Quick Payment"],
    },
    {
      id: "REV-2025-003",
      orderId: "WO-2025-001",
      farmer: "Paddy Green Farms",
      wasteType: "Rice Straw Residue",
      transactionDate: "2025-01-08",
      myRating: 0,
      myReview: "",
      farmerRating: 0,
      farmerReview: "",
      status: "Pending Review",
      tags: [],
    },
    {
      id: "REV-2025-004",
      orderId: "WO-2025-003",
      farmer: "Lanka Coconut Estate",
      wasteType: "Coconut Husk Fiber",
      transactionDate: "2025-01-07",
      myRating: 3,
      myReview: "Material quality was okay but pickup was delayed due to weather. Farmer was understanding.",
      farmerRating: 4,
      farmerReview: "Agent handled the weather delay professionally and communicated well.",
      status: "Complete",
      tags: ["Weather Issues", "Good Communication"],
    },
    {
      id: "REV-2024-089",
      orderId: "WO-2024-089",
      farmer: "Matara Spice Gardens",
      wasteType: "Spice Processing Waste",
      transactionDate: "2024-12-28",
      myRating: 2,
      myReview: "Material was not as described. Had to negotiate price on site. Not ideal but resolved.",
      farmerRating: 3,
      farmerReview: "Had some miscommunication but agent was fair in the end.",
      status: "Complete",
      tags: ["Price Negotiation", "Miscommunication"],
    },
  ]);

  const [newReview, setNewReview] = useState({
    rating: 5,
    review: '',
    tags: []
  });

  const getStatusBadge = (status) => {
    const styles = {
      "Complete": "bg-green-100 text-green-800",
      "Pending Review": "bg-yellow-100 text-yellow-800",
      "Overdue": "bg-red-100 text-red-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const handleSubmitReview = (reviewId) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            myRating: newReview.rating,
            myReview: newReview.review,
            status: "Complete",
            tags: [...review.tags, ...newReview.tags]
          }
        : review
    ));
    setNewReview({ rating: 5, review: '', tags: [] });
  };

  const handleEditReview = (reviewId) => {
    const review = reviews.find(r => r.id === reviewId);
    setNewReview({
      rating: review.myRating,
      review: review.myReview,
      tags: []
    });
  };

  const averageRatingGiven = reviews
    .filter(r => r.myRating > 0)
    .reduce((sum, r) => sum + r.myRating, 0) / reviews.filter(r => r.myRating > 0).length || 0;

  const averageRatingReceived = reviews
    .filter(r => r.farmerRating > 0)
    .reduce((sum, r) => sum + r.farmerRating, 0) / reviews.filter(r => r.farmerRating > 0).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Reviews & Ratings</h1>
        <div className="flex space-x-2">
          <Button variant="outline">Export Reviews</Button>
          <Button>Request Feedback</Button>
        </div>
      </div>

      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Reviews</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{reviews.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">My Avg Rating Given</h3>
          <p className="text-2xl font-bold text-blue-600">
            {averageRatingGiven.toFixed(1)} ⭐
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">My Avg Rating Received</h3>
          <p className="text-2xl font-bold text-green-600">
            {averageRatingReceived.toFixed(1)} ⭐
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Pending Reviews</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {reviews.filter(r => r.status === "Pending Review").length}
          </p>
        </div>
      </div>

      {/* Pending Reviews Section */}
      {reviews.some(r => r.status === "Pending Review") && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Pending Reviews</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Please provide feedback for your recent transactions</p>
          </div>
          <div className="p-6 space-y-4">
            {reviews
              .filter(r => r.status === "Pending Review")
              .map((review) => (
                <div key={review.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/20">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{review.farmer}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{review.wasteType}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Transaction: {new Date(review.transactionDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(review.status)}`}
                    >
                      {review.status}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rate your experience (1-5 stars)
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setNewReview({...newReview, rating: star})}
                            className={`text-2xl ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ⭐
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Review
                      </label>
                      <textarea
                        value={newReview.review}
                        onChange={(e) => setNewReview({...newReview, review: e.target.value})}
                        placeholder="Share your experience with this farmer and transaction..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={() => handleSubmitReview(review.id)}>
                        Submit Review
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Reviews Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Transaction Reviews</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction Details</TableHead>
              <TableHead>Farmer</TableHead>
              <TableHead>My Rating & Review</TableHead>
              <TableHead>Farmer's Rating & Review</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{review.orderId}</div>
                    <div className="text-sm text-gray-600">{review.wasteType}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(review.transactionDate).toLocaleDateString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{review.farmer}</div>
                </TableCell>
                <TableCell>
                  <div>
                    {review.myRating > 0 ? (
                      <>
                        <div className="text-lg mb-1">{renderStars(review.myRating)}</div>
                        <div className="text-sm text-gray-600 max-w-xs">
                          {review.myReview}
                        </div>
                      </>
                    ) : (
                      <span className="text-yellow-600 text-sm">Pending Review</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    {review.farmerRating > 0 ? (
                      <>
                        <div className="text-lg mb-1">{renderStars(review.farmerRating)}</div>
                        <div className="text-sm text-gray-600 max-w-xs">
                          {review.farmerReview}
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-400 text-sm">No review yet</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {review.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(review.status)}`}
                  >
                    {review.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {review.status === "Pending Review" && (
                      <Button size="sm">
                        Add Review
                      </Button>
                    )}
                    {review.status === "Complete" && review.myRating > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditReview(review.id)}
                      >
                        Edit Review
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Rating Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Rating Distribution (Given)</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = reviews.filter(r => r.myRating === rating).length;
              const percentage = reviews.filter(r => r.myRating > 0).length > 0 
                ? (count / reviews.filter(r => r.myRating > 0).length) * 100 
                : 0;
              return (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm w-4">{rating}</span>
                  <span className="text-sm">⭐</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 bg-yellow-400 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Rating Distribution (Received)</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = reviews.filter(r => r.farmerRating === rating).length;
              const percentage = reviews.filter(r => r.farmerRating > 0).length > 0 
                ? (count / reviews.filter(r => r.farmerRating > 0).length) * 100 
                : 0;
              return (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm w-4">{rating}</span>
                  <span className="text-sm">⭐</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 bg-green-400 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsRatings;
