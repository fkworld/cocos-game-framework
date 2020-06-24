import {
  D_MS,
  get_day,
  H_MS,
  M_MS,
  S_MS,
  to_ms,
  to_time_format,
  to_time_group,
  to_time_string,
} from "../src/time";

describe("const", () => {
  test("D_MS", () => {
    expect(D_MS).toBe(24 * 60 * 60 * 1000);
  });
  test("H_MS", () => {
    expect(H_MS).toBe(60 * 60 * 1000);
  });
  test("M_MS", () => {
    expect(M_MS).toBe(60 * 1000);
  });
  test("S_MS", () => {
    expect(S_MS).toBe(1000);
  });
});

describe(to_ms.name, () => {
  test("", () => {
    expect(to_ms("1.5d")).toBe(129600000);
    expect(to_ms("1.5")).toBeUndefined();
  });
});

describe(to_time_group.name, () => {
  test("", () => {
    expect(to_time_group(88888)).toEqual({
      h: 0,
      h_fix: 0,
      m: 1,
      m_fix: 1,
      s: 88,
      s_fix: 28,
      ms: 88888,
      ms_fix: 888,
    });
  });
});

describe(to_time_format.name, () => {
  test("", () => {
    expect(to_time_format("1.5d")).toBe("36:00:00");
    expect(to_time_format(129600000)).toBe("36:00:00");
    expect(to_time_format(88888)).toBe("00:01:28");
    expect(to_time_format(88888, false)).toBe("01:28");
  });
});

describe(to_time_string.name, () => {
  test("", () => {
    expect(to_time_string(1590562765277)).toBe("14:59:25 GMT+0800 (GMT+08:00)");
  });
});

describe(get_day.name, () => {
  test("", () => {
    expect(get_day(1590562765277)).toBe(18409);
  });
});
