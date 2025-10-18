import React, { useState, useEffect } from 'react';
import { 
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { update } from 'lodash';
import api from '../../../API/client';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemType }) => {
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
              Delete {itemType === 'route' ? 'Route' : 'Availability Settings'}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete your current {itemType === 'route' ? 'route' : 'availability settings'}? 
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

export default function RoutePlanner() {
  const [mode, setMode] = useState('route');
  const [route, setRoute] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    days: [],
    frequency: 'Daily',
    timeFrom: '',
    timeTo: '',
  });
  const [availabilityData, setAvailabilityData] = useState({
    available: true,
    allowDetours: false,
    currentLocation: '',
    availableFrom: '',
    availableTo: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const routes = await transportService.getAllRoutesByProvider(1);
        const availabilities =
          await transportService.getAllAvailabilitiesByProvider(1);

        if (routes.data?.length > 0) {
          setRoute(routes.data[0]);
          setMode("route");
        } else if (availabilities.data?.length > 0) {
          setAvailabilityData(availabilities.data[0]);
          setMode("availability");
        } else {
          setIsEditing(true); // no data yet → start in edit mode
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  const validateRouteForm = () => {
    const newErrors = {};
    if (!formData.from) newErrors.from = 'Origin is required';
    if (!formData.to) newErrors.to = 'Destination is required';
    if (formData.days.length === 0) newErrors.days = 'At least one day must be selected';
    if (!formData.timeFrom) newErrors.timeFrom = 'Start time is required';
    if (!formData.timeTo) newErrors.timeTo = 'End time is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAvailabilityForm = () => {
    const newErrors = {};
    if (!availabilityData.currentLocation) newErrors.currentLocation = 'Current location is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (mode === 'route') {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    } else {
      setAvailabilityData({
        ...availabilityData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleDayToggle = (day) => {
    const updatedDays = formData.days.includes(day)
      ? formData.days.filter((d) => d !== day)
      : [...formData.days, day];
    setFormData({ ...formData, days: updatedDays });
  };

  const handleSaveRoute = async (e) => {
    e.preventDefault();
    if (!validateRouteForm()) return;

    const newRoute = {
      ...formData,
      providerId: 1,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    try{
      if(route){
        await transportService.updateRoute(route.id, newRoute);
      }else{
        await transportService.createRoute(newRoute);
      }
       const routes = await transportService.getAllRoutesByProvider(1);
      setRoute(routes.data[0]);
      setIsEditing(false);
      setMode("route");
    }catch(error){
      console.error("Error saving route:", error);
    }
    
  };

  const handleSaveAvailability = async (e) => {
  e.preventDefault();
  if (!validateAvailabilityForm()) return;

  const data = {
    ...availabilityData,
    providerId: 1,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  try {
    if (availabilityData.id) {
      await transportService.updateAvailability(availabilityData.id, data);
    } else {
      await transportService.createAvailability(data);
    }

    const availabilities = await transportService.getAllAvailabilitiesByProvider(1);
    setAvailabilityData(availabilities.data[0]);
    setIsEditing(false);
    setMode("availability");
  } catch (error) {
    console.error("Error saving availability:", error);
  }
};

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    setItemToDelete(mode);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
  try {
    if (itemToDelete === "route" && route) {
      await transportService.deleteRoute(route.id);
      setRoute(null);
    } else if (itemToDelete === "availability" && availabilityData?.id) {
      await transportService.deleteAvailability(availabilityData.id);
      setAvailabilityData({
        available: true,
        allowDetours: false,
        currentLocation: "",
        availableFrom: "",
        availableTo: "",
      });
    }
  } catch (error) {
    console.error("Error deleting item:", error);
  } finally {
    setShowDeleteModal(false);
  }
};
const handleDeleteCancel = () => {
  setShowDeleteModal(false);
  setItemToDelete(null);
};
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemType={itemToDelete}
      />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Route Planner</h1>
          <p className="text-gray-600 mt-2">
            {route || mode === 'availability' ? 'Manage your transportation settings' : 'Set up your transportation preferences'}
          </p>
          
          {/* Mode Selector */}
          <div className="mt-4 flex space-x-4">
            <button
              type="button"
              onClick={() => {
                setMode('route');
                setIsEditing(true);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                mode === 'route' && isEditing
                  ? 'bg-green-500 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Set Route
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('availability');
                setIsEditing(true);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                mode === 'availability' && isEditing
                  ? 'bg-green-500 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Set Availability
            </button>
          </div>
        </div>

        {/* Display Current Settings */}
        {!isEditing && (route || mode === 'availability') && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="px-6 py-4 bg-green-50 border-b border-green-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-green-100">
                    <MapPinIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      {route ? 'Your Current Route' : 'Your Availability Settings'}
                    </h2>
                    <p className="text-sm text-green-600">
                      Last updated: {new Date(route?.updatedAt || availabilityData.updatedAt).toLocaleDateString()}
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

            {/* Details */}
            <div className="p-6">
              {route ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="h-5 w-5 text-red-500" />
                      <span className="font-medium">{route.from}</span>
                      <span className="text-gray-400">→</span>
                      <MapPinIcon className="h-5 w-5 text-green-500" />
                      <span className="font-medium">{route.to}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-5 w-5 text-blue-500" />
                      <span>
                        {route.timeFrom} - {route.timeTo} ({route.frequency})
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Active Days</h3>
                      <div className="flex flex-wrap gap-2">
                        {weekdays.map((day) => (
                          <span
                            key={day}
                            className={`px-3 py-1 rounded-full text-sm ${
                              route.days.includes(day) 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                      {route.allowDetours && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Accepts Detours
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">{availabilityData.currentLocation}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        availabilityData.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {availabilityData.available ? 'Available' : 'Not Available'}
                      </span>
                      {availabilityData.allowDetours && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Accepts Detours
                        </span>
                      )}
                    </div>
                  </div>

                  {(availabilityData.availableFrom || availabilityData.availableTo) && (
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-5 w-5 text-purple-500" />
                      <span className="text-sm">
                        {availabilityData.availableFrom && `From: ${availabilityData.availableFrom}`}
                        {availabilityData.availableTo && ` To: ${availabilityData.availableTo}`}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Route Form */}
        {isEditing && mode === 'route' && (
          <form onSubmit={handleSaveRoute} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {route ? 'Edit Your Route' : 'Create New Route'}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From *</label>
                  <input
                    type="text"
                    name="from"
                    value={formData.from}
                    onChange={handleInputChange}
                    placeholder="Origin location"
                    className={`w-full px-4 py-2 border ${
                      errors.from ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                  />
                  {errors.from && <p className="mt-1 text-sm text-red-600">{errors.from}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To *</label>
                  <input
                    type="text"
                    name="to"
                    value={formData.to}
                    onChange={handleInputChange}
                    placeholder="Destination location"
                    className={`w-full px-4 py-2 border ${
                      errors.to ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                  />
                  {errors.to && <p className="mt-1 text-sm text-red-600">{errors.to}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Travel Days *</label>
                  {errors.days && <p className="mb-2 text-sm text-red-600">{errors.days}</p>}
                  <div className="flex flex-wrap gap-2">
                    {weekdays.map((day) => (
                      <button
                        type="button"
                        key={day}
                        onClick={() => handleDayToggle(day)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                          formData.days.includes(day)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                    <input
                      type="time"
                      name="timeFrom"
                      value={formData.timeFrom}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${
                        errors.timeFrom ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                    />
                    {errors.timeFrom && <p className="mt-1 text-sm text-red-600">{errors.timeFrom}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                    <input
                      type="time"
                      name="timeTo"
                      value={formData.timeTo}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${
                        errors.timeTo ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                    />
                    {errors.timeTo && <p className="mt-1 text-sm text-red-600">{errors.timeTo}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="allowDetours"
                    checked={formData.allowDetours}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-3 text-sm font-medium text-gray-700">Willing to Accept Detours</label>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setErrors({});
                }}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center space-x-2"
              >
                <CheckCircleIcon className="h-5 w-5" />
                <span>{route ? 'Update Route' : 'Save Route'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Availability Form */}
        {isEditing && mode === 'availability' && (
          <form onSubmit={handleSaveAvailability} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Set Your Availability
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Location *</label>
                  <input
                    type="text"
                    name="currentLocation"
                    value={availabilityData.currentLocation}
                    onChange={handleInputChange}
                    placeholder="Your current location"
                    className={`w-full px-4 py-2 border ${
                      errors.currentLocation ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                  />
                  {errors.currentLocation && <p className="mt-1 text-sm text-red-600">{errors.currentLocation}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Available From</label>
                    <input
                      type="date"
                      name="availableFrom"
                      value={availabilityData.availableFrom}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Available To</label>
                    <input
                      type="date"
                      name="availableTo"
                      value={availabilityData.availableTo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="available"
                    checked={availabilityData.available}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-3 text-sm font-medium text-gray-700">Currently Available</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="allowDetours"
                    checked={availabilityData.allowDetours}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-3 text-sm font-medium text-gray-700">Willing to Accept Detours</label>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setErrors({});
                }}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center space-x-2"
              >
                <CheckCircleIcon className="h-5 w-5" />
                <span>Save Availability</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}