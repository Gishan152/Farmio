import { Children, createContext, useContext, useState } from "react";
import wheat from "../../Assets/Buyer/Crops/wheat.webp";

const transportsContext = createContext([]);

const sampleJobs = [
	{
		id: 'TJ-1001',
		// orderId: 'ORD-1001',
		status: 'PENDING',
		vehicleType: 'Small Van',
		capacityRemaining: '30 kg',
		items: [ /* item data */],
		createdAt: '2025-07-01'
	},
	{
		id: 'TJ-1002',
		orderId: 'ORD-1003',
		status: 'PENDING',
		vehicleType: 'Large Truck',
		capacityRemaining: '150 kg',
		items: [ /* item data */],
		createdAt: '2025-07-02'
	}
];

const TransportsContextProvider = ({ children }) => {

    const [jobs, setJobs] = useState(sampleJobs);

    const addJob = (job, qty) => {
        setJobs([...jobs, job])
    }

    const removeJob = id => setJobs(jobs.filter(i => i.id !== id));

    const updateJob = (id, updates) => {
        setJobs(prev => prev.map(job => {
            if(job.id === id){
                return {...job, ...updates}
            }
            return job
        }))
    }

    return (
        <transportsContext.Provider value={{ jobs, addJob, removeJob, updateJob }}>
            {children}
        </transportsContext.Provider>
    );
}

export function useTransportsContext() {
    return useContext(transportsContext);
}

export default TransportsContextProvider;