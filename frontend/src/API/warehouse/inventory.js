export const fetchInventoryItems = async () => {
    const response = await fetch('/api/inventory');
    if (!response.ok) {
        throw new Error('Failed to fetch inventory items');
    }
    return await response.json();
};

export const getInventoryCapacity = async () => {
    const response = await fetch('/api/inventory/capacity');
    if (!response.ok) {
        // Fallback to mocked data for development
        return {
            totalCapacity: 2000,
            usedCapacity: 1200,
            availableCapacity: 800,
            utilizationPercentage: 60,
            alertThreshold: 80
        };
    }
    return await response.json();
};

export const addInventoryItem = async (item) => {
    const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    });
    if (!response.ok) {
        throw new Error('Failed to add inventory item');
    }
    return await response.json();
};

export const updateInventoryItem = async (id, item) => {
    const response = await fetch(`/api/inventory/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    });
    if (!response.ok) {
        throw new Error('Failed to update inventory item');
    }
    return await response.json();
};

export const deleteInventoryItem = async (id) => {
    const response = await fetch(`/api/inventory/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete inventory item');
    }
    return await response.json();
};

// New functions for agricultural inventory management
export const fetchInventoryByFarmer = async (farmerId) => {
    const response = await fetch(`/api/inventory/farmer/${farmerId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch farmer inventory');
    }
    return await response.json();
};

export const fetchInventoryByProduceType = async (produceType) => {
    const response = await fetch(`/api/inventory/produce/${produceType}`);
    if (!response.ok) {
        throw new Error('Failed to fetch produce inventory');
    }
    return await response.json();
};

export const getCapacityAlerts = async () => {
    const response = await fetch('/api/inventory/alerts');
    if (!response.ok) {
        throw new Error('Failed to fetch capacity alerts');
    }
    return await response.json();
};

export const generateInventoryReport = async (format = 'csv', filters = {}) => {
    const queryParams = new URLSearchParams({
        format,
        ...filters
    });
    
    const response = await fetch(`/api/inventory/report?${queryParams}`);
    if (!response.ok) {
        throw new Error('Failed to generate inventory report');
    }
    
    if (format === 'csv') {
        return await response.text();
    }
    return await response.blob(); // For PDF
};