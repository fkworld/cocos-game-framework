import * as text from "../src/text";

text._init_text({
  chinese: { a: "My name is {0}." },
});

test("get_language", () => {
  expect(text.get_language()).toBe("chinese");
});

test("get_text", () => {
  expect(text.get_text("a", "fy")).toBe("My name is fy.");
});
