import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: './openapi/main.yaml',
  output: {
    lint: 'eslint',
    format: 'prettier',
    path: `./src/services/leavemanager`,
  },
  plugins: [
    '@hey-api/client-axios',
    '@hey-api/schemas',
    {
      name: '@hey-api/typescript',
      enums: 'javascript',
    },
    {
      name: '@hey-api/sdk',
      asClass: true,
    },
    {
      identifierCase: 'preserve',
      name: '@hey-api/typescript',
    },
  ],
})
