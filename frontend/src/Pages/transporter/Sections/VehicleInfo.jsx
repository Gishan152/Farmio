import React, { useState, useEffect, useCallback } from 'react';
// FIX: Resetting import paths to a common project structure depth (3 levels)
import {useUserContext} from '../../../Contexts/UserContext' 
import { 
  TruckIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
// FIX: Resetting import paths to a common project structure depth (3 levels)
import transportService from '../../../API/transportService'; 


const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
        <div className="flex items-start">
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">
              Delete Vehicle Information
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete your vehicle information? 
                This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default function VehicleInfo() {
  const { user } = useUserContext(); 
  // Ensure providerId is a number if the backend expects Long, otherwise pass as string
  const providerId = user?.id; 

  const [vehicle, setVehicle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); 
  
  const [formData, setFormData] = useState({
    regNo: '',
    type: '',
    kind: '',
    maxLoad: '',
  });
  const [errors, setErrors] = useState({});

  const loadVehicle = useCallback(async () => {
    if (!providerId) {
        setLoading(false);
        setVehicle(null);
        return;
    }
    
    try {
      setLoading(true);
      setError('');
      // Passing providerId as parameter for the service layer logic
      const vehicleData = await transportService.getVehicleByProvider(providerId); 
      
      if (vehicleData) {
        setVehicle(vehicleData);
      } else {
        setVehicle(null);
      }
    } catch (error) {
      console.error('Error loading vehicle:', error);
      setError('Failed to load vehicle data.');
      setVehicle(null);
    } finally {
      setLoading(false);
    }
  }, [providerId]);

  // COMBINED and cleaned up useEffect logic
  useEffect(() => {
    loadVehicle();
  }, [loadVehicle]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.regNo) newErrors.regNo = 'Registration number is required';
    if (!formData.type) newErrors.type = 'Vehicle type is required';
    if (!formData.kind) newErrors.kind = 'Vehicle kind is required';
    if (!formData.maxLoad) newErrors.maxLoad = 'Max load is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!providerId) {
        setError("User ID is missing. Cannot save.");
        return;
    }

    try {
      setLoading(true);
      setError('');
      
      // 🌟 ADDED CURRENT DATE/TIME HERE
      const now = new Date().toISOString(); 

      const vehicleData = {
        ...formData,
        providerId: Number(providerId), 
        updatedAt: now, // Send current date/time string to backend
        // Note: Backend should handle creation date (createdAt) if inserting new data
      };

      let savedVehicle;
      if (vehicle && vehicle.id) {
        // Update existing vehicle - passing the vehicle ID for the PUT endpoint
        savedVehicle = await transportService.updateVehicle(vehicle.id, vehicleData);
      } else {
        // Create new vehicle
        savedVehicle = await transportService.saveVehicle(vehicleData);
      }

      setVehicle(savedVehicle);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving vehicle:', err);
      // Use the service error message if available, otherwise generic
      const message = err.response?.data?.message || 'Failed to save vehicle. Please check your network and try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setFormData({
      regNo: vehicle.regNo,
      type: vehicle.type,
      kind: vehicle.kind,
      maxLoad: vehicle.maxLoad,
    });
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
  console.log("🧩 Delete button clicked!");
  console.log("vehicle =", vehicle);

  if (!vehicle || !vehicle.vehicleId) {
    console.warn("⚠️ No vehicle or vehicle.vehicleId found. Aborting delete.");
    return;
  }

  try {
    setLoading(true);
    setError('');
    console.log("Deleting vehicle with ID:", vehicle.vehicleId);
    await transportService.deleteVehicle(vehicle.vehicleId);
    console.log("✅ Vehicle deleted successfully");

    setVehicle(null);
    setFormData({
      regNo: '',
      type: '',
      kind: '',
      maxLoad: '',
    });
    setShowDeleteModal(false);
    setIsEditing(false);

  } catch (error) {
    console.error("❌ Error deleting vehicle:", error);
    setError('Failed to delete vehicle. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const vehicleTypes = [
    { value: 'Truck', label: '🚚 Truck' },
    { value: 'Lorry', label: '🚛 Lorry' },
    { value: 'Van', label: '🚐 Van' },
    { value: 'Tuk Tuk', label: '🛺 Tuk Tuk' },
    { value: 'Tractor', label: '🚜 Tractor' },
  ];
  
  if (loading) {
    return (
        <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
            <p className="text-xl font-medium text-gray-700">Loading vehicle information... 🚛</p>
        </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">My Vehicle Information</h1>
          <p className="text-gray-600 mt-2">
            {vehicle ? 'Manage your vehicle details' : 'Add your vehicle information'}
          </p>
        </div>
        
        {/* Error Display */}
        {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center font-medium">
                {error}
            </div>
        )}

        {/* Display Vehicle Info */}
        {vehicle && !isEditing && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="px-6 py-4 bg-green-50 border-b border-green-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-green-100">
                    <TruckIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">{vehicle.kind}</h2>
                    <p className="text-sm text-green-600">
                      Last updated: {vehicle.updatedAt 
                        ? new Date(vehicle.updatedAt).toLocaleDateString() + ' ' + new Date(vehicle.updatedAt).toLocaleTimeString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-1"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center space-x-1"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Vehicle Details - Consolidated into one column */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Registration Number</h3>
                    <p className="font-medium">{vehicle.regNo}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Vehicle Type</h3>
                    <p className="font-medium">
                      {vehicleTypes.find(t => t.value === vehicle.type)?.label || vehicle.type}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Vehicle Kind</h3>
                    <p className="font-medium">{vehicle.kind}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Maximum Load Capacity</h3>
                    <p className="font-medium">{vehicle.maxLoad} kg</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vehicle Form */}
        {(!vehicle || isEditing) && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {vehicle ? 'Edit Vehicle Information' : 'Add Vehicle Information'}
            </h2>

            {/* Simplified to a single column layout for inputs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    name="regNo"
                    value={formData.regNo}
                    onChange={handleInputChange}
                    placeholder="e.g., WP CAB-6573"
                    className={`w-full px-4 py-2 border ${
                      errors.regNo ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                  />
                  {errors.regNo && <p className="mt-1 text-sm text-red-600">{errors.regNo}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      errors.type ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                  >
                    <option value="">Select vehicle type</option>
                    {vehicleTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Kind *
                  </label>
                  <input
                    type="text"
                    name="kind"
                    value={formData.kind}
                    onChange={handleInputChange}
                    placeholder="e.g., Mahindra Bolero"
                    className={`w-full px-4 py-2 border ${
                      errors.kind ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                  />
                  {errors.kind && <p className="mt-1 text-sm text-red-600">{errors.kind}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Load Capacity (kg) *
                  </label>
                  <input
                    type="number"
                    name="maxLoad"
                    value={formData.maxLoad}
                    onChange={handleInputChange}
                    placeholder="e.g., 1000"
                    className={`w-full px-4 py-2 border ${
                      errors.maxLoad ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                  />
                  {errors.maxLoad && <p className="mt-1 text-sm text-red-600">{errors.maxLoad}</p>}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              {vehicle && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors duration-200 flex items-center space-x-2"
              >
                <CheckCircleIcon className="h-5 w-5" />
                <span>{vehicle ? 'Update Vehicle' : 'Save Vehicle'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
