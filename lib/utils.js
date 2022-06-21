const int32Buffer2Bytes = (b) => {
  const buffer = new Array(b.length);
  const len = b.length;
  let i = 0;
  while (i < len) {
    buffer[i * 4] = (b[i] & 0xFF000000) >>> 24;
    buffer[i * 4 + 1] = (b[i] & 0x00FF0000) >>> 16;
    buffer[i * 4 + 2] = (b[i] & 0x0000FF00) >>> 8;
    buffer[i * 4 + 3] = (b[i] & 0x000000FF);
    i++;
  }
  return buffer;
};

const string2bytes = (s) => {
  const len = s.length;
  const b = new Array(len);
  let i = 0;
  while (i < len) {
    b[i] = s.charCodeAt(i);
    i++;
  }
  return b;
};

const bytes2Int32Buffer = (b) => {
  if (!b) return [];
  const len = b.length ? (((b.length - 1) >>> 2) + 1) : 0;
  const buffer = new Array(len);
  let j = 0;
  while (j < len) {
    buffer[j] = (b[j * 4] << 24) | (b[j * 4 + 1] << 16) | (b[j * 4 + 2] << 8) | b[j * 4 + 3];
    j++;
  }
  return buffer;
};

const int8ArrayToHexString = (array) => {
  let string = '';

  for (let i = 0; i < array.length; i++) {
    if (array[i] < 16) {
      string += `0${array[i].toString(16)}`;
    } else {
      string += array[i].toString(16);
    }
  }
  return string;
};

const isBuffer = (obj) => obj !== null
  && obj.constructor !== null
  && typeof obj.constructor.isBuffer === 'function'
  && obj.constructor.isBuffer(obj);

module.exports = {
  string2bytes,
  isBuffer,
  int8ArrayToHexString,
  int32Buffer2Bytes,
  bytes2Int32Buffer,
};
