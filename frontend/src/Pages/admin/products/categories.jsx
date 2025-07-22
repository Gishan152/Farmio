import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import StatCard from '../../../components/ui/StatCard';

const CategoriesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const ProductCategories = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // Mock categories data
  const mockCategories = [
    { id: 'C1', name: 'Vegetables', description: 'Fresh and organic vegetables.' },
    { id: 'C2', name: 'Fruits', description: 'Seasonal and tropical fruits.' },
    { id: 'C3', name: 'Dairy & Eggs', description: 'Milk, cheese, eggs, and more.' },
    { id: 'C4', name: 'Meat', description: 'Locally sourced meat products.' },
    { id: 'C5', name: 'Specialty', description: 'Honey, spices, and unique items.' },
  ];

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setCategories(mockCategories);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const columns = [
    { accessor: 'id', header: 'ID' },
    { accessor: 'name', header: 'Category Name' },
    { accessor: 'description', header: 'Description' },
  ];

  return (
    <DashboardLayout
      title="Product Categories"
      breadcrumbs="Products / Categories"
      userRole="admin"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Total Categories"
          value={categories.length.toString()}
          subtitle="Product categories"
          icon={<CategoriesIcon />}
          color="blue"
          isLoading={isLoading}
        />
      </div>
      <Card title="Categories List" color="blue" icon={<CategoriesIcon />} noPadding>
        <Table
          isLoading={isLoading}
          columns={columns}
          data={categories}
          emptyMessage="No categories found."
        />
      </Card>
    </DashboardLayout>
  );
};

export default ProductCategories; 