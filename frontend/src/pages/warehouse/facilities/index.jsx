import React, { useState } from 'react';
import Sidebar from '../../../components/warehouse/Sidebar';
import AddFacilityModal from './add';
import EditFacilityModal from './edit';
import ViewFacilityModal from './view';
import DeleteFacilityModal from './delete';

const StorageTypeIcon = ({ type }) => {
  const icons = {
    dry: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    cold: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
      </svg>
    ),
    blast: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    modular: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  };
  return icons[type] || icons.dry;
};

const storageTypes = [
  { value: '', label: 'All Types' },
  { value: 'dry', label: 'Dry Storage' },
  { value: 'cold', label: 'Cold Storage' },
  { value: 'blast', label: 'Blast Freezing' },
  { value: 'modular', label: 'Modular Storage' },
];

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: 'Available' },
  { value: 'closed', label: 'Fully Occupied' },
  { value: 'maintenance', label: 'Under Maintenance' },
];

const warehouseOwnerFacilities = [
  {
    id: 1,
    name: "Central Cold Storage",
    address: "123 Industrial Park, Colombo",
    storageType: "cold",
    capacity: "5000 MT",
    availabilityStatus: "open",
    occupancyRate: 65,
    monthlyRevenue: "Rs. 2,50,000",
    bookings: 12,
    lastUpdated: "2 hours ago"
  },
  {
    id: 2,
    name: "Dry Goods Warehouse",
    address: "456 Commerce Street, Kandy",
    storageType: "dry",
    capacity: "8000 MT",
    availabilityStatus: "open",
    occupancyRate: 80,
    monthlyRevenue: "Rs. 3,20,000",
    bookings: 18,
    lastUpdated: "5 hours ago"
  },
  {
    id: 3,
    name: "Quick Freeze Facility",
    address: "789 Port Road, Galle",
    storageType: "blast",
    capacity: "2000 MT",
    availabilityStatus: "maintenance",
    occupancyRate: 0,
    monthlyRevenue: "Rs. 0",
    bookings: 0,
    lastUpdated: "1 day ago"
  }
];

const FacilitiesIndex = () => {
  const [facilities, setFacilities] = useState(warehouseOwnerFacilities);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ storageType: '', status: '' });

  const openModal = (facility, type) => {
    setSelectedFacility(facility);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedFacility(null);
    setModalType(null);
  };

  const handleAdd = (newFacility) => {
    const facilityWithExtras = {
      ...newFacility,
      id: Date.now(),
      lastUpdated: "Just now",
      occupancyRate: 0,
      monthlyRevenue: "Rs. 0",
      bookings: 0
    };
    setFacilities([facilityWithExtras, ...facilities]);
    closeModal();
  };

  const handleEdit = (updatedFacility) => {
    const facilityWithUpdate = {
      ...updatedFacility,
      lastUpdated: "Just now"
    };
    setFacilities(facilities.map(f => f.id === updatedFacility.id ? facilityWithUpdate : f));
    closeModal();
  };

  const handleDelete = () => {
    if (!selectedFacility) return;
    setFacilities(facilities.filter(f => f.id !== selectedFacility.id));
    closeModal();
  };

  const filteredFacilities = facilities.filter(f =>
    (f.name.toLowerCase().includes(search.toLowerCase()) ||
     f.address.toLowerCase().includes(search.toLowerCase())) &&
    (!filters.storageType || f.storageType === filters.storageType) &&
    (!filters.status || f.availabilityStatus === filters.status)
  );

  return (
    <div className="min-h-screen bg-white-50">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 z-30">
        <Sidebar />
      </div>

      {/* Main Content with left margin */}
      <main className="ml-64 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-green-900 flex items-center gap-2 mb-4">
              <span className="text-3xl lg:text-4xl">🏭</span> Facility Management
            </h1>
            <p className="text-green-700 text-sm">Manage your warehouse facilities and storage infrastructure.</p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-2xl shadow border border-green-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-green-800">Storage Facilities</h2>
                <p className="text-green-700 text-sm">Overview of your warehouse locations</p>
              </div>
              <button
                onClick={() => openModal(null, 'add')}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add New Facility
              </button>
            </div>

            {/* Search & Filter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search facilities..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50"
                />
              </div>
              
              <select
                className="px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50"
                value={filters.storageType}
                onChange={e => setFilters(f => ({ ...f, storageType: e.target.value }))}
              >
                {storageTypes.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <select
                className="px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50"
                value={filters.status}
                onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Facilities List */}
            <div className="space-y-4">
              {filteredFacilities.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-green-900 mb-2">No facilities found</h3>
                  <p className="text-green-700 mb-4">Start by adding your first warehouse facility</p>
                  <button
                    onClick={() => openModal(null, 'add')}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
                  >
                    Add Facility
                  </button>
                </div>
              ) : (
                filteredFacilities.map((facility) => (
                  <div
                    key={facility.id}
                    className="border border-green-200 rounded-xl p-6 hover:bg-green-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-xl border border-green-200">
                          <div className="text-green-600">
                            <StorageTypeIcon type={facility.storageType} />
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-bold text-green-900 text-lg">{facility.name}</h3>
                          <p className="text-sm text-green-700 mb-3 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {facility.address}
                          </p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                              <span className="text-green-600 font-medium">Capacity:</span>
                              <div className="font-bold text-green-900">{facility.capacity}</div>
                            </div>
                            <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                              <span className="text-green-600 font-medium">Occupancy:</span>
                              <div className="font-bold text-green-900">{facility.occupancyRate}%</div>
                            </div>
                            <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                              <span className="text-green-600 font-medium">Revenue:</span>
                              <div className="font-bold text-green-900">{facility.monthlyRevenue}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 ml-4">
                        <span className={`px-4 py-2 rounded-full text-xs font-bold border ${
                          facility.availabilityStatus === 'open' 
                            ? 'bg-green-100 text-green-800 border-green-300' 
                            : facility.availabilityStatus === 'closed'
                            ? 'bg-red-100 text-red-800 border-red-300'
                            : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                        }`}>
                          {facility.availabilityStatus === 'open' ? 'Available' : 
                           facility.availabilityStatus === 'closed' ? 'Full' : 'Maintenance'}
                        </span>

                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal(facility, 'view')}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openModal(facility, 'edit')}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit Facility"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openModal(facility, 'delete')}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete Facility"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

      {/* Modals */}
      {modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {modalType === 'add' && (
              <AddFacilityModal onAdd={handleAdd} onCancel={closeModal} />
            )}
            {modalType === 'view' && selectedFacility && (
              <ViewFacilityModal facility={selectedFacility} onClose={closeModal} />
            )}
            {modalType === 'edit' && selectedFacility && (
              <EditFacilityModal
                facility={selectedFacility}
                onSave={handleEdit}
                onCancel={closeModal}
              />
            )}
            {modalType === 'delete' && selectedFacility && (
              <DeleteFacilityModal
                facility={selectedFacility}
                onDelete={handleDelete}
                onCancel={closeModal}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilitiesIndex;