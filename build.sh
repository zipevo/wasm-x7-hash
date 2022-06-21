# Guide https://web.dev/emscripting-a-c-library/
DOCKER_IMAGE=trzeci/emscripten-fastcomp

mkdir -p lib/wasm-build
rm -rf js-lib/wasm-build/*

docker run -it \
  -v $(pwd):/src \
  -w="/src" \
  $DOCKER_IMAGE \
  emcc -O3 -s WASM=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' -s MODULARIZE=1 \
        -I lib/x11/{sha3,}/*.c \
        -o lib/wasm-build/x11_hash.js

WASM_BUILD_BASE_64=$(base64 lib/wasm-build/x11_hash.wasm)

echo 'module.exports = "'${WASM_BUILD_BASE_64}'"' > lib/wasm-build/x11-hash-wasm-base64.js

rm lib/wasm-build/x11_hash.wasm
