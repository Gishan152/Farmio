import React, { useEffect, useState } from 'react';
import { fetchCustomers } from '../../../API/warehouse/customers'; // Adjust the path as necessary
import CustomerCard from '../../../components/warehouse/CustomerCard'; // Assuming you have a CustomerCard component

const CustomersIndex = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                const data = await fetchCustomers();
                setCustomers(data);
            } catch (error) {
                console.error("Error fetching customers:", error);
            } finally {
                setLoading(false);
            }
        };

        loadCustomers();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Customer List</h1>
            <div>
                {customers.map(customer => (
                    <CustomerCard key={customer.id} customer={customer} />
                ))}
            </div>
        </div>
    );
};

export default CustomersIndex;