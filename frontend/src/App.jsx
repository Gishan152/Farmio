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
//farmer
import FarmerLayout from './Pages/Farmer/FarmerLayout';
import FarmerCrops, {FarmercropsLoader} from './Pages/Farmer/Sections/Crops';
import FarmerWarehouses from './Pages/Farmer/Sections/Warehouses';
import FarmerReservedStorage, { FarmerreservedLoader } from './Pages/Farmer/Sections/ReservedStorage';
import FarmerTransportProviders, { FarmertransportProvidersLoader } from './Pages/Farmer/Sections/TransportProviders';
import FarmerTransportSchedules from './Pages/Farmer/Sections/TransportSchedules';
import FarmerCropDetails, { FarmercropDetailsLoader } from './Pages/Farmer/Sections/CropDetails';
import FarmerWarehouseDetails, { FarmerwarehouseDetailsLoader } from './Pages/Farmer/Sections/WarehouseDetails';
import FarmerCropTransport from './Pages/Farmer/Sections/CropTransport';
import FarmerCreateTransportJob from './Pages/Farmer/Sections/CreateTransport';
import MyProducts from './Pages/Farmer/Sections/MyProducts';
import MyProductsDetails from './Pages/Farmer/Sections/MyProductsDetails';
import MyProductsDetailsLoader from './Pages/Farmer/Sections/MyProductsDetails';
import BuyerRequests from './Pages/Farmer/Sections/BuyerRequests'
import BuyerRequestsLoader from './Pages/Farmer/Sections/BuyerRequests'
import FarmioPrices from './Pages/Farmer/Sections/FarmioPrices'
import FarmioPricesLoader from './Pages/Farmer/Sections/FarmioPrices'
import AwaitingShipment from './Pages/Farmer/Sections/AwaitingShipment';
import OngoingShipment from './Pages/Farmer/Sections/OngoingShipment';
import PaidandShiped from './Pages/Farmer/Sections/PaidandShiped';
import ReturnShipment from './Pages/Farmer/Sections/ReturnShipment';
import WasteAgents from './Pages/Farmer/Sections/WasteAgents';
import FarmerChat from './Pages/Farmer/Sections/FarmerChat';
import Offers from './Pages/Farmer/Sections/Offerstobuyers';
import FarmerProfile from './Pages/Farmer/Sections/FarmerProfile';
import FarmerPayments from './Pages/Farmer/Sections/FarmerPayments';



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
		{
		path: '/farmer',
		Component: FarmerLayout,
		children: [
			{ 
				index: true,
				Component: MyProducts
			},
			{ 
				path: 'MyProducts',
				Component: MyProducts
			},
			{
				path: "MyProducts/:MyProductId",
				Component:  MyProductsDetails,
				loader: MyProductsDetailsLoader
			},
			{ 
				path: 'crops',
				Component: FarmerCrops,
				loader: FarmercropsLoader
			},
			{ 
				path: 'payments',
				Component: FarmerPayments,
			},
			{ 
				path: 'profile',
				Component: FarmerProfile
			},
            {
				path: 'orders',
				children: [
					{ 
						path: 'Awaiting Shipment',
						Component: AwaitingShipment
					},
					{ 
						path: 'Ongoing Shipment',
						Component: OngoingShipment
						
					},
					{
						path: "Paid and Shiped",
						Component: PaidandShiped
					}
					,
					{
						path: "Returns",
						Component: ReturnShipment
					}
				],
			},
			{ 
				path: 'requests',
				Component: BuyerRequests,
		
			},
				{ 
				path: 'offers',
				Component: Offers
			},
			{ 
				path: 'prices',
				Component: FarmioPrices,
			
			},
			{
				path: "crops/:cropId",
				Component: FarmerCropDetails,
				loader: FarmercropDetailsLoader
			},
			{
				path: "transport-confirmation",
				Component: FarmerCropTransport
			},
			{
				path: "chat",
				Component: FarmerChat
			},
			{
				path: 'warehouses',
				children: [
					{ 
						path: 'all',
						Component: FarmerWarehouses
					},
					{ 
						path: 'reserved',
						Component: FarmerReservedStorage,
						loader: FarmerreservedLoader
					},
					{
						path: ":warehouseId",
						Component: FarmerWarehouseDetails,
						loader: FarmerwarehouseDetailsLoader
					}
				],
			},
			{
				path: 'transport',
				children: [
					{ 
						path: 'providers',
						Component: FarmerTransportProviders,
						loader: FarmertransportProvidersLoader
					},
					{ 
						path: 'create',
						Component: FarmerCreateTransportJob,
					},
					{ 
						path: 'schedules',
						Component: FarmerTransportSchedules
					},
				],
			},
			{
				path: 'wastemanagement',
				Component: WasteAgents
		
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
