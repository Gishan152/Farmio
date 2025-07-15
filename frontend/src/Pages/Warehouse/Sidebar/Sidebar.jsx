import { Link, useLocation } from 'react-router-dom';
import { 
    HomeIcon, 
    BuildingStorefrontIcon, 
    ViewColumnsIcon,
    CalendarIcon,
    CreditCardIcon,
    TrashIcon,
    BellIcon,
    ChartBarIcon,
    Cog8ToothIcon,
    ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

const menu = [
    { label: 'Dashboard', to: '/warehouse', icon: HomeIcon },
    { label: 'Facility Management', to: '/warehouse/facilities', icon: BuildingStorefrontIcon },
    { label: 'Slot Management', to: '/warehouse/slots', icon: ViewColumnsIcon },
    { label: 'Booking Management', to: '/warehouse/bookings', icon: CalendarIcon },
    { label: 'Payment Management', to: '/warehouse/payments', icon: CreditCardIcon },
    { label: 'Waste Agent Management', to: '/warehouse/waste-agents', icon: TrashIcon },
    { label: 'Notifications', to: '/warehouse/notifications', icon: BellIcon },
    { label: 'Analytics', to: '/warehouse/analytics', icon: ChartBarIcon }
];

function SidebarItem({ label, to, icon: Icon }) {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <li>
            <Link
                to={to}
                className={`flex items-center gap-4 py-3 px-4 rounded-lg transition ${
                    isActive
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
                <Icon className="h-6 w-6 flex-shrink-0" />
                <span>{label}</span>
            </Link>
        </li>
    );
}

export default function Sidebar() {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between min-h-screen">
            <div>
                <div className="flex items-center mb-8">
                    <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center text-white font-bold text-xl mr-3">F</div>
                    <span className="font-bold text-lg">Farmio</span>
                </div>
                
                <div className="flex items-center mb-8">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="profile" className="w-10 h-10 rounded-full mr-3" />
                    <div>
                        <div className="font-semibold">John Doe <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded ml-1">Owner</span></div>
                        <div className="text-xs text-gray-500">warehouse@farmio.com</div>
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

            <div className="flex flex-col gap-2">
                <button className="flex items-center gap-4 text-gray-700 hover:text-green-500 transition text-sm">
                    <Cog8ToothIcon className="h-6 w-6 flex-shrink-0" />
                    <span>Settings</span>
                </button>
                <button className="flex items-center gap-4 text-gray-700 hover:text-red-500 transition text-sm">
                    <ArrowRightOnRectangleIcon className="h-6 w-6 flex-shrink-0" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}