import React from "react";

const FacilityForm = ({
  form,
  onChange,
  onPhoto,
  onCert,
  onSubmit,
  onCancel,
  isEdit = false,
  children,
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <input className="input input-bordered w-full" name="name" placeholder="Facility Name" value={form.name} onChange={onChange} required />
    {/* LocationPicker can go here */}
    <input className="input input-bordered w-full" name="location" placeholder="Location" value={form.location} onChange={onChange} required />
    <input className="input input-bordered w-full" name="type" placeholder="Type" value={form.type} onChange={onChange} required />
    {/* StorageTypeSelector can go here */}
    <select className="input input-bordered w-full" name="storageType" value={form.storageType} onChange={onChange} required>
      <option value="">Select Storage Type</option>
      <option value="Cold">Cold</option>
      <option value="Dry">Dry</option>
    </select>
    <input className="input input-bordered w-full" name="capacity" placeholder="Capacity" value={form.capacity} onChange={onChange} required />
    <label className="flex items-center gap-2">
      <input type="checkbox" name="available" checked={form.available} onChange={onChange} />
      Available
    </label>
    <input type="file" accept="image/*" onChange={onPhoto} />
    <input type="file" accept=".pdf,.jpg,.png" onChange={onCert} multiple />
    {children}
    <div className="flex gap-2 mt-2">
      <button type="submit" className="btn btn-primary">{isEdit ? "Save" : "Add"}</button>
      <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
    </div>
  </form>
);

export default FacilityForm;