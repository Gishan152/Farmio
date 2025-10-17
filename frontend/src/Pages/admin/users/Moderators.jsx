import React, { useState, useEffect } from 'react';
import UserManagement from '../../../components/templates/UserManagement';
import moderatorService from '../../../API/moderatorService';

// Moderator icon
const ModeratorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

// Sample activity logs
const activityLogs = {
  1: [
    { date: "2023-06-10 13:45", action: "Content review", details: "Approved 12 product listings" },
    { date: "2023-06-10 10:22", action: "User report", details: "Handled complaint against farmer ID F-1023" },
    { date: "2023-06-09 15:30", action: "Content moderation", details: "Removed 3 inappropriate comments" },
    { date: "2023-06-08 11:15", action: "Support", details: "Responded to 8 user inquiries" }
  ],
  2: [
    { date: "2023-06-09 14:10", action: "Product review", details: "Verified 15 product specifications" },
    { date: "2023-06-08 09:45", action: "Quality control", details: "Flagged 3 products for review" },
    { date: "2023-06-07 16:20", action: "Product verification", details: "Approved 7 new product listings" }
  ]
};

const ModeratorManagement = () => {
  // State for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const [selectedModerator, setSelectedModerator] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [addModalActiveTab, setAddModalActiveTab] = useState('personal');
  const [moderators, setModerators] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // State for new moderator form
  const [newModerator, setNewModerator] = useState({
    name: '',
    nic: '',
    email: '',
    phone: '',
    address: '',
    role: 'Content Moderator',
    department: 'User Support',
    password: ''
  });

  // State for access permissions
  const [accessPermissions, setAccessPermissions] = useState({
    buyers: { view: false, edit: false, delete: false },
    farmers: { view: false, edit: false, delete: false },
    transportProviders: { view: false, edit: false, delete: false },
    warehouseOwners: { view: false, edit: false, delete: false },
    wasteManagement: { view: false, edit: false, delete: false },
    products: { view: false, edit: false, delete: false, approve: false },
    orders: { view: false, edit: false, cancel: false },
    payments: { view: false },
    reports: { view: false },
    content: { view: false, edit: false, delete: false }
  });

  // Generate random password
  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewModerator(prev => ({ ...prev, [name]: value }));
  };

  // Toggle permission
  const handlePermissionChange = (category, permission) => {
    setAccessPermissions(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [permission]: !prev[category][permission]
      }
    }));
  };

  // View details
  const handleViewModerator = (moderator) => {
    setSelectedModerator(moderator);
    setActiveTab('details');
    setShowViewModal(true);
    
    // If we don't already have activity logs for this moderator, fetch them
    if (!activityLogs[moderator.id]) {
      fetchModeratorActivityLogs(moderator.id);
    }
  };
  
  // Fetch activity logs for a moderator
  const fetchModeratorActivityLogs = async (moderatorId) => {
    setIsLoading(true);
    try {
      const logs = await moderatorService.getModeratorActivityLogs(moderatorId);
      setActivityLogs(prev => ({
        ...prev,
        [moderatorId]: logs
      }));
    } catch (err) {
      console.error("Error fetching activity logs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Edit moderator
  const handleEditModerator = (moderator) => {
    setSelectedModerator(moderator);
    setNewModerator({ ...moderator });
    setShowEditModal(true);
  };

  // Delete moderator
  const handleDeleteModerator = (moderator) => {
    setSelectedModerator(moderator);
    setShowDeleteModal(true);
  };
  
  // Handle password reset
  const handleResetPassword = (moderator) => {
    setSelectedModerator(moderator);
    setTempPassword('');
    setShowResetPasswordModal(true);
  };
  
  // Confirm password reset
  const confirmResetPassword = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await moderatorService.resetModeratorPassword(selectedModerator.id);
      const newTempPassword = response.temporaryPassword || generatePassword();
      setTempPassword(newTempPassword);
      setSuccessMessage('Password has been reset successfully. The moderator will need to change it upon next login.');
      
      // No need for timeout here as we want to show the download button in the modal
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to download password as a text file
  const downloadPasswordAsFile = (moderator, password) => {
    const content = `
TEMPORARY PASSWORD INFORMATION
-----------------------------
Name: ${moderator.name}
Email: ${moderator.email}
Role: ${moderator.role}
Department: ${moderator.department}
-----------------------------
TEMPORARY PASSWORD: ${password}
-----------------------------
This password must be changed on first login.
Generated on: ${new Date().toLocaleString()}
    `;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${moderator.name.replace(/\s+/g, '_')}_temp_password.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  // Submit add form
  const handleAddModerator = async (e) => {
    e.preventDefault();
    const generatedPassword = generatePassword();
    setIsLoading(true);
    setError('');
    
    try {
      // Create moderator via API
      const moderatorData = {
        ...newModerator,
        temporaryPassword: generatedPassword,
        permissions: accessPermissions,
        firstLogin: true
      };
      
      const response = await moderatorService.createModerator(moderatorData);
      
      // Set success message with a download button
      setSuccessMessage(`Moderator account created successfully! A one-time password has been generated. Click the button below to download the password as a text file.`);
      
      // Create a download button (will be shown as part of the success message)
      setTimeout(() => {
        const successMessageEl = document.querySelector('.bg-green-100');
        if (successMessageEl) {
          // Create download button container
          const buttonContainer = document.createElement('div');
          buttonContainer.className = 'mt-3 flex justify-center';
          
          // Create the download button
          const downloadButton = document.createElement('button');
          downloadButton.textContent = 'Download Password';
          downloadButton.className = 'px-4 py-2 bg-farmio text-white rounded hover:bg-farmio-dark focus:outline-none';
          downloadButton.onclick = () => downloadPasswordAsFile(moderatorData, generatedPassword);
          
          // Add button to container
          buttonContainer.appendChild(downloadButton);
          successMessageEl.appendChild(buttonContainer);
        }
      }, 100);
      
      // In production, password would also be sent via email
      
      // Set a longer timeout to allow time for downloading the password
      setTimeout(() => {
        setShowAddModal(false);
        setSuccessMessage('');
        resetForm();
        // Refresh moderator list
        fetchModerators();
      }, 15000); // 15 seconds to give enough time to download
    } catch (error) {
      console.error("Error creating moderator:", error);
      setError(error.response?.data?.message || 'Failed to create moderator account.');
      
      // For demo/development purposes, still show success even when API fails
      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        console.warn("Development mode: Showing success message despite API error");
        setSuccessMessage(`Moderator account created successfully! A one-time password has been generated. Click the button below to download the password as a text file.`);
        
        // Create a download button (will be shown as part of the success message)
        setTimeout(() => {
          const successMessageEl = document.querySelector('.bg-green-100');
          if (successMessageEl) {
            // Create download button container
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'mt-3 flex justify-center';
            
            // Create the download button
            const downloadButton = document.createElement('button');
            downloadButton.textContent = 'Download Password';
            downloadButton.className = 'px-4 py-2 bg-farmio text-white rounded hover:bg-farmio-dark focus:outline-none';
            downloadButton.onclick = () => downloadPasswordAsFile(moderatorData, generatedPassword);
            
            // Add button to container
            buttonContainer.appendChild(downloadButton);
            successMessageEl.appendChild(buttonContainer);
          }
        }, 100);
        
        setTimeout(() => {
          setShowAddModal(false);
          setSuccessMessage('');
          resetForm();
          fetchModerators();
        }, 15000); // 15 seconds
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setNewModerator({
      name: '',
      nic: '',
      email: '',
      phone: '',
      address: '',
      role: 'Content Moderator',
      department: 'User Support',
      password: ''
    });
    Object.keys(accessPermissions).forEach(category => {
      Object.keys(accessPermissions[category]).forEach(permission => {
        accessPermissions[category][permission] = false;
      });
    });
  };

  // Save edits
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await moderatorService.updateModerator(selectedModerator.id, newModerator);
      setSuccessMessage(`Moderator ${selectedModerator.name} has been updated successfully!`);
      
      setTimeout(() => {
        setShowEditModal(false);
        setSuccessMessage('');
        fetchModerators(); // Refresh the list
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update moderator.');
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm deletion
  const confirmDeleteModerator = async () => {
    setIsLoading(true);
    try {
      await moderatorService.deleteModerator(selectedModerator.id);
      setSuccessMessage(`Moderator ${selectedModerator.name} has been deleted successfully!`);
      setShowDeleteModal(false);
      
      setTimeout(() => {
        setSuccessMessage('');
        fetchModerators(); // Refresh the list
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete moderator.');
      setShowDeleteModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch moderators from API
  const fetchModerators = async () => {
    setIsLoading(true);
    try {
      const data = await moderatorService.getAllModerators();
      setModerators(data);
    } catch (err) {
      console.error("Error fetching moderators:", err);
      // Fall back to sample data if API fails
      setModerators([
        {
          id: 1,
          name: "Ashan Jayasinghe",
          nic: "198756432V",
          email: "ashan.j@farmio.lk",
          phone: "+94 77 123 4567",
          address: "42 Temple Road, Colombo 03",
          role: "Content Moderator",
          department: "User Support",
          permissions: {
            farmers: { view: true },
            buyers: { view: true },
            content: { view: true, edit: true, delete: true }
          },
          activityLevel: "High",
          status: "Active",
          joinDate: "2022-09-10",
          lastActive: "2023-06-10"
        },
        {
          id: 2,
          name: "Shalini Perera",
          nic: "199087654V",
          email: "shalini.p@farmio.lk",
          phone: "+94 76 234 5678",
          address: "15 Lake Drive, Kandy",
          role: "Product Moderator",
          department: "Quality Control",
          permissions: {
            products: { view: true, edit: true, approve: true }
          },
          activityLevel: "Medium",
          status: "Active",
          joinDate: "2022-11-22",
          lastActive: "2023-06-09"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load moderators on component mount
  useEffect(() => {
    fetchModerators();
  }, []);

  // Table columns
  const columns = [
    { accessor: 'name', header: 'Name' },
    { accessor: 'email', header: 'Email' },
    { accessor: 'phone', header: 'Phone' },
    { accessor: 'role', header: 'Role' },
    { accessor: 'department', header: 'Department' },
    { accessor: 'activityLevel', header: 'Activity' },
    {
      accessor: 'status',
      header: 'Status',
      cell: (row) => (
        <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {row.status}
        </span>
      )
    },
    { accessor: 'lastActive', header: 'Last Active' },
    {
      accessor: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <button onClick={() => handleViewModerator(row)} aria-label="View">
            <svg className="w-5 h-5 text-blue-600 hover:text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button onClick={() => handleEditModerator(row)} aria-label="Edit">
            <svg className="w-5 h-5 text-green-600 hover:text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={() => handleResetPassword(row)} aria-label="Reset Password" title="Reset Password">
            <svg className="w-5 h-5 text-yellow-600 hover:text-yellow-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </button>
          <button onClick={() => handleDeleteModerator(row)} aria-label="Delete">
            <svg className="w-5 h-5 text-red-600 hover:text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  // Filters
  const filters = [
    {
      name: 'status',
      label: 'Status',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
      ]
    },
    {
      name: 'role',
      label: 'Role',
      options: [
        { label: 'Content Moderator', value: 'Content Moderator' },
        { label: 'Product Moderator', value: 'Product Moderator' },
        { label: 'Support Moderator', value: 'Support Moderator' },
        { label: 'Community Moderator', value: 'Community Moderator' },
        { label: 'Lead Moderator', value: 'Lead Moderator' }
      ]
    },
    {
      name: 'department',
      label: 'Department',
      options: [
        { label: 'User Support', value: 'User Support' },
        { label: 'Quality Control', value: 'Quality Control' },
        { label: 'Customer Success', value: 'Customer Success' },
        { label: 'Community Management', value: 'Community Management' },
        { label: 'Operations', value: 'Operations' }
      ]
    },
    {
      name: 'activityLevel',
      label: 'Activity Level',
      options: [
        { label: 'Very High', value: 'Very High' },
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' }
      ]
    }
  ];

  // Handle add button click
  const handleAddModeratorClick = () => {
    resetForm();
    setShowAddModal(true);
  };

  return (
    <>
      <UserManagement
        userType="Moderators"
        userTypePath="moderators"
        userIcon={<ModeratorIcon />}
        columns={columns}
        userData={moderators}
        filters={filters}
        onAddClick={handleAddModeratorClick}
      />

      {/* Add Moderator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-opacity-20 backdrop-filter backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative flex items-center justify-center min-h-full p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Add New Moderator</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-500">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {successMessage && (
                <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-800">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tabs Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setAddModalActiveTab('personal')}
                    className={`px-6 py-3 font-medium text-sm ${
                      addModalActiveTab === 'personal'
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Personal Details
                  </button>
                  <button
                    onClick={() => setAddModalActiveTab('role')}
                    className={`px-6 py-3 font-medium text-sm ${
                      addModalActiveTab === 'role'
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Role Assignment
                  </button>
                  <button
                    onClick={() => setAddModalActiveTab('access')}
                    className={`px-6 py-3 font-medium text-sm ${
                      addModalActiveTab === 'access'
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Access Privileges
                  </button>
                </nav>
              </div>

              <form onSubmit={handleAddModerator} className="overflow-auto" style={{ maxHeight: '60vh' }}>
                <div className="px-6 py-4 space-y-4">
                  {/* Personal Details Tab */}
                  {addModalActiveTab === 'personal' && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Personal Information</h4>
                      <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={newModerator.name}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="nic" className="block text-sm font-medium text-gray-700">NIC Number</label>
                          <input
                            type="text"
                            name="nic"
                            id="nic"
                            value={newModerator.nic}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={newModerator.email}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                          <input
                            type="text"
                            name="phone"
                            id="phone"
                            value={newModerator.phone}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                          <textarea
                            name="address"
                            id="address"
                            rows={3}
                            value={newModerator.address}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Role Assignment Tab */}
                  {addModalActiveTab === 'role' && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Role Information</h4>
                      <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                        <div>
                          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                          <select
                            name="role"
                            id="role"
                            value={newModerator.role}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="Content Moderator">Content Moderator</option>
                            <option value="Product Moderator">Product Moderator</option>
                            <option value="Support Moderator">Support Moderator</option>
                            <option value="Community Moderator">Community Moderator</option>
                            <option value="Lead Moderator">Lead Moderator</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                          <select
                            name="department"
                            id="department"
                            value={newModerator.department}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="User Support">User Support</option>
                            <option value="Quality Control">Quality Control</option>
                            <option value="Customer Success">Customer Success</option>
                            <option value="Community Management">Community Management</option>
                            <option value="Operations">Operations</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Access Privileges Tab */}
                  {addModalActiveTab === 'access' && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2">Access Permissions</h4>
                      <p className="text-sm text-gray-500 mb-4">Select what the moderator can access and actions they can perform</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Farmers */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-800">Farmers</h5>
                          <div className="mt-2 flex flex-wrap gap-4">
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={accessPermissions.farmers.view}
                                onChange={() => handlePermissionChange('farmers', 'view')}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">View</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={accessPermissions.farmers.edit}
                                onChange={() => handlePermissionChange('farmers', 'edit')}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">Edit</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={accessPermissions.farmers.delete}
                                onChange={() => handlePermissionChange('farmers', 'delete')}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">Delete</span>
                            </label>
                          </div>
                        </div>
                        {/* Buyers */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-800">Buyers</h5>
                          <div className="mt-2 flex flex-wrap gap-4">
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={accessPermissions.buyers.view}
                                onChange={() => handlePermissionChange('buyers', 'view')}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">View</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={accessPermissions.buyers.edit}
                                onChange={() => handlePermissionChange('buyers', 'edit')}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">Edit</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={accessPermissions.buyers.delete}
                                onChange={() => handlePermissionChange('buyers', 'delete')}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">Delete</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-6 py-4 bg-gray-50 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none"
                  >
                    Create Moderator Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedModerator && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-opacity-20 backdrop-filter backdrop-blur-sm" onClick={() => setShowViewModal(false)}></div>
          <div className="relative flex items-center justify-center min-h-full p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Moderator Details: {selectedModerator.name}</h3>
                <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-500">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-6 py-3 font-medium text-sm ${
                      activeTab === 'details'
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setActiveTab('permissions')}
                    className={`px-6 py-3 font-medium text-sm ${
                      activeTab === 'permissions'
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Access Permissions
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`px-6 py-3 font-medium text-sm ${
                      activeTab === 'activity'
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Activity Log ({activityLogs[selectedModerator.id]?.length || 0})
                  </button>
                </nav>
              </div>
              <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-14rem)]">
                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p className="mt-1">{selectedModerator.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">NIC Number</p>
                      <p className="mt-1">{selectedModerator.nic || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email Address</p>
                      <p className="mt-1">{selectedModerator.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone Number</p>
                      <p className="mt-1">{selectedModerator.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="mt-1">{selectedModerator.address || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Role</p>
                      <p className="mt-1">{selectedModerator.role}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Department</p>
                      <p className="mt-1">{selectedModerator.department}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Activity Level</p>
                      <p className="mt-1">{selectedModerator.activityLevel}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className="mt-1">
                        <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                          selectedModerator.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedModerator.status}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Join Date</p>
                      <p className="mt-1">{selectedModerator.joinDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Active</p>
                      <p className="mt-1">{selectedModerator.lastActive}</p>
                    </div>
                  </div>
                )}

                {/* Permissions Tab */}
                {activeTab === 'permissions' && (
                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-4">Access Permissions</h4>
                    {Object.keys(selectedModerator.permissions || {}).length > 0 ? (
                      <div className="space-y-4">
                        {Object.entries(selectedModerator.permissions || {}).map(([category, perms]) => (
                          <div key={category} className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-medium text-gray-800 capitalize">{category}</h5>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {Object.entries(perms)
                                .filter(([_, val]) => val)
                                .map(([perm, _]) => (
                                  <span key={`${category}-${perm}`} className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                    {perm}
                                  </span>
                                ))
                              }
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No permissions assigned.</p>
                    )}
                  </div>
                )}

                {/* Activity Log Tab */}
                {activeTab === 'activity' && (
                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-4">Recent Activity</h4>
                    
                    {/* Loading state */}
                    {isLoading ? (
                      <div className="flex justify-center items-center py-8">
                        <svg className="w-8 h-8 animate-spin text-farmio" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span className="ml-2 text-farmio">Loading activity logs...</span>
                      </div>
                    ) : activityLogs[selectedModerator.id]?.length > 0 ? (
                      <div className="space-y-4">
                        {activityLogs[selectedModerator.id].map((log, idx) => (
                          <div key={idx} className="border-l-4 border-indigo-600 pl-4 py-2">
                            <p className="text-sm text-gray-500">{log.date}</p>
                            <p className="font-medium">{log.action.replace(/_/g, ' ')}</p>
                            <p className="text-gray-700">{log.details}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No activity logs available for this moderator.</p>
                    )}
                    
                    {/* Refresh button */}
                    <div className="mt-6 flex justify-end">
                      <button 
                        onClick={() => fetchModeratorActivityLogs(selectedModerator.id)}
                        disabled={isLoading}
                        className={`px-3 py-1.5 text-sm bg-farmio text-white rounded hover:bg-farmio-dark focus:outline-none ${
                          isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isLoading ? 'Refreshing...' : 'Refresh Activity Log'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-6 py-3 bg-gray-50 text-right">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedModerator && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-opacity-20 backdrop-filter backdrop-blur-sm" onClick={() => setShowEditModal(false)}></div>
          <div className="relative flex items-center justify-center min-h-full p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Edit Moderator: {selectedModerator.name}</h3>
                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-500">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {successMessage && (
                <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-800">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}
              <form onSubmit={handleSaveEdit} className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-14rem)]">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      id="edit-name"
                      value={newModerator.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-nic" className="block text-sm font-medium text-gray-700">NIC Number</label>
                    <input
                      type="text"
                      name="nic"
                      id="edit-nic"
                      value={newModerator.nic}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      id="edit-email"
                      value={newModerator.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      id="edit-phone"
                      value={newModerator.phone}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-address" className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                      name="address"
                      id="edit-address"
                      value={newModerator.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                    <div>
                      <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700">Role</label>
                      <select
                        name="role"
                        id="edit-role"
                        value={newModerator.role}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="Content Moderator">Content Moderator</option>
                        <option value="Product Moderator">Product Moderator</option>
                        <option value="Support Moderator">Support Moderator</option>
                        <option value="Community Moderator">Community Moderator</option>
                        <option value="Lead Moderator">Lead Moderator</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="edit-department" className="block text-sm font-medium text-gray-700">Department</label>
                      <select
                        name="department"
                        id="edit-department"
                        value={newModerator.department}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="User Support">User Support</option>
                        <option value="Quality Control">Quality Control</option>
                        <option value="Customer Success">Customer Success</option>
                        <option value="Community Management">Community Management</option>
                        <option value="Operations">Operations</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedModerator && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-opacity-20 backdrop-filter backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
          <div className="relative flex items-center justify-center min-h-full p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-gray-700">
                  Are you sure you want to delete the moderator account for <span className="font-medium">{selectedModerator.name}</span>? This action cannot be undone.
                </p>
              </div>
              <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteModerator}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Reset Password Modal */}
      {showResetPasswordModal && selectedModerator && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-opacity-20 backdrop-filter backdrop-blur-sm" onClick={() => !isLoading && setShowResetPasswordModal(false)}></div>
          <div className="relative flex items-center justify-center min-h-full p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Reset Password</h3>
              </div>
              <div className="px-6 py-4">
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                {successMessage && (
                  <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-md text-sm">
                    {successMessage}
                  </div>
                )}
                
                {!tempPassword ? (
                  <div>
                    <p className="text-gray-700">
                      Are you sure you want to reset the password for <span className="font-medium">{selectedModerator.name}</span>? 
                      The moderator will need to change their password upon their next login.
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="mb-4 text-gray-700">
                      Password has been reset successfully for <span className="font-medium">{selectedModerator.name}</span>. 
                    </p>
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm font-medium text-yellow-800 mb-1">Temporary Password:</p>
                      <p className="font-mono bg-gray-100 p-2 rounded border text-center">{tempPassword}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Make sure to provide this temporary password to the moderator securely. 
                        They will be required to change it on their first login.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
                {!tempPassword ? (
                  <>
                    <button
                      onClick={() => setShowResetPasswordModal(false)}
                      disabled={isLoading}
                      className={`px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmResetPassword}
                      disabled={isLoading}
                      className={`px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 focus:outline-none ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Resetting...
                        </span>
                      ) : 'Reset Password'}
                    </button>
                  </>
                ) : (
                  <div className="flex w-full justify-between">
                    <button
                      onClick={() => downloadPasswordAsFile(selectedModerator, tempPassword)}
                      className="px-4 py-2 bg-farmio text-white rounded hover:bg-farmio-dark focus:outline-none flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Password
                    </button>
                    <button
                      onClick={() => setShowResetPasswordModal(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModeratorManagement;