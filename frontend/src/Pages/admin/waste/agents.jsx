import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import StatCard from '../../../components/ui/StatCard';
import { fetchAllWasteAgents } from '../../../Utils/wasteUtils';

// Icons
const AgentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const WasteAgents = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [wasteAgents, setWasteAgents] = useState([]);
  const [expandedAgentId, setExpandedAgentId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch waste agents
  useEffect(() => {
    const fetchWasteAgentsData = async () => {
      setIsLoading(true);
      try {
        const agents = await fetchAllWasteAgents();
        setWasteAgents(agents || []);
        setFilteredData(agents || []);
      } catch (error) {
        console.error("Error fetching waste agents:", error);
        setWasteAgents([]);
        setFilteredData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWasteAgentsData();
  }, []);

  // Handle search
  useEffect(() => {
    if (!wasteAgents || wasteAgents.length === 0) return;

    let results = wasteAgents.filter(agent => {
      return (
        (agent.name && agent.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (agent.companyName && agent.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (agent.email && agent.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (agent.address && agent.address.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });

    setFilteredData(results);
  }, [searchTerm, wasteAgents]);

  // Agent Details Component
  const AgentDetails = ({ agent }) => {
    if (!agent) return null;
    
    return (
      <div className="p-4 bg-gray-50">
        <div className="mb-3 flex justify-between items-center">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Agent Profile (ID: {agent.agentId})</h4>
            <p className="text-xs text-gray-500">
              <span className="inline-flex items-center">
                <LocationIcon />
                <span className="ml-1">{agent.address || 'No address specified'}</span>
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-xs font-medium text-gray-500 mb-2">AGENT INFORMATION</h5>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium">{agent.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Company:</span>
                <span className="font-medium">{agent.companyName || 'Not specified'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">{agent.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Contact:</span>
                <span className="font-medium">{agent.contactNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Address:</span>
                <span className="font-medium">{agent.address}</span>
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-medium text-gray-500 mb-2">ACTIONS</h5>
            <div className="mt-4 flex space-x-2">
              <button className="flex items-center text-sm py-1 px-3 rounded-md border border-farmio text-farmio hover:bg-farmio hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Agent
              </button>
              <button className="flex items-center text-sm py-1 px-3 rounded-md bg-farmio text-white hover:bg-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                View Assignments
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Table columns
  const columns = [
    { accessor: 'agentId', header: 'ID' },
    { 
      accessor: 'name', 
      header: 'Name',
      render: (value) => (
        <div className="font-medium">{value}</div>
      )
    },
    { 
      accessor: 'companyName', 
      header: 'Company',
      render: (value) => (
        <div>{value || 'Independent'}</div>
      )
    },
    { 
      accessor: 'contactNumber', 
      header: 'Contact',
      render: (value) => (
        <div className="flex items-center">
          <PhoneIcon />
          <span className="ml-1">{value}</span>
        </div>
      )
    },
    { 
      accessor: 'email', 
      header: 'Email',
      render: (value) => (
        <div className="flex items-center">
          <EmailIcon />
          <span className="ml-1">{value}</span>
        </div>
      )
    },
    { 
      accessor: 'actions', 
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            className={`text-blue-600 hover:text-blue-800 ${expandedAgentId === row.agentId ? 'text-blue-800' : ''}`}
            title={expandedAgentId === row.agentId ? "Hide Details" : "View Details"}
            onClick={(e) => {
              e.stopPropagation();
              setExpandedAgentId(expandedAgentId === row.agentId ? null : row.agentId);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button className="text-indigo-600 hover:text-indigo-800" title="Edit Agent">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout
      title="Waste Agents"
      breadcrumbs="Waste Management / Agents"
      userRole="admin"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Agents"
          value={wasteAgents.length.toString()}
          subtitle="Registered waste agents"
          icon={<AgentIcon />}
          color="green"
          isLoading={isLoading}
        />
        <StatCard
          title="Active Agents"
          value={wasteAgents.length.toString()}
          subtitle="Ready for assignments"
          icon={<AgentIcon />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard
          title="Companies"
          value={(wasteAgents.filter(a => a.companyName).length).toString()}
          subtitle="Registered organizations"
          icon={<AgentIcon />}
          color="yellow"
          isLoading={isLoading}
        />
      </div>

      {/* Search and Add Button */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search agents by name, company, email or address..."
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

          {/* Add Agent Button */}
          <button 
            className="flex items-center text-sm py-2 px-4 rounded-md bg-farmio text-white hover:bg-green-600"
            onClick={() => setShowAddModal(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Agent
          </button>
        </div>
      </div>

      {/* Agents Table */}
      <Card
        title="Waste Agents"
        color="green"
        icon={<AgentIcon />}
        noPadding
      >
        <Table
          isLoading={isLoading}
          columns={columns}
          data={filteredData}
          emptyMessage="No waste agents found matching your criteria."
          expandedRowRender={(row) => <AgentDetails agent={row} />}
          expandedRowId={expandedAgentId}
        />
      </Card>
    </DashboardLayout>
  );
};

export default WasteAgents;