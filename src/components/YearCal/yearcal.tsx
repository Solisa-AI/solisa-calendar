import React, { useState } from "react";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  startOfMonth,
  startOfYear,
  subDays,
} from "date-fns";

type YearCalProps = {
  initialDate?: Date;
};

const YearCal: React.FC<YearCalProps> = ({ initialDate }) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate || new Date());
  const [view, setView] = useState<"month" | "day" | "year">("month");

  const onSelectDate = (day: Date) => {
    setCurrentDate(day);
    setView("day");
  };

  const onSelectMonth = (month: Date) => {
    setCurrentDate(month);
    setView("month");
  };

  if (view === "day") {
    return (
      <div>
        <p>Day view is under construction for {format(currentDate, "PPP")}</p>
        <button onClick={() => setView("year")}>Back to Year View</button>
      </div>
    );
  }

  const monthsOfYear = Array.from({ length: 12 }, (_, index) =>
    addMonths(startOfYear(currentDate), index)
  );

  return (
    <div className="w-[100vw] h-[100vh]">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 p-2 h-full w-full">
        {monthsOfYear.map((month) => {
          const startDate = startOfMonth(month);
          const endDate = endOfMonth(month);
          const daysInMonth = eachDayOfInterval({
            start: startDate,
            end: endDate,
          });
          const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
          const firstDayIndex = getDay(startDate) || 7;
          const prevMonthDays = Array.from(
            { length: firstDayIndex - 1 },
            (_, index) => subDays(startDate, firstDayIndex - 1 - index)
          );
          const nextMonthDays = Array.from(
            { length: 42 - (daysInMonth.length + prevMonthDays.length) },
            (_, index) => addDays(endDate, index + 1)
          );
          const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];

          return (
            <div key={month.toISOString()} className="p-2">
              <div
                className="text-center text-[11px] font-bold hover:cursor-pointer"
                onClick={() => onSelectMonth(month)}
              >
                {format(month, "MMMM yyyy")}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-semibold mb-2">
                {weekdays.map((weekday) => (
                  <div key={weekday} className="p-1 text-gray-600">
                    {weekday}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 border rounded text-center text-[9px] hover:cursor-pointer">
                {allDays.map((day, index) => {
                  const isCurrentMonth = day >= startDate && day <= endDate;
                  const isLastColumn = (index + 1) % 7 === 0;
                  const isLastRow = index >= allDays.length - 7;
                  const isTopLeftCorner = index === 0;
                  const isTopRightCorner = index === 6;
                  const isBottomLeftCorner = index === allDays.length - 7;
                  const isBottomRightCorner = index === allDays.length - 1;
                  return (
                    <div
                      key={day.toISOString()}
                      className={`p-2 border-b border-r transition ease-in-out ${
                        isLastColumn ? "border-r-0" : ""
                      } ${isLastRow ? "border-b-0" : ""} ${
                        isTopLeftCorner ? "rounded-tl" : ""
                      } ${isTopRightCorner ? "rounded-tr" : ""} ${
                        isBottomLeftCorner ? "rounded-bl" : ""
                      } ${isBottomRightCorner ? "rounded-br" : ""} ${
                        isToday(day) && isCurrentMonth
                          ? "bg-blue-500 text-white font-semibold"
                          : isCurrentMonth
                          ? "bg-background hover:bg-gray-500"
                          : "bg-background opacity-75 hover:bg-gray-500 hover:text-black text-muted-foreground"
                      }`}
                      onClick={() => onSelectDate(day)}
                    >
                      {format(day, "d")}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YearCal;
