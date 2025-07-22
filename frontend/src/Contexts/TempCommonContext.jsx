import React, { createContext, useContext, useState } from "react";

// Create the context
const TempCommonContext = createContext();

// Provider component
export function TempCommonProvider({ children }) {
    // Load initial state from localStorage
    const getInitial = (key, fallback) => {
        try {
            const val = localStorage.getItem(key);
            return val ? JSON.parse(val) : fallback;
        } catch {
            return fallback;
        }
    };

    const [transportJobs, setTransportJobsState] = useState(() => getInitial('transportJobs', []));
    const [acceptedJobsByProvider, setAcceptedJobsByProviderState] = useState(() => getInitial('acceptedJobsByProvider', {}));

    // Persist to localStorage on update
    const setTransportJobs = (jobs) => {
        setTransportJobsState(jobs);
        localStorage.setItem('transportJobs', JSON.stringify(jobs));
    };
    const setAllTransportJobs = setTransportJobs;
    const clearTransportJobs = () => setTransportJobs([]);

    const setAcceptedJobsByProvider = (map) => {
        setAcceptedJobsByProviderState(map);
        localStorage.setItem('acceptedJobsByProvider', JSON.stringify(map));
    };

    // Add, update, remove, or set transport jobs as needed
    const addTransportJob = (job) => setTransportJobs([...transportJobs, job]);

    // Add accepted job for a provider
    const acceptJobForProvider = (userId, jobId) => {
        setAcceptedJobsByProvider(prev => {
            const updated = {
                ...prev,
                [userId]: prev[userId] ? [...prev[userId], jobId] : [jobId]
            };
            localStorage.setItem('acceptedJobsByProvider', JSON.stringify(updated));
            return updated;
        });
    };

    // Sync to localStorage if state changes (for direct setState usage)
    // useEffect(() => { localStorage.setItem('transportJobs', JSON.stringify(transportJobs)); }, [transportJobs]);
    // useEffect(() => { localStorage.setItem('acceptedJobsByProvider', JSON.stringify(acceptedJobsByProvider)); }, [acceptedJobsByProvider]);

    return (
        <TempCommonContext.Provider value={{
            transportJobs,
            setTransportJobs,
            addTransportJob,
            setAllTransportJobs,
            clearTransportJobs,
            acceptedJobsByProvider,
            acceptJobForProvider
        }}>
            {children}
        </TempCommonContext.Provider>
    );
}

// Custom hook for using the context
export function useTempCommonContext() {
    return useContext(TempCommonContext);
}
