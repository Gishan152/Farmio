import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/warehouse/Sidebar";
import PageHeader from "../../components/warehouse/PageHeader";

const initialProfile = {
  name: "Kithmini",
  email: "kithmini@example.com",
  phone: "077-123-4567",
  profilePic: "/Images/warehouse/user.jpg",
  location: "Colombo, Sri Lanka",
  role: "Warehouse Owner",
  memberSince: "2023-01-15",
};

const Profile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setEditing(false);
    // Save logic here (API call)
    alert("Profile updated!");
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
          title="Profile"
          subtitle="Manage your profile and account settings."
          user={{ name: profile.name, profilePic: profile.profilePic }}
        />
      </div>
      {/* Main Content */}
      <main className="flex-1 lg:ml-60 pt-[72px] p-6 lg:p-10 transition-all duration-300 mt-20">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow border border-green-100 p-8">
          {/* Profile Card */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
            <img
              src={profile.profilePic}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-green-200 object-cover shadow"
            />
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-green-900">{profile.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-green-700 font-medium">{profile.role}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500 text-sm">Member since {profile.memberSince}</span>
              </div>
              <div className="mt-4 flex flex-col gap-1 text-green-800">
                <span>
                  <span className="font-semibold">Email:</span> {profile.email}
                </span>
                <span>
                  <span className="font-semibold">Phone:</span> {profile.phone}
                </span>
                <span>
                  <span className="font-semibold">Location:</span> {profile.location}
                </span>
              </div>
              <div className="mt-4 flex gap-3">
                <Link
                  to="/warehouse/settings"
                  className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100 transition text-sm"
                >
                  Account Settings
                </Link>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
          {/* Edit Form */}
          {editing && (
            <form onSubmit={handleSave} className="space-y-6 border-t pt-8 mt-8">
              <h3 className="text-xl font-semibold text-green-900 mb-4">Edit Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;