import { getCanvas, getRandomData } from './helpers';
import { createLineBarChart } from '../../src/linebarchart';

function getData(count: number, bars: number) {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i.toString(),
    value: getRandomData(1)[0],
    bars: getRandomData(bars),
  }))
}

createLineBarChart(
  getCanvas('line-bar-chart-1'),
  getData(5, 2).map((item, i, self) => ({
    ...item,
    label: [
      i === 0 ? '0' : self[i - 1].value.toString(),
      item.value.toString()
    ].join(' - '),
  })),
  {
    top: 100,
    barColors: ['#E91E63', '#4CAF50'],
    barWidth: 14,
    barMargin: 0,
    barRadius: 0,
    rowFont: 'system, -apple-system, BlinkMacSystemFont',
    rowFontAlign: 'right',
    onHoverChange: () => {},
  }
);

createLineBarChart(
  getCanvas('line-bar-chart-2'),
  getData(7, 3),
  {
    barColors: ['#00BCD4', '#FFC107', '#CDDC39'],
    rowColor: 'rgba(40, 40, 40, .3)',
    barWidth: 8,
    barMargin: 0.5,
    lineStroke: 0.5,
    lineColor: 'red',
    lineFill: 'transparent',
    pointRadius: 1.5,
  }
);
