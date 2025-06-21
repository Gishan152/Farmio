import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import StatCard from '../../../components/ui/StatCard';

// Icons
const QualityIcon = () => (
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

// Dummy data for quality control reports
const qualityReports = [
  { 
    id: 'QC001', 
    productName: 'Organic Tomatoes', 
    batchNumber: 'BT-2025-061',
    farmer: 'Green Valley Farms',
    testDate: '2025-06-20',
    inspectorName: 'Maria Rodriguez',
    testResults: [
      { test: 'Pesticide Residue', result: 'Pass', value: '< 0.01 ppm' },
      { test: 'Nutrient Content', result: 'Pass', value: 'Within standards' },
      { test: 'Visual Inspection', result: 'Pass', value: 'No defects' },
    ],
    status: 'Passed',
    notes: 'All standards met, product ready for sale'
  },
  { 
    id: 'QC002', 
    productName: 'Fresh Farm Milk', 
    batchNumber: 'BT-2025-062',
    farmer: 'Happy Cow Dairy',
    testDate: '2025-06-21',
    inspectorName: 'James Wilson',
    testResults: [
      { test: 'Bacteria Count', result: 'Pass', value: '< 10,000 CFU/ml' },
      { test: 'Antibiotic Residue', result: 'Pass', value: 'Not detected' },
      { test: 'Fat Content', result: 'Pass', value: '3.5%' },
    ],
    status: 'Passed',
    notes: 'Meets Grade A standards'
  },
  { 
    id: 'QC003', 
    productName: 'Organic Eggs', 
    batchNumber: 'BT-2025-063',
    farmer: 'Free Range Farms',
    testDate: '2025-06-19',
    inspectorName: 'Emily Chang',
    testResults: [
      { test: 'Salmonella', result: 'Pass', value: 'Not detected' },
      { test: 'Size Grading', result: 'Pass', value: 'Large, consistent' },
      { test: 'Shell Quality', result: 'Issues Found', value: '3% cracked' },
    ],
    status: 'Issues Found',
    notes: 'Minor shell integrity issues in batch, recommend sorting before packaging'
  },
  { 
    id: 'QC004', 
    productName: 'Grass-Fed Beef', 
    batchNumber: 'BT-2025-064',
    farmer: 'Natural Pastures',
    testDate: '2025-06-18',
    inspectorName: 'Robert Johnson',
    testResults: [
      { test: 'E. coli', result: 'Pass', value: 'Not detected' },
      { test: 'Hormone Test', result: 'Pass', value: 'Not detected' },
      { test: 'Fat Marbling', result: 'Pass', value: 'Grade A' },
    ],
    status: 'Passed',
    notes: 'Excellent quality, verified grass-fed'
  },
  { 
    id: 'QC005', 
    productName: 'Seasonal Fruits', 
    batchNumber: 'BT-2025-065',
    farmer: 'Orchard Haven',
    testDate: '2025-06-17',
    inspectorName: 'Maria Rodriguez',
    testResults: [
      { test: 'Pesticide Residue', result: 'Fail', value: '0.05 ppm (over limit)' },
      { test: 'Visual Inspection', result: 'Pass', value: 'Good appearance' },
      { test: 'Ripeness Test', result: 'Pass', value: 'Optimal ripeness' },
    ],
    status: 'Failed',
    notes: 'Pesticide residue exceeds organic standards. Batch cannot be sold as organic.'
  },
];

const QualityControlPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredReports, setFilteredReports] = useState(qualityReports);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [expandedRowId, setExpandedRowId] = useState(null);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Get unique statuses
  const statuses = ['All', ...new Set(qualityReports.map(report => report.status))];

  // Filter reports based on search query and status
  useEffect(() => {
    let result = qualityReports;
    
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(report => 
        report.productName.toLowerCase().includes(lowerCaseQuery) || 
        report.id.toLowerCase().includes(lowerCaseQuery) ||
        report.farmer.toLowerCase().includes(lowerCaseQuery) ||
        report.batchNumber.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    if (selectedStatus !== 'All') {
      result = result.filter(report => report.status === selectedStatus);
    }
    
    setFilteredReports(result);
  }, [searchQuery, selectedStatus]);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      'Passed': 'bg-pastel-green text-green-800',
      'Issues Found': 'bg-pastel-yellow text-yellow-800',
      'Failed': 'bg-pastel-red text-red-800',
      'Pending': 'bg-pastel-blue text-blue-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status] || 'bg-gray-200 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  // Test Result component for expanded row
  const TestResultLine = ({ test, result, value }) => {
    const resultStyles = {
      'Pass': 'text-green-600',
      'Fail': 'text-red-600',
      'Issues Found': 'text-yellow-600'
    };

    return (
      <div className="flex items-center py-1 border-b border-gray-100 last:border-0">
        <div className="w-1/3 font-medium">{test}:</div>
        <div className={`w-1/4 ${resultStyles[result] || 'text-dashboard-text-secondary'}`}>
          {result}
        </div>
        <div className="w-5/12 text-dashboard-text-secondary">{value}</div>
      </div>
    );
  };

  // Expanded row component
  const ExpandedRow = ({ report }) => (
    <div className="p-4 bg-gray-50">
      <h4 className="font-medium mb-2">Quality Test Results</h4>
      <div className="mb-4">
        {report.testResults.map((test, index) => (
          <TestResultLine key={index} test={test.test} result={test.result} value={test.value} />
        ))}
      </div>
      <div>
        <h4 className="font-medium mb-1">Inspector Notes:</h4>
        <p className="text-dashboard-text-secondary">{report.notes}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <button 
          className="px-4 py-2 bg-farmio text-white text-sm font-medium rounded-lg hover:bg-farmio-dark focus:ring-2 focus:ring-farmio-light"
          onClick={() => console.log('Generate full report for:', report.id)}
        >
          Generate Full Report
        </button>
      </div>
    </div>
  );

  return (
    <DashboardLayout 
      title="Quality Control" 
      userRole="moderator"
      breadcrumbs="Products / Quality Control"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Quality Tests"
          value={qualityReports.length.toString()}
          subtitle="Total tests conducted"
          icon={<QualityIcon />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard 
          title="Passed"
          value="3"
          subtitle="Tests passed"
          icon={<QualityIcon />}
          color="green"
          isLoading={isLoading}
        />
        <StatCard 
          title="Issues Found"
          value="1"
          subtitle="Minor issues"
          icon={<AlertIcon />}
          color="yellow"
          isLoading={isLoading}
        />
        <StatCard 
          title="Failed"
          value="1"
          subtitle="Tests failed"
          icon={<AlertIcon />}
          color="red"
          isLoading={isLoading}
        />
      </div>
      
      {/* Main Content */}
      <Card 
        title="Quality Control Reports" 
        noPadding
        color="blue"
        icon={<QualityIcon />}
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
                  placeholder="Search by product, batch number, or farmer"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div>
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
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-farmio text-white text-sm font-medium rounded-lg hover:bg-farmio-dark focus:ring-2 focus:ring-farmio-light">
                Schedule New Test
              </button>
              <button className="px-4 py-2 bg-gray-100 text-dashboard-text-primary text-sm font-medium rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-200">
                Export Reports
              </button>
            </div>
          </div>
        </div>
        
        {/* Quality Reports Table */}
        <div className="w-full">
          <Table
            isLoading={isLoading}
            columns={[
              { header: 'Report ID', accessor: 'id' },
              { header: 'Product', accessor: 'productName' },
              { header: 'Batch Number', accessor: 'batchNumber' },
              { header: 'Farmer', accessor: 'farmer' },
              { header: 'Test Date', accessor: 'testDate' },
              { header: 'Inspector', accessor: 'inspectorName' },
              { 
                header: 'Status', 
                accessor: 'status',
                cell: (row) => <StatusBadge status={row.status} />
              },
              {
                header: '',
                accessor: 'expand',
                cell: (row) => (
                  <button 
                    className="p-1 text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedRowId(expandedRowId === row.id ? null : row.id);
                    }}
                  >
                    {expandedRowId === row.id ? 'Hide Details' : 'View Details'}
                  </button>
                )
              }
            ]}
            data={filteredReports}
            expandedRowRender={(report) => <ExpandedRow report={report} />}
            expandedRowId={expandedRowId}
          />
        </div>
        
        {/* Pagination */}
        <div className="p-4 flex justify-between items-center">
          <div className="text-sm text-dashboard-text-light">
            Showing {filteredReports.length} of {qualityReports.length} reports
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

export default QualityControlPage;
