import React, { useEffect, useState } from 'react';
import MaintenanceRequestCard from '../../../components/warehouse/MaintenanceRequestCard';
import { fetchMaintenanceRequests } from '../../../API/warehouse/maintenance';

const MaintenanceIndex = () => {
    const [maintenanceRequests, setMaintenanceRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMaintenanceRequests = async () => {
            const requests = await fetchMaintenanceRequests();
            setMaintenanceRequests(requests);
            setLoading(false);
        };

        loadMaintenanceRequests();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Maintenance Requests</h1>
            {maintenanceRequests.length === 0 ? (
                <p>No maintenance requests found.</p>
            ) : (
                maintenanceRequests.map(request => (
                    <MaintenanceRequestCard key={request.id} request={request} />
                ))
            )}
        </div>
    );
};

export default MaintenanceIndex;