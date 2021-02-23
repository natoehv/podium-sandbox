
import path from 'path';
import cleanup from 'rollup-plugin-cleanup';
import resolve from 'rollup-plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

const cwd = path.resolve(__dirname);
const { PRODUCTION: production } = process.env;

const pkg = require(`${cwd}/package.json`);
const input = 'src/index.ts';


export default [
  {
    // ES
    input,
    output: {
      file: 'dist/es/index.js',
      format: 'es',
    },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
      resolve({ mainFields: ['module'] }),
      typescript(),
      cleanup(),
      !production && serve('.'),
      !production && livereload('.'),
    ]
  },
  // IIFE
  {
    input,
    output: {
      file: 'dist/iife/index.js',
      format: 'iife',
      name: 'podiumSandbox',
      sourcemap: true
    },
    plugins: [
      resolve({ mainFields: ['main'] }),
      typescript(),
      terser({ safari10: true }),
    ],
  },
  // Common JS
  {
    input,
    output: {
      file: 'dist/lib/index.js',
      format: 'cjs',
      sourcemap: false
    },
    plugins: [
      resolve({ mainFields: ['main'] }),
      typescript({
        declaration: true,
        declarationDir: 'types/',
        rootDir: 'src/'
      }),
      terser({ safari10: true }),
      cleanup(),
    ],
  },
];