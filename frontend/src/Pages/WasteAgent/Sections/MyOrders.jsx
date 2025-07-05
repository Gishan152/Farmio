import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const MyOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: "WO-2025-001",
      wasteType: "Rice Straw Residue",
      farmer: "Paddy Green Farms",
      farmerContact: "+94-77-1234567",
      farmerEmail: "contact@paddygreen.lk",
      location: "Anuradhapura",
      quantity: "2,500 kg",
      pricePerKg: "$0.15",
      totalAmount: "$375",
      orderDate: "2025-01-05",
      pickupDate: "2025-01-08",
      pickupTime: "09:00 AM",
      status: "Pickup Scheduled",
      paymentStatus: "Pending",
      pickupAddress: "No. 45, Paddy Fields Road, Anuradhapura 50000",
      specialInstructions: "Use rear entrance, contact farmer 30 mins before arrival",
      estimatedProcessingValue: "$850",
    },
    {
      id: "WO-2025-002",
      wasteType: "Vegetable Trimmings",
      farmer: "Nuwara Eliya Fresh Co.",
      farmerContact: "+94-77-2345678",
      farmerEmail: "orders@nuwarafresh.lk",
      location: "Nuwara Eliya",
      quantity: "850 kg",
      pricePerKg: "$0.08",
      totalAmount: "$68",
      orderDate: "2025-01-04",
      pickupDate: "2025-01-06",
      pickupTime: "02:00 PM",
      status: "Completed",
      paymentStatus: "Paid",
      pickupAddress: "No. 78, Vegetable Market Road, Nuwara Eliya 22200",
      specialInstructions: "Material ready in cooling shed",
      estimatedProcessingValue: "$180",
    },
    {
      id: "WO-2025-003",
      wasteType: "Coconut Husk Fiber",
      farmer: "Lanka Coconut Estate",
      farmerContact: "+94-77-3456789",
      farmerEmail: "info@lankacoconut.lk",
      location: "Kurunegala",
      quantity: "1,200 kg",
      pricePerKg: "$0.12",
      totalAmount: "$144",
      orderDate: "2025-01-03",
      pickupDate: "2025-01-07",
      pickupTime: "01:00 PM",
      status: "In Transit",
      paymentStatus: "Pending",
      pickupAddress: "No. 123, Coconut Estate Road, Kurunegala 60000",
      specialInstructions: "Dry material, ready for immediate pickup",
      estimatedProcessingValue: "$320",
    },
    {
      id: "WO-2025-004",
      wasteType: "Tea Leaf Waste",
      farmer: "Kandy Hill Tea Estate",
      farmerContact: "+94-77-4567890",
      farmerEmail: "logistics@kandyhilltea.lk",
      location: "Kandy",
      quantity: "3,800 kg",
      pricePerKg: "$0.10",
      totalAmount: "$380",
      orderDate: "2025-01-05",
      pickupDate: "2025-01-09",
      pickupTime: "08:00 AM",
      status: "Confirmed",
      paymentStatus: "Pending",
      pickupAddress: "No. 56, Tea Factory Road, Kandy 20000",
      specialInstructions: "Large truck access available",
      estimatedProcessingValue: "$950",
    },
    {
      id: "WO-2025-005",
      wasteType: "Sugarcane Bagasse",
      farmer: "Galle Sugar Mills",
      farmerContact: "+94-77-5678901",
      farmerEmail: "waste@gallesugar.lk",
      location: "Galle",
      quantity: "5,000 kg",
      pricePerKg: "$0.05",
      totalAmount: "$250",
      orderDate: "2025-01-02",
      pickupDate: "2025-01-06",
      pickupTime: "10:00 AM",
      status: "Processing",
      paymentStatus: "Paid",
      pickupAddress: "No. 89, Sugar Mill Lane, Galle 80000",
      specialInstructions: "Material located in storage building 3",
      estimatedProcessingValue: "$600",
    },
  ]);

  const getStatusBadge = (status) => {
    const styles = {
      "Confirmed": "bg-blue-100 text-blue-800",
      "Pickup Scheduled": "bg-yellow-100 text-yellow-800",
      "In Transit": "bg-purple-100 text-purple-800",
      "Processing": "bg-orange-100 text-orange-800",
      "Completed": "bg-green-100 text-green-800",
      "Cancelled": "bg-red-100 text-red-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusBadge = (status) => {
    const styles = {
      "Paid": "bg-green-100 text-green-800",
      "Pending": "bg-yellow-100 text-yellow-800",
      "Overdue": "bg-red-100 text-red-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const handleConfirmPickup = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: "In Transit" }
        : order
    ));
  };

  const handleCompleteOrder = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: "Processing" }
        : order
    ));
  };

  const handleMakePayment = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, paymentStatus: "Paid" }
        : order
    ));
  };

  const handleContactFarmer = (order) => {
    console.log("Contacting farmer:", order.farmer);
    // Implementation for contacting farmer
  };

  const handleSchedulePickup = (orderId) => {
    console.log("Scheduling pickup for order:", orderId);
    // Implementation for pickup scheduling
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Orders</h1>
        <div className="flex space-x-2">
          <Button variant="outline">Export Orders</Button>
          <Button>Create New Order</Button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{orders.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Active Orders</h3>
          <p className="text-2xl font-bold text-blue-600">
            {orders.filter(o => !["Completed", "Cancelled"].includes(o.status)).length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Spent</h3>
          <p className="text-2xl font-bold text-red-600">
            ${orders.reduce((total, order) => 
              total + parseFloat(order.totalAmount.replace('$', '')), 0
            ).toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Processing Value</h3>
          <p className="text-2xl font-bold text-green-600">
            ${orders.reduce((total, order) => 
              total + parseFloat(order.estimatedProcessingValue.replace('$', '')), 0
            ).toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Pending Payments</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {orders.filter(o => o.paymentStatus === "Pending").length}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Order Management</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Details</TableHead>
              <TableHead>Farmer / Location</TableHead>
              <TableHead>Quantity & Pricing</TableHead>
              <TableHead>Pickup Schedule</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Est. Value</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{order.id}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{order.wasteType}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Ordered: {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{order.farmer}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{order.location}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {order.farmerContact}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{order.quantity}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{order.pricePerKg}/kg</div>
                    <div className="text-sm font-semibold text-green-600">{order.totalAmount}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {new Date(order.pickupDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{order.pickupTime}</div>
                    {order.specialInstructions && (
                      <div className="text-xs text-blue-600 mt-1 max-w-xs">
                        📋 {order.specialInstructions}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusBadge(order.paymentStatus)}`}
                  >
                    {order.paymentStatus}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-green-600">
                    {order.estimatedProcessingValue}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleContactFarmer(order)}
                    >
                      Contact
                    </Button>
                    {order.status === "Confirmed" && (
                      <Button 
                        size="sm"
                        onClick={() => handleSchedulePickup(order.id)}
                      >
                        Schedule
                      </Button>
                    )}
                    {order.status === "Pickup Scheduled" && (
                      <Button 
                        size="sm"
                        onClick={() => handleConfirmPickup(order.id)}
                      >
                        Confirm Pickup
                      </Button>
                    )}
                    {order.status === "In Transit" && (
                      <Button 
                        size="sm"
                        onClick={() => handleCompleteOrder(order.id)}
                      >
                        Mark Delivered
                      </Button>
                    )}
                    {order.paymentStatus === "Pending" && order.status === "Completed" && (
                      <Button 
                        variant="secondary"
                        size="sm"
                        onClick={() => handleMakePayment(order.id)}
                      >
                        Pay Now
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Upcoming Pickups */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Upcoming Pickups</h3>
        <div className="space-y-3">
          {orders
            .filter(order => order.status === "Pickup Scheduled")
            .sort((a, b) => new Date(a.pickupDate) - new Date(b.pickupDate))
            .map((order) => (
              <div key={order.id} className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{order.wasteType} - {order.farmer}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {new Date(order.pickupDate).toLocaleDateString()} at {order.pickupTime}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{order.pickupAddress}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900 dark:text-gray-100">{order.quantity}</div>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
