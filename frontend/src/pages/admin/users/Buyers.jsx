import React from 'react';
import UserManagement from '../../../components/templates/UserManagement';

// Buyer icon
const BuyerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const BuyerManagement = () => {
  // Sample buyer data for demonstration
  const buyers = [
    {
      id: 1,
      name: "Fresh Foods Market",
      contactPerson: "Emily Clark",
      email: "orders@freshfoods.com",
      phone: "(555) 222-3333",
      location: "Urban City",
      type: "Retailer",
      purchaseVolume: "High",
      preferredProducts: "Organic Vegetables",
      status: "Active",
      joinDate: "2022-09-15",
      lastPurchase: "2023-06-05"
    },
    {
      id: 2,
      name: "Farm to Table Restaurants",
      contactPerson: "Thomas Wright",
      email: "purchasing@farmtotable.com",
      phone: "(555) 444-5555",
      location: "Metro Area",
      type: "Restaurant Chain",
      purchaseVolume: "Medium",
      preferredProducts: "Premium Fruits, Herbs",
      status: "Active",
      joinDate: "2023-02-20",
      lastPurchase: "2023-06-08"
    },
    {
      id: 3,
      name: "Wholesome Foods Co-op",
      contactPerson: "Samantha Green",
      email: "sam@wholesomecoop.org",
      phone: "(555) 666-7777",
      location: "Suburban District",
      type: "Cooperative",
      purchaseVolume: "Medium",
      preferredProducts: "Mixed Produce",
      status: "Active",
      joinDate: "2022-07-11",
      lastPurchase: "2023-06-02"
    },
    {
      id: 4,
      name: "Green Smoothie Cafes",
      contactPerson: "Daniel Brown",
      email: "supplies@greensmoothie.com",
      phone: "(555) 888-9999",
      location: "Multiple Locations",
      type: "Cafe Chain",
      purchaseVolume: "Low",
      preferredProducts: "Leafy Greens, Fruits",
      status: "Inactive",
      joinDate: "2022-11-05",
      lastPurchase: "2023-03-15"
    },
    {
      id: 5,
      name: "Sunrise Grocery Store",
      contactPerson: "Jennifer Lee",
      email: "jennifer@sunrisegrocery.com",
      phone: "(555) 111-2222",
      location: "East Village",
      type: "Grocery Store",
      purchaseVolume: "High",
      preferredProducts: "Full Range",
      status: "Active",
      joinDate: "2022-05-30",
      lastPurchase: "2023-06-09"
    }
  ];

  // Table columns
  const columns = [
    { key: 'name', header: 'Business Name' },
    { key: 'contactPerson', header: 'Contact Person' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'location', header: 'Location' },
    { key: 'type', header: 'Business Type' },
    { key: 'purchaseVolume', header: 'Volume' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => (
        <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
          value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'lastPurchase', header: 'Last Purchase' },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-800">
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

  // Filter options
  const filters = [
    {
      name: 'status',
      label: 'Status',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
      ]
    },
    {
      name: 'type',
      label: 'Business Type',
      options: [
        { label: 'Retailer', value: 'Retailer' },
        { label: 'Restaurant Chain', value: 'Restaurant Chain' },
        { label: 'Cooperative', value: 'Cooperative' },
        { label: 'Cafe Chain', value: 'Cafe Chain' },
        { label: 'Grocery Store', value: 'Grocery Store' }
      ]
    },
    {
      name: 'purchaseVolume',
      label: 'Purchase Volume',
      options: [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' }
      ]
    }
  ];

  return (
    <UserManagement
      userType="Buyers"
      userTypePath="buyers"
      userIcon={<BuyerIcon />}
      columns={columns}
      userData={buyers}
      filters={filters}
    />
  );
};

export default BuyerManagement;
