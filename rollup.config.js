import typescript from "rollup-plugin-typescript2";

export default {
  // 入口文件
  input: "./framework/src/index.ts",
  plugins: [
    // 用于打包typescript
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          // 覆盖 tsconfig.json
          target: "ES5",
          module: "ESNext",
          // 自动生成声明文件
          declaration: true,
          declarationDir: "./types/fy/",
        },
        include: ["./framework/src/*", "./creator.d.ts", "./types/game.d.ts"],
      },
    }),
  ],
  output: {
    // 输出文件，不经过压缩
    file: `./framework/dist/fy-1.0.0.js`,
    // 需要在 creator 中作为插件脚本使用，因此必须要生成为 umd 模块
    format: "umd",
    // umd包名
    name: "fy",
    // 文件标题
    banner: `// fy, v1.0.0, 2020.5.22, https://github.com/fkworld/cocos-game-framework`,
  },
};
