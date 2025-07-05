import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { HiDotsVertical } from "react-icons/hi";
import { ChevronsUpDown, Check } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { Toaster, toast } from "sonner";
import { Input } from "@/Components/ui/input";
import { CardDescription, CardTitle } from "@/Components/ui/card";

const WasteListings = () => {
	const [listings, setListings] = useState([
		{
			id: 1,
			wasteType: "Rice Straw Residue",
			farmer: "Paddy Green Farms",
			location: "Anuradhapura",
			quantity: "2,500 kg",
			pricePerKg: "$0.15",
			totalValue: "$375",
			description: "Rice straw and paddy husks from recent harvest",
			availableDate: "2025-01-08",
			expiryDate: "2025-01-15",
			pickupWindow: "Morning preferred",
			status: "Available",
			farmRating: 4.8,
		},
		{
			id: 2,
			wasteType: "Vegetable Trimmings",
			farmer: "Nuwara Eliya Fresh Co.",
			location: "Nuwara Eliya",
			quantity: "850 kg",
			pricePerKg: "$0.08",
			totalValue: "$68",
			description: "Mixed vegetable waste from processing facility",
			availableDate: "2025-01-06",
			expiryDate: "2025-01-10",
			pickupWindow: "Anytime",
			status: "Available",
			farmRating: 4.2,
		},
		{
			id: 3,
			wasteType: "Coconut Husk Fiber",
			farmer: "Lanka Coconut Estate",
			location: "Kurunegala",
			quantity: "1,200 kg",
			pricePerKg: "$0.12",
			totalValue: "$144",
			description: "Coconut coir and husk from processing mills",
			availableDate: "2025-01-07",
			expiryDate: "2025-01-12",
			pickupWindow: "Afternoon only",
			status: "Reserved",
			farmRating: 4.6,
		},
		{
			id: 4,
			wasteType: "Tea Leaf Waste",
			farmer: "Kandy Hill Tea Estate",
			location: "Kandy",
			quantity: "3,800 kg",
			pricePerKg: "$0.10",
			totalValue: "$380",
			description: "Used tea leaves and stems, suitable for composting",
			availableDate: "2025-01-09",
			expiryDate: "2025-01-20",
			pickupWindow: "Morning preferred",
			status: "Available",
			farmRating: 4.9,
		},
		{
			id: 5,
			wasteType: "Sugarcane Bagasse",
			farmer: "Galle Sugar Mills",
			location: "Galle, Southern",
			quantity: "5,000 kg",
			pricePerKg: "$0.05",
			totalValue: "$250",
			description: "Fibrous residue from sugarcane processing",
			availableDate: "2025-01-06",
			expiryDate: "2025-01-25",
			pickupWindow: "Anytime",
			status: "Available",
			farmRating: 4.1,
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
	const [value, setValue] = useState("");

	const [filters, setFilters] = useState({
		wasteType: "",
		location: "",
		minQuantity: "",
		maxPrice: "",
		status: "Available",
	});

	const getStatusBadge = (status) => {
		const styles = {
			Available: "bg-green-100 text-green-800",
			Reserved: "bg-yellow-100 text-yellow-800",
			Expired: "bg-red-100 text-red-800",
			"Pickup Scheduled": "bg-blue-100 text-blue-800",
		};
		return styles[status] || "bg-gray-100 text-gray-800";
	};

	const handleReserve = (listingId) => {
		const listing = listings.find((l) => l.id === listingId);

		const reserveTask = () =>
			new Promise((resolve) =>
				setTimeout(() => {
					setListings(
						listings.map((listing) =>
							listing.id === listingId
								? { ...listing, status: "Reserved" }
								: listing
						)
					);
					resolve({ name: listing?.wasteType || "Listing" });
				}, 2000)
			);

		toast.promise(reserveTask(), {
			loading: "Reserving listing...",
			success: (data) => `${data.name} has been reserved successfully!`,
			error: "Failed to reserve listing. Please try again.",
		});
	};

	const handleSave = (listingId) => {
		const listing = listings.find((l) => l.id === listingId);
		toast.success(
			`${listing?.wasteType || "Listing"} saved to your favorites!`
		);
		// Implementation for saving listings
	};

	const handleContactFarmer = (listing) => {
		toast.success(`Contact information sent for ${listing.farmer}`);
		// Implementation for contacting farmer
	};

	const filteredListings = listings.filter((listing) => {
		return (
			(filters.wasteType === "" ||
				listing.wasteType
					.toLowerCase()
					.includes(filters.wasteType.toLowerCase())) &&
			(filters.location === "" ||
				listing.location
					.toLowerCase()
					.includes(filters.location.toLowerCase())) &&
			(filters.status === "" ||
				filters.status === "All" ||
				listing.status === filters.status) &&
			(filters.minQuantity === "" ||
				parseInt(listing.quantity.replace(/[^\d]/g, "")) >=
					parseInt(filters.minQuantity || 0)) &&
			(filters.maxPrice === "" ||
				parseFloat(listing.pricePerKg.replace("$", "")) <=
					parseFloat(filters.maxPrice || 999))
		);
	});

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
					Agricultural Waste Listings
				</h1>
				<div className="flex space-x-2">
					<Button variant="outline">Export Listings</Button>
					<Button>Create Alert</Button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
					<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
						Available Listings
					</h3>
					<p className="text-2xl font-bold text-green-600">
						{
							filteredListings.filter(
								(l) => l.status === "Available"
							).length
						}
					</p>
				</div>
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
					<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
						Total Quantity
					</h3>
					<p className="text-2xl font-bold text-blue-600">
						{filteredListings
							.reduce(
								(total, listing) =>
									total +
									parseInt(
										listing.quantity.replace(/[^\d]/g, "")
									),
								0
							)
							.toLocaleString()}{" "}
						kg
					</p>
				</div>
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
					<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
						Avg Price/kg
					</h3>
					<p className="text-2xl font-bold text-purple-600">
						$
						{(
							filteredListings.reduce(
								(total, listing) =>
									total +
									parseFloat(
										listing.pricePerKg.replace("$", "")
									),
								0
							) / filteredListings.length
						).toFixed(2)}
					</p>
				</div>
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
					<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
						Potential Value
					</h3>
					<p className="text-2xl font-bold text-green-600">
						$
						{filteredListings
							.reduce(
								(total, listing) =>
									total +
									parseFloat(
										listing.totalValue.replace("$", "")
									),
								0
							)
							.toLocaleString()}
					</p>
				</div>
			</div>

			{/* Listings Table */}
			<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
				<div className="p-4 border-b border-gray-200 dark:border-gray-700">
					<CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
						Waste Listings ({filteredListings.length})
					</CardTitle>
          <CardDescription>
           Browse and reserve agricultural waste from verified farmers across Sri Lanka
          </CardDescription>
					<div id="waste-search" className="flex mt-5 gap-1">
						<div className="flex-1">
							<Input
								type="text"
								placeholder="Search waste"
								value={filters.wasteType}
								onChange={(e) =>
									setFilters({
										...filters,
										wasteType: e.target.value,
									})
								}
							/>
						</div>
						<div>
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										role="combobox"
										aria-expanded={open}
										className="w-fit"
									>
										{value
											? cities.find(
													(city) =>
														city.value === value
											  )?.label
											: "Select City"}
										<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-[200px] p-0">
									<Command>
										<CommandInput placeholder="Search city..." />
										<CommandList>
											<CommandEmpty>
												No city found.
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
																setValue(
																	currentValue ===
																		value
																		? ""
																		: currentValue
																);
																if (
																	currentValue ===
																	value
																) {
																	setFilters({
																		...filters,
																		location:
																			"",
																	});
																} else {
																	const selectedCity =
																		cities.find(
																			(
																				city
																			) =>
																				city.value ===
																				currentValue
																		);
																	setFilters({
																		...filters,
																		location:
																			selectedCity?.label ||
																			"",
																	});
																}
																setOpen(false);
															}}
														>
															<Check
																className={cn(
																	"mr-2 h-4 w-4",
																	value ===
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
							<Input
								type="number"
								placeholder="Min quantity (kg)"
								value={filters.minQuantity}
								onChange={(e) =>
									setFilters({
										...filters,
										minQuantity: e.target.value,
									})
								}
								min="0"
								step="50"
								className="w-[145px]"
							/>
						</div>
						<div>
							<Input
								type="number"
								placeholder="Max pricing per kg"
								value={filters.maxPrice}
								onChange={(e) =>
									setFilters({
										...filters,
										maxPrice: e.target.value,
									})
								}
								min="0"
								step="0.01"
								className="w-[155px]"
							/>
						</div>
						<div>
							<Select
								value={filters.status}
								onValueChange={(value) =>
									setFilters({ ...filters, status: value })
								}
							>
								<SelectTrigger className="w-fit">
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="All">All</SelectItem>
									<SelectItem value="Available">
										Available
									</SelectItem>
									<SelectItem value="Reserved">
										Reserved
									</SelectItem>
									<SelectItem value="Pickup Scheduled">
										Pickup Scheduled
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Waste Details</TableHead>
							<TableHead>Farmer / Location</TableHead>
							<TableHead>Quantity</TableHead>
							<TableHead>Pricing</TableHead>
							<TableHead>Availability</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredListings.map((listing) => (
							<TableRow key={listing.id}>
								<TableCell>
									<div>
										<div className="font-medium text-gray-900 dark:text-gray-100">
											{listing.wasteType}
										</div>
										<div className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
											{listing.description}
										</div>
									</div>
								</TableCell>
								<TableCell>
									<div>
										<div className="font-medium text-gray-900 dark:text-gray-100">
											{listing.farmer}
										</div>
										<div className="text-sm text-gray-500 dark:text-gray-400">
											{listing.location}
										</div>
										<div className="text-xs text-yellow-600 flex items-center mt-1">
											⭐ {listing.farmRating}/5
										</div>
									</div>
								</TableCell>
								<TableCell>
									<div className="font-medium text-gray-900 dark:text-gray-100">
										{listing.quantity}
									</div>
									<div className="text-sm text-gray-500 dark:text-gray-400">
										{listing.pickupWindow}
									</div>
								</TableCell>
								<TableCell>
									<div>
										<div className="font-medium text-gray-900 dark:text-gray-100">
											{listing.pricePerKg}/kg
										</div>
										<div className="text-sm font-semibold text-green-600">
											{listing.totalValue} total
										</div>
									</div>
								</TableCell>
								<TableCell>
									<div className="text-sm text-gray-900 dark:text-gray-100">
										<div>
											Available:{" "}
											{new Date(
												listing.availableDate
											).toLocaleDateString()}
										</div>
										<div className="text-gray-500 dark:text-gray-400">
											Expires:{" "}
											{new Date(
												listing.expiryDate
											).toLocaleDateString()}
										</div>
									</div>
								</TableCell>
								<TableCell>
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
											listing.status
										)}`}
									>
										{listing.status}
									</span>
								</TableCell>
								<TableCell className="text-right">
									<div className="flex justify-end space-x-2">
										<DropdownMenu>
											<DropdownMenuTrigger>
												<Button variant="outline" className="cursor-pointer">
													<HiDotsVertical />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent>
												<DropdownMenuItem
													onClick={() =>
														handleSave(listing.id)
													}
												>
													Save
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														handleContactFarmer(
															listing
														)
													}
												>
													Contact
												</DropdownMenuItem>
												{listing.status ===
													"Available" && (
													<DropdownMenuItem
														onClick={() =>
															handleReserve(
																listing.id
															)
														}
													>
														Reserve
													</DropdownMenuItem>
												)}
												{listing.status ===
													"Reserved" && (
													<DropdownMenuItem>
														View Details
													</DropdownMenuItem>
												)}
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<Toaster position="bottom-right" richColors />
		</div>
	);
};

export default WasteListings;
