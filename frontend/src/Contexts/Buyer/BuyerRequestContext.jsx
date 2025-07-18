import { Children, createContext, useContext, useState } from "react";
import wheat from "../../Assets/Buyer/Crops/wheat.webp";

const requestsContext = createContext([]);

const RequestsContextProvider = ({ children }) => {

    const [requests, setRequests] = useState([
        {
            id: '1',
            crop: 'Wheat',
            unitMeasurement: 'kg',
            quantity: 500,
            quality: 'A',
            priceRange: { min: 120, max: 140 },
            location: 'Colombo',
            deadline: '2025-07-25',
            repeat: 'One-time',
            notes: 'Prefer organic, certified only.',
            visibility: 'Public',
            date: '2025-07-15',
        },
        {
            id: '2',
            crop: 'Rice',
            unitMeasurement: 'kg',
            quantity: 1000,
            quality: 'B',
            priceRange: { min: 90, max: 110 },
            location: 'Kandy',
            deadline: '2025-07-22',
            repeat: 'Weekly',
            notes: '',
            visibility: 'Verified farmers',
            date: '2025-07-14',
        },
        {
            id: '3',
            crop: 'Carrots',
            unitMeasurement: 'kg',
            quantity: 200,
            quality: 'Organic',
            priceRange: { min: 200, max: 250 },
            location: 'Gampaha',
            deadline: '2025-07-20',
            repeat: 'Monthly',
            notes: 'No pesticides.',
            visibility: 'Regional only',
            date: '2025-07-13',
        },
    ]);
    const [requestBids, setRequestBids] = useState({});

    const addRequest = (request) => {
        setRequests(r => [...r, request])
    }

    const updateBids = (reqId, bids) => {
        setRequestBids(b => {
            b[reqId] = bids
            return b
        })
    }

    const removeRequest = id => setRequests(requests.filter(i => i.id !== id));

    return (
        <requestsContext.Provider value={{ requests, addRequest, removeRequest, requestBids, updateBids }}>
            {children}
        </requestsContext.Provider>
    );
}

export function useRequestsContext() {
    return useContext(requestsContext);
}

export default RequestsContextProvider;