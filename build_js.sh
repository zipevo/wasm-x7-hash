DOCKER_IMAGE=trzeci/emscripten-fastcomp

mkdir -p js-bindings/wasm-build
rm -rf js-bindings/wasm-build/*

#docker run -w="/src" -v $(dirname $(pwd)):/src alpine ls
#exit

# -s BINARYEN_ASYNC_COMPILATION=0

docker run -it \
  -v $(pwd):/src \
  -w="/src" \
  $DOCKER_IMAGE \
  emcc -O3 -s WASM=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' -s MODULARIZE=1 \
        -o js-bindings/wasm-build/x11_hash.js \
        -I lib \
        x11_bindings.c \
        lib/{sha3,}/*.c

WASM_BUILD_BASE_64=$(base64 js-bindings/wasm-build/x11_hash.wasm)

echo 'module.exports = "'${WASM_BUILD_BASE_64}'"' > js-bindings/wasm-build/x11-hash-wasm-base64.js

rm js-bindings/wasm-build/x11_hash.wasm
