module.exports = {
  root: true, // make to not take in any user specified rules in parent folders
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier', 'prettier/react'],
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  rules: {
    'react/prop-types': 0,
    'react/jsx-filename-extension': 0,
    'jsx-a11y/mouse-events-have-key-events': 0,
  },
}