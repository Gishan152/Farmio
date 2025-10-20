import React, { useState, useEffect } from 'react';
import {
    PlusIcon,
    XMarkIcon,
    TrashIcon,
    EyeIcon,
} from '@heroicons/react/24/outline';
import { ChevronsUpDown, Check, CheckCircle, RotateCcw, DollarSign, Banknote } from 'lucide-react';
import { getMyRequests, createRequest, cancelRequest } from '../../../API/wasteRequestService';
import { Button } from '@/Components/WasteUI/button';
import { Input } from '@/Components/WasteUI/input';
import { Label } from '@/Components/WasteUI/label';
import { Textarea } from '@/Components/WasteUI/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/WasteUI/select';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/Components/WasteUI/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/Components/WasteUI/popover';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/Components/WasteUI/dialog';
import { Badge } from '@/Components/WasteUI/badge';
import { cn } from '@/lib/utils';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/WasteUI/table';
import { Toaster, toast } from 'sonner';
import { IoLocationOutline } from 'react-icons/io5';
import NumberFlow from '@number-flow/react';
import { HiDotsVertical } from 'react-icons/hi';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/WasteUI/dropdown-menu';
import { CardDescription, CardTitle } from '@/Components/WasteUI/card';

export default function WasteRequest() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [locationOpen, setLocationOpen] = useState(false);
    const [locationValue, setLocationValue] = useState('');
    
    const [filters, setFilters] = useState({
        wasteType: '',
        location: '',
        status: 'All',
    });

    const [formData, setFormData] = useState({
        requesterLocation: '',
        wasteType: '',
        customWasteType: '',
        quantity: '',
        unit: 'kg',
        preferredPickupTime: '',
        description: '',
        offeredPrice: '',
        totalOffer: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);

    // District options
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

    // Waste type options
    const wasteTypes = [
        { value: "Organic Waste", label: "Organic Waste" },
        { value: "Vegetable Waste", label: "Vegetable Waste" },
        { value: "Fruit Waste", label: "Fruit Waste" },
        { value: "Crop Residue", label: "Crop Residue" },
        { value: "Animal Feed Waste", label: "Animal Feed Waste" },
        { value: "Plastic", label: "Plastic" },
        { value: "Metal", label: "Metal" },
        { value: "Glass", label: "Glass" },
        { value: "Paper", label: "Paper" },
        { value: "Other", label: "Other (Specify)" },
    ];

    // Pickup time options
    const pickupTimes = [
        { value: "Morning (6:00 AM - 12:00 PM)", label: "Morning (6:00 AM - 12:00 PM)" },
        { value: "Afternoon (12:00 PM - 6:00 PM)", label: "Afternoon (12:00 PM - 6:00 PM)" },
        { value: "Evening (6:00 PM - 10:00 PM)", label: "Evening (6:00 PM - 10:00 PM)" },
        { value: "Anytime", label: "Anytime" },
    ];

    // Unit options
    const units = [
        { value: "kg", label: "Kilograms (kg)" },
        { value: "ton", label: "Tons (ton)" },
        { value: "lbs", label: "Pounds (lbs)" },
        { value: "quintal", label: "Quintals (quintal)" },
    ];

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const data = await getMyRequests();
            setRequests(data);
        } catch (error) {
            console.error('Error loading requests:', error);
            toast.error('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        if (!status) return "bg-gray-100 text-gray-800";

        const normalized = status.replace("_", " ").toLowerCase();

        const styles = {
            pending: "bg-yellow-100 text-yellow-800",
            accepted: "bg-green-100 text-green-800",
            "in progress": "bg-blue-100 text-blue-800",
            completed: "bg-purple-100 text-purple-800",
            "payment pending": "bg-orange-100 text-orange-800",
            paid: "bg-emerald-100 text-emerald-800",
            rejected: "bg-red-100 text-red-800",
        };

        return styles[normalized] || "bg-gray-100 text-gray-800";
    };

    const getStatusIcon = (status) => {
        const normalized = status?.toLowerCase().replace("_", " ");
        
        switch (normalized) {
            case 'pending':
                return <RotateCcw className="h-4 w-4 text-yellow-600" />;
            case 'accepted':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'in progress':
                return <RotateCcw className="h-4 w-4 text-blue-600 animate-spin" />;
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-purple-600" />;
            case 'payment pending':
                return <DollarSign className="h-4 w-4 text-orange-600" />;
            case 'paid':
                return <Banknote className="h-4 w-4 text-emerald-600" />;
            case 'rejected':
                return <XMarkIcon className="h-4 w-4 text-red-600" />;
            default:
                return <RotateCcw className="h-4 w-4 text-gray-600" />;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            
            // Auto-calculate total offer when quantity or price changes
            if (name === 'quantity' || name === 'offeredPrice') {
                const quantity = name === 'quantity' ? value.replace(/[^0-9.]/g, '') : prev.quantity.replace(/[^0-9.]/g, '');
                const price = name === 'offeredPrice' ? value : prev.offeredPrice;
                
                if (quantity && price && parseFloat(quantity) > 0 && parseFloat(price) > 0) {
                    updated.totalOffer = (parseFloat(quantity) * parseFloat(price)).toFixed(2);
                }
            }
            
            return updated;
        });
        // Clear error for this field
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.requesterLocation.trim()) {
            errors.requesterLocation = 'Location is required';
        }
        if (!formData.wasteType.trim()) {
            errors.wasteType = 'Waste type is required';
        }
        if (formData.wasteType === 'Other' && !formData.customWasteType.trim()) {
            errors.customWasteType = 'Please specify the waste type';
        }
        if (parseFloat(formData.quantity) <= 0 || !formData.quantity) {
            errors.quantity = 'Valid quantity is required';
        }
        if (!formData.preferredPickupTime.trim()) {
            errors.preferredPickupTime = 'Pickup time is required';
        }
        if (!formData.offeredPrice || parseFloat(formData.offeredPrice) <= 0) {
            errors.offeredPrice = 'Valid price is required';
        }
        if (formData.description.length > 1000) {
            errors.description = 'Description cannot exceed 1000 characters';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix form errors');
            return;
        }

        try {
            setSubmitLoading(true);
            
            const requestData = {
                requesterLocation: formData.requesterLocation,
                wasteType: formData.wasteType === 'Other' ? formData.customWasteType : formData.wasteType,
                quantity: `${formData.quantity.replace(/[^0-9.]/g, '')} ${formData.unit}`,
                preferredPickupTime: formData.preferredPickupTime,
                description: formData.description.trim() || undefined,
                offeredPrice: parseFloat(formData.offeredPrice),
                totalOffer: parseFloat(formData.totalOffer),
            };

            await createRequest(requestData);
            
            toast.success('Request created successfully!');
            setShowCreateModal(false);
            
            // Reset form
            setFormData({
                requesterLocation: '',
                wasteType: '',
                customWasteType: '',
                quantity: '',
                unit: 'kg',
                preferredPickupTime: '',
                description: '',
                offeredPrice: '',
                totalOffer: '',
            });
            setLocationValue('');
            
            await loadRequests();
        } catch (error) {
            console.error('Error creating request:', error);
            toast.error(error.response?.data?.message || 'Failed to create request');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleCancelRequest = async (requestId) => {
        if (!window.confirm('Are you sure you want to cancel this request?')) {
            return;
        }

        try {
            await cancelRequest(requestId);
            toast.success('Request cancelled successfully');
            await loadRequests();
        } catch (error) {
            console.error('Error canceling request:', error);
            toast.error(error.response?.data?.message || 'Failed to cancel request');
        }
    };

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setShowDetailsModal(true);
    };

    const closeDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedRequest(null);
    };

    const filteredRequests = requests.filter(request => {
        const matchesWasteType = !filters.wasteType || request.wasteType?.toLowerCase().includes(filters.wasteType.toLowerCase());
        const matchesLocation = !filters.location || request.requesterLocation?.toLowerCase().includes(filters.location.toLowerCase());
        const matchesStatus = filters.status === 'All' || request.status === filters.status;
        
        return matchesWasteType && matchesLocation && matchesStatus;
    });

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        My Waste Requests
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your waste collection requests
                    </CardDescription>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-green-500 hover:bg-green-600"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create New Request
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <Label>Waste Type</Label>
                        <Input
                            placeholder="Filter by waste type..."
                            value={filters.wasteType}
                            onChange={(e) => setFilters({ ...filters, wasteType: e.target.value })}
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <Label>Location</Label>
                        <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={locationOpen}
                                    className="w-full justify-between"
                                >
                                    {filters.location || "Select location..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search location..." />
                                    <CommandList>
                                        <CommandEmpty>No location found.</CommandEmpty>
                                        <CommandGroup>
                                            {districts.sort((a, b) => a.label.localeCompare(b.label)).map((city) => (
                                                <CommandItem
                                                    key={city.value}
                                                    value={city.value}
                                                    onSelect={(currentValue) => {
                                                        if (currentValue === filters.location.toLowerCase()) {
                                                            setFilters({ ...filters, location: '' });
                                                        } else {
                                                            const selectedCity = districts.find((c) => c.value === currentValue);
                                                            setFilters({ ...filters, location: selectedCity?.label || '' });
                                                        }
                                                        setLocationOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            filters.location === city.label ? "opacity-100" : "opacity-0"
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
                        <Label>Status</Label>
                        <Select
                            value={filters.status}
                            onValueChange={(value) => setFilters({ ...filters, status: value })}
                        >
                            <SelectTrigger className="w-fit cursor-pointer min-w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All status</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Accepted">Accepted</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Payment Pending">Payment Pending</SelectItem>
                                <SelectItem value="Paid">Paid</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Request ID</TableHead>
                            <TableHead>Waste Details</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Pricing</TableHead>
                            <TableHead>Pickup Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={`skeleton-${index}`}>
                                    <TableCell><div className="h-4 w-16 bg-gray-200 rounded animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 w-32 bg-gray-200 rounded animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 w-20 bg-gray-200 rounded animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 w-28 bg-gray-200 rounded animate-pulse" /></TableCell>
                                    <TableCell><div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" /></TableCell>
                                    <TableCell><div className="h-8 w-10 bg-gray-200 rounded animate-pulse ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : filteredRequests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8">
                                    <div className="text-gray-500">No requests found</div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRequests.map((request) => (
                                <TableRow key={request.id}>
                                    {/* Request ID */}
                                    <TableCell>
                                        <div className="font-medium text-gray-900 dark:text-gray-100">
                                            #{request.id}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(request.requestDate).toLocaleDateString()}
                                        </div>
                                    </TableCell>

                                    {/* Waste Details */}
                                    <TableCell>
                                        <div className="font-medium text-gray-900 dark:text-gray-100">
                                            {request.wasteType}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                                            {request.description?.length > 40
                                                ? request.description.substring(0, 40) + "..."
                                                : request.description || "No description"}
                                        </div>
                                    </TableCell>

                                    {/* Location */}
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-gray-900 dark:text-gray-100">
                                            <IoLocationOutline className="h-4 w-4 text-gray-500" />
                                            {request.requesterLocation}
                                        </div>
                                    </TableCell>

                                    {/* Quantity */}
                                    <TableCell>
                                        <div className="font-medium text-gray-900 dark:text-gray-100">
                                            {request.quantity}
                                        </div>
                                    </TableCell>

                                    {/* Pricing */}
                                    <TableCell>
                                        <div className="font-medium text-gray-900 dark:text-gray-100">
                                            Rs <NumberFlow value={request.offeredPrice} />/unit
                                        </div>
                                        <div className="text-sm font-semibold text-green-600">
                                            Rs <NumberFlow value={request.totalOffer} /> total
                                        </div>
                                    </TableCell>

                                    {/* Pickup Time */}
                                    <TableCell>
                                        <div className="text-sm text-gray-900 dark:text-gray-100">
                                            {request.preferredPickupTime}
                                        </div>
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(request.status)}
                                            <Badge
                                                className={`${getStatusBadge(request.status)} leading-normal rounded-full`}
                                                variant="outline"
                                            >
                                                {request.status ? request.status.replace("_", " ") : "N/A"}
                                            </Badge>
                                        </div>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="cursor-pointer">
                                                    <HiDotsVertical />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleViewDetails(request)}>
                                                    <EyeIcon className="h-4 w-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                {request.status?.toLowerCase() === 'pending' && (
                                                    <>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => handleCancelRequest(request.id)}
                                                            className="text-red-600"
                                                        >
                                                            <TrashIcon className="h-4 w-4 mr-2" />
                                                            Cancel Request
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl rounded-2xl p-0">
                    <DialogHeader className="px-8 pt-8 pb-4 border-b border-gray-100">
                        <DialogTitle className="text-2xl font-semibold text-gray-900">
                            Create Waste Request
                        </DialogTitle>
                        <p className="text-sm text-gray-500 mt-1">Fill in the details for your waste collection request</p>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-5 px-8 py-6">
                        {/* Location */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Location *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                            "w-full justify-between h-11 rounded-lg border-gray-200 hover:border-gray-300 transition-colors",
                                            !formData.requesterLocation && "text-gray-400",
                                            formErrors.requesterLocation && "border-red-500 hover:border-red-500"
                                        )}
                                    >
                                        {formData.requesterLocation || "Select district..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0 rounded-xl border-gray-200 shadow-lg">
                                    <Command>
                                        <CommandInput placeholder="Search district..." className="h-11" />
                                        <CommandList>
                                            <CommandEmpty>No district found.</CommandEmpty>
                                            <CommandGroup>
                                                {districts.map((district) => (
                                                    <CommandItem
                                                        key={district.value}
                                                        value={district.value}
                                                        onSelect={() => {
                                                            setFormData({ ...formData, requesterLocation: district.label });
                                                            if (formErrors.requesterLocation) {
                                                                setFormErrors({ ...formErrors, requesterLocation: '' });
                                                            }
                                                        }}
                                                        className="rounded-lg"
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4 text-green-600",
                                                                formData.requesterLocation === district.label
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {district.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {formErrors.requesterLocation && (
                                <p className="text-xs text-red-500 mt-1">{formErrors.requesterLocation}</p>
                            )}
                        </div>

                        {/* Waste Type */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Waste Type *</Label>
                            <Select
                                value={formData.wasteType}
                                onValueChange={(value) => {
                                    setFormData({ ...formData, wasteType: value, customWasteType: '' });
                                    if (formErrors.wasteType) {
                                        setFormErrors({ ...formErrors, wasteType: '' });
                                    }
                                }}
                            >
                                <SelectTrigger className={cn(
                                    "h-11 rounded-lg border-gray-200 hover:border-gray-300 transition-colors",
                                    formErrors.wasteType && "border-red-500"
                                )}>
                                    <SelectValue placeholder="Select waste type" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-gray-200 shadow-lg">
                                    {wasteTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value} className="rounded-lg">
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formErrors.wasteType && (
                                <p className="text-xs text-red-500 mt-1">{formErrors.wasteType}</p>
                            )}
                        </div>

                        {/* Custom Waste Type */}
                        {formData.wasteType === 'Other' && (
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Specify Waste Type *</Label>
                                <Input
                                    name="customWasteType"
                                    value={formData.customWasteType}
                                    onChange={handleInputChange}
                                    placeholder="Enter waste type..."
                                    className={cn(
                                        "h-11 rounded-lg border-gray-200 focus:border-green-500 transition-colors",
                                        formErrors.customWasteType && "border-red-500"
                                    )}
                                />
                                {formErrors.customWasteType && (
                                    <p className="text-xs text-red-500 mt-1">{formErrors.customWasteType}</p>
                                )}
                            </div>
                        )}

                        {/* Quantity and Unit */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2 space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Quantity *</Label>
                                <Input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    placeholder="280"
                                    min="0"
                                    step="0.01"
                                    className={cn(
                                        "h-11 rounded-lg border-gray-200 focus:border-green-500 transition-colors",
                                        formErrors.quantity && "border-red-500"
                                    )}
                                />
                                {formErrors.quantity && (
                                    <p className="text-xs text-red-500 mt-1">{formErrors.quantity}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Unit *</Label>
                                <Select
                                    value={formData.unit}
                                    onValueChange={(value) => setFormData({ ...formData, unit: value })}
                                >
                                    <SelectTrigger className="h-11 rounded-lg border-gray-200 hover:border-gray-300 transition-colors">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-gray-200 shadow-lg">
                                        {units.map((unit) => (
                                            <SelectItem key={unit.value} value={unit.value} className="rounded-lg">
                                                {unit.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Price and Total */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Price per {formData.unit} (Rs) *</Label>
                                <Input
                                    type="number"
                                    name="offeredPrice"
                                    value={formData.offeredPrice}
                                    onChange={handleInputChange}
                                    placeholder="50"
                                    min="0"
                                    step="0.01"
                                    className={cn(
                                        "h-11 rounded-lg border-gray-200 focus:border-green-500 transition-colors",
                                        formErrors.offeredPrice && "border-red-500"
                                    )}
                                />
                                {formErrors.offeredPrice && (
                                    <p className="text-xs text-red-500 mt-1">{formErrors.offeredPrice}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Total Offer (Rs)</Label>
                                <Input
                                    type="number"
                                    name="totalOffer"
                                    value={formData.totalOffer}
                                    readOnly
                                    placeholder="Auto-calculated"
                                    className="h-11 rounded-lg bg-gray-50 border-gray-200"
                                />
                            </div>
                        </div>

                        {/* Pickup Time */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Preferred Pickup Time *</Label>
                            <Select
                                value={formData.preferredPickupTime}
                                onValueChange={(value) => {
                                    setFormData({ ...formData, preferredPickupTime: value });
                                    if (formErrors.preferredPickupTime) {
                                        setFormErrors({ ...formErrors, preferredPickupTime: '' });
                                    }
                                }}
                            >
                                <SelectTrigger className={cn(
                                    "h-11 rounded-lg border-gray-200 hover:border-gray-300 transition-colors",
                                    formErrors.preferredPickupTime && "border-red-500"
                                )}>
                                    <SelectValue placeholder="Select pickup time" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-gray-200 shadow-lg">
                                    {pickupTimes.map((time) => (
                                        <SelectItem key={time.value} value={time.value} className="rounded-lg">
                                            {time.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formErrors.preferredPickupTime && (
                                <p className="text-xs text-red-500 mt-1">{formErrors.preferredPickupTime}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Description (Optional)</Label>
                            <Textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Additional details about your waste..."
                                rows={4}
                                maxLength={1000}
                                className={cn(
                                    "rounded-lg border-gray-200 focus:border-green-500 transition-colors resize-none",
                                    formErrors.description && "border-red-500"
                                )}
                            />
                            <p className="text-xs text-gray-400 text-right">
                                {formData.description.length}/1000 characters
                            </p>
                            {formErrors.description && (
                                <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3 pt-6 border-t border-gray-100">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 h-11 rounded-lg border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={submitLoading}
                                className="flex-1 h-11 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors shadow-sm"
                            >
                                {submitLoading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Creating...
                                    </span>
                                ) : 'Create Request'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Details Modal */}
            <Dialog open={showDetailsModal} onOpenChange={closeDetailsModal}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl rounded-2xl p-0">
                    <DialogHeader className="px-8 pt-8 pb-4 border-b border-gray-100">
                        <DialogTitle className="text-2xl font-semibold text-gray-900">
                            Request Details
                        </DialogTitle>
                        <p className="text-sm text-gray-500 mt-1">View complete information about this request</p>
                    </DialogHeader>

                    {selectedRequest && (
                        <div className="space-y-5 px-8 py-6">
                            {/* Status Header Card */}
                            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(selectedRequest.status)}
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Status</p>
                                        <Badge 
                                            className={`${getStatusBadge(selectedRequest.status)} text-sm px-3 py-1`}
                                            variant="outline"
                                        >
                                            {selectedRequest.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Request ID</p>
                                    <p className="text-2xl font-bold text-gray-900">#{selectedRequest.id}</p>
                                </div>
                            </div>

                            {/* Waste Information */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Waste Type</p>
                                    <p className="font-semibold text-lg text-gray-900">{selectedRequest.wasteType}</p>
                                </div>
                                <div className="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Quantity</p>
                                    <p className="font-semibold text-lg text-gray-900">{selectedRequest.quantity}</p>
                                </div>
                            </div>

                            {/* Location and Pickup */}
                            <div className="space-y-3">
                                <div className="flex items-start gap-4 p-5 bg-blue-50 border border-blue-100 rounded-xl">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <IoLocationOutline className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-blue-600 uppercase tracking-wide mb-1">Location</p>
                                        <p className="font-medium text-gray-900">{selectedRequest.requesterLocation}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-5 bg-green-50 border border-green-100 rounded-xl">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-green-600 uppercase tracking-wide mb-1">Preferred Pickup Time</p>
                                        <p className="font-medium text-gray-900">{selectedRequest.preferredPickupTime}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Price Information */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                                    <p className="text-xs text-green-700 uppercase tracking-wide mb-2">Price per Unit</p>
                                    <p className="font-bold text-2xl text-green-700">₨ {selectedRequest.offeredPrice}</p>
                                </div>
                                <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
                                    <p className="text-xs text-blue-700 uppercase tracking-wide mb-2">Total Offer</p>
                                    <p className="font-bold text-2xl text-blue-700">₨ {selectedRequest.totalOffer}</p>
                                </div>
                            </div>

                            {/* Description */}
                            {selectedRequest.description && (
                                <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Description</p>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedRequest.description}</p>
                                </div>
                            )}

                            {/* Agent Information */}
                            {selectedRequest.acceptedByAgentName && (
                                <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl">
                                    <p className="text-xs text-purple-700 uppercase tracking-wide mb-3">Accepted By Agent</p>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center">
                                            <span className="text-purple-700 font-semibold">
                                                {selectedRequest.acceptedByAgentName.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{selectedRequest.acceptedByAgentName}</p>
                                            {selectedRequest.acceptedByAgentId && (
                                                <p className="text-sm text-gray-500">ID: #{selectedRequest.acceptedByAgentId}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Button */}
                            <div className="pt-4 border-t border-gray-100">
                                <Button
                                    type="button"
                                    onClick={closeDetailsModal}
                                    className="w-full h-11 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors"
                                >
                                    Close
                                </Button>
                                {selectedRequest.status?.toLowerCase() === 'pending' && (
                                    <Button
                                        onClick={() => {
                                            closeDetailsModal();
                                            handleCancelRequest(selectedRequest.id);
                                        }}
                                        variant="outline"
                                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                    >
                                        <TrashIcon className="h-4 w-4 mr-2" />
                                        Cancel Request
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

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
}
