
import path from 'path';
import cleanup from 'rollup-plugin-cleanup';
import resolve from 'rollup-plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import multiEntry from "@rollup/plugin-multi-entry";
import { terser } from 'rollup-plugin-terser';

const cwd = path.resolve(__dirname);
const { PRODUCTION: production } = process.env;

const pkg = require(`${cwd}/package.json`);
const input = {
  include: 'src/**/*.ts',
  entryFileName: 'index.js',
};


export default [
  {
    // ES
    input,
    output: {
      dir: './dist/es',
      format: 'es',
    },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
      multiEntry({ relative: 'src/'}),
      resolve({ mainFields: ['module'] }),
      typescript({
        declaration: true,
        declarationDir: './dist/es',
        outDir: './dist/es',
        rootDir: './src/',
      }),
      cleanup(),
      !production && serve('.'),
      !production && livereload('.'),
    ]
  },
  // IIFE
  {
    input,
    output: {
      dir: './dist/iife',
      format: 'iife',
      name: 'podiumSandbox',
      sourcemap: true
    },
    plugins: [
      multiEntry(),
      resolve({ mainFields: ['main'] }),
      typescript({
        declaration: true,
        declarationDir: './dist/iife',
        outDir: './dist/iife',
        rootDir: './src/',
      }),
      terser({ safari10: true }),
    ],
  },
  // Common JS
  {
    input,
    output: {
      dir: './dist/lib',
      format: 'cjs',
      sourcemap: false
    },
    plugins: [
      multiEntry({ relative: 'src/' }),
      resolve({ mainFields: ['main'] }),
      typescript({
        declaration: true,
        declarationDir: './dist/lib',
        outDir: './dist/lib',
        rootDir: './src/',
      }),
      terser({ safari10: true }),
      cleanup(),
    ],
  },
];