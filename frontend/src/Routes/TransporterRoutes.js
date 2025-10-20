import TransLayout from '../Pages/transporter/TransLayout';
import TransporterDashboard from '../Pages/transporter/Sections/Dashboard';
import AvailableLoads from '../Pages/transporter/Sections/AvailableLoads';
import AssignedLoads from '../Pages/transporter/Sections/AssignedLoads';
import PickupDropPoints from '../Pages/transporter/Sections/PickupDropPoints';
import RoutePlanner from '../Pages/transporter/Sections/RoutePlanner';
import VehicleInfo from '../Pages/transporter/Sections/VehicleInfo';
import DeliveryHistory from '../Pages/transporter/Sections/DeliveryHistory';
import RatingsFeedback from '../Pages/transporter/Sections/RatingsFeedback';
import TransporterNotifications from '../Pages/transporter/Sections/Notifications';
import ConfirmDelivery from '@/Pages/transporter/Sections/ConfirmDelivery';
import ConfirmPickup from '@/Pages/transporter/Sections/ConfirmPickup';

const transporterRoutes = {
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
            path: 'pickupDropPoints',
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
        },
        {
            path : 'confirmPickup/:id',
            Component: ConfirmPickup
        },
        {
            path : 'confirmDelivery/:id',
            Component: ConfirmDelivery
        }
    ]
}

export default transporterRoutes;