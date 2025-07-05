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

const Payments = () => {
  const [payments, setPayments] = useState([
    {
      id: "PAY-2025-001",
      orderId: "WO-2025-001",
      farmer: "Paddy Green Farms",
      farmerAccount: "****-1234",
      wasteType: "Rice Straw Residue",
      quantity: "2,500 kg",
      amount: "$375.00",
      paymentDate: "2025-01-08",
      dueDate: "2025-01-10",
      status: "Pending",
      paymentMethod: "Bank Transfer",
      transactionId: "",
      processingFee: "$5.25",
      netAmount: "$369.75",
    },
    {
      id: "PAY-2025-002",
      orderId: "WO-2025-002",
      farmer: "Nuwara Eliya Fresh Co.",
      farmerAccount: "****-5678",
      wasteType: "Vegetable Trimmings",
      quantity: "850 kg",
      amount: "$68.00",
      paymentDate: "2025-01-06",
      dueDate: "2025-01-08",
      status: "Completed",
      paymentMethod: "Bank Transfer",
      transactionId: "TXN-789123456",
      processingFee: "$2.40",
      netAmount: "$65.60",
    },
    {
      id: "PAY-2025-003",
      orderId: "WO-2025-003",
      farmer: "Lanka Coconut Estate",
      farmerAccount: "****-9012",
      wasteType: "Coconut Husk Fiber",
      quantity: "1,200 kg",
      amount: "$144.00",
      paymentDate: "2025-01-09",
      dueDate: "2025-01-11",
      status: "Pending",
      paymentMethod: "ACH Transfer",
      transactionId: "",
      processingFee: "$3.60",
      netAmount: "$140.40",
    },
    {
      id: "PAY-2025-004",
      orderId: "WO-2025-004",
      farmer: "Kandy Hill Tea Estate",
      farmerAccount: "****-3456",
      wasteType: "Tea Leaf Waste",
      quantity: "3,800 kg",
      amount: "$380.00",
      paymentDate: "2025-01-12",
      dueDate: "2025-01-14",
      status: "Scheduled",
      paymentMethod: "Bank Transfer",
      transactionId: "",
      processingFee: "$7.60",
      netAmount: "$372.40",
    },
    {
      id: "PAY-2025-005",
      orderId: "WO-2025-005",
      farmer: "Galle Sugar Mills",
      farmerAccount: "****-7890",
      wasteType: "Sugarcane Bagasse",
      quantity: "5,000 kg",
      amount: "$250.00",
      paymentDate: "2025-01-06",
      dueDate: "2025-01-08",
      status: "Completed",
      paymentMethod: "Wire Transfer",
      transactionId: "TXN-456789123",
      processingFee: "$5.00",
      netAmount: "$245.00",
    },
    {
      id: "PAY-2025-006",
      orderId: "WO-2024-098",
      farmer: "Matara Spice Gardens",
      farmerAccount: "****-2468",
      wasteType: "Spice Processing Waste",
      quantity: "1,800 kg",
      amount: "$216.00",
      paymentDate: "2024-12-30",
      dueDate: "2025-01-02",
      status: "Overdue",
      paymentMethod: "Bank Transfer",
      transactionId: "",
      processingFee: "$4.32",
      netAmount: "$211.68",
    },
  ]);

  const getStatusBadge = (status) => {
    const styles = {
      "Completed": "bg-green-100 text-green-800",
      "Pending": "bg-yellow-100 text-yellow-800",
      "Scheduled": "bg-blue-100 text-blue-800",
      "Overdue": "bg-red-100 text-red-800",
      "Failed": "bg-red-100 text-red-800",
      "Cancelled": "bg-gray-100 text-gray-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentMethodBadge = (method) => {
    const styles = {
      "Bank Transfer": "bg-blue-100 text-blue-800",
      "ACH Transfer": "bg-purple-100 text-purple-800",
      "Wire Transfer": "bg-green-100 text-green-800",
      "Check": "bg-orange-100 text-orange-800",
    };
    return styles[method] || "bg-gray-100 text-gray-800";
  };

  const handleMakePayment = (paymentId) => {
    setPayments(payments.map(payment => 
      payment.id === paymentId 
        ? { 
            ...payment, 
            status: "Completed", 
            transactionId: `TXN-${Date.now()}`,
            paymentDate: new Date().toISOString().split('T')[0]
          }
        : payment
    ));
  };

  const handleSchedulePayment = (paymentId) => {
    setPayments(payments.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: "Scheduled" }
        : payment
    ));
  };

  const handleViewReceipt = (payment) => {
    console.log("Viewing receipt for payment:", payment.id);
    // Implementation for viewing receipt
  };

  const handleContactFarmer = (payment) => {
    console.log("Contacting farmer:", payment.farmer);
    // Implementation for contacting farmer
  };

  const totalPending = payments
    .filter(p => p.status === "Pending" || p.status === "Overdue")
    .reduce((total, payment) => total + parseFloat(payment.amount.replace('$', '')), 0);

  const totalPaid = payments
    .filter(p => p.status === "Completed")
    .reduce((total, payment) => total + parseFloat(payment.amount.replace('$', '')), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Payments to Farmers</h1>
        <div className="flex space-x-2">
          <Button variant="outline">Payment History</Button>
          <Button>Setup Auto-Pay</Button>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Payments</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{payments.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Pending Amount</h3>
          <p className="text-2xl font-bold text-red-600">
            ${totalPending.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Paid This Month</h3>
          <p className="text-2xl font-bold text-green-600">
            ${totalPaid.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Overdue Payments</h3>
          <p className="text-2xl font-bold text-red-600">
            {payments.filter(p => p.status === "Overdue").length}
          </p>
        </div>
      </div>

      {/* Overdue Payments Alert */}
      {payments.some(p => p.status === "Overdue") && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-red-400">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                You have {payments.filter(p => p.status === "Overdue").length} overdue payment(s)
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>Please make these payments as soon as possible to maintain good relationships with farmers.</p>
              </div>
              <div className="mt-4">
                <Button size="sm" variant="destructive">
                  Pay All Overdue
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Payment Transactions</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment Details</TableHead>
              <TableHead>Farmer / Account</TableHead>
              <TableHead>Order Information</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{payment.id}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{payment.orderId}</div>
                    {payment.transactionId && (
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        TXN: {payment.transactionId}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{payment.farmer}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{payment.farmerAccount}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{payment.wasteType}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{payment.quantity}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{payment.amount}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Fee: {payment.processingFee}</div>
                    <div className="text-sm font-semibold text-green-600">
                      Net: {payment.netAmount}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      Paid: {new Date(payment.paymentDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Due: {new Date(payment.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentMethodBadge(payment.paymentMethod)}`}
                  >
                    {payment.paymentMethod}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(payment.status)}`}
                  >
                    {payment.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {payment.status === "Completed" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewReceipt(payment)}
                      >
                        Receipt
                      </Button>
                    )}
                    {payment.status === "Pending" && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSchedulePayment(payment.id)}
                        >
                          Schedule
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleMakePayment(payment.id)}
                        >
                          Pay Now
                        </Button>
                      </>
                    )}
                    {payment.status === "Overdue" && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleContactFarmer(payment)}
                        >
                          Contact
                        </Button>
                        <Button 
                          variant="destructive"
                          size="sm"
                          onClick={() => handleMakePayment(payment.id)}
                        >
                          Pay Urgent
                        </Button>
                      </>
                    )}
                    {payment.status === "Scheduled" && (
                      <Button 
                        variant="secondary"
                        size="sm"
                      >
                        Scheduled
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <div className="font-medium">Primary Bank Account</div>
                <div className="text-sm text-gray-500">****-****-****-1234</div>
              </div>
              <span className="text-green-600 text-sm">Active</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <div className="font-medium">Business Credit Card</div>
                <div className="text-sm text-gray-500">****-****-****-5678</div>
              </div>
              <span className="text-gray-500 text-sm">Backup</span>
            </div>
            <Button variant="outline" className="w-full">
              Add Payment Method
            </Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Payment Schedule</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Auto-pay Settings</span>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Payment Frequency</span>
              <span className="text-sm font-medium">Weekly</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Next Payment Date</span>
              <span className="text-sm font-medium">Jan 12, 2025</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Estimated Amount</span>
              <span className="text-sm font-medium text-green-600">$823.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
