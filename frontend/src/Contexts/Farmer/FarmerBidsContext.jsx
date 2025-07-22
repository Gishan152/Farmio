import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../../API/client';

const FarmerBidsContext = createContext();

export const FarmerBidsProvider = ({ children }) => {
    const [buyerRequests, setBuyerRequests] = useState([]);
    const [bids, setBids] = useState([]); // [{buyerRequestId, bidData}]
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all buyer requests
    const fetchBuyerRequests = async () => {
        console.log("Fetching buyer requests...");
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/api/order/buyer-requests');
            console.log("Buyer requests fetched:", res.data);
            setBuyerRequests(res.data);
        } catch (err) {
            setError('Failed to fetch buyer requests');
        } finally {
            setLoading(false);
        }
    };

    // Fetch bids placed by this farmer (optional, can be expanded)
    const fetchBids = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(`/api/order/buyer-requests/bids/farmer`);
            setBids(res.data);
        } catch (err) {
            setError('Failed to fetch bids');
        } finally {
            setLoading(false);
        }
    };

    // Place a bid for a buyer request
    const placeBid = async (buyerRequestId, bidData) => {
        setLoading(true);
        setError(null);
        try {
            // Compose FarmerBidDto
            const payload = {
                buyerRequestId,
                ...bidData
            };
            const res = await api.post(`/api/order/buyer-requests/bids`, payload);
            setBids((prev) => [...prev, res.data]);
            return res.data;
        } catch (err) {
            setError('Failed to place bid');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuyerRequests();
        fetchBids();
    }, []);

    return (
        <FarmerBidsContext.Provider value={{
            buyerRequests,
            bids,
            loading,
            error,
            fetchBuyerRequests,
            fetchBids,
            placeBid,
            setBuyerRequests,
            setBids
        }}>
            {children}
        </FarmerBidsContext.Provider>
    );
};

export const useFarmerBids = () => useContext(FarmerBidsContext);
