import React from "react";

const LocationPicker = ({ value, onChange }) => (
  <input
    className="input input-bordered w-full"
    name="location"
    placeholder="Location (Map integration coming soon)"
    value={value}
    onChange={onChange}
    required
  />
);

export default LocationPicker;