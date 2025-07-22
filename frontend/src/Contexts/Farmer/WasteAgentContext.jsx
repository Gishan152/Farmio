import React, { createContext, useContext, useState, useCallback } from 'react';

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

    // Sample data for development
    const sampleAgents = [
        {
            id: "WA-001",
            name: "Green Waste Solutions",
            type: "compost",
            distance: 15.2,
            contact: {
                phone: "+94 77 123 4567",
                email: "contact@greenwaste.lk",
                address: "Industrial Zone, Colombo 15"
            },
            rating: 4.5,
            reviewCount: 48,
            specialties: ["Organic waste", "Vegetable waste", "Fruit waste"],
            capacity: "500kg/day",
            priceRange: "Rs. 50-75 per kg",
            verified: true,
            availability: "available"
        },
        {
            id: "WA-002",
            name: "Lanka Recycling Co.",
            type: "recycler",
            distance: 22.8,
            contact: {
                phone: "+94 71 987 6543",
                email: "info@lankarecycling.com",
                address: "Kelaniya Industrial Area"
            },
            rating: 4.2,
            reviewCount: 32,
            specialties: ["Plastic packaging", "Cardboard", "Mixed recyclables"],
            capacity: "1000kg/day",
            priceRange: "Rs. 25-40 per kg",
            verified: true,
            availability: "available"
        },
        {
            id: "WA-003",
            name: "Feed Masters",
            type: "animal feed",
            distance: 18.5,
            contact: {
                phone: "+94 76 555 0123",
                email: "orders@feedmasters.lk",
                address: "Gampaha District"
            },
            rating: 4.7,
            reviewCount: 67,
            specialties: ["Vegetable scraps", "Grain waste", "Fruit peels"],
            capacity: "750kg/day",
            priceRange: "Rs. 30-50 per kg",
            verified: true,
            availability: "busy"
        },
        {
            id: "WA-004",
            name: "Eco Compost Ltd",
            type: "compost",
            distance: 35.4,
            contact: {
                phone: "+94 75 444 7890",
                email: "hello@ecocompost.lk",
                address: "Kaduwela"
            },
            rating: 4.0,
            reviewCount: 28,
            specialties: ["All organic waste", "Garden waste"],
            capacity: "300kg/day",
            priceRange: "Rs. 40-60 per kg",
            verified: false,
            availability: "available"
        }
    ];

    const sampleRequests = [
        {
            id: "HR-001",
            agentId: "WA-001",
            agentName: "Green Waste Solutions",
            wasteType: "Spoiled vegetables",
            quantity: 150,
            pickupDate: "2024-01-28",
            message: "Mixed vegetables that have spoiled due to power outage. Need pickup ASAP.",
            status: "pending",
            createdAt: "2024-01-25",
            response: null
        },
        {
            id: "HR-002",
            agentId: "WA-002",
            agentName: "Lanka Recycling Co.",
            wasteType: "Packaging materials",
            quantity: 75,
            pickupDate: "2024-01-30",
            message: "Cardboard boxes and plastic containers from produce packaging.",
            status: "accepted",
            createdAt: "2024-01-24",
            response: "Pickup scheduled for 2 PM. Please have materials sorted."
        }
    ];

    // Get nearby waste agents
    const getNearbyAgents = useCallback(async (lat, lon, radius = 50, searchTerm = '') => {
        setLoading(true);
        try {
            // TODO: Replace with actual API call
            // const response = await fetch(`/api/waste-agents/nearby?lat=${lat}&lon=${lon}&radius=${radius}&search=${searchTerm}`);
            // const data = await response.json();
            
            let filteredAgents = [...sampleAgents];
            
            if (searchTerm) {
                filteredAgents = filteredAgents.filter(agent =>
                    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    agent.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    agent.specialties.some(specialty => 
                        specialty.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                );
            }
            
            // Sort by distance
            filteredAgents.sort((a, b) => a.distance - b.distance);
            
            setAgents(filteredAgents);
        } catch (error) {
            console.error('Error fetching nearby agents:', error);
            setError('Failed to load waste agents');
        } finally {
            setLoading(false);
        }
    }, []);

    // Send hire request
    const sendHireRequest = useCallback(async (requestData) => {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/waste-agents/hire', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(requestData)
            // });
            // const data = await response.json();
            
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
            throw error;
        }
    }, []);

    // Get hire requests
    const getHireRequests = useCallback(async () => {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/waste-agents/requests');
            // const data = await response.json();
            
            setHireRequests(sampleRequests);
        } catch (error) {
            console.error('Error fetching hire requests:', error);
            setError('Failed to load hire requests');
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