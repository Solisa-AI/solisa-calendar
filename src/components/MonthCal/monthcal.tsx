import React, { useState, useCallback, useMemo, CSSProperties } from "react";
import {
  addDays,
  addMonths,
  subMonths,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { Event as CalendarEvent } from "../../types";
import { EventUI } from "../Event/event";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

interface Month {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}


type CustomSize = {
  width?: string;  
  height?: string; 
};

type MonthViewProps = {
  events: CalendarEvent[];
  size?: CustomSize;
};

const MonthCal: React.FC<MonthViewProps> = ({ events, size }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const days: Month[] = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = addDays(startDate, 41);

    return eachDayOfInterval({ start: startDate, end: endDate }).map((date) => {
      const dayEvents = events.filter((event) =>
        isSameDay(parseISO(event.start), date)
      );
      return {
        date,
        isCurrentMonth: isSameMonth(date, currentDate),
        isToday: isToday(date),
        events: dayEvents,
      };
    });
  }, [currentDate, events]);

  const onDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const prevMonth = () => setCurrentDate((d) => subMonths(d, 1));
  const nextMonth = () => setCurrentDate((d) => addMonths(d, 1));



  let containerStyle: CSSProperties = {};
  let baseContainerClass = "ring-1 ring-border ring-opacity-5 lg:flex lg:flex-col mx-auto";
  let finalContainerClass = baseContainerClass;
  let gridWrapperClass = "flex bg-border text-xs leading-6 text-muted-foreground";
  let desktopGridClass = "hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px";


  if (typeof size === 'object' && size !== null) {
    let hasCustomHeight = false;
    if (size.width) {
      containerStyle.width = size.width;
    }
    if (size.height) {
      containerStyle.height = size.height;
      hasCustomHeight = true;
      containerStyle.overflow = 'hidden';
      gridWrapperClass = classNames(gridWrapperClass, "flex-1 overflow-hidden");
      desktopGridClass = classNames(desktopGridClass, "h-full overflow-y-auto");
    } else {
      finalContainerClass = classNames(baseContainerClass, "lg:flex-auto");
      gridWrapperClass = classNames(gridWrapperClass, "lg:flex-auto");
    }
    if (hasCustomHeight) {
      finalContainerClass = finalContainerClass.replace('lg:flex-auto', '').trim();
      gridWrapperClass = gridWrapperClass.replace('lg:flex-auto', '').trim();
    }

  } else {
    finalContainerClass = classNames(baseContainerClass, "lg:flex-auto");
    gridWrapperClass = classNames(gridWrapperClass, "lg:flex-auto");
  }

  return (
    <div
      className={finalContainerClass}
      style={containerStyle}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b bg-background flex-shrink-0"> 
        <button onClick={prevMonth} className="px-2 py-1 rounded hover:bg-accent" aria-label="Previous Month">&lt;</button>
        <h2 className="text-lg font-semibold">{format(currentDate, "MMMM yyyy")}</h2>
        <button onClick={nextMonth} className="px-2 py-1 rounded hover:bg-accent" aria-label="Next Month">&gt;</button>
      </div>

      <div className="grid grid-cols-7 gap-px border-b bg-background text-center text-xs font-semibold leading-6 lg:flex-none flex-shrink-0"> 
        {weekdays.map((day) => (
          <div key={day} className="py-2">
            {day.charAt(0)}<span className="sr-only sm:not-sr-only">{day.slice(1)}</span>
          </div>
        ))}
      </div>

      <div className={gridWrapperClass}>
        <div className={desktopGridClass}>
          {days.map((day) => (
            <div
              key={day.date.toISOString()}
              className={classNames(
                day.isCurrentMonth ? "bg-background" : "bg-background/70 text-muted-foreground/50",
                "relative px-3 py-2 cursor-pointer min-h-[7rem] flex flex-col hover:bg-accent/50", 
                !day.isCurrentMonth && "pointer-events-none"
              )}
              onClick={() => day.isCurrentMonth && onDateClick(day.date)}
            >
              <time
                dateTime={format(day.date, "yyyy-MM-dd")}
                className={classNames(
                  "flex h-6 w-6 items-center justify-center rounded-full self-start mb-1",
                  day.isToday && "bg-primary font-semibold text-primary-foreground",
                  selectedDate && isSameDay(day.date, selectedDate) && !day.isToday && day.isCurrentMonth
                    ? "bg-accent font-semibold text-accent-foreground ring-2 ring-ring ring-offset-1 ring-offset-background"
                    : "",
                  !day.isCurrentMonth && !day.isToday && "text-muted-foreground/50"
                )}
              >
                {format(day.date, "d")}
              </time>
              {day.events.length > 0 && day.isCurrentMonth && (
                <ol className="mt-1 space-y-1 flex-grow overflow-hidden"> 
                  {day.events.slice(0, 2).map((event) => (
                    <li key={event.id} className="w-full event-fade-in group relative pr-1">
                      <EventUI event={event} currentDate={currentDate} />
                    </li>
                  ))}
                  {day.events.length > 2 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="text-muted-foreground hover:text-foreground text-[10px] mt-1 p-0 h-auto event-fade-in text-left">
                          + {day.events.length - 2} more
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-2 max-h-60 overflow-y-auto">
                        <div className="font-semibold text-sm mb-2 px-1">{format(day.date, "MMM d, yyyy")}</div>
                        {day.events.map((event) => (
                          <div key={`${event.id}-full`} className="text-sm mb-1 rounded hover:bg-accent p-1 cursor-default">
                            <p className="flex justify-start text-muted-foreground font-bold text-[10px] sm:text-xs">
                              {format(parseISO(event.start), "h:mm a")}
                            </p>
                            <EventUI event={event} currentDate={currentDate} />
                          </div>
                        ))}
                      </PopoverContent>
                    </Popover>
                  )}
                </ol>
              )}
            </div>
          ))}
        </div>

        {/* Mobile View*/}
        <div className={classNames(
          "isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden",
          typeof size === 'object' && size?.height && "h-full overflow-y-auto"
        )}>
          {days.map((day) => (
            <button
              key={day.date.toISOString()}
              type="button"
              className={classNames(
                day.isCurrentMonth ? "bg-background" : "bg-background/70",
                isSameDay(day.date, selectedDate || new Date()) && day.isCurrentMonth && "bg-accent text-accent-foreground", 
                !isSameDay(day.date, selectedDate || new Date()) && day.isToday && day.isCurrentMonth && "text-primary font-semibold",
                !day.isCurrentMonth && "text-muted-foreground/50", 
                "flex h-14 flex-col px-1 py-2 hover:bg-accent/50 focus:z-10 relative",
                !day.isCurrentMonth && "pointer-events-none"
              )}
              onClick={() => day.isCurrentMonth && onDateClick(day.date)}
              disabled={!day.isCurrentMonth}
            >
              <time
                dateTime={format(day.date, "yyyy-MM-dd")}
                className={classNames(
                  "ml-auto text-xs", 
                  day.isToday && day.isCurrentMonth && "flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground", 
                  isSameDay(day.date, selectedDate || new Date()) && day.isCurrentMonth && !day.isToday && "ring-1 ring-ring rounded-full" 
                )}
              >
                {format(day.date, "d")}
              </time>
              <span className="sr-only">{day.events.length} events</span>
              {day.events.length > 0 && day.isCurrentMonth && (
                <span className="-mx-0.5 mt-auto flex flex-wrap-reverse justify-end">
                  {day.events.slice(0, 3).map((event) => (
                    <span key={event.id} className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  ))}
                  {day.events.length > 3 && (<span className="mx-0.5 mb-1 text-[8px] leading-none">+</span>)}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthCal;