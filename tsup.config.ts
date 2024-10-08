// tsup.config.ts
import { rm } from 'node:fs'
import { defineConfig } from 'tsup'
import * as preset from 'tsup-preset-solid'
import AutoImport from 'unplugin-auto-import/esbuild'

const preset_options: preset.PresetOptions = {
  // array or single object
  entries: [
    {
      entry: 'src/index.ts',

    },
  ],
  // Set to `true` to remove all `console.*` calls and `debugger` statements in prod builds
  drop_console: true,
  // Set to `true` to generate a CommonJS build alongside ESM
  cjs: false,
  esbuild_plugins: [AutoImport({
    imports: ['solid-js'],
    dts: './auto-imports.d.ts',
  })],
}

export default defineConfig((config) => {
  rm('dist', { force: true, recursive: true }, () => {})

  const watching = !!config.watch

  const parsed_data = preset.parsePresetOptions(preset_options, watching)

  if (!watching) {
    const package_fields = preset.generatePackageExports(parsed_data)

    console.log(`\npackage.json: \n${JSON.stringify(package_fields, null, 2)}\n\n`)

    /*
            will update ./package.json with the correct export fields
        */
    preset.writePackageJson(package_fields)
  }

  return preset.generateTsupOptions(parsed_data)
})
