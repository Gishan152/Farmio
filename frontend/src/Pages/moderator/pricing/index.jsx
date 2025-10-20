import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Table from '../../../components/ui/Table';
import Modal from '../../../components/ui/Modal';
import StatCard from '../../../components/ui/StatCard';
import productPriceService from '../../../API/productPriceService';

// Icons
const PricingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const UpdateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const PricingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [priceData, setPriceData] = useState({
    governmentPrice: '',
    marketPrice: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  // Load products data from API
  useEffect(() => {
    const fetchProductPrices = async () => {
      try {
        setLoading(true);
        const data = await productPriceService.getAllProductPrices();
        
        // Map API data to match the expected format
        const mappedData = data.map(price => ({
          id: price.id,
          name: price.productName,
          category: price.category || 'Uncategorized',
          currentGovPrice: price.minPrice,
          currentMarketPrice: price.recommendedPrice,
          lastUpdated: price.updatedAt ? new Date(price.updatedAt).toISOString().split('T')[0] : 'N/A',
          unit: price.unit || 'unit',
          description: price.description
        }));
        
        setProducts(mappedData);
      } catch (error) {
        console.error('Error fetching product prices:', error);
        
        // Fallback to sample data if API call fails
        const sampleProducts = [
          { id: 1, name: 'Rice (White)', category: 'Grains', currentGovPrice: 120, currentMarketPrice: 140, lastUpdated: '2023-05-12' },
          { id: 2, name: 'Rice (Red)', category: 'Grains', currentGovPrice: 125, currentMarketPrice: 145, lastUpdated: '2023-05-12' },
          { id: 3, name: 'Potato', category: 'Vegetables', currentGovPrice: 100, currentMarketPrice: 130, lastUpdated: '2023-05-16' }
        ];
        setProducts(sampleProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProductPrices();
  }, []);

  // Sort products based on sortConfig
  const sortedProducts = React.useMemo(() => {
    let sortableProducts = [...products];
    if (sortConfig.key) {
      sortableProducts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableProducts;
  }, [products, sortConfig]);

  const columns = React.useMemo(
    () => [
      {
        header: (
          <div 
            className="cursor-pointer flex items-center" 
            onClick={() => requestSort('id')}
          >
            ID {sortConfig.key === 'id' && (
              <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
            )}
          </div>
        ),
        accessor: 'id',
      },
      {
        header: (
          <div 
            className="cursor-pointer flex items-center" 
            onClick={() => requestSort('name')}
          >
            Product Name {sortConfig.key === 'name' && (
              <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
            )}
          </div>
        ),
        accessor: 'name',
      },
      {
        header: (
          <div 
            className="cursor-pointer flex items-center" 
            onClick={() => requestSort('category')}
          >
            Category {sortConfig.key === 'category' && (
              <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
            )}
          </div>
        ),
        accessor: 'category',
      },
      {
        header: (
          <div 
            className="cursor-pointer flex items-center" 
            onClick={() => requestSort('currentGovPrice')}
          >
            Government Price (LKR) {sortConfig.key === 'currentGovPrice' && (
              <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
            )}
          </div>
        ),
        accessor: 'currentGovPrice',
        cell: (row) => `LKR ${row.currentGovPrice.toFixed(2)}`
      },
      {
        header: (
          <div 
            className="cursor-pointer flex items-center" 
            onClick={() => requestSort('currentMarketPrice')}
          >
            Market Price (LKR) {sortConfig.key === 'currentMarketPrice' && (
              <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
            )}
          </div>
        ),
        accessor: 'currentMarketPrice',
        cell: (row) => `LKR ${row.currentMarketPrice.toFixed(2)}`
      },
      {
        header: (
          <div 
            className="cursor-pointer flex items-center" 
            onClick={() => requestSort('lastUpdated')}
          >
            Last Updated {sortConfig.key === 'lastUpdated' && (
              <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
            )}
          </div>
        ),
        accessor: 'lastUpdated',
      },
      {
        header: 'Actions',
        accessor: 'actions',
        cell: (row) => (
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 bg-pastel-blue text-farmio-dark rounded hover:bg-blue-300 text-sm transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleUpdatePrice(row);
              }}
            >
              <UpdateIcon className="inline-block mr-1 h-4 w-4" />
              Update
            </button>
            <button
              className="px-3 py-1 bg-pastel-red text-white rounded hover:bg-red-400 text-sm transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePrice(row);
              }}
            >
              <DeleteIcon className="inline-block mr-1 h-4 w-4" />
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const handleUpdatePrice = (product) => {
    setCurrentProduct(product);
    setPriceData({
      governmentPrice: product.currentGovPrice.toString(),
      marketPrice: product.currentMarketPrice.toString(),
      effectiveDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setModalOpen(true);
  };

  const handleDeletePrice = (product) => {
    setCurrentProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (currentProduct) {
      try {
        // Call API to delete the product price
        await productPriceService.deleteProductPrice(currentProduct.id);
        
        // Remove from local state
        setProducts(prevProducts => prevProducts.filter(p => p.id !== currentProduct.id));
        
        // Show success message (could add a toast notification here)
        console.log('Product price deleted successfully');
      } catch (error) {
        console.error('Error deleting product price:', error);
        // Show error message
      }
      setShowDeleteModal(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPriceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare update data
      const updateData = {
        productName: currentProduct.name,
        category: currentProduct.category,
        minPrice: Number(priceData.governmentPrice),
        maxPrice: Number(priceData.marketPrice) * 1.1, // Setting max a bit higher than market
        recommendedPrice: Number(priceData.marketPrice),
        unit: currentProduct.unit || 'kg',
        description: priceData.notes || currentProduct.description || ''
      };
      
      // Call API to update product price
      await productPriceService.updateProductPrice(currentProduct.id, updateData);
      
      // Update product in local state
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === currentProduct.id 
            ? {
                ...product,
                currentGovPrice: Number(priceData.governmentPrice),
                currentMarketPrice: Number(priceData.marketPrice),
                lastUpdated: new Date().toISOString().split('T')[0]
              }
            : product
        )
      );
      
      // Show success message (could add a toast notification here)
      console.log('Price updated successfully');
    } catch (error) {
      console.error('Error updating price:', error);
      // Show error message
    }
    
    // Close modal
    setModalOpen(false);
  };

  const [newPriceData, setNewPriceData] = useState({
    id: '',
    name: '',
    category: '',
    governmentPrice: '',
    marketPrice: '',
    effectiveDate: new Date().toISOString().split('T')[0]
  });

  const handleInputChangeNewProduct = (e) => {
    const { name, value } = e.target;
    setNewPriceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddNewPrice = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare data for API
      const priceData = {
        productName: newPriceData.name,
        category: newPriceData.category,
        minPrice: Number(newPriceData.governmentPrice),
        maxPrice: Number(newPriceData.marketPrice) * 1.1, // Setting max a bit higher than market
        recommendedPrice: Number(newPriceData.marketPrice),
        unit: 'kg', // Default unit
        description: `Price effective from ${newPriceData.effectiveDate}`,
        active: true
      };
      
      // Call API to create new price
      const response = await productPriceService.createProductPrice(priceData);
      
      // Create a new product with the response data
      const newProduct = {
        id: response.id,
        name: response.productName,
        category: response.category,
        currentGovPrice: response.minPrice,
        currentMarketPrice: response.recommendedPrice,
        lastUpdated: new Date().toISOString().split('T')[0],
        unit: response.unit
      };
      
      // Add to products list
      setProducts(prevProducts => [...prevProducts, newProduct]);
      
      // Show success message (could add a toast notification here)
      console.log('New price added successfully');
    } catch (error) {
      console.error('Error adding new price:', error);
      // Show error message
    }
    
    // Reset form data
    setNewPriceData({
      id: '',
      name: '',
      category: '',
      governmentPrice: '',
      marketPrice: '',
      effectiveDate: new Date().toISOString().split('T')[0]
    });
    
    // Close modal
    setShowAddModal(false);
  };

  // Request sort function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <DashboardLayout
      title="Product Price Management"
      userRole="moderator"
      breadcrumbs="Pricing / Daily Prices"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Total Products"
          value={products.length.toString()}
          subtitle="Available products"
          icon={<PricingIcon />}
          color="blue"
          isLoading={loading}
        />
        <StatCard 
          title="Average Market Price"
          value={`LKR ${loading ? '0' : (products.reduce((sum, product) => sum + product.currentMarketPrice, 0) / products.length).toFixed(2)}`}
          subtitle="Across all products"
          icon={<ChartIcon />}
          color="green"
          isLoading={loading}
        />
        <StatCard 
          title="Last Updated"
          value={loading ? '-' : "Today"}
          subtitle="Price information"
          icon={<UpdateIcon />}
          color="purple"
          isLoading={loading}
        />
      </div>

      {/* Header with Add button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Product Prices</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-pastel-green text-farmio-dark font-medium rounded-md hover:bg-green-200 transition-colors"
        >
          Add Daily Price
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table 
            columns={columns} 
            data={sortedProducts} 
            enableSorting={true}
            defaultSortField="name"
            onSort={requestSort}
          />
        </div>
      )}

      {/* Update Price Modal */}
      {modalOpen && currentProduct && (
        <Modal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)}
          title={`Update Prices - ${currentProduct.name}`}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="governmentPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Government Price (LKR)
                </label>
                <input
                  type="number"
                  id="governmentPrice"
                  name="governmentPrice"
                  value={priceData.governmentPrice}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="marketPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Market Price (LKR)
                </label>
                <input
                  type="number"
                  id="marketPrice"
                  name="marketPrice"
                  value={priceData.marketPrice}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700 mb-1">
                Effective Date
              </label>
              <input
                type="date"
                id="effectiveDate"
                name="effectiveDate"
                value={priceData.effectiveDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={priceData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Update Prices
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add New Price Modal */}
      {showAddModal && (
        <Modal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)}
          title="Add New Daily Price"
        >
          <form onSubmit={handleAddNewPrice} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newPriceData.name}
                onChange={handleInputChangeNewProduct}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={newPriceData.category}
                onChange={handleInputChangeNewProduct}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select a category</option>
                <option value="Grains">Grains</option>
                <option value="Fruits">Fruits</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Meat">Meat</option>
                <option value="Seafood">Seafood</option>
                <option value="Beverages">Beverages</option>
                <option value="Oil">Oil</option>
                <option value="Spices">Spices</option>
                <option value="Dairy">Dairy</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="governmentPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Government Price (LKR)
                </label>
                <input
                  type="number"
                  id="governmentPrice"
                  name="governmentPrice"
                  value={newPriceData.governmentPrice}
                  onChange={handleInputChangeNewProduct}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="marketPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Market Price (LKR)
                </label>
                <input
                  type="number"
                  id="marketPrice"
                  name="marketPrice"
                  value={newPriceData.marketPrice}
                  onChange={handleInputChangeNewProduct}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700 mb-1">
                Effective Date
              </label>
              <input
                type="date"
                id="effectiveDate"
                name="effectiveDate"
                value={newPriceData.effectiveDate}
                onChange={handleInputChangeNewProduct}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Add Product Price
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentProduct && (
        <Modal 
          isOpen={showDeleteModal} 
          onClose={() => setShowDeleteModal(false)}
          title="Confirm Deletion"
        >
          <div className="py-4 px-6">
            <div className="flex items-center mb-4 p-3 bg-pastel-red bg-opacity-20 rounded-md">
              <DeleteIcon className="h-6 w-6 text-red-600 mr-3" />
              <p className="text-sm text-gray-700">
                Are you sure you want to delete the price entry for <strong>{currentProduct.name}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pastel-red hover:bg-red-400 transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default PricingPage;
