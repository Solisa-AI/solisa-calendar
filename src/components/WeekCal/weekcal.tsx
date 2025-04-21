import React, { useState, useEffect, CSSProperties } from "react";
import type { Event } from "../../types";
import { cn } from "../../lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

type CustomSize = {
  width?: string;
  height?: string;
};

interface WeeklyCalendarProps {
  events: Event[];
  size?: CustomSize;
}

const WeekCal: React.FC<WeeklyCalendarProps> = ({ events, size }) => {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [processedEvents, setProcessedEvents] = useState<{
    [key: string]: {
      allDay: Event[];
      timed: Event[];
    };
  }>({});
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getStartOfWeek = (date: Date): Date => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const formatTime = (hour: number): string => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    return `${hour % 12} ${hour < 12 ? "AM" : "PM"}`;
  };

  const goToPreviousWeek = () => {
    const prevWeek = new Date(currentWeek);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentWeek(prevWeek);
  };

  const goToNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  const calculateEventStyle = (event: Event) => {
    const startTime = new Date(event.start);
    const endTime = new Date(event.end);

    const startHour = startTime.getHours();
    const startMinute = startTime.getMinutes();
    const startFromMidnight = startHour * 60 + startMinute;
    const top = (startFromMidnight / (24 * 60)) * 100;

    const durationMinutes =
      endTime.getHours() * 60 +
      endTime.getMinutes() -
      (startTime.getHours() * 60 + startTime.getMinutes());
    const height = (durationMinutes / (24 * 60)) * 100;
    return {
      top: `${top}%`,
      height: `${height}%`,
      backgroundColor: event.color.background,
      color: event.color.foreground,
    };
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  const formatMonthRange = () => {
    if (!weekDays.length) return "";
    const firstDay = weekDays[0];
    const lastDay = weekDays[6];
    if (!firstDay || !lastDay) return "";
    if (firstDay.getMonth() === lastDay.getMonth()) {
      return `${firstDay.toLocaleString("default", {
        month: "long",
      })} ${firstDay.getFullYear()}`; 
    } else {
      return `${firstDay.toLocaleString("default", {
        month: "short",
      })} - ${lastDay.toLocaleString("default", {
        month: "long",
      })} ${lastDay.getFullYear()}`;
    }
  };

  useEffect(() => {
    const date = currentWeek || new Date();
    const startOfWeek = getStartOfWeek(new Date(date));
    const days = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      return day;
    });
    setWeekDays(days);

    const eventsByDay: {
      [key: string]: {
        allDay: Event[];
        timed: Event[];
      };
    } = {};

    days.forEach((day) => {
      const dateStr = formatDate(day);
      eventsByDay[dateStr] = { allDay: [], timed: [] };
    });

    events.forEach((event) => {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);
      const dateStr = formatDate(startDate);

      if (days.some((day) => formatDate(day) === dateStr)) {
        const isAllDay =
          startDate.getHours() === 0 &&
          startDate.getMinutes() === 0 &&
          (endDate.getHours() === 23 ||
            (endDate.getHours() === 0 &&
              endDate.getDate() > startDate.getDate()));
        if (isAllDay) {
          eventsByDay[dateStr].allDay.push(event);
        } else {
          eventsByDay[dateStr].timed.push(event);
        }
      }
    });
    setProcessedEvents(eventsByDay);
  }, [currentWeek, events]);

  const formatDateTime = (date: Date) => {
    return date.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  let containerStyle: CSSProperties = {};
  let gridContainerClass = "grid grid-cols-8";
  let mainContainerClass = "bg-white rounded-lg shadow overflow-hidden flex flex-col";

  if (typeof size === 'object' && size !== null) {
    if (size.width) {
      containerStyle.width = size.width;
    }
    if (size.height) {
      containerStyle.height = size.height;
      mainContainerClass = cn(mainContainerClass, "h-full");
      gridContainerClass = cn(gridContainerClass, "flex-1 overflow-y-auto");
    } else {
      gridContainerClass = cn(gridContainerClass, "h-[800px] overflow-y-auto"); 
    }
  } else {
    gridContainerClass = cn(gridContainerClass, "h-[800px] overflow-y-auto"); 
  }


  return (
    <>
      <div className={mainContainerClass} style={containerStyle}>
        <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-semibold">{formatMonthRange()}</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className={gridContainerClass}>
          <div className="border-r pt-20 sticky left-0 bg-white z-10 flex-shrink-0">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-10 border-t flex items-start justify-end pr-2 text-sm text-gray-500"
              >
                {formatTime(hour)}
              </div>
            ))}
          </div>
          {weekDays.map((day, index) => (
            <div key={index} className="relative border-r flex-grow">
              <div
                className={cn(
                  "h-20 border-b p-1 text-center sticky top-0 bg-white flex flex-col justify-center z-20",
                  new Date().toDateString() === day.toDateString()
                    ? "bg-blue-50"
                    : ""
                )}
              >
                <div className="text-sm font-medium mb-1">
                  {day.toLocaleString("default", { weekday: "short" })}
                </div>
                <div
                  className={cn(
                    "text-lg inline-flex items-center justify-center w-8 h-8 rounded-full mx-auto",
                    new Date().toDateString() === day.toDateString()
                      ? "bg-blue-500 text-white"
                      : ""
                  )}
                >
                  {day.getDate()}
                </div>
              </div>
              {processedEvents[formatDate(day)]?.allDay.map(
                (event, eventIndex) => (
                  <div
                    key={event.id}
                    className="absolute z-10 left-0 right-0 mx-1 px-2 py-1 rounded text-xs truncate cursor-pointer hover:opacity-80"
                    style={{
                      top: `${80 + eventIndex * 24}px`,
                      backgroundColor: event.color.background,
                      color: event.color.foreground,
                    }}
                    title={event.title}
                    onClick={() => handleEventClick(event)}
                  >
                    {event.title}
                  </div>
                )
              )}
              <div className="relative h-[960px]"> {/* Base height for timed events calculation (24 * 40px/hour) */}
                {hours.map((hour) => (
                  <div key={hour} className="h-10 border-t"></div>
                ))}
                {processedEvents[formatDate(day)]?.timed.map((event) => (
                  <div
                    key={event.id}
                    className="absolute z-10 left-0 right-0 mx-1 px-2 py-1 rounded text-xs overflow-hidden cursor-pointer hover:opacity-80"
                    style={calculateEventStyle(event)}
                    title={`${event.title} (${new Date(
                      event.start
                    ).toLocaleTimeString()} - ${new Date(
                      event.end
                    ).toLocaleTimeString()})`}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="font-semibold">{event.title}</div>
                    <div className="text-xs opacity-80">
                      {new Date(event.start).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -
                      {new Date(event.end).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedEvent && (
        <Dialog open={isDetailsOpen} onOpenChange={handleCloseDetails}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {selectedEvent.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: selectedEvent.color.background }}
                />
                <span className="font-medium">
                  {new Date(selectedEvent.start).getHours() === 0 &&
                    new Date(selectedEvent.start).getMinutes() === 0 &&
                    (new Date(selectedEvent.end).getHours() === 23 ||
                      (new Date(selectedEvent.end).getHours() === 0 &&
                        new Date(selectedEvent.end).getDate() >
                        new Date(selectedEvent.start).getDate())) ? (
                    "All day"
                  ) : (
                    <>
                      {formatDateTime(new Date(selectedEvent.start))} -{" "}
                      {formatDateTime(new Date(selectedEvent.end))}
                    </>
                  )}
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
export default WeekCal;