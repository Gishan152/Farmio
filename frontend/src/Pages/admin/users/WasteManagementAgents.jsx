import React, { useState, useEffect } from 'react';
import UserManagement from '../../../components/templates/UserManagement';
import { fetchUsersByRole, transformApiUsers, getSampleDataByRole, ROLES } from '../../../Utils/roleUtils';

// Waste Management icon
const WasteManagementIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

// Sample processing technology data
const processingTechnologies = {
  1: [
    {
      name: "Aerobic Composting System",
      description: "Large-scale aerobic composting using temperature and moisture control systems",
      capacity: "50 tons per day",
      outputProducts: "Organic compost, soil amendments",
      certifications: "CEA Approved"
    },
    {
      name: "Recyclables Sorting Line",
      description: "Automated sorting line for separating plastics, paper, and metals",
      capacity: "40 tons per day",
      outputProducts: "Sorted recyclable materials",
      certifications: "ISO 9001"
    }
  ],
  2: [
    {
      name: "Biogas Digester System",
      description: "Anaerobic digestion system for converting organic waste to biogas",
      capacity: "60 tons per day",
      outputProducts: "Biogas, liquid fertilizer",
      certifications: "ISO 14001, Renewable Energy Certified"
    },
    {
      name: "Upcycling Workshop",
      description: "Manual and semi-automated processing of waste into value-added products",
      capacity: "15 tons per day",
      outputProducts: "Crafts, building materials, consumer products",
      certifications: "Fair Trade Certified"
    }
  ],
  3: [
    {
      name: "Specialized Organic Matter Processor",
      description: "Temperature-controlled composting for specific plant materials",
      capacity: "30 tons per day",
      outputProducts: "Premium organic compost, specialized soil mixes",
      certifications: "Organic Certified, SLSI Certified"
    }
  ],
  4: [
    {
      name: "Integrated Waste Processing Facility",
      description: "Combined treatment facility with multiple processing technologies",
      capacity: "100 tons per day",
      outputProducts: "Compost, recyclables, biogas, animal feed",
      certifications: "ISO 14001, Carbon Trust Standard"
    },
    {
      name: "Advanced Sorting System",
      description: "AI-powered sorting technology for maximum resource recovery",
      capacity: "50 tons per day",
      outputProducts: "Precisely sorted materials for specialized recycling",
      certifications: "ISO 9001"
    }
  ],
  5: [
    {
      name: "Biogas and Fertilizer Plant",
      description: "Two-stage anaerobic digestion with fertilizer production",
      capacity: "75 tons per day",
      outputProducts: "Biogas for electricity, liquid and solid bio-fertilizers",
      certifications: "Renewable Energy Certified, CEA Approved"
    },
    {
      name: "Animal Feed Processing Unit",
      description: "Processing of suitable organic waste into animal feed",
      capacity: "20 tons per day",
      outputProducts: "Processed animal feed supplements",
      certifications: "Animal Feed Quality Standard"
    }
  ]
};

