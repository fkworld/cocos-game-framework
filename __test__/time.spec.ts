import * as time from "../src/time";

test("D_MS", () => {
  expect(time.D_MS).toBe(24 * 60 * 60 * 1000);
});

test("H_MS", () => {
  expect(time.H_MS).toBe(60 * 60 * 1000);
});

test("M_MS", () => {
  expect(time.M_MS).toBe(60 * 1000);
});

test("S_MS", () => {
  expect(time.S_MS).toBe(1000);
});

test("get_day", () => {
  expect(time.get_day(1590562765277)).toBe(18409);
});

test("to_ms", () => {
  expect(time.to_ms("1.5d")).toBe(129600000);
  expect(time.to_ms("1.5")).toBeUndefined();
  expect(time.to_show("1.5d")).toBe("36:00:00");
});

test("to_show", () => {
  expect(time.to_show(129600000)).toBe("36:00:00");
  expect(time.to_show(88888)).toBe("00:01:28");
  expect(time.to_show(88888, false)).toBe("01:28");
});

test("to_timestring", () => {
  expect(time.to_timestring(1590562765277)).toBe("14:59:25 GMT+0800 (GMT+08:00)");
});

test("to_group", () => {
  expect(time.to_group(88888)).toEqual({
    h: 0,
    h_fix: 0,
    m: 1,
    m_fix: 1,
    ms: 88888,
    ms_fix: 888,
    s: 88,
    s_fix: 28,
  });
});
