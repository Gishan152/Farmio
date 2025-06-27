import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import StatCard from '../../../components/ui/StatCard';

// Icons
const ProductsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);

const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const AddIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const ProductsManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Sample product data
  const products = [
    {
      id: 'P1001',
      name: 'Organic Tomatoes',
      category: 'Vegetables',
      farmer: 'John Smith',
      price: '$2.99/lb',
      stock: 120,
      unit: 'lb',
      stockStatus: 'In Stock',
      certifications: 'Organic',
      rating: 4.5,
      lastUpdated: '2023-06-15'
    },
    {
      id: 'P1002',
      name: 'Fresh Farm Eggs',
      category: 'Dairy & Eggs',
      farmer: 'Maria Rodriguez',
      price: '$5.49/dozen',
      stock: 80,
      unit: 'dozen',
      stockStatus: 'In Stock',
      certifications: 'Free Range, Organic',
      rating: 4.8,
      lastUpdated: '2023-06-18'
    },
    {
      id: 'P1003',
      name: 'Grass-Fed Beef',
      category: 'Meat',
      farmer: 'Robert Johnson',
      price: '$9.99/lb',
      stock: 45,
      unit: 'lb',
      stockStatus: 'Low Stock',
      certifications: 'Pasture-Raised',
      rating: 4.6,
      lastUpdated: '2023-06-14'
    },
    {
      id: 'P1004',
      name: 'Artisanal Honey',
      category: 'Specialty',
      farmer: 'Sarah Williams',
      price: '$12.99/jar',
      stock: 30,
      unit: 'jar',
      stockStatus: 'Low Stock',
      certifications: 'Raw, Unfiltered',
      rating: 4.9,
      lastUpdated: '2023-06-10'
    },
    {
      id: 'P1005',
      name: 'Organic Baby Spinach',
      category: 'Vegetables',
      farmer: 'Michael Chen',
      price: '$3.99/bag',
      stock: 0,
      unit: 'bag',
      stockStatus: 'Out of Stock',
      certifications: 'Organic',
      rating: 4.3,
      lastUpdated: '2023-05-30'
    },
    {
      id: 'P1006',
      name: 'Fresh Milk',
      category: 'Dairy & Eggs',
      farmer: 'Emma Davis',
      price: '$4.49/gallon',
      stock: 65,
      unit: 'gallon',
      stockStatus: 'In Stock',
      certifications: 'Hormone-Free',
      rating: 4.7,
      lastUpdated: '2023-06-19'
    },
    {
      id: 'P1007',
      name: 'Heirloom Carrots',
      category: 'Vegetables',
      farmer: 'John Smith',
      price: '$3.49/bunch',
      stock: 90,
      unit: 'bunch',
      stockStatus: 'In Stock',
      certifications: 'Organic',
      rating: 4.2,
      lastUpdated: '2023-06-17'
    },
    {
      id: 'P1008',
      name: 'Organic Apples',
      category: 'Fruits',
      farmer: 'Sarah Williams',
      price: '$1.99/lb',
      stock: 15,
      unit: 'lb',
      stockStatus: 'Low Stock',
      certifications: 'Organic',
      rating: 4.4,
      lastUpdated: '2023-06-12'
    }
  ];

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setFilteredData(products);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle search
  useEffect(() => {
    if (!products) return;
    
    const results = products.filter(product => {
      return Object.keys(product).some(key => 
        product[key].toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    
    setFilteredData(results);
  }, [searchTerm, products]);

  // Filter options
  const filters = [
    {
      name: 'category',
      label: 'Category',
      options: [
        { label: 'Vegetables', value: 'Vegetables' },
        { label: 'Fruits', value: 'Fruits' },
        { label: 'Dairy & Eggs', value: 'Dairy & Eggs' },
        { label: 'Meat', value: 'Meat' },
        { label: 'Specialty', value: 'Specialty' }
      ]
    },
    {
      name: 'stockStatus',
      label: 'Stock Status',
      options: [
        { label: 'In Stock', value: 'In Stock' },
        { label: 'Low Stock', value: 'Low Stock' },
        { label: 'Out of Stock', value: 'Out of Stock' }
      ]
    },
    {
      name: 'certifications',
      label: 'Certifications',
      options: [
        { label: 'Organic', value: 'Organic' },
        { label: 'Free Range', value: 'Free Range' },
        { label: 'Pasture-Raised', value: 'Pasture-Raised' },
        { label: 'Raw', value: 'Raw' },
        { label: 'Hormone-Free', value: 'Hormone-Free' }
      ]
    }
  ];

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Apply filters
  useEffect(() => {
    if (!products || Object.keys(selectedFilters).length === 0) {
      setFilteredData(products);
      return;
    }
    
    const results = products.filter(product => {
      return Object.entries(selectedFilters).every(([key, value]) => {
        if (!value || value === 'all') return true;
        return product[key].includes(value);
      });
    });
    
    setFilteredData(results);
  }, [selectedFilters, products]);

  // Table columns
  const columns = [
    { accessor: 'id', header: 'ID' },
    { 
      accessor: 'name', 
      header: 'Product Name',
      cell: (row) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-dashboard-text-light">{row.category}</div>
        </div>
      )
    },
    { accessor: 'farmer', header: 'Farmer' },
    { accessor: 'price', header: 'Price' },
    { 
      accessor: 'stockStatus', 
      header: 'Stock',
      cell: (row) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.stockStatus === 'In Stock' ? 'bg-green-100 text-green-800' : 
          row.stockStatus === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-red-100 text-red-800'
        }`}>
          {row.stockStatus} {row.stockStatus !== 'Out of Stock' && `(${row.stock} ${row.unit})`}
        </span>
      )
    },
    { accessor: 'certifications', header: 'Certifications' },
    { 
      accessor: 'rating', 
      header: 'Rating',
      cell: (row) => (
        <div className="flex items-center">
          <span>{row.rating}</span>
          <div className="ml-2 flex">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 ${i < Math.floor(row.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      )
    },
    { accessor: 'lastUpdated', header: 'Last Updated' },
    { 
      accessor: 'actions', 
      header: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button className="text-green-600 hover:text-green-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button className="text-red-600 hover:text-red-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  // Custom actions
  const actions = (
    <div className="flex items-center space-x-2">
      <button
        className="flex items-center text-sm py-1.5 px-2 rounded-md border border-dashboard-border hover:bg-gray-100"
        onClick={() => setShowFilterPanel(!showFilterPanel)}
      >
        <FilterIcon />
        <span className="ml-1 hidden md:inline">Filter</span>
      </button>
      <button
        className="flex items-center text-sm py-1.5 px-2 rounded-md bg-farmio text-white hover:bg-farmio-dark"
      >
        <AddIcon />
        <span className="ml-1 hidden md:inline">Add Product</span>
      </button>
    </div>
  );

  return (
    <DashboardLayout
      title="Products Management"
      breadcrumbs="Products / All Products"
      actions={actions}
      userRole="admin"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Total Products"
          value={products.length.toString()}
          subtitle="Across all categories"
          icon={<ProductsIcon />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard 
          title="Low Stock Items"
          value={products.filter(p => p.stockStatus === 'Low Stock').length.toString()}
          subtitle="Need attention"
          icon={<WarningIcon />}
          color="yellow"
          isLoading={isLoading}
        />
        <StatCard 
          title="Out of Stock Items"
          value={products.filter(p => p.stockStatus === 'Out of Stock').length.toString()}
          subtitle="Require reordering"
          icon={<WarningIcon />}
          color="red"
          isLoading={isLoading}
        />
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-dashboard-border focus:outline-none focus:ring-2 focus:ring-farmio focus:border-transparent"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
        </div>

        {/* Filter panel */}
        {showFilterPanel && (
          <div className="mt-4 p-4 bg-white border border-dashboard-border rounded-lg shadow-sm">
            <h3 className="text-sm font-medium mb-3 text-dashboard-text-primary">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filters.map((filter, index) => (
                <div key={index} className="space-y-1">
                  <label className="block text-xs font-medium text-dashboard-text-secondary">{filter.label}</label>
                  <select
                    className="w-full rounded-md border border-dashboard-border py-1.5 pl-3 pr-8 text-sm"
                    value={selectedFilters[filter.name] || 'all'}
                    onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                  >
                    <option value="all">All</option>
                    {filter.options.map((option, idx) => (
                      <option key={idx} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <button 
                className="px-3 py-1 text-sm text-gray-600 border border-dashboard-border rounded-md hover:bg-gray-100"
                onClick={() => setSelectedFilters({})}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Products Table */}
      <Card
        title="Product Inventory"
        color="blue"
        icon={<ProductsIcon />}
        noPadding
      >
        <Table
          isLoading={isLoading}
          columns={columns}
          data={filteredData}
          onRowClick={(row) => console.log('Clicked row:', row)}
          emptyMessage="No products found."
        />
      </Card>
    </DashboardLayout>
  );
};

export default ProductsManagement;
