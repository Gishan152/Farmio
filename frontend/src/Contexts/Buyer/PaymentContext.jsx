import { createContext, useContext, useEffect, useState } from "react";
import api from "@/API/client";
import { useUserContext } from '@/Contexts/UserContext';

const PaymentContext = createContext({});

const PaymentContextProvider = ({ children }) => {
    const [walletData, setWalletData] = useState(null);
    const [payments, setPayments] = useState([]);
    const [bankDetails, setBankDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [walletLoading, setWalletLoading] = useState(false);
    const [bankDetailsLoading, setBankDetailsLoading] = useState(false);
    
    const { user } = useUserContext();

    // Fetch wallet info and payment history
    const fetchWalletData = async () => {
        if (!user?.id) return;
        
        try {
            setWalletLoading(true);
            console.log("Fetching payment details");
            const response = await api.get(`/api/payment/wallet`);
            console.log("Wallet data: ", response.data);
            setWalletData(response.data);
            
            // Convert payment history to payments format
            if (response.data.paymentHistory) {
                const formattedPayments = response.data.paymentHistory.map(transaction => ({
                    id: transaction.transactionId,
                    type: transaction.type,
                    reference: transaction.reference,
                    amount: transaction.amount,
                    status: transaction.status.toLowerCase(),
                    paymentDate: new Date(transaction.timestamp).toISOString().split('T')[0],
                    description: transaction.description,
                    transactionType: transaction.type
                }));
                setPayments(formattedPayments);
            }
        } catch (error) {
            console.error("Failed to fetch wallet data:", error);
        } finally {
            setWalletLoading(false);
        }
    };

    // Fetch bank details
    const fetchBankDetails = async () => {
        if (!user?.id) return;
        
        try {
            setBankDetailsLoading(true);
            const response = await api.get(`/api/payment/bank-details`);
            setBankDetails(response.data);
        } catch (error) {
            console.error("Failed to fetch bank details:", error);
            setBankDetails(null);
        } finally {
            setBankDetailsLoading(false);
        }
    };

    // Refresh both wallet and bank details
    const refreshPaymentData = async () => {
        await Promise.all([
            fetchWalletData(),
            fetchBankDetails()
        ]);
    };

    // Withdraw funds
    const withdrawFunds = async (amount, description = 'User withdrawal from wallet') => {
        try {
            const response = await api.post('/api/payment/withdraw', {
                amount,
                description
            });
            
            if (response.data.status === 'SUCCESS') {
                // Refresh wallet data after successful withdrawal
                await fetchWalletData();
                return { success: true, data: response.data };
            } else {
                return { success: false, error: response.data.message || 'Withdrawal failed.' };
            }
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err.message;
            return { success: false, error: errorMessage, needsBankDetails: errorMessage.toLowerCase().includes('bank details') };
        }
    };

    // Save bank details
    const saveBankDetails = async (bankDetailsData) => {
        try {
            await api.post('/api/payment/bank-details', bankDetailsData);
            // Refresh bank details and wallet data after saving
            await refreshPaymentData();
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Failed to save bank details: ' + (err?.response?.data?.message || err.message) };
        }
    };

    // Export payments to CSV
    const exportPayments = () => {
        if (!payments.length) return;
        
        const headers = ['Transaction ID','Type','Reference','Amount','Status','Date','Description'];
        const rows = payments.map(p => [
            p.id,
            p.transactionType,
            p.reference,
            p.amount,
            p.status,
            p.paymentDate,
            p.description
        ]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'buyer_payments.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Load initial data when user changes
    useEffect(() => {
        if (user?.id) {
            refreshPaymentData();
        }
    }, [user?.id]);

    const contextValue = {
        // Data
        walletData,
        payments,
        bankDetails,
        
        // Loading states
        loading,
        walletLoading,
        bankDetailsLoading,
        
        // Actions
        fetchWalletData,
        fetchBankDetails,
        refreshPaymentData,
        withdrawFunds,
        saveBankDetails,
        exportPayments,
        
        // Setters for local updates
        setWalletData,
        setPayments,
        setBankDetails
    };

    return (
        <PaymentContext.Provider value={contextValue}>
            {children}
        </PaymentContext.Provider>
    );
};

export function usePaymentContext() {
    return useContext(PaymentContext);
}

export default PaymentContextProvider;