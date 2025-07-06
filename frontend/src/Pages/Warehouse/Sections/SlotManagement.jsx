export default function SlotManagement() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Slot Management</h1>
                <p className="text-gray-600">Display and manage available slots and weight/quantity capacity</p>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(slot => (
                    <div key={slot} className="bg-white border rounded-lg p-4 shadow">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">Slot {slot}</h3>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                Available
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">Capacity: 100 kg</p>
                        <p className="text-sm text-gray-600">Used: 0 kg</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}