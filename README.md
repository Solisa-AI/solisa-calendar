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

import React from 'react';
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

import React from 'react';
import { MonthCal } from 'solisa-calendar';
import { events } from '@/app/temp/sampledata';

const App = () => {
  return (
    <>
      <MonthCal events={events ?? []}/>
    </>
  );
};

export default App;
```

YearCal

```
'use client'

import React from 'react';
import { YearCal } from 'solisa-calendar';

const App = () => {

  return (
    <>
      <YearCal/>
    </>
  );
};

export default App;

```




**testing locally**
This is how I test this component locally.


1. In this repo, I ``npm run rollup`` to compile the package locally.
2. In a sample nextjs app, ``npm install`` the path of this package on your machine
3. Use the component as you wish in your sample app.