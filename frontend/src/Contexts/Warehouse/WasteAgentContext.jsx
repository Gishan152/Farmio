import React, { createContext, useContext, useState, useCallback } from 'react';
import wasteAgentAPI from '../../API/wasteAgent';

const WasteAgentContext = createContext();

export const useWasteAgent = () => {
    const context = useContext(WasteAgentContext);
    if (!context) {
        throw new Error('useWasteAgent must be used within a WasteAgentProvider');
    }
    return context;
};

export const WasteAgentProvider = ({ children }) => {
    const [agents, setAgents] = useState([]);
    const [hireRequests, setHireRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get nearby waste agents (now using real API)
    const getNearbyAgents = useCallback(async (lat, lon, radius = 50, searchTerm = '') => {
        setLoading(true);
        setError(null);
        
        try {
            let response;
            
            if (searchTerm && searchTerm.trim()) {
                // If there's a search term, use search API
                response = await wasteAgentAPI.searchWasteAgents(searchTerm.trim());
            } else {
                // Otherwise get active and verified agents
                response = await wasteAgentAPI.getActiveVerifiedWasteAgents();
            }
            
            const wasteAgents = response.data;
            
            // Transform API data to match frontend expectations
            const transformedAgents = wasteAgents.map(agent => ({
                id: agent.id,
                name: agent.name || agent.companyName || 'Unknown Agent',
                type: mapSpecializationToType(agent.specialization),
                distance: calculateDistance(), // Placeholder distance
                contact: {
                    phone: agent.phoneNumber || 'N/A',
                    email: agent.email || 'N/A',
                    address: agent.address && agent.city && agent.state 
                        ? `${agent.address}, ${agent.city}, ${agent.state}`
                        : 'Address not available'
                },
                rating: agent.rating || 0,
                reviewCount: agent.totalReviews || 0,
                specialties: [agent.specialization || 'general'],
                capacity: `${agent.serviceRadius || 0}km radius`,
                priceRange: 'Contact for pricing',
                verified: agent.isVerified || false,
                availability: agent.isActive ? 'available' : 'unavailable',
                serviceRadius: agent.serviceRadius || 0,
                city: agent.city,
                state: agent.state,
                licenseNumber: agent.licenseNumber,
                companyName: agent.companyName
            }));
            
            setAgents(transformedAgents);
        } catch (error) {
            console.error('Error fetching waste agents:', error);
            setError('Failed to load waste agents. Please try again.');
            setAgents([]); // Clear agents on error
        } finally {
            setLoading(false);
        }
        
        // Note: radius parameter is kept for API compatibility but not used in current implementation
        // In future, this could be used to filter agents by distance from warehouse
        console.log(`Searching within ${radius}km radius of coordinates: ${lat}, ${lon}`);
    }, []);

    // Helper function to map specialization to frontend type
    const mapSpecializationToType = (specialization) => {
        if (!specialization) return 'general';
        const spec = specialization.toLowerCase();
        if (spec.includes('organic') || spec.includes('compost')) return 'compost';
        if (spec.includes('electronic') || spec.includes('recycl')) return 'recycler';
        if (spec.includes('animal') || spec.includes('feed')) return 'animal feed';
        return 'general';
    };

    // Helper function to calculate distance (simplified placeholder)
    const calculateDistance = () => {
        // For now, return a placeholder distance
        // In a real implementation, you'd calculate based on agent coordinates
        return Math.floor(Math.random() * 50) + 5; // Random distance between 5-55km
    };

    // Send hire request (placeholder - implement when hire request API is available)
    const sendHireRequest = useCallback(async (requestData) => {
        try {
            // TODO: Replace with actual API call when hire request endpoint is available
            // const response = await api.post('/api/hire-requests', requestData);
            // const data = response.data;
            
            const newRequest = {
                id: `HR-${Date.now()}`,
                ...requestData,
                status: 'pending',
                createdAt: new Date().toISOString().split('T')[0],
                response: null
            };
            
            setHireRequests(prev => [newRequest, ...prev]);
            return newRequest;
        } catch (error) {
            console.error('Error sending hire request:', error);
            setError('Failed to send hire request. Please try again.');
            throw error;
        }
    }, []);

    // Get hire requests (placeholder - implement when hire request API is available)
    const getHireRequests = useCallback(async () => {
        try {
            // TODO: Replace with actual API call when hire request endpoint is available
            // const response = await api.get('/api/hire-requests');
            // setHireRequests(response.data);
            
            // For now, initialize with empty array since no hire request system exists yet
            setHireRequests([]);
        } catch (error) {
            console.error('Error fetching hire requests:', error);
            setError('Failed to load hire requests');
            setHireRequests([]);
        }
    }, []);

    const value = {
        agents,
        hireRequests,
        loading,
        error,
        getNearbyAgents,
        sendHireRequest,
        getHireRequests
    };

    return (
        <WasteAgentContext.Provider value={value}>
            {children}
        </WasteAgentContext.Provider>
    );
};