import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.cjs.js", // CommonJS 格式
      format: "cjs",
      exports: "auto",
    },
    {
      file: "dist/index.esm.js", // ES Module 格式
      format: "esm",
    },
  ],
  Plugin: [
    resolve(),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" }),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      extensions: ['.ts']
    }),
    terser(), //代码压缩
  ],
  external: ["crypto-js"], // 外部依赖
};
