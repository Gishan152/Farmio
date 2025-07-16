import { Component, useState } from 'react'
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
import OrderDetails from './Pages/Buyer/Sections/OrderDetails';
import Requests from './Pages/Buyer/Sections/Requests';
import RequestDetails from './Pages/Buyer/Sections/RequestDetails';
import WarehouseReservationDetails, { warehouseReservationLoader } from './Pages/Buyer/Sections/ReservedStorageDetails';
import SettingsPage from './Pages/SettingsPage';
import UserContextProvider from './Contexts/UserContext';
import TransportJobDetails from './Pages/Buyer/Sections/TransportJobDetails';
import WarehouseSearch from './Pages/Buyer/Sections/WarehouseSearch';
import { GoogleMapsProvider } from './Contexts/GoogleMapContext';
import TransLayout from './Pages/transporter/TransLayout';
import TransporterDashboard from './Pages/transporter/Sections/Dashboard';
import AvailableLoads from './Pages/transporter/Sections/AvailableLoads';
import AssignedLoads from './Pages/transporter/Sections/AssignedLoads';
import PickupDropPoints from './Pages/transporter/Sections/PickupDropPoints';
import RoutePlanner from './Pages/transporter/Sections/RoutePlanner';
import VehicleInfo from './Pages/transporter/Sections/VehicleInfo';
import DeliveryHistory from './Pages/transporter/Sections/DeliveryHistory';
import RatingsFeedback from './Pages/transporter/Sections/RatingsFeedback';
import TransporterNotifications from './Pages/transporter/Sections/Notifications';
//farmer
import FarmerLayout from './Pages/Farmer/FarmerLayout';
import FarmerCrops, { FarmercropsLoader } from './Pages/Farmer/Sections/Crops';
import FarmerWarehouses from './Pages/Farmer/Sections/Warehouses';
import FarmerReservedStorage, { FarmerreservedLoader } from './Pages/Farmer/Sections/ReservedStorage';
import FarmerTransportProviders, { FarmertransportProvidersLoader } from './Pages/Farmer/Sections/TransportProviders';
import FarmerTransportJobs from './Pages/Farmer/Sections/TransportSchedules';
import FarmerTransportJobDetails from './Pages/Farmer/Sections/TransportJobDetails';
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

// warehouse imports
import WarehouseLayout from './Pages/Warehouse/WarehouseLayout';
import WarehouseDashboard from './Pages/Warehouse/Sections/Dashboard';
import FacilityManagement from './Pages/Warehouse/Sections/FacilityManagement';
import SlotManagement from './Pages/Warehouse/Sections/SlotManagement';
import BookingManagement from './Pages/Warehouse/Sections/BookingManagement';
import PaymentManagement from './Pages/Warehouse/Sections/PaymentManagement';
import WasteAgent from './Pages/Warehouse/Sections/WasteAgent';
import WarehouseNotifications from './Pages/Warehouse/Sections/Notifications';
import Analytics from './Pages/Warehouse/Sections/Analytics';

// Admin imports
import AdminLogin from './Pages/admin/Login';
import AdminDashboard from './Pages/admin/Dashboard';
import UserManagementHome from './Pages/admin/users/index';
import FarmerManagement from './Pages/admin/users/Farmers';
import BuyerManagement from './Pages/admin/users/Buyers';
import TransportProviderManagement from './Pages/admin/users/TransportProviders';
import WarehouseOwnerManagement from './Pages/admin/users/WarehouseOwners';
import WasteManagementAgentManagement from './Pages/admin/users/WasteManagementAgents';
import ModeratorManagement from './Pages/admin/users/Moderators';
import AdminManagement from './Pages/admin/users/Admins';
import ProductsManagementWithErrorHandling from './Pages/admin/products/index';
import OrdersManagement from './Pages/admin/orders/index';
import PendingOrders from './Pages/admin/orders/pending';
import Deliveries from './Pages/admin/orders/deliveries';
import OrdersIssues from './Pages/admin/orders/issues';
import AnalyticsPage from './Pages/admin/analytics/index';
import AdminSettingsPage from './Pages/admin/settings/index';

