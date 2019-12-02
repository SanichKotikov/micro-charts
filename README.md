# micro-charts

A tiny library (~1.3kb gz) for visualizing your data.  
Note: there is only pie chart right now.

## Example 🖥

```js
import { createPieChart } from 'micro-charts/lib/piechart';

const data = [
  { id: '1', percent: 45, color: '#4CAF50' },
  { id: '2', percent: 19, color: '#E91E63' },
  { id: '3', percent: 16, color: '#00BCD4' },
  { id: '4', percent: 10, color: '#9E9E9E' },
  { id: '5', percent: 9, color: '#FFC107' },
  { id: '6', percent: 1, color: '#CDDC39' },
];

const canvas = document.getElementById('canvas');
const options = { size: 160, variable: true, round: 6 };

createPieChart(canvas, data, options);
```

## Install

```bash
npm i -S micro-charts
```
