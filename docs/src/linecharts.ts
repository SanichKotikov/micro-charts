import { getCanvas, getRandomData } from './helpers';
import { createLineChart } from '../../src/linechart';

function getData(count: number) {
  return getRandomData(count)
    .map((value, i) => ({ id: i.toString(), value }))
}

createLineChart(getCanvas('line-chart-1'), getData(10), {
  ratio: 4,
  levelCount: 3,
  levelFont: "8px system, -apple-system, BlinkMacSystemFont",
  top: 100,
  bottom: 0,
});

createLineChart(getCanvas('line-chart-2'), getData(60), {
  stroke: 0.5,
  color: 'red',
  fill: 'transparent',
  pointRadius: 1.5,
  levelCount: 4,
  levelStroke: 0.2,
  levelColor: 'rgba(40, 40, 40, .3)',
});
