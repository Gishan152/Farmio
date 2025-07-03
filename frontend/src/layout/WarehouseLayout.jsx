import React from 'react';
import Dashboard from '../Pages/warehouse/Dashboard';
import Facilities from '../Pages/warehouse/facilities/index';
import AddFacility from '../Pages/warehouse/facilities/add';
import EditFacility from '../Pages/warehouse/facilities/edit';
import ViewFacility from '../Pages/warehouse/facilities/view';
import Bookings from '../Pages/warehouse/bookings/index';
import PendingBookings from '../Pages/warehouse/bookings/pending';
import ActiveBookings from '../Pages/warehouse/bookings/active';
import CalendarView from '../Pages/warehouse/bookings/calendar';
import Inventory from '../Pages/warehouse/inventory/index';
import CurrentInventory from '../pages/warehouse/inventory/currentInventory';
import ProductCategories from '../pages/warehouse/inventory/productCategories';
import Capacity from '../Pages/warehouse/inventory/capacity';
import Pricing from '../Pages/warehouse/pricing/index';
import SeasonalPricing from '../Pages/warehouse/pricing/seasonal';;
import ServiceProvidersIndex from '../pages/warehouse/ServiceProviders/index';
import AnalyticsIndex from '../pages/warehouse/analytics/index';
import Profile from '../Pages/warehouse/profile/index';
import Settings from '../Pages/warehouse/settings/index';
import { Routes, Route } from 'react-router-dom';

const WarehouseLayout = () => {
    return (
        <div className="warehouse-layout">
            <main>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/warehouse/dashboard" element={<Dashboard />} />
                    <Route path="/warehouse/facilities" element={<Facilities />} />
                    <Route path="/warehouse/facilities/add" element={<AddFacility />} />
                    <Route path="/warehouse/facilities/edit/:id" element={<EditFacility />} />
                    <Route path="/warehouse/facilities/view/:id" element={<ViewFacility />} />
                    <Route path="/warehouse/bookings" element={<Bookings />} />
                    <Route path="/warehouse/bookings/pending" element={<PendingBookings />} />
                    <Route path="/warehouse/bookings/active" element={<ActiveBookings />} />
                    <Route path="/warehouse/bookings/calendar" element={<CalendarView />} />
                    <Route path="/warehouse/inventory" element={<Inventory />} />
                    <Route path="/warehouse/inventory/current" element={<CurrentInventory />} />
                    <Route path="/warehouse/inventory/categories" element={<ProductCategories />} />                    
                    <Route path="/warehouse/inventory/capacity" element={<Capacity />} />
                    <Route path="/warehouse/pricing" element={<Pricing />} />
                    <Route path="/warehouse/pricing/seasonal" element={<SeasonalPricing />} />                    
                    <Route path="/warehouse/service-providers" element={<ServiceProvidersIndex />} />                    
                    <Route path="/warehouse/analytics" element={<AnalyticsIndex />} />
                    <Route path="/warehouse/profile" element={<Profile />} />
                    <Route path="/warehouse/settings" element={<Settings />} />
                </Routes>
            </main>
        </div>
    );
};

export default WarehouseLayout;