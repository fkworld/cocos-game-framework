import * as random from "../src/tool-random";

test("random", () => {
  expect(Number.isInteger(random.random(0, 10))).toBe(true);
  expect(Number.isInteger(random.random(0, 10, true))).toBe(false);
  // 比例
  let r = {};
  let count = 100000;
  for (let i = 0; i < count; i += 1) {
    let random_int = random.random(0, 3.1);
    r[random_int] = (r[random_int] ?? 0) + 1;
  }
  expect(r[0] / count).toBeCloseTo(0.25);
  expect(r[1] / count).toBeCloseTo(0.25);
  expect(r[2] / count).toBeCloseTo(0.25);
  expect(r[3] / count).toBeCloseTo(0.25);
});

test("random_array_item", () => {
  let r = {};
  let array = [0, 1, 2, 3];
  let count = 100000;
  for (let i = 0; i < count; i += 1) {
    let random_item = random.random_array_item(array);
    r[random_item] = (r[random_item] ?? 0) + 1;
  }
  expect(r[0] / count).toBeCloseTo(0.25);
  expect(r[1] / count).toBeCloseTo(0.25);
  expect(r[2] / count).toBeCloseTo(0.25);
  expect(r[3] / count).toBeCloseTo(0.25);
});

test("random_prob", () => {
  [
    // 超出部分削减为0.2
    [0.5, 0.3, 0.5],
    // 不足部分补足为0.2
    [0.5, 0.3, 0.1],
  ].forEach(prob_array => {
    let r = {};
    let count = 100000;
    for (let i = 0; i < count; i += 1) {
      let random_index = random.random_prob(prob_array);
      r[random_index] = (r[random_index] ?? 0) + 1;
    }
    expect(r[0] / count).toBeCloseTo(prob_array[0]);
    expect(r[1] / count).toBeCloseTo(prob_array[1]);
    expect(r[2] / count).toBeCloseTo(1 - prob_array[0] - prob_array[1]);
  });
});

test("is_prob", () => {
  let r = 0;
  let count = 100000;
  let prob = 0.3;
  for (let i = 0; i < count; i += 1) {
    r += random.is_prob(prob) ? 1 : 0;
  }
  expect(r / count).toBeCloseTo(prob);
});
