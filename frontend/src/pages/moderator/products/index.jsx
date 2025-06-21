import { useState, useEffect } from 'react';
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

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

// Dummy data
const products = [
  { 
    id: 'P001', 
    name: 'Organic Tomatoes', 
    category: 'Vegetables',
    farmer: 'Green Valley Farms',
    price: '$2.99/lb',
    stock: '180 kg',
    status: 'Available',
    lastUpdated: '2025-06-20'
  },
  { 
    id: 'P002', 
    name: 'Fresh Farm Milk', 
    category: 'Dairy',
    farmer: 'Happy Cow Dairy',
    price: '$3.50/L',
    stock: '200 L',
    status: 'Available',
    lastUpdated: '2025-06-21'
  },
  { 
    id: 'P003', 
    name: 'Organic Eggs', 
    category: 'Poultry Products',
    farmer: 'Free Range Farms',
    price: '$4.25/dozen',
    stock: '120 dozen',
    status: 'Low Stock',
    lastUpdated: '2025-06-19'
  },
  { 
    id: 'P004', 
    name: 'Grass-Fed Beef', 
    category: 'Meat',
    farmer: 'Natural Pastures',
    price: '$12.99/lb',
    stock: '75 kg',
    status: 'Available',
    lastUpdated: '2025-06-18'
  },
  { 
    id: 'P005', 
    name: 'Mixed Vegetables', 
    category: 'Vegetables',
    farmer: 'Community Gardens',
    price: '$8.50/bag',
    stock: '85 bags',
    status: 'Available',
    lastUpdated: '2025-06-20'
  },
  { 
    id: 'P006', 
    name: 'Seasonal Fruits', 
    category: 'Fruits',
    farmer: 'Orchard Haven',
    price: '$10.99/box',
    stock: '0 boxes',
    status: 'Out of Stock',
    lastUpdated: '2025-06-17'
  },
  { 
    id: 'P007', 
    name: 'Organic Honey', 
    category: 'Sweeteners',
    farmer: 'Busy Bee Farm',
    price: '$7.99/jar',
    stock: '45 jars',
    status: 'Available',
    lastUpdated: '2025-06-15'
  },
];

const ProductsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Categories derived from products
  const categories = ['All', ...new Set(products.map(product => product.category))];

  // Filter products based on search query and category
  useEffect(() => {
    let result = products;
    
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(lowerCaseQuery) || 
        product.id.toLowerCase().includes(lowerCaseQuery) ||
        product.farmer.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    if (selectedCategory !== 'All') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(result);
  }, [searchQuery, selectedCategory]);

  // Product status badge
  const ProductStatusBadge = ({ status }) => {
    const statusStyles = {
      'Available': 'bg-pastel-green text-green-800',
      'Low Stock': 'bg-pastel-yellow text-yellow-800',
      'Out of Stock': 'bg-pastel-red text-red-800',
      'Under Review': 'bg-pastel-blue text-blue-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status] || 'bg-gray-200 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <DashboardLayout 
      title="Product Management" 
      userRole="moderator"
      breadcrumbs="Products / All Products"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Products"
          value={products.length.toString()}
          subtitle="Available products"
          icon={<ProductsIcon />}
          color="green"
          isLoading={isLoading}
        />
        <StatCard 
          title="Products to Review"
          value="8"
          subtitle="Need attention"
          icon={<AlertIcon />}
          color="yellow"
          isLoading={isLoading}
        />
        <StatCard 
          title="Low Stock Items"
          value="3"
          subtitle="Need restock"
          icon={<AlertIcon />}
          color="red"
          isLoading={isLoading}
        />
        <StatCard 
          title="New This Week"
          value="12"
          subtitle="Product additions"
          icon={<ProductsIcon />}
          color="blue"
          isLoading={isLoading}
        />
      </div>
      
      {/* Main Content */}
      <Card 
        title="All Products" 
        noPadding
        color="blue"
        icon={<ProductsIcon />}
      >
        {/* Search and Filter */}
        <div className="p-4 border-b border-dashboard-border">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[280px]">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-dashboard-text-primary text-sm rounded-lg focus:ring-farmio focus:border-farmio block w-full pl-10 p-2.5"
                  placeholder="Search products by name, ID, or farmer"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div>
              <select
                className="bg-gray-50 border border-gray-300 text-dashboard-text-primary text-sm rounded-lg focus:ring-farmio focus:border-farmio block w-full p-2.5"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-farmio text-white text-sm font-medium rounded-lg hover:bg-farmio-dark focus:ring-2 focus:ring-farmio-light">
                Add Product
              </button>
              <button className="px-4 py-2 bg-gray-100 text-dashboard-text-primary text-sm font-medium rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-200">
                Export
              </button>
            </div>
          </div>
        </div>
        
        {/* Products Table */}
        <Table
          isLoading={isLoading}
          columns={[
            { header: 'Product ID', accessor: 'id' },
            { header: 'Product Name', accessor: 'name' },
            { header: 'Category', accessor: 'category' },
            { header: 'Farmer', accessor: 'farmer' },
            { header: 'Price', accessor: 'price' },
            { header: 'Stock', accessor: 'stock' },
            { 
              header: 'Status', 
              accessor: 'status',
              cell: (row) => <ProductStatusBadge status={row.status} />
            },
            { header: 'Last Updated', accessor: 'lastUpdated' },
            {
              header: 'Actions',
              accessor: 'actions',
              cell: () => (
                <div className="flex space-x-2">
                  <button className="p-1 text-blue-600 hover:text-blue-800">
                    View
                  </button>
                  <button className="p-1 text-yellow-600 hover:text-yellow-800">
                    Edit
                  </button>
                </div>
              )
            }
          ]}
          data={filteredProducts}
          onRowClick={(row) => console.log('View details for:', row)}
        />
      </Card>
    </DashboardLayout>
  );
};

export default ProductsPage;
