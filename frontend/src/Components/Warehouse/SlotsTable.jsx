import { formatSlotId } from '../../Utils/slotUtils';

export default function SlotsTable({ slots, getSlotStatusColor, getUsagePercentage }) {
    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-green-600 to-green-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Slot ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Capacity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Used</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Available</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Usage %</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Temperature</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Product Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Reserved By</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {slots.map((slot, index) => {
                            const usagePercentage = slot.utilizationPercentage || getUsagePercentage(slot);
                            const currentLoad = slot.currentLoadKg || 0;
                            const reservedLoad = slot.reservedLoadKg || 0;
                            const totalUsed = currentLoad + reservedLoad;
                            const available = slot.availableCapacity || (slot.capacityKg - totalUsed);
                            
                            return (
                                <tr key={slot.id || slot.slotNumber || `slot-${index}`} className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-semibold text-gray-900">{slot.slotNumber || formatSlotId(slot.id)}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSlotStatusColor(slot)}`}>
                                            {slot.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {slot.capacityKg} kg
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {totalUsed} kg
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                                        {available} kg
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                                                <div 
                                                    className={`h-2 rounded-full transition-all duration-300 ${
                                                        usagePercentage > 90 ? 'bg-red-500' :
                                                        usagePercentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                                                    }`}
                                                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{Math.round(usagePercentage)}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {slot.temperature ? `${slot.temperature}°C` : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <span className="font-medium">{slot.productType || '-'}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {slot.status === 'RESERVED' || slot.status === 'OCCUPIED' ? (
                                            <div>
                                                <div className="font-medium">{slot.reservedByUserName || 'Unknown'}</div>
                                                {slot.reservedUntil && (
                                                    <div className="text-xs text-gray-500">
                                                        Until: {new Date(slot.reservedUntil).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            
            {slots.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-5xl mb-4 animate-pulse">📦</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">No Slots Found</h3>
                    <p className="text-gray-500">Try adjusting your filters to see more results</p>
                </div>
            )}
        </div>
    );
}