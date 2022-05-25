import { getCanvas, getRandomData } from './helpers';
import { createLineBarChart } from '../../src';

function getData(count: number, bars: number) {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i.toString(),
    value: getRandomData(1)[0],
    bars: getRandomData(bars),
  }));
}

createLineBarChart(
  getCanvas('line-bar-chart-1'),
  getData(6, 2).map((item, i, self) => ({
    ...item,
    label: [
      i === 0 ? '0' : self[i - 1].value.toString(),
      item.value.toString(),
    ].join(' - '),
  })),
  {
    top: 100,
    barColors: ['rgba(30,125,233,0.5)', 'rgba(16,194,194,0.5)'],
    barWidth: 10,
    barMargin: 0,
    barRadius: 0,
    lineColor: 'rgba(30,125,233,0.5)',
    lineFill: ['rgba(130, 210, 255, 0)', 'rgba(130, 210, 255, 0.3)'],
    rowFont: 'system, -apple-system, BlinkMacSystemFont',
    rowFontAlign: 'right',
    rowRenderValue: (value: number) => `$${Math.round(value)}`,
    onHoverChange: () => {},
  },
);

createLineBarChart(
  getCanvas('line-bar-chart-2'),
  getData(6, 3),
  {
    barColors: ['#00bcd4', '#ffc107', '#cddc39'],
    rowColor: 'rgba(40, 40, 40, .3)',
    barWidth: 8,
    barMargin: 0.5,
    lineStroke: 0.5,
    lineSmooth: true,
    lineColor: 'red',
    lineFill: 'transparent',
    rowFont: 'system, -apple-system, BlinkMacSystemFont',
    rowFontAlign: 'right',
    pointRadius: 1.5,
  },
);
