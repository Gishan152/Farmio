import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import StatCard from '../../../components/ui/StatCard';

const QualityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ProductQuality = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [qualityChecks, setQualityChecks] = useState([]);

  // Mock quality check data
  const mockQualityChecks = [
    { id: 'Q1', product: 'Organic Tomatoes', category: 'Vegetables', date: '2023-06-15', status: 'Passed', inspector: 'A. Silva' },
    { id: 'Q2', product: 'Beans', category: 'Vegetables', date: '2023-06-16', status: 'Passed', inspector: 'B. Perera' },
    { id: 'Q3', product: 'Local Beef', category: 'Meat', date: '2023-06-17', status: 'Attention', inspector: 'C. Fernando' },
    { id: 'Q4', product: 'Kithul Honey', category: 'Specialty', date: '2023-06-18', status: 'Passed', inspector: 'D. Weerasinghe' },
    { id: 'Q5', product: 'Organic Gotukola', category: 'Vegetables', date: '2023-06-19', status: 'Failed', inspector: 'E. Rajapaksa' },
  ];

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setQualityChecks(mockQualityChecks);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const columns = [
    { accessor: 'id', header: 'Check ID' },
    { accessor: 'product', header: 'Product' },
    { accessor: 'category', header: 'Category' },
    { accessor: 'date', header: 'Date' },
    { accessor: 'status', header: 'Status' },
    { accessor: 'inspector', header: 'Inspector' },
  ];

  return (
    <DashboardLayout
      title="Product Quality Control"
      breadcrumbs="Products / Quality Control"
      userRole="admin"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Quality Checks"
          value={qualityChecks.length.toString()}
          subtitle="Recent checks"
          icon={<QualityIcon />}
          color="green"
          isLoading={isLoading}
        />
      </div>
      <Card title="Quality Control List" color="green" icon={<QualityIcon />} noPadding>
        <Table
          isLoading={isLoading}
          columns={columns}
          data={qualityChecks}
          emptyMessage="No quality checks found."
        />
      </Card>
    </DashboardLayout>
  );
};

export default ProductQuality; 