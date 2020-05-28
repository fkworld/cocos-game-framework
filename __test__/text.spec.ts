import { mocked } from "ts-jest/utils";
import * as local from "../src/local";
import * as text from "../src/text";

jest.mock("../src/local");
mocked(local.get_local).mockReturnValue("chinese");
mocked(local.set_local).mockReturnValue(undefined);

text._init_text_runtime({
  chinese: { a: "My name is {0}." },
});

test("get_language", () => {
  expect(text.get_language()).toBe("chinese");
});

test("get_text", () => {
  expect(text.get_text("a", "fy")).toBe("My name is fy.");
});
