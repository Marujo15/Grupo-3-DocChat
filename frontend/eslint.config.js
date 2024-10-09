import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-console': 'warn',
      'semi': 'error', // Exige ponto e vírgula
      'quotes': ['error', 'double'], // Exige aspas duplas
      '@typescript-eslint/no-explicit-any': 'warn', // Aviso para o uso de 'any'
      '@typescript-eslint/no-unused-vars': 'warn', // Aviso para variáveis não utilizadas
    },
    overrides: [
      {
        files: ['**/*.{ts,tsx}'],
        rules: {
          '@typescript-eslint/explicit-function-return-type': 'off', // Desativa a exigência para componentes React
        },
      },
      {
        files: ['**/*.ts'], // Apenas arquivos TypeScript comuns
        rules: {
          '@typescript-eslint/explicit-function-return-type': 'error', // Exige tipo de retorno para funções não React
        },
      },
    ],
  },
)
