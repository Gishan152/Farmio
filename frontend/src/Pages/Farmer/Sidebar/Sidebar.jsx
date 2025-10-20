import { ArrowRightStartOnRectangleIcon, Cog8ToothIcon, UserIcon } from '@heroicons/react/24/solid';
import SidebarItem from './SidebarItem';
import Profilepicture from "../../../Assets/Farmer/Profile Pictures/2.1.jpg";
import { Link, useNavigate } from "react-router-dom";


const menu = [
    { label: 'My Products', to: 'MyProducts' },
    { label: 'Orders', 
         children: [
            {label: 'Awaiting Shipment' , to:'orders/Awaiting Shipment'},
            {label: 'Ongoing Shipment' , to:'orders/Ongoing Shipment'},
            {label: 'Paid and Shiped' , to:'orders/Paid and Shiped'},
            {label: 'Returns' , to:'orders/Returns'}
         ]
    },
     { label: 'Buyer Requests',
        children: [
            { label: 'Requests', to: 'requests' },
            { label: 'Status of Offers', to: 'offers' },
        ],
    },
    { label: 'Market Research', to: 'crops'},
    { label: 'Farmio Prices', to: 'prices'},
    {
        label: 'Warehouses',
        children: [
            { label: 'Warehouses', to: 'warehouses' },
            { label: 'Reserved Storage Units', to: 'warehouses/reserved' },
        ],
    },
    {
        label: 'Transport', to: 'transport/schedules'
    },
     {
        label: 'Waste Management',
        children: [
            { label: 'Waste Agents', to: 'wastemanagement' },
            { label: 'Waste Requests', to: 'waste-requests' },
        ],
    },
    { label: 'Payments', to: 'payments'},
    { label: 'Chat  💬', to: 'chat'},
];

export default function Sidebar() {
    const navigate = useNavigate();

    return (
        <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between min-h-screen">
            <div>
               <div className="flex items-center gap-6 mb-7">

                        {/* 1. The Logo Circle */}
                        {/* We removed the text from inside for a cleaner look */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md">
                            {/* An initial like 'F' is a common and clean design choice */}
                            <span className="text-white text-lg font-bold">F</span>
                        </div>

                        {/* 2. The Brand Name */}
                        <div className="text-2xl font-extrabold text-gray-800 tracking-tight">
                            farmio.
                        </div> 

                </div>
               <Link  to="/farmer/profile"  className="flex items-center gap-4 text-gray-700 hover:text-green-500 transition text-sm"  aria-label="User Profile"
                >  
                <div className="flex items-center mb-8">
                    <img src={Profilepicture} alt="profile" className="w-10 h-10 rounded-full mr-3" />
                    <div>
                        <div className="font-semibold">Manuja Ransa <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded ml-1">Pro</span></div>
                        <div className="text-xs text-gray-500">ransaramanuja@gmail.com</div>
                    </div>
                </div> 
             </Link>
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

                    <Link
                        to="/farmer/profile"
                        className="flex items-center gap-4 text-gray-700 hover:text-green-500 transition text-sm"
                        aria-label="User Profile"
                        >
                        <UserIcon className="h-7 w-8 flex-shrink-0" />
                        <span>User</span>
                  </Link>

                    <button
                        className="flex items-center gap-4 text-gray-700 hover:text-red-500 transition text-sm"
                        aria-label="Logout"
                        onClick={() => navigate('/logout')}
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
