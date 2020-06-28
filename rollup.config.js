//@ts-check

import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";
import { version } from "./package.json";

/**
 * 打包为2个js文件的配置
 * @param {boolean} is_terser 是否压缩代码
 * @returns {import("rollup").RollupOptions}
 */
function create_config(is_terser) {
  return {
    input: "./src/index.ts",
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
    plugins: [
      // 从package.json中获取项目信息
      json(),
      // 用于打包typescript
      typescript(),
      // 用于压缩js代码
      is_terser ? terser() : undefined,
    ],
  };
}

/**
 * 打包声明文件dts的配置
 * - 之前需要先生成声明文件，参考命令：npx tsc --declaration --emitDeclarationOnly --declarationDir ./dist
 * @returns {import("rollup").RollupOptions}
 */
function create_config_dts_bundle() {
  return {
    input: "./dist/src/index.d.ts",
    output: {
      file: `./dist/fy-${version}.d.ts`,
      banner: `/*! fy-${version} https://github.com/fkworld/cocos-game-framework */`,
      footer: "export as namespace fy;",
    },
    plugins: [dts()],
  };
}

export default [create_config_dts_bundle(), create_config(false), create_config(true)];
