'use client'

import React, { JSX, useState } from 'react';

import DayCal from '../DayCal/daycal';
import MonthCal from '../MonthCal/monthcal'
import WeekCal from '../WeekCal/weekcal'
import YearCal from '../YearCal/yearcal';

import { ChevronDown, ChevronUp } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';

import { CalendarView } from '../../types';

interface FullCalProps {
    /**
     * Optionally restrict which calendar views to include.
     * Defaults to all four: ['day', 'week', 'month', 'year'].
     */
    availableViews?: CalendarView[];

    /**
     * Optional events prop to be passed to calendars which require it.
     */
    events?: any[];

    /**
     * Optionally set the default view to display (defaults to 'day').
     */
    defaultView?: CalendarView;
}

const FullCal: React.FC<FullCalProps> = ({
    availableViews = ['day', 'week', 'month', 'year'],
    events,
    defaultView = 'day',
}) => {
    const [view, setView] = useState<CalendarView>(defaultView);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const calendarComponents: Record<CalendarView, JSX.Element> = {
        day: <DayCal events={events ?? []} />,
        week: <WeekCal events={events ?? []} />,
        month: <MonthCal events={events ?? []} />,
        year: <YearCal />,
    };

    return (
        <div className="p-4">
            <DropdownMenu onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white rounded-md transition">
                    View Options
                    {isDropdownOpen ? (
                        <ChevronUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ChevronDown className="ml-2 h-4 w-4" />
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md w-48">
                    <DropdownMenuLabel className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                        Switch Calendar View
                    </DropdownMenuLabel>
                    {availableViews.includes('day') && (
                        <DropdownMenuItem
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                            onClick={() => setView('day')}
                        >
                            Day
                        </DropdownMenuItem>
                    )}
                    {availableViews.includes('week') && (
                        <DropdownMenuItem
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                            onClick={() => setView('week')}
                        >
                            Week
                        </DropdownMenuItem>
                    )}
                    {availableViews.includes('month') && (
                        <DropdownMenuItem
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                            onClick={() => setView('month')}
                        >
                            Month
                        </DropdownMenuItem>
                    )}
                    {availableViews.includes('year') && (
                        <DropdownMenuItem
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                            onClick={() => setView('year')}
                        >
                            Year
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="mt-4">{calendarComponents[view]}</div>
        </div>
    );
};

export default FullCal;
