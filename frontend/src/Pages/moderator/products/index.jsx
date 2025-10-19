import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import StatCard from '../../../components/ui/StatCard';
import { 
  fetchAllProductsForModerator, 
  approveProduct, 
  rejectProduct,
  formatCurrency,
  formatDate
} from '../../../Utils/moderatorUtils';
import { fetchAllProducts } from '../../../Utils/cropUtils';

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

// Sri Lankan products data
const products = [
  { 
    id: 'P001', 
    name: 'Ceylon Cinnamon', 
    category: 'Spices',
    farmer: 'Ratnapura Spice Gardens',
    price: 'Rs. 1,200/kg',
    stock: '85 kg',
    status: 'Available',
    lastUpdated: '2025-06-20'
  },
  { 
    id: 'P002', 
    name: 'Buffalo Curd', 
    category: 'Dairy',
    farmer: 'Hambantota Dairy Collective',
    price: 'Rs. 350/pot',
    stock: '120 pots',
    status: 'Available',
    lastUpdated: '2025-06-21'
  },
  { 
    id: 'P003', 
    name: 'Organic Rice', 
    category: 'Grains',
    farmer: 'Polonnaruwa Paddy Collective',
    price: 'Rs. 220/kg',
    stock: '500 kg',
    status: 'Low Stock',
    lastUpdated: '2025-06-19'
  },
  { 
    id: 'P004', 
    name: 'Nuwara Eliya Tea', 
    category: 'Tea',
    farmer: 'Highland Tea Estates',
    price: 'Rs. 850/kg',
    stock: '150 kg',
    status: 'Available',
    lastUpdated: '2025-06-18'
  },
  { 
    id: 'P005', 
    name: 'King Coconut', 
    category: 'Fruits',
    farmer: 'Kurunegala Coconut Farms',
    price: 'Rs. 120/unit',
    stock: '350 units',
    status: 'Available',
    lastUpdated: '2025-06-20'
  },
  { 
    id: 'P006', 
    name: 'Jackfruit', 
    category: 'Fruits',
    farmer: 'Kandy Tropical Gardens',
    price: 'Rs. 450/unit',
    stock: '0 units',
    status: 'Out of Stock',
    lastUpdated: '2025-06-17'
  },
  { 
    id: 'P007', 
    name: 'Kithul Treacle', 
    category: 'Sweeteners',
    farmer: 'Ratnapura Traditional Products',
    price: 'Rs. 750/bottle',
    stock: '45 bottles',
    status: 'Available',
    lastUpdated: '2025-06-15'
  },
  {
    id: 'P008',
    name: 'Fresh Prawns',
    category: 'Seafood',
    farmer: 'Negombo Fisheries',
    price: 'Rs. 1,800/kg',
    stock: '65 kg',
    status: 'Available',
    lastUpdated: '2025-06-22'
  },
  {
    id: 'P009',
    name: 'Green Chillies',
    category: 'Vegetables',
    farmer: 'Dambulla Fresh Produce',
    price: 'Rs. 180/kg',
    stock: '45 kg',
    status: 'Available',
    lastUpdated: '2025-06-19'
  },
  {
    id: 'P010',
    name: 'Coconut Oil',
    category: 'Oils',
    farmer: 'Kuliyapitiya Coconut Mills',
    price: 'Rs. 950/liter',
    stock: '85 liters',
    status: 'Low Stock',
    lastUpdated: '2025-06-20'
  },
];

const ProductsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [error, setError] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Load products data
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use the same fetchAllProducts function from cropUtils
        const products = await fetchAllProducts();
        
        // Map products to moderator format
        const mappedProducts = products.map((product) => ({
          id: product.id || 'N/A',
          name: product.productName || 'Unknown Product',
          category: product.measurement || 'Uncategorized',
          farmer: 'Product Owner',
          farmerId: product.userId || '',
          location: product.location || 'Unknown location',
          price: product.pricePerUnit ? `LKR ${product.pricePerUnit}/${product.measurement || 'unit'}` : 'Price not set',
          stock: product.availableStock || 0,
          unit: product.measurement || 'unit',
          status: product.availableStock > 20 ? 'Available' :
                  product.availableStock > 0 ? 'Low Stock' : 'Out of Stock',
          certifications: 'Standard',
          harvested: product.createdAt ? new Date(product.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          image: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
          allImages: [],
          description: `${product.productName || 'Product'} from ${product.location || 'farm'}`,
          lifespan: '7-10 days',
          storageConditions: 'Store in a cool, dry place',
          verified: false,
          rating: 0,
          transportationAvailable: product.transportAvailability === 'Yes',
          returnsAccepted: product.returnAccepted === 'Yes',
          createdAt: product.createdAt,
          pricePerUnit: product.pricePerUnit,
          availableStock: product.availableStock,
          transportAvailability: product.transportAvailability,
          returnAccepted: product.returnAccepted
        }));
        
        setAllProducts(mappedProducts);
        setFilteredProducts(mappedProducts);
        
      } catch (error) {
        console.error('Error loading products:', error);
        setError('Failed to load products. Please try again.');
        setAllProducts([]);
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Categories derived from products
  const categories = ['All', ...new Set(allProducts.map(product => product.category))];

  // Filter products based on search query and category
  useEffect(() => {
    let result = allProducts;
    
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(lowerCaseQuery) || 
        product.id.toLowerCase().includes(lowerCaseQuery) ||
        product.farmer.toLowerCase().includes(lowerCaseQuery) ||
        product.location.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    if (selectedCategory !== 'All') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, allProducts]);

  // Product status badge
  const ProductStatusBadge = ({ status }) => {
    const statusStyles = {
      'Available': 'bg-green-100 text-green-800',
      'Low Stock': 'bg-yellow-100 text-yellow-800',
      'Out of Stock': 'bg-red-100 text-red-800',
      'Under Review': 'bg-blue-100 text-blue-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

// Handle opening view modal
const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
};

// Handle opening edit modal
const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
};

// Handle approve product
const handleApproveProduct = async (productId) => {
    try {
        await approveProduct(productId);
        // Refresh products list
        const updatedProducts = allProducts.map(p => 
            p.id === productId ? { ...p, status: 'Available' } : p
        );
        setAllProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
    } catch (error) {
        console.error('Error approving product:', error);
    }
};

// Handle reject product
const handleRejectProduct = async (productId) => {
    try {
        await rejectProduct(productId, 'Rejected by moderator');
        // Refresh products list
        const updatedProducts = allProducts.map(p => 
            p.id === productId ? { ...p, status: 'Out of Stock' } : p
        );
        setAllProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
    } catch (error) {
        console.error('Error rejecting product:', error);
    }
};

// View Modal Component
const ViewProductModal = () => {
    if (!selectedProduct) return null;
    
    return (
        <div className="fixed inset-0 bg-green bg-opacity-10 backdrop-blur-[1px] flex items-center justify-center z-50 p-4 transition-all duration-300 ease-in-out">
            <div className="bg-white bg-opacity-95 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all scale-100 animate-fadeIn">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-dashboard-text-primary">Product Details</h2>
                        <button 
                            onClick={() => setIsViewModalOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 md:col-span-1">
                            <p className="text-sm text-gray-500">Product ID</p>
                            <p className="font-medium">{selectedProduct.id}</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">{selectedProduct.name}</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <p className="text-sm text-gray-500">Category</p>
                            <p className="font-medium">{selectedProduct.category}</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <p className="text-sm text-gray-500">Farmer</p>
                            <p className="font-medium">{selectedProduct.farmer}</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <p className="text-sm text-gray-500">Price</p>
                            <p className="font-medium">{selectedProduct.price}</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <p className="text-sm text-gray-500">Stock</p>
                            <p className="font-medium">{selectedProduct.stock}</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <p className="text-sm text-gray-500">Status</p>
                            <ProductStatusBadge status={selectedProduct.status} />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <p className="text-sm text-gray-500">Last Updated</p>
                            <p className="font-medium">{selectedProduct.lastUpdated}</p>
                        </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => setIsViewModalOpen(false)}
                            className="px-4 py-2 bg-gray-100 text-dashboard-text-primary text-sm font-medium rounded-lg hover:bg-gray-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Edit Modal Component
const EditProductModal = () => {
    const [productForm, setProductForm] = useState(selectedProduct || {});
    
    // Initialize form when selected product changes
    useEffect(() => {
        if (selectedProduct) {
            setProductForm(selectedProduct);
        }
    }, [selectedProduct]);
    
    if (!selectedProduct) return null;
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductForm(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically save the changes to your backend
        console.log('Saving product:', productForm);
        // Update the product in the local state for demo purposes
        const updatedProducts = filteredProducts.map(p => 
            p.id === productForm.id ? productForm : p
        );
        setFilteredProducts(updatedProducts);
        setIsEditModalOpen(false);
    };
    
    return (
        <div className="fixed inset-0 bg-green bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ease-in-out">
            <div className="bg-white bg-opacity-95 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all scale-100 animate-fadeIn">
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-dashboard-text-primary">Edit Product</h2>
                        <button 
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 md:col-span-1">
                            <p className="text-sm text-gray-500">Product ID</p>
                            <input 
                                type="text" 
                                name="id"
                                value={productForm.id || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-farmio focus:border-farmio"
                                disabled
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <p className="text-sm text-gray-500">Name</p>
                            <input 
                                type="text" 
                                name="name"
                                value={productForm.name || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-farmio focus:border-farmio"
                                required
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <p className="text-sm text-gray-500">Category</p>
                            <select
                                name="category"
                                value={productForm.category || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-farmio focus:border-farmio"
                                required
                            >
                                {categories.filter(cat => cat !== 'All').map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <p className="text-sm text-gray-500">Farmer</p>
                            <input 
                                type="text" 
                                name="farmer"
                                value={productForm.farmer || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-farmio focus:border-farmio"
                                required
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <p className="text-sm text-gray-500">Price</p>
                            <input 
                                type="text" 
                                name="price"
                                value={productForm.price || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-farmio focus:border-farmio"
                                required
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <p className="text-sm text-gray-500">Stock</p>
                            <input 
                                type="text" 
                                name="stock"
                                value={productForm.stock || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-farmio focus:border-farmio"
                                required
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <p className="text-sm text-gray-500">Status</p>
                            <select
                                name="status"
                                value={productForm.status || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-farmio focus:border-farmio"
                                required
                            >
                                <option value="Available">Available</option>
                                <option value="Low Stock">Low Stock</option>
                                <option value="Out of Stock">Out of Stock</option>
                                <option value="Under Review">Under Review</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                            className="px-4 py-2 bg-gray-100 text-dashboard-text-primary text-sm font-medium rounded-lg hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-farmio text-white text-sm font-medium rounded-lg hover:bg-farmio-dark"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

  return (
    <DashboardLayout 
      title="Product Management" 
      userRole="moderator"
      breadcrumbs="Products / All Products"
    >
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertIcon />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Products</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Products"
          value={allProducts.length.toString()}
          subtitle="Available products"
          icon={<ProductsIcon />}
          color="green"
          isLoading={isLoading}
        />
        <StatCard 
          title="Products to Review"
          value={allProducts.filter(p => p.status === 'Under Review').length.toString()}
          subtitle="Need attention"
          icon={<AlertIcon />}
          color="yellow"
          isLoading={isLoading}
        />
        <StatCard 
          title="Low Stock Items"
          value={allProducts.filter(p => p.status === 'Low Stock').length.toString()}
          subtitle="Need restock"
          icon={<AlertIcon />}
          color="red"
          isLoading={isLoading}
        />
        <StatCard 
          title="Available Products"
          value={allProducts.filter(p => p.status === 'Available').length.toString()}
          subtitle="Ready for sale"
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
            { 
              header: 'Farmer', 
              accessor: 'farmer',
              cell: (row) => (
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{row.farmer}</div>
                  <div className="text-xs text-gray-500">ID: {row.farmerId}</div>
                </div>
              )
            },
            { 
              header: 'Location', 
              accessor: 'location',
              cell: (row) => (
                <span className="text-sm text-gray-600">{row.location}</span>
              )
            },
            { 
              header: 'Price', 
              accessor: 'price',
              cell: (row) => (
                <span className="font-medium text-gray-900">{row.price}</span>
              )
            },
            { 
              header: 'Stock', 
              accessor: 'stock',
              cell: (row) => (
                <span className="font-medium">{row.stock} {row.unit}</span>
              )
            },
            { 
              header: 'Status', 
              accessor: 'status',
              cell: (row) => <ProductStatusBadge status={row.status} />
            },
            {
              header: 'Actions',
              accessor: 'actions',
              cell: (row) => (
                <div className="flex space-x-2">
                  <button 
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewProduct(row);
                    }}
                  >
                    View Details
                  </button>
                </div>
              )
            }
          ]}
          data={filteredProducts}
        />
        
        {/* Pagination */}
        <div className="p-4 flex justify-between items-center">
          <div className="text-sm text-dashboard-text-light">
            Showing {filteredProducts.length} of {allProducts.length} products
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 rounded bg-gray-100 text-dashboard-text-secondary hover:bg-gray-200">
              Previous
            </button>
            <button className="px-3 py-1 rounded bg-farmio text-white hover:bg-farmio-dark">
              1
            </button>
            <button className="px-3 py-1 rounded bg-gray-100 text-dashboard-text-secondary hover:bg-gray-200">
              2
            </button>
            <button className="px-3 py-1 rounded bg-gray-100 text-dashboard-text-secondary hover:bg-gray-200">
              Next
            </button>
          </div>
        </div>
      </Card>
      
      {/* Modals */}
      {isViewModalOpen && <ViewProductModal />}
      {isEditModalOpen && <EditProductModal />}
    </DashboardLayout>
  );
};

export default ProductsPage;