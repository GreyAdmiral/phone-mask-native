// rollup.config.mjs
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

export default {
   input: 'src/main.js',
   output: [
      {
         file: 'dist/index.js',
         format: 'cjs',
      },
      {
         file: 'dist/phone-mask-native.js',
         format: 'es',
      },
      {
         file: 'dist/phone-mask-native.min.js',
         format: 'iife',
         name: 'phoneMaskNative',
         plugins: [terser()],
      },
   ],
   plugins: [json()],
};
