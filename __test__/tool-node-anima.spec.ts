/**
 * 注意，涉及到游戏生命周期的函数，则不可在node环境中测试。
 */

import { SimpleNodeAnima } from "../src/tool-node-anima";

let source = { show: { scale: 1 }, hide: { scale: 0 } };

test.skip("get_now", () => {
  let n = new cc.Node();
  SimpleNodeAnima.set_all(n, "hide", source);
  expect(SimpleNodeAnima.get_now(n)).toBe("hide");
  expect(n.scale).toBe(0);
});

test.skip("no_anima", () => {
  let n = new cc.Node();
  SimpleNodeAnima.set_all(n, "hide", source);
  SimpleNodeAnima.no_anima(n, "show");
  expect(SimpleNodeAnima.get_now(n)).toBe("show");
  expect(n.scale).toBe(1);
  SimpleNodeAnima.no_anima(n, "hide");
  expect(SimpleNodeAnima.get_now(n)).toBe("hide");
  expect(n.scale).toBe(0);
});

test.skip("anima", async () => {
  let n = new cc.Node();
  SimpleNodeAnima.set_all(n, "hide", source);
  await SimpleNodeAnima.anima(n, "show", {});
  expect(SimpleNodeAnima.get_now(n)).toBe("show");
  expect(n.scale).toBe(1);
  await SimpleNodeAnima.anima(n, "hide", {});
  expect(SimpleNodeAnima.get_now(n)).toBe("hide");
  expect(n.scale).toBe(0);
  // 无await
  SimpleNodeAnima.anima(n, "show", {});
  expect(SimpleNodeAnima.get_now(n)).toBe("show");
  expect(n.scale).not.toBe(1);
});
