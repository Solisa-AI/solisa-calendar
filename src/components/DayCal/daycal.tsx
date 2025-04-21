import React, { useState, useEffect, CSSProperties } from "react"
import type { Event } from "../../types"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"

type CustomSize = {
  width?: string
  height?: string
}

interface DailyCalendarProps {
  events: Event[]
  initialDate?: Date
  size?: CustomSize
}

const DayCal: React.FC<DailyCalendarProps> = ({ events, initialDate = new Date(), size }) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate)
  const [processedEvents, setProcessedEvents] = useState<{
    allDay: Event[]
    timed: Event[]
  }>({ allDay: [], timed: [] })
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const hours = Array.from({ length: 24 }, (_, i) => i)

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0]
  }

  const formatTime = (hour: number): string => {
    if (hour === 0) return "12 AM"
    if (hour === 12) return "12 PM"
    return `${hour % 12} ${hour < 12 ? "AM" : "PM"}`
  }

  const goToPreviousDay = () => {
    const prevDay = new Date(currentDate)
    prevDay.setDate(prevDay.getDate() - 1)
    setCurrentDate(prevDay)
  }

  const goToNextDay = () => {
    const nextDay = new Date(currentDate)
    nextDay.setDate(nextDay.getDate() + 1)
    setCurrentDate(nextDay)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const calculateEventStyle = (event: Event) => {
    const startTime = new Date(event.start)
    const endTime = new Date(event.end)

    const startHour = startTime.getHours()
    const startMinute = startTime.getMinutes()
    const startFromMidnight = startHour * 60 + startMinute
    const top = (startFromMidnight / (24 * 60)) * 100

    const durationMinutes =
      endTime.getHours() * 60 + endTime.getMinutes() - (startTime.getHours() * 60 + startTime.getMinutes())
    const height = (durationMinutes / (24 * 60)) * 100

    return {
      top: `${top}%`,
      height: `${height}%`,
      backgroundColor: event.color.background,
      color: event.color.foreground,
      borderColor: event.color.background, // Add border for visibility
    }
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setIsDetailsOpen(true)
  }

  const handleCloseDetails = () => {
    setIsDetailsOpen(false)
  }

  const formatDateHeader = (date: Date): string => {
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  useEffect(() => {
    const dateStr = formatDate(currentDate)
    const dayEvents = {
      allDay: [] as Event[],
      timed: [] as Event[],
    }

    events.forEach((event) => {
      const startDate = new Date(event.start)
      const endDate = new Date(event.end)
      const eventDateStr = formatDate(startDate)

      if (eventDateStr === dateStr) {
        const isAllDay =
          startDate.getHours() === 0 &&
          startDate.getMinutes() === 0 &&
          (endDate.getHours() === 23 || (endDate.getHours() === 0 && endDate.getDate() > startDate.getDate()))

        if (isAllDay) {
          dayEvents.allDay.push(event)
        } else {
          dayEvents.timed.push(event)
        }
      }
    })

    setProcessedEvents(dayEvents)
  }, [currentDate, events])

  const formatDateTime = (date: Date) => {
    return date.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const allDayEventsHeight = processedEvents.allDay.length * 28
  const allDayContainerHeight = allDayEventsHeight > 0 ? allDayEventsHeight + 16 : 0

  let containerStyle: CSSProperties = {}
  let hasCustomHeight = false;
  if (typeof size === 'object' && size !== null) {
      if (size.width) {
          containerStyle.width = size.width;
      }
      if (size.height) {
          containerStyle.height = size.height;
          hasCustomHeight = true;
      }
  }

  const gridContainerClasses = `grid grid-cols-[80px_1fr] ${hasCustomHeight ? 'flex-1 overflow-y-auto' : 'h-[800px] overflow-y-auto'}`;


  return (
    <>
      <div
        className="bg-white rounded-lg shadow overflow-hidden flex flex-col"
        style={containerStyle}
       >
        <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-semibold">{formatDateHeader(currentDate)}</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={goToPreviousDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className={gridContainerClasses}>
          {allDayContainerHeight > 0 && (
            <>
              <div className="col-start-1 col-end-2 border-r border-b p-2 bg-gray-50 flex items-center justify-end pr-2 text-sm text-gray-500 sticky top-0 z-20">
                All day
              </div>
              <div className="col-start-2 col-end-3 relative border-b p-2 sticky top-0 z-20 bg-white" style={{ height: `${allDayContainerHeight}px` }}>
                {processedEvents.allDay.map((event) => (
                  <div
                    key={event.id}
                    className="mb-1 px-2 py-1 rounded text-xs truncate cursor-pointer hover:opacity-80"
                    style={{
                      backgroundColor: event.color.background,
                      color: event.color.foreground,
                    }}
                    title={event.title}
                    onClick={() => handleEventClick(event)}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="col-start-1 col-end-2 border-r sticky left-0 bg-white z-10">
             {hours.map((hour) => (
               <div key={hour} className="h-12 border-t flex items-start justify-end pr-2 text-sm text-gray-500 pt-1">
                 {formatTime(hour)}
               </div>
             ))}
          </div>

          <div className="col-start-2 col-end-3 relative">
             <div className="relative h-[1152px]">
               {hours.map((hour) => (
                 <div key={hour} className="h-12 border-t"></div>
               ))}

               {formatDate(currentDate) === formatDate(new Date()) && (
                 <div
                   className="absolute left-0 right-0 border-t border-red-500 z-20"
                   style={{
                     top: `${((new Date().getHours() * 60 + new Date().getMinutes()) / (24 * 60)) * 100}%`,
                   }}
                 >
                   <div className="w-2 h-2 rounded-full bg-red-500 -mt-1 -ml-1"></div>
                 </div>
               )}

               {processedEvents.timed.map((event) => (
                 <div
                   key={event.id}
                   className="absolute z-10 left-0 right-0 mx-1 px-2 py-0.5 rounded text-xs overflow-hidden cursor-pointer hover:opacity-80 border"
                   style={calculateEventStyle(event)}
                   title={`${event.title} (${new Date(event.start).toLocaleTimeString()} - ${new Date(event.end).toLocaleTimeString()})`}
                   onClick={() => handleEventClick(event)}
                 >
                   <div className="font-semibold truncate">{event.title}</div>
                   <div className="text-[10px] opacity-80">
                     {new Date(event.start).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} -{' '}
                     {new Date(event.end).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>

      {selectedEvent && (
        <Dialog open={isDetailsOpen} onOpenChange={handleCloseDetails}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{selectedEvent.title}</DialogTitle>
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
                      new Date(selectedEvent.end).getDate() > new Date(selectedEvent.start).getDate())) ? (
                    "All day"
                  ) : (
                    <>
                      {formatDateTime(new Date(selectedEvent.start))} - {formatDateTime(new Date(selectedEvent.end))}
                    </>
                  )}
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default DayCal;