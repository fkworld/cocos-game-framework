import * as native from "../src/native";

window["jsb"] = {
  reflection: { callStaticMethod: () => {} },
  Downloader: undefined,
  fileUtils: undefined,
};
jest.spyOn(native, "is_ios").mockReturnValue(true);
jest.spyOn(native, "is_android").mockReturnValue(true);
jest.spyOn(jsb.reflection, "callStaticMethod").mockImplementation((p1, p2, p3, p4) => {
  let params = JSON.parse(native.is_ios() ? p3 : p4);
  let call_id = params["call_id"];
  let call_result = "1024";
  window["NativeCallback"](call_id, call_result);
  return call_result;
});

test("call", () => {
  expect(native.call("", {})).toBe("1024");
});

test("call_async", () => {
  jest.spyOn(native, "is_ios").mockReturnValue(false);
  expect(native.call_async("", {})).resolves.toBe("1024");
});
