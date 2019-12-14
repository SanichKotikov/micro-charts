export function getCanvas(id: string) {
  return document.getElementById(id) as HTMLCanvasElement;
}

function random() {
  return (Math.round(Math.random() * 100) % 99) + 1;
}

export function getRandomData(count: number = 10) {
  return Array.from(new Array(count)).map(() => random());
}
