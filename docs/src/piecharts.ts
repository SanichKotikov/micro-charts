import { getCanvas } from './helpers';
import { createPieChart } from '../../src';

const pieChartData = [
  { id: '1', percent: 45, color: '#4caf50' },
  { id: '2', percent: 19, color: '#e91e63' },
  { id: '3', percent: 16, color: '#00bcd4' },
  { id: '4', percent: 10, color: '#9e9e9e' },
  { id: '5', percent: 9, color: '#ffc107' },
  { id: '6', percent: 1, color: '#cddc39' },
];

createPieChart(getCanvas('pie-chart-1'), pieChartData);
createPieChart(getCanvas('pie-chart-2'), pieChartData, { stroke: 1 });
createPieChart(getCanvas('pie-chart-3'), pieChartData, { variable: true });
createPieChart(getCanvas('pie-chart-4'), pieChartData, { variable: true, round: 6 });
