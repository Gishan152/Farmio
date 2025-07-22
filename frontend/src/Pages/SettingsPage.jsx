import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import {
  UserIcon,
  ShieldCheckIcon,
  BellIcon,
  PaintBrushIcon,
  ChatBubbleLeftRightIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function SettingsPage({ userType = "user" }) {
    const tabs = [
        { key: 'profile', label: 'Profile', icon: <UserIcon className="w-5 h-5" /> },
        { key: 'security', label: 'Security', icon: <ShieldCheckIcon className="w-5 h-5" /> },
        { key: 'notifications', label: 'Notifications', icon: <BellIcon className="w-5 h-5" /> },
        { key: 'appearance', label: 'Appearance', icon: <PaintBrushIcon className="w-5 h-5" /> },
        { key: 'privacy', label: 'Privacy', icon: <EyeIcon className="w-5 h-5" /> },
        { key: 'chat', label: 'Chat', icon: <ChatBubbleLeftRightIcon className="w-5 h-5" /> }
    ];
    
    const [activeTab, setActiveTab] = useState('profile');
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    // Profile settings
    const [profileSettings, setProfileSettings] = useState({
        displayName: 'John Doe',
        email: 'john@example.com',
        phone: '+94 71 234 5678',
        bio: 'Passionate about sustainable agriculture',
        location: 'Colombo, Sri Lanka',
        website: '',
        socialMedia: {
            facebook: '',
            twitter: '',
            linkedin: ''
        }
    });

    // Security settings
    const [securitySettings, setSecuritySettings] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: false,
        loginAlerts: true,
        sessionTimeout: '30'
    });

    // Notification settings
    const [notificationSettings, setNotificationSettings] = useState({
        email: {
            orderUpdates: true,
            priceAlerts: true,
            messages: true,
            promotions: false,
            systemUpdates: true,
            weeklyDigest: true
        },
        push: {
            orderUpdates: true,
            messages: true,
            priceAlerts: false,
            promotions: false
        },
        sms: {
            orderUpdates: true,
            securityAlerts: true,
            promotions: false
        }
    });

    // Appearance settings
    const [appearanceSettings, setAppearanceSettings] = useState({
        theme: 'system',
        language: 'en',
        currency: 'LKR',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '12h',
        fontSize: 'medium'
    });

    // Privacy settings
    const [privacySettings, setPrivacySettings] = useState({
        profileVisibility: 'public',
        showOnlineStatus: true,
        showLastSeen: true,
        allowDirectMessages: true,
        showContactInfo: false,
        dataSharing: false,
        analyticsOptIn: true
    });

    // Chat settings
    const [chatSettings, setChatSettings] = useState({
        readReceipts: true,
        onlineStatus: true,
        messagePreview: true,
        soundNotifications: true,
        autoArchive: false,
        blockUnknown: false
    });

    const updateProfileSetting = (field, value) => {
        setProfileSettings(prev => ({ ...prev, [field]: value }));
    };

    const updateNotificationSetting = (category, field, value) => {
        setNotificationSettings(prev => ({
            ...prev,
            [category]: { ...prev[category], [field]: value }
        }));
    };

    const updateChatSetting = (field, value) => {
        setChatSettings(prev => ({ ...prev, [field]: value }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSaveProfile = () => {
        // Save profile settings
        console.log('Saving profile settings:', profileSettings);
        alert('Profile settings saved successfully!');
    };

    const handleChangePassword = () => {
        if (securitySettings.newPassword !== securitySettings.confirmPassword) {
            alert('New passwords do not match!');
            return;
        }
        // Change password logic
        console.log('Changing password...');
        alert('Password changed successfully!');
        setSecuritySettings(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }));
    };

    const handleSaveAllSettings = () => {
        const allSettings = {
            profile: profileSettings,
            security: securitySettings,
            notifications: notificationSettings,
            appearance: appearanceSettings,
            privacy: privacySettings,
            chat: chatSettings
        };
        console.log('Saving all settings:', allSettings);
        alert('All settings saved successfully!');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-emerald-700">Settings</h1>
                    <p className="text-gray-600 mt-2">Manage your account preferences and settings</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm border border-emerald-100">
                            <nav className="space-y-1 p-2">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg transition-colors ${
                                            activeTab === tab.key
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow'
                                                : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                                        }`}
                                    >
                                        {tab.icon}
                                        <span className="font-medium">{tab.label}</span>
                                        {activeTab === tab.key && (
                                            <CheckIcon className="w-4 h-4 text-emerald-500 ml-auto" />
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Global Save Button */}
                        <div className="mt-4">
                            <button
                                onClick={handleSaveAllSettings}
                                className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow"
                            >
                                Save All Settings
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-white rounded-lg shadow-sm border border-emerald-100">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-emerald-700">Profile Information</h2>
                                        <button
                                            onClick={handleSaveProfile}
                                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-emerald-700 mb-2">
                                                    Display Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileSettings.displayName}
                                                    onChange={(e) => updateProfileSetting('displayName', e.target.value)}
                                                    className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-emerald-700 mb-2">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    value={profileSettings.email}
                                                    onChange={(e) => updateProfileSetting('email', e.target.value)}
                                                    className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-emerald-700 mb-2">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={profileSettings.phone}
                                                    onChange={(e) => updateProfileSetting('phone', e.target.value)}
                                                    className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-emerald-700 mb-2">
                                                    Location
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileSettings.location}
                                                    onChange={(e) => updateProfileSetting('location', e.target.value)}
                                                    className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-emerald-700 mb-2">
                                                Bio
                                            </label>
                                            <textarea
                                                rows={4}
                                                value={profileSettings.bio}
                                                onChange={(e) => updateProfileSetting('bio', e.target.value)}
                                                className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                placeholder="Tell us about yourself..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-emerald-700 mb-2">
                                                Website
                                            </label>
                                            <input
                                                type="url"
                                                value={profileSettings.website}
                                                onChange={(e) => updateProfileSetting('website', e.target.value)}
                                                placeholder="https://example.com"
                                                className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            />
                                        </div>

                                        {/* Social Media Links */}
                                        <div>
                                            <h3 className="text-lg font-medium text-emerald-700 mb-4">Social Media</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-emerald-700 mb-2">
                                                        Facebook
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={profileSettings.socialMedia.facebook}
                                                        onChange={(e) => setProfileSettings(prev => ({
                                                            ...prev,
                                                            socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                                                        }))}
                                                        placeholder="https://facebook.com/username"
                                                        className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-emerald-700 mb-2">
                                                        Twitter
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={profileSettings.socialMedia.twitter}
                                                        onChange={(e) => setProfileSettings(prev => ({
                                                            ...prev,
                                                            socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                                                        }))}
                                                        placeholder="https://twitter.com/username"
                                                        className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-emerald-700 mb-2">
                                                        LinkedIn
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={profileSettings.socialMedia.linkedin}
                                                        onChange={(e) => setProfileSettings(prev => ({
                                                            ...prev,
                                                            socialMedia: { ...prev.socialMedia, linkedin: e.target.value }
                                                        }))}
                                                        placeholder="https://linkedin.com/in/username"
                                                        className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-emerald-700 mb-6">Security Settings</h2>

                                    <div className="space-y-8">
                                        {/* Change Password */}
                                        <div className="border-b border-emerald-100 pb-6">
                                            <h3 className="text-lg font-medium text-emerald-700 mb-4">Change Password</h3>
                                            <div className="space-y-4 max-w-md">
                                                {[
                                                    { key: 'current', label: 'Current Password', value: securitySettings.currentPassword },
                                                    { key: 'new', label: 'New Password', value: securitySettings.newPassword },
                                                    { key: 'confirm', label: 'Confirm New Password', value: securitySettings.confirmPassword }
                                                ].map(({ key, label, value }) => (
                                                    <div key={key}>
                                                        <label className="block text-sm font-medium text-emerald-700 mb-1">
                                                            {label}
                                                        </label>
                                                        <div className="relative">
                                                            <input
                                                                type={showPassword[key] ? 'text' : 'password'}
                                                                value={value}
                                                                onChange={(e) => setSecuritySettings(prev => ({
                                                                    ...prev,
                                                                    [key === 'current' ? 'currentPassword' : key === 'new' ? 'newPassword' : 'confirmPassword']: e.target.value
                                                                }))}
                                                                className="w-full px-3 py-2 pr-10 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => togglePasswordVisibility(key)}
                                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                            >
                                                                {showPassword[key] ? (
                                                                    <EyeSlashIcon className="h-5 w-5 text-emerald-400" />
                                                                ) : (
                                                                    <EyeIcon className="h-5 w-5 text-emerald-400" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={handleChangePassword}
                                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                                >
                                                    Update Password
                                                </button>
                                            </div>
                                        </div>

                                        {/* Two-Factor Authentication */}
                                        <div className="border-b border-emerald-100 pb-6">
                                            <h3 className="text-lg font-medium text-emerald-700 mb-4">Two-Factor Authentication</h3>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Add an extra layer of security to your account
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={securitySettings.twoFactorEnabled}
                                                    onChange={(value) => setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: value }))}
                                                    className={`${
                                                        securitySettings.twoFactorEnabled ? 'bg-emerald-600' : 'bg-gray-300'
                                                    } relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
                                                >
                                                    <span className={`${
                                                        securitySettings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                                                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                                                </Switch>
                                            </div>
                                        </div>

                                        {/* Login Alerts */}
                                        <div className="border-b border-emerald-100 pb-6">
                                            <h3 className="text-lg font-medium text-emerald-700 mb-4">Login Alerts</h3>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Get notified when someone logs into your account
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={securitySettings.loginAlerts}
                                                    onChange={(value) => setSecuritySettings(prev => ({ ...prev, loginAlerts: value }))}
                                                    className={`${
                                                        securitySettings.loginAlerts ? 'bg-emerald-600' : 'bg-gray-300'
                                                    } relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
                                                >
                                                    <span className={`${
                                                        securitySettings.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                                                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                                                </Switch>
                                            </div>
                                        </div>

                                        {/* Session Timeout */}
                                        <div>
                                            <h3 className="text-lg font-medium text-emerald-700 mb-4">Session Timeout</h3>
                                            <div className="max-w-xs">
                                                <label className="block text-sm font-medium text-emerald-700 mb-2">
                                                    Auto logout after (minutes)
                                                </label>
                                                <select
                                                    value={securitySettings.sessionTimeout}
                                                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                >
                                                    <option value="15">15 minutes</option>
                                                    <option value="30">30 minutes</option>
                                                    <option value="60">1 hour</option>
                                                    <option value="120">2 hours</option>
                                                    <option value="0">Never</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-emerald-700 mb-6">Notification Preferences</h2>

                                    <div className="space-y-8">
                                        {/* Email Notifications */}
                                        <div>
                                            <h3 className="text-lg font-medium text-emerald-700 mb-4">Email Notifications</h3>
                                            <div className="space-y-4">
                                                {Object.entries(notificationSettings.email).map(([key, value]) => (
                                                    <div key={key} className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-emerald-700 capitalize">
                                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                                            </p>
                                                        </div>
                                                        <Switch
                                                            checked={value}
                                                            onChange={(newValue) => updateNotificationSetting('email', key, newValue)}
                                                            className={`${
                                                                value ? 'bg-emerald-600' : 'bg-gray-300'
                                                            } relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
                                                        >
                                                            <span className={`${
                                                                value ? 'translate-x-6' : 'translate-x-1'
                                                            } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                                                        </Switch>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Push Notifications */}
                                        <div>
                                            <h3 className="text-lg font-medium text-emerald-700 mb-4">Push Notifications</h3>
                                            <div className="space-y-4">
                                                {Object.entries(notificationSettings.push).map(([key, value]) => (
                                                    <div key={key} className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-emerald-700 capitalize">
                                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                                            </p>
                                                        </div>
                                                        <Switch
                                                            checked={value}
                                                            onChange={(newValue) => updateNotificationSetting('push', key, newValue)}
                                                            className={`${
                                                                value ? 'bg-emerald-600' : 'bg-gray-300'
                                                            } relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
                                                        >
                                                            <span className={`${
                                                                value ? 'translate-x-6' : 'translate-x-1'
                                                            } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                                                        </Switch>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* SMS Notifications */}
                                        <div>
                                            <h3 className="text-lg font-medium text-emerald-700 mb-4">SMS Notifications</h3>
                                            <div className="space-y-4">
                                                {Object.entries(notificationSettings.sms).map(([key, value]) => (
                                                    <div key={key} className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-emerald-700 capitalize">
                                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                                            </p>
                                                        </div>
                                                        <Switch
                                                            checked={value}
                                                            onChange={(newValue) => updateNotificationSetting('sms', key, newValue)}
                                                            className={`${
                                                                value ? 'bg-emerald-600' : 'bg-gray-300'
                                                            } relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
                                                        >
                                                            <span className={`${
                                                                value ? 'translate-x-6' : 'translate-x-1'
                                                            } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                                                        </Switch>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Appearance Tab */}
                            {activeTab === 'appearance' && (
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-emerald-700 mb-6">Appearance Settings</h2>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-emerald-700 mb-2">
                                                    Theme
                                                </label>
                                                <select
                                                    value={appearanceSettings.theme}
                                                    onChange={(e) => setAppearanceSettings(prev => ({ ...prev, theme: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                >
                                                    <option value="light">Light</option>
                                                    <option value="dark">Dark</option>
                                                    <option value="system">System Default</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-emerald-700 mb-2">
                                                    Language
                                                </label>
                                                <select
                                                    value={appearanceSettings.language}
                                                    onChange={(e) => setAppearanceSettings(prev => ({ ...prev, language: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                >
                                                    <option value="en">English</option>
                                                    <option value="si">Sinhala</option>
                                                    <option value="ta">Tamil</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-emerald-700 mb-2">
                                                    Currency
                                                </label>
                                                <select
                                                    value={appearanceSettings.currency}
                                                    onChange={(e) => setAppearanceSettings(prev => ({ ...prev, currency: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                >
                                                    <option value="LKR">Sri Lankan Rupee (LKR)</option>
                                                    <option value="USD">US Dollar (USD)</option>
                                                    <option value="EUR">Euro (EUR)</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-emerald-700 mb-2">
                                                    Date Format
                                                </label>
                                                <select
                                                    value={appearanceSettings.dateFormat}
                                                    onChange={(e) => setAppearanceSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                >
                                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-emerald-700 mb-2">
                                                    Time Format
                                                </label>
                                                <select
                                                    value={appearanceSettings.timeFormat}
                                                    onChange={(e) => setAppearanceSettings(prev => ({ ...prev, timeFormat: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                >
                                                    <option value="12h">12 Hour</option>
                                                    <option value="24h">24 Hour</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-emerald-700 mb-2">
                                                    Font Size
                                                </label>
                                                <select
                                                    value={appearanceSettings.fontSize}
                                                    onChange={(e) => setAppearanceSettings(prev => ({ ...prev, fontSize: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                >
                                                    <option value="small">Small</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="large">Large</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Privacy Tab */}
                            {activeTab === 'privacy' && (
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-emerald-700 mb-6">Privacy Settings</h2>

                                    <div className="space-y-6">
                                        {[
                                            { key: 'showOnlineStatus', label: 'Show Online Status', desc: 'Let others see when you are online' },
                                            { key: 'showLastSeen', label: 'Show Last Seen', desc: 'Let others see when you were last active' },
                                            { key: 'allowDirectMessages', label: 'Allow Direct Messages', desc: 'Allow other users to send you messages' },
                                            { key: 'showContactInfo', label: 'Show Contact Information', desc: 'Display your contact information on your profile' },
                                            { key: 'dataSharing', label: 'Data Sharing', desc: 'Share anonymized data to improve our services' },
                                            { key: 'analyticsOptIn', label: 'Analytics', desc: 'Help us improve by sharing usage analytics' }
                                        ].map(({ key, label, desc }) => (
                                            <div key={key} className="flex items-center justify-between py-4 border-b border-emerald-50 last:border-b-0">
                                                <div>
                                                    <p className="text-sm font-medium text-emerald-700">{label}</p>
                                                    <p className="text-sm text-gray-500">{desc}</p>
                                                </div>
                                                <Switch
                                                    checked={privacySettings[key]}
                                                    onChange={(value) => setPrivacySettings(prev => ({ ...prev, [key]: value }))}
                                                    className={`${
                                                        privacySettings[key] ? 'bg-emerald-600' : 'bg-gray-300'
                                                    } relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
                                                >
                                                    <span className={`${
                                                        privacySettings[key] ? 'translate-x-6' : 'translate-x-1'
                                                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                                                </Switch>
                                            </div>
                                        ))}

                                        <div className="pt-4">
                                            <label className="block text-sm font-medium text-emerald-700 mb-2">
                                                Profile Visibility
                                            </label>
                                            <select
                                                value={privacySettings.profileVisibility}
                                                onChange={(e) => setPrivacySettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
                                                className="w-full max-w-xs px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            >
                                                <option value="public">Public</option>
                                                <option value="private">Private</option>
                                                <option value="friends">Friends Only</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Chat Tab */}
                            {activeTab === 'chat' && (
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-emerald-700 mb-6">Chat Settings</h2>

                                    <div className="space-y-6">
                                        {[
                                            { key: 'readReceipts', label: 'Read Receipts', desc: 'Let others know when you\'ve read their messages' },
                                            { key: 'onlineStatus', label: 'Online Status', desc: 'Show when you\'re online in chat' },
                                            { key: 'messagePreview', label: 'Message Preview', desc: 'Show message previews in notifications' },
                                            { key: 'soundNotifications', label: 'Sound Notifications', desc: 'Play sound when receiving messages' },
                                            { key: 'autoArchive', label: 'Auto Archive', desc: 'Automatically archive old conversations' },
                                            { key: 'blockUnknown', label: 'Block Unknown Users', desc: 'Block messages from users not in your contacts' }
                                        ].map(({ key, label, desc }) => (
                                            <div key={key} className="flex items-center justify-between py-4 border-b border-emerald-50 last:border-b-0">
                                                <div>
                                                    <p className="text-sm font-medium text-emerald-700">{label}</p>
                                                    <p className="text-sm text-gray-500">{desc}</p>
                                                </div>
                                                <Switch
                                                    checked={chatSettings[key]}
                                                    onChange={(value) => updateChatSetting(key, value)}
                                                    className={`${
                                                        chatSettings[key] ? 'bg-emerald-600' : 'bg-gray-300'
                                                    } relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
                                                >
                                                    <span className={`${
                                                        chatSettings[key] ? 'translate-x-6' : 'translate-x-1'
                                                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                                                </Switch>
                                            </div>
                                        ))}

                                        {/* Chat History */}
                                        <div className="pt-6 border-t border-emerald-100">
                                            <h3 className="text-lg font-medium text-emerald-700 mb-4">Chat History</h3>
                                            <div className="space-y-4">
                                                <button className="w-full sm:w-auto px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors">
                                                    Export Chat History
                                                </button>
                                                <button className="w-full sm:w-auto px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors ml-0 sm:ml-3">
                                                    Clear All Chat History
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}