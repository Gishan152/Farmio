import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import ThemeToggle from '../Components/ThemeToggle';

export default function SettingsPage() {
    const tabs = ['Theme', 'Profile', 'Password', 'Notifications', 'Chat'];
    const [activeTab, setActiveTab] = useState('Theme');

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-60 bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold dark:text-gray-100 mb-6">Settings</h2>
                <nav className="space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full text-left px-4 py-2 rounded ${activeTab === tab
                                ? 'bg-blue-100 dark:bg-blue-900 font-medium'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {activeTab === 'Theme' && <ThemePanel />}
                {activeTab === 'Profile' && <ProfilePanel />}
                {activeTab === 'Password' && <PasswordPanel />}
                {activeTab === 'Notifications' && <NotificationsPanel />}
                {activeTab === 'Chat' && <ChatPanel />}
            </main>
        </div>
    );
}

function ThemePanel() {
    return (
        <section className="space-y-4">
            <h3 className="text-2xl font-semibold dark:text-gray-100">Theme</h3>
            <ThemeToggle />
        </section>
    );
}

function ProfilePanel() {
    return (
        <section className="space-y-4">
            <h3 className="text-2xl font-semibold dark:text-gray-100">Profile</h3>
            <form className="space-y-4 max-w-md">
                <div>
                    <label className="block text-sm font-medium dark:text-gray-200">Username</label>
                    <input type="text" className="mt-1 w-full p-2 border dark:bg-gray-700 rounded" placeholder="Your username" />
                </div>
                <div>
                    <label className="block text-sm font-medium dark:text-gray-200">Email</label>
                    <input type="email" className="mt-1 w-full p-2 border dark:bg-gray-700 rounded" placeholder="you@example.com" />
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Profile</button>
            </form>
        </section>
    );
}


function PasswordPanel() {
    return (
        <section className="space-y-4">
            <h3 className="text-2xl font-semibold dark:text-gray-100">Password</h3>
            <form className="space-y-4 max-w-md">
                {['Current', 'New', 'Confirm New'].map(label => (
                    <div key={label}>
                        <label className="block text-sm font-medium dark:text-gray-200">{label} Password</label>
                        <input type="password" className="mt-1 w-full p-2 border dark:bg-gray-700 rounded" />
                    </div>
                ))}
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Change Password</button>
            </form>
        </section>
    );
}


function NotificationsPanel() {
    const [settings, setSettings] = useState({ email: true, push: false });
    return (
        <section className="space-y-4">
            <h3 className="text-2xl font-semibold dark:text-gray-100">Notifications</h3>
            {Object.entries(settings).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between max-w-md">
                    <span className="capitalize dark:text-gray-200">{key} notifications</span>
                    <Switch checked={val} onChange={v => setSettings(s => ({ ...s, [key]: v }))} className={`${val ? 'bg-blue-600' : 'bg-gray-300'} relative inline-flex items-center h-6 rounded-full w-11`}>
                        <span className={`${val ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full`} />
                    </Switch>
                </div>
            ))}
        </section>
    );
}


function ChatPanel() {
    const [readReceipt, setReadReceipt] = useState(true);
    return (
        <section className="space-y-4">
            <h3 className="text-2xl font-semibold dark:text-gray-100">Chat Settings</h3>
            <div className="flex items-center justify-between max-w-md">
                <span className="dark:text-gray-200">Read Receipts</span>
                <Switch checked={readReceipt} onChange={setReadReceipt} className={`${readReceipt ? 'bg-blue-600' : 'bg-gray-300'} relative inline-flex items-center h-6 rounded-full w-11`}>
                    <span className={`${readReceipt ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full`} />
                </Switch>
            </div>
        </section>
    );
}
