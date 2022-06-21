# @dashevo/wasm-x11-hash
[![NPM Version](https://img.shields.io/npm/v/@dashevo/wasm-x11-hash)](https://www.npmjs.com/package/@dashevo/wasm-x11-hash)
[![Build Status](https://github.com/dashevo/wasm-x11-hash/actions/workflows/test_and_release.yml/badge.svg)](https://github.com/dashevo/wasm-x11-hash/actions/workflows/test_and_release.yml)
[![Release Date](https://img.shields.io/github/release-date/dashevo/wasm-x11-hash)](https://github.com/dashevo/wasm-x11-hash/releases/latest)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen)](https://github.com/RichardLitt/standard-readme)

WASM binding for X11 hashing algorithm

## Installation and usage
`$ npm install @dashevo/wasm-x11-hash`

```javascript
const X11 = require('@dashevo/wasm-x11-hash');

X11().then(x11 => {
  const hash = x11.digest('hello world')
});
```

## Build
_Docker v20 is required_

`$ npm run build`

## Test
- `$ npm run build`
- `$ npm run test`
