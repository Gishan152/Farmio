import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useWebSocket from "../../../hooks/useWebSocket";
import Sidebar from "../../../components/warehouse/Sidebar";
import PageHeader from "../../../components/warehouse/PageHeader";
import AddFacilityModal from "./add";
import EditFacilityModal from "./edit";
import DeleteFacilityModal from "./delete";

const storageTypes = [
  { value: "", label: "All Types" },
  { value: "dry", label: "Dry Storage" },
  { value: "cold", label: "Cold Storage" },
  { value: "blast", label: "Blast Freezing" },
  { value: "modular", label: "Modular Storage" },
];

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "open", label: "Available" },
  { value: "closed", label: "Fully Occupied" },
  { value: "maintenance", label: "Under Maintenance" },
];

const sampleWarehouses = [
  {
    id: 1,
    name: "Colombo A",
    address: "123 Industrial Park, Colombo",
    storageType: "cold",
    capacity: "1000 kg",
    availabilityStatus: "open",
    occupancyRate: 75,
    bookings: 12,
    lastUpdated: "2 hours ago",
  },
  {
    id: 2,
    name: "Kandy B",
    address: "456 Commerce Street, Kandy",
    storageType: "dry",
    capacity: "1000 kg",
    availabilityStatus: "open",
    occupancyRate: 50,
    bookings: 18,
    lastUpdated: "5 hours ago",
  },
  {
    id: 3,
    name: "Quick Freeze Facility",
    address: "789 Port Road, Galle",
    storageType: "blast",
    capacity: "2000 MT",
    availabilityStatus: "maintenance",
    occupancyRate: 0,
    bookings: 0,
    lastUpdated: "1 day ago",
  }
];

const StorageTypeIcon = ({ type }) => {
  const icons = {
    dry: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
    cold: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" /></svg>,
    blast: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    modular: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  };
  return icons[type] || icons.dry;
};

