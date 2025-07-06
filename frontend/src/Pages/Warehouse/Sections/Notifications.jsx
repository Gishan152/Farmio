export default function Notifications() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Notifications</h1>
                <p className="text-gray-600">Real-time alerts for bookings, payments, and waste agent responses</p>
            </div>
            
            <div className="space-y-4">
                {[
                    { id: 1, type: 'booking', message: 'New booking #BK001 from Farmer Kumara', time: '2 minutes ago' },
                    { id: 2, type: 'payment', message: 'Payment received for booking #BK002', time: '1 hour ago' },
                    { id: 3, type: 'waste', message: 'Waste agent accepted hire request', time: '3 hours ago' }
                ].map(notification => (
                    <div key={notification.id} className="bg-white border rounded-lg p-4 shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-medium">{notification.message}</p>
                                <p className="text-sm text-gray-500">{notification.time}</p>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">×</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}