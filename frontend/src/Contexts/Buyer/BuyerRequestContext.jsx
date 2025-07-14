import { Children, createContext, useContext, useState } from "react";
import wheat from "../../Assets/Buyer/Crops/wheat.webp";

const requestsContext = createContext([]);

const RequestsContextProvider = ({ children }) => {

    const [requests, setRequests] = useState([]);
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