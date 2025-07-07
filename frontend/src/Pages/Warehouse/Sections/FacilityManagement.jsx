import { useState } from 'react';
import { useWarehouseContext } from '../../../Contexts/Warehouse/WarehouseContext';
import { PencilIcon, TrashIcon, EyeIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function FacilityManagement() {
    const { warehouses, addWarehouse, updateWarehouse, deleteWarehouse } = useWarehouseContext();
    const [editingWarehouse, setEditingWarehouse] = useState(null);
    const [viewingWarehouse, setViewingWarehouse] = useState(null);
    const [deletingWarehouse, setDeletingWarehouse] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Sample warehouses for display
    const sampleWarehouses = [
        {
            id: 1,
            name: "Colombo Cold Storage A",
            address: "Industrial Zone, Colombo 15",
            latitude: 6.9271,
            longitude: 79.8612,
            storageType: "Cold Storage (0°C to 14°C)",
            temperatureMin: 2,
            temperatureMax: 8,
            totalSlots: 50,
            capacityPerSlot: 100,
            totalCapacity: 5000,
            pricePerKg: 0.25,
            certifications: "HACCP, ISO 22000",
            status: "open"
        },
        {
            id: 2,
            name: "Kandy Dry Storage Facility",
            address: "Peradeniya Road, Kandy",
            latitude: 7.2906,
            longitude: 80.6337,
            storageType: "Dry Storage",
            temperatureMin: 15,
            temperatureMax: 25,
            totalSlots: 30,
            capacityPerSlot: 150,
            totalCapacity: 4500,
            pricePerKg: 0.15,
            certifications: "Food Safety, GMP",
            status: "open"
        }
    ];

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        storageType: 'Cold Storage (0°C to 14°C)',
        temperatureMin: 0,
        temperatureMax: 14,
        totalSlots: '',
        capacityPerSlot: 100,
        totalCapacity: '',
        pricePerKg: '',
        certifications: '',
        photos: [],
        status: 'open'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.address || !formData.latitude || !formData.longitude || !formData.totalSlots || !formData.totalCapacity || !formData.pricePerKg) {
            alert('Please fill in all required fields');
            return;
        }

        const lat = parseFloat(formData.latitude);
        const lng = parseFloat(formData.longitude);
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            alert('Invalid GPS coordinates');
            return;
        }

        if (parseInt(formData.totalSlots) <= 0 || parseInt(formData.totalCapacity) <= 0) {
            alert('Slots and capacity must be positive numbers');
            return;
        }

        if (editingWarehouse) {
            updateWarehouse(editingWarehouse.id, formData);
            setEditingWarehouse(null);
        } else {
            addWarehouse(formData);
        }

        resetForm();
        setShowForm(false);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            address: '',
            latitude: '',
            longitude: '',
            storageType: 'Cold Storage (0°C to 14°C)',
            temperatureMin: 0,
            temperatureMax: 14,
            totalSlots: '',
            capacityPerSlot: 100,
            totalCapacity: '',
            pricePerKg: '',
            certifications: '',
            photos: [],
            status: 'open'
        });
    };

    const handleEdit = (warehouse) => {
        setFormData(warehouse);
        setEditingWarehouse(warehouse);
        setShowForm(true);
    };

    const handleDelete = (warehouse) => {
        setDeletingWarehouse(warehouse);
    };

    const confirmDelete = () => {
        if (deletingWarehouse) {
            deleteWarehouse(deletingWarehouse.id);
            setDeletingWarehouse(null);
        }
    };

    const handleView = (warehouse) => {
        setViewingWarehouse(warehouse);
    };

    const handleCancel = () => {
        setEditingWarehouse(null);
        setShowForm(false);
        resetForm();
    };

    const displayWarehouses = warehouses.length > 0 ? warehouses : sampleWarehouses;

    const filteredWarehouses = displayWarehouses.filter(warehouse =>
        warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        warehouse.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isModalOpen = showForm || viewingWarehouse || deletingWarehouse;

    return (
        <div className="p-6 bg-gray-50 min-h-screen ">
            <div className={`max-w-7xl mx-auto space-y-6 transition-all duration-300 ${isModalOpen ? 'backdrop-blur-sm' : ''}`}>
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Facility Management</h1>
                        <p className="text-gray-500 mt-1">Manage your warehouse facilities with ease</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Add Warehouse
                    </button>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search warehouses by name or address..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                        />
                    </div>
                </div>

                {/* Warehouse Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWarehouses.map((warehouse) => (
                        <div key={warehouse.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            {/* Card Header */}
                            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-5">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-1">{warehouse.name}</h3>
                                        <p className="text-green-100 text-sm flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            {warehouse.address}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        warehouse.status === 'open' 
                                            ? 'bg-green-400 text-white' 
                                            : warehouse.status === 'maintenance'
                                            ? 'bg-yellow-400 text-white'
                                            : 'bg-red-400 text-white'
                                    }`}>
                                        {warehouse.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 space-y-3">
                                {/* Storage Type */}
                                <div className="flex items-center justify-between">
                                    <span className={`px-2 py-1 text-sm font-medium rounded-md ${
                                        warehouse.storageType.includes('Cold') 
                                            ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                                    }`}>
                                        {warehouse.storageType}
                                    </span>
                                    <span className="text-sm text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded-md">
                                        {warehouse.temperatureMin}°C - {warehouse.temperatureMax}°C
                                    </span>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center p-3 bg-gray-50 rounded-md border border-gray-100">
                                        <p className="text-xl font-semibold text-gray-800">{warehouse.totalSlots}</p>
                                        <p className="text-xs text-gray-500">Total Slots</p>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-md border border-gray-100">
                                        <p className="text-xl font-semibold text-gray-800">{warehouse.totalCapacity}</p>
                                        <p className="text-xs text-gray-500">Capacity (kg)</p>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="text-center p-3 bg-green-50 rounded-md border border-green-100">
                                    <p className="text-xl font-semibold text-green-600">${warehouse.pricePerKg}</p>
                                    <p className="text-xs text-green-500">Per kg</p>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-center space-x-2 pt-3 border-t border-gray-100">
                                    <button
                                        onClick={() => handleView(warehouse)}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-all duration-200 hover:scale-110"
                                        title="View Details"
                                    >
                                        <EyeIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleEdit(warehouse)}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-all duration-200 hover:scale-110"
                                        title="Edit"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(warehouse)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-all duration-200 hover:scale-110"
                                        title="Delete"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredWarehouses.length === 0 && (
                    <div className="text-center py-12">
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-10">
                            <div className="text-5xl mb-4 animate-pulse">🏭</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">No Warehouses Found</h3>
                            <p className="text-gray-500 mb-6">
                                {searchTerm ? 'Try a different search term' : 'Start by adding your first warehouse'}
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                                >
                                    Add Your First Warehouse
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit Warehouse Modal */}
            {showForm && (
                <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-5 rounded-t-2xl">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">
                                    {editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
                                </h2>
                                <button
                                    onClick={handleCancel}
                                    className="text-white hover:text-gray-200 p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-all duration-200"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter warehouse name"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Enter full address"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude (GPS) *</label>
                                    <input
                                        type="number"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleInputChange}
                                        placeholder="6.9271"
                                        step="any"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude (GPS) *</label>
                                    <input
                                        type="number"
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleInputChange}
                                        placeholder="79.8612"
                                        step="any"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Storage Type</label>
                                    <select 
                                        name="storageType"
                                        value={formData.storageType}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                    >
                                        <option value="Cold Storage (0°C to 14°C)">Cold Storage (0°C to 14°C)</option>
                                        <option value="Dry Storage">Dry Storage</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Temperature Range (°C)</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="number"
                                            name="temperatureMin"
                                            value={formData.temperatureMin}
                                            onChange={handleInputChange}
                                            placeholder="Min"
                                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                        />
                                        <input
                                            type="number"
                                            name="temperatureMax"
                                            value={formData.temperatureMax}
                                            onChange={handleInputChange}
                                            placeholder="Max"
                                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Slots *</label>
                                    <input
                                        type="number"
                                        name="totalSlots"
                                        value={formData.totalSlots}
                                        onChange={handleInputChange}
                                        placeholder="50"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity per Slot (kg)</label>
                                    <input
                                        type="number"
                                        name="capacityPerSlot"
                                        value={formData.capacityPerSlot}
                                        onChange={handleInputChange}
                                        placeholder="100"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Capacity (kg) *</label>
                                    <input
                                        type="number"
                                        name="totalCapacity"
                                        value={formData.totalCapacity}
                                        onChange={handleInputChange}
                                        placeholder="5000"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per kg ($) *</label>
                                    <input
                                        type="number"
                                        name="pricePerKg"
                                        value={formData.pricePerKg}
                                        onChange={handleInputChange}
                                        placeholder="0.25"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
                                    <input
                                        type="text"
                                        name="certifications"
                                        value={formData.certifications}
                                        onChange={handleInputChange}
                                        placeholder="HACCP, ISO 22000, etc."
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select 
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                    >
                                        <option value="open">Open</option>
                                        <option value="closed">Closed</option>
                                        <option value="maintenance">Maintenance</option>
                                    </select>
                                </div>

                                <div className="col-span-full flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                                    >
                                        {editingWarehouse ? 'Update Warehouse' : 'Add Warehouse'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {viewingWarehouse && (
                <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full">
                        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-5 rounded-t-2xl">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold">Warehouse Details</h3>
                                <button
                                    onClick={() => setViewingWarehouse(null)}
                                    className="text-white hover:text-gray-200 p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-all duration-200"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <p className="text-lg font-semibold text-gray-900">{viewingWarehouse.name}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <p className="text-gray-900">{viewingWarehouse.address}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-1">GPS Coordinates</label>
                                <p className="text-gray-900">{viewingWarehouse.latitude}, {viewingWarehouse.longitude}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Storage Type</label>
                                <p className="text-gray-900">{viewingWarehouse.storageType}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature Range</label>
                                <p className="text-gray-900">{viewingWarehouse.temperatureMin}°C - {viewingWarehouse.temperatureMax}°C</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Slots</label>
                                <p className="text-lg font-semibold text-gray-900">{viewingWarehouse.totalSlots}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity per Slot</label>
                                <p className="text-gray-900">{viewingWarehouse.capacityPerSlot} kg</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Capacity</label>
                                <p className="text-lg font-semibold text-gray-900">{viewingWarehouse.totalCapacity} kg</p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price per kg</label>
                                <p className="text-lg font-semibold text-green-600">${viewingWarehouse.pricePerKg}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <p className="text-lg font-semibold text-gray-900 capitalize">{viewingWarehouse.status}</p>
                            </div>
                            <div className="md:col-span-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
                                <p className="text-gray-900">{viewingWarehouse.certifications || 'None'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingWarehouse && (
                <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-5 rounded-t-2xl">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold">Delete Warehouse</h3>
                                <button
                                    onClick={() => setDeletingWarehouse(null)}
                                    className="text-white hover:text-gray-200 p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-all duration-200"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="text-center mb-6">
                                <div className="text-red-600 text-5xl mb-3 animate-pulse">⚠️</div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                                    Are you sure you want to delete this warehouse?
                                </h4>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3">
                                    <p className="text-gray-600">
                                        <span className="font-semibold text-gray-900">{deletingWarehouse.name}</span>
                                        <br />
                                        <span className="text-sm">{deletingWarehouse.address}</span>
                                    </p>
                                </div>
                                <p className="text-sm text-red-600 font-medium bg-red-50 p-2 rounded-lg border border-red-100">
                                    This action cannot be undone. All warehouse data will be permanently deleted.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setDeletingWarehouse(null)}
                                    className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                                >
                                    Delete Warehouse
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes scaleIn {
                    from { 
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to { 
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out;
                }
                
                .animate-scaleIn {
                    animation: scaleIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                }
            `}</style>
        </div>
    );
}