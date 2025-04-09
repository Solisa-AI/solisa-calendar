export interface CalendarEvent {
    date: Date;
    title: string;
    description?: string;
    style?: React.CSSProperties;
  }
  
  export interface ColorScheme {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
  }
  
  export type ViewMode = 'month' | 'week' | 'day';
  
  export interface CalendarProps {
    width?: number | string;
    height?: number | string;
    colorScheme?: ColorScheme;
    className?: string;
    viewMode?: ViewMode;
    startDayOfWeek?: number; // 0 for Sunday, 1 for Monday, etc.
    initialDate?: Date;
    locale?: string;
    events?: CalendarEvent[];
    onDateSelect?: (date: Date) => void;
    onEventClick?: (event: CalendarEvent) => void;
    renderEvent?: (event: CalendarEvent) => React.ReactNode;
    renderHeader?: (
      currentDate: Date,
      changeDate: (date: Date) => void
    ) => React.ReactNode;
  }
  