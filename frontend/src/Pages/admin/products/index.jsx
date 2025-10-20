import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import StatCard from '../../../components/ui/StatCard';
import productService from '../../../API/productService';
import { fetchAllProducts } from '../../../Utils/cropUtils';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 m-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h2>Something went wrong</h2>
          <p>{this.state.error && this.state.error.toString()}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ViewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const ProductsManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewType, setViewType] = useState('grid'); // 'grid' or 'table'
  const [editFormData, setEditFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch products from API using products table
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const products = await fetchAllProducts();
        console.log('Fetched products from products table:', products);
        
        // Map product data to match the expected product structure based on API response (camelCase)
        const mappedProducts = products.map((product) => ({
          id: product.id || 'N/A',
          name: product.productName || 'Unknown Product',
          category: product.measurement || 'Uncategorized',
          farmer: 'Product Owner', // Not available in products table
          farmerId: product.userId || '', // Available as userId
          location: product.location || 'Unknown location',
          price: product.pricePerUnit ? `LKR ${product.pricePerUnit}/${product.measurement || 'unit'}` : 'Price not set',
          stock: product.availableStock || 0,
          unit: product.measurement || 'unit',
          stockStatus: product.availableStock > 20 ? 'In Stock' : 
                        product.availableStock > 0 ? 'Low Stock' : 'Out of Stock',
          certifications: product.badges && product.badges.length > 0 ? product.badges.join(', ') : 'Standard',
          harvested: product.createdAt ? new Date(product.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          // Use imageUrls from API or fallback to default
          image: product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : 
                 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
          // Store all images if available
          allImages: product.imageUrls || [],
          description: `${product.productName || 'Product'} from ${product.location || 'farm'}`,
          lifespan: '7-10 days',
          storageConditions: 'Store in a cool, dry place',
          verified: false, // Not available in products table
          rating: 0, // Not available in products table
          transportationAvailable: product.transportAvailability === 'Yes',
          returnsAccepted: product.returnAccepted === 'Yes',
          createdAt: product.createdAt,
          pricePerUnit: product.pricePerUnit,
          availableStock: product.availableStock
        }));
        
        setAllProducts(mappedProducts);
        setFilteredData(mappedProducts);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setIsLoading(false);
        setAllProducts([]);
        setFilteredData([]);
      }
    };
    
    fetchProducts();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      // If search is empty, apply filters only
      applyFilters(allProducts);
    } else {
      // Apply search on all products
      const results = allProducts.filter(product => {
        return Object.keys(product).some(key => {
          if (product[key]) {
            return product[key].toString().toLowerCase().includes(searchTerm.toLowerCase());
          }
          return false;
        });
      });
      // Apply filters on search results
      applyFilters(results);
    }
  }, [searchTerm, allProducts]);

  // Helper function to apply filters
  const applyFilters = (productsToFilter) => {
    if (!productsToFilter || Object.keys(selectedFilters).length === 0) {
      setFilteredData(productsToFilter);
      return;
    }

    const results = productsToFilter.filter(product => {
      return Object.entries(selectedFilters).every(([key, value]) => {
        if (!value || value === 'all') return true;

        // Special handling for date ranges
        if (key === 'harvested') {
          const productDate = new Date(product.harvested);
          const today = new Date();

          switch (value) {
            case '7days':
              const sevenDaysAgo = new Date();
              sevenDaysAgo.setDate(today.getDate() - 7);
              return productDate >= sevenDaysAgo;
            case '14days':
              const fourteenDaysAgo = new Date();
              fourteenDaysAgo.setDate(today.getDate() - 14);
              return productDate >= fourteenDaysAgo;
            case '30days':
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(today.getDate() - 30);
              return productDate >= thirtyDaysAgo;
            default:
              return true;
          }
        }

        return product[key] && product[key].toString().includes(value);
      });
    });

    setFilteredData(results);
  };

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
    },
    {
      name: 'farmer',
      label: 'Farmer',
      options: [
        { label: 'Kumara Perera', value: 'Kumara Perera' },
        { label: 'Malini Gunasekara', value: 'Malini Gunasekara' },
        { label: 'Asanka Fernando', value: 'Asanka Fernando' },
        { label: 'Priyantha Weerasinghe', value: 'Priyantha Weerasinghe' },
        { label: 'Dinesh Rajapaksa', value: 'Dinesh Rajapaksa' }
      ]
    },
    {
      name: 'harvested',
      label: 'Harvest Date',
      options: [
        { label: 'Last 7 days', value: '7days' },
        { label: 'Last 14 days', value: '14days' },
        { label: 'Last 30 days', value: '30days' },
        { label: 'All time', value: 'all' }
      ]
    },
    {
      name: 'location',
      label: 'Location',
      options: [
        { label: 'Nuwara Eliya', value: 'Nuwara Eliya' },
        { label: 'Kandy', value: 'Kandy' },
        { label: 'Ratnapura', value: 'Ratnapura' },
        { label: 'Matara', value: 'Matara' },
        { label: 'Bandarawela', value: 'Bandarawela' }
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

  // Apply filters when they change
  useEffect(() => {
    if (searchTerm.trim() === '') {
      applyFilters(allProducts);
    } else {
      const searchResults = allProducts.filter(product => {
        return Object.keys(product).some(key => {
          if (product[key]) {
            return product[key].toString().toLowerCase().includes(searchTerm.toLowerCase());
          }
          return false;
        });
      });
      applyFilters(searchResults);
    }
  }, [selectedFilters]);

  // Handle view product details
  const handleViewProduct = (product) => {
    console.log("View button clicked", product);
    setSelectedProduct(product);
    // Use setTimeout to ensure state update happens after the current event loop
    setTimeout(() => {
      setShowViewModal(true);
      console.log("Modal should be visible now");
    }, 0);
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    console.log("Edit button clicked", product);
    setSelectedProduct(product);
    setEditFormData({
      name: product.name,
      category: product.category,
      location: product.location,
      price: product.price,
      stock: product.stock,
      unit: product.unit,
      description: product.description,
      certifications: product.certifications,
      image: product.image,
      allImages: product.allImages || [],
      harvested: product.harvested,
      lifespan: product.lifespan,
      storageConditions: product.storageConditions
    });
    // Use setTimeout to ensure state update happens after the current event loop
    setTimeout(() => {
      setShowEditModal(true);
      console.log("Edit modal should be visible now");
    }, 0);
  };

  // Handle delete product
  const handleDeleteProduct = (product) => {
    console.log("Delete button clicked", product);
    setSelectedProduct(product);
    // Use setTimeout to ensure state update happens after the current event loop
    setTimeout(() => {
      setShowDeleteModal(true);
      console.log("Delete modal should be visible now");
    }, 0);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle edit form submit
  const handleEditSubmit = (e) => {
    e.preventDefault();

    // Here you would typically send the data to your backend API
    // For this example, we'll just simulate a successful update

    // Update the product in filteredData
    const updatedProducts = filteredData.map(p =>
      p.id === selectedProduct.id ? { ...p, ...editFormData, lastUpdated: new Date().toISOString().split('T')[0] } : p
    );

    setFilteredData(updatedProducts);

    // Show success message
    setSuccessMessage('Product updated successfully');

    // Close the modal after a delay
    setTimeout(() => {
      setShowEditModal(false);
      setSuccessMessage('');
    }, 2000);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedProduct || !selectedProduct.id) {
      setSuccessMessage('Error: No product selected');
      return;
    }
    
    try {
      // First check if the product can be deleted
      const canDeleteCheck = await productService.checkProductCanBeDeleted(selectedProduct.id);
      
      if (!canDeleteCheck.canDelete) {
        setSuccessMessage(canDeleteCheck.message || 'Cannot delete this product as it is associated with existing orders');
        
        // Show error message for longer
        setTimeout(() => {
          setShowDeleteModal(false);
          setSuccessMessage('');
        }, 3000);
        return;
      }
      
      // If product can be deleted, proceed with deletion
      const result = await productService.deleteProduct(selectedProduct.id);
      
      if (result.success) {
        // Update the local data by filtering out the deleted product
        const updatedProducts = filteredData.filter(p => p.id !== selectedProduct.id);
        setFilteredData(updatedProducts);
        setSuccessMessage(result.message || 'Product deleted successfully');
      } else {
        setSuccessMessage(result.message || 'Failed to delete product. Please try again.');
      }
      
      // Close the modal after a delay
      setTimeout(() => {
        setShowDeleteModal(false);
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error during product deletion:', error);
      setSuccessMessage('An unexpected error occurred. Please try again.');
      
      // Close the modal after a delay
      setTimeout(() => {
        setShowDeleteModal(false);
        setSuccessMessage('');
      }, 3000);
    }
  };

  // Handle closing the modals
  const handleCloseModal = () => {
    console.log("Closing modals");
    // Log which modals were open
    if (showViewModal) console.log("View modal was open");
    if (showEditModal) console.log("Edit modal was open");
    if (showDeleteModal) console.log("Delete modal was open");

    // Ensure we close everything with a slight delay for React to process
    setTimeout(() => {
      setShowViewModal(false);
      setShowEditModal(false);
      setShowDeleteModal(false);
      setSuccessMessage('');
      console.log("All modals should now be closed");
    }, 0);
  };

  // Handle view type toggle
  const handleViewTypeChange = (type) => {
    setViewType(type);
  };

  // Star rating component
  const StarRating = ({ rating }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating}</span>
      </div>
    );
  };

  // Table columns
  const columns = [
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
    { accessor: 'location', header: 'Location' },
    {
      accessor: 'price',
      header: 'Price',
      cell: (row) => (
        <div className="font-medium">LKR {row.price}</div>
      )
    },
    {
      accessor: 'stockStatus',
      header: 'Stock',
      cell: (row) => (
        <span className={`px-2 py-1 text-xs rounded-full ${row.stockStatus === 'In Stock' ? 'bg-green-100 text-green-800' :
          row.stockStatus === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
          {row.stockStatus} {row.stockStatus !== 'Out of Stock' && `(${row.stock} ${row.unit})`}
        </span>
      )
    },
    { accessor: 'certifications', header: 'Certifications' },
    {
      accessor: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => handleViewProduct(row)}
            title="View Product Details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            className="text-green-600 hover:text-green-800"
            onClick={() => handleEditProduct(row)}
            title="Edit Product"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            className="text-red-600 hover:text-red-800"
            onClick={() => handleDeleteProduct(row)}
            title="Delete Product"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  // Product Card Component
  const ProductCard = ({ product }) => {
    const fallbackImage = "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80";
    const [isImageError, setIsImageError] = useState(false);
    
    return (
      <div className="bg-white rounded-lg border border-dashboard-border shadow-card hover:shadow-card-hover transition-all">
        <div className="relative h-40 overflow-hidden rounded-t-lg">
          <img
            src={isImageError ? fallbackImage : (product.image || fallbackImage)}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = fallbackImage;
              setIsImageError(true);
            }}
          />
          {product.allImages && product.allImages.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-white bg-opacity-75 px-2 py-1 rounded-full text-xs font-medium text-gray-700">
              {product.allImages.length} images
            </div>
          )}
          <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full ${product.stockStatus === 'In Stock' ? 'bg-green-100 text-green-800' :
            product.stockStatus === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
            {product.stockStatus}
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-dashboard-text-primary">{product.name}</h3>
              <p className="text-xs text-dashboard-text-light">{product.category}</p>
            </div>
            <p className="font-medium text-farmio">{product.price}</p>
          </div>
          <div className="mb-2 text-sm text-dashboard-text-secondary">
            <p>Farmer: {product.farmer || 'Unknown'}</p>
            <p className="text-xs text-dashboard-text-light mt-1">Location: {product.location || 'N/A'}</p>
          </div>
          <div className="flex items-center text-xs text-dashboard-text-light mb-3">
            <CalendarIcon />
            <span className="ml-1">Added: {product.harvested}</span>
          </div>
          <div className="mt-3 flex justify-between">
            <button
              onClick={() => handleViewProduct(product)}
              className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm flex items-center"
            >
              <ViewIcon />
              <span className="ml-1">View</span>
            </button>
            <div className="flex space-x-1">
              <button
                className="text-green-600 hover:text-green-800 p-1"
                onClick={() => handleEditProduct(product)}
                title="Edit Product"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                className="text-red-600 hover:text-red-800 p-1"
                onClick={() => handleDeleteProduct(product)}
                title="Delete Product"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Custom actions
  const actions = (
    <div className="flex items-center space-x-2">
      <div className="flex items-center border border-dashboard-border rounded-md overflow-hidden mr-2">
        <button
          className={`flex items-center text-sm py-1.5 px-2 ${viewType === 'grid' ? 'bg-farmio text-white' : 'hover:bg-gray-100'}`}
          onClick={() => handleViewTypeChange('grid')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className="ml-1 hidden lg:inline">Grid</span>
        </button>
        <button
          className={`flex items-center text-sm py-1.5 px-2 ${viewType === 'table' ? 'bg-farmio text-white' : 'hover:bg-gray-100'}`}
          onClick={() => handleViewTypeChange('table')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <span className="ml-1 hidden lg:inline">Table</span>
        </button>
      </div>
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
          value={allProducts.length.toString()}
          subtitle="Across all categories"
          icon={<ProductsIcon />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard
          title="Low Stock Items"
          value={allProducts.filter(p => p.stockStatus === 'Low Stock').length.toString()}
          subtitle="Need attention"
          icon={<WarningIcon />}
          color="yellow"
          isLoading={isLoading}
        />
        <StatCard
          title="Out of Stock Items"
          value={allProducts.filter(p => p.stockStatus === 'Out of Stock').length.toString()}
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
        {viewType === 'table' ? (
          <Table
            isLoading={isLoading}
            columns={columns}
            data={filteredData}
            onRowClick={(row) => handleViewProduct(row)}
            emptyMessage="No products found."
          />
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredData.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Product Detail Modal */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-opacity-20 backdrop-filter backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative flex items-center justify-center min-h-full p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden" style={{ position: 'relative', zIndex: 2001 }}>
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="rounded-lg overflow-hidden border border-dashboard-border h-56">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80";
                        }}
                      />
                    </div>

                    {/* Additional product images if available */}
                    {selectedProduct.allImages && selectedProduct.allImages.length > 1 && (
                      <div className="mt-3 flex space-x-2 overflow-x-auto pb-2">
                        {selectedProduct.allImages.map((imgUrl, i) => (
                          <div 
                            key={i} 
                            className={`flex-shrink-0 w-14 h-14 rounded border-2 cursor-pointer ${
                              imgUrl === selectedProduct.image ? 'border-farmio' : 'border-gray-200'
                            }`}
                            onClick={() => {
                              // Update the selected image when thumbnail is clicked
                              setSelectedProduct({...selectedProduct, image: imgUrl});
                            }}
                          >
                            <img 
                              src={imgUrl} 
                              alt={`${selectedProduct.name} - view ${i+1}`} 
                              className="w-full h-full object-cover rounded" 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-4">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-medium text-dashboard-text-primary">{selectedProduct.name}</h2>
                        <span className="text-lg font-medium text-farmio">LKR {selectedProduct.price}</span>
                      </div>
                      <p className="text-sm text-dashboard-text-secondary mt-1">{selectedProduct.category}</p>
                      <p className="text-sm text-dashboard-text-secondary mt-1">Location: {selectedProduct.location}</p>
                    </div>

                    <div className="mt-4">
                      <span className={`px-3 py-1.5 text-sm rounded-full ${selectedProduct.stockStatus === 'In Stock' ? 'bg-green-100 text-green-800' :
                          selectedProduct.stockStatus === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {selectedProduct.stockStatus} {selectedProduct.stockStatus !== 'Out of Stock' && `(${selectedProduct.stock} ${selectedProduct.unit})`}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-dashboard-text-primary mb-1">Description</h4>
                      <p className="text-dashboard-text-secondary">{selectedProduct.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-dashboard-text-primary mb-1">Listed By</h4>
                        <p className="text-dashboard-text-secondary">{selectedProduct.farmer}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-dashboard-text-primary mb-1">Location</h4>
                        <p className="text-dashboard-text-secondary">{selectedProduct.location}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-dashboard-text-primary mb-1">Harvest Date</h4>
                        <p className="text-dashboard-text-secondary">{selectedProduct.harvested}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-dashboard-text-primary mb-1">Certifications</h4>
                        <p className="text-dashboard-text-secondary">{selectedProduct.certifications}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-dashboard-text-primary mb-1">Storage Conditions</h4>
                      <p className="text-dashboard-text-secondary">{selectedProduct.storageConditions}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-dashboard-text-primary mb-1">Shelf Life</h4>
                      <p className="text-dashboard-text-secondary">{selectedProduct.lifespan}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mr-2"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleCloseModal();
                    handleEditProduct(selectedProduct);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleCloseModal();
                    handleDeleteProduct(selectedProduct);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-opacity-20 backdrop-filter backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative flex items-center justify-center min-h-full p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden" style={{ position: 'relative', zIndex: 2001 }}>
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Edit Product</h3>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {successMessage && (
                <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-800">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={editFormData.name || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                      <select
                        id="category"
                        name="category"
                        value={editFormData.category || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Dairy & Eggs">Dairy & Eggs</option>
                        <option value="Meat">Meat</option>
                        <option value="Specialty">Specialty</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (LKR)</label>
                      <div className="relative mt-1">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                          LKR
                        </span>
                        <input
                          type="text"
                          id="price"
                          name="price"
                          value={editFormData.price || ''}
                          onChange={handleInputChange}
                          className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                          required
                          placeholder="150/kg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                        <input
                          type="number"
                          id="stock"
                          name="stock"
                          value={editFormData.stock || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unit</label>
                        <input
                          type="text"
                          id="unit"
                          name="unit"
                          value={editFormData.unit || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="certifications" className="block text-sm font-medium text-gray-700">Certifications</label>
                      <input
                        type="text"
                        id="certifications"
                        name="certifications"
                        value={editFormData.certifications || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700">Main Image URL</label>
                      <input
                        type="url"
                        id="image"
                        name="image"
                        value={editFormData.image || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      />
                      {editFormData.image && (
                        <div className="mt-2 rounded-md overflow-hidden h-24 w-24 border border-gray-200">
                          <img 
                            src={editFormData.image} 
                            alt="Product" 
                            className="h-full w-full object-cover" 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80";
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Display all available images if any */}
                      {editFormData.allImages && editFormData.allImages.length > 0 && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">All Product Images</label>
                          <div className="flex flex-wrap gap-2">
                            {editFormData.allImages.map((imgUrl, index) => (
                              <div key={index} className="relative group">
                                <div className={`h-16 w-16 rounded border-2 overflow-hidden ${
                                  imgUrl === editFormData.image ? 'border-farmio' : 'border-gray-200'
                                }`}>
                                  <img 
                                    src={imgUrl} 
                                    alt={`Product image ${index + 1}`} 
                                    className="h-full w-full object-cover"
                                    onClick={() => setEditFormData({...editFormData, image: imgUrl})} 
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80";
                                    }}
                                  />
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all">
                                  <button 
                                    type="button"
                                    className="opacity-0 group-hover:opacity-100 p-1 bg-white rounded-full shadow-sm"
                                    onClick={() => {
                                      const newImages = [...editFormData.allImages];
                                      newImages.splice(index, 1);
                                      
                                      // If removing the current main image, set main image to first remaining image or empty
                                      const newMainImage = imgUrl === editFormData.image 
                                        ? (newImages.length > 0 ? newImages[0] : '')
                                        : editFormData.image;
                                        
                                      setEditFormData({
                                        ...editFormData, 
                                        allImages: newImages,
                                        image: newMainImage
                                      });
                                    }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
                            
                            {/* Add new image button */}
                            <button
                              type="button"
                              className="h-16 w-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 hover:text-gray-500 hover:border-gray-400"
                              onClick={() => {
                                const newImageUrl = prompt("Enter the URL for the new product image:");
                                if (newImageUrl && newImageUrl.trim()) {
                                  const newImages = [...(editFormData.allImages || []), newImageUrl.trim()];
                                  // If this is the first image, also set it as the main image
                                  const newMainImage = editFormData.image || newImageUrl.trim();
                                  setEditFormData({
                                    ...editFormData,
                                    allImages: newImages,
                                    image: newMainImage
                                  });
                                }
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        id="description"
                        name="description"
                        value={editFormData.description || ''}
                        onChange={handleInputChange}
                        rows="3"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        required
                      ></textarea>
                    </div>

                    <div>
                      <label htmlFor="harvested" className="block text-sm font-medium text-gray-700">Harvest Date</label>
                      <input
                        type="date"
                        id="harvested"
                        name="harvested"
                        value={editFormData.harvested || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="lifespan" className="block text-sm font-medium text-gray-700">Shelf Life</label>
                      <input
                        type="text"
                        id="lifespan"
                        name="lifespan"
                        value={editFormData.lifespan || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="storageConditions" className="block text-sm font-medium text-gray-700">Storage Conditions</label>
                      <textarea
                        id="storageConditions"
                        name="storageConditions"
                        value={editFormData.storageConditions || ''}
                        onChange={handleInputChange}
                        rows="2"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      ></textarea>
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={editFormData.location || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-opacity-20 backdrop-filter backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative flex items-center justify-center min-h-full p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden" style={{ position: 'relative', zIndex: 2001 }}>
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Delete Product</h3>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {successMessage && (
                <div className={`mx-6 mt-4 p-4 ${
                  successMessage.toLowerCase().includes('cannot') || 
                  successMessage.toLowerCase().includes('error') || 
                  successMessage.toLowerCase().includes('failed') 
                    ? 'bg-red-50 border border-red-200' 
                    : 'bg-green-50 border border-green-200'
                } rounded-md`}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {successMessage.toLowerCase().includes('cannot') || 
                       successMessage.toLowerCase().includes('error') || 
                       successMessage.toLowerCase().includes('failed') ? (
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm ${
                        successMessage.toLowerCase().includes('cannot') || 
                        successMessage.toLowerCase().includes('error') || 
                        successMessage.toLowerCase().includes('failed') 
                          ? 'text-red-800' 
                          : 'text-green-800'
                      }`}>{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Delete this product?</h3>
                    <p className="text-sm text-gray-500">Are you sure you want to delete "{selectedProduct.name}"? This action cannot be undone.</p>
                    <p className="text-xs text-gray-500 mt-1">Note: Products that are associated with existing orders cannot be deleted.</p>
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={successMessage && (
                      successMessage.toLowerCase().includes('cannot') || 
                      successMessage.toLowerCase().includes('error') || 
                      successMessage.toLowerCase().includes('failed')
                    )}
                    className={`px-4 py-2 ${
                      successMessage && (
                        successMessage.toLowerCase().includes('cannot') || 
                        successMessage.toLowerCase().includes('error') || 
                        successMessage.toLowerCase().includes('failed')
                      ) ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                    } text-white rounded-md`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Debug effect to monitor modal states */}
      <div>
        {useEffect(() => {
          console.log("Modal states updated:", { showViewModal, showEditModal, showDeleteModal });
        }, [showViewModal, showEditModal, showDeleteModal])}
      </div>
    </DashboardLayout>
  );
};

// Wrap the component in the ErrorBoundary before exporting
const ProductsManagementWithErrorHandling = () => (
  <ErrorBoundary>
    <ProductsManagement />
  </ErrorBoundary>
);

export default ProductsManagementWithErrorHandling;