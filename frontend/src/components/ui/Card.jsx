import React from 'react';

// Card component with pastel theme
const Card = ({ 
  title,
  children,
  icon,
  color = 'green',
  className = '',
  onClick = null,
  footer = null,
  isLoading = false,
  noPadding = false
}) => {
  // Define color variants
  const colorVariants = {
    green: 'bg-pastel-green border-farmio-light text-farmio-dark',
    blue: 'bg-pastel-blue border-blue-300 text-blue-800',
    yellow: 'bg-pastel-yellow border-yellow-300 text-yellow-800',
    pink: 'bg-pastel-pink border-pink-300 text-pink-800',
    purple: 'bg-pastel-purple border-purple-300 text-purple-800',
    orange: 'bg-pastel-orange border-orange-300 text-orange-800',
    red: 'bg-pastel-red border-red-300 text-red-800'
  };

  const headerColor = colorVariants[color] || colorVariants.green;
  
  return (
    <div 
      className={`bg-white rounded-lg border border-dashboard-border shadow-card overflow-hidden hover:shadow-card-hover transition-shadow ${className}`}
      onClick={onClick}
    >
      {/* Card Header with color */}
      {title && (
        <div className={`px-4 py-3 flex items-center justify-between ${headerColor}`}>
          <h3 className="font-medium flex items-center">
            {icon && <span className="mr-2">{icon}</span>}
            {title}
          </h3>
        </div>
      )}
      
      {/* Card Content */}
      <div className={`${!noPadding && 'p-4'} ${isLoading ? 'opacity-50' : ''}`}>
        {isLoading ? (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-farmio"></div>
          </div>
        ) : (
          children
        )}
      </div>
      
      {/* Card Footer */}
      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t border-dashboard-border">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
