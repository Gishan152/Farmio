export default function Analytics() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Analytics & Reports</h1>
                <p className="text-gray-600">Insights into warehouse operations and revenue</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow border p-6">
                    <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
                    <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                        <p className="text-gray-500">Revenue Chart Placeholder</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow border p-6">
                    <h3 className="text-lg font-semibold mb-4">Slot Usage</h3>
                    <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                        <p className="text-gray-500">Usage Chart Placeholder</p>
                    </div>
                </div>
            </div>
        </div>
    );
}