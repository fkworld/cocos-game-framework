import {
  DE_SET_META_CONTEXT,
  get_meta,
  get_metas,
  get_metas_id,
  MetaBase,
  parse_csv_all,
  _init_meta,
  _parse_csv,
} from "../src/meta";

beforeEach(() => {
  _init_meta({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    MetaTest: {
      1: { id: "1", name: "fy" },
      2: { id: "2", name: "fyfy" },
    },
  });
});

@DE_SET_META_CONTEXT("MetaTest")
class MetaTest extends MetaBase {
  use_special(_s: unknown): void {
    this.id = _s["id"];
    this.name = _s["name"];
  }
  use_default(id: string): void {
    this.id = id;
    this.name = `fy${id}`;
  }
  id: string;
  name: string;
}

describe(get_meta.name, () => {
  test("special", () => {
    expect(get_meta(MetaTest, "1").name).toBe("fy");
    expect(get_meta(MetaTest, "2").name).toBe("fyfy");
  });
  test("default", () => {
    expect(get_meta(MetaTest, "3").name).toBe("fy3");
  });
  test("error", () => {
    @DE_SET_META_CONTEXT("MetaError")
    class ErrorMeta extends MetaBase {}
    expect(ErrorMeta._get_meta_source_all()).toBeUndefined();
  });
});

describe(get_metas.name, () => {
  test("", () => {
    expect(get_metas(MetaTest)).toHaveLength(2);
    expect(get_metas(MetaTest)[0]).toBeInstanceOf(MetaTest);
  });
});

describe(get_metas_id.name, () => {
  test("", () => {
    expect(get_metas_id(MetaTest)).toEqual(["1", "2"]);
  });
});

describe(_parse_csv.name, () => {
  test.todo("");
});

describe(parse_csv_all.name, () => {
  test.todo("");
});
