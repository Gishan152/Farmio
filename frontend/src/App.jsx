import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Admin Pages
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'

// Admin User Management Pages
import UserManagementHome from './pages/admin/users/index'
import FarmerManagement from './pages/admin/users/Farmers'
import BuyerManagement from './pages/admin/users/Buyers'
import TransportProviderManagement from './pages/admin/users/TransportProviders'
import WarehouseOwnerManagement from './pages/admin/users/WarehouseOwners'
import WasteManagementAgentManagement from './pages/admin/users/WasteManagementAgents'
import ModeratorManagement from './pages/admin/users/Moderators'
import AdminManagement from './pages/admin/users/Admins'

// Admin Product & Order Management
import ProductsManagement from './pages/admin/products/index'
import OrdersManagement from './pages/admin/orders/index'
import AnalyticsManagement from './pages/admin/analytics/index'
import SettingsManagement from './pages/admin/settings/index'

// Moderator Pages
import ModeratorLogin from './pages/moderator/Login'
import ModeratorDashboard from './pages/moderator/Dashboard'
import ModeratorProducts from './pages/moderator/products/index'
import ModeratorProductReview from './pages/moderator/products/review'
import ModeratorProductQuality from './pages/moderator/products/quality'
import ModeratorOrders from './pages/moderator/orders/index'
import ModeratorSupport from './pages/moderator/support/index'
import ModeratorSettings from './pages/moderator/settings/index'

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route - redirect to admin login */}
        <Route path="/" element={<Navigate to="/admin/login" />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        {/* Admin User Management Routes */}
        <Route path="/admin/users" element={<UserManagementHome />} />
        <Route path="/admin/users/farmers" element={<FarmerManagement />} />
        <Route path="/admin/users/buyers" element={<BuyerManagement />} />
        <Route path="/admin/users/transport-providers" element={<TransportProviderManagement />} />
        <Route path="/admin/users/warehouse-owners" element={<WarehouseOwnerManagement />} />
        <Route path="/admin/users/waste-management-agents" element={<WasteManagementAgentManagement />} />
        <Route path="/admin/users/moderators" element={<ModeratorManagement />} />
        <Route path="/admin/users/admins" element={<AdminManagement />} />
        
        {/* Admin Product & Order Routes */}
        <Route path="/admin/products" element={<ProductsManagement />} />
        <Route path="/admin/orders" element={<OrdersManagement />} />
        <Route path="/admin/analytics" element={<AnalyticsManagement />} />
        <Route path="/admin/settings" element={<SettingsManagement />} />
        
        {/* Moderator Routes */}
        <Route path="/moderator/login" element={<ModeratorLogin />} />
        <Route path="/moderator/dashboard" element={<ModeratorDashboard />} />
        
        {/* Moderator Product Routes */}
        <Route path="/moderator/products" element={<ModeratorProducts />} />
        <Route path="/moderator/products/review" element={<ModeratorProductReview />} />
        <Route path="/moderator/products/quality" element={<ModeratorProductQuality />} />
        
        {/* Moderator Other Routes */}
        <Route path="/moderator/orders" element={<ModeratorOrders />} />
        <Route path="/moderator/support" element={<ModeratorSupport />} />
        <Route path="/moderator/settings" element={<ModeratorSettings />} />
      </Routes>
    </Router>
  )
}

export default App
