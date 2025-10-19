import React from 'react';

const Chart = ({ 
  data, 
  type = 'bar', 
  height = '200px',
  showLegend = true,
  colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444']
}) => {
  if (!data || !data.labels || data.labels.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded">
        <p className="text-sm text-gray-500">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.datasets.map(dataset => Math.max(...dataset.data)));

  const renderBarChart = () => {
    return (
      <div className="h-full flex items-end justify-between space-x-2 p-4">
        {data.labels.map((label, index) => (
          <div key={label} className="flex-1 flex flex-col items-center">
            <div className="w-full flex flex-col items-end space-y-1 mb-2">
              {data.datasets.map((dataset, datasetIndex) => {
                const height = (dataset.data[index] / maxValue) * 100;
                return (
                  <div
                    key={datasetIndex}
                    className="w-full rounded-t"
                    style={{
                      height: `${height}%`,
                      backgroundColor: colors[datasetIndex % colors.length],
                      minHeight: '4px'
                    }}
                    title={`${dataset.label}: ${dataset.data[index]}`}
                  />
                );
              })}
            </div>
            <div className="text-xs text-gray-600 text-center">
              <div className="font-medium">{label}</div>
              {data.datasets.map((dataset, datasetIndex) => (
                <div key={datasetIndex} className="text-gray-400">
                  {dataset.data[index]}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderLineChart = () => {
    return (
      <div className="h-full p-4">
        <svg width="100%" height="100%" viewBox="0 0 400 200">
          {data.datasets.map((dataset, datasetIndex) => {
            const points = dataset.data.map((value, index) => {
              const x = (index / (dataset.data.length - 1)) * 350 + 25;
              const y = 175 - (value / maxValue) * 150;
              return `${x},${y}`;
            }).join(' ');

            return (
              <polyline
                key={datasetIndex}
                points={points}
                fill="none"
                stroke={colors[datasetIndex % colors.length]}
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="w-full" style={{ height }}>
      {type === 'bar' ? renderBarChart() : renderLineChart()}
      
      {showLegend && data.datasets && (
        <div className="flex justify-center mt-4 space-x-6">
          {data.datasets.map((dataset, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm text-gray-600">{dataset.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chart;



