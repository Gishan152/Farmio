import React from 'react';
import Dashboard from '../pages/warehouse/Dashboard';
import Facilities from '../pages/warehouse/warehouse/index';
import AddFacility from '../pages/warehouse/warehouse/add';
import EditFacility from '../pages/warehouse/warehouse/edit';
import ViewFacility from '../pages/warehouse/warehouse/view';
import FacilityDetails from '../pages/warehouse/warehouse/facilityDetails';
import Bookings from '../pages/warehouse/bookings/index';
import PendingBookings from '../pages/warehouse/bookings/pending';
import ActiveBookings from '../pages/warehouse/bookings/active';
import CalendarView from '../pages/warehouse/bookings/calendar';
import Inventory from '../pages/warehouse/inventory/index';
import CurrentInventory from '../pages/warehouse/inventory/currentInventory';
import ProductCategories from '../pages/warehouse/inventory/productCategories';
import Capacity from '../pages/warehouse/inventory/capacity';
import PaymentOverview from '../pages/warehouse/payment/index';
import WarehousePaymentDetails from '../pages/warehouse/payment/WarehousePayment';
import PaymentHistory from '../pages/warehouse/payment/PaymentHistory';
import ServiceProvidersIndex from '../pages/warehouse/ServiceProviders/index';
import AnalyticsIndex from '../pages/warehouse/analytics/index';
import Profile from '../pages/warehouse/Profile';
import Settings from '../pages/warehouse/Settings';
import Notifications from '../pages/warehouse/Notifications';
import { Routes, Route } from 'react-router-dom';

const WarehouseLayout = () => {
    return (
        <div className="warehouse-layout">
            <main>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/warehouse/dashboard" element={<Dashboard />} />
                    <Route path="/warehouse/warehouse" element={<Facilities />} />
                    <Route path="/warehouse/warehouse/add" element={<AddFacility />} />
                    <Route path="/warehouse/warehouse/edit/:id" element={<EditFacility />} />
                    <Route path="/warehouse/warehouse/view/:id" element={<ViewFacility />} />
                    <Route path="/warehouse/warehouse/:id" element={<FacilityDetails />} />
                    <Route path="/warehouse/bookings" element={<Bookings />} />
                    <Route path="/warehouse/bookings/pending" element={<PendingBookings />} />
                    <Route path="/warehouse/bookings/active" element={<ActiveBookings />} />
                    <Route path="/warehouse/bookings/calendar" element={<CalendarView />} />
                    <Route path="/warehouse/inventory" element={<Inventory />} />
                    <Route path="/warehouse/inventory/current" element={<CurrentInventory />} />
                    <Route path="/warehouse/inventory/categories" element={<ProductCategories />} />                    
                    <Route path="/warehouse/inventory/capacity" element={<Capacity />} />
                    <Route path="/warehouse/payment" element={<PaymentOverview />} />
                    <Route path="/warehouse/payment/details/:id" element={<WarehousePaymentDetails />} />
                    <Route path="/warehouse/payment/history" element={<PaymentHistory />} />                   
                    <Route path="/warehouse/service-providers" element={<ServiceProvidersIndex />} />                    
                    <Route path="/warehouse/analytics" element={<AnalyticsIndex />} /> 
                    <Route path="/warehouse/profile" element={<Profile />} />
                    <Route path="/warehouse/settings" element={<Settings />} />
                    <Route path="/warehouse/notifications" element={<Notifications />} />                
                </Routes>
            </main>
        </div>
    );
};

export default WarehouseLayout;