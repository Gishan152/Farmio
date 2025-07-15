import { useState } from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function BookingCalendar({ slots = [] }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    // Get current month and year
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get first day of month and number of days
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    // Month names
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Day names
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Navigate months
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };

    // Get bookings for a specific date
    const getBookingsForDate = (date) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
        return slots.filter(slot => 
            slot.status === 'booked' && 
            slot.bookedUntil === dateStr
        );
    };

    // Get slot status for a date
    const getDateStatus = (date) => {
        const bookings = getBookingsForDate(date);
        if (bookings.length === 0) return 'available';
        if (bookings.length < 5) return 'partial';
        return 'full';
    };

    // Generate calendar days
    const generateCalendarDays = () => {
        const days = [];
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDayWeekday; i++) {
            days.push(null);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }
        
        return days;
    };

    const calendarDays = generateCalendarDays();

    const handleDateClick = (date) => {
        if (date) {
            setSelectedDate(date);
        }
    };

    const getSelectedDateBookings = () => {
        if (!selectedDate) return [];
        return getBookingsForDate(selectedDate);
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <CalendarIcon className="h-6 w-6 text-green-600 mr-2" />
                        <h2 className="text-xl font-semibold text-gray-900">Booking Calendar</h2>
                    </div>
                    
                    {/* Month Navigation */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={goToPreviousMonth}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                        </button>
                        
                        <h3 className="text-lg font-semibold text-gray-900 min-w-[180px] text-center">
                            {months[currentMonth]} {currentYear}
                        </h3>
                        
                        <button
                            onClick={goToNextMonth}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendar Grid */}
                    <div className="lg:col-span-2">
                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {days.map(day => (
                                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar days */}
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((date, index) => {
                                if (!date) {
                                    return <div key={index} className="p-3"></div>;
                                }

                                const dateStatus = getDateStatus(date);
                                const isSelected = selectedDate === date;
                                const isToday = new Date().getDate() === date && 
                                               new Date().getMonth() === currentMonth && 
                                               new Date().getFullYear() === currentYear;

                                return (
                                    <button
                                        key={date}
                                        onClick={() => handleDateClick(date)}
                                        className={`
                                            p-3 text-sm font-medium rounded-lg border transition-all duration-200 hover:scale-105
                                            ${isSelected 
                                                ? 'bg-green-600 text-white border-green-600 shadow-lg' 
                                                : isToday
                                                ? 'bg-blue-100 text-blue-900 border-blue-300'
                                                : dateStatus === 'full'
                                                ? 'bg-red-100 text-red-900 border-red-300'
                                                : dateStatus === 'partial'
                                                ? 'bg-yellow-100 text-yellow-900 border-yellow-300'
                                                : 'bg-gray-50 text-gray-900 border-gray-200 hover:bg-gray-100'
                                            }
                                        `}
                                    >
                                        <div>{date}</div>
                                        {dateStatus !== 'available' && (
                                            <div className="flex justify-center mt-1">
                                                <div className={`w-1 h-1 rounded-full ${
                                                    dateStatus === 'full' ? 'bg-red-500' : 'bg-yellow-500'
                                                }`}></div>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="mt-6 flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded mr-2"></div>
                                <span className="text-gray-600">Available</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded mr-2"></div>
                                <span className="text-gray-600">Partially Booked</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-red-100 border border-red-300 rounded mr-2"></div>
                                <span className="text-gray-600">Fully Booked</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded mr-2"></div>
                                <span className="text-gray-600">Today</span>
                            </div>
                        </div>
                    </div>

                    {/* Selected Date Details */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-3">
                                {selectedDate 
                                    ? `${months[currentMonth]} ${selectedDate}, ${currentYear}`
                                    : 'Select a date'
                                }
                            </h4>
                            
                            {selectedDate ? (
                                <div className="space-y-3">
                                    {getSelectedDateBookings().length > 0 ? (
                                        <>
                                            <p className="text-sm text-gray-600">
                                                {getSelectedDateBookings().length} booking(s) ending this date:
                                            </p>
                                            <div className="space-y-2">
                                                {getSelectedDateBookings().map((booking, index) => (
                                                    <div key={index} className="bg-white p-3 rounded border border-gray-200">
                                                        <div className="text-sm">
                                                            <div className="font-medium text-gray-900">Slot #{booking.id}</div>
                                                            <div className="text-gray-600">Booked by: {booking.bookedBy}</div>
                                                            <div className="text-gray-600">Produce: {booking.produce}</div>
                                                            <div className="text-gray-600">
                                                                Capacity: {booking.used}/{booking.capacity} kg
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-4">
                                            <div className="text-2xl mb-2">📅</div>
                                            <p className="text-sm text-gray-500">No bookings ending on this date</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-3xl mb-2">👆</div>
                                    <p className="text-sm text-gray-500">Click on a date to see booking details</p>
                                </div>
                            )}
                        </div>

                        {/* Quick Stats */}
                        <div className="mt-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-4">
                            <h5 className="font-semibold mb-3">This Month</h5>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Total Bookings:</span>
                                    <span className="font-medium">{slots.filter(s => s.status === 'booked').length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Available Slots:</span>
                                    <span className="font-medium">{slots.filter(s => s.status === 'available').length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Occupancy Rate:</span>
                                    <span className="font-medium">
                                        {Math.round((slots.filter(s => s.status === 'booked').length / slots.length) * 100)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}