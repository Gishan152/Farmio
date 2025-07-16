// Admin imports
import AdminLogin from '../Pages/admin/Login';
import AdminDashboard from '../Pages/admin/Dashboard';
import UserManagementHome from '../Pages/admin/users/index';
import FarmerManagement from '../Pages/admin/users/Farmers';
import BuyerManagement from '../Pages/admin/users/Buyers';
import TransportProviderManagement from '../Pages/admin/users/TransportProviders';
import WarehouseOwnerManagement from '../Pages/admin/users/WarehouseOwners';
import WasteManagementAgentManagement from '../Pages/admin/users/WasteManagementAgents';
import ModeratorManagement from '../Pages/admin/users/Moderators';
import AdminManagement from '../Pages/admin/users/Admins';
import ProductsManagementWithErrorHandling from '../Pages/admin/products/index';
import OrdersManagement from '../Pages/admin/orders/index';
import PendingOrders from '../Pages/admin/orders/pending';
import Deliveries from '../Pages/admin/orders/deliveries';
import OrdersIssues from '../Pages/admin/orders/issues';
import AnalyticsPage from '../Pages/admin/analytics/index';
import AdminSettingsPage from '../Pages/admin/settings/index';

// Admin Logistics pages
import LogisticsRoutes from '../Pages/admin/logistics/routes';
import LogisticsWarehouses from '../Pages/admin/logistics/warehouses';
import LogisticsShipping from '../Pages/admin/logistics/shipping';

// Admin Waste Management pages
import WasteCollection from '../Pages/admin/waste/collection';
import WasteProcessing from '../Pages/admin/waste/processing';
import WasteStats from '../Pages/admin/waste/stats';

// Admin Analytics pages
import AnalyticsSales from '../Pages/admin/analytics/sales';
import AnalyticsActivity from '../Pages/admin/analytics/activity';
import AnalyticsSupplyChain from '../Pages/admin/analytics/supply-chain';
import AnalyticsSustainability from '../Pages/admin/analytics/sustainability';


const adminRoutes = {
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
}

export default adminRoutes;