// Sample collection history data
const collectionHistory = {
  1: [
    { date: "2023-06-10", farmerId: "F-1023", location: "Jaffna Central", wasteType: "Vegetable trimmings", quantity: "3.5 tons", processingMethod: "Composting" },
    { date: "2023-06-03", farmerId: "F-1045", location: "Jaffna East", wasteType: "Fruit peels", quantity: "2.8 tons", processingMethod: "Composting" },
    { date: "2023-05-27", farmerId: "F-1078", location: "Jaffna North", wasteType: "Packaging materials", quantity: "1.2 tons", processingMethod: "Recycling" },
    { date: "2023-05-20", farmerId: "F-1107", location: "Jaffna West", wasteType: "Mixed vegetable waste", quantity: "4.1 tons", processingMethod: "Composting" }
  ],
  2: [
    { date: "2023-06-08", farmerId: "F-2023", location: "Batticaloa Central", wasteType: "Mixed agricultural waste", quantity: "5.2 tons", processingMethod: "Biogas Production" },
    { date: "2023-06-01", farmerId: "F-2056", location: "Batticaloa South", wasteType: "Crop residues", quantity: "4.7 tons", processingMethod: "Biogas Production" },
    { date: "2023-05-25", farmerId: "F-2089", location: "Batticaloa North", wasteType: "Fruit waste", quantity: "3.4 tons", processingMethod: "Upcycling" }
  ],
  3: [
    { date: "2023-05-01", farmerId: "F-3012", location: "Matara East", wasteType: "Plant material", quantity: "2.6 tons", processingMethod: "Specialized Composting" },
    { date: "2023-04-24", farmerId: "F-3034", location: "Matara Central", wasteType: "Green waste", quantity: "3.1 tons", processingMethod: "Specialized Composting" },
    { date: "2023-04-17", farmerId: "F-3078", location: "Matara West", wasteType: "Plant trimmings", quantity: "2.8 tons", processingMethod: "Specialized Composting" }
  ],
  4: [
    { date: "2023-06-09", farmerId: "F-4056", location: "Kurunegala Central", wasteType: "Mixed agricultural waste", quantity: "6.3 tons", processingMethod: "Full Spectrum Processing" },
    { date: "2023-06-02", farmerId: "F-4078", location: "Kurunegala North", wasteType: "Vegetable waste", quantity: "4.8 tons", processingMethod: "Full Spectrum Processing" },
    { date: "2023-05-26", farmerId: "F-4102", location: "Kurunegala East", wasteType: "Fruit waste", quantity: "5.1 tons", processingMethod: "Full Spectrum Processing" },
    { date: "2023-05-19", farmerId: "F-4115", location: "Kurunegala South", wasteType: "Crop residues", quantity: "7.2 tons", processingMethod: "Full Spectrum Processing" }
  ],
  5: [
    { date: "2023-06-07", farmerId: "F-5023", location: "Anuradhapura Central", wasteType: "Organic waste", quantity: "4.5 tons", processingMethod: "Biogas Production" },
    { date: "2023-06-01", farmerId: "F-5045", location: "Anuradhapura East", wasteType: "Animal waste", quantity: "3.2 tons", processingMethod: "Biogas Production" },
    { date: "2023-05-25", farmerId: "F-5067", location: "Anuradhapura North", wasteType: "Mixed organic waste", quantity: "4.9 tons", processingMethod: "Fertilizer Production" }
  ]
};

// Sample environmental metrics data
const environmentalMetrics = {
  1: {
    emissionsReduction: "120 tons CO2e/month",
    waterSaved: "850,000 liters/month",
    landfillDiverted: "95 tons/month",
    energyProduced: "0 kWh/month",
    carbonFootprint: "Low - 0.2 kg CO2e per kg processed",
    certifications: ["CEA Certified", "Green Business"],
    complianceStatus: "Full compliance - last audit May 2023"
  },
  2: {
    emissionsReduction: "180 tons CO2e/month",
    waterSaved: "620,000 liters/month",
    landfillDiverted: "72 tons/month",
    energyProduced: "45,000 kWh/month",
    carbonFootprint: "Very Low - 0.1 kg CO2e per kg processed",
    certifications: ["ISO 14001"],
    complianceStatus: "Full compliance - last audit April 2023"
  },
  3: {
    emissionsReduction: "60 tons CO2e/month",
    waterSaved: "320,000 liters/month",
    landfillDiverted: "30 tons/month",
    energyProduced: "0 kWh/month",
    carbonFootprint: "Low - 0.25 kg CO2e per kg processed",
    certifications: ["Organic Certified"],
    complianceStatus: "Partial compliance - remediation plan in progress"
  },
  4: {
    emissionsReduction: "210 tons CO2e/month",
    waterSaved: "980,000 liters/month",
    landfillDiverted: "115 tons/month",
    energyProduced: "60,000 kWh/month",
    carbonFootprint: "Very Low - 0.15 kg CO2e per kg processed",
    certifications: ["ISO 14001", "Carbon Trust"],
    complianceStatus: "Full compliance - last audit June 2023"
  },
  5: {
    emissionsReduction: "155 tons CO2e/month",
    waterSaved: "750,000 liters/month",
    landfillDiverted: "82 tons/month",
    energyProduced: "70,000 kWh/month",
    carbonFootprint: "Very Low - 0.12 kg CO2e per kg processed",
    certifications: ["Renewable Energy Certified"],
    complianceStatus: "Full compliance - last audit May 2023"
  }
};

const WasteManagementAgentManagement = () => {
  // State for modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  // State for API data
  const [wasteAgents, setWasteAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch waste management agents data from API
  useEffect(() => {
    const fetchWasteAgents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const usersData = await fetchUsersByRole(ROLES.WASTE);
        const transformedAgents = transformApiUsers(usersData).map(user => ({
          ...user,
          // Map API fields to waste management specific fields
          contactPerson: user.name,
          serviceTypes: "Waste Management",
          capacity: "N/A",
          certifications: "N/A",
          wasteTypes: "Agricultural Waste",
          lastCollection: "N/A"
        }));
        
        setWasteAgents(transformedAgents);
      } catch (err) {
        console.error('Error fetching waste management agents:', err);
        setError(err.message);
        // Fallback to sample data on error
        setWasteAgents(getSampleWasteAgents());
      } finally {
        setLoading(false);
      }
    };

    fetchWasteAgents();
  }, []);

  // Sample data fallback
  const getSampleWasteAgents = () => [
    {
      id: 1,
      name: "Green Lanka Recycling",
      contactPerson: "Sample Agent",
      email: "waste@example.com",
      phone: "+94 77 123 4567",
      location: "Sample Location",
      serviceTypes: "Composting, Recycling",
      capacity: "100 tons/day",
      certifications: "CEA Certified",
      wasteTypes: "Organic, Packaging",
      status: "Active",
      nic: "123456789V",
      roles: "ROLE_WASTE",
      joinDate: "2022-07-14",
      lastCollection: "2023-06-10"
    }
  ];

  // Handle view agent details
  const handleViewAgent = (agent) => {
    setSelectedAgent(agent);
    setActiveTab('details');
    setShowViewModal(true);
  };

  // Handle delete agent
  const handleDeleteAgent = (agent) => {
    setSelectedAgent(agent);
    setShowDeleteModal(true);
  };

  // Confirm delete agent
  const confirmDeleteAgent = () => {
    // Logic to delete agent would go here
    console.log(`Deleting agent: ${selectedAgent.name}`);
    setShowDeleteModal(false);
    // In a real app, you would update the state or call an API
  };
  // Table columns - updated for API data
  const columns = [
    { accessor: 'name', header: 'Name' },
    { accessor: 'email', header: 'Email' },
    { accessor: 'phone', header: 'Phone' },
    { accessor: 'nic', header: 'NIC' },
    {
      accessor: 'status',
      header: 'Status',
      cell: (row) => (
        <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
          row.status === 'APPROVED' || row.status === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : row.status === 'PENDING' 
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      accessor: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={(e) => {
              e.stopPropagation();
              handleViewAgent(row);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            className="text-red-600 hover:text-red-800"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteAgent(row);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  // Filter options - updated for API data
  const filters = [
    {
      name: 'status',
      label: 'Status',
      options: [
        { label: 'Approved', value: 'APPROVED' },
        { label: 'Pending', value: 'PENDING' },
        { label: 'Rejected', value: 'REJECTED' }
      ]
    }
  ];

  // Loading and error states
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-farmio"></div>
      </div>
    );
  }

  if (error && wasteAgents.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load waste management agents data</h3>
        <p className="text-gray-500 mb-4">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-farmio text-white px-4 py-2 rounded hover:bg-farmio-dark"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* API Status Notification */}
      {error && wasteAgents.length > 0 && (
        <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                API connection failed. Showing sample data. Error: {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <UserManagement
        userType="Waste Management Agents"
        userTypePath="waste-management-agents"
        userIcon={<WasteManagementIcon />}
        columns={columns}
        userData={wasteAgents}
        filters={filters}
        showAddButton={false}
      />

      {/* View Agent Details Modal */}
      {showViewModal && selectedAgent && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-opacity-20 backdrop-filter backdrop-blur-sm" onClick={() => setShowViewModal(false)}></div>
          <div className="relative flex items-center justify-center min-h-full p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Waste Management Agent Details: {selectedAgent.name}</h3>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Tabs Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-6 py-3 font-medium text-sm ${
                      activeTab === 'details'
                        ? 'border-b-2 border-farmio text-farmio-dark'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setActiveTab('technologies')}
                    className={`px-6 py-3 font-medium text-sm ${
                      activeTab === 'technologies'
                        ? 'border-b-2 border-farmio text-farmio-dark'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Processing Technologies ({processingTechnologies[selectedAgent.id]?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('collections')}
                    className={`px-6 py-3 font-medium text-sm ${
                      activeTab === 'collections'
                        ? 'border-b-2 border-farmio text-farmio-dark'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Collection History ({collectionHistory[selectedAgent.id]?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('environmental')}
                    className={`px-6 py-3 font-medium text-sm ${
                      activeTab === 'environmental'
                        ? 'border-b-2 border-farmio text-farmio-dark'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Environmental Metrics
                  </button>
                </nav>
              </div>

              <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-14rem)]">
                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Company Name</p>
                      <p className="mt-1">{selectedAgent.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Contact Person</p>
                      <p className="mt-1">{selectedAgent.contactPerson}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="mt-1">{selectedAgent.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="mt-1">{selectedAgent.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="mt-1">{selectedAgent.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Service Types</p>
                      <p className="mt-1">{selectedAgent.serviceTypes}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Processing Capacity</p>
                      <p className="mt-1">{selectedAgent.capacity}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Waste Types Handled</p>
                      <p className="mt-1">{selectedAgent.wasteTypes}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Certifications</p>
                      <p className="mt-1">{selectedAgent.certifications}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className="mt-1">
                        <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                          selectedAgent.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedAgent.status}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Join Date</p>
                      <p className="mt-1">{selectedAgent.joinDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Collection Date</p>
                      <p className="mt-1">{selectedAgent.lastCollection}</p>
                    </div>
                  </div>
                )}

                {/* Technologies Tab */}
                {activeTab === 'technologies' && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-4">Processing Technologies</h4>
                    {processingTechnologies[selectedAgent.id]?.length > 0 ? (
                      <div className="space-y-4">
                        {processingTechnologies[selectedAgent.id]?.map((tech, index) => (
                          <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <h5 className="text-md font-medium text-gray-800">{tech.name}</h5>
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <p className="text-sm font-medium text-gray-600">Description</p>
                                <p className="text-sm text-gray-700">{tech.description}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-600">Processing Capacity</p>
                                <p className="text-sm text-gray-700">{tech.capacity}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-600">Output Products</p>
                                <p className="text-sm text-gray-700">{tech.outputProducts}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-600">Certifications</p>
                                <p className="text-sm text-gray-700">{tech.certifications}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No technology information available.</p>
                    )}
                  </div>
                )}

                {/* Collection History Tab */}
                {activeTab === 'collections' && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-4">Recent Collection History</h4>
                    {collectionHistory[selectedAgent.id]?.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer ID</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waste Type</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processing Method</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {collectionHistory[selectedAgent.id]?.map((collection, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{collection.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{collection.farmerId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{collection.location}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{collection.wasteType}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{collection.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{collection.processingMethod}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No collection history available.</p>
                    )}
                  </div>
                )}

                {/* Environmental Metrics Tab */}
                {activeTab === 'environmental' && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-4">Environmental Impact Metrics</h4>
                    {environmentalMetrics[selectedAgent.id] && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <h5 className="text-sm font-medium text-gray-900">Emissions Reduction</h5>
                                <p className="mt-1 text-lg font-semibold text-green-600">{environmentalMetrics[selectedAgent.id].emissionsReduction}</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <h5 className="text-sm font-medium text-gray-900">Water Saved</h5>
                                <p className="mt-1 text-lg font-semibold text-blue-600">{environmentalMetrics[selectedAgent.id].waterSaved}</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 bg-yellow-100 rounded-full p-2">
                                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <h5 className="text-sm font-medium text-gray-900">Landfill Diverted</h5>
                                <p className="mt-1 text-lg font-semibold text-yellow-600">{environmentalMetrics[selectedAgent.id].landfillDiverted}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <h5 className="font-medium text-gray-800">Energy Production</h5>
                            <p className="text-gray-600">{environmentalMetrics[selectedAgent.id].energyProduced}</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-800">Carbon Footprint</h5>
                            <p className="text-gray-600">{environmentalMetrics[selectedAgent.id].carbonFootprint}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h5 className="font-medium text-gray-800">Certifications</h5>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {environmentalMetrics[selectedAgent.id].certifications?.map((cert, index) => (
                              <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-medium text-gray-800">Compliance Status</h5>
                          <p className="text-gray-600 mt-1">{environmentalMetrics[selectedAgent.id].complianceStatus}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="px-6 py-3 bg-gray-50 text-right">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 bg-farmio text-white rounded hover:bg-farmio-dark focus:outline-none"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedAgent && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-opacity-20 backdrop-filter backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
          <div className="relative flex items-center justify-center min-h-full p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-gray-700">
                  Are you sure you want to delete waste management agent <span className="font-medium">{selectedAgent.name}</span>? This action cannot be undone.
                </p>
              </div>
              <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAgent}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WasteManagementAgentManagement;