import React, { useState } from "react";
import {
  UserIcon,
  CameraIcon,
  CheckIcon,
  XMarkIcon,
  PencilIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  IdentificationIcon,
  BuildingOfficeIcon
} from "@heroicons/react/24/solid";

// Dummy API functions for demonstration (replace with your real API calls)
const uploadProfilePicture = async (file) => {
  // Simulate uploading and returning a new image URL
  return new Promise((resolve) => {
    setTimeout(() => resolve(URL.createObjectURL(file)), 1000);
  });
};
const deleteProfilePicture = async () => {
  // Simulate deleting and returning default image URL
  return new Promise((resolve) => {
    setTimeout(() => resolve("/default-avatar.jpg"), 500);
  });
};
const updateProfileData = async (data) => {
  // Simulate updating profile data
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 500);
  });
};

// Dummy user data for demonstration
const dummyUser = {
  firstName: "Nimal",
  lastName: "Diassanayaka",
  email: "nimal.diassanayaka@email.com",
  phone: "+1 234 567 890",
  address: "123 Main Street, Anuradhapura",
  city: "Anuradhapura",
  district: "Anuradhapura",
  province: "North Central",
  postalCode: "62704",
  bio: "Passionate warehouse owner with 10 years of experience in logistics.",
  profilePicture: "/default-avatar.jpg",
  warehouseName: "Green Storage",
  storageCapacity: "5000 tons",
  farmSize: "50 acres",
  farmType: "Organic",
  vehicleType: "Truck",
  licenseNumber: "ABC-1234"
};

