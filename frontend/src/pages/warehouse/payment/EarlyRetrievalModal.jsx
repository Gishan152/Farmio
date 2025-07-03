import React, { useState } from "react";
import { api } from "../../../API/warehouse/payment";

const EarlyRetrievalModal = ({ booking, onClose, onApprove }) => {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(booking.showRejectInput || false);

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    try {
      await api("POST", `/bookings/${booking.id}/early-retrieval/reject`, { reason: rejectReason });
      onClose();
    } catch (error) {
      console.error("Error rejecting early retrieval:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="font-bold text-lg mb-2">Early Retrieval Request</div>
        <div className="mb-2">Booking ID: {booking.id}</div>
        <div className="mb-2">Farmer: {booking.farmer}</div>
        <div className="mb-2">Produce: {booking.produce}</div>
        <div className="mb-2">Duration: {booking.duration}</div>
        <div className="mb-2">Payment: Rs. {booking.payment}</div>
        <div className="mb-2">Refund to Farmer: Rs. {booking.refund}</div>
        <div className="mb-2">Receive: Rs. {(booking.payment - booking.refund).toLocaleString()}</div>
        {showRejectInput && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Rejection</label>
            <input
              type="text"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter reason"
            />
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={onApprove}
          >
            Approve
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => setShowRejectInput(!showRejectInput)}
          >
            {showRejectInput ? "Cancel Reject" : "Reject"}
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Message Farmer</button>
          {showRejectInput && (
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={handleReject}
            >
              Submit Rejection
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EarlyRetrievalModal;