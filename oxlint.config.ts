import base from '@fex/config-oxc/oxlint/base'

export default {
  ...base,
  ignorePatterns: [
    '**/dist/**',
    '**/.nx/**',
    '**/node_modules/**',
    'apps/*/public/mockServiceWorker.js',
  ],
}
