import {
  do_delay,
  get_positive_mode,
  get_template_string,
  is_prob,
  random,
  random_array_item,
  random_position,
  random_prob,
} from "../src/tool";

describe(random.name, () => {
  test("整数小数", () => {
    expect(Number.isInteger(random(0, 10))).toBe(true);
    expect(Number.isInteger(random(0, 10, true))).toBe(false);
  });
  test("比例", () => {
    let r = {};
    let count = 100000;
    for (let i = 0; i < count; i += 1) {
      let random_int = random(0, 3.1);
      r[random_int] = (r[random_int] ?? 0) + 1;
    }
    expect(r[0] / count).toBeCloseTo(0.25);
    expect(r[1] / count).toBeCloseTo(0.25);
    expect(r[2] / count).toBeCloseTo(0.25);
    expect(r[3] / count).toBeCloseTo(0.25);
  });
});

describe(random_array_item.name, () => {
  test("", () => {
    let r = {};
    let array = [0, 1, 2, 3];
    let count = 100000;
    for (let i = 0; i < count; i += 1) {
      let random_item = random_array_item(array);
      r[random_item] = (r[random_item] ?? 0) + 1;
    }
    expect(r[0] / count).toBeCloseTo(0.25);
    expect(r[1] / count).toBeCloseTo(0.25);
    expect(r[2] / count).toBeCloseTo(0.25);
    expect(r[3] / count).toBeCloseTo(0.25);
  });
});

describe(random_prob.name, () => {
  test("", () => {
    [
      [0.5, 0.3, 0.5], // 超出部分削减为0.2
      [0.5, 0.3, 0.1], // 不足部分补足为0.2
    ].forEach(prob_array => {
      let r = {};
      let count = 100000;
      for (let i = 0; i < count; i += 1) {
        let random_index = random_prob(prob_array);
        r[random_index] = (r[random_index] ?? 0) + 1;
      }
      expect(r[0] / count).toBeCloseTo(prob_array[0]);
      expect(r[1] / count).toBeCloseTo(prob_array[1]);
      expect(r[2] / count).toBeCloseTo(1 - prob_array[0] - prob_array[1]);
    });
  });
});

describe(is_prob.name, () => {
  test("", () => {
    let r = 0;
    let count = 100000;
    let prob = 0.3;
    for (let i = 0; i < count; i += 1) {
      r += is_prob(prob) ? 1 : 0;
    }
    expect(r / count).toBeCloseTo(prob);
  });
});

describe(random_position.name, () => {
  // TODO
});

describe(get_positive_mode.name, () => {
  test("", () => {
    expect(get_positive_mode(12, 10)).toBe(2);
    expect(get_positive_mode(-12, 10)).toBe(8);
  });
});

describe(do_delay.name, () => {
  test.todo("");
});

describe(get_template_string.name, () => {
  test("", () => {
    let s = "My name is {0}, my age is {2}.";
    let p1 = ["fy", undefined, "16"];
    let p2 = ["fy", "16"];
    expect(get_template_string(s, ...p1)).toBe("My name is fy, my age is 16.");
    expect(get_template_string(s, ...p2)).toBe("My name is fy, my age is {2}.");
  });
});
