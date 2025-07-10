import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import StatCard from '../../../components/ui/StatCard';

// Icons
const ReviewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

// Sri Lankan product reviews data
const productSubmissions = [
  { 
    id: 'PR001', 
    name: 'Organic Vanilla', 
    category: 'Spices',
    farmer: 'Matale Organic Farms',
    description: 'Premium Ceylon vanilla pods grown using traditional organic methods',
    price: 'Rs. 3,200/50g',
    submittedOn: '2025-06-18',
    priority: 'High',
    status: 'Pending Review'
  },
  { 
    id: 'PR002', 
    name: 'Wood Apple Jam', 
    category: 'Preserves',
    farmer: 'Anuradhapura Traditional Foods',
    description: 'Handcrafted wood apple jam made with traditional Sri Lankan recipes',
    price: 'Rs. 450/jar',
    submittedOn: '2025-06-19',
    priority: 'Medium',
    status: 'Pending Review'
  },
  {
    id: 'PR003',
    name: 'Ceylon Green Tea',
    category: 'Tea',
    farmer: 'Ella Tea Estate',
    description: 'Finest green tea from the high-elevation tea gardens of Ella',
    price: 'Rs. 750/100g',
    submittedOn: '2025-06-20',
    priority: 'Medium',
    status: 'Pending Review'
  },
  {
    id: 'PR004',
    name: 'Fresh Cloves',
    category: 'Spices',
    farmer: 'Galle Spice Garden',
    description: 'Aromatic cloves harvested from the southern coastal plantations',
    price: 'Rs. 2,800/kg',
    submittedOn: '2025-06-17',
    priority: 'Low',
    status: 'Pending Review'
  },
  { 
    id: 'PR005', 
    name: 'Organic Rice Flour', 
    category: 'Grains',
    farmer: 'Polonnaruwa Heritage Mills',
    description: 'Traditional stone-ground organic rice flour from ancient rice varieties',
    price: 'Rs. 180/kg',
    submittedOn: '2025-06-20',
    priority: 'Low',
    status: 'Pending Review'
  },
  { 
    id: 'PR006', 
    name: 'Organic Mangoes', 
    category: 'Fruits',
    farmer: 'Buttala Mango Orchard',
    description: 'Sweet, ripe mangoes from the dry zone, organically grown',
    price: 'Rs. 180/unit',
    submittedOn: '2025-06-17',
    priority: 'High',
    status: 'Pending Review'
  },
  { 
    id: 'PR007', 
    name: 'Kithul Jaggery', 
    category: 'Sweeteners',
    farmer: 'Sinharaja Forest Edge',
    description: 'Traditional Sri Lankan kithul jaggery made from pure kithul tree sap',
    price: 'Rs. 650/block',
    submittedOn: '2025-06-16',
    priority: 'Medium',
    status: 'Under Quality Review'
  },
  { 
    id: 'PR008', 
    name: 'Free-Range Chicken', 
    category: 'Poultry',
    farmer: 'Kaduwela Poultry Farm',
    description: 'Traditional village-raised free-range chickens, no antibiotics or hormones',
    price: 'Rs. 850/kg',
    submittedOn: '2025-06-18',
    priority: 'High',
    status: 'Pending Documentation'
  },
  { 
    id: 'PR009', 
    name: 'Bitter Gourd', 
    category: 'Vegetables',
    farmer: 'Dambulla Fresh Farms',
    description: 'Organically grown bitter gourd from the central province',
    price: 'Rs. 220/kg',
    submittedOn: '2025-06-20',
    priority: 'Medium',
    status: 'Pending Review'
  },
  { 
    id: 'PR010', 
    name: 'Buffalo Curd & Treacle Set', 
    category: 'Dairy',
    farmer: 'Tissamaharama Dairy',
    description: 'Traditional buffalo curd in clay pot with pure kithul treacle',
    price: 'Rs. 580/set',
    submittedOn: '2025-06-19',
    priority: 'Low',
    status: 'Pending Review'
  },
];

const ProductReviewPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSubmissions, setFilteredSubmissions] = useState(productSubmissions);
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Get unique priorities and statuses
  const priorities = ['All', ...new Set(productSubmissions.map(item => item.priority))];
  const statuses = ['All', ...new Set(productSubmissions.map(item => item.status))];

  // Filter submissions based on search query, priority, and status
  useEffect(() => {
    let result = productSubmissions;
    
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(submission => 
        submission.name.toLowerCase().includes(lowerCaseQuery) || 
        submission.id.toLowerCase().includes(lowerCaseQuery) ||
        submission.farmer.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    if (selectedPriority !== 'All') {
      result = result.filter(submission => submission.priority === selectedPriority);
    }

    if (selectedStatus !== 'All') {
      result = result.filter(submission => submission.status === selectedStatus);
    }
    
    setFilteredSubmissions(result);
  }, [searchQuery, selectedPriority, selectedStatus]);

  // Priority badge component
  const PriorityBadge = ({ priority }) => {
    const priorityStyles = {
      'High': 'bg-pastel-red text-red-800',
      'Medium': 'bg-pastel-yellow text-yellow-800',
      'Low': 'bg-pastel-blue text-blue-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${priorityStyles[priority] || 'bg-gray-200 text-gray-800'}`}>
        {priority}
      </span>
    );
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      'Pending Review': 'bg-pastel-yellow text-yellow-800',
      'Under Quality Review': 'bg-pastel-blue text-blue-800',
      'Pending Documentation': 'bg-pastel-orange text-orange-800',
      'Approved': 'bg-pastel-green text-green-800',
      'Rejected': 'bg-pastel-red text-red-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status] || 'bg-gray-200 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <DashboardLayout 
      title="Product Review Submissions" 
      userRole="moderator"
      breadcrumbs="Products / Review Submissions"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Submissions"
          value={productSubmissions.length.toString()}
          subtitle="Needing review"
          icon={<ReviewIcon />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard 
          title="High Priority"
          value="3"
          subtitle="Requires immediate review"
          icon={<AlertIcon />}
          color="red"
          isLoading={isLoading}
        />
        <StatCard 
          title="Documentation Pending"
          value="1"
          subtitle="Missing documentation"
          icon={<AlertIcon />}
          color="yellow"
          isLoading={isLoading}
        />
        <StatCard 
          title="Quality Reviews"
          value="1"
          subtitle="Under quality check"
          icon={<ReviewIcon />}
          color="green"
          isLoading={isLoading}
        />
      </div>
      
      {/* Main Content */}
      <Card 
        title="Product Review Queue" 
        noPadding
        color="blue"
        icon={<ReviewIcon />}
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
                  placeholder="Search by product name, ID, or farmer"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex gap-2">
              <select
                className="bg-gray-50 border border-gray-300 text-dashboard-text-primary text-sm rounded-lg focus:ring-farmio focus:border-farmio block w-full p-2.5"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority} Priority</option>
                ))}
              </select>
              
              <select
                className="bg-gray-50 border border-gray-300 text-dashboard-text-primary text-sm rounded-lg focus:ring-farmio focus:border-farmio block w-full p-2.5"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Submissions Table */}
        <Table
          isLoading={isLoading}
          columns={[
            { header: 'ID', accessor: 'id' },
            { header: 'Product Name', accessor: 'name' },
            { header: 'Category', accessor: 'category' },
            { header: 'Farmer', accessor: 'farmer' },
            { header: 'Price', accessor: 'price' },
            { header: 'Submitted On', accessor: 'submittedOn' },
            { 
              header: 'Priority', 
              accessor: 'priority',
              cell: (row) => <PriorityBadge priority={row.priority} />
            },
            { 
              header: 'Status', 
              accessor: 'status',
              cell: (row) => <StatusBadge status={row.status} />
            },
            {
              header: 'Actions',
              accessor: 'actions',
              cell: () => (
                <div className="flex space-x-2">
                  <button className="p-1 text-blue-600 hover:text-blue-800">
                    Review
                  </button>
                  <button className="p-1 text-green-600 hover:text-green-800">
                    Approve
                  </button>
                  <button className="p-1 text-red-600 hover:text-red-800">
                    Reject
                  </button>
                </div>
              )
            }
          ]}
          data={filteredSubmissions}
        />
        
        {/* Pagination component could go here */}
        <div className="p-4 flex justify-between items-center">
          <div className="text-sm text-dashboard-text-light">
            Showing {filteredSubmissions.length} of {productSubmissions.length} submissions
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
    </DashboardLayout>
  );
};

export default ProductReviewPage;