import { ArrowRightStartOnRectangleIcon, Cog8ToothIcon, UserIcon } from '@heroicons/react/24/solid';
import SidebarItem from './SidebarItem';
import { chain } from 'lodash';
import { Children } from 'react';

const menu = [
    { label: 'Dashboard', to: 'dashboard' },
  { label: 'Available Loads', to: 'availableLoads' },
  { label: 'My Deliveries', to: 'assignedLoads/all',
    Children: [
        {label:'confirmPickup', to: 'confirm/id'},
        {label:'confirmDelivery', to: 'confirmDelivery'},
    ]
   },
  { label: 'Pickup & Drop Points', to: 'pickupDropPoints',},
  { label: 'Route Planner', to: 'routePlanner' },
  { label: 'Vehicle Info', to: 'vehicleInfo' },
  { label: 'Delivery History', to: 'loads/history' },
  { label: 'Ratings & Feedback', to: 'feedback' },
  { label: 'Notifications', to: 'notifications' },
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
                    <img src="https://randomuser.me/api/portraits/men/20.jpg" alt="profile" className="w-10 h-10 rounded-full mr-3" />
                    <div>
                        <div className="font-semibold">Chamath Abeysinghe <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded ml-1">Pro</span></div>
                        <div className="text-xs text-gray-500">chamath@gmail.com</div>
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
                {/* <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-xs">Product Plan</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        <span className="text-xs">Campaign</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                        <span className="text-xs">Stock Product</span>
                    </div>
                </div> */}
                {/* <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                        <span>Storage Product</span>
                        <button className="text-green-600 font-semibold">Upgrade</button>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded">
                        <div className="h-2 bg-green-500 rounded" style={{ width: '70%' }}></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">70% of products have been uploaded</div>
                </div> */}
                <div className="flex flex-col gap-2">
                    <button
                        className="flex items-center gap-4 text-gray-700 hover:text-green-500 transition text-sm"
                        aria-label="Settings"
                    >
                        <Cog8ToothIcon className="h-7 w-8 flex-shrink-0" />
                        <span>Settings</span>
                    </button>

                    <button
                        className="flex items-center gap-4 text-gray-700 hover:text-green-500 transition text-sm"
                        aria-label="User Profile"
                    >
                        <UserIcon className="h-7 w-8 flex-shrink-0" />
                        <span>User</span>
                    </button>

                    <button
                        className="flex items-center gap-4 text-gray-700 hover:text-red-500 transition text-sm"
                        aria-label="Logout"
                    >
                        <ArrowRightStartOnRectangleIcon className="h-7 w-8 flex-shrink-0" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );

    // return (
    //     <aside className="w-64 p-4 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-auto">
    //         <ul>
    //             {menu.map(item => (
    //                 <SidebarItem key={item.label} {...item} />
    //             ))}
    //         </ul>
    //     </aside>
    // );
}
