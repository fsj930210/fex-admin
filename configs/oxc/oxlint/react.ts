export default {
  plugins: ['react', 'react-perf'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
  },
}
