import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/warehouse/Sidebar";
import EarlyRetrievalModal from "./earlyRetrievalModal";

// This mock data is for demonstration. In production, fetch by warehouse/payment ID.
const mockDetails = {
  id: 1,
  bookingId: 123,
  warehouse: "Colombo A",
  farmer: "Farmer A",
  produce: "Mangoes",
  quantity: 100,
  duration: 20,
  baseCost: 20000,
  buffer: 3000,
  baseFee: 2000,
  refund: 6000,
  received: 17000,
  status: "Paid",
  payhereLink: "https://payhere.lk/receipt/123",
  earlyRetrieval: {
    requested: true,
    status: "Pending",
    refund: 6000,
    received: 17000,
  },
};

const WarehousePaymentDetails = () => {
  // const { id } = useParams(); // warehouse/payment id from route
  const navigate = useNavigate();
  // In production, fetch payment details using id
  const details = mockDetails;
  const [showEarlyModal, setShowEarlyModal] = React.useState(false);

  return (
    <div className="min-h-screen bg-white-50 flex">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-green-700 underline hover:text-green-900"
        >
          Back to Payment History
        </button>
        <h2 className="text-2xl font-bold mb-4 text-green-900">
          Payment Details for Booking #{details.bookingId}
        </h2>
        <div className="bg-white rounded-xl shadow border p-6 mb-4">
          <div className="mb-2">
            <b>Warehouse:</b> {details.warehouse}
          </div>
          <div className="mb-2">
            <b>Farmer:</b> {details.farmer}
          </div>
          <div className="mb-2">
            <b>Produce:</b> {details.produce} ({details.quantity} kg)
          </div>
          <div className="mb-2">
            <b>Duration:</b> {details.duration} days
          </div>
          <div className="mb-2">
            <b>Status:</b> {details.status}
          </div>
          <div className="mb-2">
            <b>PayHere Receipt:</b>{" "}
            <a
              href={details.payhereLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 underline"
            >
              View Receipt
            </a>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl border p-6 mb-4">
          <h3 className="font-bold mb-2">Payment Breakdown</h3>
          <div>Base Cost: Rs. {details.baseCost}</div>
          <div>Buffer Payment: Rs. {details.buffer}</div>
          <div>Base Fee (non-refundable): Rs. {details.baseFee}</div>
          <div>Refund (if early retrieval): Rs. {details.refund}</div>
          <div className="font-bold mt-2">
            Total Received: Rs. {details.received}
          </div>
        </div>
        {details.earlyRetrieval?.requested && (
          <div className="bg-yellow-50 rounded-xl border p-6">
            <h3 className="font-bold mb-2">Early Retrieval Request</h3>
            <div>Status: {details.earlyRetrieval.status}</div>
            <div>Refund to Farmer: Rs. {details.earlyRetrieval.refund}</div>
            <div>Amount Received: Rs. {details.earlyRetrieval.received}</div>
            {details.earlyRetrieval.status === "Pending" && (
              <button
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => setShowEarlyModal(true)}
              >
                Handle Early Retrieval
              </button>
            )}
          </div>
        )}
        {showEarlyModal && (
          <EarlyRetrievalModal
            booking={{
              id: details.bookingId,
              farmer: details.farmer,
              produce: details.produce,
              duration: details.duration,
              payment: details.baseCost + details.buffer,
              refund: details.refund,
            }}
            onClose={() => setShowEarlyModal(false)}
            onApprove={() => {
              // handle approve logic here
              setShowEarlyModal(false);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default WarehousePaymentDetails;