# wasm-x7-hash
[![NPM Version](https://img.shields.io/npm/v/wasm-x11-hash)](https://www.npmjs.com/package/wasm-x11-hash)
[![Build Status](https://github.com/dashevo/wasm-x11-hash/actions/workflows/test_and_release.yml/badge.svg)](https://github.com/dashevo/wasm-x11-hash/actions/workflows/test_and_release.yml)
[![Release Date](https://img.shields.io/github/release-date/dashevo/wasm-x11-hash)](https://github.com/dashevo/wasm-x11-hash/releases/latest)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen)](https://github.com/RichardLitt/standard-readme)

WASM binding for X7 hashing algorithm written in C

## Installation and usage
_[Buffer](https://github.com/feross/buffer) polyfill is required for usage in browsers_
- `$ npm install wasm-x7-hash`

```javascript
const X7 = require('wasm-x7-hash');

X7().then(x7 => {
  const hash = x7.digest('hello world')
});
```

## Build and test
_Docker v20+ is required_

- `$ npm run build`
- `$ npm run test`

