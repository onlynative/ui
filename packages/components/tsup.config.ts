import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/typography/index.ts',
    'src/layout/index.ts',
    'src/button/index.ts',
    'src/icon-button/index.ts',
    'src/appbar/index.ts',
    'src/card/index.ts',
    'src/chip/index.ts',
    'src/checkbox/index.ts',
    'src/radio/index.ts',
    'src/switch/index.ts',
    'src/text-field/index.ts',
    'src/list/index.ts',
    'src/keyboard-avoiding-wrapper/index.ts',
  ],
  dts: true,
  format: 'cjs',
  outDir: 'dist',
  clean: true,
  noExternal: ['@onlynative/utils'],
})
