import React, { useState } from "react";
import { format, parseISO } from "date-fns";

// Define your Event type. You can extend or modify these properties as needed.
export interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  color: {
    background: string;
    foreground: string;
  };
}

type EventUIProps = {
  event: Event;
  currentDate: Date;
};

export const EventUI: React.FC<EventUIProps> = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(true);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="cursor-pointer p-1 rounded text-xs overflow-hidden"
        style={{
          backgroundColor: event.color.background,
          color: event.color.foreground,
        }}
      >
        <div className="font-bold truncate">{event.title}</div>
        <div className="text-[10px]">
          {format(parseISO(event.start), "h:mm a")} -{" "}
          {format(parseISO(event.end), "h:mm a")}
        </div>
      </div>

      {showDetails && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="bg-white p-4 rounded shadow-lg max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-2">{event.title}</h3>
            <p className="text-sm mb-2">
              {format(parseISO(event.start), "PPpp")} -{" "}
              {format(parseISO(event.end), "PPpp")}
            </p>
            {event.description && (
              <p className="text-sm mb-2">{event.description}</p>
            )}
            <button
              onClick={() => setShowDetails(false)}
              className="mt-2 text-blue-500 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
