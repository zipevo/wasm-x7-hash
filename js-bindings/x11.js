const Module = require('./wasm-build/x11_hash')
const validateArguments = require('./lib/validator');
const utils = require('./lib/utils');

const OUTPUT_HASH_SIZE = 32;

let initialized = false;

const wasmApi = {
  digest: Module.cwrap('digest', '', ['number', 'number', 'number']),
  create_buffer: Module.cwrap('create_buffer', 'number', ['number']),
  destroy_buffer: Module.cwrap('destroy_buffer', '', ['number']),
};

// function toUint8Array(buf) {
//   const ab = new ArrayBuffer(buf.length);
//   const view = new Uint8Array(ab);
//   for (let i = 0; i < buf.length; ++i) {
//     view[i] = buf[i];
//   }
//   return view;
// }
//
// function toBuffer(ab) {
//   const buf = Buffer.alloc(ab.byteLength);
//   const view = new Uint8Array(ab);
//   for (let i = 0; i < buf.length; ++i) {
//     buf[i] = view[i];
//   }
//   return buf;
// }

// const withCBindings = hashFunction =>
//   (input, inputFormat, outputFormat) => {
//     validateArguments(input, inputFormat, outputFormat);
//     let data;
//     if (inputFormat === 1) {
//       data = input;
//     } else if (input === 2) {
//       data = utils.int32Buffer2Bytes(input);
//     } else {
//       data = utils.string2bytes(input);
//     }
//   }

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

  const output = new Uint8Array(OUTPUT_HASH_SIZE)

  const pIn = wasmApi.create_buffer(input.length);
  const pOut = wasmApi.create_buffer(OUTPUT_HASH_SIZE);

  Module.HEAP8.set(input, pIn);
  Module.HEAP8.set(output, pOut);

  wasmApi.digest(pIn, pOut, input.length);

  const result = new Uint8Array(Module.HEAP8.buffer, pOut, OUTPUT_HASH_SIZE);

  wasmApi.destroy_buffer(pIn)
  wasmApi.destroy_buffer(pOut)

  if (outputFormat === 2) {
    return Array.from(result);
  } else if (outputFormat === 1) {
    return utils.bytes2Int32Buffer(result);
  }
  return utils.int8ArrayToHexString(result);
}

const api = {
  digest
}

Module.onRuntimeInitialized = () => {
  initialized = true;
};


module.exports = () => new Promise((resolve) => {
  if (initialized) {
    resolve(api)
  } else {
    Module.onRuntimeInitialized = () => {
      initialized = true;
      resolve(api);
    };
  }
});
