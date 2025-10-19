import React, { useState, useEffect } from "react";
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
} from "@/Components/WasteUI/dialog";
import { cn } from "@/lib/utils";
import { Label } from "@/Components/WasteUI/label";
import { FaDownload } from "react-icons/fa6";
import api from "@/API/client";

const Payments = () => {
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

	const [payments, setPayments] = useState([]);
	const [loading, setLoading] = useState(true);
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
		"Electronic Waste",
	];

	const farmerNames = [...new Set(payments.map((p) => p.farmer))].sort();

	useEffect(() => {
		setLoading(true);
		api.get("/api/waste/payments")
			.then((res) => res.data)
			.then((data) => {
				setPayments(data);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Error fetching payments:", err);
				setLoading(false);
			});
	}, []);

	// Convert quantity to KG if it's in TON
	const convertToKg = (quantity, unit) => {
		if (!unit) return quantity;
		const unitUpper = unit.toUpperCase();
		if (unitUpper === 'TON' || unitUpper === 'TONS') {
			return quantity * 907.185; // 1 US short ton = 907.185 kg
		}
		return quantity;
	};

	const getStatusBadge = (status) => {
		if (!status) return "bg-gray-100 text-gray-800";

		// Normalize backend values to match style keys
		const normalized = status.replace("_", " ").toLowerCase();

		const styles = {
			paid: "bg-green-100 text-green-800",
			pending: "bg-yellow-100 text-yellow-800",
			processing: "bg-blue-100 text-blue-800",
			rejected: "bg-red-100 text-red-800",
			completed: "bg-purple-100 text-purple-800",
		};

		return styles[normalized] || "bg-gray-100 text-gray-800";
	};

	const getWasteTypeBadge = (type) => {
		const styles = {
			Compostable: "bg-green-100 text-green-800",
			Plastic: "bg-blue-100 text-blue-800",
			"Spoiled Produce": "bg-orange-100 text-orange-800",
			"Agricultural Waste": "bg-emerald-100 text-emerald-800",
			Glass: "bg-cyan-100 text-cyan-800",
			Metal: "bg-gray-100 text-gray-800",
			Paper: "bg-yellow-100 text-yellow-800",
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
		const csvHeaders =
			"Date,Farmer Name,Waste Type,Quantity (kg),Rate (Rs/kg),Total Payment,Status,Transaction ID\n";
		const csvData = filteredPayments
			.map((payment) => {
				const quantityInKg = convertToKg(payment.quantity, payment.quantityUnit);
				const rate = (
					parseFloat(payment.amount.replace("$", "")) /
					quantityInKg
				).toFixed(2);
				return `${payment.paymentDate},"${payment.farmer}","${
					payment.wasteType
				}",${quantityInKg.toFixed(2)},${rate},${payment.amount},${
					payment.status
				},"${payment.transactionId || "N/A"}"`;
			})
			.join("\n");

		const csvContent = csvHeaders + csvData;
		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `payment-history-${
			new Date().toISOString().split("T")[0]
		}.csv`;
		link.click();
		window.URL.revokeObjectURL(url);

		toast.success("CSV Downloaded!", {
			description: "Payment history exported successfully",
		});
	};

	const handleMakePayment = (paymentId) => {
		const startTask = async () => {
			try {
				// Update status to PROCESSING
				const res = await api.put(
					`/api/waste/payments/${paymentId}/status?status=PROCESSING`
				);
				
				const updatedPayment = res.data;
				
				// Update local state with backend response
				setPayments((prev) =>
					prev.map((payment) =>
						payment.id === paymentId
							? { ...payment, status: updatedPayment.status }
							: payment
					)
				);

				// Open payment gateway in new tab (for testing)
				window.open("about:blank", "_blank");

				// Set timeout to revert to PENDING after 2 minutes if not PAID
				setTimeout(async () => {
					try {
						// Fetch current payment status to check if it changed to PAID
						const checkRes = await api.get(`/api/waste/payments/${paymentId}`);
						const currentPayment = checkRes.data;
						
						if (currentPayment.status?.toUpperCase() !== "PAID") {
							// Revert to PENDING if still not PAID
							const revertRes = await api.put(
								`/api/waste/payments/${paymentId}/status?status=PENDING`
							);
							
							const revertedPayment = revertRes.data;
							setPayments((prev) =>
								prev.map((payment) =>
									payment.id === paymentId
										? { ...payment, status: revertedPayment.status }
										: payment
								)
							);
							
							toast.warning("Payment timed out", {
								description: `Payment ${paymentId} has been reverted to pending status.`,
							});
						}
					} catch (error) {
						console.error("Error checking payment status:", error);
					}
				}, 120000); // 2 minutes = 120000ms

				return { paymentId };
			} catch (error) {
				console.error("Error processing payment:", error);
				throw error;
			}
		};

		toast.promise(startTask(), {
			loading: "Initiating payment...",
			success: (data) => ({
				message: "Payment processing started!",
				description: `Payment ${data.paymentId} is now being processed. Complete payment in the new tab.`,
			}),
			error: "Failed to initiate payment. Please try again.",
		});
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
	const filteredPayments = payments
		.filter((payment) => {
			// Get selected district label
			const selectedDistrictLabel = selectedDistrict
				? cities.find((city) => city.value === selectedDistrict)?.label
				: "";

			// Date range filter
			const paymentDate = new Date(payment.paymentDate);
			const now = new Date();
			let dateMatch = true;

			if (filters.dateRange === "thisMonth") {
				dateMatch =
					paymentDate.getMonth() === now.getMonth() &&
					paymentDate.getFullYear() === now.getFullYear();
			} else if (filters.dateRange === "lastMonth") {
				const lastMonth = new Date(
					now.getFullYear(),
					now.getMonth() - 1
				);
				dateMatch =
					paymentDate.getMonth() === lastMonth.getMonth() &&
					paymentDate.getFullYear() === lastMonth.getFullYear();
			} else if (filters.dateRange === "last7Days") {
				const weekAgo = new Date(
					now.getTime() - 7 * 24 * 60 * 60 * 1000
				);
				dateMatch = paymentDate >= weekAgo;
			}

			// Normalize status for comparison
			const normalizedStatus = payment.status?.toUpperCase();
			const filterStatus = filters.status?.toUpperCase();

			return (
				(filters.status === "All" ||
					normalizedStatus === filterStatus) &&
				(filters.wasteType === "All" ||
					payment.wasteType === filters.wasteType) &&
				(filters.searchTerm === "" ||
					payment.farmer
						?.toLowerCase()
						.includes(filters.searchTerm.toLowerCase()) ||
					payment.wasteType
						?.toLowerCase()
						.includes(filters.searchTerm.toLowerCase()) ||
					payment.id
						?.toLowerCase()
						.includes(filters.searchTerm.toLowerCase()) ||
					payment.orderId
						?.toLowerCase()
						.includes(filters.searchTerm.toLowerCase())) &&
				(selectedDistrictLabel === "" ||
					payment.farmer
						?.toLowerCase()
						.includes(selectedDistrictLabel.toLowerCase())) &&
				dateMatch
			);
		})
		.sort((a, b) => {
			// Sort logic
			if (filters.sortBy === "date") {
				const dateA = new Date(a.paymentDate);
				const dateB = new Date(b.paymentDate);
				return filters.sortOrder === "desc"
					? dateB - dateA
					: dateA - dateB;
			} else if (filters.sortBy === "amount") {
				const amountA = parseFloat(a.amount.replace("$", ""));
				const amountB = parseFloat(b.amount.replace("$", ""));
				return filters.sortOrder === "desc"
					? amountB - amountA
					: amountA - amountB;
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
			const normalizedStatus = p.status?.toUpperCase();
			return (
				normalizedStatus === "PAID" &&
				paymentDate.getMonth() === now.getMonth() &&
				paymentDate.getFullYear() === now.getFullYear()
			);
		})
		.reduce(
			(total, payment) =>
				total + parseFloat(payment.amount?.replace("$", "") || 0),
			0
		);

	const totalWeightCollected = filteredPayments.reduce(
		(total, payment) => total + convertToKg(payment.quantity, payment.quantityUnit),
		0
	);

	const topPaidFarmer = payments.reduce((acc, payment) => {
		const normalizedStatus = payment.status?.toUpperCase();
		if (normalizedStatus === "PAID") {
			const amount = parseFloat(payment.amount?.replace("$", "") || 0);
			acc[payment.farmer] = (acc[payment.farmer] || 0) + amount;
		}
		return acc;
	}, {});

	const topFarmerName =
		Object.keys(topPaidFarmer).length > 0
			? Object.keys(topPaidFarmer).reduce((a, b) =>
					topPaidFarmer[a] > topPaidFarmer[b] ? a : b
			  )
			: "No payments yet";

	const paidCount = filteredPayments.filter(
		(p) => p.status === "Paid" || p.status === "PAID"
	).length;
	const pendingCount = filteredPayments.filter(
		(p) => p.status === "Pending" || p.status === "PENDING"
	).length;
	const processingCount = filteredPayments.filter(
		(p) => p.status === "Processing" || p.status === "PROCESSING"
	).length;

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
					{/* <Button>Setup Auto-Pay</Button> */}
				</div>
			</div>

			{/* Payment Summary */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center overflow-hidden">
					<div className="absolute left-0 top-0 h-full w-1 bg-green-500 rounded-l-lg" />
					<Check className="h-7 w-7 text-green-500 mr-3 z-10" />
					<div className="z-10">
						<p className="text-xs font-medium text-gray-500">
							Total Paid This Month
						</p>
						<p className="text-lg font-bold text-gray-900">
							<NumberFlow
								value={totalPaidThisMonth}
								format={{ style: "currency", currency: "USD" }}
							/>
						</p>
					</div>
				</div>
				<div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center overflow-hidden">
					<div className="absolute left-0 top-0 h-full w-1 bg-yellow-500 rounded-l-lg" />
					<Clock className="h-7 w-7 text-yellow-500 mr-3 z-10" />
					<div className="z-10">
						<p className="text-xs font-medium text-gray-500">
							Pending Payments
						</p>
						<p className="text-lg font-bold text-gray-900">
							<NumberFlow value={pendingCount} />
						</p>
					</div>
				</div>
			</div>

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
					<div
						id="payment-search"
						className="flex mt-5 gap-2 flex-wrap"
					>
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
									<SelectItem value="All">
										All Time
									</SelectItem>
									<SelectItem value="last7Days">
										Last 7 Days
									</SelectItem>
									<SelectItem value="thisMonth">
										This Month
									</SelectItem>
									<SelectItem value="lastMonth">
										Last Month
									</SelectItem>
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
									<SelectItem value="All">
										All Types
									</SelectItem>
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
									<SelectItem value="All">
										All Status
									</SelectItem>
									<SelectItem value="PAID">Paid</SelectItem>
									<SelectItem value="PENDING">
										Pending
									</SelectItem>
									<SelectItem value="PROCESSING">
										Processing
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Sort Options */}
						<div>
							<Select
								value={`${filters.sortBy}-${filters.sortOrder}`}
								onValueChange={(value) => {
									const [sortBy, sortOrder] =
										value.split("-");
									setFilters({
										...filters,
										sortBy,
										sortOrder,
									});
								}}
							>
								<SelectTrigger className="w-fit cursor-pointer">
									<SelectValue placeholder="Sort By" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="date-desc">
										Date (Newest)
									</SelectItem>
									<SelectItem value="date-asc">
										Date (Oldest)
									</SelectItem>
									<SelectItem value="amount-desc">
										Amount (High to Low)
									</SelectItem>
									<SelectItem value="amount-asc">
										Amount (Low to High)
									</SelectItem>
									<SelectItem value="farmer-asc">
										Farmer (A-Z)
									</SelectItem>
									<SelectItem value="farmer-desc">
										Farmer (Z-A)
									</SelectItem>
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
				{/* <Table>
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
						{loading ? (
							// Loading skeleton
							Array.from({ length: 5 }).map((_, index) => (
								<TableRow key={`skeleton-${index}`}>
									<TableCell>
										<div className="space-y-2">
											<div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
											<div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
										</div>
									</TableCell>
									<TableCell>
										<div className="space-y-2">
											<div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
											<div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
										</div>
									</TableCell>
									<TableCell>
										<div className="h-6 w-28 bg-gray-200 rounded-full animate-pulse" />
									</TableCell>
									<TableCell>
										<div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
									</TableCell>
									<TableCell>
										<div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
									</TableCell>
									<TableCell>
										<div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
									</TableCell>
									<TableCell>
										<div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
									</TableCell>
									<TableCell>
										<div className="flex justify-end gap-2">
											<div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
										</div>
									</TableCell>
								</TableRow>
							))
						) : filteredPayments.length === 0 ? (
							<TableRow>
								<TableCell colSpan={8} className="text-center py-8">
									<div className="text-gray-500">
										No payments found
									</div>
								</TableCell>
							</TableRow>
						) : (
							filteredPayments.map((payment) => (
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
				</Table> */}
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
							<TableHead className="text-right">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							// Loading skeleton
							Array.from({ length: 5 }).map((_, index) => (
								<TableRow key={`skeleton-${index}`}>
									<TableCell>
										<div className="space-y-2">
											<div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
											<div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
										</div>
									</TableCell>
									<TableCell>
										<div className="space-y-2">
											<div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
											<div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
										</div>
									</TableCell>
									<TableCell>
										<div className="h-6 w-28 bg-gray-200 rounded-full animate-pulse" />
									</TableCell>
									<TableCell>
										<div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
									</TableCell>
									<TableCell>
										<div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
									</TableCell>
									<TableCell>
										<div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
									</TableCell>
									<TableCell>
										<div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
									</TableCell>
									<TableCell>
										<div className="flex justify-end gap-2">
											<div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
										</div>
									</TableCell>
								</TableRow>
							))
						) : filteredPayments.length === 0 ? (
							<TableRow>
								<TableCell colSpan={8} className="text-center py-8">
									<div className="text-gray-500">
										No payments found
									</div>
								</TableCell>
							</TableRow>
						) : (
							filteredPayments.map((payment) => (
							<TableRow key={payment.id}>
								<TableCell>
									<div className="font-medium text-gray-900 dark:text-gray-100">
										{new Date(
											payment.paymentDate
										).toLocaleDateString()}
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
										{convertToKg(payment.quantity, payment.quantityUnit).toLocaleString()} {payment.unit.toLowerCase()}
									</div>
								</TableCell>
								<TableCell>
									<div className="font-medium text-gray-900 dark:text-gray-100">
										${payment.rate.toFixed(2)}/{payment.unit.toLowerCase()}
									</div>
								</TableCell>
								<TableCell>
									<div className="font-medium text-gray-900 dark:text-gray-100">
										${payment.grossAmount?.toFixed(2) || '0.00'}
									</div>
								</TableCell>
								<TableCell>
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
											payment.status
										)}`}
									>
										{payment.status ? payment.status.split("_").join(" ") : "Unknown"}
									</span>
								</TableCell>
								<TableCell className="text-right">
									<div className="flex justify-end space-x-2">
										{(payment.status?.toUpperCase() === "PAID") && (
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													handleViewReceipt(payment)
												}
											>
												Receipt
											</Button>
										)}
										{(payment.status?.toUpperCase() === "PENDING") && (
											<Button
												size="sm"
												onClick={() =>
													handleMakePayment(
														payment.id
													)
												}
											>
												Process
											</Button>
										)}
										{(payment.status?.toUpperCase() === "PROCESSING") && (
											<Button
												variant="outline"
												size="sm"
												disabled
											>
												Processing...
											</Button>
										)}
									</div>
								</TableCell>
							</TableRow>
						))
						)}
					</TableBody>
				</Table>
			</Card>
		</div>
	);
};

export default Payments;