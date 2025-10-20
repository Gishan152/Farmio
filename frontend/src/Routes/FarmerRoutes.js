import TransportSchedules from '../Pages/Buyer/Sections/TransportSchedules';
//farmer
import FarmerLayout from '../Pages/Farmer/FarmerLayout';
import FarmerCrops, { FarmercropsLoader } from '../Pages/Farmer/Sections/Crops';
import FarmerWarehouses from '../Pages/Farmer/Sections/Warehouses';
import FarmerReservedStorage, { FarmerreservedLoader } from '../Pages/Farmer/Sections/ReservedStorage';
import FarmerTransportProviders, { FarmertransportProvidersLoader } from '../Pages/Farmer/Sections/TransportProviders';
import FarmerTransportJobs from '../Pages/Farmer/Sections/TransportSchedules';
import FarmerTransportJobDetails from '../Pages/Farmer/Sections/TransportJobDetails';
import FarmerCropDetails, { FarmercropDetailsLoader } from '../Pages/Farmer/Sections/CropDetails';
import FarmerWarehouseDetails, { FarmerwarehouseDetailsLoader } from '../Pages/Farmer/Sections/WarehouseDetails';
import FarmerCropTransport from '../Pages/Farmer/Sections/CropTransport';
import FarmerCreateTransportJob from '../Pages/Farmer/Sections/CreateTransport';
import MyProducts from '../Pages/Farmer/Sections/MyProducts';
import MyProductsDetails from '../Pages/Farmer/Sections/MyProductsDetails';
import MyProductsDetailsLoader from '../Pages/Farmer/Sections/MyProductsDetails';
import BuyerRequests from '../Pages/Farmer/Sections/BuyerRequests'
import BuyerRequestsLoader from '../Pages/Farmer/Sections/BuyerRequests'
import FarmioPrices from '../Pages/Farmer/Sections/FarmioPrices'
import FarmioPricesLoader from '../Pages/Farmer/Sections/FarmioPrices'
import AwaitingShipment from '../Pages/Farmer/Sections/AwaitingShipment';
import OngoingShipment from '../Pages/Farmer/Sections/OngoingShipment';
import PaidandShiped from '../Pages/Farmer/Sections/PaidandShiped';
import ReturnShipment from '../Pages/Farmer/Sections/ReturnShipment';
import WasteAgents from '../Pages/Farmer/Sections/WasteAgents';
import FarmerChat from '../Pages/Farmer/Sections/FarmerChat';
import Offers from '../Pages/Farmer/Sections/Offerstobuyers';
import FarmerProfile from '../Pages/Farmer/Sections/FarmerProfile';
import FarmerPayments from '../Pages/Farmer/Sections/FarmerPayments';
import FarmerWasteRequest from '../Pages/Farmer/Sections/FarmerWasteRequest';

const farmerRoutes = {
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
                    path: '',
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
        {
            path: 'waste-requests',
            Component: FarmerWasteRequest
        },
    ],
}

export default farmerRoutes;