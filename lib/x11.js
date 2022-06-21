const loadX11WasmModule = require('./wasm-build/x11-hash');
const wasmBuildBase64 = require('./wasm-build/x11-hash-wasm-base64');

const validateArguments = require('./validator');
const utils = require('./utils');
const errors = require('./errors');

const OUTPUT_HASH_SIZE = 32;

/**
 * @param bindings
 * @return {digest}
 */
const createDigest = (bindings) => {
  /**
   * @typedef {digest}
   * @param {(string|Buffer|TypedArray|Array)} rawInput
   * @param {number} inputFormat
   * @param {number} outputFormat
   */
  const digest = (rawInput, inputFormat, outputFormat) => {
    validateArguments(rawInput, inputFormat, outputFormat);
    let input;
    if (inputFormat === 1) {
      input = rawInput;
    } else if (inputFormat === 2) {
      input = utils.int32Buffer2Bytes(rawInput);
    } else {
      input = utils.string2bytes(rawInput);
    }

    const output = new Uint8Array(OUTPUT_HASH_SIZE);

    const pIn = bindings.create_buffer(input.length);
    const pOut = bindings.create_buffer(OUTPUT_HASH_SIZE);

    bindings.wasmModule.HEAP8.set(input, pIn);
    bindings.wasmModule.HEAP8.set(output, pOut);

    bindings.digest(pIn, pOut, input.length);

    const result = new Uint8Array(bindings.wasmModule.HEAP8.buffer, pOut, OUTPUT_HASH_SIZE);

    bindings.destroy_buffer(pIn);
    bindings.destroy_buffer(pOut);

    if (outputFormat === 1) {
      return Array.from(result);
    }
    if (outputFormat === 2) {
      return utils.bytes2Int32Buffer(result);
    }
    return utils.int8ArrayToHexString(result);
  };
  return digest;
};

module.exports = () => loadX11WasmModule({
  wasmBinary: Buffer.from(wasmBuildBase64, 'base64'),
}).then((wasmModule) => {
  const bindings = {
    digest: wasmModule.cwrap('digest', '', ['number', 'number', 'number']),
    create_buffer: wasmModule.cwrap('create_buffer', 'number', ['number']),
    destroy_buffer: wasmModule.cwrap('destroy_buffer', '', ['number']),
    wasmModule,
  };

  return {
    digest: createDigest(bindings),
    errors,
  };
});
