export function getCanvas(id: string) {
  return document.getElementById(id) as HTMLCanvasElement;
}

export function times(count: number): undefined[] {
  return Array.from(new Array(count));
}

export function random(min: number, max: number) {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

export function getRandomData(count: number = 10, sum: boolean = false) {
  let total: number = 0;

  return times(count).map(() => {
    const num = sum ? random(0, 100 - total) : random(0, 100);
    total += num;
    return num;
  });
}
