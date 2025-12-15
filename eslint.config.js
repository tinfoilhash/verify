import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import lit from 'eslint-plugin-lit'
import globals from 'globals'

export default [
  {
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  {
    ignores: ['dist'],
  },
  js.configs.recommended,
  lit.configs['flat/recommended'],
  prettier,
]
