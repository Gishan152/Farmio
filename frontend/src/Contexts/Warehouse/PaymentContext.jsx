import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const PaymentContext = createContext();

export const usePayment = () => {
    const context = useContext(PaymentContext);
    if (!context) {
        throw new Error('usePayment must be used within a PaymentProvider');
    }
    return context;
};

export const PaymentProvider = ({ children }) => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Sample payment data
    const samplePayments = [
        {
            id: "PAY-001",
            bookingId: "BK001",
            farmerName: "Farmer Kumara",
            buyerName: null,
            produce: "Rice",
            quantity: 500,
            duration: 14,
            baseCost: 1750,
            bufferDays: 3,
            bufferCost: 375,
            baseFee: 212.5,
            totalAmount: 2337.5,
            paidAmount: 2337.5,
            refundAmount: 0,
            status: "settled",
            escrowStatus: "released",
            paymentDate: "2024-01-20",
            releaseDate: "2024-02-03",
            payHereReceiptId: "PH-123456789",
            warehouseId: "WH-001",
            isEarlyRetrieval: false
        },
        {
            id: "PAY-002",
            bookingId: "BK002",
            farmerName: "Green Valley Co-op",
            buyerName: null,
            produce: "Vegetables",
            quantity: 300,
            duration: 7,
            baseCost: 630,
            bufferDays: 3,
            bufferCost: 270,
            baseFee: 90,
            totalAmount: 990,
            paidAmount: 990,
            refundAmount: 180,
            status: "refunded",
            escrowStatus: "released",
            paymentDate: "2024-01-18",
            releaseDate: "2024-01-23",
            payHereReceiptId: "PH-987654321",
            warehouseId: "WH-001",
            isEarlyRetrieval: true,
            earlyRetrievalDetails: {
                usedDays: 5,
                unusedDays: 2,
                refundAmount: 180,
                ownerAmount: 810
            }
        },
        {
            id: "PAY-003",
            bookingId: "BK004",
            farmerName: "Silva Farms",
            buyerName: null,
            produce: "Fruits",
            quantity: 200,
            duration: 10,
            baseCost: 700,
            bufferDays: 3,
            bufferCost: 210,
            baseFee: 91,
            totalAmount: 1001,
            paidAmount: 1001,
            refundAmount: 0,
            status: "held",
            escrowStatus: "held",
            paymentDate: "2024-01-25",
            releaseDate: null,
            payHereReceiptId: "PH-555666777",
            warehouseId: "WH-001",
            isEarlyRetrieval: false
        }
    ];

    // Use useCallback to memoize the function and prevent infinite re-renders
    const loadPayments = useCallback(async (filters = {}) => {
        setLoading(true);
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));
            
            let filteredPayments = [...samplePayments];
            
            if (filters.status && filters.status !== 'all') {
                filteredPayments = filteredPayments.filter(payment => payment.status === filters.status);
            }
            
            if (filters.warehouseId && filters.warehouseId !== 'all') {
                filteredPayments = filteredPayments.filter(payment => payment.warehouseId === filters.warehouseId);
            }
            
            if (filters.startDate) {
                filteredPayments = filteredPayments.filter(payment => 
                    new Date(payment.paymentDate) >= new Date(filters.startDate)
                );
            }
            
            if (filters.endDate) {
                filteredPayments = filteredPayments.filter(payment => 
                    new Date(payment.paymentDate) <= new Date(filters.endDate)
                );
            }
            
            setPayments(filteredPayments);
        } catch (error) {
            console.error('Error loading payments:', error);
            setError('Failed to load payments');
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array since samplePayments is static

    const releasePayment = useCallback(async (paymentId) => {
        try {
            setPayments(prev => prev.map(payment => 
                payment.id === paymentId 
                    ? { ...payment, status: 'settled', escrowStatus: 'released', releaseDate: new Date().toISOString().split('T')[0] }
                    : payment
            ));
        } catch (error) {
            console.error('Error releasing payment:', error);
            throw error;
        }
    }, []);

    const processRefund = useCallback(async (paymentId, refundData) => {
        try {
            setPayments(prev => prev.map(payment => 
                payment.id === paymentId 
                    ? { 
                        ...payment, 
                        status: 'refunded', 
                        escrowStatus: 'released',
                        refundAmount: refundData.refundAmount,
                        releaseDate: new Date().toISOString().split('T')[0]
                    }
                    : payment
            ));
        } catch (error) {
            console.error('Error processing refund:', error);
            throw error;
        }
    }, []);

    const exportPayments = useCallback(async (format = 'csv', filters = {}) => {
        try {
            const filteredPayments = payments.filter(payment => {
                if (filters.status && filters.status !== 'all' && payment.status !== filters.status) return false;
                if (filters.warehouseId && filters.warehouseId !== 'all' && payment.warehouseId !== filters.warehouseId) return false;
                return true;
            });
            
            if (format === 'csv') {
                const headers = ['Payment ID', 'Booking ID', 'Customer', 'Produce', 'Quantity', 'Amount', 'Status', 'Date'];
                const csvContent = [
                    headers.join(','),
                    ...filteredPayments.map(payment => [
                        payment.id,
                        payment.bookingId,
                        payment.farmerName || payment.buyerName,
                        payment.produce,
                        payment.quantity,
                        payment.totalAmount,
                        payment.status,
                        payment.paymentDate
                    ].join(','))
                ].join('\n');
                
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error exporting payments:', error);
            throw error;
        }
    }, [payments]);

    // Initial load on mount
    useEffect(() => {
        loadPayments();
    }, [loadPayments]);

    const value = {
        payments,
        loading,
        error,
        loadPayments,
        releasePayment,
        processRefund,
        exportPayments
    };

    return (
        <PaymentContext.Provider value={value}>
            {children}
        </PaymentContext.Provider>
    );
};