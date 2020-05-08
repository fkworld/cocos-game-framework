import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

export default {
    input: "framework/index.ts",
    plugins: [
        typescript(),
        terser(),
    ],
    output: {
        file: "framework-dist/framework-v1.0.0.js",
        format: "umd",
        name: "fy",
    }
};
