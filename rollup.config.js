import typescript from "rollup-plugin-typescript2";
import { uglify } from "rollup-plugin-uglify";

export default {
    input: "framework/index.ts",
    plugins: [
        typescript(),
        uglify(),
    ],
    output: {
        file: "framework-dist/framework-v1.0.0.js",
        format: "umd",
        name: "fy",
    }
};
