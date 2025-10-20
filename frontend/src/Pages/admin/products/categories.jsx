import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import StatCard from '../../../components/ui/StatCard';
import { fetchAllProducts } from '../../../Utils/cropUtils';

const CategoriesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const ProductCategories = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showVariantsModal, setShowVariantsModal] = useState(false);
  const [sortBy, setSortBy] = useState('productCount'); // productCount, totalStock, avgPrice, name
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const products = await fetchAllProducts();
        console.log('Fetched products for categories:', products);
        
        // Extract unique categories from products
        const categoryMap = new Map();
        
        products.forEach((product) => {
          const categoryName = product.productName || 'Uncategorized';
          if (!categoryMap.has(categoryName)) {
            categoryMap.set(categoryName, {
              id: categoryName.toLowerCase().replace(/\s+/g, '-'),
              name: categoryName,
              description: `Products of type ${categoryName}`,
              productCount: 0,
              totalStock: 0,
              avgPrice: 0,
              locations: new Set(),
              measurements: new Set()
            });
          }
          
          const category = categoryMap.get(categoryName);
          category.productCount += 1;
          category.totalStock += product.availableStock || 0;
          category.locations.add(product.location || 'Unknown');
          category.measurements.add(product.measurement || 'unit');
        });
        
        // Calculate average prices and convert to array
        const categoriesData = Array.from(categoryMap.values()).map(category => {
          const categoryProducts = products.filter(p => (p.productName || 'Uncategorized') === category.name);
          const totalPrice = categoryProducts.reduce((sum, p) => sum + (p.pricePerUnit || 0), 0);
          
          return {
            ...category,
            avgPrice: categoryProducts.length > 0 ? Math.round(totalPrice / categoryProducts.length) : 0,
            locations: Array.from(category.locations).join(', '),
            measurements: Array.from(category.measurements).join(', ')
          };
        });
        
        // Sort by product count (most products first)
        categoriesData.sort((a, b) => b.productCount - a.productCount);
        
        setCategories(categoriesData);
        setFilteredCategories(categoriesData);
        setAllProducts(products); // Store all products for variant details
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories([]);
        setFilteredCategories([]);
        setAllProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCategories();
  }, []);

  // Handle search and filtering
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.locations.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.measurements.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  // Handle sorting
  useEffect(() => {
    const sorted = [...filteredCategories].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'totalStock':
          return b.totalStock - a.totalStock;
        case 'avgPrice':
          return b.avgPrice - a.avgPrice;
        case 'productCount':
        default:
          return b.productCount - a.productCount;
      }
    });
    setFilteredCategories(sorted);
  }, [sortBy, categories]);

  // Handle view variants
  const handleViewVariants = (category) => {
    setSelectedCategory(category);
    setShowVariantsModal(true);
  };

  const columns = [
    { accessor: 'id', header: 'ID' },
    { accessor: 'name', header: 'Product Name' },
    { 
      accessor: 'productCount', 
      header: 'Variants',
      cell: (row) => (
        <button
          onClick={() => handleViewVariants(row)}
          className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer"
          title="Click to view variants"
        >
          {row.productCount} variants
        </button>
      )
    },
    { 
      accessor: 'measurements', 
      header: 'Measurements',
      cell: (row) => (
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
          {row.measurements}
        </span>
      )
    },
    { 
      accessor: 'totalStock', 
      header: 'Total Stock',
      cell: (row) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.totalStock > 100 ? 'bg-green-100 text-green-800' :
          row.totalStock > 50 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {row.totalStock} units
        </span>
      )
    },
    {
      accessor: 'avgPrice',
      header: 'Avg Price',
      cell: (row) => (
        <span className="font-medium text-gray-900">
          LKR {row.avgPrice}
        </span>
      )
    },
    { 
      accessor: 'locations', 
      header: 'Locations',
      cell: (row) => (
        <span className="text-sm text-gray-600" title={row.locations}>
          {row.locations.length > 30 ? `${row.locations.substring(0, 30)}...` : row.locations}
        </span>
      )
    },
    {
      accessor: 'actions',
      header: 'Actions',
      cell: (row) => (
        <button
          onClick={() => handleViewVariants(row)}
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
      )
    },
  ];

  return (
    <DashboardLayout
      title="Product Categories"
      breadcrumbs="Products / Categories"
      userRole="admin"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Categories"
          value={filteredCategories.length.toString()}
          subtitle="Product categories"
          icon={<CategoriesIcon />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard 
          title="Total Products"
          value={filteredCategories.reduce((sum, cat) => sum + cat.productCount, 0).toString()}
          subtitle="Across all categories"
          icon={<CategoriesIcon />}
          color="green"
          isLoading={isLoading}
        />
        <StatCard 
          title="Total Stock"
          value={filteredCategories.reduce((sum, cat) => sum + cat.totalStock, 0).toString()}
          subtitle="Units available"
          icon={<CategoriesIcon />}
          color="yellow"
          isLoading={isLoading}
        />
        <StatCard 
          title="Avg Price"
          value={`LKR ${filteredCategories.length > 0 ? Math.round(filteredCategories.reduce((sum, cat) => sum + cat.avgPrice, 0) / filteredCategories.length) : 0}`}
          subtitle="Per unit"
          icon={<CategoriesIcon />}
          color="purple"
          isLoading={isLoading}
        />
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search categories by name, location, or measurement..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
          
          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="rounded-md border border-gray-300 py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="productCount">Most Variants</option>
              <option value="totalStock">Highest Stock</option>
              <option value="avgPrice">Highest Price</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>
      </div>
      <Card title="Categories List" color="blue" icon={<CategoriesIcon />} noPadding>
        <Table
          isLoading={isLoading}
          columns={columns}
          data={filteredCategories}
          emptyMessage="No categories found."
        />
      </Card>

      {/* Variants Detail Modal */}
      {showVariantsModal && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-600 bg-opacity-50" onClick={() => setShowVariantsModal(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden z-10">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedCategory.name} - Product Variants
                </h3>
                <button 
                  onClick={() => setShowVariantsModal(false)} 
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Category Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-blue-600">Total Variants</div>
                    <div className="text-2xl font-bold text-blue-900">{selectedCategory.productCount}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-green-600">Total Stock</div>
                    <div className="text-2xl font-bold text-green-900">{selectedCategory.totalStock}</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-yellow-600">Average Price</div>
                    <div className="text-2xl font-bold text-yellow-900">LKR {selectedCategory.avgPrice}</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-purple-600">Locations</div>
                    <div className="text-sm font-bold text-purple-900">{selectedCategory.locations.split(',').length}</div>
                  </div>
                </div>

              {/* Variants Table */}
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price per Unit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transport Available</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returns Accepted</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allProducts
                      .filter(product => product.productName === selectedCategory.name)
                      .map((variant, index) => (
                        <tr key={variant.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                            #{variant.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {variant.location || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
                              {variant.measurement || 'unit'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                              variant.availableStock > 50 ? 'bg-green-100 text-green-800' :
                              variant.availableStock > 20 ? 'bg-yellow-100 text-yellow-800' :
                              variant.availableStock > 0 ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {variant.availableStock || 0} {variant.measurement || 'units'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                            LKR {variant.pricePerUnit || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                              variant.transportAvailability === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {variant.transportAvailability || 'No'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                              variant.returnAccepted === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {variant.returnAccepted || 'No'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {variant.createdAt ? new Date(variant.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    {allProducts.filter(product => product.productName === selectedCategory.name).length === 0 && (
                      <tr>
                        <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V5a2 2 0 012-2h2m0 0v2m0 0V9a2 2 0 01-2 2H9a2 2 0 01-2-2V7a2 2 0 012-2h2z" />
                            </svg>
                            <p className="text-lg font-medium">No variants found</p>
                            <p className="text-sm">No product variants available for "{selectedCategory.name}"</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {allProducts.filter(product => product.productName === selectedCategory.name).length} variants
              </div>
              <button
                onClick={() => setShowVariantsModal(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ProductCategories; 