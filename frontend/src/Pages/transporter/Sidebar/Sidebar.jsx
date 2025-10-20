import { 
  ArrowRightStartOnRectangleIcon, 
  Cog8ToothIcon, 
  UserIcon,
  HomeIcon,
  TruckIcon,
  ClipboardDocumentCheckIcon,
  MapIcon,
  CogIcon,
  ClockIcon,
  StarIcon,
  BellIcon,
  ChartBarIcon
} from '@heroicons/react/24/solid';
import SidebarItem from './SidebarItem';
import { Link } from 'react-router-dom';

const menu = [
  { 
    label: 'Dashboard', 
    to: 'dashboard', 
    icon: HomeIcon 
  },
  { 
    label: 'Available Loads', 
    to: 'availableLoads', 
    icon: TruckIcon 
  },{
    label: 'Assigned Loads', 
    to: 'assignedLoads/all', 
    icon: ClipboardDocumentCheckIcon
  },
  { 
    label: 'My Deliveries', 
    to: 'assignedLoads/all',
    icon: ClipboardDocumentCheckIcon,
    children: [
      { label: 'Confirm Pickup', to: 'confirmPickup/id' },
      { label: 'Confirm Delivery', to: 'confirmDelivery/id' },
    ]
  },
  // { 
  //   label: 'Route Planner', 
  //   to: 'routePlanner', 
  //   icon: MapIcon 
  // },
  { 
    label: 'Delivery History', 
    to: 'deliveryHistory', 
    icon: ClockIcon 
  },
  // { 
  //   label: 'Ratings & Feedback', 
  //   to: 'ratingsFeedback', 
  //   icon: StarIcon 
  // },
   { 
    label: 'Vehicle Info', 
    to: 'vehicleInfo', 
    icon: CogIcon 
  },
  // { 
  //   label: 'Notifications', 
  //   to: 'notifications', 
  //   icon: BellIcon 
  // },
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
          <img 
            src="https://randomuser.me/api/portraits/men/20.jpg" 
            alt="profile" 
            className="w-10 h-10 rounded-full mr-3" 
          />
          <div>
            <div className="font-semibold">
              Chamath Abeysinghe 
              <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded ml-1">Pro</span>
            </div>
            <div className="text-xs text-gray-500">chamath@gmail.com</div>
          </div>
        </div>
        
        <nav className="flex flex-col gap-1">
          <ul>
            {menu.map(item => (
              <SidebarItem 
                key={item.label} 
                label={item.label} 
                to={item.to} 
                icon={item.icon}
                children={item.children}
              />
            ))}
          </ul>
        </nav>
      </div>
      
      <div className="mt-auto">
        <div className="flex flex-col gap-1">
          <Link
            to="/settings"
            className="flex items-center gap-3 p-2 text-gray-700 hover:text-green-500 hover:bg-green-50 rounded-lg transition text-sm"
          >
            <Cog8ToothIcon className="h-5 w-5" />
            <span>Settings</span>
          </Link>

          <Link
            to="/profile"
            className="flex items-center gap-3 p-2 text-gray-700 hover:text-green-500 hover:bg-green-50 rounded-lg transition text-sm"
          >
            <UserIcon className="h-5 w-5" />
            <span>Profile</span>
          </Link>

          <Link
            to="/logout"
            className="flex items-center gap-3 p-2 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-lg transition text-sm"
          >
            <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
