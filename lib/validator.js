const errors = require('./errors');
const utils = require('./utils');

module.exports = (input, inputFormat, outputFormat) => {
  // argument exceptions
  if (input === undefined) {
    throw (errors.input_not_specified);
  } else if (inputFormat === undefined) {
    // single input arg must be string
    if (!(typeof input === 'string' || input instanceof String)) {
      throw (errors.input_single_invalid_type);
    }
  } else {
    // validate input arguments
    if (inputFormat === 0) {
      if (!(typeof input === 'string' || input instanceof String)) {
        throw (errors.input_format_mismatch_string);
      }
    } else if (inputFormat === 1 || inputFormat === 2) {
      if (!Array.isArray(input) && !utils.isBuffer(input)) {
        throw (errors.input_format_mismatch_array);
      }
    } else {
      throw (errors.input_format_invalid);
    }

    // validate output format
    if (outputFormat !== undefined
      && outputFormat !== 0
      && outputFormat !== 1
      && outputFormat !== 2) {
      throw (errors.output_format_invalid);
    }
  }
};
