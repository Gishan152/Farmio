import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import StatCard from '../../../components/ui/StatCard';

// Icons
const SupportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
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

const MessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);

// Dummy data for support tickets
const supportTickets = [
  { 
    id: 'TKT-001', 
    subject: 'Order Delivery Delay Issue',
    description: 'I ordered produce 5 days ago and it hasn\'t arrived yet. The tracking hasn\'t updated in 48 hours.',
    customer: {
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      type: 'Buyer',
    },
    createdAt: '2025-06-19 10:20 AM',
    priority: 'High',
    status: 'Open',
    assignedTo: 'Unassigned',
    category: 'Delivery Issue'
  },
  { 
    id: 'TKT-002', 
    subject: 'Product Quality Concern',
    description: 'The vegetables I received were not as fresh as expected. Some items were already starting to wilt.',
    customer: {
      name: 'Michael Smith',
      email: 'michael.s@email.com',
      type: 'Buyer',
    },
    createdAt: '2025-06-20 09:15 AM',
    priority: 'Medium',
    status: 'In Progress',
    assignedTo: 'Maria Rodriguez',
    category: 'Product Quality'
  },
  { 
    id: 'TKT-003', 
    subject: 'Payment Not Reflected',
    description: 'I made a payment for my order but it still shows as pending in the system.',
    customer: {
      name: 'Sarah Wilson',
      email: 'sarah.w@email.com',
      type: 'Buyer',
    },
    createdAt: '2025-06-20 11:30 AM',
    priority: 'High',
    status: 'Open',
    assignedTo: 'Unassigned',
    category: 'Payment Issue'
  },
  { 
    id: 'TKT-004', 
    subject: 'Unable to Update Inventory',
    description: 'I\'m trying to update my farm inventory but keep getting an error message about invalid quantities.',
    customer: {
      name: 'John Adams',
      email: 'john.a@greenfarm.com',
      type: 'Farmer',
    },
    createdAt: '2025-06-20 02:45 PM',
    priority: 'Medium',
    status: 'In Progress',
    assignedTo: 'James Wilson',
    category: 'Technical Issue'
  },
  { 
    id: 'TKT-005', 
    subject: 'Need to Change Delivery Address',
    description: 'I need to update the delivery address for my upcoming order scheduled for tomorrow.',
    customer: {
      name: 'Lisa Garcia',
      email: 'lisa.g@email.com',
      type: 'Buyer',
    },
    createdAt: '2025-06-21 09:00 AM',
    priority: 'High',
    status: 'Open',
    assignedTo: 'Unassigned',
    category: 'Order Change'
  },
  { 
    id: 'TKT-006', 
    subject: 'Warehouse Access Problem',
    description: 'My access card is not working at the warehouse gate. Need urgent assistance.',
    customer: {
      name: 'Robert Green',
      email: 'robert.g@storagesol.com',
      type: 'Warehouse Owner',
    },
    createdAt: '2025-06-18 04:30 PM',
    priority: 'Medium',
    status: 'In Progress',
    assignedTo: 'Emily Chang',
    category: 'Access Issue'
  },
  { 
    id: 'TKT-007', 
    subject: 'Refund Request for Damaged Items',
    description: 'Several items in my order were damaged during delivery. Requesting a refund for these items.',
    customer: {
      name: 'David Johnson',
      email: 'david.j@email.com',
      type: 'Buyer',
    },
    createdAt: '2025-06-19 03:20 PM',
    priority: 'Medium',
    status: 'Resolved',
    assignedTo: 'Maria Rodriguez',
    category: 'Refund Request'
  },
  { 
    id: 'TKT-008', 
    subject: 'Transport Schedule Mix-up',
    description: 'I was scheduled to pick up produce at 9am but the warehouse staff says it\'s scheduled for tomorrow.',
    customer: {
      name: 'Thomas Wilson',
      email: 'thomas.w@fasttransport.com',
      type: 'Transport Provider',
    },
    createdAt: '2025-06-21 08:10 AM',
    priority: 'High',
    status: 'Open',
    assignedTo: 'Unassigned',
    category: 'Scheduling Issue'
  },
];

