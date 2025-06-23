import React from "react";

const DeleteFacilityModal = ({ facility, onDelete, onCancel }) => (
  <div className="p-6">
    <h2 className="text-xl font-bold mb-4 text-red-700">Delete Facility</h2>
    
    <p className="text-gray-700 mb-6">
      Are you sure you want to delete <strong className="text-red-700">{facility.name}</strong>?
      <br />
      <span className="text-sm text-gray-500">This action cannot be undone.</span>
    </p>
    
    <div className="flex justify-end gap-3">
      <button
        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  </div>
);

export default DeleteFacilityModal;