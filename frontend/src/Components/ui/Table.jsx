import React from 'react';

// Table component for data display
const Table = ({ 
  columns, 
  data, 
  isLoading = false,
  emptyMessage = "No data available",
  onRowClick = null,
  className = '',
  expandedRowRender = null,
  expandedRowId = null
}) => {
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-farmio"></div>
        </div>
      </div>
    );
  }
  
  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="flex justify-center items-center py-8 text-dashboard-text-light">
          {emptyMessage}
        </div>
      </div>
    );
  }
  
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-dashboard-border">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((column, index) => (
              <th 
                key={index}
                className="px-4 py-3 text-left text-xs font-medium text-dashboard-text-secondary uppercase tracking-wider"
                style={column.width ? { width: column.width } : {}}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-dashboard-border">
          {data.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <tr 
                className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-4 py-3 whitespace-nowrap">
                    {column.cell ? column.cell(row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
              
              {/* Expanded row content */}
              {expandedRowRender && expandedRowId === row.id && (
                <tr>
                  <td colSpan={columns.length} className="p-0 border-b border-dashboard-border">
                    {expandedRowRender(row)}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;