// Admin Logistics pages
import LogisticsRoutes from './Pages/admin/logistics/routes';
import LogisticsWarehouses from './Pages/admin/logistics/warehouses';
import LogisticsShipping from './Pages/admin/logistics/shipping';

// Admin Waste Management pages
import WasteCollection from './Pages/admin/waste/collection';
import WasteProcessing from './Pages/admin/waste/processing';
import WasteStats from './Pages/admin/waste/stats';

// Admin Analytics pages
import AnalyticsSales from './Pages/admin/analytics/sales';
import AnalyticsActivity from './Pages/admin/analytics/activity';
import AnalyticsSupplyChain from './Pages/admin/analytics/supply-chain';
import AnalyticsSustainability from './Pages/admin/analytics/sustainability';

// Moderator imports
import ModeratorLogin from './Pages/moderator/Login';
import ModeratorDashboard from './Pages/moderator/Dashboard';
import ModeratorProducts from './Pages/moderator/products/index';
import ModeratorProductReview from './Pages/moderator/products/review';
import ModeratorProductQuality from './Pages/moderator/products/quality';
import ModeratorOrders from './Pages/moderator/orders/index';
import ModeratorSupport from './Pages/moderator/support/index';
import ModeratorSettings from './Pages/moderator/settings/index';
import ModeratorPricing from './Pages/moderator/pricing/index';
import ModeratorPricingHistory from './Pages/moderator/pricing/history';
import ModeratorPricingAnalytics from './Pages/moderator/pricing/analytics';



