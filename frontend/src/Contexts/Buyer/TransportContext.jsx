import { Children, createContext, useContext, useState } from "react";
import wheat from "../../Assets/Buyer/Crops/wheat.webp";

const transportsContext = createContext([]);

const TransportsContextProvider = ({ children }) => {

    const [jobs, setJobs] = useState([]);

    const addJob = (job, qty) => {
        setJobs([...jobs, job])
    }

    const removeJob = id => setJobs(jobs.filter(i => i.id !== id));

    return (
        <transportsContext.Provider value={{ jobs, addJob, removeJob }}>
            {children}
        </transportsContext.Provider>
    );
}

export function useTransportsContext() {
    return useContext(transportsContext);
}

export default TransportsContextProvider;