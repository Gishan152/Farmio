import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/Components/WasteUI/table";
import NumberFlow from "@number-flow/react";
import { IoFilter, IoLocationOutline } from "react-icons/io5";
import { MdRecycling } from "react-icons/md";
import { GiFarmTractor } from "react-icons/gi";
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
	MapPin, 
	PackageCheck, 
	Scale, 
	DollarSign 
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
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

const BrowseDiscover = () => {
	const [wasteListings, setWasteListings] = useState([
		{
			id: 1,
			wasteType: "Rice Straw Residue",
			category: "Crop Residue",
			farmer: "Mahinda Agro Farms",
			location: "Anuradhapura, North Central",
			distance: "12 km",
			quantity: "2,500 kg",
			pricePerKg: "$0.15",
			totalValue: "$375",
			description: "Rice straw and paddy husks from recent harvest",
			availableDate: "2025-01-08",
			expiryDate: "2025-01-15",
			pickupWindow: "Morning preferred",
			quality: "Grade A",
			status: "Available",
			farmRating: 4.8,
			farmerPhone: "+94-77-1234567",
			farmerEmail: "contact@mahindasagro.lk"
		},
		{
			id: 2,
			wasteType: "Vegetable Trimmings",
			category: "Organic Waste",
			farmer: "Perera Vegetable Gardens",
			location: "Nuwara Eliya, Central",
			distance: "8 km",
			quantity: "850 kg",
			pricePerKg: "$0.08",
			totalValue: "$68",
			description: "Mixed vegetable waste from processing facility",
			availableDate: "2025-01-06",
			expiryDate: "2025-01-10",
			pickupWindow: "Anytime",
			quality: "Grade B",
			status: "Available",
			farmRating: 4.2,
			farmerPhone: "+94-77-2345678",
			farmerEmail: "orders@pereraveg.lk"
		},
		{
			id: 3,
			wasteType: "Coconut Husk Fiber",
			category: "Processing Waste",
			farmer: "Silva Tropical Estates",
			location: "Kurunegala, North Western",
			distance: "25 km",
			quantity: "1,200 kg",
			pricePerKg: "$0.12",
			totalValue: "$144",
			description: "Coconut coir and husk from processing mills",
			availableDate: "2025-01-07",
			expiryDate: "2025-01-12",
			pickupWindow: "Afternoon only",
			quality: "Grade A",
			status: "Available",
			farmRating: 4.6,
			farmerPhone: "+94-77-3456789",
			farmerEmail: "info@silvaestates.lk"
		},
		{
			id: 4,
			wasteType: "Tea Leaf Waste",
			category: "Processing Waste",
			farmer: "Ratnapura Golden Tea",
			location: "Ratnapura, Sabaragamuwa",
			distance: "18 km",
			quantity: "3,800 kg",
			pricePerKg: "$0.10",
			totalValue: "$380",
			description: "Used tea leaves and stems, suitable for composting",
			availableDate: "2025-01-09",
			expiryDate: "2025-01-20",
			pickupWindow: "Morning preferred",
			quality: "Grade A",
			status: "Available",
			farmRating: 4.9,
			farmerPhone: "+94-77-4567890",
			farmerEmail: "logistics@ratnapuratea.lk"
		},
		{
			id: 5,
			wasteType: "Sugarcane Bagasse",
			category: "Processing Waste",
			farmer: "Gampaha Sugar Mills",
			location: "Gampaha, Western",
			distance: "35 km",
			quantity: "5,000 kg",
			pricePerKg: "$0.05",
			totalValue: "$250",
			description: "Fibrous residue from sugarcane processing",
			availableDate: "2025-01-06",
			expiryDate: "2025-01-25",
			pickupWindow: "Anytime",
			quality: "Grade B+",
			status: "Available",
			farmRating: 4.1,
			farmerPhone: "+94-77-5678901",
			farmerEmail: "waste@gampahahugar.lk"
		}
	]);

	const districts = [
		{ value: "colombo", label: "Colombo" },
		{ value: "gampaha", label: "Gampaha" },
		{ value: "kalutara", label: "Kalutara" },
		{ value: "kandy", label: "Kandy" },
		{ value: "matale", label: "Matale" },
		{ value: "nuwara_eliya", label: "Nuwara Eliya" },
		{ value: "galle", label: "Galle" },
		{ value: "matara", label: "Matara" },
		{ value: "hambantota", label: "Hambantota" },
		{ value: "kurunegala", label: "Kurunegala" },
		{ value: "puttalam", label: "Puttalam" },
		{ value: "anuradhapura", label: "Anuradhapura" },
		{ value: "polonnaruwa", label: "Polonnaruwa" },
		{ value: "badulla", label: "Badulla" },
		{ value: "monaragala", label: "Monaragala" },
		{ value: "ratnapura", label: "Ratnapura" },
		{ value: "kegalle", label: "Kegalle" }
	];

	const wasteCategories = [
		{ value: "crop_residue", label: "Crop Residue" },
		{ value: "organic_waste", label: "Organic Waste" },
		{ value: "processing_waste", label: "Processing Waste" },
		{ value: "livestock_waste", label: "Livestock Waste" },
		{ value: "fruit_waste", label: "Fruit Waste" }
	];

	const [open, setOpen] = useState(false);
	const [categoryOpen, setCategoryOpen] = useState(false);
	const [selectedDistrict, setSelectedDistrict] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");

	const [filters, setFilters] = useState({
		searchTerm: "",
		district: "",
		category: "",
		maxDistance: "",
		minQuantity: "",
		maxPrice: "",
		status: "Available"
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

	const getQualityBadge = (quality) => {
		const styles = {
			"Grade A": "bg-green-100 text-green-800",
			"Grade A+": "bg-green-200 text-green-900",
			"Grade B+": "bg-yellow-100 text-yellow-800",
			"Grade B": "bg-orange-100 text-orange-800",
			"Grade C": "bg-red-100 text-red-800",
		};
		return styles[quality] || "bg-gray-100 text-gray-800";
	};

	const handleContactFarmer = (listing) => {
		toast.success(`Contact information sent for ${listing.farmer}`);
	};

	const handleRequestPickup = (listing) => {
		toast.success(`Pickup request sent to ${listing.farmer}`);
	};

	const filteredListings = wasteListings.filter(listing => {
		return (
			(filters.searchTerm === '' || 
				listing.wasteType.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
				listing.farmer.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
			(filters.district === '' || listing.location.toLowerCase().includes(filters.district.toLowerCase())) &&
			(filters.category === '' || listing.category.toLowerCase().includes(filters.category.toLowerCase())) &&
			(filters.status === '' || filters.status === 'All' || listing.status === filters.status) &&
			(filters.maxDistance === '' || parseInt(listing.distance.replace(/[^\d]/g, '')) <= parseInt(filters.maxDistance || 999)) &&
			(filters.minQuantity === '' || parseInt(listing.quantity.replace(/[^\d]/g, '')) >= parseInt(filters.minQuantity || 0)) &&
			(filters.maxPrice === '' || parseFloat(listing.pricePerKg.replace('$', '')) <= parseFloat(filters.maxPrice || 999))
		);
	});

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
						Browse & Discover
					</h1>
					<p className="text-gray-600 dark:text-gray-300 mt-1">
						Find available agricultural waste listed by farmers
					</p>
				</div>
				<div className="flex space-x-2">
					<Button variant="outline">
						<MapPin className="h-4 w-4 mr-2" />
						Set Location
					</Button>
					<Button>
						<GiFarmTractor className="h-4 w-4 mr-2" />
						View Map
					</Button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
					<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
						<PackageCheck className="h-4 w-4" />
						Available Listings
					</h3>
					<p className="text-6xl text-right mt-2 font-bold text-green-600">
						<NumberFlow value={filteredListings.filter(l => l.status === "Available").length} />
					</p>
				</div>
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
					<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
						<Scale className="h-4 w-4" />
						Total Quantity
					</h3>
					<p className="text-6xl text-right mt-2 font-bold text-blue-600">
						<NumberFlow 
							value={filteredListings.reduce((total, listing) => 
								total + parseInt(listing.quantity.replace(/[^\d]/g, '')), 0
							)}
							suffix=" kg"
						/>
					</p>
				</div>
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
					<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
						<MapPin className="h-4 w-4" />
						Avg Distance
					</h3>
					<p className="text-6xl text-right mt-2 font-bold text-purple-600">
						<NumberFlow 
							value={filteredListings.length > 0 ? 
								Math.round(filteredListings.reduce((total, listing) => 
									total + parseInt(listing.distance.replace(/[^\d]/g, '')), 0
								) / filteredListings.length) : 0
							}
							suffix=" km"
						/>
					</p>
				</div>
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
					<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
						<DollarSign className="h-4 w-4" />
						Potential Value
					</h3>
					<p className="text-6xl text-right mt-2 font-bold text-green-600">
						$<NumberFlow 
							value={filteredListings.reduce((total, listing) => 
								total + parseFloat(listing.totalValue.replace('$', '')), 0
							)}
						/>
					</p>
				</div>
			</div>

			{/* Listings Table */}
			<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
				<div className="p-4 border-b border-gray-200 dark:border-gray-700">
					<CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
						Agricultural Waste Listings ({filteredListings.length})
					</CardTitle>
					<CardDescription>
						Discover and connect with farmers offering agricultural waste materials
					</CardDescription>
					
					{/* Filters */}
					<div className="flex mt-5 gap-2 flex-wrap">
						<div className="flex-1 min-w-[300px]">
							<Input
								type="text"
								placeholder="Search by waste type or farmer name..."
								value={filters.searchTerm}
								onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
							/>
						</div>
						
						<div>
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<Button variant="outline" role="combobox" aria-expanded={open} className="w-fit">
										<IoLocationOutline className="h-4 w-4 mr-2" />
										{selectedDistrict ? 
											districts.find(d => d.value === selectedDistrict)?.label : 
											"Select District"
										}
										<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-[200px] p-0">
									<Command>
										<CommandInput placeholder="Search district..." />
										<CommandList>
											<CommandEmpty>No district found.</CommandEmpty>
											<CommandGroup>
												{districts.sort((a, b) => a.label.localeCompare(b.label)).map((district) => (
													<CommandItem
														key={district.value}
														value={district.value}
														onSelect={(currentValue) => {
															setSelectedDistrict(currentValue === selectedDistrict ? "" : currentValue);
															const districtLabel = districts.find(d => d.value === currentValue)?.label || "";
															setFilters({...filters, district: currentValue === selectedDistrict ? "" : districtLabel});
															setOpen(false);
														}}
													>
														<Check className={cn("mr-2 h-4 w-4", selectedDistrict === district.value ? "opacity-100" : "opacity-0")} />
														{district.label}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						</div>

						<div>
							<Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
								<PopoverTrigger asChild>
									<Button variant="outline" role="combobox" aria-expanded={categoryOpen} className="w-fit">
										<MdRecycling className="h-4 w-4 mr-2" />
										{selectedCategory ? 
											wasteCategories.find(c => c.value === selectedCategory)?.label : 
											"Select Category"
										}
										<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-[200px] p-0">
									<Command>
										<CommandInput placeholder="Search category..." />
										<CommandList>
											<CommandEmpty>No category found.</CommandEmpty>
											<CommandGroup>
												{wasteCategories.map((category) => (
													<CommandItem
														key={category.value}
														value={category.value}
														onSelect={(currentValue) => {
															setSelectedCategory(currentValue === selectedCategory ? "" : currentValue);
															const categoryLabel = wasteCategories.find(c => c.value === currentValue)?.label || "";
															setFilters({...filters, category: currentValue === selectedCategory ? "" : categoryLabel});
															setCategoryOpen(false);
														}}
													>
														<Check className={cn("mr-2 h-4 w-4", selectedCategory === category.value ? "opacity-100" : "opacity-0")} />
														{category.label}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						</div>

						<div>
							<Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
								<SelectTrigger className="w-fit">
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="All">All</SelectItem>
									<SelectItem value="Available">Available</SelectItem>
									<SelectItem value="Reserved">Reserved</SelectItem>
									<SelectItem value="Pickup Scheduled">Pickup Scheduled</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<Popover>
							<PopoverTrigger asChild>
								<Button variant="default">
									<IoFilter className="h-4 w-4 mr-2" />
									Advanced
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-4">
								<div className="flex flex-col">
									<div className="space-y-2">
										<h3 className="font-semibold text-lg">Advanced Filters</h3>
										<p className="text-sm text-muted-foreground">
											Filter by distance, quantity, and pricing
										</p>
									</div>
									<div className="grid gap-y-3 mt-6">
										<div className="flex justify-between items-center gap-3">
											<Label htmlFor="maxDist" className="whitespace-nowrap">
												Max Distance (km)
											</Label>
											<Input
												id="maxDist"
												type="number"
												value={filters.maxDistance}
												onChange={(e) => setFilters({...filters, maxDistance: e.target.value})}
												min="0"
												step="5"
												className="w-[100px]"
												placeholder="50"
											/>
										</div>
										<div className="flex justify-between items-center gap-3">
											<Label htmlFor="minQuant" className="whitespace-nowrap">
												Min Quantity (kg)
											</Label>
											<Input
												id="minQuant"
												type="number"
												value={filters.minQuantity}
												onChange={(e) => setFilters({...filters, minQuantity: e.target.value})}
												min="0"
												step="100"
												className="w-[100px]"
												placeholder="500"
											/>
										</div>
										<div className="flex justify-between items-center gap-3">
											<Label htmlFor="maxPrice" className="whitespace-nowrap">
												Max Price/kg ($)
											</Label>
											<Input
												id="maxPrice"
												type="number"
												value={filters.maxPrice}
												onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
												min="0"
												step="0.01"
												className="w-[100px]"
												placeholder="0.20"
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
							<TableHead>Distance</TableHead>
							<TableHead>Quantity</TableHead>
							<TableHead>Pricing</TableHead>
							<TableHead>Quality</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Actions</TableHead>
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
										<div className="text-xs text-blue-600 font-medium mb-1">
											{listing.category}
										</div>
										<div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
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
										{listing.distance}
									</div>
									<div className="text-sm text-gray-500 dark:text-gray-400">
										{listing.pickupWindow}
									</div>
								</TableCell>
								<TableCell>
									<div className="font-medium text-gray-900 dark:text-gray-100">
										{listing.quantity}
									</div>
									<div className="text-sm text-gray-500 dark:text-gray-400">
										Available: {new Date(listing.availableDate).toLocaleDateString()}
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
									<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getQualityBadge(listing.quality)}`}>
										{listing.quality}
									</span>
								</TableCell>
								<TableCell>
									<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(listing.status)}`}>
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
												<DropdownMenuItem onClick={() => handleContactFarmer(listing)}>
													Contact Farmer
												</DropdownMenuItem>
												<DropdownMenuItem onClick={() => handleRequestPickup(listing)}>
													Request Pickup
												</DropdownMenuItem>
												{listing.status === "Available" && (
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

export default BrowseDiscover;
