import React from 'react';

const CapacityIndicator = ({ currentCapacity, maxCapacity }) => {
    const percentage = (currentCapacity / maxCapacity) * 100;

    return (
        <div className="capacity-indicator">
            <div className="capacity-bar" style={{ width: `${percentage}%` }}>
                {percentage.toFixed(2)}%
            </div>
            <div className="capacity-label">
                {currentCapacity} / {maxCapacity} units
            </div>
        </div>
    );
};

export default CapacityIndicator;