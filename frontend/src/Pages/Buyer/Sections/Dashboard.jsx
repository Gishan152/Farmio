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

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recent Orders</h2>
          {orders.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No orders placed yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {orders.slice(0, 5).map(order => (
                <li key={order.id} className="py-4 flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <Link to={`/buyer/orders/${order.id}`} className="font-medium text-green-700 dark:text-green-300 hover:underline">
                      Order #{order.id}
                    </Link>
                    <span className="ml-4 text-sm text-gray-500">{order.status}</span>
                  </div>
                  <span className="font-semibold text-gray-700 dark:text-gray-200">Rs. {order.items.reduce((sum, i) => sum + i.pricePerUnit * i.quantity, 0)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recent Requests</h2>
          {requests.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No requests made yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {requests.slice(0, 5).map(req => (
                <li key={req.id} className="py-4 flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <span className="font-medium text-blue-700 dark:text-blue-300">{req.crop} – {req.quantity}kg</span>
                    <span className="ml-4 text-sm text-gray-500">{req.status || "Open"}</span>
                  </div>
                  <span className="font-semibold text-gray-700 dark:text-gray-200">Price: Rs {req.priceRange?.min}–{req.priceRange?.max}/kg</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Warehouse Bookings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recent Warehouse Bookings</h2>
          {warehouseBookings.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No warehouse bookings yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {warehouseBookings.slice(0, 5).map(b => (
                <li key={b.id} className="py-4 flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <span className="font-medium text-yellow-700 dark:text-yellow-300">{b.warehouseName}</span>
                    <span className="ml-4 text-sm text-gray-500">{b.status}</span>
                  </div>
                  <span className="font-semibold text-gray-700 dark:text-gray-200">Booking ID: {b.id}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Transport Jobs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recent Transport Jobs</h2>
          {transportJobs.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No transport jobs yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {transportJobs.slice(0, 5).map(job => (
                <li key={job.id} className="py-4 flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <span className="font-medium text-purple-700 dark:text-purple-300">Job #{job.id}</span>
                    <span className="ml-4 text-sm text-gray-500">{job.status}</span>
                  </div>
                  <span className="font-semibold text-gray-700 dark:text-gray-200">Vehicle: {job.vehicleType}</span>
                </li>
              ))}
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