import WasteAgentLayout from './Pages/WasteAgent/WasteAgentLayout';
import WasteListings from './Pages/WasteAgent/Sections/WasteListings';
import WasteRequests from './Pages/WasteAgent/Sections/Requests';
import Payments from './Pages/WasteAgent/Sections/Payments';
import BrowseDiscover from './Pages/WasteAgent/Sections/BrowseDiscover';
import AgentProfile from './Pages/WasteAgent/Sections/AgentProfile';


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
		path: 'settings',
		Component: SettingsPage
	},
	{
		path: '/transporter',
		Component: TransLayout,
		children: [
			{
				index: true,
				Component: TransporterDashboard
			},
			{
				path: 'dashboard',
				Component: TransporterDashboard
			},
			{
				path: 'availableLoads',
				Component: AvailableLoads
			},
			{
				path: 'assignedLoads/all',
				Component: AssignedLoads
			},
			{
				parth: 'pickupDropPoints',
				Component: PickupDropPoints
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
				Component: DeliveryHistory
			},
			{
				path: 'ratingsFeedback',
				Component: RatingsFeedback
			},
			{
				path: 'notifications',
				Component: TransporterNotifications
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
				path: "orders/:orderId",
				Component: OrderDetails
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
				path: "requests",
				Component: Requests
			},
			{
				path: "requests/:requestId",
				Component: RequestDetails
			},
			{
				path: 'warehouses',
				children: [
					{
						path: 'all',
						Component: Warehouses
					},
					{
						path: 'search',
						Component: WarehouseSearch
					},
					{
						path: 'reserved',
						Component: ReservedStorage,
						loader: reservedLoader
					},
					{
						path: "all/:warehouseId",
						Component: WarehouseDetails,
						loader: warehouseDetailsLoader
					},
					{
						path: "reserved/:warehouseId",
						Component: WarehouseReservationDetails,
						loader: warehouseReservationLoader
					},
					{
						path: "search",
						Component: WarehouseSearch,
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
					{
						path: 'schedules/of-order/:orderId',
						Component: TransportSchedules
					},
					{
						path: 'schedules/:jobId',
						Component: TransportJobDetails
					},
				],
			},
		],
	},
	, {
		path: '/waste-agent',
		Component: WasteAgentLayout,
		children: [
			{
				index: true,
				Component: WasteListings
			},
			{
				path: 'listings',
				Component: WasteListings
			},
			{
				path: "browse-discover",
				Component: BrowseDiscover
			},
			{
				path: "manage-payments",
				Component: Payments
			},
			{
				path: "requests",
				Component: WasteRequests
			},
			{
				path: "profile",
				Component: AgentProfile
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
				Component: MyProductsDetails,
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
						loader: FarmertransportProvidersLoader,
					},
					{
						path: 'create',
						Component: FarmerCreateTransportJob,
					},
					{
						path: 'schedules',
						Component: FarmerTransportJobs,
					},
					{
						path: 'schedules/of-order/:orderId',
						Component: TransportSchedules,
					},
					{
						path: 'schedules/:jobId',
						Component: FarmerTransportJobDetails,
					},
				],
			},
			{
				path: 'wastemanagement',
				Component: WasteAgents

			},
		],
	},
	{
		path: '/warehouse',
		Component: WarehouseLayout,
		children: [
			{
				index: true,
				Component: WarehouseDashboard
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
				Component: WarehouseNotifications
			},
			{
				path: 'analytics',
				Component: Analytics
			}
		],
	},

	// Add Admin routes
	{
		path: '/admin',
		children: [
			{
				path: 'login',
				Component: AdminLogin
			},
			{
				path: 'dashboard',
				Component: AdminDashboard
			},
			{
				path: 'users',
				children: [
					{
						index: true,
						Component: UserManagementHome
					},
					{
						path: 'farmers',
						Component: FarmerManagement
					},
					{
						path: 'buyers',
						Component: BuyerManagement
					},
					{
						path: 'transport-providers',
						Component: TransportProviderManagement
					},
					{
						path: 'warehouse-owners',
						Component: WarehouseOwnerManagement
					},
					{
						path: 'waste-management-agents',
						Component: WasteManagementAgentManagement
					},
					{
						path: 'moderators',
						Component: ModeratorManagement
					},
					{
						path: 'admins',
						Component: AdminManagement
					}
				]
			},
			{
				path: 'products',
				Component: ProductsManagementWithErrorHandling
			},
			{
				path: 'orders',
				children: [
					{
						index: true,
						Component: OrdersManagement
					},
					{
						path: 'pending',
						Component: PendingOrders
					},
					{
						path: 'deliveries',
						Component: Deliveries
					},
					{
						path: 'issues',
						Component: OrdersIssues
					}
				]
			},
			{
				path: 'analytics',
				children: [
					{
						index: true,
						Component: AnalyticsPage
					},
					{
						path: 'sales',
						Component: AnalyticsSales
					},
					{
						path: 'activity',
						Component: AnalyticsActivity
					},
					{
						path: 'supply-chain',
						Component: AnalyticsSupplyChain
					},
					{
						path: 'sustainability',
						Component: AnalyticsSustainability
					}
				]
			},
			{
				path: 'logistics',
				children: [
					{
						path: 'routes',
						Component: LogisticsRoutes
					},
					{
						path: 'warehouses',
						Component: LogisticsWarehouses
					},
					{
						path: 'shipping',
						Component: LogisticsShipping
					}
				]
			},
			{
				path: 'waste',
				children: [
					{
						path: 'collection',
						Component: WasteCollection
					},
					{
						path: 'processing',
						Component: WasteProcessing
					},
					{
						path: 'stats',
						Component: WasteStats
					}
				]
			},
			{
				path: 'settings',
				Component: AdminSettingsPage
			}
		]
	},
	// Add Moderator routes
	{
		path: '/moderator',
		children: [
			{
				path: 'login',
				Component: ModeratorLogin
			},
			{
				path: 'dashboard',
				Component: ModeratorDashboard
			},
			{
				path: 'products',
				children: [
					{
						index: true,
						Component: ModeratorProducts
					},
					{
						path: 'review',
						Component: ModeratorProductReview
					},
					{
						path: 'quality',
						Component: ModeratorProductQuality
					}
				]
			},
			{
				path: 'pricing',
				children: [
					{
						index: true,
						Component: ModeratorPricing
					},
					{
						path: 'history',
						Component: ModeratorPricingHistory
					},
					{
						path: 'analytics',
						Component: ModeratorPricingAnalytics
					}
				]
			},
			{
				path: 'orders',
				Component: ModeratorOrders
			},
			{
				path: 'support',
				Component: ModeratorSupport
			},
			{
				path: 'settings',
				Component: ModeratorSettings
			}
		]
	}
]);


function App() {
	return (
		<UserContextProvider>
			<GoogleMapsProvider>
				<RouterProvider router={router} />
			</GoogleMapsProvider>
		</UserContextProvider>
	)
}

export default App
