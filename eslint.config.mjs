import antfu from '@antfu/eslint-config'

export default antfu({
  solid: true,
  rules: {
    'no-console': 'warn',
    // conflicts with auto-import
    'solid/jsx-no-undef': 'off',
    'ts/ban-types': 'off',
  },
  ignores: ['*.d.ts', '*.js'],
})
