import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Table from '../../../components/ui/Table';
import Modal from '../../../components/ui/Modal';
import StatCard from '../../../components/ui/StatCard';

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

  // Load products data (normally would fetch from API)
  useEffect(() => {
    // Simulated data for now - would be fetched from an API
    const sriLankanProducts = [
      { id: 1, name: 'Rice (White)', category: 'Grains', currentGovPrice: 120, currentMarketPrice: 140, lastUpdated: '2023-05-12' },
      { id: 2, name: 'Rice (Red)', category: 'Grains', currentGovPrice: 125, currentMarketPrice: 145, lastUpdated: '2023-05-12' },
      { id: 3, name: 'Rice (Basmati)', category: 'Grains', currentGovPrice: 350, currentMarketPrice: 380, lastUpdated: '2023-05-10' },
      { id: 4, name: 'Coconut', category: 'Fruits', currentGovPrice: 80, currentMarketPrice: 100, lastUpdated: '2023-05-14' },
      { id: 5, name: 'Mango', category: 'Fruits', currentGovPrice: 200, currentMarketPrice: 250, lastUpdated: '2023-05-15' },
      { id: 6, name: 'Banana', category: 'Fruits', currentGovPrice: 60, currentMarketPrice: 70, lastUpdated: '2023-05-15' },
      { id: 7, name: 'Pineapple', category: 'Fruits', currentGovPrice: 150, currentMarketPrice: 180, lastUpdated: '2023-05-13' },
      { id: 8, name: 'Carrot', category: 'Vegetables', currentGovPrice: 90, currentMarketPrice: 120, lastUpdated: '2023-05-16' },
      { id: 9, name: 'Potato', category: 'Vegetables', currentGovPrice: 100, currentMarketPrice: 130, lastUpdated: '2023-05-16' },
      { id: 10, name: 'Onion', category: 'Vegetables', currentGovPrice: 150, currentMarketPrice: 180, lastUpdated: '2023-05-15' },
      { id: 11, name: 'Green Chili', category: 'Vegetables', currentGovPrice: 250, currentMarketPrice: 300, lastUpdated: '2023-05-14' },
      { id: 12, name: 'Tomato', category: 'Vegetables', currentGovPrice: 120, currentMarketPrice: 150, lastUpdated: '2023-05-15' },
      { id: 13, name: 'Chicken', category: 'Meat', currentGovPrice: 480, currentMarketPrice: 550, lastUpdated: '2023-05-13' },
      { id: 14, name: 'Beef', category: 'Meat', currentGovPrice: 1200, currentMarketPrice: 1350, lastUpdated: '2023-05-12' },
      { id: 15, name: 'Pork', category: 'Meat', currentGovPrice: 900, currentMarketPrice: 1000, lastUpdated: '2023-05-12' },
      { id: 16, name: 'Fish (Thalapath)', category: 'Seafood', currentGovPrice: 850, currentMarketPrice: 950, lastUpdated: '2023-05-14' },
      { id: 17, name: 'Prawn', category: 'Seafood', currentGovPrice: 1500, currentMarketPrice: 1800, lastUpdated: '2023-05-15' },
      { id: 18, name: 'Crab', category: 'Seafood', currentGovPrice: 1800, currentMarketPrice: 2000, lastUpdated: '2023-05-13' },
      { id: 19, name: 'Tea', category: 'Beverages', currentGovPrice: 400, currentMarketPrice: 450, lastUpdated: '2023-05-10' },
      { id: 20, name: 'Coconut Oil', category: 'Oil', currentGovPrice: 350, currentMarketPrice: 400, lastUpdated: '2023-05-11' }
    ];

    setProducts(sriLankanProducts);
    setLoading(false);
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

  const confirmDelete = () => {
    if (currentProduct) {
      setProducts(prevProducts => prevProducts.filter(p => p.id !== currentProduct.id));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update product in state (in real app would call API)
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

  const handleAddNewPrice = (e) => {
    e.preventDefault();
    
    // Create a new product with the entered data
    const newProduct = {
      id: products.length + 1,
      name: newPriceData.name,
      category: newPriceData.category,
      currentGovPrice: Number(newPriceData.governmentPrice),
      currentMarketPrice: Number(newPriceData.marketPrice),
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    // Add to products list
    setProducts(prevProducts => [...prevProducts, newProduct]);
    
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
