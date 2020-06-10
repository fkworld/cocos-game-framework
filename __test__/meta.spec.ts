import * as meta from "../src/meta";

beforeAll(() => {
  meta._init_meta({
    MetaTest: {
      1: { id: "1", name: "fy" },
      2: { id: "2", name: "fyfy" },
    },
  });
});

@meta.DeSetMetaContext("MetaTest")
class MetaTest extends meta.MetaBase {
  use_special(s: object): void {
    this.id = s["id"];
    this.name = s["name"];
  }
  use_default(id: string): void {
    this.id = id;
    this.name = `fy${id}`;
  }
  id: string;
  name: string;
}

describe(meta.get_meta.name, () => {
  test("special", () => {
    expect(meta.get_meta(MetaTest, "1").name).toBe("fy");
    expect(meta.get_meta(MetaTest, "2").name).toBe("fyfy");
  });
  test("default", () => {
    expect(meta.get_meta(MetaTest, "3").name).toBe("fy3");
  });
  test("error", () => {
    @meta.DeSetMetaContext("MetaError")
    class ErrorMeta extends meta.MetaBase {}
    expect(ErrorMeta.get_meta_source()).toBeUndefined();
  });
});

describe(meta.get_metas.name, () => {
  test("", () => {
    expect(meta.get_metas(MetaTest)).toHaveLength(2);
    expect(meta.get_metas(MetaTest)[0]).toBeInstanceOf(MetaTest);
  });
});

describe(meta.get_metas_ids.name, () => {
  test("", () => {
    expect(meta.get_metas_ids(MetaTest)).toEqual(["1", "2"]);
  });
});
