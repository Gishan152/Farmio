import React, { useState } from "react";
import { 
  TruckIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  CalendarDaysIcon,
  HashtagIcon,
  StarIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/solid";

// Mock data for transport schedules
const transportSchedules = [
  {
    id: "TS001",
    transportProvider: {
      name: "Swift Logistics",
      profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.8,
      verified: true
    },
    fromAddress: "123 Farm Road, Colombo 03, Sri Lanka",
    toAddress: "456 Market Street, Kandy, Sri Lanka",
    fromGoogleLocation: "https://maps.google.com/maps?q=6.9271,79.8612",
    toGoogleLocation: "https://maps.google.com/maps?q=7.2906,80.6337",
    vehicleRegistration: "CAB-1234",
    vehicleType: "Refrigerated Truck",
    driver: {
      name: "Kamal Perera",
      phone: "+94 77 123 4567",
      email: "kamal@swiftlogistics.lk"
    },
    loadNumber: "LD-2025-001",
    scheduledDate: "2025-07-15",
    timeSlot: "1:00 PM - 2:00 PM",
    orderNumber: "ORD-2025-789",
    buyer: {
      name: "Green Valley Supermarket",
      contact: "+94 11 234 5678"
    },
    status: "Scheduled",
    estimatedDistance: "115 km",
    estimatedDuration: "2h 30min",
    cargo: {
      type: "Fresh Vegetables",
      weight: "450 kg",
      value: "Rs. 75,000"
    }
  },
  {
    id: "TS002",
    transportProvider: {
      name: "Island Transport Co.",
      profilePicture: "https://randomuser.me/api/portraits/women/28.jpg",
      rating: 4.6,
      verified: true
    },
    fromAddress: "789 Plantation Ave, Nuwara Eliya, Sri Lanka",
    toAddress: "321 Wholesale Hub, Galle, Sri Lanka",
    fromGoogleLocation: "https://maps.google.com/maps?q=6.9497,80.7891",
    toGoogleLocation: "https://maps.google.com/maps?q=6.0329,80.217",
    vehicleRegistration: "NC-5678",
    vehicleType: "Cargo Van",
    driver: {
      name: "Saman Silva",
      phone: "+94 71 987 6543",
      email: "saman@islandtransport.lk"
    },
    loadNumber: "LD-2025-002",
    scheduledDate: "2025-07-16",
    timeSlot: "9:00 AM - 10:00 AM",
    orderNumber: "ORD-2025-456",
    buyer: {
      name: "Coastal Foods Ltd.",
      contact: "+94 91 345 6789"
    },
    status: "In Transit",
    estimatedDistance: "78 km",
    estimatedDuration: "1h 45min",
    cargo: {
      type: "Tea Leaves",
      weight: "200 kg",
      value: "Rs. 45,000"
    }
  },
  {
    id: "TS003",
    transportProvider: {
      name: "Express Cargo Solutions",
      profilePicture: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 4.4,
      verified: false
    },
    fromAddress: "567 Industrial Zone, Kurunegala, Sri Lanka",
    toAddress: "890 Distribution Center, Jaffna, Sri Lanka",
    fromGoogleLocation: "https://maps.google.com/maps?q=7.4863,80.3647",
    toGoogleLocation: "https://maps.google.com/maps?q=9.6615,80.0255",
    vehicleRegistration: "KU-9012",
    vehicleType: "Heavy Truck",
    driver: {
      name: "Ravi Wickramasinghe",
      phone: "+94 70 555 1234",
      email: "ravi@expresscargo.lk"
    },
    loadNumber: "LD-2025-003",
    scheduledDate: "2025-07-17",
    timeSlot: "6:00 AM - 7:00 AM",
    orderNumber: "ORD-2025-123",
    buyer: {
      name: "Northern Retail Chain",
      contact: "+94 21 456 7890"
    },
    status: "Delayed",
    estimatedDistance: "245 km",
    estimatedDuration: "4h 15min",
    cargo: {
      type: "Rice & Grains",
      weight: "800 kg",
      value: "Rs. 120,000"
    }
  },
  {
    id: "TS004",
    transportProvider: {
      name: "Reliable Movers",
      profilePicture: "https://randomuser.me/api/portraits/women/33.jpg",
      rating: 4.9,
      verified: true
    },
    fromAddress: "234 Coastal Road, Matara, Sri Lanka",
    toAddress: "678 Central Market, Anuradhapura, Sri Lanka",
    fromGoogleLocation: "https://maps.google.com/maps?q=5.9549,80.5550",
    toGoogleLocation: "https://maps.google.com/maps?q=8.3114,80.4037",
    vehicleRegistration: "MT-3456",
    vehicleType: "Climate Controlled Truck",
    driver: {
      name: "Nuwan Fernando",
      phone: "+94 75 888 2222",
      email: "nuwan@reliablemovers.lk"
    },
    loadNumber: "LD-2025-004",
    scheduledDate: "2025-07-18",
    timeSlot: "3:00 PM - 4:00 PM",
    orderNumber: "ORD-2025-567",
    buyer: {
      name: "Heritage Foods",
      contact: "+94 25 789 0123"
    },
    status: "Completed",
    estimatedDistance: "190 km",
    estimatedDuration: "3h 20min",
    cargo: {
      type: "Spices & Herbs",
      weight: "150 kg",
      value: "Rs. 95,000"
    }
  }
];

export default function TransportSchedulers() {
  const [expandedCard, setExpandedCard] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");

  const statusColors = {
    "Scheduled": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "In Transit": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    "Completed": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "Delayed": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    "Cancelled": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "In Transit":
        return <TruckIcon className="h-4 w-4" />;
      case "Completed":
        return <CheckBadgeIcon className="h-4 w-4" />;
      case "Delayed":
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const filteredSchedules = selectedStatus === "All" 
    ? transportSchedules 
    : transportSchedules.filter(schedule => schedule.status === selectedStatus);

  const toggleCardExpansion = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold mb-6 dark:text-gray-100">
              Transport Schedulers
            </h1>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredSchedules.length} transport schedules
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            {["All", "Scheduled", "In Transit", "Completed", "Delayed"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedStatus === status
                    ? "bg-green-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Transport Cards */}
        <div className="grid gap-6">
          {filteredSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={schedule.transportProvider.profilePicture}
                        alt={schedule.transportProvider.name}
                        className="h-12 w-12 rounded-full border-2 border-gray-200 dark:border-gray-600"
                      />
                      {schedule.transportProvider.verified && (
                        <CheckBadgeIcon className="h-4 w-4 text-blue-500 absolute -top-1 -right-1" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {schedule.transportProvider.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <StarIcon className="h-4 w-4 text-yellow-500" />
                        <span>{schedule.transportProvider.rating}</span>
                        <span>•</span>
                        <span>{schedule.vehicleType}</span>
                        <span>•</span>
                        <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {schedule.vehicleRegistration}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${statusColors[schedule.status]}`}>
                      {getStatusIcon(schedule.status)}
                      <span>{schedule.status}</span>
                    </span>
                    <button
                      onClick={() => toggleCardExpansion(schedule.id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      {expandedCard === schedule.id ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Route Information */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Route Details
                    </h4>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {schedule.estimatedDistance} • {schedule.estimatedDuration}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                        <div className="h-16 w-px bg-gray-300 dark:bg-gray-600 my-2"></div>
                        <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                      </div>
                      <div className="flex-1 space-y-6">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <MapPinIcon className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">From</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {schedule.fromAddress}
                            </p>
                            <a
                              href={schedule.fromGoogleLocation}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium"
                            >
                              View on Maps
                            </a>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <MapPinIcon className="h-4 w-4 text-red-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">To</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {schedule.toAddress}
                            </p>
                            <a
                              href={schedule.toGoogleLocation}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium"
                            >
                              View on Maps
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CalendarDaysIcon className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Schedule</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <div>{schedule.scheduledDate}</div>
                      <div className="font-medium text-green-600 dark:text-green-400">{schedule.timeSlot}</div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <HashtagIcon className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Load Details</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <div className="font-mono">{schedule.loadNumber}</div>
                      <div className="text-green-600 dark:text-green-400 font-medium">{schedule.orderNumber}</div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <UserIcon className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Buyer</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <div className="font-medium text-green-600 dark:text-green-400">{schedule.buyer.name}</div>
                      <div>{schedule.buyer.contact}</div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedCard === schedule.id && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 animate-in slide-in-from-top duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Driver Information */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
                          Driver Information
                        </h5>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {schedule.driver.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">Driver</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <PhoneIcon className="h-5 w-5 text-gray-400" />
                            <a
                              href={`tel:${schedule.driver.phone}`}
                              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                            >
                              {schedule.driver.phone}
                            </a>
                          </div>
                          <div className="flex items-center space-x-3">
                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                            <a
                              href={`mailto:${schedule.driver.email}`}
                              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                            >
                              {schedule.driver.email}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Cargo Information */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
                          Cargo Details
                        </h5>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {schedule.cargo.type}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Weight:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {schedule.cargo.weight}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Value:</span>
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">
                              {schedule.cargo.value}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSchedules.length === 0 && (
          <div className="text-center py-12">
            <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No transport schedules found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              No schedules match the selected filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}