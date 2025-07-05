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

const WasteListings = () => {
  const [listings, setListings] = useState([
    {
      id: 1,
      wasteType: "Organic Crop Residue",
      farmer: "Green Valley Farm",
      location: "Sacramento, CA",
      quantity: "2,500 kg",
      pricePerKg: "$0.15",
      totalValue: "$375",
      description: "Rice straw and corn stalks from recent harvest",
      availableDate: "2025-01-08",
      expiryDate: "2025-01-15",
      pickupWindow: "Morning preferred",
      quality: "Grade A",
      status: "Available",
      farmRating: 4.8,
    },
    {
      id: 2,
      wasteType: "Vegetable Trimmings",
      farmer: "Fresh Fields Co.",
      location: "Fresno, CA",
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
    },
    {
      id: 3,
      wasteType: "Fruit Pomace",
      farmer: "Sunny Orchards",
      location: "Modesto, CA",
      quantity: "1,200 kg",
      pricePerKg: "$0.12",
      totalValue: "$144",
      description: "Apple and grape pomace from juice production",
      availableDate: "2025-01-07",
      expiryDate: "2025-01-12",
      pickupWindow: "Afternoon only",
      quality: "Grade A",
      status: "Reserved",
      farmRating: 4.6,
    },
    {
      id: 4,
      wasteType: "Grain Husks",
      farmer: "Golden Grain Farms",
      location: "Stockton, CA",
      quantity: "3,800 kg",
      pricePerKg: "$0.10",
      totalValue: "$380",
      description: "Wheat and barley husks, suitable for composting",
      availableDate: "2025-01-09",
      expiryDate: "2025-01-20",
      pickupWindow: "Morning preferred",
      quality: "Grade A",
      status: "Available",
      farmRating: 4.9,
    },
    {
      id: 5,
      wasteType: "Composted Manure",
      farmer: "Eco Dairy Farm",
      location: "Merced, CA",
      quantity: "5,000 kg",
      pricePerKg: "$0.05",
      totalValue: "$250",
      description: "Aged cattle manure, ready for processing",
      availableDate: "2025-01-06",
      expiryDate: "2025-01-25",
      pickupWindow: "Anytime",
      quality: "Grade B+",
      status: "Available",
      farmRating: 4.1,
    },
  ]);

  const [filters, setFilters] = useState({
    wasteType: '',
    location: '',
    minQuantity: '',
    maxPrice: '',
    status: 'Available'
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

  const handleReserve = (listingId) => {
    setListings(listings.map(listing => 
      listing.id === listingId 
        ? { ...listing, status: "Reserved" }
        : listing
    ));
  };

  const handleSave = (listingId) => {
    console.log("Saving listing:", listingId);
    // Implementation for saving listings
  };

  const handleContactFarmer = (listing) => {
    console.log("Contacting farmer:", listing.farmer);
    // Implementation for contacting farmer
  };

  const filteredListings = listings.filter(listing => {
    return (
      (filters.wasteType === '' || listing.wasteType.toLowerCase().includes(filters.wasteType.toLowerCase())) &&
      (filters.location === '' || listing.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (filters.status === '' || listing.status === filters.status) &&
      (filters.minQuantity === '' || parseInt(listing.quantity.replace(/[^\d]/g, '')) >= parseInt(filters.minQuantity || 0)) &&
      (filters.maxPrice === '' || parseFloat(listing.pricePerKg.replace('$', '')) <= parseFloat(filters.maxPrice || 999))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Agricultural Waste Listings</h1>
        <div className="flex space-x-2">
          <Button variant="outline">Export Listings</Button>
          <Button>Create Alert</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Filter Listings</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Waste Type</label>
            <input
              type="text"
              placeholder="e.g., Organic, Grain"
              value={filters.wasteType}
              onChange={(e) => setFilters({...filters, wasteType: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <input
              type="text"
              placeholder="City or State"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min Quantity (kg)</label>
            <input
              type="number"
              placeholder="0"
              value={filters.minQuantity}
              onChange={(e) => setFilters({...filters, minQuantity: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Price/kg ($)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={filters.maxPrice}
              onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All</option>
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Pickup Scheduled">Pickup Scheduled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Available Listings</h3>
          <p className="text-2xl font-bold text-green-600">
            {filteredListings.filter(l => l.status === "Available").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Quantity</h3>
          <p className="text-2xl font-bold text-blue-600">
            {filteredListings.reduce((total, listing) => 
              total + parseInt(listing.quantity.replace(/[^\d]/g, '')), 0
            ).toLocaleString()} kg
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Avg Price/kg</h3>
          <p className="text-2xl font-bold text-purple-600">
            ${(filteredListings.reduce((total, listing) => 
              total + parseFloat(listing.pricePerKg.replace('$', '')), 0
            ) / filteredListings.length).toFixed(2)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Potential Value</h3>
          <p className="text-2xl font-bold text-green-600">
            ${filteredListings.reduce((total, listing) => 
              total + parseFloat(listing.totalValue.replace('$', '')), 0
            ).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Waste Listings ({filteredListings.length})</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Waste Details</TableHead>
              <TableHead>Farmer / Location</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Pricing</TableHead>
              <TableHead>Quality</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredListings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{listing.wasteType}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                      {listing.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{listing.farmer}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{listing.location}</div>
                    <div className="text-xs text-yellow-600 flex items-center mt-1">
                      ⭐ {listing.farmRating}/5
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{listing.quantity}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{listing.pickupWindow}</div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{listing.pricePerKg}/kg</div>
                    <div className="text-sm font-semibold text-green-600">{listing.totalValue} total</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getQualityBadge(listing.quality)}`}
                  >
                    {listing.quality}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    <div>Available: {new Date(listing.availableDate).toLocaleDateString()}</div>
                    <div className="text-gray-500 dark:text-gray-400">Expires: {new Date(listing.expiryDate).toLocaleDateString()}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(listing.status)}`}
                  >
                    {listing.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSave(listing.id)}
                    >
                      Save
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleContactFarmer(listing)}
                    >
                      Contact
                    </Button>
                    {listing.status === "Available" && (
                      <Button 
                        size="sm"
                        onClick={() => handleReserve(listing.id)}
                      >
                        Reserve
                      </Button>
                    )}
                    {listing.status === "Reserved" && (
                      <Button 
                        variant="secondary"
                        size="sm"
                      >
                        View Details
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WasteListings;
