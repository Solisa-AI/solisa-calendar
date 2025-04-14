import React, { useState, useCallback, useMemo } from "react";
import {
  addDays,
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
  events: CalendarEvent[] | undefined;
}

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

type MonthViewProps = {
  events: CalendarEvent[];
};

const MonthCal: React.FC<MonthViewProps> = ({ events }) => {
  const [currentDate ] = useState<Date>(new Date());

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const days: Month[] = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = addDays(startDate, 41);
    return eachDayOfInterval({ start: startDate, end: endDate }).map((date) => {
      const dayEvents = events?.filter((event) =>
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

  return (
    <div className="ring-1 ring-border ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
      <div className="grid grid-cols-7 gap-px border-b bg-background text-center text-xs font-semibold leading-6 lg:flex-none">
        {weekdays.map((day) => (
          <div key={day} className="py-2">
            {day.charAt(0)}
            <span className="sr-only sm:not-sr-only">{day.slice(1)}</span>
          </div>
        ))}
      </div>
      <div className="flex bg-border text-xs leading-6 text-muted-foreground lg:flex-auto">
        {/* Larger screen view */}
        <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
          {days.map((day) => (
            <div
              key={day.date.toISOString()}
              className={classNames(
                day.isCurrentMonth ? "bg-background" : "bg-background/70",
                "relative px-3 py-2"
              )}
              onClick={() => onDateClick(day.date)}
            >
              <time
                dateTime={format(day.date, "yyyy-MM-dd")}
                className={classNames(
                  "flex h-6 w-6 items-center justify-center rounded-full",
                  day.isToday && "bg-primary font-semibold text-white",
                  selectedDate &&
                    isSameDay(day.date, selectedDate) &&
                    !day.isToday
                    ? "bg-gray-500 font-semibold text-white"
                    : "",
                  !day.isCurrentMonth && "text-muted-foreground"
                )}
              >
                {format(day.date, "d")}
              </time>
              {day.events?.length! > 0 && (
                <>
                  <ol className="mt-2">
                    {day.events?.slice(0, 2).map((event) => (
                      <li key={event.id} className="grid grid-cols-4 w-full event-fade-in">
                        <EventUI event={event} currentDate={currentDate} />
                        <div className="col-span-1 justify-self-end">
                          <p className="font-semibold text-[11px]">
                            {format(parseISO(event.start), "h a")}
                          </p>
                        </div>
                      </li>
                    ))}
                    {day.events?.length! > 2 && (
                      <Popover>
                        <PopoverTrigger>
                          <div className="text-muted-foreground event-fade-in">
                            + {day.events?.length! - 1} more
                          </div>
                        </PopoverTrigger>
                        <PopoverContent align="start">
                          {day.events?.map((event) => (
                            <div key={`${event.start} week`} className="text-sm mb-2">
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
                </>
              )}
            </div>
          ))}
        </div>
        {/* Mobile view */}
        <div className="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
          {days.map((day) => (
            <button
              key={day.date.toISOString()}
              type="button"
              className={classNames(
                day.isCurrentMonth ? "bg-background" : "bg-background/70",
                (isSameDay(day.date, selectedDate || new Date()) || day.isToday) &&
                  "font-semibold",
                isSameDay(day.date, selectedDate || new Date()) && "text-white",
                !isSameDay(day.date, selectedDate || new Date()) &&
                  day.isToday &&
                  "text-primary",
                !isSameDay(day.date, selectedDate || new Date()) &&
                  day.isCurrentMonth &&
                  !day.isToday &&
                  "text-muted-foreground",
                !isSameDay(day.date, selectedDate || new Date()) &&
                  !day.isCurrentMonth &&
                  !day.isToday &&
                  "text-muted-foreground/70",
                "flex h-14 flex-col px-3 py-2 hover:bg-accent focus:z-10"
              )}
              onClick={() => onDateClick(day.date)}
            >
              <time
                dateTime={format(day.date, "yyyy-MM-dd")}
                className={classNames(
                  "ml-auto",
                  (isSameDay(day.date, selectedDate || new Date()) ||
                    day.isToday) &&
                    "flex h-6 w-6 items-center justify-center rounded-full",
                  isSameDay(day.date, selectedDate || new Date()) &&
                    day.isToday &&
                    "bg-primary",
                  isSameDay(day.date, selectedDate || new Date()) &&
                    !day.isToday &&
                    "bg-gray-500"
                )}
              >
                {format(day.date, "d")}
              </time>
              <span className="sr-only">{day.events?.length} events</span>
              {day.events?.length! > 0 && (
                <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                  {day.events?.map((event) => (
                    <span
                      key={event.id}
                      className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-muted-foreground"
                    />
                  ))}
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
