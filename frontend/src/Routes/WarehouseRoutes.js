// warehouse imports
import WarehouseLayout from '../Pages/Warehouse/WarehouseLayout';
import WarehouseDashboard from '../Pages/Warehouse/Sections/Dashboard';
import FacilityManagement from '../Pages/Warehouse/Sections/FacilityManagement';
import SlotManagement from '../Pages/Warehouse/Sections/SlotManagement';
import BookingManagement from '../Pages/Warehouse/Sections/BookingManagement';
import PaymentManagement from '../Pages/Warehouse/Sections/PaymentManagement';
import WasteAgent from '../Pages/Warehouse/Sections/WasteAgent';
import WarehouseNotifications from '../Pages/Warehouse/Sections/Notifications';
import Analytics from '../Pages/Warehouse/Sections/Analytics';

const warehouseRoutes = {
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
}

export default warehouseRoutes;