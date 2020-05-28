import * as local from "../src/local";
import * as text from "../src/text";

jest.spyOn(local, "get_local").mockReturnValue("chinese");
jest.spyOn(local, "set_local").mockReturnValue(undefined);

text._init_text_runtime({
  chinese: { a: "My name is {0}." },
});

test("get_language", () => {
  expect(text.get_language()).toBe("chinese");
});

test("get_text", () => {
  expect(text.get_text("a", "fy")).toBe("My name is fy.");
});
