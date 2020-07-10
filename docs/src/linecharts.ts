import { getCanvas, getRandomData } from './helpers';
import { createLineChart } from '../../src/linechart';

function getData(count: number) {
  return getRandomData(count)
    .map((value, i) => ({ id: i.toString(), value }));
}

createLineChart(getCanvas('line-chart-1'), getData(10), {
  lineFill: ['rgba(130, 210, 255, 0)', 'rgba(130, 210, 255, 0.3)'],
  rowFont: 'system, -apple-system, BlinkMacSystemFont',
  top: 100,
  bottom: 0,
});

createLineChart(getCanvas('line-chart-2'), getData(6), {
  lineStroke: 0.5,
  lineSmooth: true,
  lineColor: 'red',
  lineFill: ['rgba(255, 193, 7, 0)', 'rgba(255, 193, 7, 0.3)'],
  pointRadius: 1.5,
  rowCount: 4,
  rowStroke: 0.2,
  rowColor: 'rgba(40, 40, 40, .3)',
});
