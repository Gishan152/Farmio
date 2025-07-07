import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { IoLocationOutline } from "react-icons/io5";
import { FaTruckMoving } from "react-icons/fa6";
import NumberFlow from "@number-flow/react";
import { Badge } from "@/components/ui/badge";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { IoFilter } from "react-icons/io5";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
import { PopoverAnchor } from "@radix-ui/react-popover";

const WasteListings = () => {
	// These are accepted requests that now show as listings
	const [listings, setListings] = useState([
		{
			id: 1,
			requesterId: "farmer001",
			wasteType: "Rice Straw Residue",
			farmer: "Kumara Silva",
			location: "Anuradhapura",
			quantity: "350 kg",
			pricePerKg: "$0.14",
			totalValue: "$49",
			description: "Rice straw waste from recent harvest - clean and dry",
			availableDate: "2025-01-08",
			expiryDate: "2025-01-15",
			pickupWindow: "Morning (8AM - 12PM)",
			status: "Accepted",
			farmRating: 4.5,
			contactNumber: "+94 71 234 5678",
			acceptedDate: "2025-01-05",
			additionalNotes: "Farm located 2km from main road. Easy truck access available."
		},
		{
			id: 2,
			requesterId: "farmer003",
			wasteType: "Tea Leaf Waste",
			farmer: "Nimal Jayawardena",
			location: "Kandy",
			quantity: "280 kg",
			pricePerKg: "$0.09",
			totalValue: "$25.20",
			description: "Used tea leaves and stems from estate processing",
			availableDate: "2025-01-09",
			expiryDate: "2025-01-20",
			pickupWindow: "Afternoon (1PM - 5PM)",
			status: "Accepted",
			farmRating: 4.9,
			contactNumber: "+94 75 456 7890",
			acceptedDate: "2025-01-06",
			additionalNotes: "Weekly recurring collection. Well-organized waste storage."
		},
		{
			id: 3,
			requesterId: "farmer005",
			wasteType: "Coconut Husk Fiber",
			farmer: "Sunil Perera",
			location: "Galle",
			quantity: "420 kg",
			pricePerKg: "$0.11",
			totalValue: "$46.20",
			description: "Fresh coconut husk and coir fiber from processing plant",
			availableDate: "2025-01-10",
			expiryDate: "2025-01-25",
			pickupWindow: "Morning (7AM - 11AM)",
			status: "In Progress",
			farmRating: 4.7,
			contactNumber: "+94 77 789 0123",
			acceptedDate: "2025-01-07",
			additionalNotes: "Large quantities available. Truck parking available on site."
		},
		{
			id: 4,
			requesterId: "farmer007",
			wasteType: "Banana Plant Waste",
			farmer: "Chaminda Rathnayake",
			location: "Matale",
			quantity: "150 kg",
			pricePerKg: "$0.16",
			totalValue: "$24",
			description: "Banana stems and leaves from plantation maintenance",
			availableDate: "2025-01-11",
			expiryDate: "2025-01-18",
			pickupWindow: "Afternoon (2PM - 6PM)",
			status: "Accepted",
			farmRating: 4.3,
			contactNumber: "+94 78 456 1234",
			acceptedDate: "2025-01-08",
			additionalNotes: "Organic farm. Regular monthly collection needed."
		},
		{
			id: 5,
			requesterId: "farmer009",
			wasteType: "Sugarcane Bagasse",
			farmer: "Priyantha Fernando",
			location: "Kurunegala",
			quantity: "500 kg",
			pricePerKg: "$0.08",
			totalValue: "$40",
			description: "Dried sugarcane bagasse from juice extraction",
			availableDate: "2025-01-12",
			expiryDate: "2025-01-30",
			pickupWindow: "Morning (6AM - 10AM)",
			status: "Completed",
			farmRating: 4.8,
			contactNumber: "+94 72 345 6789",
			acceptedDate: "2025-01-04",
			additionalNotes: "High-quality bagasse. Consistent supplier with good storage facilities."
		},
		{
			id: 6,
			requesterId: "farmer011",
			wasteType: "Paddy Husk",
			farmer: "Lakmal Wickramasinghe",
			location: "Polonnaruwa",
			quantity: "320 kg",
			pricePerKg: "$0.12",
			totalValue: "$38.40",
			description: "Clean paddy husk from rice milling operations",
			availableDate: "2025-01-13",
			expiryDate: "2025-01-22",
			pickupWindow: "Evening (4PM - 8PM)",
			status: "Accepted",
			farmRating: 4.6,
			contactNumber: "+94 76 123 4567",
			acceptedDate: "2025-01-09",
			additionalNotes: "Mill located near main highway. Easy access for large vehicles."
		},
		{
			id: 7,
			requesterId: "farmer013",
			wasteType: "Vegetable Crop Residue",
			farmer: "Sanduni Alwis",
			location: "Nuwara Eliya",
			quantity: "180 kg",
			pricePerKg: "$0.18",
			totalValue: "$32.40",
			description: "Mixed vegetable waste from carrot and cabbage farming",
			availableDate: "2025-01-14",
			expiryDate: "2025-01-21",
			pickupWindow: "Morning (9AM - 1PM)",
			status: "In Progress",
			farmRating: 4.4,
			contactNumber: "+94 77 890 1234",
			acceptedDate: "2025-01-10",
			additionalNotes: "High-altitude farm. Quality organic waste suitable for composting."
		},
		{
			id: 8,
			requesterId: "farmer015",
			wasteType: "Rubber Tree Leaves",
			farmer: "Jagath Ranasinghe",
			location: "Ratnapura",
			quantity: "240 kg",
			pricePerKg: "$0.13",
			totalValue: "$31.20",
			description: "Fallen rubber tree leaves and small branches",
			availableDate: "2025-01-15",
			expiryDate: "2025-01-28",
			pickupWindow: "Afternoon (1PM - 5PM)",
			status: "Accepted",
			farmRating: 4.2,
			contactNumber: "+94 75 567 8901",
			acceptedDate: "2025-01-11",
			additionalNotes: "Rubber plantation with regular leaf fall. Seasonal collection available."
		},
		{
			id: 9,
			requesterId: "farmer017",
			wasteType: "Fruit Processing Waste",
			farmer: "Ranjith Gunawardena",
			location: "Hambantota",
			quantity: "300 kg",
			pricePerKg: "$0.15",
			totalValue: "$45",
			description: "Mango and papaya peels from fruit processing facility",
			availableDate: "2025-01-16",
			expiryDate: "2025-01-23",
			pickupWindow: "Morning (8AM - 12PM)",
			status: "Completed",
			farmRating: 4.9,
			contactNumber: "+94 78 234 5678",
			acceptedDate: "2025-01-06",
			additionalNotes: "Processing facility with consistent waste generation. High nutritional value."
		},
		{
			id: 10,
			requesterId: "farmer019",
			wasteType: "Corn Stalks and Husks",
			farmer: "Mahinda Bandara",
			location: "Badulla",
			quantity: "380 kg",
			pricePerKg: "$0.10",
			totalValue: "$38",
			description: "Dried corn stalks and husks from recent harvest",
			availableDate: "2025-01-17",
			expiryDate: "2025-01-31",
			pickupWindow: "Morning (7AM - 11AM)",
			status: "Accepted",
			farmRating: 4.1,
			contactNumber: "+94 71 345 6789",
			acceptedDate: "2025-01-12",
			additionalNotes: "Hill country farm. Seasonal corn harvest waste. Good for biofuel production."
		},
		{
			id: 11,
			requesterId: "farmer021",
			wasteType: "Cassava Peel Waste",
			farmer: "Nimali Dissanayake",
			location: "Moneragala",
			quantity: "200 kg",
			pricePerKg: "$0.17",
			totalValue: "$34",
			description: "Fresh cassava peels from starch extraction process",
			availableDate: "2025-01-18",
			expiryDate: "2025-01-25",
			pickupWindow: "Afternoon (2PM - 6PM)",
			status: "In Progress",
			farmRating: 4.5,
			contactNumber: "+94 76 890 1234",
			acceptedDate: "2025-01-13",
			additionalNotes: "Starch processing facility. High moisture content. Requires quick collection."
		},
		{
			id: 12,
			requesterId: "farmer023",
			wasteType: "Pineapple Crown Waste",
			farmer: "Ajith Kumara",
			location: "Gampaha",
			quantity: "120 kg",
			pricePerKg: "$0.19",
			totalValue: "$22.80",
			description: "Pineapple crowns and leaves from fruit harvesting",
			availableDate: "2025-01-19",
			expiryDate: "2025-01-26",
			pickupWindow: "Morning (9AM - 1PM)",
			status: "Accepted",
			farmRating: 4.7,
			contactNumber: "+94 77 567 8901",
			acceptedDate: "2025-01-14",
			additionalNotes: "Pineapple plantation. Regular harvest waste. Good for enzyme extraction."
		},
		{
			id: 13,
			requesterId: "farmer025",
			wasteType: "Cinnamon Bark Waste",
			farmer: "Sampath Jayasuriya",
			location: "Kalutara",
			quantity: "80 kg",
			pricePerKg: "$0.22",
			totalValue: "$17.60",
			description: "Cinnamon bark shavings and rejected pieces",
			availableDate: "2025-01-20",
			expiryDate: "2025-02-03",
			pickupWindow: "Evening (4PM - 8PM)",
			status: "Completed",
			farmRating: 4.8,
			contactNumber: "+94 78 123 4567",
			acceptedDate: "2025-01-08",
			additionalNotes: "Spice processing facility. Aromatic waste with essential oil potential."
		},
		{
			id: 14,
			requesterId: "farmer027",
			wasteType: "Betel Leaf Waste",
			farmer: "Chandra Wickremasinghe",
			location: "Kegalle",
			quantity: "140 kg",
			pricePerKg: "$0.20",
			totalValue: "$28",
			description: "Rejected betel leaves and vine trimmings",
			availableDate: "2025-01-21",
			expiryDate: "2025-01-28",
			pickupWindow: "Morning (8AM - 12PM)",
			status: "Accepted",
			farmRating: 4.3,
			contactNumber: "+94 75 234 5678",
			acceptedDate: "2025-01-15",
			additionalNotes: "Betel cultivation. Medicinal properties. Regular supply available."
		},
		{
			id: 15,
			requesterId: "farmer029",
			wasteType: "Cashew Shell Waste",
			farmer: "Indika Peiris",
			location: "Puttalam",
			quantity: "320 kg",
			pricePerKg: "$0.11",
			totalValue: "$35.20",
			description: "Cashew shells from nut processing operations",
			availableDate: "2025-01-22",
			expiryDate: "2025-02-05",
			pickupWindow: "Afternoon (1PM - 5PM)",
			status: "In Progress",
			farmRating: 4.6,
			contactNumber: "+94 72 456 7890",
			acceptedDate: "2025-01-16",
			additionalNotes: "Cashew processing plant. Hard shell waste. Suitable for activated carbon production."
		},
		{
			id: 16,
			requesterId: "farmer031",
			wasteType: "Jackfruit Seed Waste",
			farmer: "Tharanga Mendis",
			location: "Matara",
			quantity: "180 kg",
			pricePerKg: "$0.14",
			totalValue: "$25.20",
			description: "Jackfruit seeds and pod waste from processing",
			availableDate: "2025-01-23",
			expiryDate: "2025-01-30",
			pickupWindow: "Morning (7AM - 11AM)",
			status: "Accepted",
			farmRating: 4.4,
			contactNumber: "+94 77 678 9012",
			acceptedDate: "2025-01-17",
			additionalNotes: "Fruit processing center. Nutritious waste with high starch content."
		},
		{
			id: 17,
			requesterId: "farmer033",
			wasteType: "Pepper Vine Waste",
			farmer: "Lalith Rodrigo",
			location: "Kandy",
			quantity: "110 kg",
			pricePerKg: "$0.21",
			totalValue: "$23.10",
			description: "Black pepper vine trimmings and leaves",
			availableDate: "2025-01-24",
			expiryDate: "2025-02-07",
			pickupWindow: "Afternoon (2PM - 6PM)",
			status: "Completed",
			farmRating: 4.9,
			contactNumber: "+94 76 789 0123",
			acceptedDate: "2025-01-09",
			additionalNotes: "Spice plantation. Aromatic waste with antimicrobial properties."
		},
		{
			id: 18,
			requesterId: "farmer035",
			wasteType: "Coconut Shell Waste",
			farmer: "Ravi Senanayake",
			location: "Negombo",
			quantity: "450 kg",
			pricePerKg: "$0.09",
			totalValue: "$40.50",
			description: "Coconut shells from copra processing",
			availableDate: "2025-01-25",
			expiryDate: "2025-02-15",
			pickupWindow: "Morning (6AM - 10AM)",
			status: "Accepted",
			farmRating: 4.2,
			contactNumber: "+94 78 890 1234",
			acceptedDate: "2025-01-18",
			additionalNotes: "Coconut oil mill. Hard shell waste. Excellent for charcoal production."
		},
		{
			id: 19,
			requesterId: "farmer037",
			wasteType: "Tobacco Leaf Waste",
			farmer: "Kamal Dissanayake",
			location: "Jaffna",
			quantity: "160 kg",
			pricePerKg: "$0.16",
			totalValue: "$25.60",
			description: "Rejected tobacco leaves and stems",
			availableDate: "2025-01-26",
			expiryDate: "2025-02-02",
			pickupWindow: "Evening (4PM - 8PM)",
			status: "In Progress",
			farmRating: 4.0,
			contactNumber: "+94 71 123 4567",
			acceptedDate: "2025-01-19",
			additionalNotes: "Tobacco processing facility. Requires proper handling. Good for pest control products."
		},
		{
			id: 20,
			requesterId: "farmer039",
			wasteType: "Turmeric Root Waste",
			farmer: "Shirani Jayawardena",
			location: "Kurunegala",
			quantity: "250 kg",
			pricePerKg: "$0.18",
			totalValue: "$45",
			description: "Turmeric root peels and processing waste",
			availableDate: "2025-01-27",
			expiryDate: "2025-02-10",
			pickupWindow: "Morning (8AM - 12PM)",
			status: "Accepted",
			farmRating: 4.7,
			contactNumber: "+94 75 345 6789",
			acceptedDate: "2025-01-20",
			additionalNotes: "Spice processing unit. High curcumin content. Valuable for extract production."
		},
		{
			id: 21,
			requesterId: "farmer041",
			wasteType: "Ginger Processing Waste",
			farmer: "Upali Amarasinghe",
			location: "Matale",
			quantity: "220 kg",
			pricePerKg: "$0.15",
			totalValue: "$33",
			description: "Ginger peels and fiber from processing plant",
			availableDate: "2025-01-28",
			expiryDate: "2025-02-04",
			pickupWindow: "Afternoon (1PM - 5PM)",
			status: "Completed",
			farmRating: 4.5,
			contactNumber: "+94 72 567 8901",
			acceptedDate: "2025-01-12",
			additionalNotes: "Ginger processing facility. Aromatic waste with medicinal properties."
		},
		{
			id: 22,
			requesterId: "farmer043",
			wasteType: "Plantain Peel Waste",
			farmer: "Nishantha Silva",
			location: "Colombo",
			quantity: "350 kg",
			pricePerKg: "$0.13",
			totalValue: "$45.50",
			description: "Plantain peels from banana chip manufacturing",
			availableDate: "2025-01-29",
			expiryDate: "2025-02-05",
			pickupWindow: "Morning (9AM - 1PM)",
			status: "Accepted",
			farmRating: 4.8,
			contactNumber: "+94 77 234 5678",
			acceptedDate: "2025-01-21",
			additionalNotes: "Food processing plant. High-volume regular waste. Good for animal feed."
		},
		{
			id: 23,
			requesterId: "farmer045",
			wasteType: "Cardamom Pod Waste",
			farmer: "Chamara Gunasekara",
			location: "Nuwara Eliya",
			quantity: "75 kg",
			pricePerKg: "$0.25",
			totalValue: "$18.75",
			description: "Empty cardamom pods and stems",
			availableDate: "2025-01-30",
			expiryDate: "2025-02-13",
			pickupWindow: "Evening (3PM - 7PM)",
			status: "In Progress",
			farmRating: 4.6,
			contactNumber: "+94 76 456 7890",
			acceptedDate: "2025-01-22",
			additionalNotes: "Cardamom plantation. Premium spice waste. Suitable for essential oil extraction."
		},
		{
			id: 24,
			requesterId: "farmer047",
			wasteType: "Passion Fruit Pulp Waste",
			farmer: "Dilshan Perera",
			location: "Badulla",
			quantity: "230 kg",
			pricePerKg: "$0.12",
			totalValue: "$27.60",
			description: "Passion fruit pulp and seed waste from juice production",
			availableDate: "2025-01-31",
			expiryDate: "2025-02-07",
			pickupWindow: "Morning (7AM - 11AM)",
			status: "Accepted",
			farmRating: 4.4,
			contactNumber: "+94 78 678 9012",
			acceptedDate: "2025-01-23",
			additionalNotes: "Fruit processing plant. Seasonal waste with high nutritional value."
		},
		{
			id: 25,
			requesterId: "farmer049",
			wasteType: "Lemongrass Waste",
			farmer: "Sumith Rathnayake",
			location: "Hambantota",
			quantity: "150 kg",
			pricePerKg: "$0.19",
			totalValue: "$28.50",
			description: "Lemongrass stems and leaves from essential oil extraction",
			availableDate: "2025-02-01",
			expiryDate: "2025-02-14",
			pickupWindow: "Afternoon (2PM - 6PM)",
			status: "Accepted",
			farmRating: 4.5,
			contactNumber: "+94 77 678 9012",
			acceptedDate: "2025-01-24",
			additionalNotes: "Essential oil distillery. Aromatic waste with therapeutic properties."
		}
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
		status: "Accepted", // Default to showing accepted requests
	});

	const getStatusBadge = (status) => {
		const styles = {
			Accepted: "bg-green-100 text-green-800",
			"In Progress": "bg-blue-100 text-blue-800",
			Completed: "bg-purple-100 text-purple-800",
			Reserved: "bg-yellow-100 text-yellow-800",
		};
		return styles[status] || "bg-gray-100 text-gray-800";
	};

	const handleStartCollection = (listingId) => {
		const listing = listings.find((l) => l.id === listingId);

		const startTask = () =>
			new Promise((resolve) =>
				setTimeout(() => {
					setListings(
						listings.map((listing) =>
							listing.id === listingId
								? { ...listing, status: "In Progress" }
								: listing
						)
					);
					resolve({ name: listing?.wasteType || "Listing" });
				}, 2000)
			);

		toast.promise(startTask(), {
			loading: "Starting collection process...",
			success: (data) => `Collection started for ${data.name}!`,
			error: "Failed to start collection. Please try again.",
		});
	};

	const handleCompleteCollection = (listingId) => {
		const listing = listings.find((l) => l.id === listingId);

		const completeTask = () =>
			new Promise((resolve) =>
				setTimeout(() => {
					setListings(
						listings.map((listing) =>
							listing.id === listingId
								? { ...listing, status: "Completed" }
								: listing
						)
					);
					resolve({ name: listing?.wasteType || "Listing" });
				}, 2000)
			);

		toast.promise(completeTask(), {
			loading: "Completing collection...",
			success: (data) => `${data.name} collection completed!`,
			error: "Failed to complete collection. Please try again.",
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
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
						Accepted Waste Collections
					</h1>
					<p className="text-gray-600 dark:text-gray-300 mt-1">
						Manage waste collection requests that you have accepted
					</p>
				</div>
				<div className="flex space-x-2">
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
					<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
						Accepted Requests
					</h3>
					<p className="text-6xl text-right mt-2 font-bold text-gray-400">
						<NumberFlow
							value={
								filteredListings.filter(
									(l) => l.status === "Accepted"
								).length
							}
						/>
					</p>
				</div>
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
					<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
						Total Quantity
					</h3>
					<p className="text-6xl text-right mt-2 font-bold text-gray-400">
						<NumberFlow
							value={filteredListings.reduce(
								(total, listing) =>
									total +
									parseInt(
										listing.quantity.replace(/[^\d]/g, "")
									),
								0
							)}
							suffix="kg"
						/>
					</p>
				</div>
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
					<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
						Avg Price/kg
					</h3>
					<p className="text-6xl text-right mt-2 font-bold text-gray-400">
						$
						<NumberFlow
							value={
								filteredListings.length > 0
									? parseFloat(
											(
												filteredListings.reduce(
													(total, listing) =>
														total +
														parseFloat(
															listing.pricePerKg.replace(
																"$",
																""
															)
														),
													0
												) / filteredListings.length
											).toFixed(2)
									  )
									: 0
							}
						/>
					</p>
				</div>
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
					<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
						Potential Value
					</h3>
					<p className="text-6xl text-right mt-2 font-bold text-gray-400">
						$
						<NumberFlow
							value={filteredListings.reduce(
								(total, listing) =>
									total +
									parseFloat(
										listing.totalValue.replace("$", "")
									),
								0
							)}
						/>
					</p>
				</div>
			</div>

			{/* Listings Table */}
			<div className="bg-white dark:bg-gray-800 rounded-[1.5rem] border border-gray-200 dark:border-gray-700 shadow-sm">
				<div className="p-4 border-b border-gray-200 dark:border-gray-700">
					<CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
						Waste Listings ({filteredListings.length})
					</CardTitle>
					<CardDescription>
						Manage and track waste collection requests that you have accepted from farmers
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
									<SelectItem value="All">All status</SelectItem>
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
						{filteredListings.map((listing) => (
							<TableRow key={listing.id}>
								<TableCell>
									<div>
										<div className="font-medium text-gray-900 dark:text-gray-100">
											{listing.wasteType}
										</div>
										<div className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
											{listing.description.length > 30 
												? listing.description.substring(0, 40) + "..."
												: listing.description
											}
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
									<Badge
										className={`${getStatusBadge(
											listing.status
										)} leading-normal rounded-full`}
										variant="outline"
									>
										{listing.status}
									</Badge>
								</TableCell>
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
												{listing.status === "Accepted" && (
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
												{listing.status === "In Progress" && (
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
												{listing.status === "Completed" && (
													<DropdownMenuItem>
														View Report
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
			<Toaster position="bottom-center" richColors />
		</div>
	);
};

export default WasteListings;
