import React from "react";

const StorageTypeSelector = ({ value, onChange }) => (
  <div className="flex gap-4">
    <label>
      <input
        type="radio"
        name="storageType"
        value="Cold"
        checked={value === "Cold"}
        onChange={onChange}
      />
      Cold
    </label>
    <label>
      <input
        type="radio"
        name="storageType"
        value="Dry"
        checked={value === "Dry"}
        onChange={onChange}
      />
      Dry
    </label>
  </div>
);

export default StorageTypeSelector;