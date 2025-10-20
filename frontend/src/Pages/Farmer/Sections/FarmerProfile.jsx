import React, { useState, useCallback } from "react";
import Profilepicture from "../../../Assets/Farmer/Profile Pictures/2.1.jpg";
import {
  UserIcon,
  MapPinIcon,
  CreditCardIcon,
  TagIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useUserContext } from "../../../Contexts/UserContext"; 


export default function FarmerProfilePage() {
    const {user} = useUserContext();
  const [currentTab, setCurrentTab] = useState("account");
  const [avatarUrl, setAvatarUrl] = useState(Profilepicture);
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [username, setUsername] = useState(user?.username || "Loading...");
  const [email, setEmail] = useState(user?.email || "Loading...");
  const [password, setPassword] = useState("••••••••");
  const [isEditing, setIsEditing] = useState({ username: false, email: false, password: false });
  const [farms, setFarms] = useState([
    { id: Date.now(), name: "Colombo Field", area: "6.9 acres", position: null, address: "" },
  ]);
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState(""); // Updated state
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({ type: "", details: "" });

  // Google Maps loader
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  // Modal states
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [newFarmIndex, setNewFarmIndex] = useState(null);
  const [draftPosition, setDraftPosition] = useState(null);

  // Profile picture handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/") && file.size < 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedFile(reader.result);
      reader.readAsDataURL(file);
    } else {
      alert("Please upload an image file less than 5MB.");
    }
  };

  const savePicture = () => {
    if (selectedFile) setAvatarUrl(selectedFile);
    setIsPictureModalOpen(false);
    setSelectedFile(null);
  };

  const deletePicture = () => {
    setAvatarUrl("/default-avatar.jpg");
    setIsPictureModalOpen(false);
  };

  // Account details handlers
  const saveField = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: false }));
  };

  // Farm handlers
  const confirmFarm = () => {
    if (newFarmIndex != null && draftPosition) {
      const address = prompt("Enter farm address:");
      setFarms((prev) => {
        const updated = [...prev];
        updated[newFarmIndex] = {
          ...updated[newFarmIndex],
          position: draftPosition,
          address,
        };
        return updated;
      });
    }
    setMapModalOpen(false);
    setDraftPosition(null);
    setNewFarmIndex(null);
  };

  const openMapForNew = () => {
    const id = Date.now();
    setFarms((prev) => [...prev, { id, name: "", area: "", position: null, address: "" }]);
    setNewFarmIndex(farms.length);
    setMapModalOpen(true);
  };

  const deleteFarm = (id) => setFarms((prev) => prev.filter((f) => f.id !== id));

  // Product handlers
  const addProduct = () => {
    if (newProductName.trim()) {
      setProducts((prev) => [...prev, { id: Date.now(), name: newProductName }]);
      setNewProductName("");
    }
  };

  const deleteProduct = (id) => setProducts((prev) => prev.filter((p) => p.id !== id));

  // Payment handlers
  const addPayment = () => {
    if (newPayment.type && newPayment.details) {
      setPayments((prev) => [...prev, { id: Date.now(), ...newPayment }]);
      setNewPayment({ type: "", details: "" });
    }
  };

  const deletePayment = (id) => setPayments((prev) => prev.filter((p) => p.id !== id));

  if (loadError) return <div className="text-red-500">Error loading maps</div>;
  if (!isLoaded) return <div className="text-gray-500">Loading maps...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl  ">My Profile</h1>
      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center space-x-4">
          <div className="relative group w-24 h-24">
            <img
              src={selectedFile || avatarUrl}
              alt="Profile"
              className="w-full h-full rounded-full object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105"
            />
            <label
              htmlFor="fileInput"
              className="absolute inset-0 flex items-center justify-center bg-black opacity-0 text-white text-sm font-medium opacity-0 group-hover:opacity-30 transition-opacity duration-200 cursor-pointer rounded-full"
            >
              Change 
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e)=>{handleFileChange;savePicture;}}
              className="hidden"
              id="fileInput"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: "account", label: "Account", icon: <UserIcon className="h-5 w-5 inline" /> },
              { key: "farms", label: "Farms", icon: <MapPinIcon className="h-5 w-5 inline" /> },
              { key: "products", label: "Products", icon: <TagIcon className="h-5 w-5 inline" /> },
              { key: "payments", label: "Payments", icon: <CreditCardIcon className="h-5 w-5 inline" /> },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setCurrentTab(tab.key)}
                className={`flex items-center gap-1 pb-2 ${
                  currentTab === tab.key
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                } transition`}
              >
                {tab.icon}
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {/* Account Tab */}
          {currentTab === "account" && (
            <div className="space-y-4">
              {[
                { label: "Username", value: username, setValue: setUsername, key: "username" },
                { label: "Email", value: email, setValue: setEmail, key: "email" },
                { label: "Password", value: password, setValue: setPassword, key: "password" },
              ].map((field) => (
                <div key={field.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{field.label}</p>
                    {isEditing[field.key] ? (
                      <input
                        type={field.key === "password" ? "password" : "text"}
                        value={field.value}
                        onChange={(e) => field.setValue(e.target.value)}
                        className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-600"
                      />
                    ) : (
                      <p className="mt-1 text-gray-800">{field.value}</p>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      isEditing[field.key]
                        ? saveField(field.key)
                        : setIsEditing((prev) => ({ ...prev, [field.key]: true }))
                    }
                    className="text-green-600 hover:underline flex items-center gap-1"
                  >
                    {isEditing[field.key] ? "Save" : <PencilIcon className="h-4 w-4" />}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Farms Tab */}
          {currentTab === "farms" && (
            <div className="space-y-4">
              {farms.length > 0 ? (
                <div className="h-96 w-full">
                  <GoogleMap
                    mapContainerStyle={{ height: "100%", width: "100%" }}
                    center={farms.find((f) => f.position)?.position || { lat: 7.8731, lng: 80.7718 }}
                    zoom={7}
                  >
                    {farms.map((farm) =>
                      farm.position ? <Marker key={farm.id} position={farm.position} /> : null
                    )}
                  </GoogleMap>
                </div>
              ) : (
                <p>No farms added yet.</p>
              )}
              <div className="space-y-2">
                {farms.map((farm, i) => (
                  <div
                    key={farm.id}
                    className="flex justify-between items-center border rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <div>
                      <div className="font-medium">{farm.address || "No location set"}</div>
                      {farm.position && (
                        <div className="text-sm text-gray-500">
                          Lat: {farm.position.lat.toFixed(4)}, Lng: {farm.position.lng.toFixed(4)}
                        </div>
                      )}
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          setNewFarmIndex(i);
                          setDraftPosition(farm.position);
                          setMapModalOpen(true);
                        }}
                        className="text-green-600 hover:underline text-sm mr-4"
                      >
                        {farm.position ? "Edit" : "Add"}
                      </button>
                      <button
                        onClick={() => deleteFarm(farm.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={openMapForNew}
                  className="mt-2 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition"
                >
                  Add New Location
                </button>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {currentTab === "products" && (
            <div className="space-y-4">
              {products.length === 0 ? (
                <p className="text-gray-500 text-center">No products added yet. Add your first product below.</p>
              ) : (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="flex justify-between items-center border rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))
              )}
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Product Name (e.g., Corn, Wheat)"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
                <button
                  onClick={addProduct}
                  className="mt-2 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition"
                >
                  Add Product
                </button>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {currentTab === "payments" && (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex justify-between items-center border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-medium">{payment.type}</p>
                    <p className="text-sm text-gray-500">{payment.details}</p>
                  </div>
                  <button
                    onClick={() => deletePayment(payment.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Payment Type (e.g., Bank Transfer)"
                  value={newPayment.type}
                  onChange={(e) => setNewPayment((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Details (e.g., Account Number)"
                  value={newPayment.details}
                  onChange={(e) => setNewPayment((prev) => ({ ...prev, details: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                />
                <button
                  onClick={addPayment}
                  className="mt-2 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition"
                >
                  Add Payment Option
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Picture Modal */}
      {isPictureModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 space-y-4 animate-fade-in">
            <h3 className="text-lg font-semibold">Update Profile Picture</h3>
            {selectedFile && (
              <img src={selectedFile} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsPictureModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={deletePicture}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
              <button
                onClick={savePicture}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {mapModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden w-3/4 h-3/4 flex flex-col animate-fade-in">
            <GoogleMap
              mapContainerStyle={{ flex: 1 }}
              center={draftPosition || { lat: 7.8731, lng: 80.7718 }}
              zoom={7}
              onClick={(e) => setDraftPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
            >
              {farms.map((farm, i) =>
                farm.position && i !== newFarmIndex ? (
                  <Marker key={farm.id} position={farm.position} />
                ) : (
                  draftPosition && <Marker key={farm.id} position={draftPosition} />
                )
              )}
            </GoogleMap>
            <div className="p-4 flex justify-end gap-2 border-t">
              <button
                onClick={() => setMapModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmFarm}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}