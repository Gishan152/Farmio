import WasteAgentLayout from '../Pages/WasteAgent/WasteAgentLayout';
import WasteListings from '../Pages/WasteAgent/Sections/WasteListings';
import WasteRequests from '../Pages/WasteAgent/Sections/Requests';
import Payments from '../Pages/WasteAgent/Sections/Payments';
import BrowseDiscover from '../Pages/WasteAgent/Sections/BrowseDiscover';
import AgentProfile from '../Pages/WasteAgent/Sections/AgentProfile';
import Chat from '../Pages/WasteAgent/Sections/chat';
import PaymentManagement from '@/Pages/WasteAgent/Sections/PaymentManagement';


const wasteAgentRoutes = {
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
            path: "finalise",
            Component: Payments
        },
        {
            path: "manage-payments",
            Component: PaymentManagement
        },
        {
            path: "manage-payments:id",
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
        {
            path: "chat",
            Component: Chat
        },
    ],
}

export default wasteAgentRoutes;