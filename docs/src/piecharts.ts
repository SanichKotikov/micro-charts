import { getCanvas } from './helpers';
import { createPieChart } from '../../src/piechart';

const pieChartData = [
  { id: '1', percent: 45, color: '#4CAF50' },
  { id: '2', percent: 19, color: '#E91E63' },
  { id: '3', percent: 16, color: '#00BCD4' },
  { id: '4', percent: 10, color: '#9E9E9E' },
  { id: '5', percent: 9, color: '#FFC107' },
  { id: '6', percent: 1, color: '#CDDC39' },
];

createPieChart(getCanvas('pie-chart-1'), pieChartData, { size: 160 });
createPieChart(getCanvas('pie-chart-2'), pieChartData, { size: 160, stroke: 1 });
createPieChart(getCanvas('pie-chart-3'), pieChartData, { size: 160, variable: true });
createPieChart(getCanvas('pie-chart-4'), pieChartData, { size: 160, variable: true, round: 6 });
