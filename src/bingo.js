export const LETTERS = ['B', 'I', 'N', 'G', 'O'];
export const BALLS = Array.from({ length: 75 }, (_, index) => index + 1);

export function letterFor(number) {
  return LETTERS[Math.floor((number - 1) / 15)];
}

export function previousFive(history) {
  return history.slice(-6, -1).reverse();
}

export function pickAvailable(called, random = Math.random) {
  const available = BALLS.filter((number) => !called.includes(number));
  if (!available.length) return null;
  return available[Math.floor(random() * available.length)];
}

export function spokenText(number, format) {
  const letter = letterFor(number);
  if (format === 'number') return String(number);
  if (format === 'pause') return `${letter}... ${number}`;
  return `${letter} ${number}`;
}
