DOCKER_IMAGE=trzeci/emscripten-fastcomp

#git submodule update --init --recursive
mkdir -p js_build

#docker run -it --rm -w="/src/js_build" -v $(pwd):/src alpine

docker run -it \
  -v $(pwd):/src \
  -w="/src" \
  $DOCKER_IMAGE \
  emcc -O3 -s WASM=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' -o js_build/x11_hash.js \
        -I lib \
        x11_bindings.c \
        lib/{sha3,}/*.c

#  emcc -O3 -s WASM=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' -o js_build/x11_hash.js ./src/fib.c

#  emcc -O3 -s WASM=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' ../src/fib.c
#docker run -it $DOCKER_IMAGE

#  emcc helloworld.c -s WASM=1 -o hello-world.html

#docker run \
#  --rm \
#  -v $(pwd):/src \
#  -w="/src/js_build" \
#  $DOCKER_IMAGE \
#  cmake --build . -- -j10
