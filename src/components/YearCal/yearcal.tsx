import React, { useState, CSSProperties } from "react";
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

type CustomSize = {
  width?: string;
  height?: string;
};

type YearCalProps = {
  initialDate?: Date;
  size?: CustomSize;
};

const YearCal: React.FC<YearCalProps> = ({ initialDate, size }) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate || new Date());
  const [view, setView] = useState<"month" | "day" | "year">("year");

  const onSelectDate = (day: Date) => {
    setCurrentDate(day);
    setView("day");
  };

  const onSelectMonth = (month: Date) => {
    setCurrentDate(month);
    setView("month");
  };

  let containerStyle: CSSProperties = {};
  let mainContainerClass = "";

  if (typeof size === 'object' && size !== null) {
    mainContainerClass = "p-2 overflow-auto";
    if (size.width) {
        containerStyle.width = size.width;
    } else {
        mainContainerClass = `${mainContainerClass} w-full`;
    }
    if (size.height) {
        containerStyle.height = size.height;
        mainContainerClass = `${mainContainerClass} h-full`;
    } else {
       mainContainerClass = `${mainContainerClass} h-auto`;
    }
  } else {
    mainContainerClass = "w-full h-full p-2 overflow-auto"; 
    containerStyle.width = '100vw';
    containerStyle.height = '100vh'; 
  }


  if (view === "day") {
    return (
      <div style={containerStyle} className={mainContainerClass}>
        <p>Day view is under construction for {format(currentDate, "PPP")}</p>
        <button onClick={() => setView("year")}>Back to Year View</button>
      </div>
    );
  }

  if (view === "month") {
     return (
       <div style={containerStyle} className={mainContainerClass}>
         <p>Month view is under construction for {format(currentDate, "PPP")}</p>
         <button onClick={() => setView("year")}>Back to Year View</button>
       </div>
     )
  }

  const monthsOfYear = Array.from({ length: 12 }, (_, index) =>
    addMonths(startOfYear(currentDate), index)
  );

  return (
    <div style={containerStyle} className={mainContainerClass}>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 h-full w-full">
        {monthsOfYear.map((month) => {
          const startDate = startOfMonth(month);
          const endDate = endOfMonth(month);
          const daysInMonth = eachDayOfInterval({
            start: startDate,
            end: endDate,
          });
          const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
          const firstDayIndex = getDay(startDate) === 0 ? 7 : getDay(startDate);
          const prevMonthDays = Array.from(
            { length: firstDayIndex - 1 },
            (_, index) => subDays(startDate, firstDayIndex - 1 - index)
          );
          const neededCells = Math.ceil((prevMonthDays.length + daysInMonth.length) / 7) * 7;
          const nextMonthDaysCount = neededCells - (daysInMonth.length + prevMonthDays.length);
          const nextMonthDays = Array.from(
            { length: nextMonthDaysCount },
            (_, index) => addDays(endDate, index + 1)
          );
          const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];

          return (
            <div key={month.toISOString()} className="p-1 flex flex-col">
              <div
                className="text-center text-xs font-bold hover:cursor-pointer mb-1"
                onClick={() => onSelectMonth(month)}
              >
                {format(month, "MMMM")}
              </div>
              <div className="grid grid-cols-7 gap-px text-center text-[9px] font-semibold mb-1">
                {weekdays.map((weekday) => (
                  <div key={weekday} className="p-0.5 text-muted-foreground">
                    {weekday}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 border rounded text-center text-[9px] flex-grow">
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
                      className={`p-1 border-b border-r flex items-center justify-center aspect-square hover:cursor-pointer transition ease-in-out
                            ${ isLastColumn ? "border-r-0" : ""}
                            ${ isLastRow ? "border-b-0" : ""}
                            ${ isTopLeftCorner ? "rounded-tl" : ""}
                            ${ isTopRightCorner ? "rounded-tr" : ""}
                            ${ isBottomLeftCorner ? "rounded-bl" : ""}
                            ${ isBottomRightCorner ? "rounded-br" : ""}
                            ${
                              isToday(day) && isCurrentMonth
                                ? "bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
                                : isCurrentMonth
                                ? "bg-background hover:bg-accent hover:text-accent-foreground"
                                : "bg-background/50 text-muted-foreground/50 hover:bg-accent/50 pointer-events-none"
                            }`}
                      onClick={isCurrentMonth ? () => onSelectDate(day) : undefined}
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