const WarehousesIndex = () => {
  const navigate = useNavigate();
  const { notifications, clearNotification } = useWebSocket();
  const [warehouses, setWarehouses] = useState(sampleWarehouses);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ storageType: "", status: "" });
  const [isSingleWarehouse, setIsSingleWarehouse] = useState(sampleWarehouses.length === 1);

  const openModal = (warehouse, type) => {
    setSelectedWarehouse(warehouse);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedWarehouse(null);
    setModalType(null);
  };

  const handleAdd = async (newWarehouse) => {
    setWarehouses((prev) => [
      ...prev,
      { ...newWarehouse, id: Date.now(), lastUpdated: "Just now", occupancyRate: 0, bookings: 0 }
    ]);
    setIsSingleWarehouse(warehouses.length + 1 === 1);
    closeModal();
  };

  const handleEdit = async (updatedWarehouse) => {
    setWarehouses((prev) =>
      prev.map((w) => (w.id === updatedWarehouse.id ? { ...updatedWarehouse, lastUpdated: "Just now" } : w))
    );
    closeModal();
  };

  const handleDelete = async () => {
    if (!selectedWarehouse) return;
    setWarehouses((prev) => prev.filter((w) => w.id !== selectedWarehouse.id));
    setIsSingleWarehouse(warehouses.length - 1 === 1);
    closeModal();
  };

  const filteredWarehouses = warehouses.filter(
    (w) =>
      (w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.address.toLowerCase().includes(search.toLowerCase())) &&
      (!filters.storageType || w.storageType === filters.storageType) &&
      (!filters.status || w.availabilityStatus === filters.status)
  );

  return (
    <div className="min-h-screen bg-white-50">
      {/* Sidebar (normal size, fixed) */}
      <div className="fixed top-0 left-0 h-screen w-64 z-30">
        <Sidebar />
      </div>
      {/* Main Content with left margin */}
      <main className="ml-64 p-6 lg:p-8 mt-20">
        <div className="max-w-7xl mx-auto">
          {/* Notifications */}
          {notifications.length > 0 && (
            <div className="mb-4">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex items-center justify-between bg-green-100 border border-green-300 text-green-900 px-4 py-3 rounded-xl mb-2"
                  onClick={() => navigate("/warehouse/payments/history")}
                >
                  <span>{n.message}</span>
                  <button
                    onClick={() => clearNotification(n.id)}
                    className="ml-4 text-green-700 hover:text-green-900"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          {/* Header */}
            <div className="fixed top-0 left-60 right-0 z-20">
              <PageHeader
                title="Warehouses"
                subtitle="Manage your warehouses."
                user={{ name: "Kithmini", profilePic: "/alex.jpg" }}
              />
            </div>
          
           <div className="bg-white rounded-2xl shadow border border-green-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div /> 
              <button
                onClick={() => openModal(null, "add")}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl flex items-center gap-2 ml-auto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add New Warehouse
              </button>
            </div>
            {!isSingleWarehouse && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search warehouses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
                  />
                </div>
                <select
                  className="px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
                  value={filters.storageType}
                  onChange={(e) => setFilters((f) => ({ ...f, storageType: e.target.value }))}
                >
                  {storageTypes.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <select
                  className="px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
                  value={filters.status}
                  onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="space-y-4">
              {warehouses.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-bold text-green-900 mb-2">No warehouses found</h3>
                  <p className="text-green-700 mb-4">Start by adding your first warehouse</p>
                  <button
                    onClick={() => openModal(null, "add")}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
                  >
                    Add Warehouse
                  </button>
                </div>
              ) : isSingleWarehouse ? (
                <div className="border border-green-200 rounded-xl p-6 hover:bg-green-50 transition-all duration-200 shadow-sm hover:shadow-md">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-xl border border-green-200">
                        <StorageTypeIcon type={warehouses[0].storageType} />
                      </div>
                      <div>
                        <h3 className="font-bold text-green-900 text-lg">{warehouses[0].name}</h3>
                        <p className="text-sm text-green-700 mb-3 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {warehouses[0].address}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                            <span className="text-green-600 font-medium">Capacity:</span>
                            <div className="font-bold text-green-900">{warehouses[0].capacity}</div>
                          </div>
                          <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                            <span className="text-green-600 font-medium">Occupancy:</span>
                            <div className="font-bold text-green-900">{warehouses[0].occupancyRate}%</div>
                          </div>
                          <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                            <span className="text-green-600 font-medium">Bookings:</span>
                            <div className="font-bold text-green-900">{warehouses[0].bookings}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span
                        className={`px-4 py-2 rounded-full text-xs font-bold border ${
                          warehouses[0].availabilityStatus === "open"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : warehouses[0].availabilityStatus === "closed"
                            ? "bg-red-100 text-red-800 border-red-300"
                            : "bg-yellow-100 text-yellow-800 border-yellow-300"
                        }`}
                      >
                        {warehouses[0].availabilityStatus === "open" ? "Available" : warehouses[0].availabilityStatus === "closed" ? "Full" : "Maintenance"}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/warehouse/warehouse/${warehouses[0].id}`)}
                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => openModal(warehouses[0], "edit")}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Warehouse"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => openModal(warehouses[0], "delete")}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Warehouse"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        <button
                          onClick={() => navigate(`/warehouse/payment/details/${warehouses[0].id}`)}
                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                          title="View Payments"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                filteredWarehouses.map((warehouse) => (
                  <div
                    key={warehouse.id}
                    className="border border-green-200 rounded-xl p-6 hover:bg-green-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-xl border border-green-200">
                          <StorageTypeIcon type={warehouse.storageType} />
                        </div>
                        <div>
                          <h3 className="font-bold text-green-900 text-lg">{warehouse.name}</h3>
                          <p className="text-sm text-green-700 mb-3 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {warehouse.address}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                              <span className="text-green-600 font-medium">Capacity:</span>
                              <div className="font-bold text-green-900">{warehouse.capacity}</div>
                            </div>
                            <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                              <span className="text-green-600 font-medium">Occupancy:</span>
                              <div className="font-bold text-green-900">{warehouse.occupancyRate}%</div>
                            </div>
                            <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                              <span className="text-green-600 font-medium">Bookings:</span>
                              <div className="font-bold text-green-900">{warehouse.bookings}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <span
                          className={`px-4 py-2 rounded-full text-xs font-bold border ${
                            warehouse.availabilityStatus === "open"
                              ? "bg-green-100 text-green-800 border-green-300"
                              : warehouse.availabilityStatus === "closed"
                              ? "bg-red-100 text-red-800 border-red-300"
                              : "bg-yellow-100 text-yellow-800 border-yellow-300"
                          }`}
                        >
                          {warehouse.availabilityStatus === "open" ? "Available" : warehouse.availabilityStatus === "closed" ? "Full" : "Maintenance"}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/warehouse/warehouse/${warehouse.id}`)}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openModal(warehouse, "edit")}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit Warehouse"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openModal(warehouse, "delete")}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete Warehouse"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          <button
                            onClick={() => navigate(`/warehouse/payment/details/${warehouse.id}`)}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                            title="View Payments"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      {modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {modalType === "add" && <AddFacilityModal onAdd={handleAdd} onCancel={closeModal} />}
            {modalType === "edit" && selectedWarehouse && (
              <EditFacilityModal facility={selectedWarehouse} onSave={handleEdit} onCancel={closeModal} />
            )}
            {modalType === "delete" && selectedWarehouse && (
              <DeleteFacilityModal facility={selectedWarehouse} onDelete={handleDelete} onCancel={closeModal} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehousesIndex;