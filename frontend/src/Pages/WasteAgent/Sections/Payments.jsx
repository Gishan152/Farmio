import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/Components/WasteUI/table";
import { Button } from "@/Components/WasteUI/button";
import NumberFlow from "@number-flow/react";
import { Badge } from "@/Components/WasteUI/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/Components/WasteUI/card";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/Components/WasteUI/popover";
import { IoLocationOutline } from "react-icons/io5";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/Components/WasteUI/select";
import { Input } from "@/Components/WasteUI/input";
import { toast, Toaster } from "sonner";
import {
	Check,
	ChevronsUpDown,
	CreditCard,
	Clock,
	CheckCircle,
	AlertTriangle,
} from "lucide-react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/Components/WasteUI/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/WasteUI/dialog"
import { cn } from "@/lib/utils";
import { Label } from "@/Components/WasteUI/label";
import { FaDownload } from "react-icons/fa6";

const Payments = () => {
	const [payments, setPayments] = useState([
		{
			id: "PAY-2025-001",
			orderId: "WO-2025-001",
			farmer: "Paddy Green Farms",
			farmerAccount: "****-1234",
			wasteType: "Compostable",
			quantity: 2500,
			rate: 0.15,
			amount: "$375.00",
			paymentDate: "2025-01-08",
			dueDate: "2025-01-10",
			status: "Paid",
			paymentMethod: "Bank Transfer",
			transactionId: "TXN-789123456",
			processingFee: "$5.25",
			netAmount: "$369.75",
		},
		{
			id: "PAY-2025-002",
			orderId: "WO-2025-002",
			farmer: "Nuwara Eliya Fresh Co.",
			farmerAccount: "****-5678",
			wasteType: "Spoiled Produce",
			quantity: 850,
			rate: 0.08,
			amount: "$68.00",
			paymentDate: "2025-01-06",
			dueDate: "2025-01-08",
			status: "Paid",
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
			wasteType: "Plastic",
			quantity: 1200,
			rate: 0.12,
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
			wasteType: "Compostable",
			quantity: 3800,
			rate: 0.10,
			amount: "$380.00",
			paymentDate: "2025-01-12",
			dueDate: "2025-01-14",
			status: "Pending",
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
			wasteType: "Agricultural Waste",
			quantity: 5000,
			rate: 0.05,
			amount: "$250.00",
			paymentDate: "2025-01-06",
			dueDate: "2025-01-08",
			status: "Paid",
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
			wasteType: "Spoiled Produce",
			quantity: 1800,
			rate: 0.12,
			amount: "$216.00",
			paymentDate: "2024-12-30",
			dueDate: "2025-01-02",
			status: "Rejected",
			paymentMethod: "Bank Transfer",
			transactionId: "",
			processingFee: "$4.32",
			netAmount: "$211.68",
		},
		{
			id: "PAY-2025-007",
			orderId: "WO-2025-007",
			farmer: "Jaffna Vegetable Co-op",
			farmerAccount: "****-5432",
			wasteType: "Compostable",
			quantity: 2200,
			rate: 0.13,
			amount: "$286.00",
			paymentDate: "2025-07-08",
			dueDate: "2025-07-10",
			status: "Paid",
			paymentMethod: "Bank Transfer",
			transactionId: "TXN-789456123",
			processingFee: "$4.29",
			netAmount: "$281.71",
		},
		{
			id: "PAY-2025-008",
			orderId: "WO-2025-008",
			farmer: "Negombo Fish Market",
			farmerAccount: "****-9876",
			wasteType: "Spoiled Produce",
			quantity: 950,
			rate: 0.09,
			amount: "$85.50",
			paymentDate: "2025-07-09",
			dueDate: "2025-07-11",
			status: "Pending",
			paymentMethod: "ACH Transfer",
			transactionId: "",
			processingFee: "$2.85",
			netAmount: "$82.65",
		},
		{
			id: "PAY-2025-009",
			orderId: "WO-2025-009",
			farmer: "Anuradhapura Rice Mills",
			farmerAccount: "****-3210",
			wasteType: "Agricultural Waste",
			quantity: 4500,
			rate: 0.06,
			amount: "$270.00",
			paymentDate: "2025-07-09",
			dueDate: "2025-07-11",
			status: "Paid",
			paymentMethod: "Wire Transfer",
			transactionId: "TXN-654321987",
			processingFee: "$5.40",
			netAmount: "$264.60",
		},
		{
			id: "PAY-2025-010",
			orderId: "WO-2025-010",
			farmer: "Batticaloa Coconut Estate",
			farmerAccount: "****-6789",
			wasteType: "Plastic",
			quantity: 1600,
			rate: 0.11,
			amount: "$176.00",
			paymentDate: "2025-07-08",
			dueDate: "2025-07-10",
			status: "Paid",
			paymentMethod: "Bank Transfer",
			transactionId: "TXN-987654321",
			processingFee: "$3.52",
			netAmount: "$172.48",
		},
		{
			id: "PAY-2025-011",
			orderId: "WO-2025-011",
			farmer: "Kurunegala Fruit Growers",
			farmerAccount: "****-1357",
			wasteType: "Compostable",
			quantity: 3200,
			rate: 0.14,
			amount: "$448.00",
			paymentDate: "2025-07-07",
			dueDate: "2025-07-09",
			status: "Paid",
			paymentMethod: "Bank Transfer",
			transactionId: "TXN-123789456",
			processingFee: "$6.72",
			netAmount: "$441.28",
		},
		{
			id: "PAY-2025-012",
			orderId: "WO-2025-012",
			farmer: "Trincomalee Seafood Co.",
			farmerAccount: "****-2468",
			wasteType: "Spoiled Produce",
			quantity: 1100,
			rate: 0.08,
			amount: "$88.00",
			paymentDate: "2025-07-06",
			dueDate: "2025-07-08",
			status: "Pending",
			paymentMethod: "Bank Transfer",
			transactionId: "",
			processingFee: "$2.64",
			netAmount: "$85.36",
		},
		{
			id: "PAY-2025-013",
			orderId: "WO-2025-013",
			farmer: "Badulla Tea Estates",
			farmerAccount: "****-8642",
			wasteType: "Compostable",
			quantity: 2800,
			rate: 0.12,
			amount: "$336.00",
			paymentDate: "2025-07-05",
			dueDate: "2025-07-07",
			status: "Paid",
			paymentMethod: "Wire Transfer",
			transactionId: "TXN-456123789",
			processingFee: "$5.04",
			netAmount: "$330.96",
		},
		{
			id: "PAY-2025-014",
			orderId: "WO-2025-014",
			farmer: "Ratnapura Gem Miners",
			farmerAccount: "****-9753",
			wasteType: "Metal",
			quantity: 650,
			rate: 0.25,
			amount: "$162.50",
			paymentDate: "2025-07-04",
			dueDate: "2025-07-06",
			status: "Paid",
			paymentMethod: "Bank Transfer",
			transactionId: "TXN-789123654",
			processingFee: "$3.25",
			netAmount: "$159.25",
		},
		{
			id: "PAY-2025-015",
			orderId: "WO-2025-015",
			farmer: "Kegalle Paper Mills",
			farmerAccount: "****-1470",
			wasteType: "Paper",
			quantity: 2100,
			rate: 0.07,
			amount: "$147.00",
			paymentDate: "2025-07-03",
			dueDate: "2025-07-05",
			status: "Rejected",
			paymentMethod: "ACH Transfer",
			transactionId: "",
			processingFee: "$2.94",
			netAmount: "$144.06",
		},
		{
			id: "PAY-2025-016",
			orderId: "WO-2025-016",
			farmer: "Colombo Electronics Hub",
			farmerAccount: "****-2580",
			wasteType: "Electronic Waste",
			quantity: 340,
			rate: 0.45,
			amount: "$153.00",
			paymentDate: "2025-07-02",
			dueDate: "2025-07-04",
			status: "Paid",
			paymentMethod: "Bank Transfer",
			transactionId: "TXN-321654987",
			processingFee: "$3.06",
			netAmount: "$149.94",
		},
		{
			id: "PAY-2025-017",
			orderId: "WO-2025-017",
			farmer: "Galle Glass Works",
			farmerAccount: "****-3691",
			wasteType: "Glass",
			quantity: 890,
			rate: 0.15,
			amount: "$133.50",
			paymentDate: "2025-07-01",
			dueDate: "2025-07-03",
			status: "Pending",
			paymentMethod: "Wire Transfer",
			transactionId: "",
			processingFee: "$2.67",
			netAmount: "$130.83",
		},
	]);

	// Filter state variables
	const cities = [
		{ value: "colombo", label: "Colombo" },
		{ value: "kandy", label: "Kandy" },
		{ value: "galle", label: "Galle" },
		{ value: "jaffna", label: "Jaffna" },
		{ value: "negombo", label: "Negombo" },
		{ value: "anuradhapura", label: "Anuradhapura" },
		{ value: "batticaloa", label: "Batticaloa" },
		{ value: "matara", label: "Matara" },
		{ value: "kurunegala", label: "Kurunegala" },
		{ value: "trincomalee", label: "Trincomalee" },
		{ value: "badulla", label: "Badulla" },
		{ value: "ratnapura", label: "Ratnapura" },
		{ value: "kegalle", label: "Kegalle" },
	];

	const [open, setOpen] = useState(false);
	const [selectedDistrict, setSelectedDistrict] = useState("");

	const [filters, setFilters] = useState({
		status: "All",
		wasteType: "All",
		searchTerm: "",
		dateRange: "All",
		sortBy: "date",
		sortOrder: "desc",
	});

	const wasteTypes = [
		"Compostable",
		"Plastic", 
		"Spoiled Produce",
		"Agricultural Waste",
		"Glass",
		"Metal",
		"Paper",
		"Electronic Waste"
	];

	const farmerNames = [...new Set(payments.map(p => p.farmer))].sort();

	const getStatusBadge = (status) => {
		const styles = {
			Paid: "bg-green-100 text-green-800",
			Pending: "bg-yellow-100 text-yellow-800",
			Rejected: "bg-red-100 text-red-800",
		};
		return styles[status] || "bg-gray-100 text-gray-800";
	};

	const getWasteTypeBadge = (type) => {
		const styles = {
			"Compostable": "bg-green-100 text-green-800",
			"Plastic": "bg-blue-100 text-blue-800",
			"Spoiled Produce": "bg-orange-100 text-orange-800",
			"Agricultural Waste": "bg-emerald-100 text-emerald-800",
			"Glass": "bg-cyan-100 text-cyan-800",
			"Metal": "bg-gray-100 text-gray-800",
			"Paper": "bg-yellow-100 text-yellow-800",
			"Electronic Waste": "bg-purple-100 text-purple-800",
		};
		return styles[type] || "bg-gray-100 text-gray-800";
	};

	const getPaymentMethodBadge = (method) => {
		const styles = {
			"Bank Transfer": "bg-blue-100 text-blue-800",
			"ACH Transfer": "bg-purple-100 text-purple-800",
			"Wire Transfer": "bg-green-100 text-green-800",
			Check: "bg-orange-100 text-orange-800",
		};
		return styles[method] || "bg-gray-100 text-gray-800";
	};

	const handleDownloadCSV = () => {
		const csvHeaders = "Date,Farmer Name,Waste Type,Quantity (kg),Rate (Rs/kg),Total Payment,Status,Transaction ID\n";
		const csvData = filteredPayments.map(payment => {
			const rate = (parseFloat(payment.amount.replace('$', '')) / payment.quantity).toFixed(2);
			return `${payment.paymentDate},"${payment.farmer}","${payment.wasteType}",${payment.quantity},${rate},${payment.amount},${payment.status},"${payment.transactionId || 'N/A'}"`;
		}).join('\n');
		
		const csvContent = csvHeaders + csvData;
		const blob = new Blob([csvContent], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `payment-history-${new Date().toISOString().split('T')[0]}.csv`;
		link.click();
		window.URL.revokeObjectURL(url);
		
		toast.success("CSV Downloaded!", {
			description: "Payment history exported successfully",
		});
	};

	const handleMakePayment = (paymentId) => {
		const startTask = () => {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					setPayments(
						payments.map((payment) =>
							payment.id === paymentId
								? {
										...payment,
										status: "Completed",
										transactionId: `TXN-${Date.now()}`,
										paymentDate: new Date()
											.toISOString()
											.split("T")[0],
								  }
								: payment
						)
					);
					resolve({ transactionId: `TXN-${Date.now()}` }); // Return data for success callback
				}, 2000);
			});
		};

		toast.promise(startTask(), {
			loading: "Payment is processing...",
			success: (data) => ({
				message: "Payment completed successfully!",
				description: `Payment ${paymentId} has been processed. Transaction ID: ${data.transactionId}`,
			}),
			error: "Payment failed. Please try again.",
		});

		// Remove the duplicate toast.success() call since toast.promise handles it
	};

	const handleSchedulePayment = (paymentId) => {
		setPayments(
			payments.map((payment) =>
				payment.id === paymentId
					? { ...payment, status: "Scheduled" }
					: payment
			)
		);
		toast.success("Payment scheduled!", {
			description: `Payment ${paymentId} has been scheduled for processing.`,
		});
	};

	const handleViewReceipt = (payment) => {
		console.log("Viewing receipt for payment:", payment.id);
		toast.info("Opening receipt...", {
			description: `Receipt for payment ${payment.id}`,
		});
		// Implementation for viewing receipt
	};

	const handleContactFarmer = (payment) => {
		console.log("Contacting farmer:", payment.farmer);
		toast.success("Contact request sent!", {
			description: `Notification sent to ${payment.farmer}`,
		});
		// Implementation for contacting farmer
	};

	// Filter and sort payments based on current filter state
	const filteredPayments = payments.filter((payment) => {
		// Get selected district label
		const selectedDistrictLabel = selectedDistrict
			? cities.find((city) => city.value === selectedDistrict)?.label
			: "";

		// Date range filter
		const paymentDate = new Date(payment.paymentDate);
		const now = new Date();
		let dateMatch = true;
		
		if (filters.dateRange === "thisMonth") {
			dateMatch = paymentDate.getMonth() === now.getMonth() && 
						paymentDate.getFullYear() === now.getFullYear();
		} else if (filters.dateRange === "lastMonth") {
			const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
			dateMatch = paymentDate.getMonth() === lastMonth.getMonth() && 
						paymentDate.getFullYear() === lastMonth.getFullYear();
		} else if (filters.dateRange === "last7Days") {
			const weekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
			dateMatch = paymentDate >= weekAgo;
		}

		return (
			(filters.status === "All" || payment.status === filters.status) &&
			(filters.wasteType === "All" || payment.wasteType === filters.wasteType) &&
			(filters.searchTerm === "" ||
				payment.farmer
					.toLowerCase()
					.includes(filters.searchTerm.toLowerCase()) ||
				payment.wasteType
					.toLowerCase()
					.includes(filters.searchTerm.toLowerCase()) ||
				payment.id
					.toLowerCase()
					.includes(filters.searchTerm.toLowerCase()) ||
				payment.orderId
					.toLowerCase()
					.includes(filters.searchTerm.toLowerCase())) &&
			(selectedDistrictLabel === "" ||
				payment.farmer
					.toLowerCase()
					.includes(selectedDistrictLabel.toLowerCase())) &&
			dateMatch
		);
	}).sort((a, b) => {
		// Sort logic
		if (filters.sortBy === "date") {
			const dateA = new Date(a.paymentDate);
			const dateB = new Date(b.paymentDate);
			return filters.sortOrder === "desc" ? dateB - dateA : dateA - dateB;
		} else if (filters.sortBy === "amount") {
			const amountA = parseFloat(a.amount.replace("$", ""));
			const amountB = parseFloat(b.amount.replace("$", ""));
			return filters.sortOrder === "desc" ? amountB - amountA : amountA - amountB;
		} else if (filters.sortBy === "farmer") {
			return filters.sortOrder === "desc" 
				? b.farmer.localeCompare(a.farmer)
				: a.farmer.localeCompare(b.farmer);
		}
		return 0;
	});

	// Summary calculations
	const totalPaidThisMonth = filteredPayments
		.filter((p) => {
			const paymentDate = new Date(p.paymentDate);
			const now = new Date();
			return p.status === "Paid" && 
				   paymentDate.getMonth() === now.getMonth() && 
				   paymentDate.getFullYear() === now.getFullYear();
		})
		.reduce((total, payment) => total + parseFloat(payment.amount.replace("$", "")), 0);

	const totalWeightCollected = filteredPayments
		.reduce((total, payment) => total + payment.quantity, 0);

	const topPaidFarmer = payments
		.reduce((acc, payment) => {
			if (payment.status === "Paid") {
				const amount = parseFloat(payment.amount.replace("$", ""));
				acc[payment.farmer] = (acc[payment.farmer] || 0) + amount;
			}
			return acc;
		}, {});
	
	const topFarmerName = Object.keys(topPaidFarmer).length > 0 
		? Object.keys(topPaidFarmer).reduce((a, b) => topPaidFarmer[a] > topPaidFarmer[b] ? a : b)
		: "No payments yet";

	const paidCount = filteredPayments.filter((p) => p.status === "Paid").length;
	const pendingCount = filteredPayments.filter((p) => p.status === "Pending").length;
	const rejectedCount = filteredPayments.filter((p) => p.status === "Rejected").length;

	return (
		<div className="space-y-6">
			<Toaster
				position="bottom-right"
				richColors
				toastOptions={{
					classNames: {
						title: "font-bold font-inherit text-base tracking-tight",
						description: "mt-0 leading-relaxed",
					},
				}}
			/>

			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
						Payments to Farmers
					</h1>
					<p className="text-gray-600 dark:text-gray-300 mt-1">
						Manage and track payments to farmers for waste
						collection services
					</p>
				</div>
				<div className="flex space-x-2">
					
					<Button>Setup Auto-Pay</Button>
				</div>
			</div>

			{/* Payment Summary */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
					<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
						<CreditCard className="h-4 w-4" />
						Total Paid This Month
					</h3>
					<p className="text-2xl mt-2 text-right font-bold text-gray-600 dark:text-green-400">
						<NumberFlow value={totalPaidThisMonth} format={{ style: "currency", currency: "USD" }} />
					</p>
				</div>
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
					<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
						<Clock className="h-4 w-4" />
						Number of Payments
					</h3>
					<p className="text-2xl mt-2 text-right font-bold text-gray-600 dark:text-gray-100">
						<NumberFlow value={filteredPayments.length} />
					</p>
				</div>
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
					<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
						<CheckCircle className="h-4 w-4" />
						Top Paid Farmer
					</h3>
					<p className="text-m text-right mt-4 font-medium text-gray-600 dark:text-gray-100 truncate">
						{topFarmerName}
					</p>
				</div>
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
					<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
						<AlertTriangle className="h-4 w-4" />
						Total Weight Collected
					</h3>
					<p className="text-2xl mt-2 text-right font-bold text-gray-600 dark:text-blue-400">
						<NumberFlow value={totalWeightCollected} />
						<span className="text-sm font-normal text-gray-500"> kg</span>
					</p>
				</div>
			</div>

			{/* Status Overview */}
			<div className="grid grid-cols-3 gap-4">
				<div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
					<h3 className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
						Paid Payments
					</h3>
					<p className="text-6xl text-right mt-2 font-bold text-green-600 dark:text-green-400">
						<NumberFlow value={paidCount} />
					</p>
				</div>
				<div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
					<h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
						Pending Payments
					</h3>
					<p className="text-6xl text-right mt-2 font-bold text-yellow-600 dark:text-yellow-400">
						<NumberFlow value={pendingCount} />
					</p>
				</div>
				<div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
					<h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
						Rejected Payments
					</h3>
					<p className="text-6xl text-right mt-2 font-bold text-red-600 dark:text-red-400">
						<NumberFlow value={rejectedCount} />
					</p>
				</div>
			</div>

			{/* Rejected Payments Alert */}
			{rejectedCount > 0 && (
				<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
					<div className="flex items-center">
						<div className="text-red-600 mr-3">⚠️</div>
						<div>
							<h3 className="text-red-800 dark:text-red-200 font-medium">
								{rejectedCount} Rejected Payment{rejectedCount > 1 ? "s" : ""}
							</h3>
							<p className="text-red-600 dark:text-red-300 text-sm">
								These payments require review and possible resubmission.
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Payments Table */}
			<Card className="bg-white dark:bg-gray-800 border rounded-[1.5rem] border-gray-200 dark:border-gray-700 gap-0 py-0 mb-4">
				<div className="p-4 pb-4 border-b border-gray-200 dark:border-gray-700">
					<CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
						Payment Transactions ({filteredPayments.length})
					</CardTitle>
					<CardDescription>
						Review and manage payments to farmers for waste
						collection services
					</CardDescription>
					<div id="payment-search" className="flex mt-5 gap-2 flex-wrap">
						<div className="flex-1 min-w-[300px]">
							<Input
								type="text"
								placeholder="Search by farmer name, waste type, or payment ID..."
								value={filters.searchTerm}
								onChange={(e) =>
									setFilters({
										...filters,
										searchTerm: e.target.value,
									})
								}
							/>
						</div>
						
						{/* Date Range Filter */}
						<div>
							<Select
								value={filters.dateRange}
								onValueChange={(value) =>
									setFilters({ ...filters, dateRange: value })
								}
							>
								<SelectTrigger className="w-fit cursor-pointer">
									<SelectValue placeholder="Date Range" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="All">All Time</SelectItem>
									<SelectItem value="last7Days">Last 7 Days</SelectItem>
									<SelectItem value="thisMonth">This Month</SelectItem>
									<SelectItem value="lastMonth">Last Month</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Waste Type Filter */}
						<div>
							<Select
								value={filters.wasteType}
								onValueChange={(value) =>
									setFilters({ ...filters, wasteType: value })
								}
							>
								<SelectTrigger className="w-fit cursor-pointer">
									<SelectValue placeholder="Waste Type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="All">All Types</SelectItem>
									{wasteTypes.map((type) => (
										<SelectItem key={type} value={type}>
											{type}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Status Filter */}
						<div>
							<Select
								value={filters.status}
								onValueChange={(value) =>
									setFilters({ ...filters, status: value })
								}
							>
								<SelectTrigger className="w-fit cursor-pointer">
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="All">All Status</SelectItem>
									<SelectItem value="Paid">Paid</SelectItem>
									<SelectItem value="Pending">Pending</SelectItem>
									<SelectItem value="Rejected">Rejected</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Sort Options */}
						<div>
							<Select
								value={`${filters.sortBy}-${filters.sortOrder}`}
								onValueChange={(value) => {
									const [sortBy, sortOrder] = value.split('-');
									setFilters({ ...filters, sortBy, sortOrder });
								}}
							>
								<SelectTrigger className="w-fit cursor-pointer">
									<SelectValue placeholder="Sort By" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="date-desc">Date (Newest)</SelectItem>
									<SelectItem value="date-asc">Date (Oldest)</SelectItem>
									<SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
									<SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
									<SelectItem value="farmer-asc">Farmer (A-Z)</SelectItem>
									<SelectItem value="farmer-desc">Farmer (Z-A)</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Download CSV Button */}
						<Button variant="outline" onClick={handleDownloadCSV}>
							<FaDownload className="h-4 w-4 mr-2" />
							Export CSV
						</Button>
					</div>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Date</TableHead>
							<TableHead>Farmer Name</TableHead>
							<TableHead>Waste Type</TableHead>
							<TableHead>Quantity</TableHead>
							<TableHead>Rate</TableHead>
							<TableHead>Total Payment</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredPayments.map((payment) => (
							<TableRow key={payment.id}>
								<TableCell>
									<div className="font-medium text-gray-900 dark:text-gray-100">
										{new Date(payment.paymentDate).toLocaleDateString()}
									</div>
									<div className="text-xs text-gray-500 dark:text-gray-400">
										{payment.id}
									</div>
								</TableCell>
								<TableCell>
									<div className="font-medium text-gray-900 dark:text-gray-100">
										{payment.farmer}
									</div>
									<div className="text-sm text-gray-500 dark:text-gray-400">
										{payment.farmerAccount}
									</div>
								</TableCell>
								<TableCell>
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getWasteTypeBadge(
											payment.wasteType
										)}`}
									>
										{payment.wasteType}
									</span>
								</TableCell>
								<TableCell>
									<div className="font-medium text-gray-900 dark:text-gray-100">
										{payment.quantity.toLocaleString()} kg
									</div>
								</TableCell>
								<TableCell>
									<div className="font-medium text-gray-900 dark:text-gray-100">
										${payment.rate.toFixed(2)}/kg
									</div>
								</TableCell>
								<TableCell>
									<div className="font-medium text-gray-900 dark:text-gray-100">
										{payment.amount}
									</div>
									<div className="text-xs text-gray-500 dark:text-gray-400">
										Fee: {payment.processingFee}
									</div>
									<div className="text-sm font-semibold text-green-600">
										Net: {payment.netAmount}
									</div>
								</TableCell>
								<TableCell>
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
											payment.status
										)}`}
									>
										{payment.status}
									</span>
								</TableCell>
								<TableCell className="text-right">
									<div className="flex justify-end space-x-2">
										{payment.status === "Paid" && (
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
													Review
												</Button>
												<Button
													size="sm"
													onClick={() => handleMakePayment(payment.id)}
												>
													Process
												</Button>
											</>
										)}
										{payment.status === "Rejected" && (
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
													Retry
												</Button>
											</>
										)}
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>
		</div>
	);
};

export default Payments;
