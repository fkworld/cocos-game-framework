import * as text from "../src/text";

beforeAll(() => {
  text._init_text({
    chinese: { a: "My name is {0}." },
  });
});

describe(text.get_language.name, () => {
  test("", () => {
    expect(text.get_language()).toBe("chinese");
  });
});

describe(text.get_text.name, () => {
  test("", () => {
    expect(text.get_text("a", "fy")).toBe("My name is fy.");
  });
});

describe(text.set_node_text.name, () => {
  test("label", () => {
    let n_label = new cc.Node().addComponent(cc.Label);
    text.set_node_text(n_label.node, "a", "fy");
    expect(n_label.string).toBe("My name is fy.");
  });
  test("richtext", () => {
    let n_richtext = new cc.Node().addComponent(cc.RichText);
    text.set_node_text(n_richtext.node, "a", "fy");
    expect(n_richtext.string).toBe("My name is fy.");
  });
  test.todo("sprite");
});
