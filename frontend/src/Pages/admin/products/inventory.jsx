import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import StatCard from '../../../components/ui/StatCard';
import { fetchAllProducts } from '../../../Utils/cropUtils';

const InventoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
  </svg>
);

const ProductInventory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        setIsLoading(true);
        const products = await fetchAllProducts();
        console.log('Fetched products:', products);
        
        // Map product data to inventory format based on API response structure (camelCase)
        const inventoryData = products.map((product) => ({
          id: product.id || 'N/A',
          name: product.productName || 'Unknown Product',
          category: product.measurement || 'Uncategorized',
          stock: product.availableStock || 0,
          unit: product.measurement || 'unit',
          status: product.availableStock > 20 ? 'In Stock' : 
                  product.availableStock > 0 ? 'Low Stock' : 'Out of Stock',
          location: product.location || 'Unknown Location',
          pricePerUnit: product.pricePerUnit || 0,
          createdAt: product.createdAt || new Date().toISOString(),
          returnAccepted: product.returnAccepted || 'No',
          transportAvailability: product.transportAvailability || 'No',
          // Add raw API fields for direct access
          productName: product.productName,
          pricePerUnit: product.pricePerUnit,
          availableStock: product.availableStock,
          transportAvailability: product.transportAvailability,
          returnAccepted: product.returnAccepted,
        }));
        
        setInventory(inventoryData);
      } catch (error) {
        console.error('Error loading inventory:', error);
        setInventory([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInventory();
  }, []);

  const columns = [
    { accessor: 'id', header: 'Product ID' },
    { 
      accessor: 'productName', 
      header: 'Product Name',
      cell: (row) => row.productName || 'Unknown Product'
    },
    { 
      accessor: 'measurement', 
      header: 'Category',
      cell: (row) => row.category || 'Uncategorized'
    },
    { 
      accessor: 'location', 
      header: 'Location',
      cell: (row) => row.location || 'N/A'
    },
    {
      accessor: 'pricePerUnit',
      header: 'Price/Unit',
      cell: (row) => `LKR ${row.pricePerUnit || 0}`
    },
    { 
      accessor: 'availableStock', 
      header: 'Stock',
      cell: (row) => `${row.availableStock || 0} ${row.unit || 'unit'}`
    },
    { 
      accessor: 'status', 
      header: 'Status',
      cell: (row) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.status === 'In Stock' ? 'bg-green-100 text-green-800' :
          row.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      accessor: 'transportAvailability',
      header: 'Transport',
      cell: (row) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.transportAvailability === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {row.transportAvailability || 'No'}
        </span>
      )
    },
    {
      accessor: 'returnAccepted',
      header: 'Returns',
      cell: (row) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.returnAccepted === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {row.returnAccepted || 'No'}
        </span>
      )
    },
  ];

  return (
    <DashboardLayout
      title="Product Inventory"
      breadcrumbs="Products / Inventory"
      userRole="admin"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Total Products"
          value={inventory.length.toString()}
          subtitle="Inventory items"
          icon={<InventoryIcon />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard 
          title="Low Stock Items"
          value={inventory.filter(item => item.status === 'Low Stock').length.toString()}
          subtitle="Need attention"
          icon={<InventoryIcon />}
          color="yellow"
          isLoading={isLoading}
        />
        <StatCard 
          title="Out of Stock"
          value={inventory.filter(item => item.status === 'Out of Stock').length.toString()}
          subtitle="Requires restocking"
          icon={<InventoryIcon />}
          color="red"
          isLoading={isLoading}
        />
      </div>
      <Card title="Inventory List" color="yellow" icon={<InventoryIcon />} noPadding>
        <Table
          isLoading={isLoading}
          columns={columns}
          data={inventory}
          emptyMessage="No inventory found."
        />
      </Card>
    </DashboardLayout>
  );
};

export default ProductInventory; 