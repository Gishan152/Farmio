import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../../API/warehouse/payment";
import Sidebar from "../../../components/warehouse/Sidebar";

// Sample data for demo/testing
const sampleFacility = {
  id: 1,
  name: "Main Warehouse",
  address: "123 Main St, Colombo",
  gpsLocation: "6.9271° N, 79.8612° E",
  storageType: "dry",
  capacity: 1000,
  availabilityStatus: "open",
  occupancyRate: 65,
  lastUpdated: "2025-07-04 14:30",
  bookings: 12,
  photos: [
    "/images/warehouse/warehouse1.jpg"
  ]
};

const FacilityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [facility, setFacility] = useState(null);

  useEffect(() => {
    // For demo: use sampleFacility if API fails or for local testing
    const fetchFacility = async () => {
      try {
        const data = await api("GET", `/warehouses/${id}`);
        setFacility(data);
      } catch (error) {
        setFacility(sampleFacility);
        console.error("Error fetching facility, using sample data:", error);
      }
    };
    fetchFacility();
  }, [id]);

  if (!facility) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-red-700 mb-4">Facility Not Found</h2>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded">Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white-50">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-60 z-30">
        <Sidebar />
      </div>      
      {/* Main Content */}
      <main className="lg:ml-60 pt-[72px] pb-8 px-2 sm:px-6 lg:px-8 transition-all duration-300 min-h-[calc(100vh-72px)] flex flex-col">
        <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col justify-center">
          {/* Back link */}
          <button
            onClick={() => navigate("/warehouse/warehouse")}
            className="flex items-center text-green-700 hover:text-green-900 text-sm mb-6 font-semibold"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Warehouses
          </button>

          {/* Image */}
          {facility.photos && facility.photos.length > 0 && facility.photos[0] && (
            <div className="mb-6">
              <img
                src={facility.photos[0]}
                alt={facility.name}
                className="w-full h-64 object-cover rounded-2xl border border-gray-200 shadow-lg"
                onError={e => { e.target.style.display = "none"; }}
              />
            </div>
          )}

          {/* Details */}
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-2">
            <span className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </span>
            {facility.name}
          </h2>
          <div className="text-gray-700 mb-8">{facility.address}</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <div className="font-semibold text-gray-700 mb-2">Location</div>
              <div className="text-gray-800 font-medium">{facility.address}</div>
              {facility.gpsLocation && (
                <div className="text-sm text-gray-600 mt-1">GPS: {facility.gpsLocation}</div>
              )}
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-2">Storage Details</div>
              <div className="text-gray-800 font-medium capitalize">{facility.storageType} Storage</div>
              <div className="text-gray-800 mt-1">Capacity: {facility.capacity}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-2">Status</div>
              <span
                className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${
                  facility.availabilityStatus === "open"
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : facility.availabilityStatus === "closed"
                    ? "bg-red-100 text-red-800 border border-red-300"
                    : "bg-yellow-100 text-yellow-800 border border-yellow-300"
                }`}
              >
                {facility.availabilityStatus.charAt(0).toUpperCase() + facility.availabilityStatus.slice(1)}
              </span>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-2">Occupancy Rate</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      facility.occupancyRate > 80
                        ? "bg-gradient-to-r from-red-400 to-red-500"
                        : facility.occupancyRate > 60
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                        : "bg-gradient-to-r from-green-400 to-green-500"
                    }`}
                    style={{ width: `${facility.occupancyRate}%` }}
                  ></div>
                </div>
                <span className="font-bold text-gray-800 text-lg">{facility.occupancyRate}%</span>
              </div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-2">Last Updated</div>
              <div className="text-sm text-gray-600">{facility.lastUpdated}</div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate(`/warehouse/payments/details/${facility.id}`)}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              View Payments
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FacilityDetails;