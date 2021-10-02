export const magnitudeOld = (aX, aY) => {
  return Math.sqrt(aX * aX + aY * aY);
};

export const sum = ([ax, ay], [bx, by]) => [ax + bx, ay + by];
export const dif = ([ax, ay], [bx, by]) => [ax - bx, ay - by];

export const mul = ([x, y], n) => [x * n, y * n];
export const div = ([x, y], n) => [x / n, y / n];

export const magnitude = ([x, y]) => Math.sqrt(x * x + y * y);

export const normalize = (v) => div(v, magnitude(v));
