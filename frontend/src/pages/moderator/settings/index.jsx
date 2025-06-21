import { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';

// Icons
const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const NotificationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const SecurityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const PreferencesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);

const ActivityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState({
    firstName: 'Maria',
    lastName: 'Rodriguez',
    email: 'maria.rodriguez@farmio.com',
    phone: '+1 (555) 123-4567',
    role: 'Moderator',
    department: 'Product Quality',
    joinDate: '2024-03-15',
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    orderUpdates: true,
    systemAlerts: true,
    productUpdates: true,
    supportTickets: true,
    dailySummary: false,
    weeklyReport: true,
  });
  
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    theme: 'light',
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    console.log('Profile updated:', userProfile);
    // Here you would update the profile in the backend
  };

  const handleNotificationChange = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    });
  };

  const handlePreferenceChange = (e) => {
    setPreferences({
      ...preferences,
      [e.target.name]: e.target.value,
    });
  };

  // Activity log sample data
  const activityLog = [
    { action: 'Logged in', timestamp: '2025-06-21 09:15 AM', details: 'IP: 192.168.1.1' },
    { action: 'Updated product status', timestamp: '2025-06-21 10:22 AM', details: 'Product ID: P003' },
    { action: 'Approved vendor application', timestamp: '2025-06-21 11:45 AM', details: 'Vendor: Green Valley Farms' },
    { action: 'Resolved support ticket', timestamp: '2025-06-21 01:30 PM', details: 'Ticket ID: TKT-002' },
    { action: 'Updated inventory count', timestamp: '2025-06-20 02:15 PM', details: 'Product ID: P001' },
    { action: 'Generated quality report', timestamp: '2025-06-20 03:40 PM', details: 'Report ID: QC003' },
    { action: 'Logged out', timestamp: '2025-06-20 05:05 PM', details: 'Session duration: 7h 50m' },
  ];

  return (
    <DashboardLayout 
      title="Settings" 
      userRole="moderator"
      breadcrumbs="Settings"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card noPadding>
            <nav>
              <ul>
                <li>
                  <button
                    className={`flex items-center w-full px-4 py-3 text-left ${
                      activeTab === 'profile' 
                        ? 'bg-pastel-green text-farmio-dark font-medium' 
                        : 'hover:bg-gray-50 text-dashboard-text-secondary'
                    }`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <span className="mr-3"><ProfileIcon /></span>
                    Profile Information
                  </button>
                </li>
                <li>
                  <button
                    className={`flex items-center w-full px-4 py-3 text-left ${
                      activeTab === 'notifications' 
                        ? 'bg-pastel-green text-farmio-dark font-medium' 
                        : 'hover:bg-gray-50 text-dashboard-text-secondary'
                    }`}
                    onClick={() => setActiveTab('notifications')}
                  >
                    <span className="mr-3"><NotificationIcon /></span>
                    Notification Settings
                  </button>
                </li>
                <li>
                  <button
                    className={`flex items-center w-full px-4 py-3 text-left ${
                      activeTab === 'security' 
                        ? 'bg-pastel-green text-farmio-dark font-medium' 
                        : 'hover:bg-gray-50 text-dashboard-text-secondary'
                    }`}
                    onClick={() => setActiveTab('security')}
                  >
                    <span className="mr-3"><SecurityIcon /></span>
                    Security
                  </button>
                </li>
                <li>
                  <button
                    className={`flex items-center w-full px-4 py-3 text-left ${
                      activeTab === 'preferences' 
                        ? 'bg-pastel-green text-farmio-dark font-medium' 
                        : 'hover:bg-gray-50 text-dashboard-text-secondary'
                    }`}
                    onClick={() => setActiveTab('preferences')}
                  >
                    <span className="mr-3"><PreferencesIcon /></span>
                    Preferences
                  </button>
                </li>
                <li>
                  <button
                    className={`flex items-center w-full px-4 py-3 text-left ${
                      activeTab === 'activity' 
                        ? 'bg-pastel-green text-farmio-dark font-medium' 
                        : 'hover:bg-gray-50 text-dashboard-text-secondary'
                    }`}
                    onClick={() => setActiveTab('activity')}
                  >
                    <span className="mr-3"><ActivityIcon /></span>
                    Activity Log
                  </button>
                </li>
              </ul>
            </nav>
          </Card>
        </div>
        
        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <Card title="Profile Information" icon={<ProfileIcon />} color="green">
              <form onSubmit={handleProfileUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-dashboard-text-primary text-sm rounded-lg focus:ring-farmio focus:border-farmio block w-full p-2.5"
                      value={userProfile.firstName}
                      onChange={(e) => setUserProfile({...userProfile, firstName: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-dashboard-text-primary text-sm rounded-lg focus:ring-farmio focus:border-farmio block w-full p-2.5"
                      value={userProfile.lastName}
                      onChange={(e) => setUserProfile({...userProfile, lastName: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="bg-gray-50 border border-gray-300 text-dashboard-text-primary text-sm rounded-lg focus:ring-farmio focus:border-farmio block w-full p-2.5"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-dashboard-text-primary text-sm rounded-lg focus:ring-farmio focus:border-farmio block w-full p-2.5"
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                      Role
                    </label>
                    <input
                      type="text"
                      className="bg-gray-100 border border-gray-300 text-dashboard-text-primary text-sm rounded-lg block w-full p-2.5"
                      value={userProfile.role}
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                      Department
                    </label>
                    <select
                      className="bg-gray-50 border border-gray-300 text-dashboard-text-primary text-sm rounded-lg focus:ring-farmio focus:border-farmio block w-full p-2.5"
                      value={userProfile.department}
                      onChange={(e) => setUserProfile({...userProfile, department: e.target.value})}
                    >
                      <option value="Product Quality">Product Quality</option>
                      <option value="Customer Support">Customer Support</option>
                      <option value="Order Processing">Order Processing</option>
                      <option value="Account Management">Account Management</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                      Join Date
                    </label>
                    <input
                      type="text"
                      className="bg-gray-100 border border-gray-300 text-dashboard-text-primary text-sm rounded-lg block w-full p-2.5"
                      value={userProfile.joinDate}
                      readOnly
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                      Profile Bio
                    </label>
                    <textarea
                      className="bg-gray-50 border border-gray-300 text-dashboard-text-primary text-sm rounded-lg focus:ring-farmio focus:border-farmio block w-full p-2.5 h-24"
                      placeholder="Tell us about yourself"
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-farmio text-white text-sm font-medium rounded-lg hover:bg-farmio-dark focus:ring-2 focus:ring-farmio-light"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </Card>
          )}
          
          {activeTab === 'notifications' && (
            <Card title="Notification Settings" icon={<NotificationIcon />} color="blue">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-dashboard-text-secondary mb-3">
                    Notification Methods
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onChange={() => handleNotificationChange('emailNotifications')}
                        className="w-4 h-4 rounded text-farmio focus:ring-farmio-light"
                      />
                      <label htmlFor="emailNotifications" className="ml-3 text-sm text-dashboard-text-primary">
                        Email Notifications
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="pushNotifications"
                        checked={notificationSettings.pushNotifications}
                        onChange={() => handleNotificationChange('pushNotifications')}
                        className="w-4 h-4 rounded text-farmio focus:ring-farmio-light"
                      />
                      <label htmlFor="pushNotifications" className="ml-3 text-sm text-dashboard-text-primary">
                        Push Notifications
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-dashboard-text-secondary mb-3">
                    Notification Types
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="orderUpdates"
                        checked={notificationSettings.orderUpdates}
                        onChange={() => handleNotificationChange('orderUpdates')}
                        className="w-4 h-4 rounded text-farmio focus:ring-farmio-light"
                      />
                      <label htmlFor="orderUpdates" className="ml-3 text-sm text-dashboard-text-primary">
                        Order Updates
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="systemAlerts"
                        checked={notificationSettings.systemAlerts}
                        onChange={() => handleNotificationChange('systemAlerts')}
                        className="w-4 h-4 rounded text-farmio focus:ring-farmio-light"
                      />
                      <label htmlFor="systemAlerts" className="ml-3 text-sm text-dashboard-text-primary">
                        System Alerts
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="productUpdates"
                        checked={notificationSettings.productUpdates}
                        onChange={() => handleNotificationChange('productUpdates')}
                        className="w-4 h-4 rounded text-farmio focus:ring-farmio-light"
                      />
                      <label htmlFor="productUpdates" className="ml-3 text-sm text-dashboard-text-primary">
                        Product Updates
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="supportTickets"
                        checked={notificationSettings.supportTickets}
                        onChange={() => handleNotificationChange('supportTickets')}
                        className="w-4 h-4 rounded text-farmio focus:ring-farmio-light"
                      />
                      <label htmlFor="supportTickets" className="ml-3 text-sm text-dashboard-text-primary">
                        Support Tickets
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-dashboard-text-secondary mb-3">
                    Reports & Summaries
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="dailySummary"
                        checked={notificationSettings.dailySummary}
                        onChange={() => handleNotificationChange('dailySummary')}
                        className="w-4 h-4 rounded text-farmio focus:ring-farmio-light"
                      />
                      <label htmlFor="dailySummary" className="ml-3 text-sm text-dashboard-text-primary">
                        Daily Summary
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="weeklyReport"
                        checked={notificationSettings.weeklyReport}
                        onChange={() => handleNotificationChange('weeklyReport')}
                        className="w-4 h-4 rounded text-farmio focus:ring-farmio-light"
                      />
                      <label htmlFor="weeklyReport" className="ml-3 text-sm text-dashboard-text-primary">
                        Weekly Report
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-farmio text-white text-sm font-medium rounded-lg hover:bg-farmio-dark focus:ring-2 focus:ring-farmio-light"
                    onClick={() => console.log('Notification settings saved:', notificationSettings)}
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </Card>
          )}
          
          {activeTab === 'security' && (
            <Card title="Security Settings" icon={<SecurityIcon />} color="red">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-dashboard-text-secondary mb-3">
                    Change Password
                  </h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="bg-gray-50 border border-gray-300 text-dashboard-text-primary text-sm rounded-lg focus:ring-farmio focus:border-farmio block w-full p-2.5"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="bg-gray-50 border border-gray-300 text-dashboard-text-primary text-sm rounded-lg focus:ring-farmio focus:border-farmio block w-full p-2.5"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="bg-gray-50 border border-gray-300 text-dashboard-text-primary text-sm rounded-lg focus:ring-farmio focus:border-farmio block w-full p-2.5"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div>
                      <button
                        type="button"
                        className="px-4 py-2 bg-farmio text-white text-sm font-medium rounded-lg hover:bg-farmio-dark focus:ring-2 focus:ring-farmio-light"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-dashboard-text-secondary mb-3">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-dashboard-text-secondary mb-4">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-100 text-dashboard-text-primary text-sm font-medium rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-200"
                  >
                    Enable Two-Factor Authentication
                  </button>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-dashboard-text-secondary mb-3">
                    Login Sessions
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-dashboard-text-primary">Current Session</p>
                        <p className="text-xs text-dashboard-text-secondary">Windows - Chrome - IP: 192.168.1.1</p>
                        <p className="text-xs text-dashboard-text-secondary">Started: 2025-06-21 09:15 AM</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-pastel-green text-green-800 rounded-full">
                        Active
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-dashboard-text-primary">Mobile Session</p>
                        <p className="text-xs text-dashboard-text-secondary">iOS - Mobile App - IP: 172.16.1.5</p>
                        <p className="text-xs text-dashboard-text-secondary">Started: 2025-06-20 08:45 AM</p>
                      </div>
                      <button className="text-xs text-red-500 hover:text-red-700">
                        Revoke
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 focus:ring-2 focus:ring-red-300"
                    >
                      Logout All Devices
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}
          
          {activeTab === 'preferences' && (
            <Card title="User Preferences" icon={<PreferencesIcon />} color="purple">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                      Language
                    </label>
                    <select
                      name="language"
                      className="bg-gray-50 border border-gray-300 text-dashboard-text-primary text-sm rounded-lg focus:ring-farmio focus:border-farmio block w-full p-2.5"
                      value={preferences.language}
                      onChange={handlePreferenceChange}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                      Timezone
                    </label>
                    <select
                      name="timezone"
                      className="bg-gray-50 border border-gray-300 text-dashboard-text-primary text-sm rounded-lg focus:ring-farmio focus:border-farmio block w-full p-2.5"
                      value={preferences.timezone}
                      onChange={handlePreferenceChange}
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                      Date Format
                    </label>
                    <select
                      name="dateFormat"
                      className="bg-gray-50 border border-gray-300 text-dashboard-text-primary text-sm rounded-lg focus:ring-farmio focus:border-farmio block w-full p-2.5"
                      value={preferences.dateFormat}
                      onChange={handlePreferenceChange}
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dashboard-text-secondary mb-1">
                      Theme
                    </label>
                    <select
                      name="theme"
                      className="bg-gray-50 border border-gray-300 text-dashboard-text-primary text-sm rounded-lg focus:ring-farmio focus:border-farmio block w-full p-2.5"
                      value={preferences.theme}
                      onChange={handlePreferenceChange}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-dashboard-text-secondary mb-3">
                    Dashboard Preferences
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showWelcomeMessage"
                        className="w-4 h-4 rounded text-farmio focus:ring-farmio-light"
                        defaultChecked
                      />
                      <label htmlFor="showWelcomeMessage" className="ml-3 text-sm text-dashboard-text-primary">
                        Show welcome message on dashboard
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showTaskReminders"
                        className="w-4 h-4 rounded text-farmio focus:ring-farmio-light"
                        defaultChecked
                      />
                      <label htmlFor="showTaskReminders" className="ml-3 text-sm text-dashboard-text-primary">
                        Show task reminders
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableQuickActions"
                        className="w-4 h-4 rounded text-farmio focus:ring-farmio-light"
                        defaultChecked
                      />
                      <label htmlFor="enableQuickActions" className="ml-3 text-sm text-dashboard-text-primary">
                        Enable quick action buttons
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-farmio text-white text-sm font-medium rounded-lg hover:bg-farmio-dark focus:ring-2 focus:ring-farmio-light"
                    onClick={() => console.log('Preferences saved:', preferences)}
                  >
                    Save Preferences
                  </button>
                </div>
              </form>
            </Card>
          )}
          
          {activeTab === 'activity' && (
            <Card title="Account Activity" icon={<ActivityIcon />} color="yellow">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-dashboard-text-secondary">
                    Recent Activity
                  </h3>
                  <button
                    type="button"
                    className="text-sm text-farmio hover:text-farmio-dark"
                  >
                    Export Log
                  </button>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {activityLog.map((activity, index) => (
                    <div key={index} className="py-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-dashboard-text-primary">
                            {activity.action}
                          </p>
                          <p className="text-xs text-dashboard-text-secondary mt-1">
                            {activity.details}
                          </p>
                        </div>
                        <span className="text-xs text-dashboard-text-light">
                          {activity.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 flex justify-center">
                  <button
                    type="button"
                    className="text-sm text-farmio hover:text-farmio-dark"
                  >
                    View All Activity
                  </button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
