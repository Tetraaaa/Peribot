export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

export function getRandomArrayValue<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}