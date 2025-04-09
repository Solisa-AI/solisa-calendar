current docs


**NextJS**

Examples on how to use each calendar type (day, week, month, year):

Daycal

```
'use client'

import React from 'react';
import { DayCal } from 'solisa-calendar';
import { events } from '@/app/temp/sampledata';

const App = () => (
  <>
    <DayCal
      events={events ?? []} />
  </>
);

export default App;

```

WeekCal

```
'use client'

import React, { useState } from 'react';
import { WeekCal } from 'solisa-calendar';
import { events } from '@/app/temp/sampledata';

const App = () => {
  return (
    <>
      <WeekCal events={events ?? []} />
    </>
  );
};

export default App;

```

MonthCal

```
'use client'

import React, { useState } from 'react';
import { MonthCal } from 'solisa-calendar';
import { events } from '@/app/temp/sampledata';

const App = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  return (
    <>
      <MonthCal events={events ?? []} currentDate={currentDate} />
    </>
  );
};

export default App;

```

YearCal

```
'use client'

import React, { useState } from 'react';
import { YearCal } from 'solisa-calendar';

const App = () => {

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState("month");


  function onSelectDate(day: Date) {
    setCurrentDate(day);
    setView("day");
  }

  function onSelectMonth(month: Date) {
    setCurrentDate(month);
    setView("month");
  }

  return (
    <>
      <YearCal
        currentDate={currentDate}
        onSelectMonth={onSelectMonth}
        onSelectDate={onSelectDate}
      />
    </>
  );
};

export default App;
```