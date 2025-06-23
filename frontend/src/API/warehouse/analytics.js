export const getAnalyticsData = async () => {
    // Simulated API call to fetch analytics data
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                totalFacilities: 25,
                totalBookings: 150,
                activeBookings: 75,
                pendingBookings: 30,
                totalInventoryItems: 200,
                totalCustomers: 100,
                financialOverview: {
                    totalRevenue: 50000,
                    totalExpenses: 20000,
                    netProfit: 30000,
                },
            });
        }, 1000);
    });
};