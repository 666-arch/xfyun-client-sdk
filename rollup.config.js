import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import tslib from 'tslib';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      exports: 'auto'
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm'
    }
  ],
  plugins: [
    resolve({
      // 确保添加这些配置
      mainFields: ['module', 'main', 'browser'],
      extensions: ['.ts', '.js'],
      preferBuiltins: true
    }),
    commonjs({
      // 添加这些关键配置
      include: /node_modules/,
      requireReturnsDefault: 'auto',
      esmExternals: true,
      ignoreDynamicRequires: true
    }),
    typescript({
      tsconfig: './tsconfig.json',
      tslib: tslib
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions: ['.ts', '.js']  // 确保包含 .ts 扩展名
    }),
    terser()
  ],
  external: ['crypto-js']  // 确保所有外部依赖都列在这里
};