// Message history for a sample conversation
const sampleMessages = [
  {
    id: 1,
    sender: 'Emma Davis',
    senderType: 'Customer',
    message: 'I ordered produce 5 days ago and it hasn\'t arrived yet. The tracking hasn\'t updated in 48 hours. Can you please help me locate my order?',
    time: '2025-06-19 10:20 AM'
  },
  {
    id: 2,
    sender: 'System',
    senderType: 'System',
    message: 'Ticket created. Waiting for moderator assignment.',
    time: '2025-06-19 10:20 AM'
  },
  {
    id: 3,
    sender: 'James Wilson',
    senderType: 'Moderator',
    message: 'Hello Emma, I\'m reviewing your order now. Could you please provide your order number so I can look into this for you?',
    time: '2025-06-19 10:45 AM'
  },
  {
    id: 4,
    sender: 'Emma Davis',
    senderType: 'Customer',
    message: 'Thank you for the quick response. My order number is ORD-2025-001.',
    time: '2025-06-19 11:02 AM'
  },
  {
    id: 5,
    sender: 'James Wilson',
    senderType: 'Moderator',
    message: 'I\'ve located your order. It appears there was a delay at the distribution center. I\'ve contacted the shipping department and they\'ve informed me your order is out for delivery today. You should receive it by 5 PM. I\'ll also make sure the tracking is updated. Please let me know if you don\'t receive it by end of day.',
    time: '2025-06-19 11:20 AM'
  },
  {
    id: 6,
    sender: 'Emma Davis',
    senderType: 'Customer',
    message: 'That\'s a relief! Thank you for your help. I\'ll wait for the delivery today.',
    time: '2025-06-19 11:25 AM'
  }
];

const UserSupportPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTickets, setFilteredTickets] = useState(supportTickets);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Get unique categories and statuses
  const categories = ['All', ...new Set(supportTickets.map(ticket => ticket.category))];
  const statuses = ['All', ...new Set(supportTickets.map(ticket => ticket.status))];

  // Filter tickets based on search query, status and category
  useEffect(() => {
    let result = supportTickets;
    
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(ticket => 
        ticket.id.toLowerCase().includes(lowerCaseQuery) || 
        ticket.subject.toLowerCase().includes(lowerCaseQuery) ||
        ticket.customer.name.toLowerCase().includes(lowerCaseQuery) ||
        ticket.customer.email.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    if (selectedStatus !== 'All') {
      result = result.filter(ticket => ticket.status === selectedStatus);
    }

    if (selectedCategory !== 'All') {
      result = result.filter(ticket => ticket.category === selectedCategory);
    }
    
    setFilteredTickets(result);
  }, [searchQuery, selectedStatus, selectedCategory]);

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
      'Open': 'bg-pastel-red text-red-800',
      'In Progress': 'bg-pastel-yellow text-yellow-800',
      'Resolved': 'bg-pastel-green text-green-800',
      'Closed': 'bg-pastel-gray text-gray-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status] || 'bg-gray-200 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  // Handle view ticket details
  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketDetails(true);
  };

  // Handle reply submission
  const handleReply = (e) => {
    e.preventDefault();
    console.log('Reply submitted:', replyMessage);
    // Here you would typically send the message and update the state
    setReplyMessage('');
    // For now, let's just log it
  };

  return (
    <DashboardLayout 
      title="User Support" 
      userRole="moderator"
      breadcrumbs="Support / Tickets"
    >
      {!showTicketDetails ? (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard 
              title="Open Tickets"
              value={supportTickets.filter(t => t.status === 'Open').length.toString()}
              subtitle="Need attention"
              icon={<AlertIcon />}
              color="red"
              isLoading={isLoading}
            />
            <StatCard 
              title="In Progress"
              value={supportTickets.filter(t => t.status === 'In Progress').length.toString()}
              subtitle="Being handled"
              icon={<SupportIcon />}
              color="yellow"
              isLoading={isLoading}
            />
            <StatCard 
              title="Resolved Today"
              value="3"
              subtitle="Successfully resolved"
              icon={<SupportIcon />}
              color="green"
              isLoading={isLoading}
            />
            <StatCard 
              title="Avg Response Time"
              value="25m"
              subtitle="Time to first response"
              icon={<MessageIcon />}
              color="blue"
              isLoading={isLoading}
            />
          </div>
          
          {/* Main Content */}
          <Card 
            title="Support Tickets" 
            noPadding
            color="blue"
            icon={<SupportIcon />}
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
                      placeholder="Search by ticket ID, subject, or customer"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Filters */}
                <div className="flex gap-2">
                  <select
                    className="bg-gray-50 border border-gray-300 text-dashboard-text-primary text-sm rounded-lg focus:ring-farmio focus:border-farmio block w-full p-2.5"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  
                  <select
                    className="bg-gray-50 border border-gray-300 text-dashboard-text-primary text-sm rounded-lg focus:ring-farmio focus:border-farmio block w-full p-2.5"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Tickets Table */}
            <Table
              isLoading={isLoading}
              columns={[
                { header: 'Ticket ID', accessor: 'id' },
                { header: 'Subject', accessor: 'subject' },
                { header: 'Customer', accessor: 'customer.name' },
                { header: 'Customer Type', accessor: 'customer.type' },
                { header: 'Created', accessor: 'createdAt' },
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
                  cell: (row) => (
                    <div className="flex space-x-2">
                      <button 
                        className="p-1 text-blue-600 hover:text-blue-800"
                        onClick={() => handleViewTicket(row)}
                      >
                        View
                      </button>
                      <button className="p-1 text-green-600 hover:text-green-800">
                        Assign
                      </button>
                    </div>
                  )
                }
              ]}
              data={filteredTickets}
              onRowClick={(row) => handleViewTicket(row)}
            />
            
            {/* Pagination */}
            <div className="p-4 flex justify-between items-center">
              <div className="text-sm text-dashboard-text-light">
                Showing {filteredTickets.length} of {supportTickets.length} tickets
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
        </>
      ) : (
        <>
          {/* Ticket Details View */}
          <div className="mb-4 flex justify-between items-center">
            <button
              onClick={() => setShowTicketDetails(false)}
              className="flex items-center text-farmio hover:text-farmio-dark"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Tickets
            </button>
            
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-lg hover:bg-yellow-200">
                Update Status
              </button>
              <button className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200">
                Assign Ticket
              </button>
              <button className="px-4 py-2 bg-gray-100 text-dashboard-text-primary text-sm font-medium rounded-lg hover:bg-gray-200">
                Export Details
              </button>
            </div>
          </div>
          
          {/* Ticket Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Conversation */}
            <div className="lg:col-span-2">
              <Card 
                title={`Ticket #${selectedTicket?.id} - ${selectedTicket?.subject}`} 
                color="blue"
                icon={<MessageIcon />}
                noPadding
              >
                {/* Message Thread */}
                <div className="p-4 h-[400px] overflow-y-auto border-b border-dashboard-border">
                  <div className="space-y-4">
                    {sampleMessages.map(message => (
                      <div 
                        key={message.id}
                        className={`flex ${message.senderType === 'Moderator' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.senderType === 'Moderator' 
                              ? 'bg-pastel-green text-green-800'
                              : message.senderType === 'System'
                                ? 'bg-gray-100 text-gray-600 italic text-sm'
                                : 'bg-pastel-blue text-blue-800'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-sm">{message.sender}</span>
                            <span className="text-xs opacity-70">{message.time.split(' ')[1]}</span>
                          </div>
                          <p className="text-sm">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Reply Box */}
                <div className="p-4">
                  <form onSubmit={handleReply}>
                    <div className="mb-3">
                      <textarea 
                        className="bg-gray-50 border border-gray-300 text-dashboard-text-primary text-sm rounded-lg focus:ring-farmio focus:border-farmio block w-full p-2.5 min-h-[100px]"
                        placeholder="Type your reply here..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <button type="button" className="p-2 text-dashboard-text-secondary hover:bg-gray-100 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                        </button>
                        <button type="button" className="p-2 text-dashboard-text-secondary hover:bg-gray-100 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        <button type="button" className="p-2 text-dashboard-text-secondary hover:bg-gray-100 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                      
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-farmio text-white text-sm font-medium rounded-lg hover:bg-farmio-dark focus:ring-2 focus:ring-farmio-light"
                      >
                        Send Reply
                      </button>
                    </div>
                  </form>
                </div>
              </Card>
            </div>
            
            {/* Right Column - Ticket Info */}
            <div>
              <Card title="Ticket Details" color="yellow">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">CUSTOMER INFORMATION</h4>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm"><span className="font-medium">Name:</span> {selectedTicket?.customer.name}</p>
                      <p className="text-sm"><span className="font-medium">Email:</span> {selectedTicket?.customer.email}</p>
                      <p className="text-sm"><span className="font-medium">User Type:</span> {selectedTicket?.customer.type}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">TICKET INFORMATION</h4>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm"><span className="font-medium">Created:</span> {selectedTicket?.createdAt}</p>
                      <p className="text-sm"><span className="font-medium">Category:</span> {selectedTicket?.category}</p>
                      <p className="text-sm"><span className="font-medium">Assigned To:</span> {selectedTicket?.assignedTo}</p>
                      <p className="text-sm">
                        <span className="font-medium">Priority:</span> 
                        <PriorityBadge priority={selectedTicket?.priority} />
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Status:</span> 
                        <StatusBadge status={selectedTicket?.status} />
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">DESCRIPTION</h4>
                    <p className="mt-2 text-sm">{selectedTicket?.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">RELATED INFORMATION</h4>
                    <div className="mt-2">
                      <button className="text-sm text-farmio hover:text-farmio-dark">
                        View Customer Profile
                      </button>
                      <button className="block mt-2 text-sm text-farmio hover:text-farmio-dark">
                        View Order History
                      </button>
                      <button className="block mt-2 text-sm text-farmio hover:text-farmio-dark">
                        Check Previous Tickets
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Quick Actions Card */}
              <Card title="Quick Actions" color="green" className="mt-6">
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-dashboard-text-primary hover:bg-pastel-green rounded-md">
                    Mark as Resolved
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-dashboard-text-primary hover:bg-pastel-green rounded-md">
                    Escalate to Manager
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-dashboard-text-primary hover:bg-pastel-green rounded-md">
                    Send Email Update
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-dashboard-text-primary hover:bg-pastel-green rounded-md">
                    Apply Template Response
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-dashboard-text-primary hover:bg-pastel-green rounded-md">
                    Close Ticket
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default UserSupportPage;
