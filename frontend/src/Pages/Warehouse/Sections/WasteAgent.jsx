export default function WasteAgent() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Waste Agent Management</h1>
                <p className="text-gray-600">View nearby waste agents and send hire requests</p>
            </div>
            
            <div className="bg-white rounded-lg shadow border p-6">
                <h2 className="text-xl font-semibold mb-4">Nearby Waste Agents (50km radius)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(agent => (
                        <div key={agent} className="border rounded-lg p-4">
                            <h3 className="font-semibold">Green Waste Solutions</h3>
                            <p className="text-sm text-gray-600">Type: Compost</p>
                            <p className="text-sm text-gray-600">Distance: 15 km</p>
                            <p className="text-sm text-gray-600">Rating: ⭐ 4.5</p>
                            <button className="mt-2 w-full bg-green-600 text-white py-2 rounded">Send Hire Request</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}