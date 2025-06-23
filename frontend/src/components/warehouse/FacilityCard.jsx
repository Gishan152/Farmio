import React from 'react';

const FacilityCard = ({ facility, onView, onEdit, onDelete }) => {
  const occupancyPercent = facility.occupancyRate || 0;

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-bold text-green-800 mb-2" id={`facility-${facility.id}`}>
        {facility.name}
      </h3>
      <p className="text-gray-600 text-sm mb-1">{facility.address}</p>
      <p className="text-gray-600 text-sm mb-1">
        <strong>Type:</strong> {facility.storageType.charAt(0).toUpperCase() + facility.storageType.slice(1)}
      </p>
      <p className="text-gray-600 text-sm mb-1">
        <strong>Capacity:</strong> {facility.capacity} kg
      </p>
      <p className="text-gray-600 text-sm mb-3">
        <strong>Occupancy:</strong> {occupancyPercent}%
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className="bg-green-600 h-2.5 rounded-full"
          style={{ width: `${occupancyPercent}%` }}
        ></div>
      </div>
      <div className="flex gap-2 mt-auto">
        <button
          onClick={onView}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          aria-label={`View ${facility.name}`}
        >
          View
        </button>
        <button
          onClick={onEdit}
          className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
          aria-label={`Edit ${facility.name}`}
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          aria-label={`Delete ${facility.name}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default FacilityCard;