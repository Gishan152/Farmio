import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Admin Pages
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'

// Moderator Pages
import ModeratorLogin from './pages/moderator/Login'
import ModeratorDashboard from './pages/moderator/Dashboard'

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route - redirect to admin login */}
        <Route path="/" element={<Navigate to="/admin/login" />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        {/* Moderator Routes */}
        <Route path="/moderator/login" element={<ModeratorLogin />} />
        <Route path="/moderator/dashboard" element={<ModeratorDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
