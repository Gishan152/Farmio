import BuyerLayout from '../Pages/Buyer/BuyerLayout';
import Crops from '../Pages/Buyer/Sections/Crops';
import Warehouses from '../Pages/Buyer/Sections/Warehouses';
import ReservedStorage, { reservedLoader } from '../Pages/Buyer/Sections/ReservedStorage';
import TransportProviders, { transportProvidersLoader } from '../Pages/Buyer/Sections/TransportProviders';
import TransportSchedules from '../Pages/Buyer/Sections/TransportSchedules';
import CropDetails, { cropDetailsLoader } from '../Pages/Buyer/Sections/CropDetails';
import WarehouseDetails, { warehouseDetailsLoader } from '../Pages/Buyer/Sections/WarehouseDetails';
import Saves from '../Pages/Buyer/Sections/Saves';
import OrderConfirmation from '../Pages/Buyer/Sections/OrderConfirmation';
import CropTransport from '../Pages/Buyer/Sections/CropTransport';
import Orders from '../Pages/Buyer/Sections/Orders';
import CreateTransportJob from '../Pages/Buyer/Sections/CreateTransport';
import OrderDetails from '../Pages/Buyer/Sections/OrderDetails';
import Requests from '../Pages/Buyer/Sections/Requests';
import RequestDetails from '../Pages/Buyer/Sections/RequestDetails';
import WarehouseReservationDetails, { warehouseReservationLoader } from '../Pages/Buyer/Sections/ReservedStorageDetails';
import TransportJobDetails from '../Pages/Buyer/Sections/TransportJobDetails';
import WarehouseSearch from '../Pages/Buyer/Sections/WarehouseSearch';
import Dashboard from '../Pages/Buyer/Sections/Dashboard';
import PaymentManagement from '../Pages/Buyer/Sections/PaymentManagement';


const buyerRoutes = {
    path: '/buyer',
    Component: BuyerLayout,
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
            path: "payments",
            Component: PaymentManagement
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
}

export default buyerRoutes;