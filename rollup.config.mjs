// rollup.config.mjs
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import { babel } from '@rollup/plugin-babel';

export default [
   {
      input: 'src/main.js',
      output: [
         {
            file: 'dist/phone-mask-native.js',
            format: 'es',
         },
         {
            file: 'dist/index.js',
            format: 'cjs',
         },
      ],
      plugins: [json()],
   },
   {
      input: 'src/main.js',
      output: [
         {
            file: 'dist/phone-mask-native.min.js',
            format: 'iife',
            name: 'phoneMaskNative',
         },
      ],
      plugins: [
         json(),
         babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**',
            presets: [
               [
                  '@babel/env',
                  {
                     targets: '> 0.25%, not dead',
                     modules: false,
                     loose: true,
                     forceAllTransforms: true,
                  },
               ],
            ],
         }),
         terser(),
      ],
   },
];
