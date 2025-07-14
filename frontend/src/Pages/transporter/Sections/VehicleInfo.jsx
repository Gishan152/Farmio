import React, { useState } from 'react';

export default function VehicleInfo() {
  const [vehicle, setVehicle] = useState({
    regNo: 'WP CAB-6573',
    type: 'Truck',
    kind: 'Mahindra Bolero',
    minLoad: 100,
    maxLoad: 1000,
    frontPhoto: 'https://via.placeholder.com/200x120?text=Front+View',
    sidePhoto: 'https://via.placeholder.com/200x120?text=Side+View',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle({ ...vehicle, [name]: value });
  };

  const handlePhotoChange = (e, view) => {
    const file = e.target.files[0];
    if (file) {
      const photoUrl = URL.createObjectURL(file);
      setVehicle({ ...vehicle, [view]: photoUrl });

      // TODO: upload to backend
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Vehicle Info:', vehicle);
    alert('Vehicle information updated successfully!');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Vehicle Information</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow border border-gray-100"
      >
        {/* Vehicle Details */}
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Registration Number</label>
            <input
              type="text"
              name="regNo"
              value={vehicle.regNo}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              readOnly // 🔒 Lock if vehicle already exists
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Vehicle Type</label>
            <select
              name="type"
              value={vehicle.type}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="Truck">Truck</option>
              <option value="Lorry">Lorry</option>
              <option value="Van">Van</option>
              <option value="Tuk Tuk">Tuk Tuk</option>
              <option value="Tractor">Tractor</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Vehicle Kind</label>
            <input
              type="text"
              name="kind"
              value={vehicle.kind}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Min Load (kg)</label>
              <input
                type="number"
                name="minLoad"
                value={vehicle.minLoad}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Max Load (kg)</label>
              <input
                type="number"
                name="maxLoad"
                value={vehicle.maxLoad}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Photos */}
        <div className="flex flex-col gap-6 items-center justify-start">
          {/* Front View */}
          <div className="text-center">
            <img
              src={vehicle.frontPhoto}
              alt="Front View"
              className="w-60 h-36 object-cover border rounded shadow mb-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handlePhotoChange(e, 'frontPhoto')}
              className="text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Front View</p>
          </div>

          {/* Side View */}
          <div className="text-center">
            <img
              src={vehicle.sidePhoto}
              alt="Side View"
              className="w-60 h-36 object-cover border rounded shadow mb-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handlePhotoChange(e, 'sidePhoto')}
              className="text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Side View</p>
          </div>
        </div>

        {/* Save Button */}
        <div className="md:col-span-2 flex justify-end pt-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Update Vehicle Info
          </button>
        </div>
      </form>
    </div>
  );
}
