const { expect } = require('chai');
const loadX11 = require('../x11');

const {
  fox,
  empty,
  dash,
  longDream,
  int32,
  buffer
} = require('./fixtures');

describe('x11', () => {
  let x11;
  before(async () =>{
    x11 = await loadX11();
  })

  describe('hashes', () => {
    it('empty string', () => {
      expect(x11.digest(empty))
        .to.equal('51b572209083576ea221c27e62b4e22063257571ccb6cc3dc3cd17eb67584eba');
    })

    it('fox string', function () {
      expect(x11.digest(fox))
        .to.equal('534536a4e4f16b32447f02f77200449dc2f23b532e3d9878fe111c9de666bc5c');
    });

    it('dash string', function () {
      expect(x11.digest(dash))
        .to.equal('fe809ebca8753d907f6ad32cdcf8e5c4e090d7bece5df35b2147e10b88c12d26');
    });

    it('dream string', function () {
      expect(x11.digest(longDream))
        .to.equal('5c0996b9d49dbe84e29f1b818c1fa9e73549f894a71b8a258964b8f0ecf3c866');
    });

    it('int32', function () {
      expect(x11.digest(int32, 2))
        .to.equal('ce06ca169b75084cd7b245966296e637e9af85091e848937af070f110cdb6298');
    });

    it('buffer', function () {
      expect(x11.digest(buffer, 1))
        .to.equal('01840edc7f98704e3c66c6fcad1e90642a382f7c1cb4af64ed085cc50c000000');
    });

    it('buffer outputFormat=0', function () {
      expect(x11.digest(buffer, 1, 0)).to.equal('01840edc7f98704e3c66c6fcad1e90642a382f7c1cb4af64ed085cc50c000000');
    });

    it('buffer outputFormat=1 -> 8 bit', function () {
      expect(x11.digest(buffer, 1, 1)).to.deep.equal([
        1,
        132,
        14,
        220,
        127,
        152,
        112,
        78,
        60,
        102,
        198,
        252,
        173,
        30,
        144,
        100,
        42,
        56,
        47,
        124,
        28,
        180,
        175,
        100,
        237,
        8,
        92,
        197,
        12,
        0,
        0,
        0
      ]);
    });

    it('buffer outputFormat=2 -> 32 bit', function () {
      expect(x11.digest(buffer, 1, 2)).to.deep.equal([
        25431772,
        2140696654,
        1013368572,
        -1390505884,
        708325244,
        481603428,
        -318219067,
        201326592
      ]);
    });
  })

  describe('handles input argument exceptions', function () {

    it('invalid input type: missing', function () {
      expect(function () {
        x11.digest();
      }).to.throw(x11.errors.input_not_specified);
    });

    it('invalid single-arg input type: array', function () {
      expect(function () {
        x11.digest(int32);
      }).to.throw(x11.errors.input_single_invalid_type);
    });

    it('invalid single-arg input type: object', function () {
      expect(function () {
        x11.digest({});
      }).to.throw(x11.errors.input_single_invalid_type);
    });
  });

  describe('inputFormat argument exceptions', function () {

    it('invalid inputFormat argument type: string', function () {
      expect(function () {
        x11.digest(longDream, '');
      }).to.throw(x11.errors.input_format_invalid);
    });

    it('invalid inputFormat argument type: boolean', function () {
      expect(function () {
        x11.digest(longDream, false);
      }).to.throw(x11.errors.input_format_invalid);
    });

    it('invalid inputFormat argument type: object', function () {
      expect(function () {
        x11.digest(longDream, {});
      }).to.throw(x11.errors.input_format_invalid);
    });

    it('invalid inputFormat argument value: min', function () {
      expect(function () {
        x11.digest(longDream, -1);
      }).to.throw(x11.errors.input_format_invalid);
    });

    it('invalid inputFormat argument value: max', function () {
      expect(function () {
        x11.digest(longDream, 3);
      }).to.throw(x11.errors.input_format_invalid);
    });

    it('mismatch of input argument to inputFormat: string', function () {
      expect(function () {
        x11.digest(int32, 0);
      }).to.throw(x11.errors.input_format_mismatch_string);
    });

    it('mismatch of input argument to inputFormat: array 1', function () {
      expect(function () {
        x11.digest(longDream, 1);
      }).to.throw(x11.errors.input_format_mismatch_array);
    });

    it('mismatch of input argument to inputFormat: array 2', function () {
      expect(function () {
        x11.digest(longDream, 2);
      }).to.throw(x11.errors.input_format_mismatch_array);
    });
  });

  describe('outputFormat argument exceptions', function () {

    it('invalid outputFormat argument type: string', function () {
      expect(function () {
        x11.digest(longDream, 0, '');
      }).to.throw(x11.errors.output_format_invalid);
    });

    it('invalid outputFormat argument type: boolean', function () {
      expect(function () {
        x11.digest(longDream, 0, false);
      }).to.throw(x11.errors.output_format_invalid);
    });

    it('invalid outputFormat argument type: object', function () {
      expect(function () {
        x11.digest(longDream, 0, {});
      }).to.throw(x11.errors.output_format_invalid);
    });

    it('invalid outputFormat argument value: below min', function () {
      expect(function () {
        x11.digest(longDream, 0, -1);
      }).to.throw(x11.errors.output_format_invalid);
    });

    it('invalid outputFormat argument value: above max', function () {
      expect(function () {
        x11.digest(longDream, 0, 3);
      }).to.throw(x11.errors.output_format_invalid);
    });
  });
})
