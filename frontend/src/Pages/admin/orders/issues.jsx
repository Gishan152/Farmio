import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import StatCard from '../../../components/ui/StatCard';

// Icons
const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const PriorityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const OrdersIssues = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [expandedIssueId, setExpandedIssueId] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all');

  // Sample issues data
  const issues = [
    {
      id: 'ISS-1024',
      orderId: 'ORD-10042',
      customer: 'Green Smoothie Cafes',
      reportedBy: 'Daniel Brown',
      reportedDate: '2023-06-21',
      issueType: 'Damaged Products',
      priority: 'High',
      status: 'Open',
      description: 'Several packages of organic spinach were damaged during delivery. Water damage appears to have affected about 30% of the order.',
      images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
      assignedTo: 'Emily Watson',
      comments: [
        { 
          user: 'Emily Watson', 
          timestamp: '2023-06-21 14:25', 
          comment: 'I\'ve contacted the transport provider to investigate the cause of water damage.' 
        },
        { 
          user: 'Daniel Brown', 
          timestamp: '2023-06-21 14:50', 
          comment: 'Thank you. We need a replacement ASAP as we have menu items that require the spinach.' 
        }
      ]
    },
    {
      id: 'ISS-1023',
      orderId: 'ORD-10039',
      customer: 'Farm to Table Restaurants',
      reportedBy: 'Thomas Wright',
      reportedDate: '2023-06-19',
      issueType: 'Incomplete Order',
      priority: 'Medium',
      status: 'In Progress',
      description: 'The delivery was missing 3 kg of fresh oregano that was on the original order.',
      images: ['https://example.com/image3.jpg'],
      assignedTo: 'Michael Johnson',
      comments: [
        { 
          user: 'Michael Johnson', 
          timestamp: '2023-06-19 11:15', 
          comment: 'We\'ve confirmed this item was picked from the warehouse. Checking with the delivery team.' 
        },
        { 
          user: 'Sarah from Logistics', 
          timestamp: '2023-06-19 14:30', 
          comment: 'The missing item was found in another delivery. We will deliver it tomorrow morning.' 
        },
        { 
          user: 'Thomas Wright', 
          timestamp: '2023-06-19 15:00', 
          comment: 'Tomorrow morning works for us. Thanks for the quick resolution.' 
        }
      ]
    },
    {
      id: 'ISS-1022',
      orderId: 'ORD-10036',
      customer: 'Healthy Bites Cafe',
      reportedBy: 'Jessica Lee',
      reportedDate: '2023-06-18',
      issueType: 'Quality Issue',
      priority: 'High',
      status: 'Resolved',
      description: 'The avocados received were overripe and unusable for our menu items.',
      images: ['https://example.com/image4.jpg', 'https://example.com/image5.jpg'],
      assignedTo: 'Robert Chen',
      resolution: 'Replaced the entire order of avocados with fresh ones and offered a 15% discount on the next order.',
      comments: [
        { 
          user: 'Robert Chen', 
          timestamp: '2023-06-18 09:45', 
          comment: 'I\'ve reviewed the images and agree this is a quality control issue. We will send a replacement immediately.' 
        },
        { 
          user: 'Jessica Lee', 
          timestamp: '2023-06-18 10:30', 
          comment: 'Thank you for the quick response.' 
        },
        { 
          user: 'Robert Chen', 
          timestamp: '2023-06-18 15:20', 
          comment: 'Replacement has been delivered. We\'ve also added a 15% discount code for your next order as an apology for the inconvenience.' 
        },
        { 
          user: 'Jessica Lee', 
          timestamp: '2023-06-18 16:05', 
          comment: 'Received the replacements. Thank you for the excellent customer service!' 
        }
      ]
    },
    {
      id: 'ISS-1021',
      orderId: 'ORD-10034',
      customer: 'Sunrise Grocery Store',
      reportedBy: 'Jennifer Lee',
      reportedDate: '2023-06-17',
      issueType: 'Delivery Delay',
      priority: 'Medium',
      status: 'Resolved',
      description: 'Delivery was scheduled for 9:00 AM but arrived at 2:30 PM without any notification of the delay.',
      assignedTo: 'David Wilson',
      resolution: 'Issued a partial refund of delivery fee and implemented better communication protocols for delays.',
      comments: [
        { 
          user: 'David Wilson', 
          timestamp: '2023-06-17 15:00', 
          comment: 'I apologize for this delay. Our driver encountered vehicle issues. We should have communicated this to you.' 
        },
        { 
          user: 'Jennifer Lee', 
          timestamp: '2023-06-17 16:20', 
          comment: 'We understand issues can happen, but communication is essential for us to manage our stocking schedule.' 
        },
        { 
          user: 'David Wilson', 
          timestamp: '2023-06-17 16:45', 
          comment: 'You\'re absolutely right. We\'ve issued a partial refund for the delivery fee, and we\'re improving our notification system for such cases.' 
        }
      ]
    },
    {
      id: 'ISS-1020',
      orderId: 'ORD-10030',
      customer: 'Wholesome Foods Co-op',
      reportedBy: 'Samantha Green',
      reportedDate: '2023-06-16',
      issueType: 'Billing Discrepancy',
      priority: 'Low',
      status: 'Open',
      description: 'We were charged for premium organic strawberries, but received standard strawberries.',
      assignedTo: 'Unassigned',
      comments: []
    }
  ];

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setFilteredData(issues);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle search
  useEffect(() => {
    if (!issues) return;
    
    let results = issues.filter(issue => {
      return Object.keys(issue).some(key => 
        typeof issue[key] === 'string' && issue[key].toLowerCase().includes(searchTerm.toLowerCase())
      ) || (issue.description && issue.description.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    // Apply tab filtering
    if (selectedTab !== 'all') {
      results = results.filter(issue => issue.status.toLowerCase().replace(' ', '-') === selectedTab);
    }
    
    setFilteredData(results);
  }, [searchTerm, selectedTab, issues]);

  // Get counts for different statuses
  const getStatusCounts = () => {
    const counts = {
      all: issues.length,
      open: issues.filter(i => i.status === 'Open').length,
      'in-progress': issues.filter(i => i.status === 'In Progress').length,
      resolved: issues.filter(i => i.status === 'Resolved').length
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  // Filter options
  const filters = [
    {
      name: 'issueType',
      label: 'Issue Type',
      options: [
        { label: 'Damaged Products', value: 'Damaged Products' },
        { label: 'Incomplete Order', value: 'Incomplete Order' },
        { label: 'Quality Issue', value: 'Quality Issue' },
        { label: 'Delivery Delay', value: 'Delivery Delay' },
        { label: 'Billing Discrepancy', value: 'Billing Discrepancy' }
      ]
    },
    {
      name: 'priority',
      label: 'Priority',
      options: [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' }
      ]
    },
    {
      name: 'assignedTo',
      label: 'Assigned To',
      options: [
        { label: 'Emily Watson', value: 'Emily Watson' },
        { label: 'Michael Johnson', value: 'Michael Johnson' },
        { label: 'Robert Chen', value: 'Robert Chen' },
        { label: 'David Wilson', value: 'David Wilson' },
        { label: 'Unassigned', value: 'Unassigned' }
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
    if (!issues || Object.keys(selectedFilters).length === 0) {
      let filtered = issues;
      if (selectedTab !== 'all') {
        filtered = issues?.filter(issue => issue.status.toLowerCase().replace(' ', '-') === selectedTab);
      }
      setFilteredData(filtered);
      return;
    }
    
    let results = issues.filter(issue => {
      const statusFilter = selectedTab === 'all' || issue.status.toLowerCase().replace(' ', '-') === selectedTab;
      
      const otherFilters = Object.entries(selectedFilters).every(([key, value]) => {
        if (!value || value === 'all') return true;
        return issue[key] === value;
      });
      
      return statusFilter && otherFilters;
    });
    
    setFilteredData(results);
  }, [selectedFilters, selectedTab, issues]);

  // Issue status badge
  const IssueStatusBadge = ({ status }) => {
    const statusStyles = {
      'Open': 'bg-pastel-red text-red-800',
      'In Progress': 'bg-pastel-yellow text-yellow-800',
      'Resolved': 'bg-pastel-green text-green-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status] || 'bg-gray-200 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  // Priority badge
  const PriorityBadge = ({ priority }) => {
    const priorityStyles = {
      'High': 'bg-red-100 text-red-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-blue-100 text-blue-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${priorityStyles[priority] || 'bg-gray-200 text-gray-800'}`}>
        {priority}
      </span>
    );
  };

  // Issue Details Component
  const IssueDetails = ({ issue }) => {
    const [newComment, setNewComment] = useState('');
    
    return (
      <div className="p-4 bg-gray-50">
        <div className="mb-3 flex justify-between items-center">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Issue Details - {issue.id}</h4>
            <p className="text-xs text-gray-500">Order: {issue.orderId} | Customer: {issue.customer}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Status:</span>
            <IssueStatusBadge status={issue.status} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="col-span-1">
            <h5 className="text-xs font-medium text-gray-500 mb-2">ISSUE INFO</h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Type:</span>
                <span className="text-sm font-medium">{issue.issueType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Priority:</span>
                <PriorityBadge priority={issue.priority} />
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Reported By:</span>
                <span className="text-sm font-medium">{issue.reportedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Reported Date:</span>
                <span className="text-sm font-medium">{issue.reportedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Assigned To:</span>
                <span className="text-sm font-medium">{issue.assignedTo}</span>
              </div>
            </div>
          </div>
          
          <div className="col-span-2">
            <h5 className="text-xs font-medium text-gray-500 mb-2">DESCRIPTION</h5>
            <p className="text-sm p-3 bg-white border border-gray-200 rounded-md">
              {issue.description}
            </p>
            
            {issue.resolution && (
              <div className="mt-3">
                <h5 className="text-xs font-medium text-gray-500 mb-2">RESOLUTION</h5>
                <p className="text-sm p-3 bg-white border border-green-100 rounded-md text-green-800">
                  {issue.resolution}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <h5 className="text-xs font-medium text-gray-500 mb-2">COMMENTS</h5>
          <div className="bg-white border border-gray-200 rounded-md">
            {issue.comments && issue.comments.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {issue.comments.map((comment, idx) => (
                  <div key={idx} className="p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{comment.user}</span>
                      <span className="text-xs text-gray-500">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm">{comment.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-3 text-sm text-gray-500">No comments yet.</p>
            )}
            
            {issue.status !== 'Resolved' && (
              <div className="p-3 border-t border-gray-200">
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Add a comment..."
                  rows={2}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    className="px-3 py-1 text-sm bg-farmio text-white rounded-md hover:bg-green-600"
                    disabled={!newComment.trim()}
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {issue.status !== 'Resolved' && (
          <div className="mt-4 flex justify-end space-x-2">
            {issue.status === 'Open' && (
              <button className="px-3 py-1 text-sm text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50">
                Start Working
              </button>
            )}
            <button className="px-3 py-1 text-sm text-green-600 border border-green-200 rounded-md hover:bg-green-50">
              Mark as Resolved
            </button>
          </div>
        )}
      </div>
    );
  };

  // Table columns
  const columns = [
    { key: 'id', header: 'Issue ID' },
    { key: 'orderId', header: 'Order ID' },
    { 
      key: 'customer', 
      header: 'Customer',
      render: (value) => (
        <div className="font-medium">{value}</div>
      )
    },
    { key: 'issueType', header: 'Issue Type' },
    { 
      key: 'priority', 
      header: 'Priority',
      render: (value) => <PriorityBadge priority={value} />
    },
    {
      key: 'reportedDate',
      header: 'Reported Date'
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => <IssueStatusBadge status={value} />
    },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button 
            className={`text-blue-600 hover:text-blue-800 ${expandedIssueId === row.id ? 'text-blue-800' : ''}`}
            title={expandedIssueId === row.id ? "Hide Details" : "View Details"}
            onClick={(e) => {
              e.stopPropagation();
              setExpandedIssueId(expandedIssueId === row.id ? null : row.id);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          {row.status !== 'Resolved' && (
            <button className="text-green-600 hover:text-green-800" title="Mark as Resolved">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
          <button className="text-indigo-600 hover:text-indigo-800" title="Generate Report">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout
      title="Order Issues"
      breadcrumbs="Orders / Issues"
      userRole="admin"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Issues"
          value={statusCounts.all.toString()}
          subtitle="This month"
          icon={<WarningIcon />}
          color="red"
          isLoading={isLoading}
        />
        <StatCard 
          title="Open Issues"
          value={statusCounts.open.toString()}
          subtitle="Require attention"
          icon={<WarningIcon />}
          color="red"
          isLoading={isLoading}
        />
        <StatCard 
          title="In Progress"
          value={statusCounts['in-progress'].toString()}
          subtitle="Being addressed"
          icon={<WarningIcon />}
          color="yellow"
          isLoading={isLoading}
        />
        <StatCard 
          title="Resolved"
          value={statusCounts.resolved.toString()}
          subtitle="Completed"
          icon={<WarningIcon />}
          color="green"
          isLoading={isLoading}
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-dashboard-border mb-6">
        <button 
          onClick={() => setSelectedTab('all')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            selectedTab === 'all' 
              ? 'border-farmio text-farmio' 
              : 'border-transparent text-dashboard-text-secondary hover:text-dashboard-text-primary'
          }`}
        >
          All Issues ({statusCounts.all})
        </button>
        <button 
          onClick={() => setSelectedTab('open')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            selectedTab === 'open' 
              ? 'border-farmio text-farmio' 
              : 'border-transparent text-dashboard-text-secondary hover:text-dashboard-text-primary'
          }`}
        >
          Open ({statusCounts.open})
        </button>
        <button 
          onClick={() => setSelectedTab('in-progress')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            selectedTab === 'in-progress' 
              ? 'border-farmio text-farmio' 
              : 'border-transparent text-dashboard-text-secondary hover:text-dashboard-text-primary'
          }`}
        >
          In Progress ({statusCounts['in-progress']})
        </button>
        <button 
          onClick={() => setSelectedTab('resolved')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            selectedTab === 'resolved' 
              ? 'border-farmio text-farmio' 
              : 'border-transparent text-dashboard-text-secondary hover:text-dashboard-text-primary'
          }`}
        >
          Resolved ({statusCounts.resolved})
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search issues by ID, customer, description..."
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
          
          {/* Filter Button */}
          <button
            className="flex items-center text-sm py-2 px-4 rounded-md border border-dashboard-border hover:bg-gray-100"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
          >
            <FilterIcon />
            <span className="ml-2">Filter</span>
          </button>

          {/* Report Issue Button */}
          <button className="flex items-center text-sm py-2 px-4 rounded-md bg-red-600 text-white hover:bg-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Report Issue
          </button>
        </div>

        {/* Filter panel */}
        {showFilterPanel && (
          <div className="mt-4 p-4 bg-white border border-dashboard-border rounded-lg shadow-sm">
            <h3 className="text-sm font-medium mb-3 text-dashboard-text-primary">Filter Issues</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Issues Table */}
      <Card
        title={`${selectedTab === 'all' ? 'All Issues' : 
                selectedTab === 'in-progress' ? 'Issues In Progress' :
                selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1) + ' Issues'}`}
        color={
          selectedTab === 'open' ? 'red' : 
          selectedTab === 'in-progress' ? 'yellow' : 
          selectedTab === 'resolved' ? 'green' : 'red'
        }
        icon={<WarningIcon />}
        noPadding
      >
        <Table
          isLoading={isLoading}
          columns={columns}
          data={filteredData}
          emptyMessage="No issues found matching your criteria."
          expandedRowRender={(row) => <IssueDetails issue={row} />}
          expandedRowId={expandedIssueId}
        />
      </Card>
    </DashboardLayout>
  );
};

export default OrdersIssues;
