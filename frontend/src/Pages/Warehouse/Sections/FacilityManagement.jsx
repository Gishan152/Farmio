export default function FacilityManagement() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Facility Management</h1>
                <p className="text-gray-600">Add, edit, or delete warehouse details, including slots and capacity</p>
            </div>
            
            <div className="bg-white rounded-lg shadow border p-6">
                <h2 className="text-xl font-semibold mb-4">Add New Warehouse</h2>
                <form className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Warehouse name"
                        className="px-3 py-2 border rounded-lg"
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        className="px-3 py-2 border rounded-lg"
                    />
                    <select className="px-3 py-2 border rounded-lg">
                        <option>Cold Storage (0°C to 14°C)</option>
                        <option>Dry Storage</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Total capacity (kg)"
                        className="px-3 py-2 border rounded-lg"
                    />
                    <button
                        type="submit"
                        className="col-span-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                        Add Warehouse
                    </button>
                </form>
            </div>
        </div>
    );
}