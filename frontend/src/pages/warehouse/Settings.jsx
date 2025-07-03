import React, { useState } from "react";
import Sidebar from "../../components/warehouse/Sidebar";
import PageHeader from "../../components/warehouse/PageHeader";

const initialSettings = {
  name: "Kithmini",
  email: "kithmini@example.com",
  phone: "077-123-4567",
  location: "Colombo, Sri Lanka",
  password: "",
  notifications: true,
  darkMode: false,
};

const Settings = () => {
  const [settings, setSettings] = useState(initialSettings);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Save logic here (API call)
    alert("Settings updated!");
  };

  return (
    <div className="min-h-screen bg-white-50 flex">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-60 z-30">
        <Sidebar />
      </div>
      {/* Header */}
      <div className="fixed top-0 left-60 right-0 z-20">
        <PageHeader
          title="Account Settings"
          subtitle="Update your personal information, security, and preferences."
          user={{ name: settings.name }}
        />
      </div>
      {/* Main Content */}
      <main className="flex-1 lg:ml-60 pt-[72px] p-6 lg:p-10 transition-all duration-300 mt-20">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow border border-green-100 p-8">
          <h2 className="text-2xl font-bold text-green-900 mb-6">Account Settings</h2>
          <form onSubmit={handleSave} className="space-y-8">
            {/* Personal Info */}
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={settings.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={settings.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={settings.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={settings.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
            {/* Security */}
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-4">Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Change Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={settings.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-green-500"
                      placeholder="New Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-2 text-xs text-green-700"
                      tabIndex={-1}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Preferences */}
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-4">Preferences</h3>
              <div className="flex flex-col md:flex-row gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={settings.notifications}
                    onChange={handleChange}
                  />
                  Email Notifications
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="darkMode"
                    checked={settings.darkMode}
                    onChange={handleChange}
                  />
                  Dark Mode
                </label>
              </div>
            </div>
            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Settings;