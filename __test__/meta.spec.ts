import * as meta from "../src/meta";

meta._init_meta_async(
  JSON.stringify({
    MetaTest: {
      1: { id: "1", name: "fy" },
      2: { id: "2", name: "fyfy" },
    },
  }),
);

@meta.DeSetMetaContext("MetaTest")
class MetaTest extends meta.MetaBase {
  use_special(s: object): void {
    this.id = s["id"];
    this.name = s["name"];
  }
  /** 创建meta类实例时，如果没有源数据，则设置为给定的默认值 */
  use_default(id: string): void {
    this.id = id;
    this.name = `fy${id}`;
  }
  id: string;
  name: string;
}

test("get_meta", () => {
  let meta1 = meta.get_meta(MetaTest, "1");
  expect(meta1.name).toBe("fy");
  let meta2 = meta.get_meta(MetaTest, "2");
  expect(meta2.name).toBe("fyfy");
  let meta3 = meta.get_meta(MetaTest, "3");
  expect(meta3.name).toBe("fy3");
});

test("get_metas", () => {
  let metas = meta.get_metas(MetaTest);
  expect(metas.length).toBe(2);
  expect(metas[0] instanceof MetaTest).toBe(true);
});

test("get_metas_ids", () => {
  expect(meta.get_metas_ids(MetaTest)).toEqual(["1", "2"]);
});

test("_parse_csv", () => {
  expect(meta._parse_csv("#common-line\r\n@id,name\r\n1,fy\r\n2,fyfy\r\n")).toEqual({
    1: { id: "1", name: "fy" },
    2: { id: "2", name: "fyfy" },
  });
});
