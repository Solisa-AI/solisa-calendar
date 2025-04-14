# NextJS

## How to use each calendar type (day, week, month, year):

## Daycal

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


### Props

| Prop   | Type    | Default | Description                                                     |
| ------ | ------- | ------- | --------------------------------------------------------------- |
| events | `any[]` | `[]`    | Array of event objects to be displayed in the day view.         |

## WeekCal

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

### Props

| Prop   | Type    | Default | Description                                                     |
| ------ | ------- | ------- | --------------------------------------------------------------- |
| events | `any[]` | `[]`    | Array of event objects to be displayed in the week view.        |


## MonthCal

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

### Props

| Prop   | Type    | Default | Description                                                     |
| ------ | ------- | ------- | --------------------------------------------------------------- |
| events | `any[]` | `[]`    | Array of event objects to be displayed in the month view.       |


## YearCal

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

### Props

`YearCal` does not require any props.

## FullCal
FullCal creates a dropdown menu where users can switch between calendar types.

Example src:
```
'use client'

import { FullCal } from 'solisa-calendar';
import { events } from '@/app/temp/sampledata';

const App = () => {
  return (
    <FullCal availableViews={['week', 'month']} events={events} defaultView="week" /> 
  );
};

export default App;

```

### Props

| Prop             | Type                                     | Default                                        | Description                                                                                           |
| ---------------- | ---------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `availableViews` | `('day' \| 'week' \| 'month' \| 'year')[]` | `['day', 'week', 'month', 'year']`              | Optional array to specify which calendar views to include in the dropdown.                            |
| `events`         | `any[]`                                  | `undefined`                                    | Optional events array to be passed to the Day, Week, and Month calendar components.                   |
| `defaultView`    | `'day' \| 'week' \| 'month' \| 'year'`     | `'day'`                                        | Optional prop to set the initial calendar view when the component loads.                            |


# Testing Locally
This is how I test these components locally.


1. In this repo, I ``npm run rollup`` to compile the package locally.
2. In a sample nextjs app, ``npm install`` the path of this package on your machine
3. Use the component as you wish in your sample app.