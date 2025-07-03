import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const EditFacilityModal = ({ facility, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    ...facility,
    photos: facility.photos || [],
    documents: facility.documents || [],
  });
  const [errors, setErrors] = useState({});

  const { getRootProps: getPhotoProps, getInputProps: getPhotoInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (files) => setFormData({ ...formData, photos: [...formData.photos, ...files] }),
  });

  const { getRootProps: getDocProps, getInputProps: getDocInputProps } = useDropzone({
    accept: '.pdf,.doc,.docx',
    onDrop: (files) => setFormData({ ...formData, documents: [...formData.documents, ...files] }),
  });

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.address?.trim()) newErrors.address = 'Address is required';
    if (!formData.storageType) newErrors.storageType = 'Storage type is required';
    if (!formData.capacity?.trim()) newErrors.capacity = 'Capacity is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  const removePhoto = (index) => {
    setFormData({ 
      ...formData, 
      photos: formData.photos.filter((_, i) => i !== index) 
    });
  };

  const removeDocument = (index) => {
    setFormData({ 
      ...formData, 
      documents: formData.documents.filter((_, i) => i !== index) 
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Edit Facility</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Facility Name *
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter facility name"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <input
            type="text"
            value={formData.address || ''}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter facility address"
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GPS Location
          </label>
          <input
            type="text"
            value={formData.gpsLocation || ''}
            onChange={(e) => setFormData({ ...formData, gpsLocation: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter GPS coordinates"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Storage Type *
          </label>
          <select
            value={formData.storageType || ''}
            onChange={(e) => setFormData({ ...formData, storageType: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.storageType ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select storage type</option>
            <option value="dry">Dry Storage</option>
            <option value="cold">Cold Storage</option>
            <option value="blast">Blast Freezing</option>
            <option value="modular">Modular Agro-Storage</option>
          </select>
          {errors.storageType && <p className="text-red-500 text-xs mt-1">{errors.storageType}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Capacity *
          </label>
          <input
            type="text"
            value={formData.capacity || ''}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.capacity ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 1000 MT"
          />
          {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperature Range
            </label>
            <input
              type="text"
              value={formData.temperatureRange || ''}
              onChange={(e) => setFormData({ ...formData, temperatureRange: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., -18°C to 2°C"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Humidity Range
            </label>
            <input
              type="text"
              value={formData.humidityRange || ''}
              onChange={(e) => setFormData({ ...formData, humidityRange: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 85-90%"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Certifications
          </label>
          <input
            type="text"
            value={formData.certifications || ''}
            onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., HACCP, ISO 22000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Availability Status
          </label>
          <select
            value={formData.availabilityStatus || 'open'}
            onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="maintenance">Under Maintenance</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photos
          </label>
          <div
            {...getPhotoProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 cursor-pointer"
          >
            <input {...getPhotoInputProps()} />
            <p className="text-gray-500">Drag & drop photos here, or click to select</p>
          </div>
          {formData.photos.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo.preview || photo}
                    alt={`Photo ${index + 1}`}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Documents
          </label>
          <div
            {...getDocProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 cursor-pointer"
          >
            <input {...getDocInputProps()} />
            <p className="text-gray-500">Drag & drop documents here, or click to select</p>
          </div>
          {formData.documents.length > 0 && (
            <div className="mt-2">
              {formData.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded mb-1">
                  <span className="text-sm">{doc.name || `Document ${index + 1}`}</span>
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFacilityModal;