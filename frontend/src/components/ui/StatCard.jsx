import React from 'react';

// Chart icon
const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
  </svg>
);

// Up trend icon
const TrendUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

// Down trend icon
const TrendDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

// Flat trend icon
const TrendFlatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
  </svg>
);

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'green',
  trend = null, // 'up', 'down', or 'flat'
  trendValue = null, 
  onClick = null,
  isLoading = false
}) => {
  // Define color variants
  const colorVariants = {
    green: 'bg-pastel-green text-farmio-dark border-farmio-light',
    blue: 'bg-pastel-blue text-blue-800 border-blue-300',
    yellow: 'bg-pastel-yellow text-yellow-800 border-yellow-300',
    pink: 'bg-pastel-pink text-pink-800 border-pink-300',
    purple: 'bg-pastel-purple text-purple-800 border-purple-300',
    orange: 'bg-pastel-orange text-orange-800 border-orange-300',
    red: 'bg-pastel-red text-red-800 border-red-300',
  };

  // Get trend component and color
  const getTrendInfo = () => {
    if (!trend || !trendValue) return null;

    let TrendIcon = TrendFlatIcon;
    let trendColorClass = 'text-gray-500';
    
    if (trend === 'up') {
      TrendIcon = TrendUpIcon;
      trendColorClass = 'text-green-600';
    } else if (trend === 'down') {
      TrendIcon = TrendDownIcon;
      trendColorClass = 'text-red-600';
    }
    
    return {
      icon: <TrendIcon />,
      colorClass: trendColorClass
    };
  };

  const trendInfo = getTrendInfo();
  const cardColorClass = colorVariants[color] || colorVariants.green;

  return (
    <div 
      className={`bg-white rounded-lg border border-dashboard-border shadow-card hover:shadow-card-hover transition-all ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* Icon circle with pastel background */}
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${cardColorClass}`}>
              {icon || <ChartIcon />}
            </div>

            {/* Title */}
            <h3 className="ml-3 text-sm font-medium text-dashboard-text-secondary">
              {title}
            </h3>
          </div>
          
          {/* Trend indicator */}
          {trendInfo && (
            <div className={`flex items-center text-xs ${trendInfo.colorClass}`}>
              <span className="mr-1">{trendInfo.icon}</span>
              <span>{trendValue}</span>
            </div>
          )}
        </div>

        {/* Value and subtitle */}
        <div className="mt-3">
          {isLoading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <div className="text-2xl font-semibold text-dashboard-text-primary">
              {value}
            </div>
          )}
          
          {subtitle && (
            <div className="mt-1 text-xs text-dashboard-text-light">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
