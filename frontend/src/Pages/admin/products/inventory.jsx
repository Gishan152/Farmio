import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import StatCard from '../../../components/ui/StatCard';

const InventoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
  </svg>
);

const ProductInventory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [inventory, setInventory] = useState([]);

  // Mock inventory data
  const mockInventory = [
    { id: 'P1001', name: 'Organic Tomatoes', category: 'Vegetables', stock: 120, unit: 'kg', status: 'In Stock' },
    { id: 'P1002', name: 'Beans', category: 'Vegetables', stock: 80, unit: 'kg', status: 'In Stock' },
    { id: 'P1003', name: 'Local Beef', category: 'Meat', stock: 45, unit: 'kg', status: 'Low Stock' },
    { id: 'P1004', name: 'Kithul Honey', category: 'Specialty', stock: 30, unit: 'bottle', status: 'Low Stock' },
    { id: 'P1005', name: 'Organic Gotukola', category: 'Vegetables', stock: 0, unit: 'bundle', status: 'Out of Stock' },
  ];

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setInventory(mockInventory);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const columns = [
    { accessor: 'id', header: 'Product ID' },
    { accessor: 'name', header: 'Product Name' },
    { accessor: 'category', header: 'Category' },
    { accessor: 'stock', header: 'Stock' },
    { accessor: 'unit', header: 'Unit' },
    { accessor: 'status', header: 'Status' },
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
          color="yellow"
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