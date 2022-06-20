const Module = require('./wasm-build/x11_hash')
// https://web.dev/loading-wasm/


const OUTPUT_HASH_SIZE = 32;

const wasmApi = {
  digest: Module.cwrap('digest', '', ['number', 'number', 'number']),
  create_buffer: Module.cwrap('create_buffer', 'number', ['number']),
  destroy_buffer: Module.cwrap('destroy_buffer', '', ['number']),
};

function toUint8Array(buf) {
  const ab = new ArrayBuffer(buf.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return view;
}

function toBuffer(ab) {
  const buf = Buffer.alloc(ab.byteLength);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    buf[i] = view[i];
  }
  return buf;
}

const digest = buffer => {
  const input = toUint8Array(buffer)
  const output = new Uint8Array(OUTPUT_HASH_SIZE)

  const pIn = wasmApi.create_buffer(input.byteLength);
  const pOut = wasmApi.create_buffer(OUTPUT_HASH_SIZE);

  Module.HEAP8.set(input, pIn);
  Module.HEAP8.set(output, pOut);

  wasmApi.digest(pIn, pOut, input.byteLength);

  const resultView = new Uint8Array(Module.HEAP8.buffer, pOut, OUTPUT_HASH_SIZE);

  const result = new Uint8Array(resultView);

  wasmApi.destroy_buffer(pIn)
  wasmApi.destroy_buffer(pOut)

  return toBuffer(result);
}

const api = {
  digest
}

module.exports = () => new Promise((resolve) => {
  Module.onRuntimeInitialized = () => {
    resolve(api);
  };
});