export default function UserProfile({ userType = "Warehouse Owner" }) {
  // Use default avatar if not provided
  const [avatarUrl, setAvatarUrl] = useState(dummyUser.profilePicture || "/default-avatar.jpg");
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState({});
  const [loading, setLoading] = useState(false);

  // Add role-specific fields here
  const roleFields = {
    "Farmer": [
      { label: "Farm Size", field: "farmSize", type: "text", icon: MapPinIcon },
      { label: "Farm Type", field: "farmType", type: "text", icon: BuildingOfficeIcon }
    ],
    "Warehouse Owner": [
      { label: "Warehouse Name", field: "warehouseName", type: "text", icon: BuildingOfficeIcon },
      { label: "Storage Capacity", field: "storageCapacity", type: "text", icon: MapPinIcon }
    ],
    "Transporter": [
      { label: "Vehicle Type", field: "vehicleType", type: "text", icon: BuildingOfficeIcon },
      { label: "License Number", field: "licenseNumber", type: "text", icon: IdentificationIcon }
    ]
  };

  const [userProfile, setUserProfile] = useState({
    firstName: dummyUser.firstName || "",
    lastName: dummyUser.lastName || "",
    email: dummyUser.email || "",
    phone: dummyUser.phone || "",
    address: dummyUser.address || "",
    city: dummyUser.city || "",
    district: dummyUser.district || "",
    province: dummyUser.province || "",
    postalCode: dummyUser.postalCode || "",
    bio: dummyUser.bio || "",
    ...dummyUser
  });

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/") && file.size < 5 * 1024 * 1024) {
      setSelectedFile(file);
    } else {
      alert("Please upload an image file less than 5MB.");
    }
  };

  // Save new profile picture
  const savePicture = async () => {
    if (!selectedFile) {
      setIsPictureModalOpen(false);
      return;
    }
    setLoading(true);
    try {
      const newUrl = await uploadProfilePicture(selectedFile);
      setAvatarUrl(newUrl);
      setUserProfile((prev) => ({ ...prev, profilePicture: newUrl }));
      await updateProfileData({ ...userProfile, profilePicture: newUrl });
    } catch (err) {
      alert("Failed to upload image.");
    }
    setLoading(false);
    setIsPictureModalOpen(false);
    setSelectedFile(null);
  };

  // Delete profile picture
  const deletePicture = async () => {
    setLoading(true);
    try {
      const defaultUrl = await deleteProfilePicture();
      setAvatarUrl(defaultUrl);
      setUserProfile((prev) => ({ ...prev, profilePicture: defaultUrl }));
      await updateProfileData({ ...userProfile, profilePicture: defaultUrl });
    } catch (err) {
      alert("Failed to delete image.");
    }
    setLoading(false);
    setSelectedFile(null);
    setIsPictureModalOpen(false);
  };

  const cancelModal = () => {
    setSelectedFile(null);
    setIsPictureModalOpen(false);
  };

  const saveField = async (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: false }));
    setLoading(true);
    try {
      await updateProfileData(userProfile);
    } catch (err) {
      alert("Failed to update profile.");
    }
    setLoading(false);
  };

  const updateUserProfile = (field, value) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  // Profile sections with role-based fields
  const profileSections = [
    {
      title: "Personal Information",
      icon: IdentificationIcon,
      fields: [
        { label: "First Name", field: "firstName", type: "text", icon: UserIcon },
        { label: "Last Name", field: "lastName", type: "text", icon: UserIcon },
        { label: "Email Address", field: "email", type: "email", icon: EnvelopeIcon },
        { label: "Phone Number", field: "phone", type: "tel", icon: PhoneIcon },
        ...(roleFields[userType] || [])
      ]
    },
    {
      title: "Location Details",
      icon: MapPinIcon,
      fields: [
        { label: "City", field: "city", type: "text", icon: BuildingOfficeIcon },
        { label: "District", field: "district", type: "text", icon: MapPinIcon },
        { label: "Province", field: "province", type: "text", icon: MapPinIcon },
        { label: "Postal Code", field: "postalCode", type: "text", icon: MapPinIcon },
      ]
    }
  ];

  const renderField = (field) => (
    <div key={field.field} className="group">
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <field.icon className="h-4 w-4 text-emerald-600 mr-2" />
          {field.label}
        </label>
      </div>
      <div className="relative">
        {isEditing[field.field] ? (
          <div className="flex items-center space-x-2">
            <input
              type={field.type}
              value={userProfile[field.field] || ""}
              onChange={(e) => updateUserProfile(field.field, e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-gray-900 shadow-sm"
              placeholder={`Enter your ${field.label.toLowerCase()}`}
              disabled={loading}
            />
            <button
              onClick={() => saveField(field.field)}
              className="p-3 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-200 transition-all duration-200 shadow-md"
              disabled={loading}
            >
              <CheckIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsEditing((prev) => ({ ...prev, [field.field]: false }))}
              className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all duration-200 shadow-md"
              disabled={loading}
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="group flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl hover:border-emerald-300 hover:from-emerald-50 hover:to-green-50 transition-all duration-300 shadow-sm">
            <span className="text-gray-900 font-small">
              {userProfile[field.field] || <span className="text-gray-400 italic">Not provided</span>}
            </span>
            <button
              onClick={() => setIsEditing((prev) => ({ ...prev, [field.field]: true }))}
              className="opacity-0 group-hover:opacity-100 p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all duration-200"
              disabled={loading}
            >
              <PencilIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-inter">
      <div className="container max-w-6xl mx-auto px-4 py-10">
        {/* Hero Header */}
        <div className="relative bg-gradient-to-br from-green-100 via-emerald-100 to-green-200 rounded-2xl overflow-hidden mb-10 shadow-lg">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23047857' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          <div className="absolute top-10 left-10 w-24 h-24 bg-emerald-300/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-300/20 rounded-full blur-xl"></div>
          <div className="relative px-6 py-16">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Profile Picture */}
              <div className="relative group">
                <div className="relative">
                  <img
                    src={selectedFile ? URL.createObjectURL(selectedFile) : avatarUrl}
                    alt="Profile"
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-2xl cursor-pointer transition-all duration-300 group-hover:scale-105"
                    onClick={() => setIsPictureModalOpen(true)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                    <CameraIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full p-3 shadow-lg border-2 border-white">
                  <CameraIcon className="h-4 w-4 text-white" />
                </div>
              </div>
              {/* User Info */}
              <div className="text-gray-900 text-center md:text-left">
                <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full mb-4 border border-green-300/30">
                  <UserIcon className="w-4 h-4 text-emerald-600 mr-2" />
                  <span className="text-sm font-semibold text-gray-700 capitalize">
                    {userType.replace('-', ' ')}
                  </span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight text-gray-900">
                  {userProfile.firstName || userProfile.lastName
                    ? `${userProfile.firstName} ${userProfile.lastName}`.trim()
                    : "Complete Your Profile"
                  }
                </h1>
                {userProfile.email && (
                  <p className="text-gray-700 text-lg flex items-center justify-center md:justify-start mb-2">
                    <EnvelopeIcon className="h-5 w-5 mr-2 text-emerald-600" />
                    {userProfile.email}
                  </p>
                )}
                {userProfile.phone && (
                  <p className="text-gray-700 text-lg flex items-center justify-center md:justify-start">
                    <PhoneIcon className="h-5 w-5 mr-2 text-emerald-600" />
                    {userProfile.phone}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="grid gap-8">
          {/* Profile Sections */}
          {profileSections.map((section, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 border-b border-emerald-100">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mr-3 shadow-md">
                    <section.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.fields.map(renderField)}
                </div>
              </div>
            </div>
          ))}
          {/* Address Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 border-b border-emerald-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mr-3 shadow-md">
                  <MapPinIcon className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Address Information</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="group">
                {isEditing.address ? (
                  <div className="space-y-4">
                    <textarea
                      value={userProfile.address}
                      onChange={(e) => updateUserProfile("address", e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-none text-gray-900 shadow-sm"
                      placeholder="Enter your complete address"
                      disabled={loading}
                    />
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => saveField("address")}
                        className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 font-medium shadow-md"
                        disabled={loading}
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing((prev) => ({ ...prev, address: false }))}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="group flex items-start justify-between p-4 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl hover:border-emerald-300 hover:from-emerald-50 hover:to-green-50 transition-all duration-300 min-h-[120px] shadow-sm">
                    <p className="text-gray-900 font-medium flex-1 leading-relaxed">
                      {userProfile.address || <span className="text-gray-400 italic">No address provided</span>}
                    </p>
                    <button
                      onClick={() => setIsEditing((prev) => ({ ...prev, address: true }))}
                      className="opacity-0 group-hover:opacity-100 p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all duration-200 ml-4"
                      disabled={loading}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Bio Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 border-b border-emerald-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mr-3 shadow-md">
                  <UserIcon className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">About Me</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="group">
                {isEditing.bio ? (
                  <div className="space-y-4">
                    <textarea
                      value={userProfile.bio}
                      onChange={(e) => updateUserProfile("bio", e.target.value)}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-none text-gray-900 shadow-sm"
                      placeholder="Tell us about yourself, your farming experience, interests, etc."
                      disabled={loading}
                    />
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => saveField("bio")}
                        className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 font-medium shadow-md"
                        disabled={loading}
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing((prev) => ({ ...prev, bio: false }))}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="group flex items-start justify-between p-4 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl hover:border-emerald-300 hover:from-emerald-50 hover:to-green-50 transition-all duration-300 min-h-[140px] shadow-sm">
                    <p className="text-gray-900 font-medium flex-1 leading-relaxed">
                      {userProfile.bio || <span className="text-gray-400 italic">No bio provided. Share something about yourself!</span>}
                    </p>
                    <button
                      onClick={() => setIsEditing((prev) => ({ ...prev, bio: true }))}
                      className="opacity-0 group-hover:opacity-100 p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all duration-200 ml-4"
                      disabled={loading}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Profile Picture Modal */}
        {isPictureModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg space-y-6 transform transition-all duration-300 shadow-2xl">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Update Profile Picture</h3>
                <p className="text-gray-600">Choose a new profile picture to personalize your account</p>
              </div>
              {/* Current Image Preview */}
              <div className="relative">
                <img
                  src={selectedFile ? URL.createObjectURL(selectedFile) : avatarUrl}
                  alt="Current Profile"
                  className="w-full h-64 object-cover rounded-xl shadow-lg"
                />
                {selectedFile && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full p-2 shadow-lg">
                    <CheckIcon className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 mb-2 block">
                    Choose New Picture
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-center cursor-pointer hover:border-emerald-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    disabled={loading}
                  />
                </label>
                <p className="text-sm text-gray-500 text-center">
                  Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={cancelModal}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={deletePicture}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium"
                  disabled={loading}
                >
                  Remove Picture
                </button>
                <button
                  onClick={savePicture}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg"
                  disabled={loading}
                >
                  {loading ? "Saving..." : selectedFile ? 'Save New Picture' : 'Keep Current'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}