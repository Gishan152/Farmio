import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import NumberFlow from "@number-flow/react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import { IoLocationOutline } from "react-icons/io5";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

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
		paymentMethod: "All",
		searchTerm: "",
	});

	const getStatusBadge = (status) => {
		const styles = {
			Completed: "bg-green-100 text-green-800",
			Pending: "bg-yellow-100 text-yellow-800",
			Scheduled: "bg-blue-100 text-blue-800",
			Overdue: "bg-red-100 text-red-800",
			Failed: "bg-red-100 text-red-800",
			Cancelled: "bg-gray-100 text-gray-800",
		};
		return styles[status] || "bg-gray-100 text-gray-800";
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

	// Filter payments based on current filter state
	const filteredPayments = payments.filter((payment) => {
		// Get selected district label
		const selectedDistrictLabel = selectedDistrict
			? cities.find((city) => city.value === selectedDistrict)?.label
			: "";

		return (
			(filters.status === "All" || payment.status === filters.status) &&
			(filters.paymentMethod === "All" ||
				payment.paymentMethod === filters.paymentMethod) &&
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
					.includes(selectedDistrictLabel.toLowerCase()))
		);
	});

	const totalPending = filteredPayments
		.filter((p) => p.status === "Pending" || p.status === "Overdue")
		.reduce(
			(total, payment) =>
				total + parseFloat(payment.amount.replace("$", "")),
			0
		);

	const totalPaid = filteredPayments
		.filter((p) => p.status === "Completed")
		.reduce(
			(total, payment) =>
				total + parseFloat(payment.amount.replace("$", "")),
			0
		);

	const pendingCount = filteredPayments.filter(
		(p) => p.status === "Pending"
	).length;
	const completedCount = filteredPayments.filter(
		(p) => p.status === "Completed"
	).length;
	const overdueCount = filteredPayments.filter(
		(p) => p.status === "Overdue"
	).length;

	return (
		<div className="space-y-6">
			<Toaster
				position="bottom-right"
				richColors
				toastOptions={{
					classNames: {
						title: "font-bold font-inherit text-base tracking-tight",
						title: "leading-tight font-inherit",
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
					<Button variant="outline">Payment History</Button>
					<Button>Setup Auto-Pay</Button>
				</div>
			</div>

			{/* Payment Summary */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
					<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
						<CreditCard className="h-4 w-4" />
						Total Payments
					</h3>
					<p className="text-6xl text-right mt-2 font-bold text-gray-400 dark:text-gray-100">
						<NumberFlow value={filteredPayments.length} />
					</p>
				</div>
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
					<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
						<Clock className="h-4 w-4" />
						Pending
					</h3>
					<p className="text-6xl text-right mt-2 font-bold text-gray-400">
						<NumberFlow value={pendingCount} />
					</p>
				</div>
				<div className="bg-green-100/20 dark:bg-gray-800 p-4 rounded-lg border border-green-100 dark:border-gray-700 shadow-sm">
					<h3 className="text-sm font-medium text-green-800 dark:text-gray-400 mb-1 flex items-center gap-2">
						<CheckCircle className="h-4 w-4" />
						Completed
					</h3>
					<p className="text-6xl text-right mt-2 font-bold text-green-400">
						<NumberFlow value={completedCount} />
					</p>
				</div>
				<div className="bg-red-100/20 dark:bg-gray-800 p-4 rounded-lg border border-red-100 dark:border-gray-700 shadow-sm">
					<h3 className="text-sm font-medium text-red-800 dark:text-gray-400 mb-1 flex items-center gap-2">
						<AlertTriangle className="h-4 w-4" />
						Overdue
					</h3>
					<p className="text-6xl text-right mt-2 font-bold text-red-400">
						<NumberFlow value={overdueCount} />
					</p>
				</div>
			</div>

			{/* Overdue Payments Alert */}
			{overdueCount > 0 && (
				<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
					<div className="flex items-center">
						<div className="text-red-600 mr-3">⚠️</div>
						<div>
							<h3 className="text-red-800 dark:text-red-200 font-medium">
								{overdueCount} Overdue Payment
								{overdueCount > 1 ? "s" : ""}
							</h3>
							<p className="text-red-600 dark:text-red-300 text-sm">
								These payments require immediate attention to
								maintain good farmer relationships.
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
					<div id="payment-search" className="flex mt-5 gap-1">
						<div className="flex-1">
							<Input
								type="text"
								placeholder="Search by farmer name, payment ID, or waste type..."
								value={filters.searchTerm}
								onChange={(e) =>
									setFilters({
										...filters,
										searchTerm: e.target.value,
									})
								}
							/>
						</div>
						<div className="ml-4">
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										role="combobox"
										aria-expanded={open}
										className="w-fit"
									>
										<IoLocationOutline className="h-4 w-4 mr-2" />
										{selectedDistrict
											? cities.find(
													(city) =>
														city.value ===
														selectedDistrict
											  )?.label
											: "Select district"}
										<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-[200px] p-0">
									<Command>
										<CommandInput placeholder="Search district..." />
										<CommandList>
											<CommandEmpty>
												No district found.
											</CommandEmpty>
											<CommandGroup>
												{cities
													.sort((a, b) =>
														a.label.localeCompare(
															b.label
														)
													)
													.map((city) => (
														<CommandItem
															key={city.value}
															value={city.value}
															onSelect={(
																currentValue
															) => {
																setSelectedDistrict(
																	currentValue ===
																		selectedDistrict
																		? ""
																		: currentValue
																);
																setOpen(false);
															}}
														>
															<Check
																className={cn(
																	"mr-2 h-4 w-4",
																	selectedDistrict ===
																		city.value
																		? "opacity-100"
																		: "opacity-0"
																)}
															/>
															{city.label}
														</CommandItem>
													))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						</div>
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
									<SelectItem value="Pending">
										Pending
									</SelectItem>
									<SelectItem value="Completed">
										Completed
									</SelectItem>
									<SelectItem value="Scheduled">
										Scheduled
									</SelectItem>
									<SelectItem value="Overdue">
										Overdue
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Select
								value={filters.paymentMethod}
								onValueChange={(value) =>
									setFilters({
										...filters,
										paymentMethod: value,
									})
								}
							>
								<SelectTrigger className="w-fit cursor-pointer">
									<SelectValue placeholder="Payment Method" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="All">
										All Methods
									</SelectItem>
									<SelectItem value="Bank Transfer">
										Bank Transfer
									</SelectItem>
									<SelectItem value="ACH Transfer">
										ACH Transfer
									</SelectItem>
									<SelectItem value="Wire Transfer">
										Wire Transfer
									</SelectItem>
									<SelectItem value="Check">Check</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
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
							<TableHead className="text-right">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredPayments.map((payment) => (
							<TableRow key={payment.id}>
								<TableCell>
									<div>
										<div className="font-medium text-gray-900 dark:text-gray-100">
											{payment.id}
										</div>
										<div className="text-sm text-gray-500 dark:text-gray-400">
											{payment.orderId}
										</div>
										{payment.transactionId && (
											<div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
												TXN: {payment.transactionId}
											</div>
										)}
									</div>
								</TableCell>
								<TableCell>
									<div>
										<div className="font-medium text-gray-900 dark:text-gray-100">
											{payment.farmer}
										</div>
										<div className="text-sm text-gray-500 dark:text-gray-400">
											{payment.farmerAccount}
										</div>
									</div>
								</TableCell>
								<TableCell>
									<div>
										<div className="font-medium text-gray-900 dark:text-gray-100">
											{payment.wasteType}
										</div>
										<div className="text-sm text-gray-500 dark:text-gray-400">
											{payment.quantity}
										</div>
									</div>
								</TableCell>
								<TableCell>
									<div>
										<div className="font-medium text-gray-900 dark:text-gray-100">
											{payment.amount}
										</div>
										<div className="text-xs text-gray-500 dark:text-gray-400">
											Fee: {payment.processingFee}
										</div>
										<div className="text-sm font-semibold text-green-600">
											Net: {payment.netAmount}
										</div>
									</div>
								</TableCell>
								<TableCell>
									<div>
										<div className="text-sm text-gray-900 dark:text-gray-100">
											Paid:{" "}
											{new Date(
												payment.paymentDate
											).toLocaleDateString()}
										</div>
										<div className="text-sm text-gray-500 dark:text-gray-400">
											Due:{" "}
											{new Date(
												payment.dueDate
											).toLocaleDateString()}
										</div>
									</div>
								</TableCell>
								<TableCell>
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentMethodBadge(
											payment.paymentMethod
										)}`}
									>
										{payment.paymentMethod}
									</span>
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
										{payment.status === "Completed" && (
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
										{payment.status === "Pending" && (
											<>
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														handleSchedulePayment(
															payment.id
														)
													}
												>
													Schedule
												</Button>
												<Button
													size="sm"
													onClick={() =>
														handleMakePayment(
															payment.id
														)
													}
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
													onClick={() =>
														handleContactFarmer(
															payment
														)
													}
												>
													Contact
												</Button>
												<Button
													variant="destructive"
													size="sm"
													onClick={() =>
														handleMakePayment(
															payment.id
														)
													}
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
			</Card>
		</div>
	);
};

export default Payments;
