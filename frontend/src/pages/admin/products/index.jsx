import React, { useState, useEffect } from 'react';
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
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewType, setViewType] = useState('grid'); // 'grid' or 'table'

  // Sample product data
  const products = [
    {
      id: 'P1001',
      name: 'Organic Tomatoes',
      category: 'Vegetables',
      farmer: 'John Smith',
      price: '$2.99/lb',
      stock: 120,
      unit: 'lb',
      stockStatus: 'In Stock',
      certifications: 'Organic',
      rating: 4.5,
      lastUpdated: '2023-06-15',
      image: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
      description: 'Fresh organic tomatoes grown using sustainable farming practices. These vibrant red tomatoes are perfect for salads, sandwiches, or cooking.',
      harvested: '2023-06-10',
      lifespan: '7-10 days',
      storageConditions: 'Store at room temperature away from direct sunlight. Refrigerate after ripening.'
    },
    {
      id: 'P1002',
      name: 'Fresh Farm Eggs',
      category: 'Dairy & Eggs',
      farmer: 'Maria Rodriguez',
      price: '$5.49/dozen',
      stock: 80,
      unit: 'dozen',
      stockStatus: 'In Stock',
      certifications: 'Free Range, Organic',
      rating: 4.8,
      lastUpdated: '2023-06-18',
      image: 'https://images.unsplash.com/photo-1598965402089-897ce52e8355?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
      description: 'Free-range eggs from our happy, healthy chickens. Each egg is collected daily and inspected for quality. Rich in nutrients with golden yolks.',
      harvested: '2023-06-17',
      lifespan: '3-4 weeks',
      storageConditions: 'Refrigerate immediately. Keep in original carton to protect from odors and maintain humidity.'
    },
    {
      id: 'P1003',
      name: 'Grass-Fed Beef',
      category: 'Meat',
      farmer: 'Robert Johnson',
      price: '$9.99/lb',
      stock: 45,
      unit: 'lb',
      stockStatus: 'Low Stock',
      certifications: 'Pasture-Raised',
      rating: 4.6,
      lastUpdated: '2023-06-14',
      image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
      description: 'Premium cuts of grass-fed beef from cattle raised on open pastures. No hormones or antibiotics. Our beef is aged for tenderness and rich flavor.',
      harvested: '2023-06-05',
      lifespan: 'Use within 3-5 days or freeze for up to 6 months',
      storageConditions: 'Keep refrigerated at 40°F or below. Freeze for longer storage.'
    },
    {
      id: 'P1004',
      name: 'Artisanal Honey',
      category: 'Specialty',
      farmer: 'Sarah Williams',
      price: '$12.99/jar',
      stock: 30,
      unit: 'jar',
      stockStatus: 'Low Stock',
      certifications: 'Raw, Unfiltered',
      rating: 4.9,
      lastUpdated: '2023-06-10',
      image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
      description: 'Raw, unfiltered honey harvested from our local apiaries. This golden honey has a rich floral flavor from wildflowers and clover.',
      harvested: '2023-05-20',
      lifespan: '2+ years',
      storageConditions: 'Store at room temperature. Crystallization is natural and can be reversed by gentle warming.'
    },
    {
      id: 'P1005',
      name: 'Organic Baby Spinach',
      category: 'Vegetables',
      farmer: 'Michael Chen',
      price: '$3.99/bag',
      stock: 0,
      unit: 'bag',
      stockStatus: 'Out of Stock',
      certifications: 'Organic',
      rating: 4.3,
      lastUpdated: '2023-05-30',
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
      description: 'Tender organic baby spinach leaves, perfect for salads, smoothies, or cooking. Rich in iron and vitamins.',
      harvested: '2023-05-25',
      lifespan: '5-7 days',
      storageConditions: 'Refrigerate immediately. Keep in crisper drawer.'
    },
    {
      id: 'P1006',
      name: 'Fresh Milk',
      category: 'Dairy & Eggs',
      farmer: 'Emma Davis',
      price: '$4.49/gallon',
      stock: 65,
      unit: 'gallon',
      stockStatus: 'In Stock',
      certifications: 'Hormone-Free',
      rating: 4.7,
      lastUpdated: '2023-06-19',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
      description: 'Fresh whole milk from our hormone-free dairy cows. Pasteurized but not homogenized for a rich, creamy texture.',
      harvested: '2023-06-18',
      lifespan: '7-10 days',
      storageConditions: 'Keep refrigerated at 40°F or below. Store in the back of the refrigerator, not the door.'
    },
    {
      id: 'P1007',
      name: 'Heirloom Carrots',
      category: 'Vegetables',
      farmer: 'John Smith',
      price: '$3.49/bunch',
      stock: 90,
      unit: 'bunch',
      stockStatus: 'In Stock',
      certifications: 'Organic',
      rating: 4.2,
      lastUpdated: '2023-06-17',
      image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
      description: 'Colorful mix of heirloom carrot varieties including purple, yellow, white, and orange. Sweet flavor and crisp texture.',
      harvested: '2023-06-15',
      lifespan: '2-3 weeks',
      storageConditions: 'Refrigerate in a plastic bag in the crisper drawer. Remove tops if attached to extend freshness.'
    },
    {
      id: 'P1008',
      name: 'Organic Apples',
      category: 'Fruits',
      farmer: 'Sarah Williams',
      price: '$1.99/lb',
      stock: 15,
      unit: 'lb',
      stockStatus: 'Low Stock',
      certifications: 'Organic',
      rating: 4.4,
      lastUpdated: '2023-06-12',
      image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
      description: 'Crisp and juicy organic apples grown in our pesticide-free orchards. Perfect balance of sweet and tart flavors.',
      harvested: '2023-06-08',
      lifespan: '1-2 months',
      storageConditions: 'Store in the refrigerator crisper drawer. Keep away from strong-smelling foods as apples absorb odors.'
    }
  ];

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setFilteredData(products);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle search
  useEffect(() => {
    if (!products) return;
    
    const results = products.filter(product => {
      return Object.keys(product).some(key => 
        product[key].toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    
    setFilteredData(results);
  }, [searchTerm, products]);

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
        { label: 'John Smith', value: 'John Smith' },
        { label: 'Maria Rodriguez', value: 'Maria Rodriguez' },
        { label: 'Robert Johnson', value: 'Robert Johnson' },
        { label: 'Sarah Williams', value: 'Sarah Williams' },
        { label: 'Michael Chen', value: 'Michael Chen' },
        { label: 'Emma Davis', value: 'Emma Davis' }
      ]
    },
    {
      name: 'lastUpdated',
      label: 'Listed Date',
      options: [
        { label: 'Last 7 days', value: '7days' },
        { label: 'Last 14 days', value: '14days' },
        { label: 'Last 30 days', value: '30days' },
        { label: 'All time', value: 'all' }
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

  // Apply filters
  useEffect(() => {
    if (!products || Object.keys(selectedFilters).length === 0) {
      setFilteredData(products);
      return;
    }
    
    const results = products.filter(product => {
      return Object.entries(selectedFilters).every(([key, value]) => {
        if (!value || value === 'all') return true;
        
        // Special handling for date ranges
        if (key === 'lastUpdated') {
          const productDate = new Date(product.lastUpdated);
          const today = new Date();
          
          switch(value) {
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
        
        return product[key].includes(value);
      });
    });
    
    setFilteredData(results);
  }, [selectedFilters, products]);

  // Handle view product details
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setShowViewModal(false);
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
    { accessor: 'id', header: 'ID' },
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
    { accessor: 'price', header: 'Price' },
    { 
      accessor: 'stockStatus', 
      header: 'Stock',
      cell: (row) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.stockStatus === 'In Stock' ? 'bg-green-100 text-green-800' : 
          row.stockStatus === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-red-100 text-red-800'
        }`}>
          {row.stockStatus} {row.stockStatus !== 'Out of Stock' && `(${row.stock} ${row.unit})`}
        </span>
      )
    },
    { accessor: 'certifications', header: 'Certifications' },
    { 
      accessor: 'rating', 
      header: 'Rating',
      cell: (row) => (
        <div className="flex items-center">
          <span>{row.rating}</span>
          <div className="ml-2 flex">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 ${i < Math.floor(row.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      )
    },
    { accessor: 'lastUpdated', header: 'Last Updated' },
    { 
      accessor: 'actions', 
      header: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-800" onClick={() => handleViewProduct(row)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button className="text-green-600 hover:text-green-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button className="text-red-600 hover:text-red-800">
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
    return (
      <div className="bg-white rounded-lg border border-dashboard-border shadow-card hover:shadow-card-hover transition-all">
        <div className="relative h-40 overflow-hidden rounded-t-lg">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full ${
            product.stockStatus === 'In Stock' ? 'bg-green-100 text-green-800' : 
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
            <p>Farmer: {product.farmer}</p>
            <div className="flex items-center mt-1">
              <StarRating rating={product.rating} />
            </div>
          </div>
          <div className="flex items-center text-xs text-dashboard-text-light mb-3">
            <CalendarIcon />
            <span className="ml-1">Listed: {product.lastUpdated}</span>
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
              <button className="text-green-600 hover:text-green-800 p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button className="text-red-600 hover:text-red-800 p-1">
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
          value={products.length.toString()}
          subtitle="Across all categories"
          icon={<ProductsIcon />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard 
          title="Low Stock Items"
          value={products.filter(p => p.stockStatus === 'Low Stock').length.toString()}
          subtitle="Need attention"
          icon={<WarningIcon />}
          color="yellow"
          isLoading={isLoading}
        />
        <StatCard 
          title="Out of Stock Items"
          value={products.filter(p => p.stockStatus === 'Out of Stock').length.toString()}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden">
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
                    />
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-medium text-dashboard-text-primary">{selectedProduct.name}</h2>
                      <span className="text-lg font-medium text-farmio">{selectedProduct.price}</span>
                    </div>
                    <p className="text-sm text-dashboard-text-secondary mt-1">{selectedProduct.category}</p>
                    <div className="flex items-center mt-2">
                      <StarRating rating={selectedProduct.rating} />
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className={`px-3 py-1.5 text-sm rounded-full ${
                      selectedProduct.stockStatus === 'In Stock' ? 'bg-green-100 text-green-800' : 
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
                      <h4 className="text-sm font-medium text-dashboard-text-primary mb-1">Listed Date</h4>
                      <p className="text-dashboard-text-secondary">{selectedProduct.lastUpdated}</p>
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
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mr-2"
              >
                Edit
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ProductsManagement;
