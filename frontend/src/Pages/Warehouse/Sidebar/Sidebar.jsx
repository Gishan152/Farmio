import { Link } from 'react-router-dom';
import {
    ArrowRightStartOnRectangleIcon,
    Cog8ToothIcon,
    UserIcon,
    BuildingStorefrontIcon,
    CalendarIcon,
    CreditCardIcon,
    UsersIcon,
    BellIcon,
    ChartBarIcon,
    TrashIcon,
    DocumentTextIcon
} from '@heroicons/react/24/solid';
import SidebarItem from './SidebarItem';

const menu = [
    { label: 'Dashboard', to: '/warehouse', icon: ChartBarIcon },
    { label: 'Facility Management', to: '/warehouse/facilities', icon: BuildingStorefrontIcon },
    { label: 'Slot Management', to: '/warehouse/slots', icon: CalendarIcon },
    { label: 'Booking Management', to: '/warehouse/bookings', icon: CreditCardIcon },
    { label: 'Payment Management', to: '/warehouse/payments', icon: CreditCardIcon },
    { label: 'Waste Agent Management', to: '/warehouse/waste-agents', icon: TrashIcon },
    { label: 'Waste Requests', to: '/warehouse/waste-requests', icon: DocumentTextIcon },
    // { label: 'Notifications', to: '/warehouse/notifications', icon: BellIcon },
    // { label: 'Analytics', to: '/warehouse/analytics', icon: ChartBarIcon }
];

export default function Sidebar() {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between min-h-screen">
            <div>
                <div className="flex items-center mb-8">
                    <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center text-white font-bold text-xl mr-3">F</div>
                    <span className="font-bold text-lg">Farmio</span>
                </div>
                <div className="flex items-center mb-8">
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="profile" className="w-10 h-10 rounded-full mr-3" />
                    <div>
                        <div className="font-semibold">Kithmini Mayodya<span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded ml-1">Pro</span></div>
                        <div className="text-xs text-gray-500">kithmini@gmail.com</div>
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
                    <Link
                        to="/warehouse/settings"
                        className="flex items-center gap-4 text-gray-700 hover:text-green-500 transition text-sm"
                        aria-label="Settings"
                    >
                        <Cog8ToothIcon className="h-7 w-8 flex-shrink-0" />
                        <span>Settings</span>
                    </Link>
                    <Link
                        to="/warehouse/profile"
                        className="flex items-center gap-4 text-gray-700 hover:text-green-500 transition text-sm"
                        aria-label="User Profile"
                    >
                        <UserIcon className="h-7 w-8 flex-shrink-0" />
                        <span>User</span>
                    </Link>
                    <Link
                        to="/logout"
                        className="flex items-center gap-4 text-gray-700 hover:text-red-500 transition text-sm"
                        aria-label="Logout"
                    >
                        <ArrowRightStartOnRectangleIcon className="h-7 w-8 flex-shrink-0" />
                        <span>Logout</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
}