//@ts-check
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import { version } from "./package.json";

/**
 * 创建2个配置
 * @param {boolean} is_terser 是否压缩代码
 * @returns {import("rollup").RollupOptions}
 */
function create_config(is_terser) {
  return {
    input: "./src/index.ts",
    plugins: [
      // 从package.json中获取项目信息
      json(),
      // 用于打包typescript
      typescript(),
      is_terser ? terser() : undefined,
    ],
    output: {
      // 输出文件
      file: `./dist/fy-${version}.${is_terser ? "min" : "dev"}.js`,
      // 需要在creator中作为插件脚本使用，因此必须要生成为umd模块
      format: "umd",
      // umd包名
      name: "fy",
      // 文件标题
      banner: `/*! fy-${version} https://github.com/fkworld/cocos-game-framework */`,
    },
  };
}

export default [create_config(false), create_config(true)];
