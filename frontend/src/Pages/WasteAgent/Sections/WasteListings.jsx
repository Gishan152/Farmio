import React, { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/Components/WasteUI/table";

import { IoLocationOutline } from "react-icons/io5";
import { FaTruckMoving } from "react-icons/fa6";
import NumberFlow from "@number-flow/react";
import { Badge } from "@/Components/WasteUI/badge";
import { IoFilter } from "react-icons/io5";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/Components/WasteUI/select";
import { Label } from "@/Components/WasteUI/label";
import { HiDotsVertical } from "react-icons/hi";
import {
	ChevronsUpDown,
	Check,
	CheckCircle,
	RotateCcw,
	DollarSign,
	Banknote,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/Components/WasteUI/dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/WasteUI/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/Components/WasteUI/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/Components/WasteUI/popover";

import { Toaster, toast } from "sonner";
import { Input } from "@/Components/WasteUI/input";
import { CardDescription, CardTitle } from "@/Components/WasteUI/card";
import { PopoverAnchor } from "@radix-ui/react-popover";
import api from "@/API/client";

const WasteListings = () => {
	

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
		status: "All",
	});

	const [listingsResp, setListingsResp] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		api.get("/api/waste/listings")
			.then((res) => {
				return res.data
			})
			.then((data) => {
				setListingsResp(data);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Error fetching listings:", err);
				setLoading(false);
			});
	}, []);

	const getStatusBadge = (status) => {
		if (!status) return "bg-gray-100 text-gray-800";

		// Normalize backend values to match your style keys
		const normalized = status.replace("_", " ").toLowerCase();

		const styles = {
			accepted: "bg-green-100 text-green-800",
			"in progress": "bg-blue-100 text-blue-800",
			completed: "bg-purple-100 text-purple-800",
			reserved: "bg-yellow-100 text-yellow-800",
		};

		return styles[normalized] || "bg-gray-100 center text-gray-800";
	};

	const handleStartCollection = (listingId) => {
		const listing = listingsResp.find((l) => l.id === listingId);

		const startTask = async () => {
			const res = await api.put(
				`api/waste/listings/${listingId}/status?status=IN_PROGRESS`
			);
			const updated = res.data;

			// update local state with backend response
			setListingsResp((prev) =>
				prev.map((l) =>
					l.id === listingId ? { ...l, status: updated.status } : l
				)
			);

			return { name: listing?.wasteType || "Listing" };
		};

		toast.promise(startTask(), {
			loading: "Starting collection process...",
			success: (data) => `Collection started for ${data.name}!`,
			error: "Failed to start collection. Please try again.",
		});
	};

	const handleCompleteCollection = (listingId) => {
		const listing = listingsResp.find((l) => l.id === listingId);

		const completeTask = async () => {
			const res = await api.put(
				`api/waste/listings/${listingId}/status?status=COMPLETED`
			);
			const updated = res.data;

			setListingsResp((prev) =>
				prev.map((l) =>
					l.id === listingId ? { ...l, status: updated.status } : l
				)
			);

			return { name: listing?.wasteType || "Listing" };
		};

		toast.promise(completeTask(), {
			loading: "Completing collection...",
			success: (data) => `${data.name} collection completed!`,
			error: "Failed to complete collection. Please try again.",
		});
	};

	const handleSave = (listingId) => {
		const listing = listingsResp.find((l) => l.id === listingId);
		toast.success(
			`${listing?.wasteType || "Listing"} saved to your favorites!`
		);
		// Implementation for saving listings
	};

	const handleContactFarmer = (listing) => {
		toast.success(
			`Contact information sent for ${
				listing.requester?.name || listing.farmer
			}`
		);
		// Implementation for contacting farmer
	};

	const filteredListings = listingsResp.filter((listing) => {
		// Normalize status for comparison (handle "ACCEPTED", "IN_PROGRESS", etc.)
		const normalizedStatus =
			filters.status === "In Progress"
				? "IN_PROGRESS"
				: filters.status === "Accepted"
				? "ACCEPTED"
				: filters.status === "Completed"
				? "COMPLETED"
				: filters.status;

		return (
			(filters.wasteType === "" ||
				listing.wasteType
					?.toLowerCase()
					.includes(filters.wasteType.toLowerCase())) &&
			(filters.location === "" ||
				listing.requester?.location
					?.toLowerCase()
					.includes(filters.location.toLowerCase())) &&
			(filters.status === "" ||
				filters.status === "All" ||
				listing.status === normalizedStatus) &&
			(filters.minQuantity === "" ||
				(listing.quantity || 0) >=
					parseInt(filters.minQuantity || 0)) &&
			(filters.maxPrice === "" ||
				(listing.pricePerUnit || 0) <=
					parseFloat(filters.maxPrice || 999))
		);
	});
	return (
		<div className="space-y-6 mt-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
						Accepted Waste Collections
					</h1>
					<p className="text-gray-600 dark:text-gray-300 mt-1">
						Manage waste collection requests that you have accepted
					</p>
				</div>
				<div className="flex space-x-2"></div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center overflow-hidden">
					<div className="absolute left-0 top-0 h-full w-1 bg-green-500 rounded-l-lg" />
					<CheckCircle className="h-7 w-7 text-green-500 mr-3 z-10" />
					<div className="z-10">
						<p className="text-xs font-medium text-gray-500">
							Accepted Requests
						</p>
						<p className="text-lg font-bold text-gray-900">
							<NumberFlow
								value={
									filteredListings.filter(
										(l) => l.status === "ACCEPTED"
									).length
								}
							/>
						</p>
					</div>
				</div>
				<div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center overflow-hidden">
					<div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-l-lg" />
					<RotateCcw className="h-7 w-7 text-blue-500 mr-3 z-10" />
					<div className="z-10">
						<p className="text-xs font-medium text-gray-500">
							Total Quantity
						</p>
						<p className="text-lg font-bold text-gray-900">
							<NumberFlow
								value={filteredListings.reduce(
									(total, listing) => {
										const quantity = listing.quantity || 0;
										const unit =
											listing.unit?.toUpperCase();
										// Convert to KG for consistency
										if (unit === "TON" || unit === "TONS") {
											return total + quantity * 907.185;
										}
										return total + quantity;
									},
									0
								)}
								suffix=" kg"
							/>
						</p>
					</div>
				</div>
				<div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center overflow-hidden">
					<div className="absolute left-0 top-0 h-full w-1 bg-yellow-500 rounded-l-lg" />
					<DollarSign className="h-7 w-7 text-yellow-500 mr-3 z-10" />
					<div className="z-10">
						<p className="text-xs font-medium text-gray-500">
							Avg Price/
							{filteredListings[0]?.unit?.toLowerCase() || "kg"}
						</p>
						<p className="text-lg font-bold text-gray-900">
							$
							<NumberFlow
								value={
									filteredListings.length > 0
										? parseFloat(
												(
													filteredListings.reduce(
														(total, listing) =>
															total +
															(listing.pricePerUnit ||
																0),
														0
													) / filteredListings.length
												).toFixed(2)
										  )
										: 0
								}
							/>
						</p>
					</div>
				</div>
				<div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center overflow-hidden">
					<div className="absolute left-0 top-0 h-full w-1 bg-purple-500 rounded-l-lg" />
					<Banknote className="h-7 w-7 text-purple-500 mr-3 z-10" />
					<div className="z-10">
						<p className="text-xs font-medium text-gray-500">
							Potential Value
						</p>
						<p className="text-lg font-bold text-gray-900">
							$
							<NumberFlow
								value={filteredListings.reduce(
									(total, listing) =>
										total + (listing.totalPrice || 0),
									0
								)}
							/>
						</p>
					</div>
				</div>
			</div>

			{/* Listings Table */}
			<div className="bg-white dark:bg-gray-800 rounded-[1.5rem] border border-gray-200 dark:border-gray-700 shadow-sm">
				<div className="p-4 border-b border-gray-200 dark:border-gray-700">
					<CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
						Waste Listings ({filteredListings.length})
					</CardTitle>
					<CardDescription>
						Manage and track waste collection requests that you have
						accepted from farmers
					</CardDescription>
					<div id="waste-search" className="flex mt-5 gap-1">
						<div className="flex-1">
							<Input
								type="text"
								placeholder="Search by waste type or material..."
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
										{value
											? cities.find(
													(city) =>
														city.value === value
											  )?.label
											: "Select district"}
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
										All status
									</SelectItem>
									<SelectItem value="Accepted">
										Accepted
									</SelectItem>
									<SelectItem value="In Progress">
										In Progress
									</SelectItem>
									<SelectItem value="Completed">
										Completed
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<Popover>
							<PopoverTrigger asChild>
								<Button variant="default">
									<IoFilter size="10px" />
									Filter
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-4">
								<div className="flex flex-col">
									<div className="space-y-2">
										<h3 className="font-[600] text-lg leading-none">
											Advance Filter
										</h3>
										<p className="text-sm mt-[-5px] text-muted-foreground">
											Filter by quantity and price range
										</p>
									</div>
									<div className="grid gap-y-3 mt-6">
										<div className="flex justify-between items-center gap-3">
											<Label
												htmlFor="minQuant"
												className="whitespace-nowrap"
											>
												Min quantity(kg)
											</Label>
											<Input
												id="minQuant"
												type="number"
												value={filters.minQuantity}
												onChange={(e) =>
													setFilters({
														...filters,
														minQuantity:
															e.target.value,
													})
												}
												min="0"
												step="50"
												className="w-[100px]"
												placeholder="250"
											/>
										</div>
										<div className="flex justify-between items-center gap-3">
											<Label
												htmlFor="maxPrice"
												className="whitespace-nowrap"
											>
												Max pricing per kg
											</Label>
											<Input
												id="maxPrice"
												type="number"
												placeholder="0.15"
												value={filters.maxPrice}
												onChange={(e) =>
													setFilters({
														...filters,
														maxPrice:
															e.target.value,
													})
												}
												min="0"
												step="0.01"
												className="w-[100px]"
											/>
										</div>
									</div>
								</div>
							</PopoverContent>
						</Popover>
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
						{loading ? (
							// Loading skeleton
							Array.from({ length: 5 }).map((_, index) => (
								<TableRow key={`skeleton-${index}`}>
									<TableCell>
										<div className="space-y-2">
											<div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
											<div className="h-3 w-48 bg-gray-200 rounded animate-pulse" />
										</div>
									</TableCell>
									<TableCell>
										<div className="space-y-2">
											<div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
											<div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
											<div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
										</div>
									</TableCell>
									<TableCell>
										<div className="space-y-2">
											<div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
											<div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
										</div>
									</TableCell>
									<TableCell>
										<div className="space-y-2">
											<div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
											<div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
										</div>
									</TableCell>
									<TableCell>
										<div className="space-y-2">
											<div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
											<div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
										</div>
									</TableCell>
									<TableCell>
										<div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
									</TableCell>
									<TableCell>
										<div className="flex justify-end gap-2">
											<div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
											<div className="h-8 w-10 bg-gray-200 rounded animate-pulse" />
										</div>
									</TableCell>
								</TableRow>
							))
						) : filteredListings.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className="text-center py-8">
									<div className="text-gray-500">
										No listings found
									</div>
								</TableCell>
							</TableRow>
						) : (
							filteredListings.map((listing) => (
								<TableRow key={listing.id}>
									{/* Waste Details */}
									<TableCell>
										<div>
											<div className="font-medium text-gray-900 dark:text-gray-100">
												{listing.wasteType}
											</div>
											<div className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
												{listing.description?.length > 30
													? listing.description.substring(
															0,
															40
													  ) + "..."
													: listing.description}
											</div>
										</div>
									</TableCell>

									{/* Farmer / Location */}
									<TableCell>
										<div>
											<div className="font-medium text-gray-900 dark:text-gray-100">
												{listing.requesterName}
											</div>
											<div className="text-sm text-gray-500 dark:text-gray-400">
												{listing.requesterLocation}
											</div>
											<div className="text-xs text-yellow-600 flex items-center mt-1">
												⭐ {listing.requesterRating}/5
											</div>
										</div>
								</TableCell>

								{/* Quantity */}
								<TableCell>
									<div className="font-medium text-gray-900 dark:text-gray-100">
										{listing.quantity} {listing.unit}
									</div>
									<div className="text-sm text-gray-500 dark:text-gray-400">
										{listing.timeSlot}
									</div>
								</TableCell>

								{/* Pricing */}
								<TableCell>
									<div>
										<div className="font-medium text-gray-900 dark:text-gray-100">
											{listing.pricePerUnit}/
											{listing.unit?.toLowerCase()}
										</div>
										<div className="text-sm font-semibold text-green-600">
											{listing.totalPrice} total
										</div>
									</div>
								</TableCell>

								{/* Availability */}
								<TableCell>
									<div className="text-sm text-gray-900 dark:text-gray-100">
										<div>
											Available:{" "}
											{new Date(
												listing.availableFrom
											).toLocaleDateString()}
										</div>
										<div className="text-gray-500 dark:text-gray-400">
											Expires:{" "}
											{new Date(
												listing.expiresOn
											).toLocaleDateString()}
										</div>
									</div>
								</TableCell>

								{/* Status */}
								<TableCell>
									<Badge
										className={`${getStatusBadge(
											listing.status
										)} leading-normal rounded-full`}
										variant="outline"
									>
										{listing.status ? listing.status.replace("_", " ") : "N/A"}
									</Badge>
								</TableCell>

								{/* Actions */}
								<TableCell className="text-right">
									<div className="flex justify-end space-x-2">
										<DropdownMenu>
											<DropdownMenuTrigger>
												<Button
													variant="outline"
													className="cursor-pointer"
												>
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
													Contact Farmer
												</DropdownMenuItem>
												{listing.status ===
													"ACCEPTED" && (
													<DropdownMenuItem
														onClick={() =>
															handleStartCollection(
																listing.id
															)
														}
													>
														Start Collection
													</DropdownMenuItem>
												)}
												{listing.status ===
													"IN_PROGRESS" && (
													<DropdownMenuItem
														onClick={() =>
															handleCompleteCollection(
																listing.id
															)
														}
													>
														Complete Collection
													</DropdownMenuItem>
												)}
												{listing.status ===
													"COMPLETED" && (
													<DropdownMenuItem>
														View Report
													</DropdownMenuItem>
												)}
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</TableCell>
							</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
			<Toaster
				position="bottom-right"
				richColors
				toastOptions={{
					classNames: {
						icon: "360px",
						description: "mt[-5px]",
					},
				}}
			/>
		</div>
	);
};

export default WasteListings;