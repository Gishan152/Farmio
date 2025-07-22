import { Children, createContext, useContext, useState, useEffect } from "react";
import api from '../../API/client';
import wheat from "../../Assets/Buyer/Crops/wheat.webp";

const requestsContext = createContext([]);

const RequestsContextProvider = ({ children }) => {

    const [requests, setRequests] = useState([
        // {
        //     id: '1',
        //     crop: 'Wheat',
        //     unitMeasurement: 'kg',
        //     quantity: 500,
        //     quality: 'A',
        //     priceRange: { min: 120, max: 140 },
        //     location: 'Colombo',
        //     deadline: '2025-07-25',
        //     repeat: 'One-time',
        //     notes: 'Prefer organic, certified only.',
        //     visibility: 'Public',
        //     date: '2025-07-15',
        // },
        // {
        //     id: '2',
        //     crop: 'Rice',
        //     unitMeasurement: 'kg',
        //     quantity: 1000,
        //     quality: 'B',
        //     priceRange: { min: 90, max: 110 },
        //     location: 'Kandy',
        //     deadline: '2025-07-22',
        //     repeat: 'Weekly',
        //     notes: '',
        //     visibility: 'Verified farmers',
        //     date: '2025-07-14',
        // },
        // {
        //     id: '3',
        //     crop: 'Carrots',
        //     unitMeasurement: 'kg',
        //     quantity: 200,
        //     quality: 'Organic',
        //     priceRange: { min: 200, max: 250 },
        //     location: 'Gampaha',
        //     deadline: '2025-07-20',
        //     repeat: 'Monthly',
        //     notes: 'No pesticides.',
        //     visibility: 'Regional only',
        //     date: '2025-07-13',
        // },
    ]);
    const [requestBids, setRequestBids] = useState({});
    const [loading, setLoading] = useState(false);


    const addRequest = (request) => {
        setRequests(r => [...r, request])
    }

    // Fetch all buyer requests from backend and update context
    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/order/buyer-requests/my');
            setRequests(res.data);
        } catch (err) {
            // Optionally handle error (e.g., set error state)
            console.error('Failed to fetch buyer requests', err);
        } finally {
            setLoading(false);
        }
    }


    // Fetch bids for a specific buyer request if not already present
    const fetchBidsForRequest = async (reqId) => {
        if (requestBids[reqId]) return; // Already fetched
        setLoading(true);
        try {
            const res = await api.get(`/api/order/buyer-requests/bids/${reqId}`);
            setRequestBids(b => ({ ...b, [reqId]: res.data }));
        } catch (err) {
            console.error('Failed to fetch bids for request', reqId, err);
        } finally {
            setLoading(false);
        }
    };

    const updateBids = (reqId, bids) => {
        setRequestBids(b => {
            b[reqId] = bids
            return b
        })
    }

    const removeRequest = id => setRequests(requests.filter(i => i.id !== id));

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <requestsContext.Provider value={{ requests, addRequest, removeRequest, requestBids, updateBids, fetchRequests, fetchBidsForRequest, loading }}>
            {children}
        </requestsContext.Provider>
    );
}

export function useRequestsContext() {
    return useContext(requestsContext);
}

export default RequestsContextProvider;