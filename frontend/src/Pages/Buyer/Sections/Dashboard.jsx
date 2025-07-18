import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBagIcon, ClipboardDocumentListIcon, HeartIcon, CreditCardIcon, BuildingStorefrontIcon, TruckIcon } from "@heroicons/react/24/solid";
import { useOrderContext } from "../../../Contexts/Buyer/OrdersContexts";
import { useRequestsContext } from "../../../Contexts/Buyer/BuyerRequestContext";
import { useSavesContext } from "../../../Contexts/Buyer/SavesContext";
import { useTransportsContext } from "../../../Contexts/Buyer/TransportContext";

// You may want to import warehouse booking context if available

export default function BuyerDashboard() {
  const { orders } = useOrderContext();
  const { requests } = useRequestsContext();
  const { items: savedItems } = useSavesContext();
  const { jobs: transportJobs } = useTransportsContext();

  // Warehouse bookings: you may want to use context or loader, here we use a placeholder
  const [warehouseBookings, setWarehouseBookings] = useState([]);
  useEffect(() => {
    // TODO: Replace with real context/loader if available
    setWarehouseBookings([
      { id: "BK-1001", warehouseName: "Sunrise Warehouse", status: "Active" },
      { id: "BK-1002", warehouseName: "Cold Storage Colombo", status: "Completed" },
      { id: "BK-1003", warehouseName: "Negombo Dry Store", status: "Active" },
    ]);
  }, []);

  // Order stats
  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status && o.status.toLowerCase().includes("pending")).length,
    completed: orders.filter(o => o.status && o.status.toLowerCase().includes("complete")).length,
    totalValue: orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.pricePerUnit * i.quantity, 0), 0),
  };

  // Request stats
  const requestStats = {
    total: requests.length,
    open: requests.filter(r => !r.status || r.status.toLowerCase() === "open").length,
    completed: requests.filter(r => r.status && r.status.toLowerCase() === "completed").length,
  };

  // Warehouse booking stats
  const bookingStats = {
    total: warehouseBookings.length,
    active: warehouseBookings.filter(b => b.status === "Active").length,
    completed: warehouseBookings.filter(b => b.status === "Completed").length,
  };

  // Transport job stats
  const transportStats = {
    total: transportJobs.length,
    active: transportJobs.filter(j => j.status && j.status.toLowerCase().includes("active")).length,
    completed: transportJobs.filter(j => j.status && j.status.toLowerCase().includes("complete")).length,
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-left">
          <h1 className="text-3xl font-bold text-gray-800">Buyer Dashboard</h1>
          <p className="text-gray-600 mt-1">Your activity overview and quick actions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardStatCard
            icon={<CreditCardIcon className="h-8 w-8 text-green-600" />}
            label="Orders"
            value={orderStats.total}
            sub={`Pending: ${orderStats.pending}`}
            accent="border-green-500"
            link="/buyer/orders"
          />
          <DashboardStatCard
            icon={<ClipboardDocumentListIcon className="h-8 w-8 text-blue-600" />}
            label="Requests"
            value={requestStats.total}
            sub={`Open: ${requestStats.open}`}
            accent="border-blue-500"
            link="/buyer/requests"
          />
          <DashboardStatCard
            icon={<BuildingStorefrontIcon className="h-8 w-8 text-yellow-600" />}
            label="Warehouse Bookings"
            value={bookingStats.total}
            sub={`Active: ${bookingStats.active}`}
            accent="border-yellow-500"
            link="/buyer/warehouses/reserved"
          />
          <DashboardStatCard
            icon={<TruckIcon className="h-8 w-8 text-purple-600" />}
            label="Transport Jobs"
            value={transportStats.total}
            sub={`Active: ${transportStats.active}`}
            accent="border-purple-500"
            link="/buyer/transport/schedules"
          />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickLinkCard
            icon={<ShoppingBagIcon className="h-8 w-8 text-green-600" />}
            label="Browse Crops"
            to="/buyer/crops"
          />
          <QuickLinkCard
            icon={<ClipboardDocumentListIcon className="h-8 w-8 text-blue-600" />}
            label="Make a Request"
            to="/buyer/requests"
          />
          <QuickLinkCard
            icon={<BuildingStorefrontIcon className="h-8 w-8 text-yellow-600" />}
            label="My Bookings"
            to="/buyer/warehouses/reserved"
          />
          <QuickLinkCard
            icon={<TruckIcon className="h-8 w-8 text-purple-600" />}
            label="Transport Jobs"
            to="/buyer/transport/schedules"
          />
        </div>

        {/* Recent Orders - Modernized */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CreditCardIcon className="h-7 w-7 text-green-500" /> Recent Orders
          </h2>
          {orders.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No orders placed yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {orders.slice(0, 5).map(order => {
                // Order info
                const total = order.items.reduce((sum, i) => sum + i.pricePerUnit * i.quantity, 0);
                const itemCount = order.items.length;
                // Try to get order date if available
                let orderDate = order.date || order.createdAt || null;
                let dateStr = orderDate ? new Date(orderDate).toLocaleDateString() : null;
                // Status badge color and label
                const statusMap = {
                  PENDING:    { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
                  PROCESSING: { color: 'bg-blue-100 text-blue-800', label: 'Processing' },
                  AWAITING_PICKUP: { color: 'bg-orange-100 text-orange-800', label: 'Awaiting Pickup' },
                  IN_TRANSPORT: { color: 'bg-purple-100 text-purple-800', label: 'In Transport' },
                  DELIVERED:  { color: 'bg-green-100 text-green-800', label: 'Delivered' },
                  REFUNDED:   { color: 'bg-red-100 text-red-800', label: 'Refunded' },
                };
                let statusKey = (order.status || '').toUpperCase();
                let statusObj = statusMap[statusKey] || {
                  color: 'bg-gray-100 text-gray-800',
                  label: order.status
                    ? order.status
                        .toLowerCase()
                        .split('_')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')
                    : 'Unknown'
                };
                return (
                  <li key={order.id} className="py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 flex-1 min-w-0">
                      <Link to={`/buyer/orders/${order.id}`} className="font-semibold text-green-700 dark:text-green-300 hover:underline truncate">
                        Order - {order.id}
                      </Link>
                      {dateStr && (
                        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{dateStr}</span>
                      )}
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${statusObj.color} ml-0 md:ml-2`}>{statusObj.label}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-0 md:ml-2">{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex flex-col items-end min-w-[120px]">
                      <span className="font-bold text-lg text-gray-900 dark:text-white">Rs. {total}</span>
                      {/* Add more info if needed, e.g. payment method */}
                      {order.paymentMethod && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{order.paymentMethod}</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Recent Requests - Modernized */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ClipboardDocumentListIcon className="h-7 w-7 text-blue-500" /> Recent Requests
          </h2>
          {requests.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No requests made yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {requests.slice(0, 5).map(req => {
                const price = req.priceRange ? `Rs ${req.priceRange.min}–${req.priceRange.max}/kg` : '';
                const dateStr = req.date ? new Date(req.date).toLocaleDateString() : '';
                return (
                  <li key={req.id} className="py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 flex-1 min-w-0">
                      <span className="font-semibold text-blue-700 dark:text-blue-300 truncate">
                        {req.crop} – {req.quantity}{req.unitMeasurement || 'kg'}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{dateStr}</span>
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 ml-0 md:ml-2">{req.quality || 'Any'}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-0 md:ml-2">{req.visibility}</span>
                    </div>
                    <div className="flex flex-col items-end min-w-[120px]">
                      <span className="font-bold text-lg text-gray-900 dark:text-white">{price}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Deadline: {req.deadline}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Recent Warehouse Bookings - Modernized */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BuildingStorefrontIcon className="h-7 w-7 text-yellow-500" /> Recent Warehouse Bookings
          </h2>
          {warehouseBookings.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No warehouse bookings yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {warehouseBookings.slice(0, 5).map(b => {
                // Status badge color
                const statusMap = {
                  Active: 'bg-yellow-100 text-yellow-800',
                  Completed: 'bg-green-100 text-green-800',
                  Cancelled: 'bg-red-100 text-red-800',
                };
                const badgeColor = statusMap[b.status] || 'bg-gray-100 text-gray-800';
                return (
                  <li key={b.id} className="py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 flex-1 min-w-0">
                      <span className="font-semibold text-yellow-700 dark:text-yellow-300 truncate">{b.warehouseName}</span>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${badgeColor} ml-0 md:ml-2`}>{b.status}</span>
                    </div>
                    <div className="flex flex-col items-end min-w-[120px]">
                      <span className="font-bold text-lg text-gray-900 dark:text-white">Booking ID: {b.id}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Recent Transport Jobs - Modernized */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TruckIcon className="h-7 w-7 text-purple-500" /> Recent Transport Jobs
          </h2>
          {transportJobs.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No transport jobs yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {transportJobs.slice(0, 5).map(job => {
                // Status badge color
                const statusMap = {
                  Active: 'bg-purple-100 text-purple-800',
                  Completed: 'bg-green-100 text-green-800',
                  Cancelled: 'bg-red-100 text-red-800',
                };
                const badgeColor = statusMap[job.status] || 'bg-gray-100 text-gray-800';
                return (
                  <li key={job.id} className="py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 flex-1 min-w-0">
                      <span className="font-semibold text-purple-700 dark:text-purple-300 truncate">Job #{job.id}</span>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${badgeColor} ml-0 md:ml-2`}>{job.status}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-0 md:ml-2">{job.vehicleType}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardStatCard({ icon, label, value, sub, accent, link }) {
  // Color backgrounds for icons and subtext accent
  const iconBg =
    accent === 'border-green-500' ? 'bg-green-100 dark:bg-green-900' :
    accent === 'border-blue-500' ? 'bg-blue-100 dark:bg-blue-900' :
    accent === 'border-yellow-500' ? 'bg-yellow-100 dark:bg-yellow-900' :
    accent === 'border-purple-500' ? 'bg-purple-100 dark:bg-purple-900' :
    'bg-gray-100 dark:bg-gray-900';
  const subTextColor =
    accent === 'border-green-500' ? 'text-green-600 dark:text-green-400' :
    accent === 'border-blue-500' ? 'text-blue-600 dark:text-blue-400' :
    accent === 'border-yellow-500' ? 'text-yellow-600 dark:text-yellow-400' :
    accent === 'border-purple-500' ? 'text-purple-600 dark:text-purple-400' :
    'text-gray-500 dark:text-gray-400';
  // Animation: scale card and add colored shadow on hover (no translate)
  const hoverShadow =
    accent === 'border-green-500' ? 'hover:shadow-green-200' :
    accent === 'border-blue-500' ? 'hover:shadow-blue-200' :
    accent === 'border-yellow-500' ? 'hover:shadow-yellow-200' :
    accent === 'border-purple-500' ? 'hover:shadow-purple-200' :
    'hover:shadow-lg';
  return (
    <Link
      to={link}
      className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 ${accent} ${hoverShadow} transition-all duration-300 flex items-center gap-4 group hover:shadow-xl transform hover:-translate-y-1 active:scale-100`}
      style={{ willChange: 'transform, box-shadow' }}
    >
      <div className={`p-4 ${iconBg} rounded-full flex items-center justify-center shadow-md transition-transform duration-300`}> 
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">{value}</p>
        {sub && <p className={`text-xs font-semibold mt-1 ${subTextColor}`}>{sub}</p>}
      </div>
    </Link>
  );
}

function QuickLinkCard({ icon, label, to }) {
  return (
    <Link to={to} className="bg-gradient-to-br from-green-50 to-white dark:from-green-900 dark:to-gray-900 p-6 rounded-xl shadow border border-green-100 dark:border-green-800 flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
      <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
        {icon}
      </div>
      <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">{label}</span>
    </Link>
  );
}
