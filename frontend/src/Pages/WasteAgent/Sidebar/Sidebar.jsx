import { ArrowRightStartOnRectangleIcon, Cog8ToothIcon, UserIcon } from '@heroicons/react/24/solid';
import SidebarItem from './SidebarItem';

const menu = [
    { label: 'Waste Listings', to: '' },
    { label: 'Browse by Location', to: 'browse-location' },
    { label: 'Browse by Type', to: 'browse-type' },
    { label: 'Saved Listings', to: 'saved' },
    { label: 'My Orders', to: 'my-orders' },
    {
        label: 'Order Management',
        children: [
            { label: 'Active Orders', to: 'orders/active' },
            { label: 'Pending Pickup', to: 'orders/pending' },
            { label: 'Completed Orders', to: 'orders/completed' },
        ],
    },
    {
        label: 'Logistics',
        children: [
            { label: 'Pickup Scheduling', to: 'logistics/pickup' },
            { label: 'Transportation', to: 'logistics/transport' },
        ],
    },
    { label: 'Payments', to: 'payments' },
    { label: 'Reviews & Ratings', to: 'reviews-ratings' },
];

export default function Sidebar() {
    return (
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between min-h-screen">
            <div>
                <div className="flex items-center mb-8">
                    <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center text-white font-bold text-xl mr-3">F</div>
                    <span className="font-bold text-lg text-gray-900 dark:text-gray-100">Farmio</span>
                </div>
                <div className="flex items-center mb-8">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="profile" className="w-10 h-10 rounded-full mr-3" />
                    <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">John Green <span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs px-2 py-0.5 rounded ml-1">Agent</span></div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">john.green@wasteco.com</div>
                    </div>
                </div>
                <nav className="flex flex-col gap-2">
                    <ul>
                        {menu.map(item => (
                            <SidebarItem key={item.label} {...item} />
                        ))}
                    </ul>
                </nav>
            </div>
            <div>
                <div className="flex flex-col gap-2">
                    <button
                        className="flex items-center gap-4 text-gray-700 dark:text-gray-300 hover:text-green-500 transition text-sm"
                        aria-label="Settings"
                    >
                        <Cog8ToothIcon className="h-7 w-8 flex-shrink-0" />
                        <span>Settings</span>
                    </button>

                    <button
                        className="flex items-center gap-4 text-gray-700 dark:text-gray-300 hover:text-green-500 transition text-sm"
                        aria-label="User Profile"
                    >
                        <UserIcon className="h-7 w-8 flex-shrink-0" />
                        <span>User</span>
                    </button>

                    <button
                        className="flex items-center gap-4 text-gray-700 dark:text-gray-300 hover:text-red-500 transition text-sm"
                        aria-label="Logout"
                    >
                        <ArrowRightStartOnRectangleIcon className="h-7 w-8 flex-shrink-0" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
