import { createBrowserRouter, RouterProvider } from "react-router";
import './App.css'
import LandingPage from './Pages/LandingPage';
import Root from './Pages/Root';
import Login, { loginAction, loginLoader } from './Pages/LoginRegister/Login';
import Registration, { RegistrationAction, RegistrationLoader } from './Pages/LoginRegister/Registration';
import FarmerRegistration, { FarmerRegistrationAction, FarmerRegistrationLoader } from './Pages/LoginRegister/FarmerRegistration';
import BuyerRegistration, { BuyerRegistrationAction, BuyerRegistrationLoader } from './Pages/LoginRegister/BuyerRegistration';
import WarehouseProviderRegistration, { WarehouseProviderRegistrationAction, WarehouseProviderRegistrationLoader } from './Pages/LoginRegister/WarehouseProviderRegistration';
import TransportProviderRegistration, { TransportProviderRegistrationAction, TransportProviderRegistrationLoader } from './Pages/LoginRegister/TransportProviderRegistration';
import WasteAgentRegistration, { WasteAgentRegistrationAction, WasteAgentRegistrationLoader } from './Pages/LoginRegister/WasteAgentRegistration';
import ProductPage from './Pages/ProductsPage';
import BuyerLayout from './Pages/Buyer/BuyerLayout';
import Crops from './Pages/Buyer/Sections/Crops';
import Warehouses from './Pages/Buyer/Sections/Warehouses';
import ReservedStorage, { reservedLoader } from './Pages/Buyer/Sections/ReservedStorage';
import TransportProviders, { transportProvidersLoader } from './Pages/Buyer/Sections/TransportProviders';
import TransportSchedules from './Pages/Buyer/Sections/TransportSchedules';
import CropDetails, { cropDetailsLoader } from './Pages/Buyer/Sections/CropDetails';
import WarehouseDetails, { warehouseDetailsLoader } from './Pages/Buyer/Sections/WarehouseDetails';
import Saves from './Pages/Buyer/Sections/Saves';
import OrderConfirmation from './Pages/Buyer/Sections/OrderConfirmation';
import CropTransport from './Pages/Buyer/Sections/CropTransport';
import Orders from './Pages/Buyer/Sections/Orders';
import CreateTransportJob from './Pages/Buyer/Sections/CreateTransport';


import WarehouseLayout from './Pages/Warehouse/WarehouseLayout';
import Dashboard from './Pages/Warehouse/Sections/Dashboard';
import FacilityManagement from './Pages/Warehouse/Sections/FacilityManagement';
import SlotManagement from './Pages/Warehouse/Sections/SlotManagement';
import BookingManagement from './Pages/Warehouse/Sections/BookingManagement';
import PaymentManagement from './Pages/Warehouse/Sections/PaymentManagement';
import WasteAgent from './Pages/Warehouse/Sections/WasteAgent';
import Notifications from './Pages/Warehouse/Sections/Notifications';
import Analytics from './Pages/Warehouse/Sections/Analytics';

let router = createBrowserRouter([
	// {
	//   path: "/",
	//   Component: Root,
	//   children: [
	//     {
	//       path: "shows/:showId",
	//       Component: Show,
	//       loader: ({ request, params }) =>
	//         fetch(`/api/show/${params.showId}.json`, {
	//           signal: request.signal,
	//         }),
	//     },
	//   ],
	// },
	{
		index: true,
		Component: LandingPage
	},
	{
		path: "/login",
		loader: loginLoader,
		action: loginAction,
		Component: Login
	},
	{
		path: "/register",
		loader: RegistrationLoader,
		action: RegistrationAction,
		Component: Registration
	},
	{
		path: "/register/farmer",
		loader: FarmerRegistrationLoader,
		action: FarmerRegistrationAction,
		Component: FarmerRegistration,
	},
	{
		path: "/register/buyer",
		loader: BuyerRegistrationLoader,
		action: BuyerRegistrationAction,
		Component: BuyerRegistration,
	},
	{
		path: "/register/warehouse-provider",
		loader: WarehouseProviderRegistrationLoader,
		action: WarehouseProviderRegistrationAction,
		Component: WarehouseProviderRegistration,
	},
	{
		path: "/register/transport-provider",
		loader: TransportProviderRegistrationLoader,
		action: TransportProviderRegistrationAction,
		Component: TransportProviderRegistration,
	},
	{
		path: "/register/waste-agent",
		loader: WasteAgentRegistrationLoader,
		action: WasteAgentRegistrationAction,
		Component: WasteAgentRegistration,
	},
	{
		path: "/user",
		Component: Root,
		children: [

		]
	},
	{
		path: "/products",
		Component: ProductPage
	},
	{
		path: '/buyer',
		Component: BuyerLayout,
		children: [
			{ 
				index: true,
				Component: Crops
			},
			{ 
				path: 'crops',
				Component: Crops
			},
			{
				path: "crops/:cropId",
				Component: CropDetails,
				loader: cropDetailsLoader
			},
			{
				path: "saves",
				Component: Saves
			},
			{
				path: "orders",
				Component: Orders
			},
			{
				path: "order-confirmation",
				Component: OrderConfirmation
			},
			{
				path: "transport-confirmation",
				Component: CropTransport
			},
			{
				path: 'warehouse',				
				children: [
					{ 
						path: 'all',
						Component: Warehouses
					},
					{ 
						path: 'reserved',
						Component: ReservedStorage,
						loader: reservedLoader
					},
					{
						path: ":warehouseId",
						Component: WarehouseDetails,
						loader: warehouseDetailsLoader
					},
				],
			},
			{
				path: 'transport',
				children: [
					{ 
						path: 'providers',
						Component: TransportProviders,
						loader: transportProvidersLoader
					},
					{ 
						path: 'create',
						Component: CreateTransportJob,
					},
					{ 
						path: 'schedules',
						Component: TransportSchedules
					},
				],
			},
		],
	},	
{
    path: '/warehouse',
    Component: WarehouseLayout,
    children: [
        { 
            index: true,
            Component: Dashboard
        },
        { 
            path: 'facilities',
            Component: FacilityManagement
        },
        { 
            path: 'slots',
            Component: SlotManagement
        },
        { 
            path: 'bookings',
            Component: BookingManagement
        },
        { 
            path: 'payments',
            Component: PaymentManagement
        },
        { 
            path: 'waste-agents',
            Component: WasteAgent
        },
        { 
            path: 'notifications',
            Component: Notifications
        },
        { 
            path: 'analytics',
            Component: Analytics
        }
    ],
},
]);


function App() {
	return (
		<RouterProvider router={router} />
	)
}






export default App
