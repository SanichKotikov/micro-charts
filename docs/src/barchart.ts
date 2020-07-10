import { getCanvas, getRandomData } from './helpers';
import { createBarChart } from '../../src/barchart';

function getData(count: number, bars: number) {
  return Array.from(new Array(count))
    .map((value, i) => ({ id: i.toString(), values: getRandomData(bars) }));
}

createBarChart(
  getCanvas('bar-chart-1'),
  getData(4, 2).map(item => ({ ...item, label: item.values.join(' | ') })),
  {
    barColors: ['#E91E63', '#4CAF50'],
    barWidth: 14,
    barMargin: 0,
    barRadius: 0,
    rowFont: 'system, -apple-system, BlinkMacSystemFont',
    rowFontAlign: 'right',
    top: 100,
    bottom: 0,
    onHoverChange: () => {},
  },
);

createBarChart(getCanvas('bar-chart-2'), getData(6, 3), {
  barColors: ['#00BCD4', '#FFC107', '#CDDC39'],
  rowColor: 'rgba(40, 40, 40, .3)',
  barWidth: 8,
  barMargin: 0.5,
});
