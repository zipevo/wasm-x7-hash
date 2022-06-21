const loadX11WasmModule = require('./wasm-build/x11_hash')
const wasmBuildBase64 = require('./wasm-build/x11-hash-wasm-base64')

const validateArguments = require('./lib/validator');
const utils = require('./lib/utils');
const errors = require('./lib/errors');

const OUTPUT_HASH_SIZE = 32;

const digest = wasmModule => {
  const wasmApi = {
    digest: wasmModule.cwrap('digest', '', ['number', 'number', 'number']),
    create_buffer: wasmModule.cwrap('create_buffer', 'number', ['number']),
    destroy_buffer: wasmModule.cwrap('destroy_buffer', '', ['number']),
  };

  return (rawInput, inputFormat, outputFormat) => {
    validateArguments(rawInput, inputFormat, outputFormat);
    let input;
    if (inputFormat === 1) {
      input = rawInput;
    } else if (inputFormat === 2) {
      input = utils.int32Buffer2Bytes(rawInput);
    } else {
      input = utils.string2bytes(rawInput);
    }

    const output = new Uint8Array(OUTPUT_HASH_SIZE)

    const pIn = wasmApi.create_buffer(input.length);
    const pOut = wasmApi.create_buffer(OUTPUT_HASH_SIZE);

    wasmModule.HEAP8.set(input, pIn);
    wasmModule.HEAP8.set(output, pOut);

    wasmApi.digest(pIn, pOut, input.length);

    const result = new Uint8Array(wasmModule.HEAP8.buffer, pOut, OUTPUT_HASH_SIZE);

    wasmApi.destroy_buffer(pIn)
    wasmApi.destroy_buffer(pOut)

    if (outputFormat === 1) {
      return Array.from(result);
    } else if (outputFormat === 2) {
      return utils.bytes2Int32Buffer(result);
    }
    return utils.int8ArrayToHexString(result);
  }
}

module.exports = () => new Promise(async (resolve) => {
  const wasmModule = await loadX11WasmModule({
    wasmBinary: Buffer.from(wasmBuildBase64, 'base64')
  });

  resolve({
    digest: digest(wasmModule),
    errors
  });
})
