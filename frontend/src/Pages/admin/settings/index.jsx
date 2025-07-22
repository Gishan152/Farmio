import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';

// Icons
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SecurityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const NotificationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const IntegrationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
  </svg>
);

const SystemIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BillingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@farmio.com',
    phoneNumber: '+1 (555) 123-4567',
    position: 'System Administrator',
    department: 'IT & Security',
    company: 'Farmio',
    password: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
    passwordResetEnabled: true,
    ipRestriction: false,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    apiKey: 'api_key_35f8c7d2e4a1b9f6',
    theme: 'light',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, we would save the settings here
    console.log('Settings saved:', formData);
    alert('Settings saved successfully!');
  };

  const handleGenerateApiKey = () => {
    // This would generate a new API key in a real app
    const newApiKey = 'api_key_' + Math.random().toString(36).substr(2, 15);
    setFormData({
      ...formData,
      apiKey: newApiKey
    });
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-dashboard-border py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-farmio focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-dashboard-border py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-farmio focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-dashboard-border py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-farmio focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-dashboard-border py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-farmio focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-dashboard-border py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-farmio focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-dashboard-border py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-farmio focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-farmio text-white rounded-md hover:bg-farmio-dark focus:outline-none focus:ring-2 focus:ring-farmio focus:ring-offset-2"
              >
                Save Profile
              </button>
            </div>
          </form>
        );
        
      case 'security':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-dashboard-text-primary mb-4">Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-dashboard-border py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-farmio focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-dashboard-border py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-farmio focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-dashboard-border py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-farmio focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-dashboard-text-primary mb-4">Security Options</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-dashboard-text-secondary">Two-Factor Authentication</h4>
                      <p className="text-xs text-dashboard-text-light">Enable two-factor authentication for your account</p>
                    </div>
                    <div className="ml-4">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="twoFactorEnabled"
                          checked={formData.twoFactorEnabled}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-farmio rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-farmio"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-dashboard-text-secondary">Password Reset</h4>
                      <p className="text-xs text-dashboard-text-light">Allow password reset via email</p>
                    </div>
                    <div className="ml-4">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="passwordResetEnabled"
                          checked={formData.passwordResetEnabled}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-farmio rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-farmio"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-dashboard-text-secondary">IP Restriction</h4>
                      <p className="text-xs text-dashboard-text-light">Limit login to specific IP addresses</p>
                    </div>
                    <div className="ml-4">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="ipRestriction"
                          checked={formData.ipRestriction}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-farmio rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-farmio"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-farmio text-white rounded-md hover:bg-farmio-dark focus:outline-none focus:ring-2 focus:ring-farmio focus:ring-offset-2"
              >
                Save Security Settings
              </button>
            </div>
          </form>
        );
        
      case 'notifications':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-dashboard-border">
                <div>
                  <h4 className="text-sm font-medium text-dashboard-text-secondary">Email Notifications</h4>
                  <p className="text-xs text-dashboard-text-light">Receive notifications via email</p>
                </div>
                <div className="ml-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={formData.emailNotifications}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-farmio rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-farmio"></div>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-dashboard-border">
                <div>
                  <h4 className="text-sm font-medium text-dashboard-text-secondary">Push Notifications</h4>
                  <p className="text-xs text-dashboard-text-light">Receive notifications via browser</p>
                </div>
                <div className="ml-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="pushNotifications"
                      checked={formData.pushNotifications}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-farmio rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-farmio"></div>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-dashboard-border">
                <div>
                  <h4 className="text-sm font-medium text-dashboard-text-secondary">SMS Notifications</h4>
                  <p className="text-xs text-dashboard-text-light">Receive notifications via SMS</p>
                </div>
                <div className="ml-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="smsNotifications"
                      checked={formData.smsNotifications}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-farmio rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-farmio"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-farmio text-white rounded-md hover:bg-farmio-dark focus:outline-none focus:ring-2 focus:ring-farmio focus:ring-offset-2"
              >
                Save Notification Settings
              </button>
            </div>
          </form>
        );
        
      case 'integrations':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-dashboard-text-primary mb-4">API Access</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-md border border-dashboard-border">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-dashboard-text-secondary">
                      API Key
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateApiKey}
                      className="text-xs text-farmio hover:text-farmio-dark"
                    >
                      Generate New Key
                    </button>
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={formData.apiKey}
                      readOnly
                      className="flex-grow w-full rounded-l-md border border-r-0 border-dashboard-border py-2 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farmio focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(formData.apiKey)}
                      className="px-4 py-2 rounded-r-md bg-gray-200 hover:bg-gray-300 focus:outline-none"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                
                <p className="text-xs text-dashboard-text-light">
                  This API key grants full access to your account. Keep it secure and do not expose it in client-side code.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-dashboard-text-primary mb-4">Connected Services</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-md border border-dashboard-border flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-dashboard-text-primary">Email Service</h4>
                      <p className="text-xs text-dashboard-text-light">Connected to your email provider</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1 text-sm text-dashboard-text-secondary border border-dashboard-border rounded-md hover:bg-gray-100 focus:outline-none"
                  >
                    Configure
                  </button>
                </div>
                
                <div className="p-4 rounded-md border border-dashboard-border flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-dashboard-text-primary">Storage Service</h4>
                      <p className="text-xs text-dashboard-text-light">Connected to your storage provider</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1 text-sm text-dashboard-text-secondary border border-dashboard-border rounded-md hover:bg-gray-100 focus:outline-none"
                  >
                    Configure
                  </button>
                </div>
                
                <div className="p-4 rounded-md border border-dashboard-border border-dashed flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-dashboard-text-primary">Add New Integration</h4>
                      <p className="text-xs text-dashboard-text-light">Connect a new service to your account</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1 text-sm text-farmio border border-farmio rounded-md hover:bg-farmio hover:text-white focus:outline-none"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'system':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                  Theme
                </label>
                <select
                  name="theme"
                  value={formData.theme}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-dashboard-border py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-farmio focus:border-transparent"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                  Language
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-dashboard-border py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-farmio focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                  Date Format
                </label>
                <select
                  name="dateFormat"
                  value={formData.dateFormat}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-dashboard-border py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-farmio focus:border-transparent"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                  Time Format
                </label>
                <select
                  name="timeFormat"
                  value={formData.timeFormat}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-dashboard-border py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-farmio focus:border-transparent"
                >
                  <option value="12h">12 hour (AM/PM)</option>
                  <option value="24h">24 hour</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-farmio text-white rounded-md hover:bg-farmio-dark focus:outline-none focus:ring-2 focus:ring-farmio focus:ring-offset-2"
              >
                Save System Preferences
              </button>
            </div>
          </form>
        );
        
      case 'billing':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-dashboard-text-primary mb-4">Current Plan</h3>
              <div className="p-4 bg-pastel-green rounded-md">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-farmio">Enterprise Plan</h4>
                    <p className="text-sm text-dashboard-text-secondary">Your plan renews on July 21, 2025</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-farmio">$499<span className="text-sm text-dashboard-text-secondary">/month</span></p>
                    <p className="text-sm text-dashboard-text-secondary">Billed annually</p>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <ul className="space-y-1">
                    <li className="flex items-center text-sm text-farmio-dark">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Unlimited users
                    </li>
                    <li className="flex items-center text-sm text-farmio-dark">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Advanced analytics
                    </li>
                    <li className="flex items-center text-sm text-farmio-dark">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      API access
                    </li>
                  </ul>
                  <ul className="space-y-1">
                    <li className="flex items-center text-sm text-farmio-dark">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Priority support
                    </li>
                    <li className="flex items-center text-sm text-farmio-dark">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Custom integrations
                    </li>
                    <li className="flex items-center text-sm text-farmio-dark">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Dedicated account manager
                    </li>
                  </ul>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="px-3 py-1 text-sm text-farmio border border-farmio rounded-md hover:bg-farmio hover:text-white focus:outline-none"
                  >
                    Change Plan
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-dashboard-text-primary mb-4">Payment Method</h3>
              <div className="p-4 rounded-md border border-dashboard-border flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-6 bg-blue-500 rounded mr-3"></div>
                  <div>
                    <h4 className="text-sm font-medium text-dashboard-text-primary">Visa ending in 4242</h4>
                    <p className="text-xs text-dashboard-text-light">Expires 09/2025</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-3 py-1 text-sm text-dashboard-text-secondary border border-dashboard-border rounded-md hover:bg-gray-100 focus:outline-none"
                >
                  Update
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-dashboard-text-primary mb-4">Billing History</h3>
              <div className="border border-dashboard-border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-dashboard-border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dashboard-text-light uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dashboard-text-light uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dashboard-text-light uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-dashboard-text-light uppercase tracking-wider">
                        Invoice
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-dashboard-border">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dashboard-text-primary">
                        June 21, 2025
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dashboard-text-primary">
                        $499.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Paid
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button className="text-farmio hover:text-farmio-dark">
                          Download
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dashboard-text-primary">
                        May 21, 2025
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dashboard-text-primary">
                        $499.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Paid
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button className="text-farmio hover:text-farmio-dark">
                          Download
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dashboard-text-primary">
                        April 21, 2025
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dashboard-text-primary">
                        $499.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Paid
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button className="text-farmio hover:text-farmio-dark">
                          Download
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <DashboardLayout
      title="Settings"
      breadcrumbs="Settings"
      userRole="admin"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Sidebar */}
        <div className="md:col-span-1">
          <Card noPadding>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-4 py-3 text-sm ${
                  activeTab === 'profile' 
                    ? 'bg-pastel-green text-farmio-dark font-medium' 
                    : 'text-dashboard-text-secondary hover:bg-gray-100'
                }`}
              >
                <UserIcon />
                <span className="ml-3">Profile</span>
              </button>
              
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center px-4 py-3 text-sm ${
                  activeTab === 'security' 
                    ? 'bg-pastel-green text-farmio-dark font-medium' 
                    : 'text-dashboard-text-secondary hover:bg-gray-100'
                }`}
              >
                <SecurityIcon />
                <span className="ml-3">Security</span>
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-4 py-3 text-sm ${
                  activeTab === 'notifications' 
                    ? 'bg-pastel-green text-farmio-dark font-medium' 
                    : 'text-dashboard-text-secondary hover:bg-gray-100'
                }`}
              >
                <NotificationIcon />
                <span className="ml-3">Notifications</span>
              </button>
              
              <button
                onClick={() => setActiveTab('integrations')}
                className={`w-full flex items-center px-4 py-3 text-sm ${
                  activeTab === 'integrations' 
                    ? 'bg-pastel-green text-farmio-dark font-medium' 
                    : 'text-dashboard-text-secondary hover:bg-gray-100'
                }`}
              >
                <IntegrationIcon />
                <span className="ml-3">Integrations</span>
              </button>
              
              <button
                onClick={() => setActiveTab('system')}
                className={`w-full flex items-center px-4 py-3 text-sm ${
                  activeTab === 'system' 
                    ? 'bg-pastel-green text-farmio-dark font-medium' 
                    : 'text-dashboard-text-secondary hover:bg-gray-100'
                }`}
              >
                <SystemIcon />
                <span className="ml-3">System Preferences</span>
              </button>
              
              <button
                onClick={() => setActiveTab('billing')}
                className={`w-full flex items-center px-4 py-3 text-sm ${
                  activeTab === 'billing' 
                    ? 'bg-pastel-green text-farmio-dark font-medium' 
                    : 'text-dashboard-text-secondary hover:bg-gray-100'
                }`}
              >
                <BillingIcon />
                <span className="ml-3">Billing & Subscription</span>
              </button>
            </nav>
          </Card>
        </div>
        
        {/* Settings Content */}
        <div className="md:col-span-3">
          <Card
            title={
              activeTab === 'profile' ? 'Profile Information' :
              activeTab === 'security' ? 'Security Settings' :
              activeTab === 'notifications' ? 'Notification Preferences' :
              activeTab === 'integrations' ? 'Integrations & API' :
              activeTab === 'system' ? 'System Preferences' :
              activeTab === 'billing' ? 'Billing & Subscription' : 'Settings'
            }
            icon={
              activeTab === 'profile' ? <UserIcon /> :
              activeTab === 'security' ? <SecurityIcon /> :
              activeTab === 'notifications' ? <NotificationIcon /> :
              activeTab === 'integrations' ? <IntegrationIcon /> :
              activeTab === 'system' ? <SystemIcon /> :
              activeTab === 'billing' ? <BillingIcon /> : <UserIcon />
            }
          >
            {renderTabContent()}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;