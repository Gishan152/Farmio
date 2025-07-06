import React, { useState } from 'react';

export default function RoutePlanner() {
  const [route, setRoute] = useState({
    from: '',
    to: '',
    days: [],
    frequency: 'Daily',
    timeFrom: '',
    timeTo: '',
  });

  const [availability, setAvailability] = useState({
    available: true,
    allowDetours: false,
    currentLocation: '',
    availableFrom: '',
    availableTo: '',
  });

  const handleRouteChange = (e) => {
    setRoute({ ...route, [e.target.name]: e.target.value });
  };

  const handleAvailabilityChange = (e) => {
    const { name, type, checked, value } = e.target;
    setAvailability({ ...availability, [name]: type === 'checkbox' ? checked : value });
  };

  const handleDayToggle = (day) => {
    const updatedDays = route.days.includes(day)
      ? route.days.filter((d) => d !== day)
      : [...route.days, day];
    setRoute({ ...route, days: updatedDays });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Regular Route:', route);
    console.log('Availability:', availability);
    alert('Route preferences saved successfully!');
  };

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Route Planner</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Regular Route */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">Regular Route</h2>

          <div className="mb-4">
            <label className="block font-medium mb-1">From</label>
            <input
              type="text"
              name="from"
              value={route.from}
              onChange={handleRouteChange}
              placeholder="e.g., Anuradhapura"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">To</label>
            <input
              type="text"
              name="to"
              value={route.to}
              onChange={handleRouteChange}
              placeholder="e.g., Colombo"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Travel Days</label>
            <div className="flex flex-wrap gap-2">
              {weekdays.map((day) => (
                <label
                  key={day}
                  className={`px-3 py-1 rounded-full border text-sm cursor-pointer ${
                    route.days.includes(day) ? 'bg-green-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={route.days.includes(day)}
                    onChange={() => handleDayToggle(day)}
                    className="hidden"
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-medium mb-1">Start Time</label>
              <input
                type="time"
                name="timeFrom"
                value={route.timeFrom}
                onChange={handleRouteChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">End Time</label>
              <input
                type="time"
                name="timeTo"
                value={route.timeTo}
                onChange={handleRouteChange}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Frequency</label>
            <select
              name="frequency"
              value={route.frequency}
              onChange={handleRouteChange}
              className="w-full border p-2 rounded"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
            </select>
          </div>
        </div>

        {/* Availability Settings */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">Availability & Detours</h2>

          <div className="mb-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="available"
                checked={availability.available}
                onChange={handleAvailabilityChange}
              />
              <span className="font-medium">Currently Available</span>
            </label>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="allowDetours"
                checked={availability.allowDetours}
                onChange={handleAvailabilityChange}
              />
              <span className="font-medium">Willing to Accept Detours</span>
            </label>
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Current Location (if not regular route)</label>
            <input
              type="text"
              name="currentLocation"
              value={availability.currentLocation}
              onChange={handleAvailabilityChange}
              placeholder="e.g., Dambulla"
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block font-medium mb-1">Available From</label>
              <input
                type="date"
                name="availableFrom"
                value={availability.availableFrom}
                onChange={handleAvailabilityChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Available To</label>
              <input
                type="date"
                name="availableTo"
                value={availability.availableTo}
                onChange={handleAvailabilityChange}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="lg:col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
