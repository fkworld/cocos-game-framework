import { mocked } from "ts-jest/utils";
import * as local from "../src/local";
import * as text from "../src/text";

jest.mock("../src/local");
const mockedLocal = mocked(local, true);
mockedLocal.get_local.mockReturnValue("chinese");
mockedLocal.set_local.mockReturnValue(undefined);

const CONFIG_TEXT: text.ConfigText = {
  a: "My name is {0}.",
};
const CONFIG_LANGUAGE: text.ConfigLanguage = {
  chinese: CONFIG_TEXT,
};
text._init_text_runtime(CONFIG_LANGUAGE);

test("get_language", () => {
  expect(text.get_language()).toBe("chinese");
});

test("get_text", () => {
  expect(text.get_text("a", "fy")).toBe("My name is fy.");
});
