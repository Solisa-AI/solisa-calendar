export interface EventColor {
  background: string;
  foreground: string;
}

export interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  color: EventColor;
}

export type CalendarView = 'day' | 'week' | 'month' | 'year';
