import { useState } from 'react'
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
import TransLayout from './Pages/transporter/TransLayout';
import Dashboard from './Pages/transporter/Sections/Dashboard';
import AvailableLoads from './Pages/transporter/Sections/AvailableLoads';
import AssignedLoads from './Pages/transporter/Sections/AssignedLoads';
import PickupDropPoints from './Pages/transporter/Sections/PickupDropPoints';
import ConfirmPickup from './Pages/transporter/Sections/ConfirmPickup';
import RoutePlanner from './Pages/transporter/Sections/RoutePlanner';
import VehicleInfo from './Pages/transporter/Sections/VehicleInfo';
import DeliveryHistory from './Pages/transporter/Sections/DeliveryHostory';
import RatingsFeedback from './Pages/transporter/Sections/RatingsFeedback';

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
	},{
		path: '/transporter',
		Component: TransLayout,
		children: [
			{ 
				index: true,
				Component: Dashboard
			},
			{
				path: 'dashboard',
				Component: Dashboard
			},
			{
				path: 'availableLoads',
				Component: AvailableLoads,
			},
			{
				path: 'assignedLoads',
				children: [
					{ 
						path: 'all',
						Component: AssignedLoads,
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
					}
				],
			},
			{
				path:'pickupDropPoints',
				Component: PickupDropPoints,
				children:[
					{
						path: 'confirm/loadID', 
						Component: ConfirmPickup
					}
				]
			},
			{
				path: 'routePlanner',
				Component: RoutePlanner
			},
			{
				path: 'vehicleInfo',
				Component: VehicleInfo
			},
			{
				path: 'deliveryHistory',
				Component:DeliveryHistory
			},
			{
				path: 'ratingsFeedback',
				Component:RatingsFeedback
			}
			
		]
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
				path: 'warehouses',
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
					}
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
]);


function App() {
	return (
		<RouterProvider router={router} />
	)
}

export default App
