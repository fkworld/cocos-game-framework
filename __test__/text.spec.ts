import { _init_local } from "../src/local";
import { change_language, get_language, get_text, set_node_text, _init_text } from "../src/text";

beforeEach(() => {
  _init_local({}, true);
  _init_text(
    {
      chinese: { a: "我的名字是{0}" },
      english: { a: "My name is {0}" },
    },
    "chinese",
    "chinese",
  );
});

describe(get_language.name, () => {
  test("", () => {
    expect(get_language()).toBe("chinese");
  });
});

describe(change_language.name, () => {
  test("", () => {
    change_language("english");
    expect(get_language()).toBe("english");
  });
});

describe(get_text.name, () => {
  test("", () => {
    expect(get_text("a", "fy")).toBe("我的名字是fy");
  });
  test("没有此key", () => {
    expect(get_text("b")).toBe("b");
  });
  test("其他语言", () => {
    change_language("english");
    expect(get_text("a", "fy")).toBe("My name is fy");
  });
});

describe(set_node_text.name, () => {
  test("label", () => {
    let n_label = new cc.Node().addComponent(cc.Label);
    set_node_text(n_label.node, "a", "fy");
    expect(n_label.string).toBe("我的名字是fy");
  });
  test("richtext", () => {
    let n_richtext = new cc.Node().addComponent(cc.RichText);
    set_node_text(n_richtext.node, "a", "fy");
    expect(n_richtext.string).toBe("我的名字是fy");
  });
  test.todo("sprite");
});
