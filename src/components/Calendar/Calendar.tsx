import React, { useState, useMemo } from 'react';
import { CalendarProps, CalendarEvent } from './Calendar.types';
const defaultColorScheme = {
  primary: 'text-blue-500',
  secondary: 'text-gray-500',
  background: 'bg-white',
  text: 'text-black'
};
const Calendar: React.FC<CalendarProps> = ({
  width = '100%',
  height = 'auto',
  colorScheme = defaultColorScheme,
  className = '',
  viewMode = 'month',
  startDayOfWeek = 0,
  initialDate = new Date(),
  locale = 'default',
  events = [],
  onDateSelect,
  onEventClick,
  renderEvent,
  renderHeader
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const getMonthData = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startWeekDay = firstDay.getDay();
    return { daysInMonth, startWeekDay };
  };
  const { daysInMonth, startWeekDay } = useMemo(
    () => getMonthData(currentDate),
    [currentDate]
  );
  const days: (Date | null)[] = [];
  const blankDays = (startWeekDay - startDayOfWeek + 7) % 7;
  for (let i = 0; i < blankDays; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), d));
  }
  const handleDateSelect = (date: Date) => {
    onDateSelect && onDateSelect(date);
  };
  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventClick && onEventClick(event);
  };
  const changeMonth = (offset: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + offset,
      1
    );
    setCurrentDate(newDate);
  };
  const defaultHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={() => changeMonth(-1)}
        className="p-2 rounded hover:bg-gray-200 focus:outline-none"
        aria-label="Previous Month"
      >
        &lt;
      </button>
      <h2 className={`font-bold ${colorScheme.text}`}>
        {currentDate.toLocaleDateString(locale, {
          month: 'long',
          year: 'numeric'
        })}
      </h2>
      <button
        onClick={() => changeMonth(1)}
        className="p-2 rounded hover:bg-gray-200 focus:outline-none"
        aria-label="Next Month"
      >
        &gt;
      </button>
    </div>
  );
  const headerComponent = renderHeader
    ? renderHeader(currentDate, setCurrentDate)
    : defaultHeader();
  const renderDateEvents = (date: Date) => {
    const dayEvents = events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
    return (
      <div className="mt-1 space-y-1">
        {dayEvents.map((event, index) => (
          <div
            key={index}
            onClick={(e) => handleEventClick(event, e)}
            style={event.style}
            className="text-xs p-1 rounded cursor-pointer hover:bg-gray-100"
          >
            {renderEvent ? renderEvent(event) : event.title}
          </div>
        ))}
      </div>
    );
  };
  return (
    <div
      className={`calendar-container ${colorScheme.background} ${className}`}
      style={{ width, height }}
    >
      {headerComponent}
      {viewMode === 'month' && (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {Array.from({ length: 7 }).map((_, i) => {
                const dayIndex = (i + startDayOfWeek) % 7;
                const dayName = new Date(1970, 0, dayIndex + 4).toLocaleDateString(
                  locale,
                  { weekday: 'short' }
                );
                return (
                  <th
                    key={i}
                    className={`p-2 border ${colorScheme.text}`}
                    scope="col"
                  >
                    {dayName}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.ceil(days.length / 7) }).map(
              (_, weekIndex) => (
                <tr key={weekIndex}>
                  {days
                    .slice(weekIndex * 7, weekIndex * 7 + 7)
                    .map((day, index) => (
                      <td
                        key={index}
                        onClick={() => day && handleDateSelect(day)}
                        className="p-2 border h-24 align-top cursor-pointer hover:bg-gray-50 relative"
                      >
                        {day && (
                          <div className="absolute top-1 right-1 text-xs">
                            {day.getDate()}
                          </div>
                        )}
                        {day && renderDateEvents(day)}
                      </td>
                    ))}
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
      {/* Future implementations for week/day views can be added here */}
    </div>
  );
};
export default React.memo(Calendar);
