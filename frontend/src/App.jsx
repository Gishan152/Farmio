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
// import WarehouseNotifications from './Pages/Warehouse/Sections/Notifications';
// import Analytics from './Pages/Warehouse/Sections/Analytics';

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
import commonRoutes from './Routes/CommonRoutes';
import buyerRoutes from './Routes/BuyerRoutes';
import farmerRoutes from './Routes/FarmerRoutes';
import wasteAgentRoutes from './Routes/WasteAgentRoutes';
import transporterRoutes from './Routes/TransporterRoutes';
import warehouseRoutes from './Routes/WarehouseRoutes';
import adminRoutes from './Routes/AdminRoutes';
import moderatorRoutes from './Routes/ModeratorRoutes';


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
	...commonRoutes,
	buyerRoutes,
	farmerRoutes,
	wasteAgentRoutes,
	transporterRoutes,
	warehouseRoutes,
	adminRoutes,
	moderatorRoutes
	
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
