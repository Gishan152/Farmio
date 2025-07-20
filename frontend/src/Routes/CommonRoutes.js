import LandingPage from '../Pages/LandingPage';
import Root from '../Pages/Root';
import Login, { loginAction, loginLoader } from '../Pages/LoginRegister/Login';
import Registration,  { RegistrationAction, RegistrationLoader } from '../Pages/LoginRegister/Registration';
import FarmerRegistration, { FarmerRegistrationAction, FarmerRegistrationLoader } from '../Pages/LoginRegister/FarmerRegistration';
import BuyerRegistration, { BuyerRegistrationAction, BuyerRegistrationLoader } from '../Pages/LoginRegister/BuyerRegistration';
import WarehouseProviderRegistration, { WarehouseProviderRegistrationAction, WarehouseProviderRegistrationLoader } from '../Pages/LoginRegister/WarehouseProviderRegistration';
import TransportProviderRegistration, { TransportProviderRegistrationAction, TransportProviderRegistrationLoader } from '../Pages/LoginRegister/TransportProviderRegistration';
import WasteAgentRegistration, { WasteAgentRegistrationAction, WasteAgentRegistrationLoader } from '../Pages/LoginRegister/WasteAgentRegistration';
import ProductPage from '../Pages/ProductsPage';
import SettingsPage from '../Pages/SettingsPage';
import AboutUs from '../Pages/AboutUs';
import FAQ from '../Pages/FAQ';
import HowItWorks from '../Pages/HowItWorks';
import TermsAndConditions from '../Pages/TermsAndConditions';



const commonRoutes = [
    {
        index: true,
        Component: LandingPage
    },    
      {
        path: "/about",
        Component: AboutUs,
      },
      {
        path: "/faq",
        Component: FAQ,
      },
      {
        path: "/how-it-works",
        Component: HowItWorks,
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
        path: 'terms-and-conditions',
        Component: TermsAndConditions
    }

]

export default commonRoutes;