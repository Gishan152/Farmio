import { useState } from 'react';
import { useWarehouseContext } from '../../../Contexts/Warehouse/WarehouseContext';
import { PencilIcon, TrashIcon, EyeIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import LocationInput from '../../../Components/Common/LocationInput';
import { smartGeocode } from '../../../Utils/Geocoding';
import { useGoogleMaps } from '../../../Contexts/GoogleMapContext';

export default function FacilityManagement() {
    const { warehouses, loadWarehouses, addWarehouse, updateWarehouse, deleteWarehouse } = useWarehouseContext();
    const [editingWarehouse, setEditingWarehouse] = useState(null);
    const [viewingWarehouse, setViewingWarehouse] = useState(null);
    const [deletingWarehouse, setDeletingWarehouse] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [_submitLoading, setSubmitLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [_activeTab, setActiveTab] = useState('basic');
    
    // Form states for different sections
    const [supplierForm, setSupplierForm] = useState({ 
        name: '', 
        category: '', 
        contact: '', 
        email: '', 
        address: '' 
    });

    // Sample warehouses with capacity-based model
    const sampleWarehouses = [
        {
            id: 1,
            name: "Colombo Cold Storage A",
            address: "Industrial Zone, Colombo 15",
            city: "Colombo",
            storageType: "Cold Storage (0°C to 14°C)",
            temperatureMin: 2,
            temperatureMax: 8,
            totalCapacityKg: 5000, // Only total capacity in kg
            pricePerKg: 25,
            certifications: "HACCP, ISO 22000",
            status: "open",
            keeperName: "John Perera",
            keeperContact: "0771234567",
            keeperEmail: "john@coldstorage.lk"
        },
        {
            id: 2,
            name: "Kandy Dry Storage Facility",
            address: "Peradeniya Road, Kandy",
            city: "Kandy",
            storageType: "Dry Storage",
            temperatureMin: 15,
            temperatureMax: 25,
            totalCapacityKg: 4500, // Only total capacity in kg
            pricePerKg: 15,
            certifications: "Food Safety, GMP",
            status: "open",
            keeperName: "Saman Silva",
            keeperContact: "0719876543",
            keeperEmail: "saman@drystorage.lk"
        }
    ];

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        storageType: 'Cold Storage (0°C to 14°C)',
        temperatureMin: 0,
        temperatureMax: 14,
        totalCapacityKg: '', // Only total capacity in kg needed
        pricePerKg: '',
        certifications: '',
        photos: [],
        status: 'open',
        keeperName: '',
        keeperContact: '',
        keeperEmail: '',
        lat: null,
        lng: null,
        // Enhanced contact information
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        // Operational details
        operatingHours: '06:00 - 18:00',
        // Supplier contacts
        supplierContacts: [],
        // Security and access
        securityFeatures: '',
        accessControl: 'keycard',
        // Insurance and maintenance
        insuranceDetails: '',
        maintenanceSchedule: 'monthly',
        // Branding
        logo: '',
        displayName: '',
        warehouseCode: ''
    });

    const { apiKey } = useGoogleMaps();
    const [geocoding, setGeocoding] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Prevent negative price and capacity
        if ((name === 'pricePerKg' || name === 'totalCapacityKg') && value !== '' && parseFloat(value) < 0) return;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Auto-geocode city input and set lat/lng when possible
    const handleCityChange = async (e) => {
        const city = e.target.value;
        setFormData(prev => ({ ...prev, city }));
        
        // Auto-geocode when city is entered (at least 3 characters)
        if (city.length >= 3) {
            setGeocoding(true);
            try {
                const coords = await smartGeocode(city, apiKey);
                setFormData(prev => ({
                    ...prev,
                    lat: coords.lat,
                    lng: coords.lng
                }));
                showNotification(
                    `Coordinates found for ${city} (${coords.source === 'google_maps' ? 'Google Maps' : 'Database'})`,
                    'success'
                );
            } catch (error) {
                console.error('Geocoding failed:', error);
                showNotification(
                    'Could not find coordinates for this city. Please enter them manually.',
                    'info'
                );
            } finally {
                setGeocoding(false);
            }
        }
    };

    // Show notification helper
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    // Supplier Contact Management
    const _addSupplier = () => {
        if (supplierForm.name && supplierForm.category) {
            setFormData(prev => ({
                ...prev,
                supplierContacts: [...prev.supplierContacts, { ...supplierForm, id: Date.now() }]
            }));
            setSupplierForm({ name: '', category: '', contact: '', email: '', address: '' });
        }
    };

    const _removeSupplier = (id) => {
        setFormData(prev => ({
            ...prev,
            supplierContacts: prev.supplierContacts.filter(supplier => supplier.id !== id)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.name || !formData.address || !formData.city ||
            !formData.totalCapacityKg || !formData.pricePerKg ||
            !formData.keeperName || !formData.keeperContact || !formData.keeperEmail
        ) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        if (parseInt(formData.totalCapacityKg) <= 0) {
            showNotification('Total capacity must be a positive number', 'error');
            return;
        }

        if (parseFloat(formData.pricePerKg) < 0) {
            showNotification('Price per kg cannot be negative', 'error');
            return;
        }

        setSubmitLoading(true);
        try {
            const warehouseData = {
                name: formData.name,
                address: formData.address,
                city: formData.city,
                totalSlots: Math.ceil(parseInt(formData.totalCapacityKg) / 100), // Assume 100kg per slot
                capacityPerSlot: 100,
                totalCapacity: parseInt(formData.totalCapacityKg),
                pricePerKg: parseFloat(formData.pricePerKg),
                temperatureMin: parseInt(formData.temperatureMin) || 0,
                temperatureMax: parseInt(formData.temperatureMax) || 14,
                storageType: getStorageTypeEnum(formData.storageType),
                certifications: formData.certifications || '',
                status: formData.status.toUpperCase(),
                keeperName: formData.keeperName,
                keeperContact: formData.keeperContact,
                keeperEmail: formData.keeperEmail,
                latitude: formData.lat || null,
                longitude: formData.lng || null
            };

            if (editingWarehouse) {
                await updateWarehouse(editingWarehouse.id, warehouseData);
                setEditingWarehouse(null);
                showNotification('Warehouse updated successfully!', 'success');
            } else {
                await addWarehouse(warehouseData);
                showNotification('Warehouse added successfully!', 'success');
            }

            resetForm();
            setShowForm(false);
        } catch (error) {
            console.error('Error saving warehouse:', error);
            showNotification('Failed to save warehouse. Please try again.', 'error');
        } finally {
            setSubmitLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            address: '',
            city: '',
            storageType: 'Cold Storage (0°C to 14°C)',
            temperatureMin: 0,
            temperatureMax: 14,
            totalCapacityKg: '', // Only total capacity needed
            pricePerKg: '',
            certifications: '',
            photos: [],
            status: 'open',
            keeperName: '',
            keeperContact: '',
            keeperEmail: '',
            lat: null,
            lng: null,
            // Enhanced contact information
            contactName: '',
            contactPhone: '',
            contactEmail: '',
            // Operational details
            operatingHours: '06:00 - 18:00',
            // Supplier contacts
            supplierContacts: [],
            // Security and access
            securityFeatures: '',
            accessControl: 'keycard',
            // Insurance and maintenance
            insuranceDetails: '',
            maintenanceSchedule: 'monthly',
            // Branding
            logo: '',
            displayName: '',
            warehouseCode: ''
        });
        setActiveTab('basic');
    };

    // Helper function to convert display names to backend enum values
    const getStorageTypeEnum = (displayValue) => {
        switch (displayValue) {
            case 'Cold Storage (0°C to 14°C)':
                return 'COLD_STORAGE';
            case 'Freezer (-18°C to -10°C)':
                return 'FREEZER';
            case 'Dry Storage':
                return 'DRY_STORAGE';
            default:
                return 'DRY_STORAGE';
        }
    };

    // Helper function to convert backend enum values to display names
    const getStorageTypeDisplay = (enumValue) => {
        switch (enumValue) {
            case 'COLD_STORAGE':
                return 'Cold Storage (0°C to 14°C)';
            case 'FREEZER':
                return 'Freezer (-18°C to -10°C)';
            case 'DRY_STORAGE':
                return 'Dry Storage';
            default:
                return 'Dry Storage';
        }
    };

    // Helper function to get storage type icon and short name
    const getStorageTypeInfo = (enumValue) => {
        switch (enumValue) {
            case 'COLD_STORAGE':
                return { icon: '❄️', name: 'Cold' };
            case 'FREEZER':
                return { icon: '🧊', name: 'Freezer' };
            case 'DRY_STORAGE':
                return { icon: '🌡️', name: 'Dry' };
            default:
                return { icon: '🌡️', name: 'Dry' };
        }
    };

    const handleEdit = (warehouse) => {
        setFormData({
            ...warehouse,
            storageType: getStorageTypeDisplay(warehouse.storageType),
            status: warehouse.status?.toLowerCase() || 'open'
        });
        setEditingWarehouse(warehouse);
        setShowForm(true);
    };

    const handleDelete = (warehouse) => {
        setDeletingWarehouse(warehouse);
    };

    const confirmDelete = async () => {
        if (deletingWarehouse) {
            try {
                await deleteWarehouse(deletingWarehouse.id);
                setDeletingWarehouse(null);
                showNotification('Warehouse deleted successfully!', 'success');
            } catch (error) {
                console.error('Error deleting warehouse:', error);
                showNotification('Failed to delete warehouse. Please try again.', 'error');
            }
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

    // Handle search with debouncing
    const handleSearch = async (value) => {
        setSearchTerm(value);
        try {
            await loadWarehouses(value);
        } catch (error) {
            console.error('Search failed:', error);
        }
    };

    const displayWarehouses = warehouses.length > 0 ? warehouses : sampleWarehouses;

    const isModalOpen = showForm || viewingWarehouse || deletingWarehouse;

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <div className={`max-w-6xl mx-auto space-y-4 transition-all duration-300 ${isModalOpen ? 'backdrop-blur-sm' : ''}`}>
                {/* Compact Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Facility Management</h1>
                            <p className="text-gray-500 text-sm mt-1">Manage your warehouse facilities</p>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200 text-sm"
                        >
                            <PlusIcon className="h-4 w-4" />
                            Add Warehouse
                        </button>
                    </div>
                    
                    {/* Compact Search Bar */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search warehouses..."
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200 text-sm"
                        />
                    </div>
                </div>

                {/* Wide Warehouse Cards */}
                <div className="space-y-4">
                    {displayWarehouses.map((warehouse) => (
                        <div key={warehouse.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                            <div className="flex">
                                {/* Left Header Section */}
                                <div className="bg-gradient-to-br from-green-50 to-green-100 text-green-900 p-4 flex-shrink-0 w-64">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                                <span className="text-lg">🏭</span>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                            warehouse.status === 'open' 
                                                ? 'bg-emerald-400 text-emerald-900' 
                                                : warehouse.status === 'maintenance'
                                                ? 'bg-yellow-400 text-yellow-900'
                                                : 'bg-red-400 text-red-900'
                                        }`}>
                                            {warehouse.status.toUpperCase()}
                                        </span>
                                    </div>
                                    
                                    <h3 className="font-bold text-lg mb-2 truncate">
                                        {warehouse.name}
                                    </h3>
                                    <p className="text-green-900 text-sm flex items-center">
                                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        <span className="truncate">{warehouse.city}</span>
                                    </p>
                                </div>

                                {/* Main Content Area */}
                                <div className="flex-1 p-4 flex items-center">
                                    <div className="grid grid-cols-5 gap-4 w-full items-center">
                                        {/* Storage Type */}
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-semibold bg-green-50 text-green-700 border border-green-200">
                                                <span className="text-base">
                                                    {getStorageTypeInfo(warehouse.storageType).icon}
                                                </span>
                                                <span>{getStorageTypeInfo(warehouse.storageType).name}</span>
                                            </div>
                                            <span className="text-xs text-gray-500 mt-1 font-medium">
                                                {warehouse.temperatureMin}°C - {warehouse.temperatureMax}°C
                                            </span>
                                        </div>

                                        {/* Storage Capacity */}
                                        <div className="text-center">
                                            <div className="bg-white rounded-lg p-3 border border-blue-100">
                                                <div className="text-2xl font-bold text-blue-700">{warehouse.totalCapacityKg || warehouse.totalCapacity}</div>
                                                <div className="text-xs text-blue-600 font-medium">Storage Capacity</div>
                                                <div className="text-xs text-gray-500 font-medium">(kg)</div>
                                            </div>
                                        </div>

                                        {/* Dynamic Slots */}
                                        <div className="text-center">
                                            <div className="bg-white rounded-lg p-3 border border-purple-100">
                                                <div className="text-lg font-bold text-purple-700">Dynamic</div>
                                                <div className="text-xs text-purple-600 font-medium">Slot Creation</div>
                                                <div className="text-xs text-gray-500">On Demand</div>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="text-center">
                                            <div className="bg-white rounded-lg p-3 border border-green-200">
                                                <div className="text-2xl font-bold text-green-800">Rs{warehouse.pricePerKg}</div>
                                                <div className="text-xs text-green-700 font-medium">per kg</div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                onClick={() => handleView(warehouse)}
                                                className="bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 text-sm font-medium flex items-center space-x-1"
                                                title="View Details"
                                            >
                                                <EyeIcon className="h-4 w-4" />
                                                <span className="hidden sm:inline">View</span>
                                            </button>
                                            <button
                                                onClick={() => handleEdit(warehouse)}
                                                className="bg-green-400 text-white py-2 px-3 rounded-lg hover:bg-green-500 transition-all duration-200 transform hover:scale-105 text-sm font-medium flex items-center space-x-1"
                                                title="Edit"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                                <span className="hidden sm:inline">Edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(warehouse)}
                                                className="bg-gray-400 text-white py-2 px-3 rounded-lg hover:bg-gray-500 transition-all duration-200 transform hover:scale-105 text-sm font-medium"
                                                title="Delete"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Compact Empty State */}
                {displayWarehouses.length === 0 && (
                    <div className="text-center py-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <div className="text-4xl mb-3">🏭</div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Warehouses Found</h3>
                            <p className="text-gray-500 text-sm mb-4">
                                {searchTerm ? 'Try a different search term' : 'Start by adding your first warehouse'}
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 shadow-sm hover:shadow-md transition-all duration-200 text-sm"
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
                <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn overflow-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-scaleIn">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-5 rounded-t-2xl flex-shrink-0">
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

                        {/* Modal Body with Scroll */}
                        <div className="p-6 overflow-y-auto flex-1">
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
                                    <LocationInput
                                        value={formData.address}
                                        onChange={(address) => setFormData(prev => ({ ...prev, address }))}
                                        onLocationSelect={(locationData) => {
                                            console.log('Location selected:', locationData);
                                            setFormData(prev => ({
                                                ...prev,
                                                address: locationData.address,
                                                lat: locationData.lat,
                                                lng: locationData.lng,
                                                city: locationData.city || prev.city
                                            }));
                                        }}
                                        placeholder="Enter full address"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                        required
                                    />
                                    {formData.lat && formData.lng && (
                                        <p className="mt-1 text-xs text-green-600 bg-green-50 p-2 rounded border-l-4 border-green-400">
                                            📍 Coordinates: {formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}
                                        </p>
                                    )}
                                    {formData.address && !formData.lat && !formData.lng && (
                                        <p className="mt-1 text-xs text-yellow-600 bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                                            ⚠️ Manual address mode - coordinates not available
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        City *
                                        {geocoding && (
                                            <span className="ml-2 text-xs text-blue-600">
                                                🔍 Finding coordinates...
                                            </span>
                                        )}
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleCityChange}
                                        placeholder="Enter city name"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                        required
                                    />
                                    {formData.lat && formData.lng && (
                                        <p className="mt-1 text-xs text-green-600 bg-green-50 p-2 rounded border-l-4 border-green-400">
                                            📍 Coordinates: {formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}
                                        </p>
                                    )}
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
                                        <option value="Freezer (-18°C to -10°C)">Freezer (-18°C to -10°C)</option>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Total Storage Capacity (kg) *
                                    </label>
                                    <input
                                        type="number"
                                        name="totalCapacityKg"
                                        value={formData.totalCapacityKg}
                                        onChange={handleInputChange}
                                        placeholder="5000"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                        required
                                        min="1"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Total storage capacity in kilograms. Slots will be created dynamically based on customer requests.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per kg (Rs) *</label>
                                    <input
                                        type="number"
                                        name="pricePerKg"
                                        value={formData.pricePerKg}
                                        onChange={handleInputChange}
                                        placeholder="0.25"
                                        step="0.01"
                                        min="0"
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

                                {/* Keeper Details */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Keeper Name *</label>
                                    <input
                                        type="text"
                                        name="keeperName"
                                        value={formData.keeperName}
                                        onChange={handleInputChange}
                                        placeholder="Keeper's Name"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Keeper Contact Number *</label>
                                    <input
                                        type="text"
                                        name="keeperContact"
                                        value={formData.keeperContact}
                                        onChange={handleInputChange}
                                        placeholder="Contact Number"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Keeper Email *</label>
                                    <input
                                        type="email"
                                        name="keeperEmail"
                                        value={formData.keeperEmail}
                                        onChange={handleInputChange}
                                        placeholder="Email Address"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                        required
                                    />
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
                <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn overflow-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col animate-scaleIn">
                        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-5 rounded-t-2xl flex-shrink-0">
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
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <p className="text-lg font-semibold text-gray-900">{viewingWarehouse.name}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <p className="text-gray-900">{viewingWarehouse.address}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <p className="text-gray-900">{viewingWarehouse.city}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Storage Type</label>
                                    <p className="text-gray-900">{getStorageTypeDisplay(viewingWarehouse.storageType)}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Temperature Range</label>
                                    <p className="text-gray-900">{viewingWarehouse.temperatureMin}°C - {viewingWarehouse.temperatureMax}°C</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Storage Capacity</label>
                                    <p className="text-lg font-semibold text-blue-700">{viewingWarehouse.totalCapacityKg || viewingWarehouse.totalCapacity} kg</p>
                                </div>
                                <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Slot Management</label>
                                    <p className="text-lg font-semibold text-purple-700">Dynamic Creation</p>
                                    <p className="text-xs text-purple-600 mt-1">Slots created on customer request</p>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per kg</label>
                                    <p className="text-lg font-semibold text-green-600">Rs{viewingWarehouse.pricePerKg}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <p className="text-lg font-semibold text-gray-900 capitalize">{viewingWarehouse.status}</p>
                                </div>
                                <div className="md:col-span-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
                                    <p className="text-gray-900">{viewingWarehouse.certifications || 'None'}</p>
                                </div>
                                <div className="md:col-span-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Keeper</label>
                                    <p className="text-gray-900 font-semibold">{viewingWarehouse.keeperName || 'N/A'}</p>
                                    <p className="text-gray-900 text-sm">{viewingWarehouse.keeperContact || 'N/A'}</p>
                                    <p className="text-gray-900 text-sm">{viewingWarehouse.keeperEmail || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingWarehouse && (
                <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
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
                                        <span className="text-sm">{deletingWarehouse.city}</span>
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

            <style>{`
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

            {/* Custom Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 max-w-md w-full animate-fadeIn`}>
                    <div className={`rounded-lg shadow-lg p-4 flex items-center space-x-3 ${
                        notification.type === 'success' 
                            ? 'bg-green-500 text-white' 
                            : notification.type === 'error'
                            ? 'bg-red-500 text-white'
                            : 'bg-blue-500 text-white'
                    }`}>
                        <div className="flex-shrink-0">
                            {notification.type === 'success' && (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            {notification.type === 'error' && (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium">{notification.message}</p>
                        </div>
                        <button
                            onClick={() => setNotification(null)}
                            className="flex-shrink-0 text-white hover:text-gray-200 transition-colors"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}