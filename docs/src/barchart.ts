import { times, getCanvas, getRandomData } from './helpers';
import { createBarChart } from '../../src';

function getData(count: number, bars: number, sum: boolean = false) {
  return times(count).map((value, i) => ({
    id: i.toString(),
    values: getRandomData(bars, sum),
  }));
}

createBarChart(
  getCanvas('bar-chart-1'),
  getData(6, 2),
  {
    barColors: ['#fd5689', '#ffc16f'],
    barWidth: 12,
    barMargin: 0,
    barRadius: 0,
    top: 100,
  },
);

createBarChart(getCanvas('bar-chart-2'), getData(6, 3), {
  barColors: ['#00bcd4', '#ffc107', '#cddc39'],
  rowColor: 'rgba(40, 40, 40, .3)',
  barWidth: 8,
  barMargin: 0.5,
});

createBarChart(getCanvas('bar-chart-3'), getData(10, 2, true), {
  barColors: ['#ff7707', '#cddc39'],
  rowCount: 4,
  rowColor: 'rgba(40, 40, 40, .3)',
  barWidth: 14,
  barRadius: 0,
  stacked: true,
  top: 100,
  bottom: 0,
});

createBarChart(getCanvas('bar-chart-4'), getData(14, 5, true), {
  barColors: ['#01c88d', '#faa93d', '#ffd32e', '#ffcd00', '#d3d3d3'],
  rowColor: 'rgba(40, 40, 40, .3)',
  barWidth: 8,
  barRadius: 0,
  stacked: true,
  top: 100,
  bottom: 0,
});
