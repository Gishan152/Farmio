import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import NumberFlow from "@number-flow/react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "@/Components/ui/popover";
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
	X,
	Clock,
	User,
	MapPin,
	Package,
	DollarSign,
	ChevronsUpDown,
} from "lucide-react";
import { HiDotsVertical } from "react-icons/hi";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

const Requests = () => {
	const [requests, setRequests] = useState([
		{
			id: 1,
			requesterId: "farmer001",
			requesterName: "Kumara Silva",
			requesterLocation: "Anuradhapura",
			requesterAvatar:
				"https://avatar.iran.liara.run/public/boy?username=kumara",
			wasteType: "Rice Straw Residue",
			quantity: "1,500 kg",
			offeredPrice: "$0.14",
			totalOffer: "$210",
			requestDate: "2025-01-05",
			urgency: "Medium",
			message:
				"Need quick pickup for rice straw waste. Can provide transport if needed.",
			status: "Pending",
			farmRating: 4.5,
			contactNumber: "+94 71 234 5678",
			preferredPickupTime: "Morning (8AM - 12PM)",
			additionalNotes:
				"Farm located 2km from main road. Easy truck access available.",
		},
		{
			id: 2,
			requesterId: "farmer002",
			requesterName: "Chamara Perera",
			requesterLocation: "Kurunegala",
			requesterAvatar:
				"https://avatar.iran.liara.run/public/boy?username=chamara",
			wasteType: "Coconut Husk Fiber",
			quantity: "800 kg",
			offeredPrice: "$0.11",
			totalOffer: "$88",
			requestDate: "2025-01-04",
			urgency: "High",
			message:
				"Urgent request - coconut processing waste needs immediate collection.",
			status: "Pending",
			farmRating: 4.8,
			contactNumber: "+94 77 987 6543",
			preferredPickupTime: "Anytime",
			additionalNotes:
				"Perishable waste - needs collection within 48 hours.",
		},
		{
			id: 3,
			requesterId: "farmer003",
			requesterName: "Nimal Jayawardena",
			requesterLocation: "Kandy",
			requesterAvatar:
				"https://avatar.iran.liara.run/public/boy?username=nimal",
			wasteType: "Tea Leaf Waste",
			quantity: "2,200 kg",
			offeredPrice: "$0.09",
			totalOffer: "$198",
			requestDate: "2025-01-06",
			urgency: "Low",
			message: "Regular tea estate waste pickup. Flexible on timing.",
			status: "Accepted",
			farmRating: 4.9,
			contactNumber: "+94 75 456 7890",
			preferredPickupTime: "Afternoon (1PM - 5PM)",
			additionalNotes:
				"Weekly recurring collection. Well-organized waste storage.",
		},
		{
			id: 4,
			requesterId: "farmer004",
			requesterName: "Priyantha Fernando",
			requesterLocation: "Galle",
			requesterAvatar:
				"https://avatar.iran.liara.run/public/boy?username=priyantha",
			wasteType: "Sugarcane Bagasse",
			quantity: "3,000 kg",
			offeredPrice: "$0.06",
			totalOffer: "$180",
			requestDate: "2025-01-03",
			urgency: "Medium",
			message:
				"Large quantity of bagasse available from sugar mill operations.",
			status: "Rejected",
			farmRating: 4.1,
			contactNumber: "+94 72 345 6789",
			preferredPickupTime: "Morning (6AM - 10AM)",
			additionalNotes:
				"Industrial waste from processing facility. Requires large vehicle.",
		},
		{
			id: 5,
			requesterId: "farmer005",
			requesterName: "Sanduni Wickramasinghe",
			requesterLocation: "Matara",
			requesterAvatar:
				"https://avatar.iran.liara.run/public/girl?username=sanduni",
			wasteType: "Vegetable Trimmings",
			quantity: "650 kg",
			offeredPrice: "$0.08",
			totalOffer: "$52",
			requestDate: "2025-01-07",
			urgency: "High",
			message:
				"Fresh vegetable waste from market operations. Quick pickup needed.",
			status: "Pending",
			farmRating: 4.3,
			contactNumber: "+94 76 123 4567",
			preferredPickupTime: "Evening (5PM - 8PM)",
			additionalNotes:
				"Market waste - best quality organic material available.",
		},
	]);

	const cities = [
		{ value: "colombo", label: "Colombo" },
		{ value: "gampaha", label: "Gampaha" },
		{ value: "kalutara", label: "Kalutara" },
		{ value: "kandy", label: "Kandy" },
		{ value: "matale", label: "Matale" },
		{ value: "nuwara_eliya", label: "Nuwara Eliya" },
		{ value: "galle", label: "Galle" },
		{ value: "matara", label: "Matara" },
		{ value: "hambantota", label: "Hambantota" },
		{ value: "jaffna", label: "Jaffna" },
		{ value: "kilinochchi", label: "Kilinochchi" },
		{ value: "mannar", label: "Mannar" },
		{ value: "vavuniya", label: "Vavuniya" },
		{ value: "mullaitivu", label: "Mullaitivu" },
		{ value: "batticaloa", label: "Batticaloa" },
		{ value: "ampara", label: "Ampara" },
		{ value: "trincomalee", label: "Trincomalee" },
		{ value: "kurunegala", label: "Kurunegala" },
		{ value: "puttalam", label: "Puttalam" },
		{ value: "anuradhapura", label: "Anuradhapura" },
		{ value: "polonnaruwa", label: "Polonnaruwa" },
		{ value: "badulla", label: "Badulla" },
		{ value: "monaragala", label: "Monaragala" },
		{ value: "ratnapura", label: "Ratnapura" },
		{ value: "kegalle", label: "Kegalle" },
	];
	const [open, setOpen] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState("");

	const [filters, setFilters] = useState({
		status: "All",
		urgency: "All",
		wasteType: "",
		location: "", // Add location filter
	});

	const handleRequestAction = (requestId, action) => {
		setRequests((prev) =>
			prev.map((request) =>
				request.id === requestId
					? {
							...request,
							status:
								action === "accept" ? "Accepted" : "Rejected",
					  }
					: request
			)
		);

		const actionText = action === "accept" ? "accepted" : "rejected";
		toast.success(`Request ${actionText} successfully!`, {
			description: `You have ${actionText} the waste collection request.`,
		});
	};

	const getStatusBadge = (status) => {
		const styles = {
			Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
			Accepted: "bg-green-100 text-green-800 border-green-200",
			Rejected: "bg-red-100 text-red-800 border-red-200",
		};
		return styles[status] || "bg-gray-100 text-gray-800 border-gray-200";
	};

	const getUrgencyBadge = (urgency) => {
		const styles = {
			High: "bg-red-100 text-red-800 border-red-200",
			Medium: "bg-orange-100 text-orange-800 border-orange-200",
			Low: "bg-green-100 text-green-800 border-green-200",
		};
		return styles[urgency] || "bg-gray-100 text-gray-800 border-gray-200";
	};

	const filteredRequests = requests.filter((request) => {
		// Get selected district label
		const selectedDistrictLabel = selectedDistrict ? 
			cities.find(city => city.value === selectedDistrict)?.label : "";

		return (
			(filters.status === "All" || request.status === filters.status) &&
			(filters.urgency === "All" ||
				request.urgency === filters.urgency) &&
			(filters.wasteType === "" ||
				request.wasteType
					.toLowerCase()
					.includes(filters.wasteType.toLowerCase()) ||
				request.requesterName
					.toLowerCase()
					.includes(filters.wasteType.toLowerCase()) ||
				request.requesterLocation
					.toLowerCase()
					.includes(filters.wasteType.toLowerCase())) &&
			(selectedDistrictLabel === "" ||
				request.requesterLocation.toLowerCase() === selectedDistrictLabel.toLowerCase())
		);
	});

	const pendingCount = requests.filter((r) => r.status === "Pending").length;
	const acceptedCount = requests.filter(
		(r) => r.status === "Accepted"
	).length;
	const rejectedCount = requests.filter(
		(r) => r.status === "Rejected"
	).length;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
						Waste Collection Requests
					</h1>
					<p className="text-gray-600 dark:text-gray-300 mt-1">
						Manage incoming requests from farmers for waste
						collection services
					</p>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
					<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
						<Clock className="h-4 w-4" />
						Pending Requests
					</h3>
					<p className="text-6xl text-right mt-2 font-bold text-gray-400">
						<NumberFlow value={pendingCount}/>
					</p>
				</div>
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
					<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
						<Check className="h-4 w-4" />
						Accepted
					</h3>
					<p className="text-6xl text-right mt-2 font-bold text-gray-400" >
						<NumberFlow value={acceptedCount} />
					</p>
				</div>
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
					<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
						<X className="h-4 w-4" />
						Rejected
					</h3>
					<p className="text-6xl text-right mt-2 font-bold text-gray-400">
						<NumberFlow value={rejectedCount} />
					</p>
				</div>
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
					<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
						<DollarSign className="h-4 w-4" />
						Total Value
					</h3>
					<p className="text-6xl text-right mt-2 font-bold text-gray-400">
						$<NumberFlow value={requests.filter(r => r.status === 'Accepted')
							.reduce((sum, r) => sum + parseFloat(r.totalOffer.replace('$', '')), 0)} />
					</p>
				</div>
			</div>

			{/* Filters */}
			<div className="bg-white dark:bg-gray-800 rounded-[1.5rem] border border-gray-200 dark:border-gray-700 shadow-sm">
				<div className="p-4 border-b border-gray-200 dark:border-gray-700">
					<CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
						Waste Collection Requests ({filteredRequests.length})
					</CardTitle>
					<CardDescription>
						Review and manage incoming requests from farmers for waste collection services
					</CardDescription>
					<div id="request-search" className="flex mt-5 gap-1">
						<div className="flex-1">
							<Input
								type="text"
								placeholder="Search by waste type, farmer name, or location..."
								value={filters.wasteType}
								onChange={(e) =>
									setFilters({
										...filters,
										wasteType: e.target.value,
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
														city.value === selectedDistrict
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
									<SelectItem value="All">All Status</SelectItem>
									<SelectItem value="Pending">Pending</SelectItem>
									<SelectItem value="Accepted">Accepted</SelectItem>
									<SelectItem value="Rejected">Rejected</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Select
								value={filters.urgency}
								onValueChange={(value) =>
									setFilters({ ...filters, urgency: value })
								}
							>
								<SelectTrigger className="w-fit cursor-pointer">
									<SelectValue placeholder="Priority" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="All">All Priority</SelectItem>
									<SelectItem value="High">High</SelectItem>
									<SelectItem value="Medium">Medium</SelectItem>
									<SelectItem value="Low">Low</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Requester</TableHead>
							<TableHead>Waste Details</TableHead>
							<TableHead>Offer</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Request Date</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredRequests.map((request) => (
							<TableRow key={request.id}>
								<TableCell>
									<div className="flex items-center gap-3">
										<Avatar>
											<AvatarImage src={request.requesterAvatar} alt={request.requesterName} />
											<AvatarFallback>{request.requesterName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
										</Avatar>
										<div>
											<div className="font-medium text-gray-900 dark:text-gray-100">
												{request.requesterName}
											</div>
											<div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
												<MapPin className="h-3 w-3" />
												{request.requesterLocation}
											</div>
											<div className="text-xs text-yellow-600 flex items-center gap-1">
												⭐ {request.farmRating}/5
											</div>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<div>
										<div className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1">
											<Package className="h-4 w-4" />
											{request.wasteType}
										</div>
										<div className="text-sm text-gray-500 dark:text-gray-400">
											{request.quantity}
										</div>
										<div className="text-xs text-gray-400">
											{request.preferredPickupTime}
										</div>
									</div>
								</TableCell>
								<TableCell>
									<div>
										<div className="font-medium text-gray-900 dark:text-gray-100">
											{request.offeredPrice}/kg
										</div>
										<div className="text-sm font-semibold text-green-600">
											{request.totalOffer} total
										</div>
									</div>
								</TableCell>
								<TableCell>
									<Badge className={`${getStatusBadge(request.status)} border`} variant="outline">
										{request.status}
									</Badge>
								</TableCell>
								<TableCell>
									<div className="text-sm text-gray-900 dark:text-gray-100">
										{new Date(request.requestDate).toLocaleDateString()}
									</div>
								</TableCell>
								<TableCell className="text-right">
									<div className="flex justify-end gap-2">
										{request.status === 'Pending' && (
											<>
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleRequestAction(request.id, 'reject')}
													className="text-red-600 border-red-200 hover:bg-red-50"
												>
													<X className="h-4 w-4" />
													Reject
												</Button>
												<Button
													size="sm"
													onClick={() => handleRequestAction(request.id, 'accept')}
													className="bg-green-600 hover:bg-green-700"
												>
													<Check className="h-4 w-4" />
													Accept
												</Button>
											</>
										)}
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="outline" size="sm">
													<HiDotsVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem>View Details</DropdownMenuItem>
												<DropdownMenuItem>Contact Farmer</DropdownMenuItem>
												<DropdownMenuItem>Download Info</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<Toaster position="bottom-center" richColors />
		</div>
	);
};

export default Requests;
