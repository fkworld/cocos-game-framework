//@ts-check

import json from "@rollup/plugin-json";
import _ from "lodash";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import { version } from "./package.json";

const CONFIG = {
  // 入口文件
  input: "./src/index.ts",
  plugins: [
    // 从package.json中获取项目信息
    json(),
    // 用于打包typescript
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          declarationDir: "./types/",
        },
        exclude: ["test/**/*"],
      },
    }),
  ],
  output: {
    // 输出文件
    file: `./dist/fy-${version}.js`,
    // 需要在 creator 中作为插件脚本使用，因此必须要生成为 umd 模块
    format: "umd",
    // umd包名
    name: "fy",
    // 文件标题
    banner: `/*! fy-${version} https://github.com/fkworld/cocos-game-framework */`,
  },
};

const DEV_CONFIG = _.cloneDeep(CONFIG);
DEV_CONFIG.output.file = `./dist/fy-${version}.dev.js`;

const MIN_CONFIG = _.cloneDeep(CONFIG);
MIN_CONFIG.output.file = `./dist/fy-${version}.min.js`;
MIN_CONFIG.plugins.push(terser());

export default [DEV_CONFIG, MIN_CONFIG];
