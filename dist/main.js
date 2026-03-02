/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/base32.js/base32.js":
/*!******************************************!*\
  !*** ./node_modules/base32.js/base32.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * Generate a character map.
 * @param {string} alphabet e.g. "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
 * @param {object} mappings map overrides from key to value
 * @method
 */

var charmap = function (alphabet, mappings) {
  mappings || (mappings = {});
  alphabet.split("").forEach(function (c, i) {
    if (!(c in mappings)) mappings[c] = i;
  });
  return mappings;
}

/**
 * The RFC 4648 base 32 alphabet and character map.
 * @see {@link https://tools.ietf.org/html/rfc4648}
 */

var rfc4648 = {
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
  charmap: {
    0: 14,
    1: 8
  }
};

rfc4648.charmap = charmap(rfc4648.alphabet, rfc4648.charmap);

/**
 * The Crockford base 32 alphabet and character map.
 * @see {@link http://www.crockford.com/wrmg/base32.html}
 */

var crockford = {
  alphabet: "0123456789ABCDEFGHJKMNPQRSTVWXYZ",
  charmap: {
    O: 0,
    I: 1,
    L: 1
  }
};

crockford.charmap = charmap(crockford.alphabet, crockford.charmap);

/**
 * Create a new `Decoder` with the given options.
 *
 * @param {object} [options]
 *   @param {string} [type] Supported Base-32 variants are "rfc4648" and
 *     "crockford".
 *   @param {object} [charmap] Override the character map used in decoding.
 */

function Decoder (options) {
  this.buf = [];
  this.shift = 8;
  this.carry = 0;

  if (options) {

    switch (options.type) {
      case "rfc4648":
        this.charmap = exports.rfc4648.charmap;
        break;
      case "crockford":
        this.charmap = exports.crockford.charmap;
        break;
      default:
        throw new Error("invalid type");
    }

    if (options.charmap) this.charmap = options.charmap;
  }
}

/**
 * The default character map coresponds to RFC4648.
 */

Decoder.prototype.charmap = rfc4648.charmap;

/**
 * Decode a string, continuing from the previous state.
 *
 * @param {string} str
 * @return {Decoder} this
 */

Decoder.prototype.write = function (str) {
  var charmap = this.charmap;
  var buf = this.buf;
  var shift = this.shift;
  var carry = this.carry;

  // decode string
  str.toUpperCase().split("").forEach(function (char) {

    // ignore padding
    if (char == "=") return;

    // lookup symbol
    var symbol = charmap[char] & 0xff;

    // 1: 00000 000
    // 2:          00 00000 0
    // 3:                    0000 0000
    // 4:                             0 00000 00
    // 5:                                       000 00000
    // 6:                                                00000 000
    // 7:                                                         00 00000 0

    shift -= 5;
    if (shift > 0) {
      carry |= symbol << shift;
    } else if (shift < 0) {
      buf.push(carry | (symbol >> -shift));
      shift += 8;
      carry = (symbol << shift) & 0xff;
    } else {
      buf.push(carry | symbol);
      shift = 8;
      carry = 0;
    }
  });

  // save state
  this.shift = shift;
  this.carry = carry;

  // for chaining
  return this;
};

/**
 * Finish decoding.
 *
 * @param {string} [str] The final string to decode.
 * @return {Array} Decoded byte array.
 */

Decoder.prototype.finalize = function (str) {
  if (str) {
    this.write(str);
  }
  if (this.shift !== 8 && this.carry !== 0) {
    this.buf.push(this.carry);
    this.shift = 8;
    this.carry = 0;
  }
  return this.buf;
};

/**
 * Create a new `Encoder` with the given options.
 *
 * @param {object} [options]
 *   @param {string} [type] Supported Base-32 variants are "rfc4648" and
 *     "crockford".
 *   @param {object} [alphabet] Override the alphabet used in encoding.
 */

function Encoder (options) {
  this.buf = "";
  this.shift = 3;
  this.carry = 0;

  if (options) {

    switch (options.type) {
      case "rfc4648":
        this.alphabet = exports.rfc4648.alphabet;
        break;
      case "crockford":
        this.alphabet = exports.crockford.alphabet;
        break;
      default:
        throw new Error("invalid type");
    }

    if (options.alphabet) this.alphabet = options.alphabet;
    else if (options.lc) this.alphabet = this.alphabet.toLowerCase();
  }
}

/**
 * The default alphabet coresponds to RFC4648.
 */

Encoder.prototype.alphabet = rfc4648.alphabet;

/**
 * Encode a byte array, continuing from the previous state.
 *
 * @param {byte[]} buf The byte array to encode.
 * @return {Encoder} this
 */

Encoder.prototype.write = function (buf) {
  var shift = this.shift;
  var carry = this.carry;
  var symbol;
  var byte;
  var i;

  // encode each byte in buf
  for (i = 0; i < buf.length; i++) {
    byte = buf[i];

    // 1: 00000 000
    // 2:          00 00000 0
    // 3:                    0000 0000
    // 4:                             0 00000 00
    // 5:                                       000 00000
    // 6:                                                00000 000
    // 7:                                                         00 00000 0

    symbol = carry | (byte >> shift);
    this.buf += this.alphabet[symbol & 0x1f];

    if (shift > 5) {
      shift -= 5;
      symbol = byte >> shift;
      this.buf += this.alphabet[symbol & 0x1f];
    }

    shift = 5 - shift;
    carry = byte << shift;
    shift = 8 - shift;
  }

  // save state
  this.shift = shift;
  this.carry = carry;

  // for chaining
  return this;
};

/**
 * Finish encoding.
 *
 * @param {byte[]} [buf] The final byte array to encode.
 * @return {string} The encoded byte array.
 */

Encoder.prototype.finalize = function (buf) {
  if (buf) {
    this.write(buf);
  }
  if (this.shift !== 3) {
    this.buf += this.alphabet[this.carry & 0x1f];
    this.shift = 3;
    this.carry = 0;
  }
  return this.buf;
};

/**
 * Convenience encoder.
 *
 * @param {byte[]} buf The byte array to encode.
 * @param {object} [options] Options to pass to the encoder.
 * @return {string} The encoded string.
 */

exports.encode = function (buf, options) {
  return new Encoder(options).finalize(buf);
};

/**
 * Convenience decoder.
 *
 * @param {string} str The string to decode.
 * @param {object} [options] Options to pass to the decoder.
 * @return {byte[]} The decoded byte array.
 */

exports.decode = function (str, options) {
  return new Decoder(options).finalize(str);
};

// Exports.
exports.Decoder = Decoder;
exports.Encoder = Encoder;
exports.charmap = charmap;
exports.crockford = crockford;
exports.rfc4648 = rfc4648;


/***/ }),

/***/ "./node_modules/base32.js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base32.js/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// Module dependencies.
var base32 = __webpack_require__(/*! ./base32 */ "./node_modules/base32.js/base32.js");


// Wrap decoder finalize to return a buffer;
var finalizeDecode = base32.Decoder.prototype.finalize;
base32.Decoder.prototype.finalize = function (buf) {
  var bytes = finalizeDecode.call(this, buf);
  return new Buffer(bytes);
};


// Export Base32.
module.exports = base32;


/***/ }),

/***/ "./node_modules/dijkstrajs/dijkstra.js":
/*!*********************************************!*\
  !*** ./node_modules/dijkstrajs/dijkstra.js ***!
  \*********************************************/
/***/ ((module) => {

"use strict";


/******************************************************************************
 * Created 2008-08-19.
 *
 * Dijkstra path-finding functions. Adapted from the Dijkstar Python project.
 *
 * Copyright (C) 2008
 *   Wyatt Baldwin <self@wyattbaldwin.com>
 *   All rights reserved
 *
 * Licensed under the MIT license.
 *
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *****************************************************************************/
var dijkstra = {
  single_source_shortest_paths: function(graph, s, d) {
    // Predecessor map for each node that has been encountered.
    // node ID => predecessor node ID
    var predecessors = {};

    // Costs of shortest paths from s to all nodes encountered.
    // node ID => cost
    var costs = {};
    costs[s] = 0;

    // Costs of shortest paths from s to all nodes encountered; differs from
    // `costs` in that it provides easy access to the node that currently has
    // the known shortest path from s.
    // XXX: Do we actually need both `costs` and `open`?
    var open = dijkstra.PriorityQueue.make();
    open.push(s, 0);

    var closest,
        u, v,
        cost_of_s_to_u,
        adjacent_nodes,
        cost_of_e,
        cost_of_s_to_u_plus_cost_of_e,
        cost_of_s_to_v,
        first_visit;
    while (!open.empty()) {
      // In the nodes remaining in graph that have a known cost from s,
      // find the node, u, that currently has the shortest path from s.
      closest = open.pop();
      u = closest.value;
      cost_of_s_to_u = closest.cost;

      // Get nodes adjacent to u...
      adjacent_nodes = graph[u] || {};

      // ...and explore the edges that connect u to those nodes, updating
      // the cost of the shortest paths to any or all of those nodes as
      // necessary. v is the node across the current edge from u.
      for (v in adjacent_nodes) {
        if (adjacent_nodes.hasOwnProperty(v)) {
          // Get the cost of the edge running from u to v.
          cost_of_e = adjacent_nodes[v];

          // Cost of s to u plus the cost of u to v across e--this is *a*
          // cost from s to v that may or may not be less than the current
          // known cost to v.
          cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;

          // If we haven't visited v yet OR if the current known cost from s to
          // v is greater than the new cost we just found (cost of s to u plus
          // cost of u to v across e), update v's cost in the cost list and
          // update v's predecessor in the predecessor list (it's now u).
          cost_of_s_to_v = costs[v];
          first_visit = (typeof costs[v] === 'undefined');
          if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
            costs[v] = cost_of_s_to_u_plus_cost_of_e;
            open.push(v, cost_of_s_to_u_plus_cost_of_e);
            predecessors[v] = u;
          }
        }
      }
    }

    if (typeof d !== 'undefined' && typeof costs[d] === 'undefined') {
      var msg = ['Could not find a path from ', s, ' to ', d, '.'].join('');
      throw new Error(msg);
    }

    return predecessors;
  },

  extract_shortest_path_from_predecessor_list: function(predecessors, d) {
    var nodes = [];
    var u = d;
    var predecessor;
    while (u) {
      nodes.push(u);
      predecessor = predecessors[u];
      u = predecessors[u];
    }
    nodes.reverse();
    return nodes;
  },

  find_path: function(graph, s, d) {
    var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
    return dijkstra.extract_shortest_path_from_predecessor_list(
      predecessors, d);
  },

  /**
   * A very naive priority queue implementation.
   */
  PriorityQueue: {
    make: function (opts) {
      var T = dijkstra.PriorityQueue,
          t = {},
          key;
      opts = opts || {};
      for (key in T) {
        if (T.hasOwnProperty(key)) {
          t[key] = T[key];
        }
      }
      t.queue = [];
      t.sorter = opts.sorter || T.default_sorter;
      return t;
    },

    default_sorter: function (a, b) {
      return a.cost - b.cost;
    },

    /**
     * Add a new item to the queue and ensure the highest priority element
     * is at the front of the queue.
     */
    push: function (value, cost) {
      var item = {value: value, cost: cost};
      this.queue.push(item);
      this.queue.sort(this.sorter);
    },

    /**
     * Return the highest priority element in the queue.
     */
    pop: function () {
      return this.queue.shift();
    },

    empty: function () {
      return this.queue.length === 0;
    }
  }
};


// node.js module exports
if (true) {
  module.exports = dijkstra;
}


/***/ }),

/***/ "./node_modules/pngjs/lib/bitmapper.js":
/*!*********************************************!*\
  !*** ./node_modules/pngjs/lib/bitmapper.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


let interlaceUtils = __webpack_require__(/*! ./interlace */ "./node_modules/pngjs/lib/interlace.js");

let pixelBppMapper = [
  // 0 - dummy entry
  function () {},

  // 1 - L
  // 0: 0, 1: 0, 2: 0, 3: 0xff
  function (pxData, data, pxPos, rawPos) {
    if (rawPos === data.length) {
      throw new Error("Ran out of data");
    }

    let pixel = data[rawPos];
    pxData[pxPos] = pixel;
    pxData[pxPos + 1] = pixel;
    pxData[pxPos + 2] = pixel;
    pxData[pxPos + 3] = 0xff;
  },

  // 2 - LA
  // 0: 0, 1: 0, 2: 0, 3: 1
  function (pxData, data, pxPos, rawPos) {
    if (rawPos + 1 >= data.length) {
      throw new Error("Ran out of data");
    }

    let pixel = data[rawPos];
    pxData[pxPos] = pixel;
    pxData[pxPos + 1] = pixel;
    pxData[pxPos + 2] = pixel;
    pxData[pxPos + 3] = data[rawPos + 1];
  },

  // 3 - RGB
  // 0: 0, 1: 1, 2: 2, 3: 0xff
  function (pxData, data, pxPos, rawPos) {
    if (rawPos + 2 >= data.length) {
      throw new Error("Ran out of data");
    }

    pxData[pxPos] = data[rawPos];
    pxData[pxPos + 1] = data[rawPos + 1];
    pxData[pxPos + 2] = data[rawPos + 2];
    pxData[pxPos + 3] = 0xff;
  },

  // 4 - RGBA
  // 0: 0, 1: 1, 2: 2, 3: 3
  function (pxData, data, pxPos, rawPos) {
    if (rawPos + 3 >= data.length) {
      throw new Error("Ran out of data");
    }

    pxData[pxPos] = data[rawPos];
    pxData[pxPos + 1] = data[rawPos + 1];
    pxData[pxPos + 2] = data[rawPos + 2];
    pxData[pxPos + 3] = data[rawPos + 3];
  },
];

let pixelBppCustomMapper = [
  // 0 - dummy entry
  function () {},

  // 1 - L
  // 0: 0, 1: 0, 2: 0, 3: 0xff
  function (pxData, pixelData, pxPos, maxBit) {
    let pixel = pixelData[0];
    pxData[pxPos] = pixel;
    pxData[pxPos + 1] = pixel;
    pxData[pxPos + 2] = pixel;
    pxData[pxPos + 3] = maxBit;
  },

  // 2 - LA
  // 0: 0, 1: 0, 2: 0, 3: 1
  function (pxData, pixelData, pxPos) {
    let pixel = pixelData[0];
    pxData[pxPos] = pixel;
    pxData[pxPos + 1] = pixel;
    pxData[pxPos + 2] = pixel;
    pxData[pxPos + 3] = pixelData[1];
  },

  // 3 - RGB
  // 0: 0, 1: 1, 2: 2, 3: 0xff
  function (pxData, pixelData, pxPos, maxBit) {
    pxData[pxPos] = pixelData[0];
    pxData[pxPos + 1] = pixelData[1];
    pxData[pxPos + 2] = pixelData[2];
    pxData[pxPos + 3] = maxBit;
  },

  // 4 - RGBA
  // 0: 0, 1: 1, 2: 2, 3: 3
  function (pxData, pixelData, pxPos) {
    pxData[pxPos] = pixelData[0];
    pxData[pxPos + 1] = pixelData[1];
    pxData[pxPos + 2] = pixelData[2];
    pxData[pxPos + 3] = pixelData[3];
  },
];

function bitRetriever(data, depth) {
  let leftOver = [];
  let i = 0;

  function split() {
    if (i === data.length) {
      throw new Error("Ran out of data");
    }
    let byte = data[i];
    i++;
    let byte8, byte7, byte6, byte5, byte4, byte3, byte2, byte1;
    switch (depth) {
      default:
        throw new Error("unrecognised depth");
      case 16:
        byte2 = data[i];
        i++;
        leftOver.push((byte << 8) + byte2);
        break;
      case 4:
        byte2 = byte & 0x0f;
        byte1 = byte >> 4;
        leftOver.push(byte1, byte2);
        break;
      case 2:
        byte4 = byte & 3;
        byte3 = (byte >> 2) & 3;
        byte2 = (byte >> 4) & 3;
        byte1 = (byte >> 6) & 3;
        leftOver.push(byte1, byte2, byte3, byte4);
        break;
      case 1:
        byte8 = byte & 1;
        byte7 = (byte >> 1) & 1;
        byte6 = (byte >> 2) & 1;
        byte5 = (byte >> 3) & 1;
        byte4 = (byte >> 4) & 1;
        byte3 = (byte >> 5) & 1;
        byte2 = (byte >> 6) & 1;
        byte1 = (byte >> 7) & 1;
        leftOver.push(byte1, byte2, byte3, byte4, byte5, byte6, byte7, byte8);
        break;
    }
  }

  return {
    get: function (count) {
      while (leftOver.length < count) {
        split();
      }
      let returner = leftOver.slice(0, count);
      leftOver = leftOver.slice(count);
      return returner;
    },
    resetAfterLine: function () {
      leftOver.length = 0;
    },
    end: function () {
      if (i !== data.length) {
        throw new Error("extra data found");
      }
    },
  };
}

function mapImage8Bit(image, pxData, getPxPos, bpp, data, rawPos) {
  // eslint-disable-line max-params
  let imageWidth = image.width;
  let imageHeight = image.height;
  let imagePass = image.index;
  for (let y = 0; y < imageHeight; y++) {
    for (let x = 0; x < imageWidth; x++) {
      let pxPos = getPxPos(x, y, imagePass);
      pixelBppMapper[bpp](pxData, data, pxPos, rawPos);
      rawPos += bpp; //eslint-disable-line no-param-reassign
    }
  }
  return rawPos;
}

function mapImageCustomBit(image, pxData, getPxPos, bpp, bits, maxBit) {
  // eslint-disable-line max-params
  let imageWidth = image.width;
  let imageHeight = image.height;
  let imagePass = image.index;
  for (let y = 0; y < imageHeight; y++) {
    for (let x = 0; x < imageWidth; x++) {
      let pixelData = bits.get(bpp);
      let pxPos = getPxPos(x, y, imagePass);
      pixelBppCustomMapper[bpp](pxData, pixelData, pxPos, maxBit);
    }
    bits.resetAfterLine();
  }
}

exports.dataToBitMap = function (data, bitmapInfo) {
  let width = bitmapInfo.width;
  let height = bitmapInfo.height;
  let depth = bitmapInfo.depth;
  let bpp = bitmapInfo.bpp;
  let interlace = bitmapInfo.interlace;
  let bits;

  if (depth !== 8) {
    bits = bitRetriever(data, depth);
  }
  let pxData;
  if (depth <= 8) {
    pxData = Buffer.alloc(width * height * 4);
  } else {
    pxData = new Uint16Array(width * height * 4);
  }
  let maxBit = Math.pow(2, depth) - 1;
  let rawPos = 0;
  let images;
  let getPxPos;

  if (interlace) {
    images = interlaceUtils.getImagePasses(width, height);
    getPxPos = interlaceUtils.getInterlaceIterator(width, height);
  } else {
    let nonInterlacedPxPos = 0;
    getPxPos = function () {
      let returner = nonInterlacedPxPos;
      nonInterlacedPxPos += 4;
      return returner;
    };
    images = [{ width: width, height: height }];
  }

  for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
    if (depth === 8) {
      rawPos = mapImage8Bit(
        images[imageIndex],
        pxData,
        getPxPos,
        bpp,
        data,
        rawPos
      );
    } else {
      mapImageCustomBit(
        images[imageIndex],
        pxData,
        getPxPos,
        bpp,
        bits,
        maxBit
      );
    }
  }
  if (depth === 8) {
    if (rawPos !== data.length) {
      throw new Error("extra data found");
    }
  } else {
    bits.end();
  }

  return pxData;
};


/***/ }),

/***/ "./node_modules/pngjs/lib/bitpacker.js":
/*!*********************************************!*\
  !*** ./node_modules/pngjs/lib/bitpacker.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let constants = __webpack_require__(/*! ./constants */ "./node_modules/pngjs/lib/constants.js");

module.exports = function (dataIn, width, height, options) {
  let outHasAlpha =
    [constants.COLORTYPE_COLOR_ALPHA, constants.COLORTYPE_ALPHA].indexOf(
      options.colorType
    ) !== -1;
  if (options.colorType === options.inputColorType) {
    let bigEndian = (function () {
      let buffer = new ArrayBuffer(2);
      new DataView(buffer).setInt16(0, 256, true /* littleEndian */);
      // Int16Array uses the platform's endianness.
      return new Int16Array(buffer)[0] !== 256;
    })();
    // If no need to convert to grayscale and alpha is present/absent in both, take a fast route
    if (options.bitDepth === 8 || (options.bitDepth === 16 && bigEndian)) {
      return dataIn;
    }
  }

  // map to a UInt16 array if data is 16bit, fix endianness below
  let data = options.bitDepth !== 16 ? dataIn : new Uint16Array(dataIn.buffer);

  let maxValue = 255;
  let inBpp = constants.COLORTYPE_TO_BPP_MAP[options.inputColorType];
  if (inBpp === 4 && !options.inputHasAlpha) {
    inBpp = 3;
  }
  let outBpp = constants.COLORTYPE_TO_BPP_MAP[options.colorType];
  if (options.bitDepth === 16) {
    maxValue = 65535;
    outBpp *= 2;
  }
  let outData = Buffer.alloc(width * height * outBpp);

  let inIndex = 0;
  let outIndex = 0;

  let bgColor = options.bgColor || {};
  if (bgColor.red === undefined) {
    bgColor.red = maxValue;
  }
  if (bgColor.green === undefined) {
    bgColor.green = maxValue;
  }
  if (bgColor.blue === undefined) {
    bgColor.blue = maxValue;
  }

  function getRGBA() {
    let red;
    let green;
    let blue;
    let alpha = maxValue;
    switch (options.inputColorType) {
      case constants.COLORTYPE_COLOR_ALPHA:
        alpha = data[inIndex + 3];
        red = data[inIndex];
        green = data[inIndex + 1];
        blue = data[inIndex + 2];
        break;
      case constants.COLORTYPE_COLOR:
        red = data[inIndex];
        green = data[inIndex + 1];
        blue = data[inIndex + 2];
        break;
      case constants.COLORTYPE_ALPHA:
        alpha = data[inIndex + 1];
        red = data[inIndex];
        green = red;
        blue = red;
        break;
      case constants.COLORTYPE_GRAYSCALE:
        red = data[inIndex];
        green = red;
        blue = red;
        break;
      default:
        throw new Error(
          "input color type:" +
            options.inputColorType +
            " is not supported at present"
        );
    }

    if (options.inputHasAlpha) {
      if (!outHasAlpha) {
        alpha /= maxValue;
        red = Math.min(
          Math.max(Math.round((1 - alpha) * bgColor.red + alpha * red), 0),
          maxValue
        );
        green = Math.min(
          Math.max(Math.round((1 - alpha) * bgColor.green + alpha * green), 0),
          maxValue
        );
        blue = Math.min(
          Math.max(Math.round((1 - alpha) * bgColor.blue + alpha * blue), 0),
          maxValue
        );
      }
    }
    return { red: red, green: green, blue: blue, alpha: alpha };
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let rgba = getRGBA(data, inIndex);

      switch (options.colorType) {
        case constants.COLORTYPE_COLOR_ALPHA:
        case constants.COLORTYPE_COLOR:
          if (options.bitDepth === 8) {
            outData[outIndex] = rgba.red;
            outData[outIndex + 1] = rgba.green;
            outData[outIndex + 2] = rgba.blue;
            if (outHasAlpha) {
              outData[outIndex + 3] = rgba.alpha;
            }
          } else {
            outData.writeUInt16BE(rgba.red, outIndex);
            outData.writeUInt16BE(rgba.green, outIndex + 2);
            outData.writeUInt16BE(rgba.blue, outIndex + 4);
            if (outHasAlpha) {
              outData.writeUInt16BE(rgba.alpha, outIndex + 6);
            }
          }
          break;
        case constants.COLORTYPE_ALPHA:
        case constants.COLORTYPE_GRAYSCALE: {
          // Convert to grayscale and alpha
          let grayscale = (rgba.red + rgba.green + rgba.blue) / 3;
          if (options.bitDepth === 8) {
            outData[outIndex] = grayscale;
            if (outHasAlpha) {
              outData[outIndex + 1] = rgba.alpha;
            }
          } else {
            outData.writeUInt16BE(grayscale, outIndex);
            if (outHasAlpha) {
              outData.writeUInt16BE(rgba.alpha, outIndex + 2);
            }
          }
          break;
        }
        default:
          throw new Error("unrecognised color Type " + options.colorType);
      }

      inIndex += inBpp;
      outIndex += outBpp;
    }
  }

  return outData;
};


/***/ }),

/***/ "./node_modules/pngjs/lib/chunkstream.js":
/*!***********************************************!*\
  !*** ./node_modules/pngjs/lib/chunkstream.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let util = __webpack_require__(/*! util */ "util");
let Stream = __webpack_require__(/*! stream */ "stream");

let ChunkStream = (module.exports = function () {
  Stream.call(this);

  this._buffers = [];
  this._buffered = 0;

  this._reads = [];
  this._paused = false;

  this._encoding = "utf8";
  this.writable = true;
});
util.inherits(ChunkStream, Stream);

ChunkStream.prototype.read = function (length, callback) {
  this._reads.push({
    length: Math.abs(length), // if length < 0 then at most this length
    allowLess: length < 0,
    func: callback,
  });

  process.nextTick(
    function () {
      this._process();

      // its paused and there is not enought data then ask for more
      if (this._paused && this._reads && this._reads.length > 0) {
        this._paused = false;

        this.emit("drain");
      }
    }.bind(this)
  );
};

ChunkStream.prototype.write = function (data, encoding) {
  if (!this.writable) {
    this.emit("error", new Error("Stream not writable"));
    return false;
  }

  let dataBuffer;
  if (Buffer.isBuffer(data)) {
    dataBuffer = data;
  } else {
    dataBuffer = Buffer.from(data, encoding || this._encoding);
  }

  this._buffers.push(dataBuffer);
  this._buffered += dataBuffer.length;

  this._process();

  // ok if there are no more read requests
  if (this._reads && this._reads.length === 0) {
    this._paused = true;
  }

  return this.writable && !this._paused;
};

ChunkStream.prototype.end = function (data, encoding) {
  if (data) {
    this.write(data, encoding);
  }

  this.writable = false;

  // already destroyed
  if (!this._buffers) {
    return;
  }

  // enqueue or handle end
  if (this._buffers.length === 0) {
    this._end();
  } else {
    this._buffers.push(null);
    this._process();
  }
};

ChunkStream.prototype.destroySoon = ChunkStream.prototype.end;

ChunkStream.prototype._end = function () {
  if (this._reads.length > 0) {
    this.emit("error", new Error("Unexpected end of input"));
  }

  this.destroy();
};

ChunkStream.prototype.destroy = function () {
  if (!this._buffers) {
    return;
  }

  this.writable = false;
  this._reads = null;
  this._buffers = null;

  this.emit("close");
};

ChunkStream.prototype._processReadAllowingLess = function (read) {
  // ok there is any data so that we can satisfy this request
  this._reads.shift(); // == read

  // first we need to peek into first buffer
  let smallerBuf = this._buffers[0];

  // ok there is more data than we need
  if (smallerBuf.length > read.length) {
    this._buffered -= read.length;
    this._buffers[0] = smallerBuf.slice(read.length);

    read.func.call(this, smallerBuf.slice(0, read.length));
  } else {
    // ok this is less than maximum length so use it all
    this._buffered -= smallerBuf.length;
    this._buffers.shift(); // == smallerBuf

    read.func.call(this, smallerBuf);
  }
};

ChunkStream.prototype._processRead = function (read) {
  this._reads.shift(); // == read

  let pos = 0;
  let count = 0;
  let data = Buffer.alloc(read.length);

  // create buffer for all data
  while (pos < read.length) {
    let buf = this._buffers[count++];
    let len = Math.min(buf.length, read.length - pos);

    buf.copy(data, pos, 0, len);
    pos += len;

    // last buffer wasn't used all so just slice it and leave
    if (len !== buf.length) {
      this._buffers[--count] = buf.slice(len);
    }
  }

  // remove all used buffers
  if (count > 0) {
    this._buffers.splice(0, count);
  }

  this._buffered -= read.length;

  read.func.call(this, data);
};

ChunkStream.prototype._process = function () {
  try {
    // as long as there is any data and read requests
    while (this._buffered > 0 && this._reads && this._reads.length > 0) {
      let read = this._reads[0];

      // read any data (but no more than length)
      if (read.allowLess) {
        this._processReadAllowingLess(read);
      } else if (this._buffered >= read.length) {
        // ok we can meet some expectations

        this._processRead(read);
      } else {
        // not enought data to satisfy first request in queue
        // so we need to wait for more
        break;
      }
    }

    if (this._buffers && !this.writable) {
      this._end();
    }
  } catch (ex) {
    this.emit("error", ex);
  }
};


/***/ }),

/***/ "./node_modules/pngjs/lib/constants.js":
/*!*********************************************!*\
  !*** ./node_modules/pngjs/lib/constants.js ***!
  \*********************************************/
/***/ ((module) => {

"use strict";


module.exports = {
  PNG_SIGNATURE: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],

  TYPE_IHDR: 0x49484452,
  TYPE_IEND: 0x49454e44,
  TYPE_IDAT: 0x49444154,
  TYPE_PLTE: 0x504c5445,
  TYPE_tRNS: 0x74524e53, // eslint-disable-line camelcase
  TYPE_gAMA: 0x67414d41, // eslint-disable-line camelcase

  // color-type bits
  COLORTYPE_GRAYSCALE: 0,
  COLORTYPE_PALETTE: 1,
  COLORTYPE_COLOR: 2,
  COLORTYPE_ALPHA: 4, // e.g. grayscale and alpha

  // color-type combinations
  COLORTYPE_PALETTE_COLOR: 3,
  COLORTYPE_COLOR_ALPHA: 6,

  COLORTYPE_TO_BPP_MAP: {
    0: 1,
    2: 3,
    3: 1,
    4: 2,
    6: 4,
  },

  GAMMA_DIVISION: 100000,
};


/***/ }),

/***/ "./node_modules/pngjs/lib/crc.js":
/*!***************************************!*\
  !*** ./node_modules/pngjs/lib/crc.js ***!
  \***************************************/
/***/ ((module) => {

"use strict";


let crcTable = [];

(function () {
  for (let i = 0; i < 256; i++) {
    let currentCrc = i;
    for (let j = 0; j < 8; j++) {
      if (currentCrc & 1) {
        currentCrc = 0xedb88320 ^ (currentCrc >>> 1);
      } else {
        currentCrc = currentCrc >>> 1;
      }
    }
    crcTable[i] = currentCrc;
  }
})();

let CrcCalculator = (module.exports = function () {
  this._crc = -1;
});

CrcCalculator.prototype.write = function (data) {
  for (let i = 0; i < data.length; i++) {
    this._crc = crcTable[(this._crc ^ data[i]) & 0xff] ^ (this._crc >>> 8);
  }
  return true;
};

CrcCalculator.prototype.crc32 = function () {
  return this._crc ^ -1;
};

CrcCalculator.crc32 = function (buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return crc ^ -1;
};


/***/ }),

/***/ "./node_modules/pngjs/lib/filter-pack.js":
/*!***********************************************!*\
  !*** ./node_modules/pngjs/lib/filter-pack.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let paethPredictor = __webpack_require__(/*! ./paeth-predictor */ "./node_modules/pngjs/lib/paeth-predictor.js");

function filterNone(pxData, pxPos, byteWidth, rawData, rawPos) {
  for (let x = 0; x < byteWidth; x++) {
    rawData[rawPos + x] = pxData[pxPos + x];
  }
}

function filterSumNone(pxData, pxPos, byteWidth) {
  let sum = 0;
  let length = pxPos + byteWidth;

  for (let i = pxPos; i < length; i++) {
    sum += Math.abs(pxData[i]);
  }
  return sum;
}

function filterSub(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
  for (let x = 0; x < byteWidth; x++) {
    let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
    let val = pxData[pxPos + x] - left;

    rawData[rawPos + x] = val;
  }
}

function filterSumSub(pxData, pxPos, byteWidth, bpp) {
  let sum = 0;
  for (let x = 0; x < byteWidth; x++) {
    let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
    let val = pxData[pxPos + x] - left;

    sum += Math.abs(val);
  }

  return sum;
}

function filterUp(pxData, pxPos, byteWidth, rawData, rawPos) {
  for (let x = 0; x < byteWidth; x++) {
    let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
    let val = pxData[pxPos + x] - up;

    rawData[rawPos + x] = val;
  }
}

function filterSumUp(pxData, pxPos, byteWidth) {
  let sum = 0;
  let length = pxPos + byteWidth;
  for (let x = pxPos; x < length; x++) {
    let up = pxPos > 0 ? pxData[x - byteWidth] : 0;
    let val = pxData[x] - up;

    sum += Math.abs(val);
  }

  return sum;
}

function filterAvg(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
  for (let x = 0; x < byteWidth; x++) {
    let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
    let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
    let val = pxData[pxPos + x] - ((left + up) >> 1);

    rawData[rawPos + x] = val;
  }
}

function filterSumAvg(pxData, pxPos, byteWidth, bpp) {
  let sum = 0;
  for (let x = 0; x < byteWidth; x++) {
    let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
    let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
    let val = pxData[pxPos + x] - ((left + up) >> 1);

    sum += Math.abs(val);
  }

  return sum;
}

function filterPaeth(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
  for (let x = 0; x < byteWidth; x++) {
    let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
    let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
    let upleft =
      pxPos > 0 && x >= bpp ? pxData[pxPos + x - (byteWidth + bpp)] : 0;
    let val = pxData[pxPos + x] - paethPredictor(left, up, upleft);

    rawData[rawPos + x] = val;
  }
}

function filterSumPaeth(pxData, pxPos, byteWidth, bpp) {
  let sum = 0;
  for (let x = 0; x < byteWidth; x++) {
    let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
    let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
    let upleft =
      pxPos > 0 && x >= bpp ? pxData[pxPos + x - (byteWidth + bpp)] : 0;
    let val = pxData[pxPos + x] - paethPredictor(left, up, upleft);

    sum += Math.abs(val);
  }

  return sum;
}

let filters = {
  0: filterNone,
  1: filterSub,
  2: filterUp,
  3: filterAvg,
  4: filterPaeth,
};

let filterSums = {
  0: filterSumNone,
  1: filterSumSub,
  2: filterSumUp,
  3: filterSumAvg,
  4: filterSumPaeth,
};

module.exports = function (pxData, width, height, options, bpp) {
  let filterTypes;
  if (!("filterType" in options) || options.filterType === -1) {
    filterTypes = [0, 1, 2, 3, 4];
  } else if (typeof options.filterType === "number") {
    filterTypes = [options.filterType];
  } else {
    throw new Error("unrecognised filter types");
  }

  if (options.bitDepth === 16) {
    bpp *= 2;
  }
  let byteWidth = width * bpp;
  let rawPos = 0;
  let pxPos = 0;
  let rawData = Buffer.alloc((byteWidth + 1) * height);

  let sel = filterTypes[0];

  for (let y = 0; y < height; y++) {
    if (filterTypes.length > 1) {
      // find best filter for this line (with lowest sum of values)
      let min = Infinity;

      for (let i = 0; i < filterTypes.length; i++) {
        let sum = filterSums[filterTypes[i]](pxData, pxPos, byteWidth, bpp);
        if (sum < min) {
          sel = filterTypes[i];
          min = sum;
        }
      }
    }

    rawData[rawPos] = sel;
    rawPos++;
    filters[sel](pxData, pxPos, byteWidth, rawData, rawPos, bpp);
    rawPos += byteWidth;
    pxPos += byteWidth;
  }
  return rawData;
};


/***/ }),

/***/ "./node_modules/pngjs/lib/filter-parse-async.js":
/*!******************************************************!*\
  !*** ./node_modules/pngjs/lib/filter-parse-async.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let util = __webpack_require__(/*! util */ "util");
let ChunkStream = __webpack_require__(/*! ./chunkstream */ "./node_modules/pngjs/lib/chunkstream.js");
let Filter = __webpack_require__(/*! ./filter-parse */ "./node_modules/pngjs/lib/filter-parse.js");

let FilterAsync = (module.exports = function (bitmapInfo) {
  ChunkStream.call(this);

  let buffers = [];
  let that = this;
  this._filter = new Filter(bitmapInfo, {
    read: this.read.bind(this),
    write: function (buffer) {
      buffers.push(buffer);
    },
    complete: function () {
      that.emit("complete", Buffer.concat(buffers));
    },
  });

  this._filter.start();
});
util.inherits(FilterAsync, ChunkStream);


/***/ }),

/***/ "./node_modules/pngjs/lib/filter-parse-sync.js":
/*!*****************************************************!*\
  !*** ./node_modules/pngjs/lib/filter-parse-sync.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


let SyncReader = __webpack_require__(/*! ./sync-reader */ "./node_modules/pngjs/lib/sync-reader.js");
let Filter = __webpack_require__(/*! ./filter-parse */ "./node_modules/pngjs/lib/filter-parse.js");

exports.process = function (inBuffer, bitmapInfo) {
  let outBuffers = [];
  let reader = new SyncReader(inBuffer);
  let filter = new Filter(bitmapInfo, {
    read: reader.read.bind(reader),
    write: function (bufferPart) {
      outBuffers.push(bufferPart);
    },
    complete: function () {},
  });

  filter.start();
  reader.process();

  return Buffer.concat(outBuffers);
};


/***/ }),

/***/ "./node_modules/pngjs/lib/filter-parse.js":
/*!************************************************!*\
  !*** ./node_modules/pngjs/lib/filter-parse.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let interlaceUtils = __webpack_require__(/*! ./interlace */ "./node_modules/pngjs/lib/interlace.js");
let paethPredictor = __webpack_require__(/*! ./paeth-predictor */ "./node_modules/pngjs/lib/paeth-predictor.js");

function getByteWidth(width, bpp, depth) {
  let byteWidth = width * bpp;
  if (depth !== 8) {
    byteWidth = Math.ceil(byteWidth / (8 / depth));
  }
  return byteWidth;
}

let Filter = (module.exports = function (bitmapInfo, dependencies) {
  let width = bitmapInfo.width;
  let height = bitmapInfo.height;
  let interlace = bitmapInfo.interlace;
  let bpp = bitmapInfo.bpp;
  let depth = bitmapInfo.depth;

  this.read = dependencies.read;
  this.write = dependencies.write;
  this.complete = dependencies.complete;

  this._imageIndex = 0;
  this._images = [];
  if (interlace) {
    let passes = interlaceUtils.getImagePasses(width, height);
    for (let i = 0; i < passes.length; i++) {
      this._images.push({
        byteWidth: getByteWidth(passes[i].width, bpp, depth),
        height: passes[i].height,
        lineIndex: 0,
      });
    }
  } else {
    this._images.push({
      byteWidth: getByteWidth(width, bpp, depth),
      height: height,
      lineIndex: 0,
    });
  }

  // when filtering the line we look at the pixel to the left
  // the spec also says it is done on a byte level regardless of the number of pixels
  // so if the depth is byte compatible (8 or 16) we subtract the bpp in order to compare back
  // a pixel rather than just a different byte part. However if we are sub byte, we ignore.
  if (depth === 8) {
    this._xComparison = bpp;
  } else if (depth === 16) {
    this._xComparison = bpp * 2;
  } else {
    this._xComparison = 1;
  }
});

Filter.prototype.start = function () {
  this.read(
    this._images[this._imageIndex].byteWidth + 1,
    this._reverseFilterLine.bind(this)
  );
};

Filter.prototype._unFilterType1 = function (
  rawData,
  unfilteredLine,
  byteWidth
) {
  let xComparison = this._xComparison;
  let xBiggerThan = xComparison - 1;

  for (let x = 0; x < byteWidth; x++) {
    let rawByte = rawData[1 + x];
    let f1Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
    unfilteredLine[x] = rawByte + f1Left;
  }
};

Filter.prototype._unFilterType2 = function (
  rawData,
  unfilteredLine,
  byteWidth
) {
  let lastLine = this._lastLine;

  for (let x = 0; x < byteWidth; x++) {
    let rawByte = rawData[1 + x];
    let f2Up = lastLine ? lastLine[x] : 0;
    unfilteredLine[x] = rawByte + f2Up;
  }
};

Filter.prototype._unFilterType3 = function (
  rawData,
  unfilteredLine,
  byteWidth
) {
  let xComparison = this._xComparison;
  let xBiggerThan = xComparison - 1;
  let lastLine = this._lastLine;

  for (let x = 0; x < byteWidth; x++) {
    let rawByte = rawData[1 + x];
    let f3Up = lastLine ? lastLine[x] : 0;
    let f3Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
    let f3Add = Math.floor((f3Left + f3Up) / 2);
    unfilteredLine[x] = rawByte + f3Add;
  }
};

Filter.prototype._unFilterType4 = function (
  rawData,
  unfilteredLine,
  byteWidth
) {
  let xComparison = this._xComparison;
  let xBiggerThan = xComparison - 1;
  let lastLine = this._lastLine;

  for (let x = 0; x < byteWidth; x++) {
    let rawByte = rawData[1 + x];
    let f4Up = lastLine ? lastLine[x] : 0;
    let f4Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
    let f4UpLeft = x > xBiggerThan && lastLine ? lastLine[x - xComparison] : 0;
    let f4Add = paethPredictor(f4Left, f4Up, f4UpLeft);
    unfilteredLine[x] = rawByte + f4Add;
  }
};

Filter.prototype._reverseFilterLine = function (rawData) {
  let filter = rawData[0];
  let unfilteredLine;
  let currentImage = this._images[this._imageIndex];
  let byteWidth = currentImage.byteWidth;

  if (filter === 0) {
    unfilteredLine = rawData.slice(1, byteWidth + 1);
  } else {
    unfilteredLine = Buffer.alloc(byteWidth);

    switch (filter) {
      case 1:
        this._unFilterType1(rawData, unfilteredLine, byteWidth);
        break;
      case 2:
        this._unFilterType2(rawData, unfilteredLine, byteWidth);
        break;
      case 3:
        this._unFilterType3(rawData, unfilteredLine, byteWidth);
        break;
      case 4:
        this._unFilterType4(rawData, unfilteredLine, byteWidth);
        break;
      default:
        throw new Error("Unrecognised filter type - " + filter);
    }
  }

  this.write(unfilteredLine);

  currentImage.lineIndex++;
  if (currentImage.lineIndex >= currentImage.height) {
    this._lastLine = null;
    this._imageIndex++;
    currentImage = this._images[this._imageIndex];
  } else {
    this._lastLine = unfilteredLine;
  }

  if (currentImage) {
    // read, using the byte width that may be from the new current image
    this.read(currentImage.byteWidth + 1, this._reverseFilterLine.bind(this));
  } else {
    this._lastLine = null;
    this.complete();
  }
};


/***/ }),

/***/ "./node_modules/pngjs/lib/format-normaliser.js":
/*!*****************************************************!*\
  !*** ./node_modules/pngjs/lib/format-normaliser.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


function dePalette(indata, outdata, width, height, palette) {
  let pxPos = 0;
  // use values from palette
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let color = palette[indata[pxPos]];

      if (!color) {
        throw new Error("index " + indata[pxPos] + " not in palette");
      }

      for (let i = 0; i < 4; i++) {
        outdata[pxPos + i] = color[i];
      }
      pxPos += 4;
    }
  }
}

function replaceTransparentColor(indata, outdata, width, height, transColor) {
  let pxPos = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let makeTrans = false;

      if (transColor.length === 1) {
        if (transColor[0] === indata[pxPos]) {
          makeTrans = true;
        }
      } else if (
        transColor[0] === indata[pxPos] &&
        transColor[1] === indata[pxPos + 1] &&
        transColor[2] === indata[pxPos + 2]
      ) {
        makeTrans = true;
      }
      if (makeTrans) {
        for (let i = 0; i < 4; i++) {
          outdata[pxPos + i] = 0;
        }
      }
      pxPos += 4;
    }
  }
}

function scaleDepth(indata, outdata, width, height, depth) {
  let maxOutSample = 255;
  let maxInSample = Math.pow(2, depth) - 1;
  let pxPos = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      for (let i = 0; i < 4; i++) {
        outdata[pxPos + i] = Math.floor(
          (indata[pxPos + i] * maxOutSample) / maxInSample + 0.5
        );
      }
      pxPos += 4;
    }
  }
}

module.exports = function (indata, imageData) {
  let depth = imageData.depth;
  let width = imageData.width;
  let height = imageData.height;
  let colorType = imageData.colorType;
  let transColor = imageData.transColor;
  let palette = imageData.palette;

  let outdata = indata; // only different for 16 bits

  if (colorType === 3) {
    // paletted
    dePalette(indata, outdata, width, height, palette);
  } else {
    if (transColor) {
      replaceTransparentColor(indata, outdata, width, height, transColor);
    }
    // if it needs scaling
    if (depth !== 8) {
      // if we need to change the buffer size
      if (depth === 16) {
        outdata = Buffer.alloc(width * height * 4);
      }
      scaleDepth(indata, outdata, width, height, depth);
    }
  }
  return outdata;
};


/***/ }),

/***/ "./node_modules/pngjs/lib/interlace.js":
/*!*********************************************!*\
  !*** ./node_modules/pngjs/lib/interlace.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


// Adam 7
//   0 1 2 3 4 5 6 7
// 0 x 6 4 6 x 6 4 6
// 1 7 7 7 7 7 7 7 7
// 2 5 6 5 6 5 6 5 6
// 3 7 7 7 7 7 7 7 7
// 4 3 6 4 6 3 6 4 6
// 5 7 7 7 7 7 7 7 7
// 6 5 6 5 6 5 6 5 6
// 7 7 7 7 7 7 7 7 7

let imagePasses = [
  {
    // pass 1 - 1px
    x: [0],
    y: [0],
  },
  {
    // pass 2 - 1px
    x: [4],
    y: [0],
  },
  {
    // pass 3 - 2px
    x: [0, 4],
    y: [4],
  },
  {
    // pass 4 - 4px
    x: [2, 6],
    y: [0, 4],
  },
  {
    // pass 5 - 8px
    x: [0, 2, 4, 6],
    y: [2, 6],
  },
  {
    // pass 6 - 16px
    x: [1, 3, 5, 7],
    y: [0, 2, 4, 6],
  },
  {
    // pass 7 - 32px
    x: [0, 1, 2, 3, 4, 5, 6, 7],
    y: [1, 3, 5, 7],
  },
];

exports.getImagePasses = function (width, height) {
  let images = [];
  let xLeftOver = width % 8;
  let yLeftOver = height % 8;
  let xRepeats = (width - xLeftOver) / 8;
  let yRepeats = (height - yLeftOver) / 8;
  for (let i = 0; i < imagePasses.length; i++) {
    let pass = imagePasses[i];
    let passWidth = xRepeats * pass.x.length;
    let passHeight = yRepeats * pass.y.length;
    for (let j = 0; j < pass.x.length; j++) {
      if (pass.x[j] < xLeftOver) {
        passWidth++;
      } else {
        break;
      }
    }
    for (let j = 0; j < pass.y.length; j++) {
      if (pass.y[j] < yLeftOver) {
        passHeight++;
      } else {
        break;
      }
    }
    if (passWidth > 0 && passHeight > 0) {
      images.push({ width: passWidth, height: passHeight, index: i });
    }
  }
  return images;
};

exports.getInterlaceIterator = function (width) {
  return function (x, y, pass) {
    let outerXLeftOver = x % imagePasses[pass].x.length;
    let outerX =
      ((x - outerXLeftOver) / imagePasses[pass].x.length) * 8 +
      imagePasses[pass].x[outerXLeftOver];
    let outerYLeftOver = y % imagePasses[pass].y.length;
    let outerY =
      ((y - outerYLeftOver) / imagePasses[pass].y.length) * 8 +
      imagePasses[pass].y[outerYLeftOver];
    return outerX * 4 + outerY * width * 4;
  };
};


/***/ }),

/***/ "./node_modules/pngjs/lib/packer-async.js":
/*!************************************************!*\
  !*** ./node_modules/pngjs/lib/packer-async.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let util = __webpack_require__(/*! util */ "util");
let Stream = __webpack_require__(/*! stream */ "stream");
let constants = __webpack_require__(/*! ./constants */ "./node_modules/pngjs/lib/constants.js");
let Packer = __webpack_require__(/*! ./packer */ "./node_modules/pngjs/lib/packer.js");

let PackerAsync = (module.exports = function (opt) {
  Stream.call(this);

  let options = opt || {};

  this._packer = new Packer(options);
  this._deflate = this._packer.createDeflate();

  this.readable = true;
});
util.inherits(PackerAsync, Stream);

PackerAsync.prototype.pack = function (data, width, height, gamma) {
  // Signature
  this.emit("data", Buffer.from(constants.PNG_SIGNATURE));
  this.emit("data", this._packer.packIHDR(width, height));

  if (gamma) {
    this.emit("data", this._packer.packGAMA(gamma));
  }

  let filteredData = this._packer.filterData(data, width, height);

  // compress it
  this._deflate.on("error", this.emit.bind(this, "error"));

  this._deflate.on(
    "data",
    function (compressedData) {
      this.emit("data", this._packer.packIDAT(compressedData));
    }.bind(this)
  );

  this._deflate.on(
    "end",
    function () {
      this.emit("data", this._packer.packIEND());
      this.emit("end");
    }.bind(this)
  );

  this._deflate.end(filteredData);
};


/***/ }),

/***/ "./node_modules/pngjs/lib/packer-sync.js":
/*!***********************************************!*\
  !*** ./node_modules/pngjs/lib/packer-sync.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let hasSyncZlib = true;
let zlib = __webpack_require__(/*! zlib */ "zlib");
if (!zlib.deflateSync) {
  hasSyncZlib = false;
}
let constants = __webpack_require__(/*! ./constants */ "./node_modules/pngjs/lib/constants.js");
let Packer = __webpack_require__(/*! ./packer */ "./node_modules/pngjs/lib/packer.js");

module.exports = function (metaData, opt) {
  if (!hasSyncZlib) {
    throw new Error(
      "To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0"
    );
  }

  let options = opt || {};

  let packer = new Packer(options);

  let chunks = [];

  // Signature
  chunks.push(Buffer.from(constants.PNG_SIGNATURE));

  // Header
  chunks.push(packer.packIHDR(metaData.width, metaData.height));

  if (metaData.gamma) {
    chunks.push(packer.packGAMA(metaData.gamma));
  }

  let filteredData = packer.filterData(
    metaData.data,
    metaData.width,
    metaData.height
  );

  // compress it
  let compressedData = zlib.deflateSync(
    filteredData,
    packer.getDeflateOptions()
  );
  filteredData = null;

  if (!compressedData || !compressedData.length) {
    throw new Error("bad png - invalid compressed data response");
  }
  chunks.push(packer.packIDAT(compressedData));

  // End
  chunks.push(packer.packIEND());

  return Buffer.concat(chunks);
};


/***/ }),

/***/ "./node_modules/pngjs/lib/packer.js":
/*!******************************************!*\
  !*** ./node_modules/pngjs/lib/packer.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let constants = __webpack_require__(/*! ./constants */ "./node_modules/pngjs/lib/constants.js");
let CrcStream = __webpack_require__(/*! ./crc */ "./node_modules/pngjs/lib/crc.js");
let bitPacker = __webpack_require__(/*! ./bitpacker */ "./node_modules/pngjs/lib/bitpacker.js");
let filter = __webpack_require__(/*! ./filter-pack */ "./node_modules/pngjs/lib/filter-pack.js");
let zlib = __webpack_require__(/*! zlib */ "zlib");

let Packer = (module.exports = function (options) {
  this._options = options;

  options.deflateChunkSize = options.deflateChunkSize || 32 * 1024;
  options.deflateLevel =
    options.deflateLevel != null ? options.deflateLevel : 9;
  options.deflateStrategy =
    options.deflateStrategy != null ? options.deflateStrategy : 3;
  options.inputHasAlpha =
    options.inputHasAlpha != null ? options.inputHasAlpha : true;
  options.deflateFactory = options.deflateFactory || zlib.createDeflate;
  options.bitDepth = options.bitDepth || 8;
  // This is outputColorType
  options.colorType =
    typeof options.colorType === "number"
      ? options.colorType
      : constants.COLORTYPE_COLOR_ALPHA;
  options.inputColorType =
    typeof options.inputColorType === "number"
      ? options.inputColorType
      : constants.COLORTYPE_COLOR_ALPHA;

  if (
    [
      constants.COLORTYPE_GRAYSCALE,
      constants.COLORTYPE_COLOR,
      constants.COLORTYPE_COLOR_ALPHA,
      constants.COLORTYPE_ALPHA,
    ].indexOf(options.colorType) === -1
  ) {
    throw new Error(
      "option color type:" + options.colorType + " is not supported at present"
    );
  }
  if (
    [
      constants.COLORTYPE_GRAYSCALE,
      constants.COLORTYPE_COLOR,
      constants.COLORTYPE_COLOR_ALPHA,
      constants.COLORTYPE_ALPHA,
    ].indexOf(options.inputColorType) === -1
  ) {
    throw new Error(
      "option input color type:" +
        options.inputColorType +
        " is not supported at present"
    );
  }
  if (options.bitDepth !== 8 && options.bitDepth !== 16) {
    throw new Error(
      "option bit depth:" + options.bitDepth + " is not supported at present"
    );
  }
});

Packer.prototype.getDeflateOptions = function () {
  return {
    chunkSize: this._options.deflateChunkSize,
    level: this._options.deflateLevel,
    strategy: this._options.deflateStrategy,
  };
};

Packer.prototype.createDeflate = function () {
  return this._options.deflateFactory(this.getDeflateOptions());
};

Packer.prototype.filterData = function (data, width, height) {
  // convert to correct format for filtering (e.g. right bpp and bit depth)
  let packedData = bitPacker(data, width, height, this._options);

  // filter pixel data
  let bpp = constants.COLORTYPE_TO_BPP_MAP[this._options.colorType];
  let filteredData = filter(packedData, width, height, this._options, bpp);
  return filteredData;
};

Packer.prototype._packChunk = function (type, data) {
  let len = data ? data.length : 0;
  let buf = Buffer.alloc(len + 12);

  buf.writeUInt32BE(len, 0);
  buf.writeUInt32BE(type, 4);

  if (data) {
    data.copy(buf, 8);
  }

  buf.writeInt32BE(
    CrcStream.crc32(buf.slice(4, buf.length - 4)),
    buf.length - 4
  );
  return buf;
};

Packer.prototype.packGAMA = function (gamma) {
  let buf = Buffer.alloc(4);
  buf.writeUInt32BE(Math.floor(gamma * constants.GAMMA_DIVISION), 0);
  return this._packChunk(constants.TYPE_gAMA, buf);
};

Packer.prototype.packIHDR = function (width, height) {
  let buf = Buffer.alloc(13);
  buf.writeUInt32BE(width, 0);
  buf.writeUInt32BE(height, 4);
  buf[8] = this._options.bitDepth; // Bit depth
  buf[9] = this._options.colorType; // colorType
  buf[10] = 0; // compression
  buf[11] = 0; // filter
  buf[12] = 0; // interlace

  return this._packChunk(constants.TYPE_IHDR, buf);
};

Packer.prototype.packIDAT = function (data) {
  return this._packChunk(constants.TYPE_IDAT, data);
};

Packer.prototype.packIEND = function () {
  return this._packChunk(constants.TYPE_IEND, null);
};


/***/ }),

/***/ "./node_modules/pngjs/lib/paeth-predictor.js":
/*!***************************************************!*\
  !*** ./node_modules/pngjs/lib/paeth-predictor.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function paethPredictor(left, above, upLeft) {
  let paeth = left + above - upLeft;
  let pLeft = Math.abs(paeth - left);
  let pAbove = Math.abs(paeth - above);
  let pUpLeft = Math.abs(paeth - upLeft);

  if (pLeft <= pAbove && pLeft <= pUpLeft) {
    return left;
  }
  if (pAbove <= pUpLeft) {
    return above;
  }
  return upLeft;
};


/***/ }),

/***/ "./node_modules/pngjs/lib/parser-async.js":
/*!************************************************!*\
  !*** ./node_modules/pngjs/lib/parser-async.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let util = __webpack_require__(/*! util */ "util");
let zlib = __webpack_require__(/*! zlib */ "zlib");
let ChunkStream = __webpack_require__(/*! ./chunkstream */ "./node_modules/pngjs/lib/chunkstream.js");
let FilterAsync = __webpack_require__(/*! ./filter-parse-async */ "./node_modules/pngjs/lib/filter-parse-async.js");
let Parser = __webpack_require__(/*! ./parser */ "./node_modules/pngjs/lib/parser.js");
let bitmapper = __webpack_require__(/*! ./bitmapper */ "./node_modules/pngjs/lib/bitmapper.js");
let formatNormaliser = __webpack_require__(/*! ./format-normaliser */ "./node_modules/pngjs/lib/format-normaliser.js");

let ParserAsync = (module.exports = function (options) {
  ChunkStream.call(this);

  this._parser = new Parser(options, {
    read: this.read.bind(this),
    error: this._handleError.bind(this),
    metadata: this._handleMetaData.bind(this),
    gamma: this.emit.bind(this, "gamma"),
    palette: this._handlePalette.bind(this),
    transColor: this._handleTransColor.bind(this),
    finished: this._finished.bind(this),
    inflateData: this._inflateData.bind(this),
    simpleTransparency: this._simpleTransparency.bind(this),
    headersFinished: this._headersFinished.bind(this),
  });
  this._options = options;
  this.writable = true;

  this._parser.start();
});
util.inherits(ParserAsync, ChunkStream);

ParserAsync.prototype._handleError = function (err) {
  this.emit("error", err);

  this.writable = false;

  this.destroy();

  if (this._inflate && this._inflate.destroy) {
    this._inflate.destroy();
  }

  if (this._filter) {
    this._filter.destroy();
    // For backward compatibility with Node 7 and below.
    // Suppress errors due to _inflate calling write() even after
    // it's destroy()'ed.
    this._filter.on("error", function () {});
  }

  this.errord = true;
};

ParserAsync.prototype._inflateData = function (data) {
  if (!this._inflate) {
    if (this._bitmapInfo.interlace) {
      this._inflate = zlib.createInflate();

      this._inflate.on("error", this.emit.bind(this, "error"));
      this._filter.on("complete", this._complete.bind(this));

      this._inflate.pipe(this._filter);
    } else {
      let rowSize =
        ((this._bitmapInfo.width *
          this._bitmapInfo.bpp *
          this._bitmapInfo.depth +
          7) >>
          3) +
        1;
      let imageSize = rowSize * this._bitmapInfo.height;
      let chunkSize = Math.max(imageSize, zlib.Z_MIN_CHUNK);

      this._inflate = zlib.createInflate({ chunkSize: chunkSize });
      let leftToInflate = imageSize;

      let emitError = this.emit.bind(this, "error");
      this._inflate.on("error", function (err) {
        if (!leftToInflate) {
          return;
        }

        emitError(err);
      });
      this._filter.on("complete", this._complete.bind(this));

      let filterWrite = this._filter.write.bind(this._filter);
      this._inflate.on("data", function (chunk) {
        if (!leftToInflate) {
          return;
        }

        if (chunk.length > leftToInflate) {
          chunk = chunk.slice(0, leftToInflate);
        }

        leftToInflate -= chunk.length;

        filterWrite(chunk);
      });

      this._inflate.on("end", this._filter.end.bind(this._filter));
    }
  }
  this._inflate.write(data);
};

ParserAsync.prototype._handleMetaData = function (metaData) {
  this._metaData = metaData;
  this._bitmapInfo = Object.create(metaData);

  this._filter = new FilterAsync(this._bitmapInfo);
};

ParserAsync.prototype._handleTransColor = function (transColor) {
  this._bitmapInfo.transColor = transColor;
};

ParserAsync.prototype._handlePalette = function (palette) {
  this._bitmapInfo.palette = palette;
};

ParserAsync.prototype._simpleTransparency = function () {
  this._metaData.alpha = true;
};

ParserAsync.prototype._headersFinished = function () {
  // Up until this point, we don't know if we have a tRNS chunk (alpha)
  // so we can't emit metadata any earlier
  this.emit("metadata", this._metaData);
};

ParserAsync.prototype._finished = function () {
  if (this.errord) {
    return;
  }

  if (!this._inflate) {
    this.emit("error", "No Inflate block");
  } else {
    // no more data to inflate
    this._inflate.end();
  }
};

ParserAsync.prototype._complete = function (filteredData) {
  if (this.errord) {
    return;
  }

  let normalisedBitmapData;

  try {
    let bitmapData = bitmapper.dataToBitMap(filteredData, this._bitmapInfo);

    normalisedBitmapData = formatNormaliser(bitmapData, this._bitmapInfo);
    bitmapData = null;
  } catch (ex) {
    this._handleError(ex);
    return;
  }

  this.emit("parsed", normalisedBitmapData);
};


/***/ }),

/***/ "./node_modules/pngjs/lib/parser-sync.js":
/*!***********************************************!*\
  !*** ./node_modules/pngjs/lib/parser-sync.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let hasSyncZlib = true;
let zlib = __webpack_require__(/*! zlib */ "zlib");
let inflateSync = __webpack_require__(/*! ./sync-inflate */ "./node_modules/pngjs/lib/sync-inflate.js");
if (!zlib.deflateSync) {
  hasSyncZlib = false;
}
let SyncReader = __webpack_require__(/*! ./sync-reader */ "./node_modules/pngjs/lib/sync-reader.js");
let FilterSync = __webpack_require__(/*! ./filter-parse-sync */ "./node_modules/pngjs/lib/filter-parse-sync.js");
let Parser = __webpack_require__(/*! ./parser */ "./node_modules/pngjs/lib/parser.js");
let bitmapper = __webpack_require__(/*! ./bitmapper */ "./node_modules/pngjs/lib/bitmapper.js");
let formatNormaliser = __webpack_require__(/*! ./format-normaliser */ "./node_modules/pngjs/lib/format-normaliser.js");

module.exports = function (buffer, options) {
  if (!hasSyncZlib) {
    throw new Error(
      "To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0"
    );
  }

  let err;
  function handleError(_err_) {
    err = _err_;
  }

  let metaData;
  function handleMetaData(_metaData_) {
    metaData = _metaData_;
  }

  function handleTransColor(transColor) {
    metaData.transColor = transColor;
  }

  function handlePalette(palette) {
    metaData.palette = palette;
  }

  function handleSimpleTransparency() {
    metaData.alpha = true;
  }

  let gamma;
  function handleGamma(_gamma_) {
    gamma = _gamma_;
  }

  let inflateDataList = [];
  function handleInflateData(inflatedData) {
    inflateDataList.push(inflatedData);
  }

  let reader = new SyncReader(buffer);

  let parser = new Parser(options, {
    read: reader.read.bind(reader),
    error: handleError,
    metadata: handleMetaData,
    gamma: handleGamma,
    palette: handlePalette,
    transColor: handleTransColor,
    inflateData: handleInflateData,
    simpleTransparency: handleSimpleTransparency,
  });

  parser.start();
  reader.process();

  if (err) {
    throw err;
  }

  //join together the inflate datas
  let inflateData = Buffer.concat(inflateDataList);
  inflateDataList.length = 0;

  let inflatedData;
  if (metaData.interlace) {
    inflatedData = zlib.inflateSync(inflateData);
  } else {
    let rowSize =
      ((metaData.width * metaData.bpp * metaData.depth + 7) >> 3) + 1;
    let imageSize = rowSize * metaData.height;
    inflatedData = inflateSync(inflateData, {
      chunkSize: imageSize,
      maxLength: imageSize,
    });
  }
  inflateData = null;

  if (!inflatedData || !inflatedData.length) {
    throw new Error("bad png - invalid inflate data response");
  }

  let unfilteredData = FilterSync.process(inflatedData, metaData);
  inflateData = null;

  let bitmapData = bitmapper.dataToBitMap(unfilteredData, metaData);
  unfilteredData = null;

  let normalisedBitmapData = formatNormaliser(bitmapData, metaData);

  metaData.data = normalisedBitmapData;
  metaData.gamma = gamma || 0;

  return metaData;
};


/***/ }),

/***/ "./node_modules/pngjs/lib/parser.js":
/*!******************************************!*\
  !*** ./node_modules/pngjs/lib/parser.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let constants = __webpack_require__(/*! ./constants */ "./node_modules/pngjs/lib/constants.js");
let CrcCalculator = __webpack_require__(/*! ./crc */ "./node_modules/pngjs/lib/crc.js");

let Parser = (module.exports = function (options, dependencies) {
  this._options = options;
  options.checkCRC = options.checkCRC !== false;

  this._hasIHDR = false;
  this._hasIEND = false;
  this._emittedHeadersFinished = false;

  // input flags/metadata
  this._palette = [];
  this._colorType = 0;

  this._chunks = {};
  this._chunks[constants.TYPE_IHDR] = this._handleIHDR.bind(this);
  this._chunks[constants.TYPE_IEND] = this._handleIEND.bind(this);
  this._chunks[constants.TYPE_IDAT] = this._handleIDAT.bind(this);
  this._chunks[constants.TYPE_PLTE] = this._handlePLTE.bind(this);
  this._chunks[constants.TYPE_tRNS] = this._handleTRNS.bind(this);
  this._chunks[constants.TYPE_gAMA] = this._handleGAMA.bind(this);

  this.read = dependencies.read;
  this.error = dependencies.error;
  this.metadata = dependencies.metadata;
  this.gamma = dependencies.gamma;
  this.transColor = dependencies.transColor;
  this.palette = dependencies.palette;
  this.parsed = dependencies.parsed;
  this.inflateData = dependencies.inflateData;
  this.finished = dependencies.finished;
  this.simpleTransparency = dependencies.simpleTransparency;
  this.headersFinished = dependencies.headersFinished || function () {};
});

Parser.prototype.start = function () {
  this.read(constants.PNG_SIGNATURE.length, this._parseSignature.bind(this));
};

Parser.prototype._parseSignature = function (data) {
  let signature = constants.PNG_SIGNATURE;

  for (let i = 0; i < signature.length; i++) {
    if (data[i] !== signature[i]) {
      this.error(new Error("Invalid file signature"));
      return;
    }
  }
  this.read(8, this._parseChunkBegin.bind(this));
};

Parser.prototype._parseChunkBegin = function (data) {
  // chunk content length
  let length = data.readUInt32BE(0);

  // chunk type
  let type = data.readUInt32BE(4);
  let name = "";
  for (let i = 4; i < 8; i++) {
    name += String.fromCharCode(data[i]);
  }

  //console.log('chunk ', name, length);

  // chunk flags
  let ancillary = Boolean(data[4] & 0x20); // or critical
  //    priv = Boolean(data[5] & 0x20), // or public
  //    safeToCopy = Boolean(data[7] & 0x20); // or unsafe

  if (!this._hasIHDR && type !== constants.TYPE_IHDR) {
    this.error(new Error("Expected IHDR on beggining"));
    return;
  }

  this._crc = new CrcCalculator();
  this._crc.write(Buffer.from(name));

  if (this._chunks[type]) {
    return this._chunks[type](length);
  }

  if (!ancillary) {
    this.error(new Error("Unsupported critical chunk type " + name));
    return;
  }

  this.read(length + 4, this._skipChunk.bind(this));
};

Parser.prototype._skipChunk = function (/*data*/) {
  this.read(8, this._parseChunkBegin.bind(this));
};

Parser.prototype._handleChunkEnd = function () {
  this.read(4, this._parseChunkEnd.bind(this));
};

Parser.prototype._parseChunkEnd = function (data) {
  let fileCrc = data.readInt32BE(0);
  let calcCrc = this._crc.crc32();

  // check CRC
  if (this._options.checkCRC && calcCrc !== fileCrc) {
    this.error(new Error("Crc error - " + fileCrc + " - " + calcCrc));
    return;
  }

  if (!this._hasIEND) {
    this.read(8, this._parseChunkBegin.bind(this));
  }
};

Parser.prototype._handleIHDR = function (length) {
  this.read(length, this._parseIHDR.bind(this));
};
Parser.prototype._parseIHDR = function (data) {
  this._crc.write(data);

  let width = data.readUInt32BE(0);
  let height = data.readUInt32BE(4);
  let depth = data[8];
  let colorType = data[9]; // bits: 1 palette, 2 color, 4 alpha
  let compr = data[10];
  let filter = data[11];
  let interlace = data[12];

  // console.log('    width', width, 'height', height,
  //     'depth', depth, 'colorType', colorType,
  //     'compr', compr, 'filter', filter, 'interlace', interlace
  // );

  if (
    depth !== 8 &&
    depth !== 4 &&
    depth !== 2 &&
    depth !== 1 &&
    depth !== 16
  ) {
    this.error(new Error("Unsupported bit depth " + depth));
    return;
  }
  if (!(colorType in constants.COLORTYPE_TO_BPP_MAP)) {
    this.error(new Error("Unsupported color type"));
    return;
  }
  if (compr !== 0) {
    this.error(new Error("Unsupported compression method"));
    return;
  }
  if (filter !== 0) {
    this.error(new Error("Unsupported filter method"));
    return;
  }
  if (interlace !== 0 && interlace !== 1) {
    this.error(new Error("Unsupported interlace method"));
    return;
  }

  this._colorType = colorType;

  let bpp = constants.COLORTYPE_TO_BPP_MAP[this._colorType];

  this._hasIHDR = true;

  this.metadata({
    width: width,
    height: height,
    depth: depth,
    interlace: Boolean(interlace),
    palette: Boolean(colorType & constants.COLORTYPE_PALETTE),
    color: Boolean(colorType & constants.COLORTYPE_COLOR),
    alpha: Boolean(colorType & constants.COLORTYPE_ALPHA),
    bpp: bpp,
    colorType: colorType,
  });

  this._handleChunkEnd();
};

Parser.prototype._handlePLTE = function (length) {
  this.read(length, this._parsePLTE.bind(this));
};
Parser.prototype._parsePLTE = function (data) {
  this._crc.write(data);

  let entries = Math.floor(data.length / 3);
  // console.log('Palette:', entries);

  for (let i = 0; i < entries; i++) {
    this._palette.push([data[i * 3], data[i * 3 + 1], data[i * 3 + 2], 0xff]);
  }

  this.palette(this._palette);

  this._handleChunkEnd();
};

Parser.prototype._handleTRNS = function (length) {
  this.simpleTransparency();
  this.read(length, this._parseTRNS.bind(this));
};
Parser.prototype._parseTRNS = function (data) {
  this._crc.write(data);

  // palette
  if (this._colorType === constants.COLORTYPE_PALETTE_COLOR) {
    if (this._palette.length === 0) {
      this.error(new Error("Transparency chunk must be after palette"));
      return;
    }
    if (data.length > this._palette.length) {
      this.error(new Error("More transparent colors than palette size"));
      return;
    }
    for (let i = 0; i < data.length; i++) {
      this._palette[i][3] = data[i];
    }
    this.palette(this._palette);
  }

  // for colorType 0 (grayscale) and 2 (rgb)
  // there might be one gray/color defined as transparent
  if (this._colorType === constants.COLORTYPE_GRAYSCALE) {
    // grey, 2 bytes
    this.transColor([data.readUInt16BE(0)]);
  }
  if (this._colorType === constants.COLORTYPE_COLOR) {
    this.transColor([
      data.readUInt16BE(0),
      data.readUInt16BE(2),
      data.readUInt16BE(4),
    ]);
  }

  this._handleChunkEnd();
};

Parser.prototype._handleGAMA = function (length) {
  this.read(length, this._parseGAMA.bind(this));
};
Parser.prototype._parseGAMA = function (data) {
  this._crc.write(data);
  this.gamma(data.readUInt32BE(0) / constants.GAMMA_DIVISION);

  this._handleChunkEnd();
};

Parser.prototype._handleIDAT = function (length) {
  if (!this._emittedHeadersFinished) {
    this._emittedHeadersFinished = true;
    this.headersFinished();
  }
  this.read(-length, this._parseIDAT.bind(this, length));
};
Parser.prototype._parseIDAT = function (length, data) {
  this._crc.write(data);

  if (
    this._colorType === constants.COLORTYPE_PALETTE_COLOR &&
    this._palette.length === 0
  ) {
    throw new Error("Expected palette not found");
  }

  this.inflateData(data);
  let leftOverLength = length - data.length;

  if (leftOverLength > 0) {
    this._handleIDAT(leftOverLength);
  } else {
    this._handleChunkEnd();
  }
};

Parser.prototype._handleIEND = function (length) {
  this.read(length, this._parseIEND.bind(this));
};
Parser.prototype._parseIEND = function (data) {
  this._crc.write(data);

  this._hasIEND = true;
  this._handleChunkEnd();

  if (this.finished) {
    this.finished();
  }
};


/***/ }),

/***/ "./node_modules/pngjs/lib/png-sync.js":
/*!********************************************!*\
  !*** ./node_modules/pngjs/lib/png-sync.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


let parse = __webpack_require__(/*! ./parser-sync */ "./node_modules/pngjs/lib/parser-sync.js");
let pack = __webpack_require__(/*! ./packer-sync */ "./node_modules/pngjs/lib/packer-sync.js");

exports.read = function (buffer, options) {
  return parse(buffer, options || {});
};

exports.write = function (png, options) {
  return pack(png, options);
};


/***/ }),

/***/ "./node_modules/pngjs/lib/png.js":
/*!***************************************!*\
  !*** ./node_modules/pngjs/lib/png.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


let util = __webpack_require__(/*! util */ "util");
let Stream = __webpack_require__(/*! stream */ "stream");
let Parser = __webpack_require__(/*! ./parser-async */ "./node_modules/pngjs/lib/parser-async.js");
let Packer = __webpack_require__(/*! ./packer-async */ "./node_modules/pngjs/lib/packer-async.js");
let PNGSync = __webpack_require__(/*! ./png-sync */ "./node_modules/pngjs/lib/png-sync.js");

let PNG = (exports.PNG = function (options) {
  Stream.call(this);

  options = options || {}; // eslint-disable-line no-param-reassign

  // coerce pixel dimensions to integers (also coerces undefined -> 0):
  this.width = options.width | 0;
  this.height = options.height | 0;

  this.data =
    this.width > 0 && this.height > 0
      ? Buffer.alloc(4 * this.width * this.height)
      : null;

  if (options.fill && this.data) {
    this.data.fill(0);
  }

  this.gamma = 0;
  this.readable = this.writable = true;

  this._parser = new Parser(options);

  this._parser.on("error", this.emit.bind(this, "error"));
  this._parser.on("close", this._handleClose.bind(this));
  this._parser.on("metadata", this._metadata.bind(this));
  this._parser.on("gamma", this._gamma.bind(this));
  this._parser.on(
    "parsed",
    function (data) {
      this.data = data;
      this.emit("parsed", data);
    }.bind(this)
  );

  this._packer = new Packer(options);
  this._packer.on("data", this.emit.bind(this, "data"));
  this._packer.on("end", this.emit.bind(this, "end"));
  this._parser.on("close", this._handleClose.bind(this));
  this._packer.on("error", this.emit.bind(this, "error"));
});
util.inherits(PNG, Stream);

PNG.sync = PNGSync;

PNG.prototype.pack = function () {
  if (!this.data || !this.data.length) {
    this.emit("error", "No data provided");
    return this;
  }

  process.nextTick(
    function () {
      this._packer.pack(this.data, this.width, this.height, this.gamma);
    }.bind(this)
  );

  return this;
};

PNG.prototype.parse = function (data, callback) {
  if (callback) {
    let onParsed, onError;

    onParsed = function (parsedData) {
      this.removeListener("error", onError);

      this.data = parsedData;
      callback(null, this);
    }.bind(this);

    onError = function (err) {
      this.removeListener("parsed", onParsed);

      callback(err, null);
    }.bind(this);

    this.once("parsed", onParsed);
    this.once("error", onError);
  }

  this.end(data);
  return this;
};

PNG.prototype.write = function (data) {
  this._parser.write(data);
  return true;
};

PNG.prototype.end = function (data) {
  this._parser.end(data);
};

PNG.prototype._metadata = function (metadata) {
  this.width = metadata.width;
  this.height = metadata.height;

  this.emit("metadata", metadata);
};

PNG.prototype._gamma = function (gamma) {
  this.gamma = gamma;
};

PNG.prototype._handleClose = function () {
  if (!this._parser.writable && !this._packer.readable) {
    this.emit("close");
  }
};

PNG.bitblt = function (src, dst, srcX, srcY, width, height, deltaX, deltaY) {
  // eslint-disable-line max-params
  // coerce pixel dimensions to integers (also coerces undefined -> 0):
  /* eslint-disable no-param-reassign */
  srcX |= 0;
  srcY |= 0;
  width |= 0;
  height |= 0;
  deltaX |= 0;
  deltaY |= 0;
  /* eslint-enable no-param-reassign */

  if (
    srcX > src.width ||
    srcY > src.height ||
    srcX + width > src.width ||
    srcY + height > src.height
  ) {
    throw new Error("bitblt reading outside image");
  }

  if (
    deltaX > dst.width ||
    deltaY > dst.height ||
    deltaX + width > dst.width ||
    deltaY + height > dst.height
  ) {
    throw new Error("bitblt writing outside image");
  }

  for (let y = 0; y < height; y++) {
    src.data.copy(
      dst.data,
      ((deltaY + y) * dst.width + deltaX) << 2,
      ((srcY + y) * src.width + srcX) << 2,
      ((srcY + y) * src.width + srcX + width) << 2
    );
  }
};

PNG.prototype.bitblt = function (
  dst,
  srcX,
  srcY,
  width,
  height,
  deltaX,
  deltaY
) {
  // eslint-disable-line max-params

  PNG.bitblt(this, dst, srcX, srcY, width, height, deltaX, deltaY);
  return this;
};

PNG.adjustGamma = function (src) {
  if (src.gamma) {
    for (let y = 0; y < src.height; y++) {
      for (let x = 0; x < src.width; x++) {
        let idx = (src.width * y + x) << 2;

        for (let i = 0; i < 3; i++) {
          let sample = src.data[idx + i] / 255;
          sample = Math.pow(sample, 1 / 2.2 / src.gamma);
          src.data[idx + i] = Math.round(sample * 255);
        }
      }
    }
    src.gamma = 0;
  }
};

PNG.prototype.adjustGamma = function () {
  PNG.adjustGamma(this);
};


/***/ }),

/***/ "./node_modules/pngjs/lib/sync-inflate.js":
/*!************************************************!*\
  !*** ./node_modules/pngjs/lib/sync-inflate.js ***!
  \************************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";


let assert = (__webpack_require__(/*! assert */ "assert").ok);
let zlib = __webpack_require__(/*! zlib */ "zlib");
let util = __webpack_require__(/*! util */ "util");

let kMaxLength = (__webpack_require__(/*! buffer */ "buffer").kMaxLength);

function Inflate(opts) {
  if (!(this instanceof Inflate)) {
    return new Inflate(opts);
  }

  if (opts && opts.chunkSize < zlib.Z_MIN_CHUNK) {
    opts.chunkSize = zlib.Z_MIN_CHUNK;
  }

  zlib.Inflate.call(this, opts);

  // Node 8 --> 9 compatibility check
  this._offset = this._offset === undefined ? this._outOffset : this._offset;
  this._buffer = this._buffer || this._outBuffer;

  if (opts && opts.maxLength != null) {
    this._maxLength = opts.maxLength;
  }
}

function createInflate(opts) {
  return new Inflate(opts);
}

function _close(engine, callback) {
  if (callback) {
    process.nextTick(callback);
  }

  // Caller may invoke .close after a zlib error (which will null _handle).
  if (!engine._handle) {
    return;
  }

  engine._handle.close();
  engine._handle = null;
}

Inflate.prototype._processChunk = function (chunk, flushFlag, asyncCb) {
  if (typeof asyncCb === "function") {
    return zlib.Inflate._processChunk.call(this, chunk, flushFlag, asyncCb);
  }

  let self = this;

  let availInBefore = chunk && chunk.length;
  let availOutBefore = this._chunkSize - this._offset;
  let leftToInflate = this._maxLength;
  let inOff = 0;

  let buffers = [];
  let nread = 0;

  let error;
  this.on("error", function (err) {
    error = err;
  });

  function handleChunk(availInAfter, availOutAfter) {
    if (self._hadError) {
      return;
    }

    let have = availOutBefore - availOutAfter;
    assert(have >= 0, "have should not go down");

    if (have > 0) {
      let out = self._buffer.slice(self._offset, self._offset + have);
      self._offset += have;

      if (out.length > leftToInflate) {
        out = out.slice(0, leftToInflate);
      }

      buffers.push(out);
      nread += out.length;
      leftToInflate -= out.length;

      if (leftToInflate === 0) {
        return false;
      }
    }

    if (availOutAfter === 0 || self._offset >= self._chunkSize) {
      availOutBefore = self._chunkSize;
      self._offset = 0;
      self._buffer = Buffer.allocUnsafe(self._chunkSize);
    }

    if (availOutAfter === 0) {
      inOff += availInBefore - availInAfter;
      availInBefore = availInAfter;

      return true;
    }

    return false;
  }

  assert(this._handle, "zlib binding closed");
  let res;
  do {
    res = this._handle.writeSync(
      flushFlag,
      chunk, // in
      inOff, // in_off
      availInBefore, // in_len
      this._buffer, // out
      this._offset, //out_off
      availOutBefore
    ); // out_len
    // Node 8 --> 9 compatibility check
    res = res || this._writeState;
  } while (!this._hadError && handleChunk(res[0], res[1]));

  if (this._hadError) {
    throw error;
  }

  if (nread >= kMaxLength) {
    _close(this);
    throw new RangeError(
      "Cannot create final Buffer. It would be larger than 0x" +
        kMaxLength.toString(16) +
        " bytes"
    );
  }

  let buf = Buffer.concat(buffers, nread);
  _close(this);

  return buf;
};

util.inherits(Inflate, zlib.Inflate);

function zlibBufferSync(engine, buffer) {
  if (typeof buffer === "string") {
    buffer = Buffer.from(buffer);
  }
  if (!(buffer instanceof Buffer)) {
    throw new TypeError("Not a string or buffer");
  }

  let flushFlag = engine._finishFlushFlag;
  if (flushFlag == null) {
    flushFlag = zlib.Z_FINISH;
  }

  return engine._processChunk(buffer, flushFlag);
}

function inflateSync(buffer, opts) {
  return zlibBufferSync(new Inflate(opts), buffer);
}

module.exports = exports = inflateSync;
exports.Inflate = Inflate;
exports.createInflate = createInflate;
exports.inflateSync = inflateSync;


/***/ }),

/***/ "./node_modules/pngjs/lib/sync-reader.js":
/*!***********************************************!*\
  !*** ./node_modules/pngjs/lib/sync-reader.js ***!
  \***********************************************/
/***/ ((module) => {

"use strict";


let SyncReader = (module.exports = function (buffer) {
  this._buffer = buffer;
  this._reads = [];
});

SyncReader.prototype.read = function (length, callback) {
  this._reads.push({
    length: Math.abs(length), // if length < 0 then at most this length
    allowLess: length < 0,
    func: callback,
  });
};

SyncReader.prototype.process = function () {
  // as long as there is any data and read requests
  while (this._reads.length > 0 && this._buffer.length) {
    let read = this._reads[0];

    if (
      this._buffer.length &&
      (this._buffer.length >= read.length || read.allowLess)
    ) {
      // ok there is any data so that we can satisfy this request
      this._reads.shift(); // == read

      let buf = this._buffer;

      this._buffer = buf.slice(read.length);

      read.func.call(this, buf.slice(0, read.length));
    } else {
      break;
    }
  }

  if (this._reads.length > 0) {
    return new Error("There are some read requests waitng on finished stream");
  }

  if (this._buffer.length > 0) {
    return new Error("unrecognised content at end of stream");
  }
};


/***/ }),

/***/ "./node_modules/qrcode/lib/browser.js":
/*!********************************************!*\
  !*** ./node_modules/qrcode/lib/browser.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


const canPromise = __webpack_require__(/*! ./can-promise */ "./node_modules/qrcode/lib/can-promise.js")

const QRCode = __webpack_require__(/*! ./core/qrcode */ "./node_modules/qrcode/lib/core/qrcode.js")
const CanvasRenderer = __webpack_require__(/*! ./renderer/canvas */ "./node_modules/qrcode/lib/renderer/canvas.js")
const SvgRenderer = __webpack_require__(/*! ./renderer/svg-tag.js */ "./node_modules/qrcode/lib/renderer/svg-tag.js")

function renderCanvas (renderFunc, canvas, text, opts, cb) {
  const args = [].slice.call(arguments, 1)
  const argsNum = args.length
  const isLastArgCb = typeof args[argsNum - 1] === 'function'

  if (!isLastArgCb && !canPromise()) {
    throw new Error('Callback required as last argument')
  }

  if (isLastArgCb) {
    if (argsNum < 2) {
      throw new Error('Too few arguments provided')
    }

    if (argsNum === 2) {
      cb = text
      text = canvas
      canvas = opts = undefined
    } else if (argsNum === 3) {
      if (canvas.getContext && typeof cb === 'undefined') {
        cb = opts
        opts = undefined
      } else {
        cb = opts
        opts = text
        text = canvas
        canvas = undefined
      }
    }
  } else {
    if (argsNum < 1) {
      throw new Error('Too few arguments provided')
    }

    if (argsNum === 1) {
      text = canvas
      canvas = opts = undefined
    } else if (argsNum === 2 && !canvas.getContext) {
      opts = text
      text = canvas
      canvas = undefined
    }

    return new Promise(function (resolve, reject) {
      try {
        const data = QRCode.create(text, opts)
        resolve(renderFunc(data, canvas, opts))
      } catch (e) {
        reject(e)
      }
    })
  }

  try {
    const data = QRCode.create(text, opts)
    cb(null, renderFunc(data, canvas, opts))
  } catch (e) {
    cb(e)
  }
}

exports.create = QRCode.create
exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render)
exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL)

// only svg for now.
exports.toString = renderCanvas.bind(null, function (data, _, opts) {
  return SvgRenderer.render(data, opts)
})


/***/ }),

/***/ "./node_modules/qrcode/lib/can-promise.js":
/*!************************************************!*\
  !*** ./node_modules/qrcode/lib/can-promise.js ***!
  \************************************************/
/***/ ((module) => {

// can-promise has a crash in some versions of react native that dont have
// standard global objects
// https://github.com/soldair/node-qrcode/issues/157

module.exports = function () {
  return typeof Promise === 'function' && Promise.prototype && Promise.prototype.then
}


/***/ }),

/***/ "./node_modules/qrcode/lib/core/alignment-pattern.js":
/*!***********************************************************!*\
  !*** ./node_modules/qrcode/lib/core/alignment-pattern.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/**
 * Alignment pattern are fixed reference pattern in defined positions
 * in a matrix symbology, which enables the decode software to re-synchronise
 * the coordinate mapping of the image modules in the event of moderate amounts
 * of distortion of the image.
 *
 * Alignment patterns are present only in QR Code symbols of version 2 or larger
 * and their number depends on the symbol version.
 */

const getSymbolSize = (__webpack_require__(/*! ./utils */ "./node_modules/qrcode/lib/core/utils.js").getSymbolSize)

/**
 * Calculate the row/column coordinates of the center module of each alignment pattern
 * for the specified QR Code version.
 *
 * The alignment patterns are positioned symmetrically on either side of the diagonal
 * running from the top left corner of the symbol to the bottom right corner.
 *
 * Since positions are simmetrical only half of the coordinates are returned.
 * Each item of the array will represent in turn the x and y coordinate.
 * @see {@link getPositions}
 *
 * @param  {Number} version QR Code version
 * @return {Array}          Array of coordinate
 */
exports.getRowColCoords = function getRowColCoords (version) {
  if (version === 1) return []

  const posCount = Math.floor(version / 7) + 2
  const size = getSymbolSize(version)
  const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2
  const positions = [size - 7] // Last coord is always (size - 7)

  for (let i = 1; i < posCount - 1; i++) {
    positions[i] = positions[i - 1] - intervals
  }

  positions.push(6) // First coord is always 6

  return positions.reverse()
}

/**
 * Returns an array containing the positions of each alignment pattern.
 * Each array's element represent the center point of the pattern as (x, y) coordinates
 *
 * Coordinates are calculated expanding the row/column coordinates returned by {@link getRowColCoords}
 * and filtering out the items that overlaps with finder pattern
 *
 * @example
 * For a Version 7 symbol {@link getRowColCoords} returns values 6, 22 and 38.
 * The alignment patterns, therefore, are to be centered on (row, column)
 * positions (6,22), (22,6), (22,22), (22,38), (38,22), (38,38).
 * Note that the coordinates (6,6), (6,38), (38,6) are occupied by finder patterns
 * and are not therefore used for alignment patterns.
 *
 * let pos = getPositions(7)
 * // [[6,22], [22,6], [22,22], [22,38], [38,22], [38,38]]
 *
 * @param  {Number} version QR Code version
 * @return {Array}          Array of coordinates
 */
exports.getPositions = function getPositions (version) {
  const coords = []
  const pos = exports.getRowColCoords(version)
  const posLength = pos.length

  for (let i = 0; i < posLength; i++) {
    for (let j = 0; j < posLength; j++) {
      // Skip if position is occupied by finder patterns
      if ((i === 0 && j === 0) || // top-left
          (i === 0 && j === posLength - 1) || // bottom-left
          (i === posLength - 1 && j === 0)) { // top-right
        continue
      }

      coords.push([pos[i], pos[j]])
    }
  }

  return coords
}


/***/ }),

/***/ "./node_modules/qrcode/lib/core/alphanumeric-data.js":
/*!***********************************************************!*\
  !*** ./node_modules/qrcode/lib/core/alphanumeric-data.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Mode = __webpack_require__(/*! ./mode */ "./node_modules/qrcode/lib/core/mode.js")

/**
 * Array of characters available in alphanumeric mode
 *
 * As per QR Code specification, to each character
 * is assigned a value from 0 to 44 which in this case coincides
 * with the array index
 *
 * @type {Array}
 */
const ALPHA_NUM_CHARS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  ' ', '$', '%', '*', '+', '-', '.', '/', ':'
]

function AlphanumericData (data) {
  this.mode = Mode.ALPHANUMERIC
  this.data = data
}

AlphanumericData.getBitsLength = function getBitsLength (length) {
  return 11 * Math.floor(length / 2) + 6 * (length % 2)
}

AlphanumericData.prototype.getLength = function getLength () {
  return this.data.length
}

AlphanumericData.prototype.getBitsLength = function getBitsLength () {
  return AlphanumericData.getBitsLength(this.data.length)
}

AlphanumericData.prototype.write = function write (bitBuffer) {
  let i

  // Input data characters are divided into groups of two characters
  // and encoded as 11-bit binary codes.
  for (i = 0; i + 2 <= this.data.length; i += 2) {
    // The character value of the first character is multiplied by 45
    let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45

    // The character value of the second digit is added to the product
    value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1])

    // The sum is then stored as 11-bit binary number
    bitBuffer.put(value, 11)
  }

  // If the number of input data characters is not a multiple of two,
  // the character value of the final character is encoded as a 6-bit binary number.
  if (this.data.length % 2) {
    bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6)
  }
}

module.exports = AlphanumericData


/***/ }),

/***/ "./node_modules/qrcode/lib/core/bit-buffer.js":
/*!****************************************************!*\
  !*** ./node_modules/qrcode/lib/core/bit-buffer.js ***!
  \****************************************************/
/***/ ((module) => {

function BitBuffer () {
  this.buffer = []
  this.length = 0
}

BitBuffer.prototype = {

  get: function (index) {
    const bufIndex = Math.floor(index / 8)
    return ((this.buffer[bufIndex] >>> (7 - index % 8)) & 1) === 1
  },

  put: function (num, length) {
    for (let i = 0; i < length; i++) {
      this.putBit(((num >>> (length - i - 1)) & 1) === 1)
    }
  },

  getLengthInBits: function () {
    return this.length
  },

  putBit: function (bit) {
    const bufIndex = Math.floor(this.length / 8)
    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0)
    }

    if (bit) {
      this.buffer[bufIndex] |= (0x80 >>> (this.length % 8))
    }

    this.length++
  }
}

module.exports = BitBuffer


/***/ }),

/***/ "./node_modules/qrcode/lib/core/bit-matrix.js":
/*!****************************************************!*\
  !*** ./node_modules/qrcode/lib/core/bit-matrix.js ***!
  \****************************************************/
/***/ ((module) => {

/**
 * Helper class to handle QR Code symbol modules
 *
 * @param {Number} size Symbol size
 */
function BitMatrix (size) {
  if (!size || size < 1) {
    throw new Error('BitMatrix size must be defined and greater than 0')
  }

  this.size = size
  this.data = new Uint8Array(size * size)
  this.reservedBit = new Uint8Array(size * size)
}

/**
 * Set bit value at specified location
 * If reserved flag is set, this bit will be ignored during masking process
 *
 * @param {Number}  row
 * @param {Number}  col
 * @param {Boolean} value
 * @param {Boolean} reserved
 */
BitMatrix.prototype.set = function (row, col, value, reserved) {
  const index = row * this.size + col
  this.data[index] = value
  if (reserved) this.reservedBit[index] = true
}

/**
 * Returns bit value at specified location
 *
 * @param  {Number}  row
 * @param  {Number}  col
 * @return {Boolean}
 */
BitMatrix.prototype.get = function (row, col) {
  return this.data[row * this.size + col]
}

/**
 * Applies xor operator at specified location
 * (used during masking process)
 *
 * @param {Number}  row
 * @param {Number}  col
 * @param {Boolean} value
 */
BitMatrix.prototype.xor = function (row, col, value) {
  this.data[row * this.size + col] ^= value
}

/**
 * Check if bit at specified location is reserved
 *
 * @param {Number}   row
 * @param {Number}   col
 * @return {Boolean}
 */
BitMatrix.prototype.isReserved = function (row, col) {
  return this.reservedBit[row * this.size + col]
}

module.exports = BitMatrix


/***/ }),

/***/ "./node_modules/qrcode/lib/core/byte-data.js":
/*!***************************************************!*\
  !*** ./node_modules/qrcode/lib/core/byte-data.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Mode = __webpack_require__(/*! ./mode */ "./node_modules/qrcode/lib/core/mode.js")

function ByteData (data) {
  this.mode = Mode.BYTE
  if (typeof (data) === 'string') {
    this.data = new TextEncoder().encode(data)
  } else {
    this.data = new Uint8Array(data)
  }
}

ByteData.getBitsLength = function getBitsLength (length) {
  return length * 8
}

ByteData.prototype.getLength = function getLength () {
  return this.data.length
}

ByteData.prototype.getBitsLength = function getBitsLength () {
  return ByteData.getBitsLength(this.data.length)
}

ByteData.prototype.write = function (bitBuffer) {
  for (let i = 0, l = this.data.length; i < l; i++) {
    bitBuffer.put(this.data[i], 8)
  }
}

module.exports = ByteData


/***/ }),

/***/ "./node_modules/qrcode/lib/core/error-correction-code.js":
/*!***************************************************************!*\
  !*** ./node_modules/qrcode/lib/core/error-correction-code.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const ECLevel = __webpack_require__(/*! ./error-correction-level */ "./node_modules/qrcode/lib/core/error-correction-level.js")

const EC_BLOCKS_TABLE = [
// L  M  Q  H
  1, 1, 1, 1,
  1, 1, 1, 1,
  1, 1, 2, 2,
  1, 2, 2, 4,
  1, 2, 4, 4,
  2, 4, 4, 4,
  2, 4, 6, 5,
  2, 4, 6, 6,
  2, 5, 8, 8,
  4, 5, 8, 8,
  4, 5, 8, 11,
  4, 8, 10, 11,
  4, 9, 12, 16,
  4, 9, 16, 16,
  6, 10, 12, 18,
  6, 10, 17, 16,
  6, 11, 16, 19,
  6, 13, 18, 21,
  7, 14, 21, 25,
  8, 16, 20, 25,
  8, 17, 23, 25,
  9, 17, 23, 34,
  9, 18, 25, 30,
  10, 20, 27, 32,
  12, 21, 29, 35,
  12, 23, 34, 37,
  12, 25, 34, 40,
  13, 26, 35, 42,
  14, 28, 38, 45,
  15, 29, 40, 48,
  16, 31, 43, 51,
  17, 33, 45, 54,
  18, 35, 48, 57,
  19, 37, 51, 60,
  19, 38, 53, 63,
  20, 40, 56, 66,
  21, 43, 59, 70,
  22, 45, 62, 74,
  24, 47, 65, 77,
  25, 49, 68, 81
]

const EC_CODEWORDS_TABLE = [
// L  M  Q  H
  7, 10, 13, 17,
  10, 16, 22, 28,
  15, 26, 36, 44,
  20, 36, 52, 64,
  26, 48, 72, 88,
  36, 64, 96, 112,
  40, 72, 108, 130,
  48, 88, 132, 156,
  60, 110, 160, 192,
  72, 130, 192, 224,
  80, 150, 224, 264,
  96, 176, 260, 308,
  104, 198, 288, 352,
  120, 216, 320, 384,
  132, 240, 360, 432,
  144, 280, 408, 480,
  168, 308, 448, 532,
  180, 338, 504, 588,
  196, 364, 546, 650,
  224, 416, 600, 700,
  224, 442, 644, 750,
  252, 476, 690, 816,
  270, 504, 750, 900,
  300, 560, 810, 960,
  312, 588, 870, 1050,
  336, 644, 952, 1110,
  360, 700, 1020, 1200,
  390, 728, 1050, 1260,
  420, 784, 1140, 1350,
  450, 812, 1200, 1440,
  480, 868, 1290, 1530,
  510, 924, 1350, 1620,
  540, 980, 1440, 1710,
  570, 1036, 1530, 1800,
  570, 1064, 1590, 1890,
  600, 1120, 1680, 1980,
  630, 1204, 1770, 2100,
  660, 1260, 1860, 2220,
  720, 1316, 1950, 2310,
  750, 1372, 2040, 2430
]

/**
 * Returns the number of error correction block that the QR Code should contain
 * for the specified version and error correction level.
 *
 * @param  {Number} version              QR Code version
 * @param  {Number} errorCorrectionLevel Error correction level
 * @return {Number}                      Number of error correction blocks
 */
exports.getBlocksCount = function getBlocksCount (version, errorCorrectionLevel) {
  switch (errorCorrectionLevel) {
    case ECLevel.L:
      return EC_BLOCKS_TABLE[(version - 1) * 4 + 0]
    case ECLevel.M:
      return EC_BLOCKS_TABLE[(version - 1) * 4 + 1]
    case ECLevel.Q:
      return EC_BLOCKS_TABLE[(version - 1) * 4 + 2]
    case ECLevel.H:
      return EC_BLOCKS_TABLE[(version - 1) * 4 + 3]
    default:
      return undefined
  }
}

/**
 * Returns the number of error correction codewords to use for the specified
 * version and error correction level.
 *
 * @param  {Number} version              QR Code version
 * @param  {Number} errorCorrectionLevel Error correction level
 * @return {Number}                      Number of error correction codewords
 */
exports.getTotalCodewordsCount = function getTotalCodewordsCount (version, errorCorrectionLevel) {
  switch (errorCorrectionLevel) {
    case ECLevel.L:
      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0]
    case ECLevel.M:
      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1]
    case ECLevel.Q:
      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2]
    case ECLevel.H:
      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3]
    default:
      return undefined
  }
}


/***/ }),

/***/ "./node_modules/qrcode/lib/core/error-correction-level.js":
/*!****************************************************************!*\
  !*** ./node_modules/qrcode/lib/core/error-correction-level.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports) => {

exports.L = { bit: 1 }
exports.M = { bit: 0 }
exports.Q = { bit: 3 }
exports.H = { bit: 2 }

function fromString (string) {
  if (typeof string !== 'string') {
    throw new Error('Param is not a string')
  }

  const lcStr = string.toLowerCase()

  switch (lcStr) {
    case 'l':
    case 'low':
      return exports.L

    case 'm':
    case 'medium':
      return exports.M

    case 'q':
    case 'quartile':
      return exports.Q

    case 'h':
    case 'high':
      return exports.H

    default:
      throw new Error('Unknown EC Level: ' + string)
  }
}

exports.isValid = function isValid (level) {
  return level && typeof level.bit !== 'undefined' &&
    level.bit >= 0 && level.bit < 4
}

exports.from = function from (value, defaultValue) {
  if (exports.isValid(value)) {
    return value
  }

  try {
    return fromString(value)
  } catch (e) {
    return defaultValue
  }
}


/***/ }),

/***/ "./node_modules/qrcode/lib/core/finder-pattern.js":
/*!********************************************************!*\
  !*** ./node_modules/qrcode/lib/core/finder-pattern.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const getSymbolSize = (__webpack_require__(/*! ./utils */ "./node_modules/qrcode/lib/core/utils.js").getSymbolSize)
const FINDER_PATTERN_SIZE = 7

/**
 * Returns an array containing the positions of each finder pattern.
 * Each array's element represent the top-left point of the pattern as (x, y) coordinates
 *
 * @param  {Number} version QR Code version
 * @return {Array}          Array of coordinates
 */
exports.getPositions = function getPositions (version) {
  const size = getSymbolSize(version)

  return [
    // top-left
    [0, 0],
    // top-right
    [size - FINDER_PATTERN_SIZE, 0],
    // bottom-left
    [0, size - FINDER_PATTERN_SIZE]
  ]
}


/***/ }),

/***/ "./node_modules/qrcode/lib/core/format-info.js":
/*!*****************************************************!*\
  !*** ./node_modules/qrcode/lib/core/format-info.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const Utils = __webpack_require__(/*! ./utils */ "./node_modules/qrcode/lib/core/utils.js")

const G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0)
const G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1)
const G15_BCH = Utils.getBCHDigit(G15)

/**
 * Returns format information with relative error correction bits
 *
 * The format information is a 15-bit sequence containing 5 data bits,
 * with 10 error correction bits calculated using the (15, 5) BCH code.
 *
 * @param  {Number} errorCorrectionLevel Error correction level
 * @param  {Number} mask                 Mask pattern
 * @return {Number}                      Encoded format information bits
 */
exports.getEncodedBits = function getEncodedBits (errorCorrectionLevel, mask) {
  const data = ((errorCorrectionLevel.bit << 3) | mask)
  let d = data << 10

  while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
    d ^= (G15 << (Utils.getBCHDigit(d) - G15_BCH))
  }

  // xor final data with mask pattern in order to ensure that
  // no combination of Error Correction Level and data mask pattern
  // will result in an all-zero data string
  return ((data << 10) | d) ^ G15_MASK
}


/***/ }),

/***/ "./node_modules/qrcode/lib/core/galois-field.js":
/*!******************************************************!*\
  !*** ./node_modules/qrcode/lib/core/galois-field.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

const EXP_TABLE = new Uint8Array(512)
const LOG_TABLE = new Uint8Array(256)
/**
 * Precompute the log and anti-log tables for faster computation later
 *
 * For each possible value in the galois field 2^8, we will pre-compute
 * the logarithm and anti-logarithm (exponential) of this value
 *
 * ref {@link https://en.wikiversity.org/wiki/Reed%E2%80%93Solomon_codes_for_coders#Introduction_to_mathematical_fields}
 */
;(function initTables () {
  let x = 1
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = x
    LOG_TABLE[x] = i

    x <<= 1 // multiply by 2

    // The QR code specification says to use byte-wise modulo 100011101 arithmetic.
    // This means that when a number is 256 or larger, it should be XORed with 0x11D.
    if (x & 0x100) { // similar to x >= 256, but a lot faster (because 0x100 == 256)
      x ^= 0x11D
    }
  }

  // Optimization: double the size of the anti-log table so that we don't need to mod 255 to
  // stay inside the bounds (because we will mainly use this table for the multiplication of
  // two GF numbers, no more).
  // @see {@link mul}
  for (let i = 255; i < 512; i++) {
    EXP_TABLE[i] = EXP_TABLE[i - 255]
  }
}())

/**
 * Returns log value of n inside Galois Field
 *
 * @param  {Number} n
 * @return {Number}
 */
exports.log = function log (n) {
  if (n < 1) throw new Error('log(' + n + ')')
  return LOG_TABLE[n]
}

/**
 * Returns anti-log value of n inside Galois Field
 *
 * @param  {Number} n
 * @return {Number}
 */
exports.exp = function exp (n) {
  return EXP_TABLE[n]
}

/**
 * Multiplies two number inside Galois Field
 *
 * @param  {Number} x
 * @param  {Number} y
 * @return {Number}
 */
exports.mul = function mul (x, y) {
  if (x === 0 || y === 0) return 0

  // should be EXP_TABLE[(LOG_TABLE[x] + LOG_TABLE[y]) % 255] if EXP_TABLE wasn't oversized
  // @see {@link initTables}
  return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]]
}


/***/ }),

/***/ "./node_modules/qrcode/lib/core/kanji-data.js":
/*!****************************************************!*\
  !*** ./node_modules/qrcode/lib/core/kanji-data.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Mode = __webpack_require__(/*! ./mode */ "./node_modules/qrcode/lib/core/mode.js")
const Utils = __webpack_require__(/*! ./utils */ "./node_modules/qrcode/lib/core/utils.js")

function KanjiData (data) {
  this.mode = Mode.KANJI
  this.data = data
}

KanjiData.getBitsLength = function getBitsLength (length) {
  return length * 13
}

KanjiData.prototype.getLength = function getLength () {
  return this.data.length
}

KanjiData.prototype.getBitsLength = function getBitsLength () {
  return KanjiData.getBitsLength(this.data.length)
}

KanjiData.prototype.write = function (bitBuffer) {
  let i

  // In the Shift JIS system, Kanji characters are represented by a two byte combination.
  // These byte values are shifted from the JIS X 0208 values.
  // JIS X 0208 gives details of the shift coded representation.
  for (i = 0; i < this.data.length; i++) {
    let value = Utils.toSJIS(this.data[i])

    // For characters with Shift JIS values from 0x8140 to 0x9FFC:
    if (value >= 0x8140 && value <= 0x9FFC) {
      // Subtract 0x8140 from Shift JIS value
      value -= 0x8140

    // For characters with Shift JIS values from 0xE040 to 0xEBBF
    } else if (value >= 0xE040 && value <= 0xEBBF) {
      // Subtract 0xC140 from Shift JIS value
      value -= 0xC140
    } else {
      throw new Error(
        'Invalid SJIS character: ' + this.data[i] + '\n' +
        'Make sure your charset is UTF-8')
    }

    // Multiply most significant byte of result by 0xC0
    // and add least significant byte to product
    value = (((value >>> 8) & 0xff) * 0xC0) + (value & 0xff)

    // Convert result to a 13-bit binary string
    bitBuffer.put(value, 13)
  }
}

module.exports = KanjiData


/***/ }),

/***/ "./node_modules/qrcode/lib/core/mask-pattern.js":
/*!******************************************************!*\
  !*** ./node_modules/qrcode/lib/core/mask-pattern.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

/**
 * Data mask pattern reference
 * @type {Object}
 */
exports.Patterns = {
  PATTERN000: 0,
  PATTERN001: 1,
  PATTERN010: 2,
  PATTERN011: 3,
  PATTERN100: 4,
  PATTERN101: 5,
  PATTERN110: 6,
  PATTERN111: 7
}

/**
 * Weighted penalty scores for the undesirable features
 * @type {Object}
 */
const PenaltyScores = {
  N1: 3,
  N2: 3,
  N3: 40,
  N4: 10
}

/**
 * Check if mask pattern value is valid
 *
 * @param  {Number}  mask    Mask pattern
 * @return {Boolean}         true if valid, false otherwise
 */
exports.isValid = function isValid (mask) {
  return mask != null && mask !== '' && !isNaN(mask) && mask >= 0 && mask <= 7
}

/**
 * Returns mask pattern from a value.
 * If value is not valid, returns undefined
 *
 * @param  {Number|String} value        Mask pattern value
 * @return {Number}                     Valid mask pattern or undefined
 */
exports.from = function from (value) {
  return exports.isValid(value) ? parseInt(value, 10) : undefined
}

/**
* Find adjacent modules in row/column with the same color
* and assign a penalty value.
*
* Points: N1 + i
* i is the amount by which the number of adjacent modules of the same color exceeds 5
*/
exports.getPenaltyN1 = function getPenaltyN1 (data) {
  const size = data.size
  let points = 0
  let sameCountCol = 0
  let sameCountRow = 0
  let lastCol = null
  let lastRow = null

  for (let row = 0; row < size; row++) {
    sameCountCol = sameCountRow = 0
    lastCol = lastRow = null

    for (let col = 0; col < size; col++) {
      let module = data.get(row, col)
      if (module === lastCol) {
        sameCountCol++
      } else {
        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5)
        lastCol = module
        sameCountCol = 1
      }

      module = data.get(col, row)
      if (module === lastRow) {
        sameCountRow++
      } else {
        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5)
        lastRow = module
        sameCountRow = 1
      }
    }

    if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5)
    if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5)
  }

  return points
}

/**
 * Find 2x2 blocks with the same color and assign a penalty value
 *
 * Points: N2 * (m - 1) * (n - 1)
 */
exports.getPenaltyN2 = function getPenaltyN2 (data) {
  const size = data.size
  let points = 0

  for (let row = 0; row < size - 1; row++) {
    for (let col = 0; col < size - 1; col++) {
      const last = data.get(row, col) +
        data.get(row, col + 1) +
        data.get(row + 1, col) +
        data.get(row + 1, col + 1)

      if (last === 4 || last === 0) points++
    }
  }

  return points * PenaltyScores.N2
}

/**
 * Find 1:1:3:1:1 ratio (dark:light:dark:light:dark) pattern in row/column,
 * preceded or followed by light area 4 modules wide
 *
 * Points: N3 * number of pattern found
 */
exports.getPenaltyN3 = function getPenaltyN3 (data) {
  const size = data.size
  let points = 0
  let bitsCol = 0
  let bitsRow = 0

  for (let row = 0; row < size; row++) {
    bitsCol = bitsRow = 0
    for (let col = 0; col < size; col++) {
      bitsCol = ((bitsCol << 1) & 0x7FF) | data.get(row, col)
      if (col >= 10 && (bitsCol === 0x5D0 || bitsCol === 0x05D)) points++

      bitsRow = ((bitsRow << 1) & 0x7FF) | data.get(col, row)
      if (col >= 10 && (bitsRow === 0x5D0 || bitsRow === 0x05D)) points++
    }
  }

  return points * PenaltyScores.N3
}

/**
 * Calculate proportion of dark modules in entire symbol
 *
 * Points: N4 * k
 *
 * k is the rating of the deviation of the proportion of dark modules
 * in the symbol from 50% in steps of 5%
 */
exports.getPenaltyN4 = function getPenaltyN4 (data) {
  let darkCount = 0
  const modulesCount = data.data.length

  for (let i = 0; i < modulesCount; i++) darkCount += data.data[i]

  const k = Math.abs(Math.ceil((darkCount * 100 / modulesCount) / 5) - 10)

  return k * PenaltyScores.N4
}

/**
 * Return mask value at given position
 *
 * @param  {Number} maskPattern Pattern reference value
 * @param  {Number} i           Row
 * @param  {Number} j           Column
 * @return {Boolean}            Mask value
 */
function getMaskAt (maskPattern, i, j) {
  switch (maskPattern) {
    case exports.Patterns.PATTERN000: return (i + j) % 2 === 0
    case exports.Patterns.PATTERN001: return i % 2 === 0
    case exports.Patterns.PATTERN010: return j % 3 === 0
    case exports.Patterns.PATTERN011: return (i + j) % 3 === 0
    case exports.Patterns.PATTERN100: return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0
    case exports.Patterns.PATTERN101: return (i * j) % 2 + (i * j) % 3 === 0
    case exports.Patterns.PATTERN110: return ((i * j) % 2 + (i * j) % 3) % 2 === 0
    case exports.Patterns.PATTERN111: return ((i * j) % 3 + (i + j) % 2) % 2 === 0

    default: throw new Error('bad maskPattern:' + maskPattern)
  }
}

/**
 * Apply a mask pattern to a BitMatrix
 *
 * @param  {Number}    pattern Pattern reference number
 * @param  {BitMatrix} data    BitMatrix data
 */
exports.applyMask = function applyMask (pattern, data) {
  const size = data.size

  for (let col = 0; col < size; col++) {
    for (let row = 0; row < size; row++) {
      if (data.isReserved(row, col)) continue
      data.xor(row, col, getMaskAt(pattern, row, col))
    }
  }
}

/**
 * Returns the best mask pattern for data
 *
 * @param  {BitMatrix} data
 * @return {Number} Mask pattern reference number
 */
exports.getBestMask = function getBestMask (data, setupFormatFunc) {
  const numPatterns = Object.keys(exports.Patterns).length
  let bestPattern = 0
  let lowerPenalty = Infinity

  for (let p = 0; p < numPatterns; p++) {
    setupFormatFunc(p)
    exports.applyMask(p, data)

    // Calculate penalty
    const penalty =
      exports.getPenaltyN1(data) +
      exports.getPenaltyN2(data) +
      exports.getPenaltyN3(data) +
      exports.getPenaltyN4(data)

    // Undo previously applied mask
    exports.applyMask(p, data)

    if (penalty < lowerPenalty) {
      lowerPenalty = penalty
      bestPattern = p
    }
  }

  return bestPattern
}


/***/ }),

/***/ "./node_modules/qrcode/lib/core/mode.js":
/*!**********************************************!*\
  !*** ./node_modules/qrcode/lib/core/mode.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const VersionCheck = __webpack_require__(/*! ./version-check */ "./node_modules/qrcode/lib/core/version-check.js")
const Regex = __webpack_require__(/*! ./regex */ "./node_modules/qrcode/lib/core/regex.js")

/**
 * Numeric mode encodes data from the decimal digit set (0 - 9)
 * (byte values 30HEX to 39HEX).
 * Normally, 3 data characters are represented by 10 bits.
 *
 * @type {Object}
 */
exports.NUMERIC = {
  id: 'Numeric',
  bit: 1 << 0,
  ccBits: [10, 12, 14]
}

/**
 * Alphanumeric mode encodes data from a set of 45 characters,
 * i.e. 10 numeric digits (0 - 9),
 *      26 alphabetic characters (A - Z),
 *   and 9 symbols (SP, $, %, *, +, -, ., /, :).
 * Normally, two input characters are represented by 11 bits.
 *
 * @type {Object}
 */
exports.ALPHANUMERIC = {
  id: 'Alphanumeric',
  bit: 1 << 1,
  ccBits: [9, 11, 13]
}

/**
 * In byte mode, data is encoded at 8 bits per character.
 *
 * @type {Object}
 */
exports.BYTE = {
  id: 'Byte',
  bit: 1 << 2,
  ccBits: [8, 16, 16]
}

/**
 * The Kanji mode efficiently encodes Kanji characters in accordance with
 * the Shift JIS system based on JIS X 0208.
 * The Shift JIS values are shifted from the JIS X 0208 values.
 * JIS X 0208 gives details of the shift coded representation.
 * Each two-byte character value is compacted to a 13-bit binary codeword.
 *
 * @type {Object}
 */
exports.KANJI = {
  id: 'Kanji',
  bit: 1 << 3,
  ccBits: [8, 10, 12]
}

/**
 * Mixed mode will contain a sequences of data in a combination of any of
 * the modes described above
 *
 * @type {Object}
 */
exports.MIXED = {
  bit: -1
}

/**
 * Returns the number of bits needed to store the data length
 * according to QR Code specifications.
 *
 * @param  {Mode}   mode    Data mode
 * @param  {Number} version QR Code version
 * @return {Number}         Number of bits
 */
exports.getCharCountIndicator = function getCharCountIndicator (mode, version) {
  if (!mode.ccBits) throw new Error('Invalid mode: ' + mode)

  if (!VersionCheck.isValid(version)) {
    throw new Error('Invalid version: ' + version)
  }

  if (version >= 1 && version < 10) return mode.ccBits[0]
  else if (version < 27) return mode.ccBits[1]
  return mode.ccBits[2]
}

/**
 * Returns the most efficient mode to store the specified data
 *
 * @param  {String} dataStr Input data string
 * @return {Mode}           Best mode
 */
exports.getBestModeForData = function getBestModeForData (dataStr) {
  if (Regex.testNumeric(dataStr)) return exports.NUMERIC
  else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC
  else if (Regex.testKanji(dataStr)) return exports.KANJI
  else return exports.BYTE
}

/**
 * Return mode name as string
 *
 * @param {Mode} mode Mode object
 * @returns {String}  Mode name
 */
exports.toString = function toString (mode) {
  if (mode && mode.id) return mode.id
  throw new Error('Invalid mode')
}

/**
 * Check if input param is a valid mode object
 *
 * @param   {Mode}    mode Mode object
 * @returns {Boolean} True if valid mode, false otherwise
 */
exports.isValid = function isValid (mode) {
  return mode && mode.bit && mode.ccBits
}

/**
 * Get mode object from its name
 *
 * @param   {String} string Mode name
 * @returns {Mode}          Mode object
 */
function fromString (string) {
  if (typeof string !== 'string') {
    throw new Error('Param is not a string')
  }

  const lcStr = string.toLowerCase()

  switch (lcStr) {
    case 'numeric':
      return exports.NUMERIC
    case 'alphanumeric':
      return exports.ALPHANUMERIC
    case 'kanji':
      return exports.KANJI
    case 'byte':
      return exports.BYTE
    default:
      throw new Error('Unknown mode: ' + string)
  }
}

/**
 * Returns mode from a value.
 * If value is not a valid mode, returns defaultValue
 *
 * @param  {Mode|String} value        Encoding mode
 * @param  {Mode}        defaultValue Fallback value
 * @return {Mode}                     Encoding mode
 */
exports.from = function from (value, defaultValue) {
  if (exports.isValid(value)) {
    return value
  }

  try {
    return fromString(value)
  } catch (e) {
    return defaultValue
  }
}


/***/ }),

/***/ "./node_modules/qrcode/lib/core/numeric-data.js":
/*!******************************************************!*\
  !*** ./node_modules/qrcode/lib/core/numeric-data.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Mode = __webpack_require__(/*! ./mode */ "./node_modules/qrcode/lib/core/mode.js")

function NumericData (data) {
  this.mode = Mode.NUMERIC
  this.data = data.toString()
}

NumericData.getBitsLength = function getBitsLength (length) {
  return 10 * Math.floor(length / 3) + ((length % 3) ? ((length % 3) * 3 + 1) : 0)
}

NumericData.prototype.getLength = function getLength () {
  return this.data.length
}

NumericData.prototype.getBitsLength = function getBitsLength () {
  return NumericData.getBitsLength(this.data.length)
}

NumericData.prototype.write = function write (bitBuffer) {
  let i, group, value

  // The input data string is divided into groups of three digits,
  // and each group is converted to its 10-bit binary equivalent.
  for (i = 0; i + 3 <= this.data.length; i += 3) {
    group = this.data.substr(i, 3)
    value = parseInt(group, 10)

    bitBuffer.put(value, 10)
  }

  // If the number of input digits is not an exact multiple of three,
  // the final one or two digits are converted to 4 or 7 bits respectively.
  const remainingNum = this.data.length - i
  if (remainingNum > 0) {
    group = this.data.substr(i)
    value = parseInt(group, 10)

    bitBuffer.put(value, remainingNum * 3 + 1)
  }
}

module.exports = NumericData


/***/ }),

/***/ "./node_modules/qrcode/lib/core/polynomial.js":
/*!****************************************************!*\
  !*** ./node_modules/qrcode/lib/core/polynomial.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const GF = __webpack_require__(/*! ./galois-field */ "./node_modules/qrcode/lib/core/galois-field.js")

/**
 * Multiplies two polynomials inside Galois Field
 *
 * @param  {Uint8Array} p1 Polynomial
 * @param  {Uint8Array} p2 Polynomial
 * @return {Uint8Array}    Product of p1 and p2
 */
exports.mul = function mul (p1, p2) {
  const coeff = new Uint8Array(p1.length + p2.length - 1)

  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      coeff[i + j] ^= GF.mul(p1[i], p2[j])
    }
  }

  return coeff
}

/**
 * Calculate the remainder of polynomials division
 *
 * @param  {Uint8Array} divident Polynomial
 * @param  {Uint8Array} divisor  Polynomial
 * @return {Uint8Array}          Remainder
 */
exports.mod = function mod (divident, divisor) {
  let result = new Uint8Array(divident)

  while ((result.length - divisor.length) >= 0) {
    const coeff = result[0]

    for (let i = 0; i < divisor.length; i++) {
      result[i] ^= GF.mul(divisor[i], coeff)
    }

    // remove all zeros from buffer head
    let offset = 0
    while (offset < result.length && result[offset] === 0) offset++
    result = result.slice(offset)
  }

  return result
}

/**
 * Generate an irreducible generator polynomial of specified degree
 * (used by Reed-Solomon encoder)
 *
 * @param  {Number} degree Degree of the generator polynomial
 * @return {Uint8Array}    Buffer containing polynomial coefficients
 */
exports.generateECPolynomial = function generateECPolynomial (degree) {
  let poly = new Uint8Array([1])
  for (let i = 0; i < degree; i++) {
    poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]))
  }

  return poly
}


/***/ }),

/***/ "./node_modules/qrcode/lib/core/qrcode.js":
/*!************************************************!*\
  !*** ./node_modules/qrcode/lib/core/qrcode.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const Utils = __webpack_require__(/*! ./utils */ "./node_modules/qrcode/lib/core/utils.js")
const ECLevel = __webpack_require__(/*! ./error-correction-level */ "./node_modules/qrcode/lib/core/error-correction-level.js")
const BitBuffer = __webpack_require__(/*! ./bit-buffer */ "./node_modules/qrcode/lib/core/bit-buffer.js")
const BitMatrix = __webpack_require__(/*! ./bit-matrix */ "./node_modules/qrcode/lib/core/bit-matrix.js")
const AlignmentPattern = __webpack_require__(/*! ./alignment-pattern */ "./node_modules/qrcode/lib/core/alignment-pattern.js")
const FinderPattern = __webpack_require__(/*! ./finder-pattern */ "./node_modules/qrcode/lib/core/finder-pattern.js")
const MaskPattern = __webpack_require__(/*! ./mask-pattern */ "./node_modules/qrcode/lib/core/mask-pattern.js")
const ECCode = __webpack_require__(/*! ./error-correction-code */ "./node_modules/qrcode/lib/core/error-correction-code.js")
const ReedSolomonEncoder = __webpack_require__(/*! ./reed-solomon-encoder */ "./node_modules/qrcode/lib/core/reed-solomon-encoder.js")
const Version = __webpack_require__(/*! ./version */ "./node_modules/qrcode/lib/core/version.js")
const FormatInfo = __webpack_require__(/*! ./format-info */ "./node_modules/qrcode/lib/core/format-info.js")
const Mode = __webpack_require__(/*! ./mode */ "./node_modules/qrcode/lib/core/mode.js")
const Segments = __webpack_require__(/*! ./segments */ "./node_modules/qrcode/lib/core/segments.js")

/**
 * QRCode for JavaScript
 *
 * modified by Ryan Day for nodejs support
 * Copyright (c) 2011 Ryan Day
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
//---------------------------------------------------------------------
// QRCode for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//   http://www.opensource.org/licenses/mit-license.php
//
// The word "QR Code" is registered trademark of
// DENSO WAVE INCORPORATED
//   http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------
*/

/**
 * Add finder patterns bits to matrix
 *
 * @param  {BitMatrix} matrix  Modules matrix
 * @param  {Number}    version QR Code version
 */
function setupFinderPattern (matrix, version) {
  const size = matrix.size
  const pos = FinderPattern.getPositions(version)

  for (let i = 0; i < pos.length; i++) {
    const row = pos[i][0]
    const col = pos[i][1]

    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || size <= row + r) continue

      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || size <= col + c) continue

        if ((r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
          (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          matrix.set(row + r, col + c, true, true)
        } else {
          matrix.set(row + r, col + c, false, true)
        }
      }
    }
  }
}

/**
 * Add timing pattern bits to matrix
 *
 * Note: this function must be called before {@link setupAlignmentPattern}
 *
 * @param  {BitMatrix} matrix Modules matrix
 */
function setupTimingPattern (matrix) {
  const size = matrix.size

  for (let r = 8; r < size - 8; r++) {
    const value = r % 2 === 0
    matrix.set(r, 6, value, true)
    matrix.set(6, r, value, true)
  }
}

/**
 * Add alignment patterns bits to matrix
 *
 * Note: this function must be called after {@link setupTimingPattern}
 *
 * @param  {BitMatrix} matrix  Modules matrix
 * @param  {Number}    version QR Code version
 */
function setupAlignmentPattern (matrix, version) {
  const pos = AlignmentPattern.getPositions(version)

  for (let i = 0; i < pos.length; i++) {
    const row = pos[i][0]
    const col = pos[i][1]

    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        if (r === -2 || r === 2 || c === -2 || c === 2 ||
          (r === 0 && c === 0)) {
          matrix.set(row + r, col + c, true, true)
        } else {
          matrix.set(row + r, col + c, false, true)
        }
      }
    }
  }
}

/**
 * Add version info bits to matrix
 *
 * @param  {BitMatrix} matrix  Modules matrix
 * @param  {Number}    version QR Code version
 */
function setupVersionInfo (matrix, version) {
  const size = matrix.size
  const bits = Version.getEncodedBits(version)
  let row, col, mod

  for (let i = 0; i < 18; i++) {
    row = Math.floor(i / 3)
    col = i % 3 + size - 8 - 3
    mod = ((bits >> i) & 1) === 1

    matrix.set(row, col, mod, true)
    matrix.set(col, row, mod, true)
  }
}

/**
 * Add format info bits to matrix
 *
 * @param  {BitMatrix} matrix               Modules matrix
 * @param  {ErrorCorrectionLevel}    errorCorrectionLevel Error correction level
 * @param  {Number}    maskPattern          Mask pattern reference value
 */
function setupFormatInfo (matrix, errorCorrectionLevel, maskPattern) {
  const size = matrix.size
  const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern)
  let i, mod

  for (i = 0; i < 15; i++) {
    mod = ((bits >> i) & 1) === 1

    // vertical
    if (i < 6) {
      matrix.set(i, 8, mod, true)
    } else if (i < 8) {
      matrix.set(i + 1, 8, mod, true)
    } else {
      matrix.set(size - 15 + i, 8, mod, true)
    }

    // horizontal
    if (i < 8) {
      matrix.set(8, size - i - 1, mod, true)
    } else if (i < 9) {
      matrix.set(8, 15 - i - 1 + 1, mod, true)
    } else {
      matrix.set(8, 15 - i - 1, mod, true)
    }
  }

  // fixed module
  matrix.set(size - 8, 8, 1, true)
}

/**
 * Add encoded data bits to matrix
 *
 * @param  {BitMatrix}  matrix Modules matrix
 * @param  {Uint8Array} data   Data codewords
 */
function setupData (matrix, data) {
  const size = matrix.size
  let inc = -1
  let row = size - 1
  let bitIndex = 7
  let byteIndex = 0

  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--

    while (true) {
      for (let c = 0; c < 2; c++) {
        if (!matrix.isReserved(row, col - c)) {
          let dark = false

          if (byteIndex < data.length) {
            dark = (((data[byteIndex] >>> bitIndex) & 1) === 1)
          }

          matrix.set(row, col - c, dark)
          bitIndex--

          if (bitIndex === -1) {
            byteIndex++
            bitIndex = 7
          }
        }
      }

      row += inc

      if (row < 0 || size <= row) {
        row -= inc
        inc = -inc
        break
      }
    }
  }
}

/**
 * Create encoded codewords from data input
 *
 * @param  {Number}   version              QR Code version
 * @param  {ErrorCorrectionLevel}   errorCorrectionLevel Error correction level
 * @param  {ByteData} data                 Data input
 * @return {Uint8Array}                    Buffer containing encoded codewords
 */
function createData (version, errorCorrectionLevel, segments) {
  // Prepare data buffer
  const buffer = new BitBuffer()

  segments.forEach(function (data) {
    // prefix data with mode indicator (4 bits)
    buffer.put(data.mode.bit, 4)

    // Prefix data with character count indicator.
    // The character count indicator is a string of bits that represents the
    // number of characters that are being encoded.
    // The character count indicator must be placed after the mode indicator
    // and must be a certain number of bits long, depending on the QR version
    // and data mode
    // @see {@link Mode.getCharCountIndicator}.
    buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version))

    // add binary data sequence to buffer
    data.write(buffer)
  })

  // Calculate required number of bits
  const totalCodewords = Utils.getSymbolTotalCodewords(version)
  const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel)
  const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8

  // Add a terminator.
  // If the bit string is shorter than the total number of required bits,
  // a terminator of up to four 0s must be added to the right side of the string.
  // If the bit string is more than four bits shorter than the required number of bits,
  // add four 0s to the end.
  if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
    buffer.put(0, 4)
  }

  // If the bit string is fewer than four bits shorter, add only the number of 0s that
  // are needed to reach the required number of bits.

  // After adding the terminator, if the number of bits in the string is not a multiple of 8,
  // pad the string on the right with 0s to make the string's length a multiple of 8.
  while (buffer.getLengthInBits() % 8 !== 0) {
    buffer.putBit(0)
  }

  // Add pad bytes if the string is still shorter than the total number of required bits.
  // Extend the buffer to fill the data capacity of the symbol corresponding to
  // the Version and Error Correction Level by adding the Pad Codewords 11101100 (0xEC)
  // and 00010001 (0x11) alternately.
  const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8
  for (let i = 0; i < remainingByte; i++) {
    buffer.put(i % 2 ? 0x11 : 0xEC, 8)
  }

  return createCodewords(buffer, version, errorCorrectionLevel)
}

/**
 * Encode input data with Reed-Solomon and return codewords with
 * relative error correction bits
 *
 * @param  {BitBuffer} bitBuffer            Data to encode
 * @param  {Number}    version              QR Code version
 * @param  {ErrorCorrectionLevel} errorCorrectionLevel Error correction level
 * @return {Uint8Array}                     Buffer containing encoded codewords
 */
function createCodewords (bitBuffer, version, errorCorrectionLevel) {
  // Total codewords for this QR code version (Data + Error correction)
  const totalCodewords = Utils.getSymbolTotalCodewords(version)

  // Total number of error correction codewords
  const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel)

  // Total number of data codewords
  const dataTotalCodewords = totalCodewords - ecTotalCodewords

  // Total number of blocks
  const ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel)

  // Calculate how many blocks each group should contain
  const blocksInGroup2 = totalCodewords % ecTotalBlocks
  const blocksInGroup1 = ecTotalBlocks - blocksInGroup2

  const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks)

  const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks)
  const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1

  // Number of EC codewords is the same for both groups
  const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1

  // Initialize a Reed-Solomon encoder with a generator polynomial of degree ecCount
  const rs = new ReedSolomonEncoder(ecCount)

  let offset = 0
  const dcData = new Array(ecTotalBlocks)
  const ecData = new Array(ecTotalBlocks)
  let maxDataSize = 0
  const buffer = new Uint8Array(bitBuffer.buffer)

  // Divide the buffer into the required number of blocks
  for (let b = 0; b < ecTotalBlocks; b++) {
    const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2

    // extract a block of data from buffer
    dcData[b] = buffer.slice(offset, offset + dataSize)

    // Calculate EC codewords for this data block
    ecData[b] = rs.encode(dcData[b])

    offset += dataSize
    maxDataSize = Math.max(maxDataSize, dataSize)
  }

  // Create final data
  // Interleave the data and error correction codewords from each block
  const data = new Uint8Array(totalCodewords)
  let index = 0
  let i, r

  // Add data codewords
  for (i = 0; i < maxDataSize; i++) {
    for (r = 0; r < ecTotalBlocks; r++) {
      if (i < dcData[r].length) {
        data[index++] = dcData[r][i]
      }
    }
  }

  // Apped EC codewords
  for (i = 0; i < ecCount; i++) {
    for (r = 0; r < ecTotalBlocks; r++) {
      data[index++] = ecData[r][i]
    }
  }

  return data
}

/**
 * Build QR Code symbol
 *
 * @param  {String} data                 Input string
 * @param  {Number} version              QR Code version
 * @param  {ErrorCorretionLevel} errorCorrectionLevel Error level
 * @param  {MaskPattern} maskPattern     Mask pattern
 * @return {Object}                      Object containing symbol data
 */
function createSymbol (data, version, errorCorrectionLevel, maskPattern) {
  let segments

  if (Array.isArray(data)) {
    segments = Segments.fromArray(data)
  } else if (typeof data === 'string') {
    let estimatedVersion = version

    if (!estimatedVersion) {
      const rawSegments = Segments.rawSplit(data)

      // Estimate best version that can contain raw splitted segments
      estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel)
    }

    // Build optimized segments
    // If estimated version is undefined, try with the highest version
    segments = Segments.fromString(data, estimatedVersion || 40)
  } else {
    throw new Error('Invalid data')
  }

  // Get the min version that can contain data
  const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel)

  // If no version is found, data cannot be stored
  if (!bestVersion) {
    throw new Error('The amount of data is too big to be stored in a QR Code')
  }

  // If not specified, use min version as default
  if (!version) {
    version = bestVersion

  // Check if the specified version can contain the data
  } else if (version < bestVersion) {
    throw new Error('\n' +
      'The chosen QR Code version cannot contain this amount of data.\n' +
      'Minimum version required to store current data is: ' + bestVersion + '.\n'
    )
  }

  const dataBits = createData(version, errorCorrectionLevel, segments)

  // Allocate matrix buffer
  const moduleCount = Utils.getSymbolSize(version)
  const modules = new BitMatrix(moduleCount)

  // Add function modules
  setupFinderPattern(modules, version)
  setupTimingPattern(modules)
  setupAlignmentPattern(modules, version)

  // Add temporary dummy bits for format info just to set them as reserved.
  // This is needed to prevent these bits from being masked by {@link MaskPattern.applyMask}
  // since the masking operation must be performed only on the encoding region.
  // These blocks will be replaced with correct values later in code.
  setupFormatInfo(modules, errorCorrectionLevel, 0)

  if (version >= 7) {
    setupVersionInfo(modules, version)
  }

  // Add data codewords
  setupData(modules, dataBits)

  if (isNaN(maskPattern)) {
    // Find best mask pattern
    maskPattern = MaskPattern.getBestMask(modules,
      setupFormatInfo.bind(null, modules, errorCorrectionLevel))
  }

  // Apply mask pattern
  MaskPattern.applyMask(maskPattern, modules)

  // Replace format info bits with correct values
  setupFormatInfo(modules, errorCorrectionLevel, maskPattern)

  return {
    modules: modules,
    version: version,
    errorCorrectionLevel: errorCorrectionLevel,
    maskPattern: maskPattern,
    segments: segments
  }
}

/**
 * QR Code
 *
 * @param {String | Array} data                 Input data
 * @param {Object} options                      Optional configurations
 * @param {Number} options.version              QR Code version
 * @param {String} options.errorCorrectionLevel Error correction level
 * @param {Function} options.toSJISFunc         Helper func to convert utf8 to sjis
 */
exports.create = function create (data, options) {
  if (typeof data === 'undefined' || data === '') {
    throw new Error('No input text')
  }

  let errorCorrectionLevel = ECLevel.M
  let version
  let mask

  if (typeof options !== 'undefined') {
    // Use higher error correction level as default
    errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M)
    version = Version.from(options.version)
    mask = MaskPattern.from(options.maskPattern)

    if (options.toSJISFunc) {
      Utils.setToSJISFunction(options.toSJISFunc)
    }
  }

  return createSymbol(data, version, errorCorrectionLevel, mask)
}


/***/ }),

/***/ "./node_modules/qrcode/lib/core/reed-solomon-encoder.js":
/*!**************************************************************!*\
  !*** ./node_modules/qrcode/lib/core/reed-solomon-encoder.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Polynomial = __webpack_require__(/*! ./polynomial */ "./node_modules/qrcode/lib/core/polynomial.js")

function ReedSolomonEncoder (degree) {
  this.genPoly = undefined
  this.degree = degree

  if (this.degree) this.initialize(this.degree)
}

/**
 * Initialize the encoder.
 * The input param should correspond to the number of error correction codewords.
 *
 * @param  {Number} degree
 */
ReedSolomonEncoder.prototype.initialize = function initialize (degree) {
  // create an irreducible generator polynomial
  this.degree = degree
  this.genPoly = Polynomial.generateECPolynomial(this.degree)
}

/**
 * Encodes a chunk of data
 *
 * @param  {Uint8Array} data Buffer containing input data
 * @return {Uint8Array}      Buffer containing encoded data
 */
ReedSolomonEncoder.prototype.encode = function encode (data) {
  if (!this.genPoly) {
    throw new Error('Encoder not initialized')
  }

  // Calculate EC for this data block
  // extends data size to data+genPoly size
  const paddedData = new Uint8Array(data.length + this.degree)
  paddedData.set(data)

  // The error correction codewords are the remainder after dividing the data codewords
  // by a generator polynomial
  const remainder = Polynomial.mod(paddedData, this.genPoly)

  // return EC data blocks (last n byte, where n is the degree of genPoly)
  // If coefficients number in remainder are less than genPoly degree,
  // pad with 0s to the left to reach the needed number of coefficients
  const start = this.degree - remainder.length
  if (start > 0) {
    const buff = new Uint8Array(this.degree)
    buff.set(remainder, start)

    return buff
  }

  return remainder
}

module.exports = ReedSolomonEncoder


/***/ }),

/***/ "./node_modules/qrcode/lib/core/regex.js":
/*!***********************************************!*\
  !*** ./node_modules/qrcode/lib/core/regex.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {

const numeric = '[0-9]+'
const alphanumeric = '[A-Z $%*+\\-./:]+'
let kanji = '(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|' +
  '[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|' +
  '[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|' +
  '[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+'
kanji = kanji.replace(/u/g, '\\u')

const byte = '(?:(?![A-Z0-9 $%*+\\-./:]|' + kanji + ')(?:.|[\r\n]))+'

exports.KANJI = new RegExp(kanji, 'g')
exports.BYTE_KANJI = new RegExp('[^A-Z0-9 $%*+\\-./:]+', 'g')
exports.BYTE = new RegExp(byte, 'g')
exports.NUMERIC = new RegExp(numeric, 'g')
exports.ALPHANUMERIC = new RegExp(alphanumeric, 'g')

const TEST_KANJI = new RegExp('^' + kanji + '$')
const TEST_NUMERIC = new RegExp('^' + numeric + '$')
const TEST_ALPHANUMERIC = new RegExp('^[A-Z0-9 $%*+\\-./:]+$')

exports.testKanji = function testKanji (str) {
  return TEST_KANJI.test(str)
}

exports.testNumeric = function testNumeric (str) {
  return TEST_NUMERIC.test(str)
}

exports.testAlphanumeric = function testAlphanumeric (str) {
  return TEST_ALPHANUMERIC.test(str)
}


/***/ }),

/***/ "./node_modules/qrcode/lib/core/segments.js":
/*!**************************************************!*\
  !*** ./node_modules/qrcode/lib/core/segments.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const Mode = __webpack_require__(/*! ./mode */ "./node_modules/qrcode/lib/core/mode.js")
const NumericData = __webpack_require__(/*! ./numeric-data */ "./node_modules/qrcode/lib/core/numeric-data.js")
const AlphanumericData = __webpack_require__(/*! ./alphanumeric-data */ "./node_modules/qrcode/lib/core/alphanumeric-data.js")
const ByteData = __webpack_require__(/*! ./byte-data */ "./node_modules/qrcode/lib/core/byte-data.js")
const KanjiData = __webpack_require__(/*! ./kanji-data */ "./node_modules/qrcode/lib/core/kanji-data.js")
const Regex = __webpack_require__(/*! ./regex */ "./node_modules/qrcode/lib/core/regex.js")
const Utils = __webpack_require__(/*! ./utils */ "./node_modules/qrcode/lib/core/utils.js")
const dijkstra = __webpack_require__(/*! dijkstrajs */ "./node_modules/dijkstrajs/dijkstra.js")

/**
 * Returns UTF8 byte length
 *
 * @param  {String} str Input string
 * @return {Number}     Number of byte
 */
function getStringByteLength (str) {
  return unescape(encodeURIComponent(str)).length
}

/**
 * Get a list of segments of the specified mode
 * from a string
 *
 * @param  {Mode}   mode Segment mode
 * @param  {String} str  String to process
 * @return {Array}       Array of object with segments data
 */
function getSegments (regex, mode, str) {
  const segments = []
  let result

  while ((result = regex.exec(str)) !== null) {
    segments.push({
      data: result[0],
      index: result.index,
      mode: mode,
      length: result[0].length
    })
  }

  return segments
}

/**
 * Extracts a series of segments with the appropriate
 * modes from a string
 *
 * @param  {String} dataStr Input string
 * @return {Array}          Array of object with segments data
 */
function getSegmentsFromString (dataStr) {
  const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr)
  const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr)
  let byteSegs
  let kanjiSegs

  if (Utils.isKanjiModeEnabled()) {
    byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr)
    kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr)
  } else {
    byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr)
    kanjiSegs = []
  }

  const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs)

  return segs
    .sort(function (s1, s2) {
      return s1.index - s2.index
    })
    .map(function (obj) {
      return {
        data: obj.data,
        mode: obj.mode,
        length: obj.length
      }
    })
}

/**
 * Returns how many bits are needed to encode a string of
 * specified length with the specified mode
 *
 * @param  {Number} length String length
 * @param  {Mode} mode     Segment mode
 * @return {Number}        Bit length
 */
function getSegmentBitsLength (length, mode) {
  switch (mode) {
    case Mode.NUMERIC:
      return NumericData.getBitsLength(length)
    case Mode.ALPHANUMERIC:
      return AlphanumericData.getBitsLength(length)
    case Mode.KANJI:
      return KanjiData.getBitsLength(length)
    case Mode.BYTE:
      return ByteData.getBitsLength(length)
  }
}

/**
 * Merges adjacent segments which have the same mode
 *
 * @param  {Array} segs Array of object with segments data
 * @return {Array}      Array of object with segments data
 */
function mergeSegments (segs) {
  return segs.reduce(function (acc, curr) {
    const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null
    if (prevSeg && prevSeg.mode === curr.mode) {
      acc[acc.length - 1].data += curr.data
      return acc
    }

    acc.push(curr)
    return acc
  }, [])
}

/**
 * Generates a list of all possible nodes combination which
 * will be used to build a segments graph.
 *
 * Nodes are divided by groups. Each group will contain a list of all the modes
 * in which is possible to encode the given text.
 *
 * For example the text '12345' can be encoded as Numeric, Alphanumeric or Byte.
 * The group for '12345' will contain then 3 objects, one for each
 * possible encoding mode.
 *
 * Each node represents a possible segment.
 *
 * @param  {Array} segs Array of object with segments data
 * @return {Array}      Array of object with segments data
 */
function buildNodes (segs) {
  const nodes = []
  for (let i = 0; i < segs.length; i++) {
    const seg = segs[i]

    switch (seg.mode) {
      case Mode.NUMERIC:
        nodes.push([seg,
          { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
          { data: seg.data, mode: Mode.BYTE, length: seg.length }
        ])
        break
      case Mode.ALPHANUMERIC:
        nodes.push([seg,
          { data: seg.data, mode: Mode.BYTE, length: seg.length }
        ])
        break
      case Mode.KANJI:
        nodes.push([seg,
          { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
        ])
        break
      case Mode.BYTE:
        nodes.push([
          { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
        ])
    }
  }

  return nodes
}

/**
 * Builds a graph from a list of nodes.
 * All segments in each node group will be connected with all the segments of
 * the next group and so on.
 *
 * At each connection will be assigned a weight depending on the
 * segment's byte length.
 *
 * @param  {Array} nodes    Array of object with segments data
 * @param  {Number} version QR Code version
 * @return {Object}         Graph of all possible segments
 */
function buildGraph (nodes, version) {
  const table = {}
  const graph = { start: {} }
  let prevNodeIds = ['start']

  for (let i = 0; i < nodes.length; i++) {
    const nodeGroup = nodes[i]
    const currentNodeIds = []

    for (let j = 0; j < nodeGroup.length; j++) {
      const node = nodeGroup[j]
      const key = '' + i + j

      currentNodeIds.push(key)
      table[key] = { node: node, lastCount: 0 }
      graph[key] = {}

      for (let n = 0; n < prevNodeIds.length; n++) {
        const prevNodeId = prevNodeIds[n]

        if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
          graph[prevNodeId][key] =
            getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) -
            getSegmentBitsLength(table[prevNodeId].lastCount, node.mode)

          table[prevNodeId].lastCount += node.length
        } else {
          if (table[prevNodeId]) table[prevNodeId].lastCount = node.length

          graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) +
            4 + Mode.getCharCountIndicator(node.mode, version) // switch cost
        }
      }
    }

    prevNodeIds = currentNodeIds
  }

  for (let n = 0; n < prevNodeIds.length; n++) {
    graph[prevNodeIds[n]].end = 0
  }

  return { map: graph, table: table }
}

/**
 * Builds a segment from a specified data and mode.
 * If a mode is not specified, the more suitable will be used.
 *
 * @param  {String} data             Input data
 * @param  {Mode | String} modesHint Data mode
 * @return {Segment}                 Segment
 */
function buildSingleSegment (data, modesHint) {
  let mode
  const bestMode = Mode.getBestModeForData(data)

  mode = Mode.from(modesHint, bestMode)

  // Make sure data can be encoded
  if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
    throw new Error('"' + data + '"' +
      ' cannot be encoded with mode ' + Mode.toString(mode) +
      '.\n Suggested mode is: ' + Mode.toString(bestMode))
  }

  // Use Mode.BYTE if Kanji support is disabled
  if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
    mode = Mode.BYTE
  }

  switch (mode) {
    case Mode.NUMERIC:
      return new NumericData(data)

    case Mode.ALPHANUMERIC:
      return new AlphanumericData(data)

    case Mode.KANJI:
      return new KanjiData(data)

    case Mode.BYTE:
      return new ByteData(data)
  }
}

/**
 * Builds a list of segments from an array.
 * Array can contain Strings or Objects with segment's info.
 *
 * For each item which is a string, will be generated a segment with the given
 * string and the more appropriate encoding mode.
 *
 * For each item which is an object, will be generated a segment with the given
 * data and mode.
 * Objects must contain at least the property "data".
 * If property "mode" is not present, the more suitable mode will be used.
 *
 * @param  {Array} array Array of objects with segments data
 * @return {Array}       Array of Segments
 */
exports.fromArray = function fromArray (array) {
  return array.reduce(function (acc, seg) {
    if (typeof seg === 'string') {
      acc.push(buildSingleSegment(seg, null))
    } else if (seg.data) {
      acc.push(buildSingleSegment(seg.data, seg.mode))
    }

    return acc
  }, [])
}

/**
 * Builds an optimized sequence of segments from a string,
 * which will produce the shortest possible bitstream.
 *
 * @param  {String} data    Input string
 * @param  {Number} version QR Code version
 * @return {Array}          Array of segments
 */
exports.fromString = function fromString (data, version) {
  const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled())

  const nodes = buildNodes(segs)
  const graph = buildGraph(nodes, version)
  const path = dijkstra.find_path(graph.map, 'start', 'end')

  const optimizedSegs = []
  for (let i = 1; i < path.length - 1; i++) {
    optimizedSegs.push(graph.table[path[i]].node)
  }

  return exports.fromArray(mergeSegments(optimizedSegs))
}

/**
 * Splits a string in various segments with the modes which
 * best represent their content.
 * The produced segments are far from being optimized.
 * The output of this function is only used to estimate a QR Code version
 * which may contain the data.
 *
 * @param  {string} data Input string
 * @return {Array}       Array of segments
 */
exports.rawSplit = function rawSplit (data) {
  return exports.fromArray(
    getSegmentsFromString(data, Utils.isKanjiModeEnabled())
  )
}


/***/ }),

/***/ "./node_modules/qrcode/lib/core/utils.js":
/*!***********************************************!*\
  !*** ./node_modules/qrcode/lib/core/utils.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {

let toSJISFunction
const CODEWORDS_COUNT = [
  0, // Not used
  26, 44, 70, 100, 134, 172, 196, 242, 292, 346,
  404, 466, 532, 581, 655, 733, 815, 901, 991, 1085,
  1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185,
  2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706
]

/**
 * Returns the QR Code size for the specified version
 *
 * @param  {Number} version QR Code version
 * @return {Number}         size of QR code
 */
exports.getSymbolSize = function getSymbolSize (version) {
  if (!version) throw new Error('"version" cannot be null or undefined')
  if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40')
  return version * 4 + 17
}

/**
 * Returns the total number of codewords used to store data and EC information.
 *
 * @param  {Number} version QR Code version
 * @return {Number}         Data length in bits
 */
exports.getSymbolTotalCodewords = function getSymbolTotalCodewords (version) {
  return CODEWORDS_COUNT[version]
}

/**
 * Encode data with Bose-Chaudhuri-Hocquenghem
 *
 * @param  {Number} data Value to encode
 * @return {Number}      Encoded value
 */
exports.getBCHDigit = function (data) {
  let digit = 0

  while (data !== 0) {
    digit++
    data >>>= 1
  }

  return digit
}

exports.setToSJISFunction = function setToSJISFunction (f) {
  if (typeof f !== 'function') {
    throw new Error('"toSJISFunc" is not a valid function.')
  }

  toSJISFunction = f
}

exports.isKanjiModeEnabled = function () {
  return typeof toSJISFunction !== 'undefined'
}

exports.toSJIS = function toSJIS (kanji) {
  return toSJISFunction(kanji)
}


/***/ }),

/***/ "./node_modules/qrcode/lib/core/version-check.js":
/*!*******************************************************!*\
  !*** ./node_modules/qrcode/lib/core/version-check.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {

/**
 * Check if QR Code version is valid
 *
 * @param  {Number}  version QR Code version
 * @return {Boolean}         true if valid version, false otherwise
 */
exports.isValid = function isValid (version) {
  return !isNaN(version) && version >= 1 && version <= 40
}


/***/ }),

/***/ "./node_modules/qrcode/lib/core/version.js":
/*!*************************************************!*\
  !*** ./node_modules/qrcode/lib/core/version.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const Utils = __webpack_require__(/*! ./utils */ "./node_modules/qrcode/lib/core/utils.js")
const ECCode = __webpack_require__(/*! ./error-correction-code */ "./node_modules/qrcode/lib/core/error-correction-code.js")
const ECLevel = __webpack_require__(/*! ./error-correction-level */ "./node_modules/qrcode/lib/core/error-correction-level.js")
const Mode = __webpack_require__(/*! ./mode */ "./node_modules/qrcode/lib/core/mode.js")
const VersionCheck = __webpack_require__(/*! ./version-check */ "./node_modules/qrcode/lib/core/version-check.js")

// Generator polynomial used to encode version information
const G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0)
const G18_BCH = Utils.getBCHDigit(G18)

function getBestVersionForDataLength (mode, length, errorCorrectionLevel) {
  for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
    if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
      return currentVersion
    }
  }

  return undefined
}

function getReservedBitsCount (mode, version) {
  // Character count indicator + mode indicator bits
  return Mode.getCharCountIndicator(mode, version) + 4
}

function getTotalBitsFromDataArray (segments, version) {
  let totalBits = 0

  segments.forEach(function (data) {
    const reservedBits = getReservedBitsCount(data.mode, version)
    totalBits += reservedBits + data.getBitsLength()
  })

  return totalBits
}

function getBestVersionForMixedData (segments, errorCorrectionLevel) {
  for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
    const length = getTotalBitsFromDataArray(segments, currentVersion)
    if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
      return currentVersion
    }
  }

  return undefined
}

/**
 * Returns version number from a value.
 * If value is not a valid version, returns defaultValue
 *
 * @param  {Number|String} value        QR Code version
 * @param  {Number}        defaultValue Fallback value
 * @return {Number}                     QR Code version number
 */
exports.from = function from (value, defaultValue) {
  if (VersionCheck.isValid(value)) {
    return parseInt(value, 10)
  }

  return defaultValue
}

/**
 * Returns how much data can be stored with the specified QR code version
 * and error correction level
 *
 * @param  {Number} version              QR Code version (1-40)
 * @param  {Number} errorCorrectionLevel Error correction level
 * @param  {Mode}   mode                 Data mode
 * @return {Number}                      Quantity of storable data
 */
exports.getCapacity = function getCapacity (version, errorCorrectionLevel, mode) {
  if (!VersionCheck.isValid(version)) {
    throw new Error('Invalid QR Code version')
  }

  // Use Byte mode as default
  if (typeof mode === 'undefined') mode = Mode.BYTE

  // Total codewords for this QR code version (Data + Error correction)
  const totalCodewords = Utils.getSymbolTotalCodewords(version)

  // Total number of error correction codewords
  const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel)

  // Total number of data codewords
  const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8

  if (mode === Mode.MIXED) return dataTotalCodewordsBits

  const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version)

  // Return max number of storable codewords
  switch (mode) {
    case Mode.NUMERIC:
      return Math.floor((usableBits / 10) * 3)

    case Mode.ALPHANUMERIC:
      return Math.floor((usableBits / 11) * 2)

    case Mode.KANJI:
      return Math.floor(usableBits / 13)

    case Mode.BYTE:
    default:
      return Math.floor(usableBits / 8)
  }
}

/**
 * Returns the minimum version needed to contain the amount of data
 *
 * @param  {Segment} data                    Segment of data
 * @param  {Number} [errorCorrectionLevel=H] Error correction level
 * @param  {Mode} mode                       Data mode
 * @return {Number}                          QR Code version
 */
exports.getBestVersionForData = function getBestVersionForData (data, errorCorrectionLevel) {
  let seg

  const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M)

  if (Array.isArray(data)) {
    if (data.length > 1) {
      return getBestVersionForMixedData(data, ecl)
    }

    if (data.length === 0) {
      return 1
    }

    seg = data[0]
  } else {
    seg = data
  }

  return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl)
}

/**
 * Returns version information with relative error correction bits
 *
 * The version information is included in QR Code symbols of version 7 or larger.
 * It consists of an 18-bit sequence containing 6 data bits,
 * with 12 error correction bits calculated using the (18, 6) Golay code.
 *
 * @param  {Number} version QR Code version
 * @return {Number}         Encoded version info bits
 */
exports.getEncodedBits = function getEncodedBits (version) {
  if (!VersionCheck.isValid(version) || version < 7) {
    throw new Error('Invalid QR Code version')
  }

  let d = version << 12

  while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
    d ^= (G18 << (Utils.getBCHDigit(d) - G18_BCH))
  }

  return (version << 12) | d
}


/***/ }),

/***/ "./node_modules/qrcode/lib/index.js":
/*!******************************************!*\
  !*** ./node_modules/qrcode/lib/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
*copyright Ryan Day 2012
*
* Licensed under the MIT license:
*   http://www.opensource.org/licenses/mit-license.php
*
* this is the main server side application file for node-qrcode.
* these exports use serverside canvas api methods for file IO and buffers
*
*/

module.exports = __webpack_require__(/*! ./server */ "./node_modules/qrcode/lib/server.js")


/***/ }),

/***/ "./node_modules/qrcode/lib/renderer/canvas.js":
/*!****************************************************!*\
  !*** ./node_modules/qrcode/lib/renderer/canvas.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const Utils = __webpack_require__(/*! ./utils */ "./node_modules/qrcode/lib/renderer/utils.js")

function clearCanvas (ctx, canvas, size) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (!canvas.style) canvas.style = {}
  canvas.height = size
  canvas.width = size
  canvas.style.height = size + 'px'
  canvas.style.width = size + 'px'
}

function getCanvasElement () {
  try {
    return document.createElement('canvas')
  } catch (e) {
    throw new Error('You need to specify a canvas element')
  }
}

exports.render = function render (qrData, canvas, options) {
  let opts = options
  let canvasEl = canvas

  if (typeof opts === 'undefined' && (!canvas || !canvas.getContext)) {
    opts = canvas
    canvas = undefined
  }

  if (!canvas) {
    canvasEl = getCanvasElement()
  }

  opts = Utils.getOptions(opts)
  const size = Utils.getImageWidth(qrData.modules.size, opts)

  const ctx = canvasEl.getContext('2d')
  const image = ctx.createImageData(size, size)
  Utils.qrToImageData(image.data, qrData, opts)

  clearCanvas(ctx, canvasEl, size)
  ctx.putImageData(image, 0, 0)

  return canvasEl
}

exports.renderToDataURL = function renderToDataURL (qrData, canvas, options) {
  let opts = options

  if (typeof opts === 'undefined' && (!canvas || !canvas.getContext)) {
    opts = canvas
    canvas = undefined
  }

  if (!opts) opts = {}

  const canvasEl = exports.render(qrData, canvas, opts)

  const type = opts.type || 'image/png'
  const rendererOpts = opts.rendererOpts || {}

  return canvasEl.toDataURL(type, rendererOpts.quality)
}


/***/ }),

/***/ "./node_modules/qrcode/lib/renderer/png.js":
/*!*************************************************!*\
  !*** ./node_modules/qrcode/lib/renderer/png.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const fs = __webpack_require__(/*! fs */ "fs")
const PNG = (__webpack_require__(/*! pngjs */ "./node_modules/pngjs/lib/png.js").PNG)
const Utils = __webpack_require__(/*! ./utils */ "./node_modules/qrcode/lib/renderer/utils.js")

exports.render = function render (qrData, options) {
  const opts = Utils.getOptions(options)
  const pngOpts = opts.rendererOpts
  const size = Utils.getImageWidth(qrData.modules.size, opts)

  pngOpts.width = size
  pngOpts.height = size

  const pngImage = new PNG(pngOpts)
  Utils.qrToImageData(pngImage.data, qrData, opts)

  return pngImage
}

exports.renderToDataURL = function renderToDataURL (qrData, options, cb) {
  if (typeof cb === 'undefined') {
    cb = options
    options = undefined
  }

  exports.renderToBuffer(qrData, options, function (err, output) {
    if (err) cb(err)
    let url = 'data:image/png;base64,'
    url += output.toString('base64')
    cb(null, url)
  })
}

exports.renderToBuffer = function renderToBuffer (qrData, options, cb) {
  if (typeof cb === 'undefined') {
    cb = options
    options = undefined
  }

  const png = exports.render(qrData, options)
  const buffer = []

  png.on('error', cb)

  png.on('data', function (data) {
    buffer.push(data)
  })

  png.on('end', function () {
    cb(null, Buffer.concat(buffer))
  })

  png.pack()
}

exports.renderToFile = function renderToFile (path, qrData, options, cb) {
  if (typeof cb === 'undefined') {
    cb = options
    options = undefined
  }

  let called = false
  const done = (...args) => {
    if (called) return
    called = true
    cb.apply(null, args)
  }
  const stream = fs.createWriteStream(path)

  stream.on('error', done)
  stream.on('close', done)

  exports.renderToFileStream(stream, qrData, options)
}

exports.renderToFileStream = function renderToFileStream (stream, qrData, options) {
  const png = exports.render(qrData, options)
  png.pack().pipe(stream)
}


/***/ }),

/***/ "./node_modules/qrcode/lib/renderer/svg-tag.js":
/*!*****************************************************!*\
  !*** ./node_modules/qrcode/lib/renderer/svg-tag.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const Utils = __webpack_require__(/*! ./utils */ "./node_modules/qrcode/lib/renderer/utils.js")

function getColorAttrib (color, attrib) {
  const alpha = color.a / 255
  const str = attrib + '="' + color.hex + '"'

  return alpha < 1
    ? str + ' ' + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"'
    : str
}

function svgCmd (cmd, x, y) {
  let str = cmd + x
  if (typeof y !== 'undefined') str += ' ' + y

  return str
}

function qrToPath (data, size, margin) {
  let path = ''
  let moveBy = 0
  let newRow = false
  let lineLength = 0

  for (let i = 0; i < data.length; i++) {
    const col = Math.floor(i % size)
    const row = Math.floor(i / size)

    if (!col && !newRow) newRow = true

    if (data[i]) {
      lineLength++

      if (!(i > 0 && col > 0 && data[i - 1])) {
        path += newRow
          ? svgCmd('M', col + margin, 0.5 + row + margin)
          : svgCmd('m', moveBy, 0)

        moveBy = 0
        newRow = false
      }

      if (!(col + 1 < size && data[i + 1])) {
        path += svgCmd('h', lineLength)
        lineLength = 0
      }
    } else {
      moveBy++
    }
  }

  return path
}

exports.render = function render (qrData, options, cb) {
  const opts = Utils.getOptions(options)
  const size = qrData.modules.size
  const data = qrData.modules.data
  const qrcodesize = size + opts.margin * 2

  const bg = !opts.color.light.a
    ? ''
    : '<path ' + getColorAttrib(opts.color.light, 'fill') +
      ' d="M0 0h' + qrcodesize + 'v' + qrcodesize + 'H0z"/>'

  const path =
    '<path ' + getColorAttrib(opts.color.dark, 'stroke') +
    ' d="' + qrToPath(data, size, opts.margin) + '"/>'

  const viewBox = 'viewBox="' + '0 0 ' + qrcodesize + ' ' + qrcodesize + '"'

  const width = !opts.width ? '' : 'width="' + opts.width + '" height="' + opts.width + '" '

  const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + '</svg>\n'

  if (typeof cb === 'function') {
    cb(null, svgTag)
  }

  return svgTag
}


/***/ }),

/***/ "./node_modules/qrcode/lib/renderer/svg.js":
/*!*************************************************!*\
  !*** ./node_modules/qrcode/lib/renderer/svg.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const svgTagRenderer = __webpack_require__(/*! ./svg-tag */ "./node_modules/qrcode/lib/renderer/svg-tag.js")

exports.render = svgTagRenderer.render

exports.renderToFile = function renderToFile (path, qrData, options, cb) {
  if (typeof cb === 'undefined') {
    cb = options
    options = undefined
  }

  const fs = __webpack_require__(/*! fs */ "fs")
  const svgTag = exports.render(qrData, options)

  const xmlStr = '<?xml version="1.0" encoding="utf-8"?>' +
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' +
    svgTag

  fs.writeFile(path, xmlStr, cb)
}


/***/ }),

/***/ "./node_modules/qrcode/lib/renderer/terminal.js":
/*!******************************************************!*\
  !*** ./node_modules/qrcode/lib/renderer/terminal.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const big = __webpack_require__(/*! ./terminal/terminal */ "./node_modules/qrcode/lib/renderer/terminal/terminal.js")
const small = __webpack_require__(/*! ./terminal/terminal-small */ "./node_modules/qrcode/lib/renderer/terminal/terminal-small.js")

exports.render = function (qrData, options, cb) {
  if (options && options.small) {
    return small.render(qrData, options, cb)
  }
  return big.render(qrData, options, cb)
}


/***/ }),

/***/ "./node_modules/qrcode/lib/renderer/terminal/terminal-small.js":
/*!*********************************************************************!*\
  !*** ./node_modules/qrcode/lib/renderer/terminal/terminal-small.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

const backgroundWhite = '\x1b[47m'
const backgroundBlack = '\x1b[40m'
const foregroundWhite = '\x1b[37m'
const foregroundBlack = '\x1b[30m'
const reset = '\x1b[0m'
const lineSetupNormal = backgroundWhite + foregroundBlack // setup colors
const lineSetupInverse = backgroundBlack + foregroundWhite // setup colors

const createPalette = function (lineSetup, foregroundWhite, foregroundBlack) {
  return {
    // 1 ... white, 2 ... black, 0 ... transparent (default)

    '00': reset + ' ' + lineSetup,
    '01': reset + foregroundWhite + '▄' + lineSetup,
    '02': reset + foregroundBlack + '▄' + lineSetup,
    10: reset + foregroundWhite + '▀' + lineSetup,
    11: ' ',
    12: '▄',
    20: reset + foregroundBlack + '▀' + lineSetup,
    21: '▀',
    22: '█'
  }
}

/**
 * Returns code for QR pixel
 * @param {boolean[][]} modules
 * @param {number} size
 * @param {number} x
 * @param {number} y
 * @return {'0' | '1' | '2'}
 */
const mkCodePixel = function (modules, size, x, y) {
  const sizePlus = size + 1
  if ((x >= sizePlus) || (y >= sizePlus) || (y < -1) || (x < -1)) return '0'
  if ((x >= size) || (y >= size) || (y < 0) || (x < 0)) return '1'
  const idx = (y * size) + x
  return modules[idx] ? '2' : '1'
}

/**
 * Returns code for four QR pixels. Suitable as key in palette.
 * @param {boolean[][]} modules
 * @param {number} size
 * @param {number} x
 * @param {number} y
 * @return {keyof palette}
 */
const mkCode = function (modules, size, x, y) {
  return (
    mkCodePixel(modules, size, x, y) +
    mkCodePixel(modules, size, x, y + 1)
  )
}

exports.render = function (qrData, options, cb) {
  const size = qrData.modules.size
  const data = qrData.modules.data

  const inverse = !!(options && options.inverse)
  const lineSetup = options && options.inverse ? lineSetupInverse : lineSetupNormal
  const white = inverse ? foregroundBlack : foregroundWhite
  const black = inverse ? foregroundWhite : foregroundBlack

  const palette = createPalette(lineSetup, white, black)
  const newLine = reset + '\n' + lineSetup

  let output = lineSetup // setup colors

  for (let y = -1; y < size + 1; y += 2) {
    for (let x = -1; x < size; x++) {
      output += palette[mkCode(data, size, x, y)]
    }

    output += palette[mkCode(data, size, size, y)] + newLine
  }

  output += reset

  if (typeof cb === 'function') {
    cb(null, output)
  }

  return output
}


/***/ }),

/***/ "./node_modules/qrcode/lib/renderer/terminal/terminal.js":
/*!***************************************************************!*\
  !*** ./node_modules/qrcode/lib/renderer/terminal/terminal.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {

// let Utils = require('./utils')

exports.render = function (qrData, options, cb) {
  const size = qrData.modules.size
  const data = qrData.modules.data

  // let opts = Utils.getOptions(options)

  // use same scheme as https://github.com/gtanner/qrcode-terminal because it actually works! =)
  const black = '\x1b[40m  \x1b[0m'
  const white = '\x1b[47m  \x1b[0m'

  let output = ''
  const hMargin = Array(size + 3).join(white)
  const vMargin = Array(2).join(white)

  output += hMargin + '\n'
  for (let i = 0; i < size; ++i) {
    output += white
    for (let j = 0; j < size; j++) {
      // let topModule = data[i * size + j]
      // let bottomModule = data[(i + 1) * size + j]

      output += data[i * size + j] ? black : white// getBlockChar(topModule, bottomModule)
    }
    // output += white+'\n'
    output += vMargin + '\n'
  }

  output += hMargin + '\n'

  if (typeof cb === 'function') {
    cb(null, output)
  }

  return output
}
/*
exports.renderToFile = function renderToFile (path, qrData, options, cb) {
  if (typeof cb === 'undefined') {
    cb = options
    options = undefined
  }

  let fs = require('fs')
  let utf8 = exports.render(qrData, options)
  fs.writeFile(path, utf8, cb)
}
*/


/***/ }),

/***/ "./node_modules/qrcode/lib/renderer/utf8.js":
/*!**************************************************!*\
  !*** ./node_modules/qrcode/lib/renderer/utf8.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const Utils = __webpack_require__(/*! ./utils */ "./node_modules/qrcode/lib/renderer/utils.js")

const BLOCK_CHAR = {
  WW: ' ',
  WB: '▄',
  BB: '█',
  BW: '▀'
}

const INVERTED_BLOCK_CHAR = {
  BB: ' ',
  BW: '▄',
  WW: '█',
  WB: '▀'
}

function getBlockChar (top, bottom, blocks) {
  if (top && bottom) return blocks.BB
  if (top && !bottom) return blocks.BW
  if (!top && bottom) return blocks.WB
  return blocks.WW
}

exports.render = function (qrData, options, cb) {
  const opts = Utils.getOptions(options)
  let blocks = BLOCK_CHAR
  if (opts.color.dark.hex === '#ffffff' || opts.color.light.hex === '#000000') {
    blocks = INVERTED_BLOCK_CHAR
  }

  const size = qrData.modules.size
  const data = qrData.modules.data

  let output = ''
  let hMargin = Array(size + (opts.margin * 2) + 1).join(blocks.WW)
  hMargin = Array((opts.margin / 2) + 1).join(hMargin + '\n')

  const vMargin = Array(opts.margin + 1).join(blocks.WW)

  output += hMargin
  for (let i = 0; i < size; i += 2) {
    output += vMargin
    for (let j = 0; j < size; j++) {
      const topModule = data[i * size + j]
      const bottomModule = data[(i + 1) * size + j]

      output += getBlockChar(topModule, bottomModule, blocks)
    }

    output += vMargin + '\n'
  }

  output += hMargin.slice(0, -1)

  if (typeof cb === 'function') {
    cb(null, output)
  }

  return output
}

exports.renderToFile = function renderToFile (path, qrData, options, cb) {
  if (typeof cb === 'undefined') {
    cb = options
    options = undefined
  }

  const fs = __webpack_require__(/*! fs */ "fs")
  const utf8 = exports.render(qrData, options)
  fs.writeFile(path, utf8, cb)
}


/***/ }),

/***/ "./node_modules/qrcode/lib/renderer/utils.js":
/*!***************************************************!*\
  !*** ./node_modules/qrcode/lib/renderer/utils.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {

function hex2rgba (hex) {
  if (typeof hex === 'number') {
    hex = hex.toString()
  }

  if (typeof hex !== 'string') {
    throw new Error('Color should be defined as hex string')
  }

  let hexCode = hex.slice().replace('#', '').split('')
  if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
    throw new Error('Invalid hex color: ' + hex)
  }

  // Convert from short to long form (fff -> ffffff)
  if (hexCode.length === 3 || hexCode.length === 4) {
    hexCode = Array.prototype.concat.apply([], hexCode.map(function (c) {
      return [c, c]
    }))
  }

  // Add default alpha value
  if (hexCode.length === 6) hexCode.push('F', 'F')

  const hexValue = parseInt(hexCode.join(''), 16)

  return {
    r: (hexValue >> 24) & 255,
    g: (hexValue >> 16) & 255,
    b: (hexValue >> 8) & 255,
    a: hexValue & 255,
    hex: '#' + hexCode.slice(0, 6).join('')
  }
}

exports.getOptions = function getOptions (options) {
  if (!options) options = {}
  if (!options.color) options.color = {}

  const margin = typeof options.margin === 'undefined' ||
    options.margin === null ||
    options.margin < 0
    ? 4
    : options.margin

  const width = options.width && options.width >= 21 ? options.width : undefined
  const scale = options.scale || 4

  return {
    width: width,
    scale: width ? 4 : scale,
    margin: margin,
    color: {
      dark: hex2rgba(options.color.dark || '#000000ff'),
      light: hex2rgba(options.color.light || '#ffffffff')
    },
    type: options.type,
    rendererOpts: options.rendererOpts || {}
  }
}

exports.getScale = function getScale (qrSize, opts) {
  return opts.width && opts.width >= qrSize + opts.margin * 2
    ? opts.width / (qrSize + opts.margin * 2)
    : opts.scale
}

exports.getImageWidth = function getImageWidth (qrSize, opts) {
  const scale = exports.getScale(qrSize, opts)
  return Math.floor((qrSize + opts.margin * 2) * scale)
}

exports.qrToImageData = function qrToImageData (imgData, qr, opts) {
  const size = qr.modules.size
  const data = qr.modules.data
  const scale = exports.getScale(size, opts)
  const symbolSize = Math.floor((size + opts.margin * 2) * scale)
  const scaledMargin = opts.margin * scale
  const palette = [opts.color.light, opts.color.dark]

  for (let i = 0; i < symbolSize; i++) {
    for (let j = 0; j < symbolSize; j++) {
      let posDst = (i * symbolSize + j) * 4
      let pxColor = opts.color.light

      if (i >= scaledMargin && j >= scaledMargin &&
        i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
        const iSrc = Math.floor((i - scaledMargin) / scale)
        const jSrc = Math.floor((j - scaledMargin) / scale)
        pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0]
      }

      imgData[posDst++] = pxColor.r
      imgData[posDst++] = pxColor.g
      imgData[posDst++] = pxColor.b
      imgData[posDst] = pxColor.a
    }
  }
}


/***/ }),

/***/ "./node_modules/qrcode/lib/server.js":
/*!*******************************************!*\
  !*** ./node_modules/qrcode/lib/server.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const canPromise = __webpack_require__(/*! ./can-promise */ "./node_modules/qrcode/lib/can-promise.js")
const QRCode = __webpack_require__(/*! ./core/qrcode */ "./node_modules/qrcode/lib/core/qrcode.js")
const PngRenderer = __webpack_require__(/*! ./renderer/png */ "./node_modules/qrcode/lib/renderer/png.js")
const Utf8Renderer = __webpack_require__(/*! ./renderer/utf8 */ "./node_modules/qrcode/lib/renderer/utf8.js")
const TerminalRenderer = __webpack_require__(/*! ./renderer/terminal */ "./node_modules/qrcode/lib/renderer/terminal.js")
const SvgRenderer = __webpack_require__(/*! ./renderer/svg */ "./node_modules/qrcode/lib/renderer/svg.js")

function checkParams (text, opts, cb) {
  if (typeof text === 'undefined') {
    throw new Error('String required as first argument')
  }

  if (typeof cb === 'undefined') {
    cb = opts
    opts = {}
  }

  if (typeof cb !== 'function') {
    if (!canPromise()) {
      throw new Error('Callback required as last argument')
    } else {
      opts = cb || {}
      cb = null
    }
  }

  return {
    opts: opts,
    cb: cb
  }
}

function getTypeFromFilename (path) {
  return path.slice((path.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase()
}

function getRendererFromType (type) {
  switch (type) {
    case 'svg':
      return SvgRenderer

    case 'txt':
    case 'utf8':
      return Utf8Renderer

    case 'png':
    case 'image/png':
    default:
      return PngRenderer
  }
}

function getStringRendererFromType (type) {
  switch (type) {
    case 'svg':
      return SvgRenderer

    case 'terminal':
      return TerminalRenderer

    case 'utf8':
    default:
      return Utf8Renderer
  }
}

function render (renderFunc, text, params) {
  if (!params.cb) {
    return new Promise(function (resolve, reject) {
      try {
        const data = QRCode.create(text, params.opts)
        return renderFunc(data, params.opts, function (err, data) {
          return err ? reject(err) : resolve(data)
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  try {
    const data = QRCode.create(text, params.opts)
    return renderFunc(data, params.opts, params.cb)
  } catch (e) {
    params.cb(e)
  }
}

exports.create = QRCode.create

exports.toCanvas = __webpack_require__(/*! ./browser */ "./node_modules/qrcode/lib/browser.js").toCanvas

exports.toString = function toString (text, opts, cb) {
  const params = checkParams(text, opts, cb)
  const type = params.opts ? params.opts.type : undefined
  const renderer = getStringRendererFromType(type)
  return render(renderer.render, text, params)
}

exports.toDataURL = function toDataURL (text, opts, cb) {
  const params = checkParams(text, opts, cb)
  const renderer = getRendererFromType(params.opts.type)
  return render(renderer.renderToDataURL, text, params)
}

exports.toBuffer = function toBuffer (text, opts, cb) {
  const params = checkParams(text, opts, cb)
  const renderer = getRendererFromType(params.opts.type)
  return render(renderer.renderToBuffer, text, params)
}

exports.toFile = function toFile (path, text, opts, cb) {
  if (typeof path !== 'string' || !(typeof text === 'string' || typeof text === 'object')) {
    throw new Error('Invalid argument')
  }

  if ((arguments.length < 3) && !canPromise()) {
    throw new Error('Too few arguments provided')
  }

  const params = checkParams(text, opts, cb)
  const type = params.opts.type || getTypeFromFilename(path)
  const renderer = getRendererFromType(type)
  const renderToFile = renderer.renderToFile.bind(null, path)

  return render(renderToFile, text, params)
}

exports.toFileStream = function toFileStream (stream, text, opts) {
  if (arguments.length < 2) {
    throw new Error('Too few arguments provided')
  }

  const params = checkParams(text, opts, stream.emit.bind(stream, 'error'))
  const renderer = getRendererFromType('png') // Only png support for now
  const renderToFileStream = renderer.renderToFileStream.bind(null, stream)
  render(renderToFileStream, text, params)
}


/***/ }),

/***/ "./node_modules/speakeasy/index.js":
/*!*****************************************!*\
  !*** ./node_modules/speakeasy/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var base32 = __webpack_require__(/*! base32.js */ "./node_modules/base32.js/index.js");
var crypto = __webpack_require__(/*! crypto */ "crypto");
var url = __webpack_require__(/*! url */ "url");
var util = __webpack_require__(/*! util */ "util");

/**
 * Digest the one-time passcode options.
 *
 * @param {Object} options
 * @param {String} options.secret Shared secret key
 * @param {Integer} options.counter Counter value
 * @param {String} [options.encoding="ascii"] Key encoding (ascii, hex,
 *   base32, base64).
 * @param {String} [options.algorithm="sha1"] Hash algorithm (sha1, sha256,
 *   sha512).
 * @param {String} [options.key] (DEPRECATED. Use `secret` instead.)
 *   Shared secret key
 * @return {Buffer} The one-time passcode as a buffer.
 */

exports.digest = function digest (options) {
  var i;

  // unpack options
  var secret = options.secret;
  var counter = options.counter;
  var encoding = options.encoding || 'ascii';
  var algorithm = (options.algorithm || 'sha1').toLowerCase();

  // Backwards compatibility - deprecated
  if (options.key != null) {
    console.warn('Speakeasy - Deprecation Notice - Specifying the secret using `key` is no longer supported. Use `secret` instead.');
    secret = options.key;
  }

  // convert secret to buffer
  if (!Buffer.isBuffer(secret)) {
    secret = encoding === 'base32' ? base32.decode(secret)
      : new Buffer(secret, encoding);
  }

  // create an buffer from the counter
  var buf = new Buffer(8);
  var tmp = counter;
  for (i = 0; i < 8; i++) {
    // mask 0xff over number to get last 8
    buf[7 - i] = tmp & 0xff;

    // shift 8 and get ready to loop over the next batch of 8
    tmp = tmp >> 8;
  }

  // init hmac with the key
  var hmac = crypto.createHmac(algorithm, secret);

  // update hmac with the counter
  hmac.update(buf);

  // return the digest
  return hmac.digest();
};

/**
 * Generate a counter-based one-time token. Specify the key and counter, and
 * receive the one-time password for that counter position as a string. You can
 * also specify a token length, as well as the encoding (ASCII, hexadecimal, or
 * base32) and the hashing algorithm to use (SHA1, SHA256, SHA512).
 *
 * @param {Object} options
 * @param {String} options.secret Shared secret key
 * @param {Integer} options.counter Counter value
 * @param {Buffer} [options.digest] Digest, automatically generated by default
 * @param {Integer} [options.digits=6] The number of digits for the one-time
 *   passcode.
 * @param {String} [options.encoding="ascii"] Key encoding (ascii, hex,
 *   base32, base64).
 * @param {String} [options.algorithm="sha1"] Hash algorithm (sha1, sha256,
 *   sha512).
 * @param {String} [options.key] (DEPRECATED. Use `secret` instead.)
 *   Shared secret key
 * @param {Integer} [options.length=6] (DEPRECATED. Use `digits` instead.) The
 *   number of digits for the one-time passcode.
 * @return {String} The one-time passcode.
 */

exports.hotp = function hotpGenerate (options) {
  // unpack digits
  // backward compatibility: `length` is also accepted here, but deprecated
  var digits = (options.digits != null ? options.digits : options.length) || 6;
  if (options.length != null) console.warn('Speakeasy - Deprecation Notice - Specifying token digits using `length` is no longer supported. Use `digits` instead.');

  // digest the options
  var digest = options.digest || exports.digest(options);

  // compute HOTP offset
  var offset = digest[digest.length - 1] & 0xf;

  // calculate binary code (RFC4226 5.4)
  var code = (digest[offset] & 0x7f) << 24 |
    (digest[offset + 1] & 0xff) << 16 |
    (digest[offset + 2] & 0xff) << 8 |
    (digest[offset + 3] & 0xff);

  // left-pad code
  code = new Array(digits + 1).join('0') + code.toString(10);

  // return length number off digits
  return code.substr(-digits);
};

// Alias counter() for hotp()
exports.counter = exports.hotp;

/**
 * Verify a counter-based one-time token against the secret and return the delta.
 * By default, it verifies the token at the given counter value, with no leeway
 * (no look-ahead or look-behind). A token validated at the current counter value
 * will have a delta of 0.
 *
 * You can specify a window to add more leeway to the verification process.
 * Setting the window param will check for the token at the given counter value
 * as well as `window` tokens ahead (one-sided window). See param for more info.
 *
 * `verifyDelta()` will return the delta between the counter value of the token
 * and the given counter value. For example, if given a counter 5 and a window
 * 10, `verifyDelta()` will look at tokens from 5 to 15, inclusive. If it finds
 * it at counter position 7, it will return `{ delta: 2 }`.
 *
 * @param {Object} options
 * @param {String} options.secret Shared secret key
 * @param {String} options.token Passcode to validate
 * @param {Integer} options.counter Counter value. This should be stored by
 *   the application and must be incremented for each request.
 * @param {Integer} [options.digits=6] The number of digits for the one-time
 *   passcode.
 * @param {Integer} [options.window=0] The allowable margin for the counter.
 *   The function will check "W" codes in the future against the provided
 *   passcode, e.g. if W = 10, and C = 5, this function will check the
 *   passcode against all One Time Passcodes between 5 and 15, inclusive.
 * @param {String} [options.encoding="ascii"] Key encoding (ascii, hex,
 *   base32, base64).
 * @param {String} [options.algorithm="sha1"] Hash algorithm (sha1, sha256,
 *   sha512).
 * @return {Object} On success, returns an object with the counter
 *   difference between the client and the server as the `delta` property (i.e.
 *   `{ delta: 0 }`).
 * @method hotp․verifyDelta
 * @global
 */

exports.hotp.verifyDelta = function hotpVerifyDelta (options) {
  var i;

  // shadow options
  options = Object.create(options);

  // unpack options
  var token = String(options.token);
  var digits = parseInt(options.digits, 10) || 6;
  var window = parseInt(options.window, 10) || 0;
  var counter = parseInt(options.counter, 10) || 0;

  // fail if token is not of correct length
  if (token.length !== digits) {
    return;
  }

  // parse token to integer
  token = parseInt(token, 10);

  // fail if token is NA
  if (isNaN(token)) {
    return;
  }

  // loop from C to C + W inclusive
  for (i = counter; i <= counter + window; ++i) {
    options.counter = i;
    // domain-specific constant-time comparison for integer codes
    if (parseInt(exports.hotp(options), 10) === token) {
      // found a matching code, return delta
      return {delta: i - counter};
    }
  }

  // no codes have matched
};

/**
 * Verify a counter-based one-time token against the secret and return true if
 * it verifies. Helper function for `hotp.verifyDelta()`` that returns a boolean
 * instead of an object. For more on how to use a window with this, see
 * {@link hotp.verifyDelta}.
 *
 * @param {Object} options
 * @param {String} options.secret Shared secret key
 * @param {String} options.token Passcode to validate
 * @param {Integer} options.counter Counter value. This should be stored by
 *   the application and must be incremented for each request.
 * @param {Integer} [options.digits=6] The number of digits for the one-time
 *   passcode.
 * @param {Integer} [options.window=0] The allowable margin for the counter.
 *   The function will check "W" codes in the future against the provided
 *   passcode, e.g. if W = 10, and C = 5, this function will check the
 *   passcode against all One Time Passcodes between 5 and 15, inclusive.
 * @param {String} [options.encoding="ascii"] Key encoding (ascii, hex,
 *   base32, base64).
 * @param {String} [options.algorithm="sha1"] Hash algorithm (sha1, sha256,
 *   sha512).
 * @return {Boolean} Returns true if the token matches within the given
 *   window, false otherwise.
 * @method hotp․verify
 * @global
 */
exports.hotp.verify = function hotpVerify (options) {
  return exports.hotp.verifyDelta(options) != null;
};

/**
 * Calculate counter value based on given options. A counter value converts a
 * TOTP time into a counter value by finding the number of time steps that have
 * passed since the epoch to the current time.
 *
 * @param {Object} options
 * @param {Integer} [options.time] Time in seconds with which to calculate
 *   counter value. Defaults to `Date.now()`.
 * @param {Integer} [options.step=30] Time step in seconds
 * @param {Integer} [options.epoch=0] Initial time since the UNIX epoch from
 *   which to calculate the counter value. Defaults to 0 (no offset).
 * @param {Integer} [options.initial_time=0] (DEPRECATED. Use `epoch` instead.)
 *   Initial time in seconds since the UNIX epoch from which to calculate the
 *   counter value. Defaults to 0 (no offset).
 * @return {Integer} The calculated counter value.
 * @private
 */

exports._counter = function _counter (options) {
  var step = options.step || 30;
  var time = options.time != null ? (options.time * 1000) : Date.now();

  // also accepts 'initial_time', but deprecated
  var epoch = (options.epoch != null ? (options.epoch * 1000) : (options.initial_time * 1000)) || 0;
  if (options.initial_time != null) console.warn('Speakeasy - Deprecation Notice - Specifying the epoch using `initial_time` is no longer supported. Use `epoch` instead.');

  return Math.floor((time - epoch) / step / 1000);
};

/**
 * Generate a time-based one-time token. Specify the key, and receive the
 * one-time password for that time as a string. By default, it uses the current
 * time and a time step of 30 seconds, so there is a new token every 30 seconds.
 * You may override the time step and epoch for custom timing. You can also
 * specify a token length, as well as the encoding (ASCII, hexadecimal, or
 * base32) and the hashing algorithm to use (SHA1, SHA256, SHA512).
 *
 * Under the hood, TOTP calculates the counter value by finding how many time
 * steps have passed since the epoch, and calls HOTP with that counter value.
 *
 * @param {Object} options
 * @param {String} options.secret Shared secret key
 * @param {Integer} [options.time] Time in seconds with which to calculate
 *   counter value. Defaults to `Date.now()`.
 * @param {Integer} [options.step=30] Time step in seconds
 * @param {Integer} [options.epoch=0] Initial time in seconds since the UNIX
 *   epoch from which to calculate the counter value. Defaults to 0 (no offset).
 * @param {Integer} [options.counter] Counter value, calculated by default.
 * @param {Integer} [options.digits=6] The number of digits for the one-time
 *   passcode.
 * @param {String} [options.encoding="ascii"] Key encoding (ascii, hex,
 *   base32, base64).
 * @param {String} [options.algorithm="sha1"] Hash algorithm (sha1, sha256,
 *   sha512).
 * @param {String} [options.key] (DEPRECATED. Use `secret` instead.)
 *   Shared secret key
 * @param {Integer} [options.initial_time=0] (DEPRECATED. Use `epoch` instead.)
 *   Initial time in seconds since the UNIX epoch from which to calculate the
 *   counter value. Defaults to 0 (no offset).
 * @param {Integer} [options.length=6] (DEPRECATED. Use `digits` instead.) The
 *   number of digits for the one-time passcode.
 * @return {String} The one-time passcode.
 */

exports.totp = function totpGenerate (options) {
  // shadow options
  options = Object.create(options);

  // calculate default counter value
  if (options.counter == null) options.counter = exports._counter(options);

  // pass to hotp
  return this.hotp(options);
};

// Alias time() for totp()
exports.time = exports.totp;

/**
 * Verify a time-based one-time token against the secret and return the delta.
 * By default, it verifies the token at the current time window, with no leeway
 * (no look-ahead or look-behind). A token validated at the current time window
 * will have a delta of 0.
 *
 * You can specify a window to add more leeway to the verification process.
 * Setting the window param will check for the token at the given counter value
 * as well as `window` tokens ahead and `window` tokens behind (two-sided
 * window). See param for more info.
 *
 * `verifyDelta()` will return the delta between the counter value of the token
 * and the given counter value. For example, if given a time at counter 1000 and
 * a window of 5, `verifyDelta()` will look at tokens from 995 to 1005,
 * inclusive. In other words, if the time-step is 30 seconds, it will look at
 * tokens from 2.5 minutes ago to 2.5 minutes in the future, inclusive.
 * If it finds it at counter position 1002, it will return `{ delta: 2 }`.
 * If it finds it at counter position 997, it will return `{ delta: -3 }`.
 *
 * @param {Object} options
 * @param {String} options.secret Shared secret key
 * @param {String} options.token Passcode to validate
 * @param {Integer} [options.time] Time in seconds with which to calculate
 *   counter value. Defaults to `Date.now()`.
 * @param {Integer} [options.step=30] Time step in seconds
 * @param {Integer} [options.epoch=0] Initial time in seconds since the UNIX
 *   epoch from which to calculate the counter value. Defaults to 0 (no offset).
 * @param {Integer} [options.counter] Counter value, calculated by default.
 * @param {Integer} [options.digits=6] The number of digits for the one-time
 *   passcode.
 * @param {Integer} [options.window=0] The allowable margin for the counter.
 *   The function will check "W" codes in the future and the past against the
 *   provided passcode, e.g. if W = 5, and C = 1000, this function will check
 *   the passcode against all One Time Passcodes between 995 and 1005,
 *   inclusive.
 * @param {String} [options.encoding="ascii"] Key encoding (ascii, hex,
 *   base32, base64).
 * @param {String} [options.algorithm="sha1"] Hash algorithm (sha1, sha256,
 *   sha512).
 * @return {Object} On success, returns an object with the time step
 *   difference between the client and the server as the `delta` property (e.g.
 *   `{ delta: 0 }`).
 * @method totp․verifyDelta
 * @global
 */

exports.totp.verifyDelta = function totpVerifyDelta (options) {
  // shadow options
  options = Object.create(options);

  // unpack options
  var window = parseInt(options.window, 10) || 0;

  // calculate default counter value
  if (options.counter == null) options.counter = exports._counter(options);

  // adjust for two-sided window
  options.counter -= window;
  options.window += window;

  // pass to hotp.verifyDelta
  var delta = exports.hotp.verifyDelta(options);

  // adjust for two-sided window
  if (delta) {
    delta.delta -= window;
  }

  return delta;
};

/**
 * Verify a time-based one-time token against the secret and return true if it
 * verifies. Helper function for verifyDelta() that returns a boolean instead of
 * an object. For more on how to use a window with this, see
 * {@link totp.verifyDelta}.
 *
 * @param {Object} options
 * @param {String} options.secret Shared secret key
 * @param {String} options.token Passcode to validate
 * @param {Integer} [options.time] Time in seconds with which to calculate
 *   counter value. Defaults to `Date.now()`.
 * @param {Integer} [options.step=30] Time step in seconds
 * @param {Integer} [options.epoch=0] Initial time in seconds  since the UNIX
 *   epoch from which to calculate the counter value. Defaults to 0 (no offset).
 * @param {Integer} [options.counter] Counter value, calculated by default.
 * @param {Integer} [options.digits=6] The number of digits for the one-time
 *   passcode.
 * @param {Integer} [options.window=0] The allowable margin for the counter.
 *   The function will check "W" codes in the future and the past against the
 *   provided passcode, e.g. if W = 5, and C = 1000, this function will check
 *   the passcode against all One Time Passcodes between 995 and 1005,
 *   inclusive.
 * @param {String} [options.encoding="ascii"] Key encoding (ascii, hex,
 *   base32, base64).
 * @param {String} [options.algorithm="sha1"] Hash algorithm (sha1, sha256,
 *   sha512).
 * @return {Boolean} Returns true if the token matches within the given
 *   window, false otherwise.
 * @method totp․verify
 * @global
 */
exports.totp.verify = function totpVerify (options) {
  return exports.totp.verifyDelta(options) != null;
};

/**
 * @typedef GeneratedSecret
 * @type Object
 * @property {String} ascii ASCII representation of the secret
 * @property {String} hex Hex representation of the secret
 * @property {String} base32 Base32 representation of the secret
 * @property {String} qr_code_ascii URL for the QR code for the ASCII secret.
 * @property {String} qr_code_hex URL for the QR code for the hex secret.
 * @property {String} qr_code_base32 URL for the QR code for the base32 secret.
 * @property {String} google_auth_qr URL for the Google Authenticator otpauth
 *   URL's QR code.
 * @property {String} otpauth_url Google Authenticator-compatible otpauth URL.
 */

/**
 * Generates a random secret with the set A-Z a-z 0-9 and symbols, of any length
 * (default 32). Returns the secret key in ASCII, hexadecimal, and base32 format,
 * along with the URL used for the QR code for Google Authenticator (an otpauth
 * URL). Use a QR code library to generate a QR code based on the Google
 * Authenticator URL to obtain a QR code you can scan into the app.
 *
 * @param {Object} options
 * @param {Integer} [options.length=32] Length of the secret
 * @param {Boolean} [options.symbols=false] Whether to include symbols
 * @param {Boolean} [options.otpauth_url=true] Whether to output a Google
 *   Authenticator-compatible otpauth:// URL (only returns otpauth:// URL, no
 *   QR code)
 * @param {String} [options.name] The name to use with Google Authenticator.
 * @param {Boolean} [options.qr_codes=false] (DEPRECATED. Do not use to prevent
 *   leaking of secret to a third party. Use your own QR code implementation.)
 *   Output QR code URLs for the token.
 * @param {Boolean} [options.google_auth_qr=false] (DEPRECATED. Do not use to
 *   prevent leaking of secret to a third party. Use your own QR code
 *   implementation.) Output a Google Authenticator otpauth:// QR code URL.
 * @return {Object}
 * @return {GeneratedSecret} The generated secret key.
 */
exports.generateSecret = function generateSecret (options) {
  // options
  if (!options) options = {};
  var length = options.length || 32;
  var name = encodeURIComponent(options.name || 'SecretKey');
  var qr_codes = options.qr_codes || false;
  var google_auth_qr = options.google_auth_qr || false;
  var otpauth_url = options.otpauth_url != null ? options.otpauth_url : true;
  var symbols = true;

  // turn off symbols only when explicity told to
  if (options.symbols !== undefined && options.symbols === false) {
    symbols = false;
  }

  // generate an ascii key
  var key = this.generateSecretASCII(length, symbols);

  // return a SecretKey with ascii, hex, and base32
  var SecretKey = {};
  SecretKey.ascii = key;
  SecretKey.hex = Buffer(key, 'ascii').toString('hex');
  SecretKey.base32 = base32.encode(Buffer(key)).toString().replace(/=/g, '');

  // generate some qr codes if requested
  if (qr_codes) {
    console.warn('Speakeasy - Deprecation Notice - generateSecret() QR codes are deprecated and no longer supported. Please use your own QR code implementation.');
    SecretKey.qr_code_ascii = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(SecretKey.ascii);
    SecretKey.qr_code_hex = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(SecretKey.hex);
    SecretKey.qr_code_base32 = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(SecretKey.base32);
  }

  // add in the Google Authenticator-compatible otpauth URL
  if (otpauth_url) {
    SecretKey.otpauth_url = exports.otpauthURL({
      secret: SecretKey.ascii,
      label: name
    });
  }

  // generate a QR code for use in Google Authenticator if requested
  if (google_auth_qr) {
    console.warn('Speakeasy - Deprecation Notice - generateSecret() Google Auth QR code is deprecated and no longer supported. Please use your own QR code implementation.');
    SecretKey.google_auth_qr = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(exports.otpauthURL({ secret: SecretKey.base32, label: name }));
  }

  return SecretKey;
};

// Backwards compatibility - generate_key is deprecated
exports.generate_key = util.deprecate(function (options) {
  return exports.generateSecret(options);
}, 'Speakeasy - Deprecation Notice - `generate_key()` is depreciated, please use `generateSecret()` instead.');

/**
 * Generates a key of a certain length (default 32) from A-Z, a-z, 0-9, and
 * symbols (if requested).
 *
 * @param  {Integer} [length=32]  The length of the key.
 * @param  {Boolean} [symbols=false] Whether to include symbols in the key.
 * @return {String} The generated key.
 */
exports.generateSecretASCII = function generateSecretASCII (length, symbols) {
  var bytes = crypto.randomBytes(length || 32);
  var set = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  if (symbols) {
    set += '!@#$%^&*()<>?/[]{},.:;';
  }

  var output = '';
  for (var i = 0, l = bytes.length; i < l; i++) {
    output += set[Math.floor(bytes[i] / 255.0 * (set.length - 1))];
  }
  return output;
};

// Backwards compatibility - generate_key_ascii is deprecated
exports.generate_key_ascii = util.deprecate(function (length, symbols) {
  return exports.generateSecretASCII(length, symbols);
}, 'Speakeasy - Deprecation Notice - `generate_key_ascii()` is depreciated, please use `generateSecretASCII()` instead.');

/**
 * Generate a Google Authenticator-compatible otpauth:// URL for passing the
 * secret to a mobile device to install the secret.
 *
 * Authenticator considers TOTP codes valid for 30 seconds. Additionally,
 * the app presents 6 digits codes to the user. According to the
 * documentation, the period and number of digits are currently ignored by
 * the app.
 *
 * To generate a suitable QR Code, pass the generated URL to a QR Code
 * generator, such as the `qr-image` module.
 *
 * @param {Object} options
 * @param {String} options.secret Shared secret key
 * @param {String} options.label Used to identify the account with which
 *   the secret key is associated, e.g. the user's email address.
 * @param {String} [options.type="totp"] Either "hotp" or "totp".
 * @param {Integer} [options.counter] The initial counter value, required
 *   for HOTP.
 * @param {String} [options.issuer] The provider or service with which the
 *   secret key is associated.
 * @param {String} [options.algorithm="sha1"] Hash algorithm (sha1, sha256,
 *   sha512).
 * @param {Integer} [options.digits=6] The number of digits for the one-time
 *   passcode. Currently ignored by Google Authenticator.
 * @param {Integer} [options.period=30] The length of time for which a TOTP
 *   code will be valid, in seconds. Currently ignored by Google
 *   Authenticator.
 * @param {String} [options.encoding] Key encoding (ascii, hex, base32,
 *   base64). If the key is not encoded in Base-32, it will be reencoded.
 * @return {String} A URL suitable for use with the Google Authenticator.
 * @throws Error if secret or label is missing, or if hotp is used and a
    counter is missing, if the type is not one of `hotp` or `totp`, if the
    number of digits is non-numeric, or an invalid period is used. Warns if
    the number of digits is not either 6 or 8 (though 6 is the only one
    supported by Google Authenticator), and if the hashihng algorithm is
    not one of the supported SHA1, SHA256, or SHA512.
 * @see https://github.com/google/google-authenticator/wiki/Key-Uri-Format
 */

exports.otpauthURL = function otpauthURL (options) {
  // unpack options
  var secret = options.secret;
  var label = options.label;
  var issuer = options.issuer;
  var type = (options.type || 'totp').toLowerCase();
  var counter = options.counter;
  var algorithm = options.algorithm;
  var digits = options.digits;
  var period = options.period;
  var encoding = options.encoding || 'ascii';

  // validate type
  switch (type) {
    case 'totp':
    case 'hotp':
      break;
    default:
      throw new Error('Speakeasy - otpauthURL - Invalid type `' + type + '`; must be `hotp` or `totp`');
  }

  // validate required options
  if (!secret) throw new Error('Speakeasy - otpauthURL - Missing secret');
  if (!label) throw new Error('Speakeasy - otpauthURL - Missing label');

  // require counter for HOTP
  if (type === 'hotp' && (counter === null || typeof counter === 'undefined')) {
    throw new Error('Speakeasy - otpauthURL - Missing counter value for HOTP');
  }

  // convert secret to base32
  if (encoding !== 'base32') secret = new Buffer(secret, encoding);
  if (Buffer.isBuffer(secret)) secret = base32.encode(secret);

  // build query while validating
  var query = {secret: secret};
  if (issuer) query.issuer = issuer;

  // validate algorithm
  if (algorithm != null) {
    switch (algorithm.toUpperCase()) {
      case 'SHA1':
      case 'SHA256':
      case 'SHA512':
        break;
      default:
        console.warn('Speakeasy - otpauthURL - Warning - Algorithm generally should be SHA1, SHA256, or SHA512');
    }
    query.algorithm = algorithm.toUpperCase();
  }

  // validate digits
  if (digits != null) {
    if (isNaN(digits)) {
      throw new Error('Speakeasy - otpauthURL - Invalid digits `' + digits + '`');
    } else {
      switch (parseInt(digits, 10)) {
        case 6:
        case 8:
          break;
        default:
          console.warn('Speakeasy - otpauthURL - Warning - Digits generally should be either 6 or 8');
      }
    }
    query.digits = digits;
  }

  // validate period
  if (period != null) {
    period = parseInt(period, 10);
    if (~~period !== period) {
      throw new Error('Speakeasy - otpauthURL - Invalid period `' + period + '`');
    }
    query.period = period;
  }

  // return url
  return url.format({
    protocol: 'otpauth',
    slashes: true,
    hostname: type,
    pathname: label,
    query: query
  });
};


/***/ }),

/***/ "./src/agents/agents.controller.ts":
/*!*****************************************!*\
  !*** ./src/agents/agents.controller.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AgentsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const agents_service_1 = __webpack_require__(/*! ./agents.service */ "./src/agents/agents.service.ts");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class CreateAgentDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "cluster", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "status", void 0);
let AgentsController = class AgentsController {
    constructor(agentsService) {
        this.agentsService = agentsService;
    }
    async findAll() {
        return this.agentsService.findAll();
    }
    async getStats() {
        return this.agentsService.getStats();
    }
    async findOne(id) {
        return this.agentsService.findById(id);
    }
    async create(dto) {
        return this.agentsService.create(dto);
    }
    async update(id, dto) {
        return this.agentsService.update(id, dto);
    }
    async remove(id) {
        return this.agentsService.delete(id);
    }
};
exports.AgentsController = AgentsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof Partial !== "undefined" && Partial) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "remove", null);
exports.AgentsController = AgentsController = __decorate([
    (0, common_1.Controller)("agents"),
    __metadata("design:paramtypes", [typeof (_a = typeof agents_service_1.AgentsService !== "undefined" && agents_service_1.AgentsService) === "function" ? _a : Object])
], AgentsController);


/***/ }),

/***/ "./src/agents/agents.module.ts":
/*!*************************************!*\
  !*** ./src/agents/agents.module.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AgentsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const agents_controller_1 = __webpack_require__(/*! ./agents.controller */ "./src/agents/agents.controller.ts");
const agents_service_1 = __webpack_require__(/*! ./agents.service */ "./src/agents/agents.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let AgentsModule = class AgentsModule {
};
exports.AgentsModule = AgentsModule;
exports.AgentsModule = AgentsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [agents_controller_1.AgentsController],
        providers: [agents_service_1.AgentsService],
        exports: [agents_service_1.AgentsService],
    })
], AgentsModule);


/***/ }),

/***/ "./src/agents/agents.service.ts":
/*!**************************************!*\
  !*** ./src/agents/agents.service.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AgentsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const bcrypt = __importStar(__webpack_require__(/*! bcrypt */ "bcrypt"));
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
const serial_id_helper_1 = __webpack_require__(/*! ../common/serial-id.helper */ "./src/common/serial-id.helper.ts");
let AgentsService = class AgentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const agents = await this.prisma.agent.findMany({
            include: {
                user: { select: { id: true, email: true, name: true, phone: true, role: true } },
                cluster: { select: { id: true, name: true } },
                _count: { select: { leadTransactions: true } },
            },
            orderBy: { status: 'asc' },
        });
        return agents.map(agent => ({
            id: agent.id,
            serialId: agent.serialId ?? "",
            name: agent.user?.name ?? "",
            email: agent.user?.email ?? "",
            phone: agent.user?.phone ?? "",
            cluster: agent.cluster?.name ?? "",
            clusterId: agent.cluster?.id ?? "",
            role: agent.user?.role ?? "AGENT",
            status: agent.status?.toLowerCase() ?? "pending",
            activeDeals: agent._count.leadTransactions,
            closedDeals: agent.closedDeals,
            totalCommission: agent.totalCommission,
            performance: agent.closedDeals > 0 ? Math.min(100, Math.round((agent.closedDeals / 10) * 100)) : 0,
        }));
    }
    async findById(id) {
        const agent = await this.prisma.agent.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, email: true, name: true } },
                cluster: true,
                assignedLeads: { orderBy: { createdAt: 'desc' }, take: 10 },
                leadTransactions: { orderBy: { date: 'desc' }, take: 10 },
                closerTransactions: { orderBy: { date: 'desc' }, take: 10 },
                commissions: { orderBy: { createdAt: 'desc' }, take: 10 },
            },
        });
        if (!agent)
            throw new common_1.NotFoundException(`Agent with ID ${id} not found`);
        return agent;
    }
    async create(data) {
        if (!data.name)
            throw new common_1.BadRequestException('Name is required');
        if (!data.email)
            throw new common_1.BadRequestException('Email is required');
        let user = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (user) {
            const existing = await this.prisma.agent.findUnique({ where: { userId: user.id } });
            if (existing)
                throw new common_1.ConflictException('User is already registered as an agent');
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    name: data.name,
                    phone: data.phone,
                    role: (data.role ? client_1.UserRole[data.role.toUpperCase()] : client_1.UserRole.AGENT),
                },
            });
        }
        else {
            const hashedPassword = await bcrypt.hash('password123', 10);
            const userSerialId = await (0, serial_id_helper_1.generateSerialId)(this.prisma, 'USR');
            user = await this.prisma.user.create({
                data: {
                    serialId: userSerialId,
                    email: data.email,
                    password: hashedPassword,
                    name: data.name,
                    phone: data.phone,
                    role: (data.role ? client_1.UserRole[data.role.toUpperCase()] : client_1.UserRole.AGENT),
                },
            });
        }
        const agentSerialId = await (0, serial_id_helper_1.generateSerialId)(this.prisma, 'AGT');
        return this.prisma.agent.create({
            data: {
                serialId: agentSerialId,
                userId: user.id,
                clusterId: data.cluster || null,
                status: data.status ? data.status.toUpperCase() : 'PENDING',
                closedDeals: 0,
                totalCommission: 0,
            },
            include: {
                user: { select: { id: true, email: true, name: true, phone: true, role: true } },
                cluster: { select: { id: true, name: true } },
            },
        });
    }
    async update(id, data) {
        const agent = await this.findById(id);
        if (data.name || data.email || data.phone || data.role) {
            await this.prisma.user.update({
                where: { id: agent.userId },
                data: {
                    ...(data.name ? { name: data.name } : {}),
                    ...(data.email ? { email: data.email } : {}),
                    ...(data.phone ? { phone: data.phone } : {}),
                    ...(data.role ? { role: data.role.toUpperCase() } : {}),
                },
            });
        }
        const updateData = {};
        if (data.cluster !== undefined)
            updateData.clusterId = data.cluster;
        if (data.status !== undefined)
            updateData.status = data.status.toUpperCase();
        return this.prisma.agent.update({
            where: { id },
            data: updateData,
            include: {
                user: { select: { id: true, email: true, name: true, phone: true, role: true } },
                cluster: { select: { id: true, name: true } },
            },
        });
    }
    async delete(id) {
        await this.findById(id);
        await this.prisma.agent.delete({ where: { id } });
        return { message: 'Agent deleted successfully', id };
    }
    async getStats() {
        const [total, active, pending] = await Promise.all([
            this.prisma.agent.count(),
            this.prisma.agent.count({ where: { status: 'ACTIVE' } }),
            this.prisma.agent.count({ where: { status: 'PENDING' } }),
        ]);
        const commissionAgg = await this.prisma.agent.aggregate({ _sum: { totalCommission: true, closedDeals: true } });
        return {
            totalAgents: total,
            activeAgents: active,
            pendingAgents: pending,
            totalClosedDeals: commissionAgg._sum.closedDeals || 0,
            totalCommission: commissionAgg._sum.totalCommission || 0,
        };
    }
};
exports.AgentsService = AgentsService;
exports.AgentsService = AgentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AgentsService);


/***/ }),

/***/ "./src/app.module.ts":
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const auth_module_1 = __webpack_require__(/*! ./auth/auth.module */ "./src/auth/auth.module.ts");
const users_module_1 = __webpack_require__(/*! ./users/users.module */ "./src/users/users.module.ts");
const assets_module_1 = __webpack_require__(/*! ./assets/assets.module */ "./src/assets/assets.module.ts");
const companies_module_1 = __webpack_require__(/*! ./companies/companies.module */ "./src/companies/companies.module.ts");
const agents_module_1 = __webpack_require__(/*! ./agents/agents.module */ "./src/agents/agents.module.ts");
const clusters_module_1 = __webpack_require__(/*! ./clusters/clusters.module */ "./src/clusters/clusters.module.ts");
const leads_module_1 = __webpack_require__(/*! ./leads/leads.module */ "./src/leads/leads.module.ts");
const transactions_module_1 = __webpack_require__(/*! ./transactions/transactions.module */ "./src/transactions/transactions.module.ts");
const installments_module_1 = __webpack_require__(/*! ./installments/installments.module */ "./src/installments/installments.module.ts");
const notification_module_1 = __webpack_require__(/*! ./notification/notification.module */ "./src/notification/notification.module.ts");
const sales_module_1 = __webpack_require__(/*! ./sales/sales.module */ "./src/sales/sales.module.ts");
const investments_module_1 = __webpack_require__(/*! ./investments/investments.module */ "./src/investments/investments.module.ts");
const dashboard_module_1 = __webpack_require__(/*! ./dashboard/dashboard.module */ "./src/dashboard/dashboard.module.ts");
const reports_module_1 = __webpack_require__(/*! ./reports/reports.module */ "./src/reports/reports.module.ts");
const freelancers_module_1 = __webpack_require__(/*! ./freelancers/freelancers.module */ "./src/freelancers/freelancers.module.ts");
const prisma_module_1 = __webpack_require__(/*! ./prisma/prisma.module */ "./src/prisma/prisma.module.ts");
const payments_module_1 = __webpack_require__(/*! ./payments/payments.module */ "./src/payments/payments.module.ts");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') || '3600s' },
                }),
                inject: [config_1.ConfigService],
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            assets_module_1.AssetsModule,
            companies_module_1.CompaniesModule,
            agents_module_1.AgentsModule,
            clusters_module_1.ClustersModule,
            leads_module_1.LeadsModule,
            transactions_module_1.TransactionsModule,
            installments_module_1.InstallmentsModule,
            notification_module_1.NotificationModule,
            sales_module_1.SalesModule,
            investments_module_1.InvestmentsModule,
            dashboard_module_1.DashboardModule,
            reports_module_1.ReportsModule,
            freelancers_module_1.FreelancersModule,
            payments_module_1.PaymentsModule,
        ],
    })
], AppModule);


/***/ }),

/***/ "./src/assets/assets.controller.ts":
/*!*****************************************!*\
  !*** ./src/assets/assets.controller.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssetsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const platform_express_1 = __webpack_require__(/*! @nestjs/platform-express */ "@nestjs/platform-express");
const multer_1 = __webpack_require__(/*! multer */ "multer");
const path_1 = __webpack_require__(/*! path */ "path");
const assets_service_1 = __webpack_require__(/*! ./assets.service */ "./src/assets/assets.service.ts");
const upload_config_1 = __webpack_require__(/*! ../common/upload.config */ "./src/common/upload.config.ts");
let AssetsController = class AssetsController {
    constructor(assetsService) {
        this.assetsService = assetsService;
    }
    async findAll(query) {
        return this.assetsService.findAll(query);
    }
    async getOverviewStats() {
        return this.assetsService.getOverviewStats();
    }
    async findOne(id) {
        return this.assetsService.findById(id);
    }
    async create(createAssetDto) {
        return this.assetsService.create(createAssetDto);
    }
    async update(id, updateAssetDto) {
        return this.assetsService.update(id, updateAssetDto);
    }
    async delete(id) {
        return this.assetsService.delete(id);
    }
    async publish(id) {
        return this.assetsService.publish(id);
    }
    async unpublish(id) {
        return this.assetsService.unpublish(id);
    }
    async uploadImages(id, files) {
        return this.assetsService.uploadImages(id, files);
    }
    async addImage(id, imageData) {
        return this.assetsService.addImage(id, imageData);
    }
    async deleteImage(id, imageId) {
        return this.assetsService.deleteImage(id, imageId);
    }
    async uploadDocuments(id, files) {
        return this.assetsService.uploadDocuments(id, files);
    }
    async addDocument(id, documentData) {
        return this.assetsService.addDocument(id, documentData);
    }
    async deleteDocument(id, documentId) {
        return this.assetsService.deleteDocument(id, documentId);
    }
};
exports.AssetsController = AssetsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "getOverviewStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "delete", null);
__decorate([
    (0, common_1.Put)(':id/publish'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "publish", null);
__decorate([
    (0, common_1.Put)(':id/unpublish'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "unpublish", null);
__decorate([
    (0, common_1.Post)(':id/images/upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 10, {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/images',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                callback(null, `image-${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: upload_config_1.imageFileFilter,
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "uploadImages", null);
__decorate([
    (0, common_1.Post)(':id/images'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "addImage", null);
__decorate([
    (0, common_1.Delete)(':id/images/:imageId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('imageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "deleteImage", null);
__decorate([
    (0, common_1.Post)(':id/documents/upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('documents', 10, {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/documents',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                callback(null, `doc-${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: upload_config_1.documentFileFilter,
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "uploadDocuments", null);
__decorate([
    (0, common_1.Post)(':id/documents'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "addDocument", null);
__decorate([
    (0, common_1.Delete)(':id/documents/:documentId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "deleteDocument", null);
exports.AssetsController = AssetsController = __decorate([
    (0, common_1.Controller)('assets'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [typeof (_a = typeof assets_service_1.AssetsService !== "undefined" && assets_service_1.AssetsService) === "function" ? _a : Object])
], AssetsController);


/***/ }),

/***/ "./src/assets/assets.module.ts":
/*!*************************************!*\
  !*** ./src/assets/assets.module.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssetsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const assets_controller_1 = __webpack_require__(/*! ./assets.controller */ "./src/assets/assets.controller.ts");
const assets_service_1 = __webpack_require__(/*! ./assets.service */ "./src/assets/assets.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
const notification_module_1 = __webpack_require__(/*! ../notification/notification.module */ "./src/notification/notification.module.ts");
let AssetsModule = class AssetsModule {
};
exports.AssetsModule = AssetsModule;
exports.AssetsModule = AssetsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, notification_module_1.NotificationModule],
        controllers: [assets_controller_1.AssetsController],
        providers: [assets_service_1.AssetsService],
        exports: [assets_service_1.AssetsService],
    })
], AssetsModule);


/***/ }),

/***/ "./src/assets/assets.service.ts":
/*!**************************************!*\
  !*** ./src/assets/assets.service.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssetsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const notification_service_1 = __webpack_require__(/*! ../notification/notification.service */ "./src/notification/notification.service.ts");
const serial_id_helper_1 = __webpack_require__(/*! ../common/serial-id.helper */ "./src/common/serial-id.helper.ts");
let AssetsService = class AssetsService {
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async publish(id) {
        await this.findById(id);
        const published = await this.prisma.asset.update({
            where: { id },
            data: { status: 'published' },
        });
        await this.notificationService.notifyAssetPublished(id);
        return published;
    }
    async unpublish(id) {
        await this.findById(id);
        return this.prisma.asset.update({
            where: { id },
            data: { status: 'draft' },
        });
    }
    async deleteImage(assetId, imageId) {
        await this.findById(assetId);
        return this.prisma.assetImage.delete({ where: { id: imageId } });
    }
    async deleteDocument(assetId, documentId) {
        await this.findById(assetId);
        return this.prisma.assetDocument.delete({ where: { id: documentId } });
    }
    async findAll(filters) {
        const where = {};
        if (filters?.status)
            where.status = filters.status;
        if (filters?.type)
            where.type = filters.type;
        if (filters?.companyId)
            where.companyId = filters.companyId;
        const assets = await this.prisma.asset.findMany({
            where,
            include: {
                company: true,
                images: { orderBy: { order: 'asc' } },
                documents: true,
                leads: { orderBy: { createdAt: 'desc' }, take: 10 },
                transactions: { orderBy: { date: 'desc' }, take: 10 },
                installmentPlans: true,
                _count: { select: { leads: true, transactions: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return assets.map(asset => {
            const finalPrice = asset.price
                ? parseFloat(asset.price)
                : asset.fractionCost
                    ? parseFloat(asset.fractionCost)
                    : 0;
            const rentalYield = asset.rentalYield
                ? parseFloat(asset.rentalYield)
                : asset.rentalYieldMax
                    ? asset.rentalYieldMax
                    : 0;
            const capAppreciation = asset.capitalAppreciation
                ? parseFloat(asset.capitalAppreciation)
                : asset.capitalAppreciationMax
                    ? asset.capitalAppreciationMax
                    : 0;
            const totalAnnualReturn = rentalYield + capAppreciation;
            return {
                ...asset,
                facilities: asset.facilities ?? [],
                ownershipOptions: asset.ownershipOptions ?? [],
                paymentOptions: asset.paymentOptions ?? [],
                installmentPeriods: asset.installmentPeriods ?? [],
                riskFactors: asset.riskFactors ?? [],
                finalPrice,
                totalAnnualReturn,
                projectedRentalIncome: Number(asset.projectedRentalIncome) || 0,
                virtualTours: asset.virtualTours ?? 0,
            };
        });
    }
    async getOverviewStats() {
        const assets = await this.prisma.asset.findMany({
            select: { status: true, price: true, fractionCost: true },
        });
        const statusCounts = {};
        let totalValue = 0;
        for (const asset of assets) {
            const statusKey = (asset.status || 'unknown').toLowerCase();
            statusCounts[statusKey] = (statusCounts[statusKey] || 0) + 1;
            const rawValue = asset.price || asset.fractionCost || '0';
            const numericValue = Number.parseFloat(rawValue);
            if (!Number.isNaN(numericValue)) {
                totalValue += numericValue;
            }
        }
        return {
            totalAssets: assets.length,
            totalValue,
            statusCounts,
        };
    }
    async findById(id) {
        const asset = await this.prisma.asset.findUnique({
            where: { id },
            include: {
                company: true,
                images: { orderBy: { order: 'asc' } },
                documents: true,
                leads: { orderBy: { createdAt: 'desc' }, take: 10 },
                transactions: { orderBy: { date: 'desc' }, take: 10 },
                installmentPlans: true,
                _count: { select: { leads: true, transactions: true } },
            },
        });
        if (!asset)
            throw new common_1.NotFoundException(`Asset with ID ${id} not found`);
        const finalPrice = asset.price
            ? parseFloat(asset.price)
            : asset.fractionCost
                ? parseFloat(asset.fractionCost)
                : 0;
        const rentalYield = asset.rentalYield
            ? parseFloat(asset.rentalYield)
            : asset.rentalYieldMax
                ? asset.rentalYieldMax
                : 0;
        const capAppreciation = asset.capitalAppreciation
            ? parseFloat(asset.capitalAppreciation)
            : asset.capitalAppreciationMax
                ? asset.capitalAppreciationMax
                : 0;
        const totalAnnualReturn = rentalYield + capAppreciation;
        return {
            ...asset,
            facilities: asset.facilities ?? [],
            ownershipOptions: asset.ownershipOptions ?? [],
            paymentOptions: asset.paymentOptions ?? [],
            installmentPeriods: asset.installmentPeriods ?? [],
            riskFactors: asset.riskFactors ?? [],
            finalPrice,
            totalAnnualReturn,
            projectedRentalIncome: Number(asset.projectedRentalIncome) || 0,
            virtualTours: asset.virtualTours ?? 0,
        };
    }
    async create(data) {
        if (!data.name)
            throw new common_1.BadRequestException('Asset name is required');
        if (!data.companyId)
            throw new common_1.BadRequestException('Company ID is required');
        const company = await this.prisma.company.findUnique({ where: { id: data.companyId } });
        if (!company)
            throw new common_1.NotFoundException('Company not found');
        const serialId = await (0, serial_id_helper_1.generateSerialId)(this.prisma, 'AST');
        const newAsset = await this.prisma.asset.create({
            data: {
                serialId,
                name: data.name,
                company: { connect: { id: data.companyId } },
                title: data.title || data.name,
                referenceCode: data.referenceCode || null,
                type: data.type || null,
                status: data.status || 'draft',
                projectStatus: data.projectStatus || null,
                location: data.location || null,
                address: data.address || null,
                description: data.description || null,
                landSize: data.landSize ? parseFloat(data.landSize) : null,
                builtSize: data.builtSize ? parseFloat(data.builtSize) : null,
                constructionStart: data.constructionStart ? new Date(data.constructionStart) : null,
                constructionEnd: data.constructionEnd ? new Date(data.constructionEnd) : null,
                propertyCategory: data.propertyCategory || null,
                unitConfiguration: data.unitConfiguration || null,
                facilityManagement: data.facilityManagement ?? null,
                units: data.units ? parseInt(data.units) : null,
                totalUnits: data.totalUnits ? parseInt(data.totalUnits) : null,
                availableUnits: data.availableUnits ? parseInt(data.availableUnits) : null,
                bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
                bathrooms: data.bathrooms ? parseInt(data.bathrooms) : null,
                area: data.area ? parseFloat(data.area) : null,
                parking: data.parking || null,
                furnished: data.furnished || null,
                facilities: data.facilities || data.sharedFacilities || [],
                ownershipOptions: data.ownershipOptions || [],
                ownershipType: data.ownershipType || null,
                fractionTotal: data.fractionTotal ? parseInt(data.fractionTotal) : null,
                landUnitType: data.landUnitType || null,
                landUnitCount: data.landUnitCount ? parseInt(data.landUnitCount) : null,
                price: data.price || null,
                priceRange: data.priceRange || null,
                markup: data.markup || null,
                fractionCost: data.fractionCost || data.costPerFraction || null,
                fundingStatus: data.fundingStatus ? parseInt(data.fundingStatus) : null,
                paymentOptions: data.paymentOptions || [],
                installmentPeriods: data.installmentPeriods || [],
                downPaymentAmount: data.downPaymentAmount || null,
                offPlanDiscount: data.offPlanDiscount ? parseFloat(data.offPlanDiscount) : null,
                stageBasedDiscount: data.stageBasedDiscount ? parseFloat(data.stageBasedDiscount) : null,
                commission: data.commission || null,
                commissionRate: data.commissionRate || null,
                leadCommission: data.leadCommission ? parseFloat(data.leadCommission) : null,
                closerCommission: data.closerCommission ? parseFloat(data.closerCommission) : null,
                projectedRentalIncome: data.projectedRentalIncome ? parseFloat(data.projectedRentalIncome) : null,
                rentalFrequency: data.rentalFrequency || null,
                operatingCost: data.operatingCost ? parseFloat(data.operatingCost) : null,
                firstPayoutDate: data.firstPayoutDate ? new Date(data.firstPayoutDate) : null,
                rentalYield: data.rentalYield || null,
                rentalYieldMin: data.rentalYieldMin ? parseFloat(data.rentalYieldMin) : null,
                rentalYieldMax: data.rentalYieldMax ? parseFloat(data.rentalYieldMax) : null,
                capitalAppreciation: data.capitalAppreciation ? parseFloat(data.capitalAppreciation) : null,
                capitalAppreciationMin: data.capitalAppreciationMin ? parseFloat(data.capitalAppreciationMin) : null,
                capitalAppreciationMax: data.capitalAppreciationMax ? parseFloat(data.capitalAppreciationMax) : null,
                totalReturns: data.totalReturns || null,
                totalReturnsMin: data.totalReturnsMin ? parseFloat(data.totalReturnsMin) : null,
                totalReturnsMax: data.totalReturnsMax ? parseFloat(data.totalReturnsMax) : null,
                riskLevel: data.riskLevel || null,
                riskFactors: data.riskFactors || [],
                constructionStage: data.constructionStage || data.constructionProgress || null,
                offPlanSecurity: data.offPlanSecurity || null,
                exitLiquidity: data.exitLiquidity || null,
                managementMode: data.managementMode || null,
                virtualTours: data.virtualTours ? parseInt(data.virtualTours) : null,
            },
        });
        return this.findById(newAsset.id);
    }
    async update(id, data) {
        const existingAsset = await this.findById(id);
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.title !== undefined)
            updateData.title = data.title;
        if (data.referenceCode !== undefined)
            updateData.referenceCode = data.referenceCode;
        if (data.type !== undefined)
            updateData.type = data.type;
        if (data.status !== undefined)
            updateData.status = data.status;
        if (data.projectStatus !== undefined)
            updateData.projectStatus = data.projectStatus;
        if (data.location !== undefined)
            updateData.location = data.location;
        if (data.address !== undefined)
            updateData.address = data.address;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.companyId !== undefined)
            updateData.companyId = data.companyId;
        if (data.landSize !== undefined && data.landSize !== '' && data.landSize !== null)
            updateData.landSize = parseFloat(data.landSize);
        if (data.builtSize !== undefined && data.builtSize !== '' && data.builtSize !== null)
            updateData.builtSize = parseFloat(data.builtSize);
        if (data.constructionStart !== undefined)
            updateData.constructionStart = data.constructionStart ? new Date(data.constructionStart) : null;
        if (data.constructionEnd !== undefined)
            updateData.constructionEnd = data.constructionEnd ? new Date(data.constructionEnd) : null;
        if (data.propertyCategory !== undefined)
            updateData.propertyCategory = data.propertyCategory;
        if (data.unitConfiguration !== undefined)
            updateData.unitConfiguration = data.unitConfiguration;
        if (data.facilityManagement !== undefined)
            updateData.facilityManagement = data.facilityManagement;
        if (data.units !== undefined && data.units !== '' && data.units !== null)
            updateData.units = parseInt(data.units);
        if (data.totalUnits !== undefined && data.totalUnits !== '' && data.totalUnits !== null)
            updateData.totalUnits = parseInt(data.totalUnits);
        if (data.availableUnits !== undefined && data.availableUnits !== '' && data.availableUnits !== null)
            updateData.availableUnits = parseInt(data.availableUnits);
        if (data.bedrooms !== undefined && data.bedrooms !== '' && data.bedrooms !== null)
            updateData.bedrooms = parseInt(data.bedrooms);
        if (data.bathrooms !== undefined && data.bathrooms !== '' && data.bathrooms !== null)
            updateData.bathrooms = parseInt(data.bathrooms);
        if (data.area !== undefined && data.area !== '' && data.area !== null)
            updateData.area = parseFloat(data.area);
        if (data.parking !== undefined)
            updateData.parking = data.parking;
        if (data.furnished !== undefined)
            updateData.furnished = data.furnished;
        if (data.facilities !== undefined)
            updateData.facilities = data.facilities;
        if (data.sharedFacilities !== undefined)
            updateData.facilities = data.sharedFacilities;
        if (data.ownershipOptions !== undefined)
            updateData.ownershipOptions = data.ownershipOptions;
        if (data.ownershipType !== undefined)
            updateData.ownershipType = data.ownershipType;
        if (data.fractionTotal !== undefined && data.fractionTotal !== '' && data.fractionTotal !== null)
            updateData.fractionTotal = parseInt(data.fractionTotal);
        if (data.landUnitType !== undefined)
            updateData.landUnitType = data.landUnitType;
        if (data.landUnitCount !== undefined && data.landUnitCount !== '' && data.landUnitCount !== null)
            updateData.landUnitCount = parseInt(data.landUnitCount);
        if (data.price !== undefined)
            updateData.price = data.price;
        if (data.priceRange !== undefined)
            updateData.priceRange = data.priceRange;
        if (data.markup !== undefined)
            updateData.markup = data.markup;
        if (data.fractionCost !== undefined)
            updateData.fractionCost = data.fractionCost;
        if (data.costPerFraction !== undefined)
            updateData.fractionCost = data.costPerFraction;
        if (data.fundingStatus !== undefined && data.fundingStatus !== '' && data.fundingStatus !== null)
            updateData.fundingStatus = parseInt(data.fundingStatus);
        if (data.paymentOptions !== undefined)
            updateData.paymentOptions = data.paymentOptions;
        if (data.installmentPeriods !== undefined)
            updateData.installmentPeriods = data.installmentPeriods;
        if (data.downPaymentAmount !== undefined)
            updateData.downPaymentAmount = data.downPaymentAmount;
        if (data.offPlanDiscount !== undefined && data.offPlanDiscount !== '' && data.offPlanDiscount !== null)
            updateData.offPlanDiscount = parseFloat(data.offPlanDiscount);
        if (data.stageBasedDiscount !== undefined && data.stageBasedDiscount !== '' && data.stageBasedDiscount !== null)
            updateData.stageBasedDiscount = parseFloat(data.stageBasedDiscount);
        if (data.commission !== undefined)
            updateData.commission = data.commission;
        if (data.commissionRate !== undefined)
            updateData.commissionRate = data.commissionRate;
        if (data.leadCommission !== undefined && data.leadCommission !== '' && data.leadCommission !== null)
            updateData.leadCommission = parseFloat(data.leadCommission);
        if (data.closerCommission !== undefined && data.closerCommission !== '' && data.closerCommission !== null)
            updateData.closerCommission = parseFloat(data.closerCommission);
        if (data.projectedRentalIncome !== undefined && data.projectedRentalIncome !== '' && data.projectedRentalIncome !== null)
            updateData.projectedRentalIncome = parseFloat(data.projectedRentalIncome);
        if (data.rentalFrequency !== undefined)
            updateData.rentalFrequency = data.rentalFrequency;
        if (data.operatingCost !== undefined && data.operatingCost !== '' && data.operatingCost !== null)
            updateData.operatingCost = parseFloat(data.operatingCost);
        if (data.firstPayoutDate !== undefined)
            updateData.firstPayoutDate = data.firstPayoutDate ? new Date(data.firstPayoutDate) : null;
        if (data.rentalYield !== undefined)
            updateData.rentalYield = data.rentalYield;
        if (data.rentalYieldMin !== undefined && data.rentalYieldMin !== '' && data.rentalYieldMin !== null)
            updateData.rentalYieldMin = parseFloat(data.rentalYieldMin);
        if (data.rentalYieldMax !== undefined && data.rentalYieldMax !== '' && data.rentalYieldMax !== null)
            updateData.rentalYieldMax = parseFloat(data.rentalYieldMax);
        if (data.capitalAppreciation !== undefined && data.capitalAppreciation !== '' && data.capitalAppreciation !== null)
            updateData.capitalAppreciation = parseFloat(data.capitalAppreciation);
        if (data.capitalAppreciationMin !== undefined && data.capitalAppreciationMin !== '' && data.capitalAppreciationMin !== null)
            updateData.capitalAppreciationMin = parseFloat(data.capitalAppreciationMin);
        if (data.capitalAppreciationMax !== undefined && data.capitalAppreciationMax !== '' && data.capitalAppreciationMax !== null)
            updateData.capitalAppreciationMax = parseFloat(data.capitalAppreciationMax);
        if (data.totalReturns !== undefined)
            updateData.totalReturns = data.totalReturns;
        if (data.totalReturnsMin !== undefined && data.totalReturnsMin !== '' && data.totalReturnsMin !== null)
            updateData.totalReturnsMin = parseFloat(data.totalReturnsMin);
        if (data.totalReturnsMax !== undefined && data.totalReturnsMax !== '' && data.totalReturnsMax !== null)
            updateData.totalReturnsMax = parseFloat(data.totalReturnsMax);
        if (data.riskLevel !== undefined)
            updateData.riskLevel = data.riskLevel;
        if (data.riskFactors !== undefined)
            updateData.riskFactors = data.riskFactors;
        if (data.constructionStage !== undefined)
            updateData.constructionStage = data.constructionStage;
        if (data.constructionProgress !== undefined)
            updateData.constructionStage = data.constructionProgress;
        if (data.offPlanSecurity !== undefined)
            updateData.offPlanSecurity = data.offPlanSecurity;
        if (data.exitLiquidity !== undefined)
            updateData.exitLiquidity = data.exitLiquidity;
        if (data.managementMode !== undefined)
            updateData.managementMode = data.managementMode;
        if (data.virtualTours !== undefined && data.virtualTours !== '' && data.virtualTours !== null)
            updateData.virtualTours = parseInt(data.virtualTours);
        await this.prisma.asset.update({
            where: { id },
            data: updateData,
        });
        const changedFields = Object.keys(updateData);
        if (changedFields.length) {
            await this.notificationService.notifyAssetUpdated(existingAsset.id, changedFields);
        }
        return this.findById(id);
    }
    async delete(id) {
        await this.findById(id);
        const savedByCount = await this.prisma.savedProperty.count({ where: { assetId: id } });
        if (savedByCount > 0) {
            throw new common_1.BadRequestException(`Cannot delete asset. It is saved by ${savedByCount} user(s). Please ask them to unsave it first.`);
        }
        const leadsCount = await this.prisma.lead.count({ where: { assetInterest: id } });
        if (leadsCount > 0) {
            throw new common_1.BadRequestException(`Cannot delete asset. It has ${leadsCount} associated lead(s).`);
        }
        const transactionsCount = await this.prisma.transaction.count({ where: { assetId: id } });
        if (transactionsCount > 0) {
            throw new common_1.BadRequestException(`Cannot delete asset. It has ${transactionsCount} associated transaction(s).`);
        }
        await this.prisma.asset.delete({ where: { id } });
        return { message: 'Asset deleted successfully', id };
    }
    async addImage(assetId, imageData) {
        await this.findById(assetId);
        return this.prisma.assetImage.create({
            data: {
                assetId,
                url: imageData.url,
                caption: imageData.caption || null,
                order: imageData.order || 0,
            },
        });
    }
    async removeImage(imageId) {
        return this.prisma.assetImage.delete({ where: { id: imageId } });
    }
    async addDocument(assetId, docData) {
        await this.findById(assetId);
        return this.prisma.assetDocument.create({
            data: {
                assetId,
                url: docData.url,
                title: docData.title || null,
                type: docData.type || null,
            },
        });
    }
    async removeDocument(docId) {
        return this.prisma.assetDocument.delete({ where: { id: docId } });
    }
    async uploadImages(assetId, files) {
        await this.findById(assetId);
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const images = [];
        for (const file of files) {
            const url = `${baseUrl}/uploads/images/${file.filename}`;
            const image = await this.prisma.assetImage.create({
                data: {
                    assetId,
                    url,
                    caption: file.originalname,
                    order: 0,
                },
            });
            images.push(image);
        }
        return {
            message: `${images.length} image(s) uploaded successfully`,
            images,
        };
    }
    async uploadDocuments(assetId, files) {
        await this.findById(assetId);
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const documents = [];
        for (const file of files) {
            const url = `${baseUrl}/uploads/documents/${file.filename}`;
            const document = await this.prisma.assetDocument.create({
                data: {
                    assetId,
                    url,
                    title: file.originalname,
                    type: file.mimetype,
                },
            });
            documents.push(document);
        }
        return {
            message: `${documents.length} document(s) uploaded successfully`,
            documents,
        };
    }
};
exports.AssetsService = AssetsService;
exports.AssetsService = AssetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _b : Object])
], AssetsService);


/***/ }),

/***/ "./src/auth/auth.controller.ts":
/*!*************************************!*\
  !*** ./src/auth/auth.controller.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = exports.RefreshTokenDto = exports.RegisterDto = exports.LoginDto = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/auth/auth.service.ts");
const users_service_1 = __webpack_require__(/*! ../users/users.service */ "./src/users/users.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ./jwt-auth.guard */ "./src/auth/jwt-auth.guard.ts");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => String(value || '').trim().toLowerCase()),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long' }),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof client_1.UserRole !== "undefined" && client_1.UserRole) === "function" ? _a : Object)
], RegisterDto.prototype, "role", void 0);
class RefreshTokenDto {
}
exports.RefreshTokenDto = RefreshTokenDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RefreshTokenDto.prototype, "refreshToken", void 0);
let AuthController = class AuthController {
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    async login(dto) {
        const user = await this.authService.validateUser(dto.email, dto.password);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return this.authService.login(user);
    }
    async register(dto) {
        return this.authService.register(dto);
    }
    async refreshToken(dto) {
        return this.authService.refreshToken(dto.refreshToken);
    }
    async getProfile(req) {
        return this.usersService.findById(req.user.id);
    }
    async updateProfile(req, dto) {
        return this.usersService.updateUser(req.user.id, dto);
    }
    async changePassword(req, body) {
        return this.authService.changePassword(req.user.id, body.currentPassword, body.newPassword);
    }
    async logout(req) {
        return this.authService.logout(req.user.id);
    }
    async setup2FA(req) {
        return this.authService.generate2FASecret(req.user.id);
    }
    async enable2FA(req, body) {
        return this.authService.enable2FA(req.user.id, body.token);
    }
    async disable2FA(req, body) {
        return this.authService.disable2FA(req.user.id, body.token);
    }
    async verify2FA(body) {
        return this.authService.verify2FAAndLogin(body.interimToken, body.token);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('me'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('change-password'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('2fa/setup'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "setup2FA", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('2fa/enable'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "enable2FA", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('2fa/disable'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "disable2FA", null);
__decorate([
    (0, common_1.Post)('2fa/verify'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify2FA", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_b = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _b : Object, typeof (_c = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _c : Object])
], AuthController);


/***/ }),

/***/ "./src/auth/auth.module.ts":
/*!*********************************!*\
  !*** ./src/auth/auth.module.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./src/auth/auth.controller.ts");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/auth/auth.service.ts");
const jwt_strategy_1 = __webpack_require__(/*! ./jwt.strategy */ "./src/auth/jwt.strategy.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
const notification_module_1 = __webpack_require__(/*! ../notification/notification.module */ "./src/notification/notification.module.ts");
const users_service_1 = __webpack_require__(/*! src/users/users.service */ "./src/users/users.service.ts");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            passport_1.PassportModule,
            notification_module_1.NotificationModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'buyops26',
                signOptions: { expiresIn: '7d' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, users_service_1.UsersService, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),

/***/ "./src/auth/auth.service.ts":
/*!**********************************!*\
  !*** ./src/auth/auth.service.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const notification_service_1 = __webpack_require__(/*! ../notification/notification.service */ "./src/notification/notification.service.ts");
const bcrypt = __importStar(__webpack_require__(/*! bcrypt */ "bcrypt"));
const speakeasy = __importStar(__webpack_require__(/*! speakeasy */ "./node_modules/speakeasy/index.js"));
const QRCode = __importStar(__webpack_require__(/*! qrcode */ "./node_modules/qrcode/lib/index.js"));
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
const serial_id_helper_1 = __webpack_require__(/*! ../common/serial-id.helper */ "./src/common/serial-id.helper.ts");
let AuthService = class AuthService {
    constructor(prisma, jwtService, notificationService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.notificationService = notificationService;
    }
    async validateUser(email, password) {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user)
            return null;
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid)
            return null;
        const { password: _, ...result } = user;
        return result;
    }
    async login(user) {
        const fullUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            select: { twoFactorEnabled: true },
        });
        if (fullUser?.twoFactorEnabled) {
            const interimToken = this.jwtService.sign({ sub: user.id, email: user.email, requires2FA: true }, { expiresIn: '5m' });
            return { requiresTwoFactor: true, interimToken };
        }
        console.log('LOGIN USER:', user);
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name || user.email.split('@')[0],
                phone: user.phone || null,
                role: user.role || 'USER',
            },
        };
    }
    async register(data) {
        const normalizedEmail = data.email.trim().toLowerCase();
        const existing = await this.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (existing)
            throw new common_1.ConflictException('Email already in use');
        const strongPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
        if (!strongPassword.test(data.password)) {
            throw new common_1.ConflictException('Password must be at least 8 characters long and include a number and a special character.');
        }
        const hashed = await bcrypt.hash(data.password, 10);
        const serialId = await (0, serial_id_helper_1.generateSerialId)(this.prisma, 'USR');
        const user = await this.prisma.user.create({
            data: {
                serialId,
                email: normalizedEmail,
                password: hashed,
                name: data.name || normalizedEmail.split('@')[0],
                phone: data.phone || null,
                role: data.role || client_1.UserRole.USER,
            },
        });
        const { password: _, ...result } = user;
        return this.login(result);
    }
    async validateToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                select: { id: true, email: true, name: true, role: true },
            });
            if (!user)
                throw new common_1.UnauthorizedException('User not found');
            return user;
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                select: { id: true, email: true, name: true, role: true },
            });
            if (!user)
                throw new common_1.UnauthorizedException('User not found');
            return this.login(user);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const valid = await bcrypt.compare(currentPassword, user.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Current password is incorrect');
        const hashed = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashed },
        });
        return { message: 'Password changed successfully' };
    }
    async forgotPassword(email) {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) {
            return { message: 'If an account exists, a reset link has been sent.' };
        }
        const resetToken = this.jwtService.sign({ sub: user.id, email: user.email }, { expiresIn: '1h' });
        await this.notificationService.sendPasswordResetEmail(user, resetToken);
        return {
            message: 'If an account exists, a reset link has been sent.',
        };
    }
    async resetPassword(token, newPassword) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user)
                throw new common_1.UnauthorizedException('Invalid reset token');
            const hashed = await bcrypt.hash(newPassword, 10);
            await this.prisma.user.update({
                where: { id: user.id },
                data: { password: hashed },
            });
            return { message: 'Password reset successfully' };
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired reset token');
        }
    }
    async verifyEmail(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user)
                throw new common_1.UnauthorizedException('Invalid verification token');
            return { message: 'Email verified successfully' };
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired verification token');
        }
    }
    async resendVerificationEmail(email) {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) {
            return { message: 'If an account exists, a verification link has been sent.' };
        }
        const verificationToken = this.jwtService.sign({ sub: user.id, email: user.email }, { expiresIn: '24h' });
        await this.notificationService.sendEmailVerificationEmail(user, verificationToken);
        return {
            message: 'If an account exists, a verification link has been sent.',
        };
    }
    async logout(userId) {
        return { message: 'Logged out successfully' };
    }
    async generate2FASecret(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const secret = speakeasy.generateSecret({
            name: `BuyOps (${user.email})`,
            issuer: 'BuyOps',
            length: 20,
        });
        await this.prisma.user.update({
            where: { id: userId },
            data: { twoFactorSecret: secret.base32 },
        });
        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
        return { secret: secret.base32, qrCode: qrCodeUrl };
    }
    async enable2FA(userId, token) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const secret = user.twoFactorSecret;
        if (!secret)
            throw new common_1.BadRequestException('Please set up 2FA first');
        const verified = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token,
            window: 1,
        });
        if (!verified)
            throw new common_1.BadRequestException('Invalid verification code');
        await this.prisma.user.update({
            where: { id: userId },
            data: { twoFactorEnabled: true },
        });
        return { message: '2FA enabled successfully' };
    }
    async disable2FA(userId, token) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (!user.twoFactorEnabled)
            throw new common_1.BadRequestException('2FA is not enabled');
        const secret = user.twoFactorSecret;
        const verified = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token,
            window: 1,
        });
        if (!verified)
            throw new common_1.BadRequestException('Invalid verification code');
        await this.prisma.user.update({
            where: { id: userId },
            data: { twoFactorEnabled: false, twoFactorSecret: null },
        });
        return { message: '2FA disabled successfully' };
    }
    async verify2FAAndLogin(interimToken, totpToken) {
        let payload;
        try {
            payload = this.jwtService.verify(interimToken);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired interim token');
        }
        if (!payload.requires2FA)
            throw new common_1.UnauthorizedException('Invalid interim token');
        const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const secret = user.twoFactorSecret;
        if (!secret)
            throw new common_1.BadRequestException('2FA secret not found');
        const verified = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token: totpToken,
            window: 1,
        });
        if (!verified)
            throw new common_1.UnauthorizedException('Invalid 2FA code');
        const { password: _, ...safeUser } = user;
        const jwtPayload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(jwtPayload, { expiresIn: '1h' });
        const refreshToken = this.jwtService.sign(jwtPayload, { expiresIn: '30d' });
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name || user.email.split('@')[0],
                phone: user.phone || null,
                role: user.role,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _c : Object])
], AuthService);


/***/ }),

/***/ "./src/auth/jwt-auth.guard.ts":
/*!************************************!*\
  !*** ./src/auth/jwt-auth.guard.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        if (request.method === 'OPTIONS') {
            return true;
        }
        return super.canActivate(context);
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ }),

/***/ "./src/auth/jwt.strategy.ts":
/*!**********************************!*\
  !*** ./src/auth/jwt.strategy.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_jwt_1 = __webpack_require__(/*! passport-jwt */ "passport-jwt");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(prisma) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
        this.prisma = prisma;
    }
    async validate(payload) {
        const userId = payload?.sub;
        if (!userId) {
            throw new common_1.UnauthorizedException("Invalid token: missing user identifier");
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                serialId: true,
                email: true,
                name: true,
                role: true,
                status: true,
                agentProfileId: true,
                freelancerProfileId: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException("User not found");
        }
        return user;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], JwtStrategy);


/***/ }),

/***/ "./src/clusters/clusters.controller.ts":
/*!*********************************************!*\
  !*** ./src/clusters/clusters.controller.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClustersController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const clusters_service_1 = __webpack_require__(/*! ./clusters.service */ "./src/clusters/clusters.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! src/auth/jwt-auth.guard */ "./src/auth/jwt-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../common/roles.guard */ "./src/common/roles.guard.ts");
class CreateClusterDto {
}
let ClustersController = class ClustersController {
    constructor(clustersService) {
        this.clustersService = clustersService;
    }
    async findAll() {
        return this.clustersService.findAll();
    }
    async getStats() {
        return this.clustersService.getStats();
    }
    async findOne(id) {
        return this.clustersService.findById(id);
    }
    async create(dto) {
        return this.clustersService.create(dto);
    }
    async update(id, dto) {
        return this.clustersService.update(id, dto);
    }
    async remove(id) {
        return this.clustersService.delete(id);
    }
};
exports.ClustersController = ClustersController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClustersController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClustersController.prototype, "getStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClustersController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClustersController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof Partial !== "undefined" && Partial) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], ClustersController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClustersController.prototype, "remove", null);
exports.ClustersController = ClustersController = __decorate([
    (0, common_1.Controller)("clusters"),
    __metadata("design:paramtypes", [typeof (_a = typeof clusters_service_1.ClustersService !== "undefined" && clusters_service_1.ClustersService) === "function" ? _a : Object])
], ClustersController);


/***/ }),

/***/ "./src/clusters/clusters.module.ts":
/*!*****************************************!*\
  !*** ./src/clusters/clusters.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClustersModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const clusters_controller_1 = __webpack_require__(/*! ./clusters.controller */ "./src/clusters/clusters.controller.ts");
const clusters_service_1 = __webpack_require__(/*! ./clusters.service */ "./src/clusters/clusters.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let ClustersModule = class ClustersModule {
};
exports.ClustersModule = ClustersModule;
exports.ClustersModule = ClustersModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [clusters_controller_1.ClustersController],
        providers: [clusters_service_1.ClustersService],
        exports: [clusters_service_1.ClustersService],
    })
], ClustersModule);


/***/ }),

/***/ "./src/clusters/clusters.service.ts":
/*!******************************************!*\
  !*** ./src/clusters/clusters.service.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClustersService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const serial_id_helper_1 = __webpack_require__(/*! ../common/serial-id.helper */ "./src/common/serial-id.helper.ts");
let ClustersService = class ClustersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    normalizeClusterStatus(status) {
        const normalized = (status || 'ACTIVE').toString().trim().toUpperCase();
        if (!['ACTIVE', 'INACTIVE', 'PENDING'].includes(normalized)) {
            throw new common_1.BadRequestException('Cluster status must be one of: ACTIVE, INACTIVE, PENDING');
        }
        return normalized.toLowerCase();
    }
    async resolveManagerId(teamLead) {
        if (!teamLead)
            return null;
        const user = await this.prisma.user.findUnique({
            where: { id: teamLead },
            select: { id: true },
        });
        if (user)
            return user.id;
        const agent = await this.prisma.agent.findUnique({
            where: { id: teamLead },
            select: { userId: true },
        });
        if (agent?.userId)
            return agent.userId;
        throw new common_1.BadRequestException('Invalid teamLead: must be a valid User ID or Agent ID');
    }
    async findAll() {
        const clusters = await this.prisma.cluster.findMany({
            include: {
                manager: { select: { id: true, name: true, email: true } },
                agents: {
                    include: {
                        user: { select: { id: true, name: true } },
                    },
                },
                freelancers: {
                    include: { user: { select: { id: true, name: true } } },
                },
                _count: { select: { agents: true, freelancers: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return await Promise.all(clusters.map(async (cluster) => {
            const teamLead = cluster.manager?.name ?? "";
            const agents = cluster._count.agents;
            const agentIds = cluster.agents.map(a => a.id);
            const transactions = await this.prisma.transaction.findMany({
                where: {
                    OR: [
                        { leadAgentId: { in: agentIds } },
                        { closerAgentId: { in: agentIds } },
                    ],
                },
                select: { assetId: true },
                distinct: ['assetId'],
            });
            const activeAssets = transactions.length;
            const totalCommission = await this.prisma.agent.aggregate({
                where: { clusterId: cluster.id },
                _sum: { totalCommission: true },
            });
            return {
                id: cluster.id,
                serialId: cluster.serialId ?? "",
                name: cluster.name,
                teamLead,
                managerId: cluster.managerId,
                agents,
                activeAssets,
                totalCommission: totalCommission._sum.totalCommission || 0,
                status: cluster.status,
                location: cluster.location,
                code: cluster.code,
                commissionType: cluster.commissionType ?? 'AGENT',
            };
        }));
    }
    async findById(id) {
        const cluster = await this.prisma.cluster.findUnique({
            where: { id },
            include: {
                manager: { select: { id: true, name: true, email: true } },
                agents: {
                    include: {
                        user: { select: { id: true, name: true, email: true } },
                        assignedLeads: true,
                        leadTransactions: true,
                        closerTransactions: true,
                    },
                },
                freelancers: {
                    include: { user: { select: { id: true, name: true, email: true } } },
                },
            },
        });
        if (!cluster)
            throw new common_1.NotFoundException(`Cluster with ID ${id} not found`);
        return cluster;
    }
    async create(data) {
        if (!data.name)
            throw new common_1.BadRequestException('Cluster name is required');
        const existingByName = await this.prisma.cluster.findFirst({ where: { name: { equals: data.name.trim(), mode: 'insensitive' } } });
        if (existingByName)
            throw new common_1.ConflictException('A cluster with this name already exists');
        const managerId = await this.resolveManagerId(data.teamLead);
        const status = this.normalizeClusterStatus(data.status);
        const serialId = await (0, serial_id_helper_1.generateSerialId)(this.prisma, 'CLT');
        return this.prisma.cluster.create({
            data: {
                serialId,
                name: data.name,
                code: data.code || null,
                status,
                location: data.location || null,
                managerId,
                commissionType: data.commissionType || 'AGENT',
            },
            include: {
                manager: { select: { id: true, name: true } },
            },
        });
    }
    async update(id, data) {
        await this.findById(id);
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.code !== undefined)
            updateData.code = data.code;
        if (data.status !== undefined)
            updateData.status = this.normalizeClusterStatus(data.status);
        if (data.location !== undefined)
            updateData.location = data.location;
        if (data.teamLead !== undefined)
            updateData.managerId = await this.resolveManagerId(data.teamLead);
        if (data.commissionType !== undefined)
            updateData.commissionType = data.commissionType;
        return this.prisma.cluster.update({
            where: { id },
            data: updateData,
            include: { manager: { select: { id: true, name: true } } },
        });
    }
    async delete(id) {
        await this.findById(id);
        await this.prisma.cluster.delete({ where: { id } });
        return { message: 'Cluster deleted successfully', id };
    }
    async getStats() {
        const [total, active, agents, freelancers] = await Promise.all([
            this.prisma.cluster.count(),
            this.prisma.cluster.count({ where: { status: 'active' } }),
            this.prisma.user.count({ where: { role: 'AGENT' } }),
            this.prisma.freelancer.count(),
        ]);
        return { totalClusters: total, activeClusters: active, totalAgents: agents, totalFreelancers: freelancers };
    }
};
exports.ClustersService = ClustersService;
exports.ClustersService = ClustersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ClustersService);


/***/ }),

/***/ "./src/common/roles.decorator.ts":
/*!***************************************!*\
  !*** ./src/common/roles.decorator.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
exports.ROLES_KEY = "roles";
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;


/***/ }),

/***/ "./src/common/roles.guard.ts":
/*!***********************************!*\
  !*** ./src/common/roles.guard.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const roles_decorator_1 = __webpack_require__(/*! ./roles.decorator */ "./src/common/roles.decorator.ts");
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user)
            return false;
        return requiredRoles.includes(user.role);
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], RolesGuard);


/***/ }),

/***/ "./src/common/serial-id.helper.ts":
/*!****************************************!*\
  !*** ./src/common/serial-id.helper.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateSerialId = generateSerialId;
const MODEL_MAP = {
    USR: 'user',
    CMP: 'company',
    AST: 'asset',
    LED: 'lead',
    AGT: 'agent',
    FRL: 'freelancer',
    CLT: 'cluster',
    TRN: 'transaction',
    IPL: 'installmentPlan',
    INS: 'installment',
    COM: 'commission',
};
async function generateSerialId(prisma, prefix) {
    const model = MODEL_MAP[prefix];
    const count = await prisma[model].count();
    const serial = String(count + 1).padStart(4, '0');
    return `BO-${prefix}-${serial}`;
}


/***/ }),

/***/ "./src/common/upload.config.ts":
/*!*************************************!*\
  !*** ./src/common/upload.config.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.documentFileFilter = exports.imageFileFilter = exports.multerConfig = void 0;
const multer_1 = __webpack_require__(/*! multer */ "multer");
const path_1 = __webpack_require__(/*! path */ "path");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
exports.multerConfig = {
    storage: (0, multer_1.diskStorage)({
        destination: './uploads',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = (0, path_1.extname)(file.originalname);
            const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
            callback(null, filename);
        },
    }),
    fileFilter: (req, file, callback) => {
        const allowedMimes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
        ];
        if (allowedMimes.includes(file.mimetype)) {
            callback(null, true);
        }
        else {
            callback(new common_1.BadRequestException(`Invalid file type. Allowed types: ${allowedMimes.join(', ')}`), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
};
const imageFileFilter = (req, file, callback) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
        callback(null, true);
    }
    else {
        callback(new common_1.BadRequestException('Only image files are allowed (jpg, jpeg, png, gif, webp)'), false);
    }
};
exports.imageFileFilter = imageFileFilter;
const documentFileFilter = (req, file, callback) => {
    const allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
    ];
    if (allowedMimes.includes(file.mimetype)) {
        callback(null, true);
    }
    else {
        callback(new common_1.BadRequestException('Only document files are allowed (pdf, doc, docx, txt)'), false);
    }
};
exports.documentFileFilter = documentFileFilter;


/***/ }),

/***/ "./src/companies/companies.controller.ts":
/*!***********************************************!*\
  !*** ./src/companies/companies.controller.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompaniesController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const companies_service_1 = __webpack_require__(/*! ./companies.service */ "./src/companies/companies.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! src/auth/jwt-auth.guard */ "./src/auth/jwt-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../common/roles.guard */ "./src/common/roles.guard.ts");
const create_company_dto_1 = __webpack_require__(/*! ./dto/create-company.dto */ "./src/companies/dto/create-company.dto.ts");
let CompaniesController = class CompaniesController {
    constructor(companiesService) {
        this.companiesService = companiesService;
    }
    async findAll() {
        return this.companiesService.findAll();
    }
    async findOne(id) {
        return this.companiesService.findById(id);
    }
    async create(dto) {
        return this.companiesService.create(dto);
    }
    async update(id, dto) {
        return this.companiesService.update(id, dto);
    }
    async remove(id) {
        return this.companiesService.delete(id);
    }
};
exports.CompaniesController = CompaniesController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_company_dto_1.CreateCompanyDto !== "undefined" && create_company_dto_1.CreateCompanyDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof Partial !== "undefined" && Partial) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "remove", null);
exports.CompaniesController = CompaniesController = __decorate([
    (0, common_1.Controller)("companies"),
    __metadata("design:paramtypes", [typeof (_a = typeof companies_service_1.CompaniesService !== "undefined" && companies_service_1.CompaniesService) === "function" ? _a : Object])
], CompaniesController);


/***/ }),

/***/ "./src/companies/companies.module.ts":
/*!*******************************************!*\
  !*** ./src/companies/companies.module.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompaniesModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const companies_controller_1 = __webpack_require__(/*! ./companies.controller */ "./src/companies/companies.controller.ts");
const companies_service_1 = __webpack_require__(/*! ./companies.service */ "./src/companies/companies.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let CompaniesModule = class CompaniesModule {
};
exports.CompaniesModule = CompaniesModule;
exports.CompaniesModule = CompaniesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [companies_controller_1.CompaniesController],
        providers: [companies_service_1.CompaniesService],
        exports: [companies_service_1.CompaniesService],
    })
], CompaniesModule);


/***/ }),

/***/ "./src/companies/companies.service.ts":
/*!********************************************!*\
  !*** ./src/companies/companies.service.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompaniesService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const serial_id_helper_1 = __webpack_require__(/*! ../common/serial-id.helper */ "./src/common/serial-id.helper.ts");
let CompaniesService = class CompaniesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    normalizeStatus(status) {
        const normalized = String(status || 'active').trim().toLowerCase();
        if (!['active', 'pending', 'inactive', 'suspended'].includes(normalized)) {
            throw new common_1.BadRequestException('Status must be one of: active, pending, inactive, suspended');
        }
        return normalized;
    }
    normalizeEmail(email) {
        return email.toLowerCase().trim();
    }
    async enrichCompanyData(company) {
        let activeAssets;
        if (company.assets && Array.isArray(company.assets)) {
            activeAssets = company.assets.filter((asset) => ['available', 'active', 'published'].includes(String(asset.status || '').toLowerCase())).length;
        }
        else {
            const assets = await this.prisma.asset.findMany({
                where: { companyId: company.id },
                select: { status: true }
            });
            activeAssets = assets.filter(asset => ['available', 'active', 'published'].includes(String(asset.status || '').toLowerCase())).length;
        }
        const totalTransactions = company._count?.transactions ||
            await this.prisma.transaction.count({ where: { companyId: company.id } });
        return {
            ...company,
            activeAssets,
            totalTransactions
        };
    }
    async findAll() {
        const companies = await this.prisma.company.findMany({
            include: {
                assets: { select: { id: true, name: true, type: true, status: true } },
                _count: { select: { assets: true, transactions: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return companies.map(company => ({
            ...company,
            activeAssets: company.assets.filter(asset => ['available', 'active', 'published'].includes(String(asset.status || '').toLowerCase())).length,
            totalTransactions: company._count.transactions,
        }));
    }
    async findById(id) {
        if (!id || id.trim() === '')
            throw new common_1.BadRequestException('Company ID is required');
        const company = await this.prisma.company.findUnique({
            where: { id },
            include: {
                assets: { select: { id: true, name: true, type: true, status: true } },
                transactions: { select: { id: true, totalAmount: true, status: true, date: true }, take: 10, orderBy: { date: 'desc' } },
                _count: { select: { assets: true, transactions: true } },
            },
        });
        if (!company)
            throw new common_1.NotFoundException(`Company with ID ${id} not found`);
        return this.enrichCompanyData(company);
    }
    async create(data) {
        try {
            if (!data.name || !data.name.trim())
                throw new common_1.BadRequestException('Company name is required');
            if (!data.email || !data.email.trim())
                throw new common_1.BadRequestException('Email is required');
            if (!data.type || !['developer', 'realtor', 'partner', 'consultant', 'investor'].includes(data.type)) {
                throw new common_1.BadRequestException('Company type is required and must be one of: developer, realtor, partner, consultant, investor');
            }
            const existingByName = await this.prisma.company.findFirst({ where: { name: { equals: data.name.trim(), mode: 'insensitive' } } });
            if (existingByName)
                throw new common_1.ConflictException('A company with this name already exists');
            const existing = await this.prisma.company.findFirst({ where: { email: this.normalizeEmail(data.email) } });
            if (existing)
                throw new common_1.ConflictException('A company with this email already exists');
            if (data.phone?.trim()) {
                const existingByPhone = await this.prisma.company.findFirst({ where: { phone: data.phone.trim() } });
                if (existingByPhone)
                    throw new common_1.ConflictException('A company with this phone number already exists');
            }
            if (data.registrationNumber?.trim()) {
                const existingByRegNo = await this.prisma.company.findFirst({ where: { registrationNumber: data.registrationNumber.trim() } });
                if (existingByRegNo)
                    throw new common_1.ConflictException('A company with this registration number already exists');
            }
            const serialId = await (0, serial_id_helper_1.generateSerialId)(this.prisma, 'CMP');
            const company = await this.prisma.company.create({
                data: {
                    serialId,
                    name: data.name.trim(),
                    type: data.type,
                    email: this.normalizeEmail(data.email),
                    phone: data.phone?.trim() || null,
                    status: this.normalizeStatus(data.status),
                    contactPerson: data.contactPerson?.trim() || null,
                    address: data.address?.trim() || null,
                    commissionRate: data.commissionRate ? parseFloat(data.commissionRate) : 0,
                    paymentTerms: data.paymentTerms?.trim() || null,
                    agreementStartDate: data.agreementStartDate ? new Date(data.agreementStartDate) : null,
                    agreementExpiryDate: data.agreementExpiryDate ? new Date(data.agreementExpiryDate) : null,
                    registrationNumber: data.registrationNumber?.trim() || null,
                    notes: data.notes?.trim() || null,
                    accountName: (data.accountName || data.bankAccountName)?.trim() || null,
                    bankName: data.bankName?.trim() || null,
                    accountNumber: data.accountNumber?.trim() || null,
                },
                include: {
                    assets: { select: { id: true, name: true, type: true, status: true } },
                    _count: { select: { assets: true, transactions: true } }
                },
            });
            return this.enrichCompanyData(company);
        }
        catch (error) {
            if (error.code === 'P2002') {
                const rawField = error.meta?.target?.[0] || '';
                const fieldLabels = {
                    name: 'company name',
                    email: 'email address',
                    phone: 'phone number',
                    registrationNumber: 'registration number',
                    serialId: 'serial ID',
                };
                const label = fieldLabels[rawField] || rawField || 'a unique field';
                throw new common_1.ConflictException(`A company with this ${label} already exists`);
            }
            if (error instanceof common_1.BadRequestException || error instanceof common_1.ConflictException)
                throw error;
            console.error('Company creation error:', error);
            throw new common_1.InternalServerErrorException('Failed to create company');
        }
    }
    async update(id, data) {
        try {
            if (!id || id.trim() === '')
                throw new common_1.BadRequestException('Company ID is required');
            const exists = await this.prisma.company.findUnique({ where: { id }, select: { id: true } });
            if (!exists)
                throw new common_1.NotFoundException(`Company with ID ${id} not found`);
            if (data.name !== undefined && data.name.trim()) {
                const dupName = await this.prisma.company.findFirst({ where: { name: { equals: data.name.trim(), mode: 'insensitive' }, NOT: { id } } });
                if (dupName)
                    throw new common_1.ConflictException('A company with this name already exists');
            }
            if (data.email !== undefined && data.email.trim()) {
                const dupEmail = await this.prisma.company.findFirst({ where: { email: this.normalizeEmail(data.email), NOT: { id } } });
                if (dupEmail)
                    throw new common_1.ConflictException('A company with this email address already exists');
            }
            if (data.phone !== undefined && data.phone.trim()) {
                const dupPhone = await this.prisma.company.findFirst({ where: { phone: data.phone.trim(), NOT: { id } } });
                if (dupPhone)
                    throw new common_1.ConflictException('A company with this phone number already exists');
            }
            if (data.registrationNumber !== undefined && data.registrationNumber.trim()) {
                const dupRegNo = await this.prisma.company.findFirst({ where: { registrationNumber: data.registrationNumber.trim(), NOT: { id } } });
                if (dupRegNo)
                    throw new common_1.ConflictException('A company with this registration number already exists');
            }
            const updateData = {};
            if (data.name !== undefined)
                updateData.name = data.name.trim();
            if (data.type !== undefined)
                updateData.type = data.type;
            if (data.email !== undefined)
                updateData.email = this.normalizeEmail(data.email);
            if (data.phone !== undefined)
                updateData.phone = data.phone?.trim();
            if (data.status !== undefined)
                updateData.status = this.normalizeStatus(data.status);
            if (data.contactPerson !== undefined)
                updateData.contactPerson = data.contactPerson?.trim();
            if (data.address !== undefined)
                updateData.address = data.address?.trim();
            if (data.commissionRate !== undefined)
                updateData.commissionRate = parseFloat(data.commissionRate);
            if (data.paymentTerms !== undefined)
                updateData.paymentTerms = data.paymentTerms?.trim();
            if (data.agreementStartDate !== undefined)
                updateData.agreementStartDate = data.agreementStartDate ? new Date(data.agreementStartDate) : null;
            if (data.agreementExpiryDate !== undefined)
                updateData.agreementExpiryDate = data.agreementExpiryDate ? new Date(data.agreementExpiryDate) : null;
            if (data.registrationNumber !== undefined)
                updateData.registrationNumber = data.registrationNumber?.trim();
            if (data.notes !== undefined)
                updateData.notes = data.notes?.trim();
            if (data.accountName !== undefined || data.bankAccountName !== undefined) {
                updateData.accountName = (data.accountName || data.bankAccountName)?.trim() || null;
            }
            if (data.bankName !== undefined)
                updateData.bankName = data.bankName?.trim();
            if (data.accountNumber !== undefined)
                updateData.accountNumber = data.accountNumber?.trim();
            const company = await this.prisma.company.update({
                where: { id },
                data: updateData,
                include: {
                    assets: { select: { id: true, name: true, type: true, status: true } },
                    _count: { select: { assets: true, transactions: true } }
                },
            });
            return this.enrichCompanyData(company);
        }
        catch (error) {
            if (error.code === 'P2002') {
                const rawField = error.meta?.target?.[0] || '';
                const fieldLabels = {
                    name: 'company name',
                    email: 'email address',
                    phone: 'phone number',
                    registrationNumber: 'registration number',
                    serialId: 'serial ID',
                };
                const label = fieldLabels[rawField] || rawField || 'a unique field';
                throw new common_1.ConflictException(`A company with this ${label} already exists`);
            }
            if (error instanceof common_1.BadRequestException || error instanceof common_1.ConflictException || error instanceof common_1.NotFoundException)
                throw error;
            console.error('Company update error:', error);
            throw new common_1.InternalServerErrorException('Failed to update company');
        }
    }
    async delete(id) {
        if (!id || id.trim() === '')
            throw new common_1.BadRequestException('Company ID is required');
        const exists = await this.prisma.company.findUnique({ where: { id }, select: { id: true } });
        if (!exists)
            throw new common_1.NotFoundException(`Company with ID ${id} not found`);
        const activeAssets = await this.prisma.asset.count({ where: { companyId: id, status: 'published' } });
        if (activeAssets > 0)
            throw new common_1.BadRequestException(`Cannot delete company with ${activeAssets} active assets.`);
        const txCount = await this.prisma.transaction.count({ where: { companyId: id } });
        if (txCount > 0)
            throw new common_1.BadRequestException(`Cannot delete company with ${txCount} transactions.`);
        await this.prisma.company.delete({ where: { id } });
        return { message: 'Company deleted successfully', id };
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], CompaniesService);


/***/ }),

/***/ "./src/companies/dto/create-company.dto.ts":
/*!*************************************************!*\
  !*** ./src/companies/dto/create-company.dto.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FilterCompaniesDto = exports.UpdateCompanyDto = exports.CreateCompanyDto = exports.CompanyStatusEnum = exports.CompanyTypeEnum = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
var CompanyTypeEnum;
(function (CompanyTypeEnum) {
    CompanyTypeEnum["DEVELOPER"] = "developer";
    CompanyTypeEnum["REALTOR"] = "realtor";
    CompanyTypeEnum["PARTNER"] = "partner";
    CompanyTypeEnum["CONSULTANT"] = "consultant";
    CompanyTypeEnum["INVESTOR"] = "investor";
})(CompanyTypeEnum || (exports.CompanyTypeEnum = CompanyTypeEnum = {}));
var CompanyStatusEnum;
(function (CompanyStatusEnum) {
    CompanyStatusEnum["ACTIVE"] = "active";
    CompanyStatusEnum["PENDING"] = "pending";
    CompanyStatusEnum["INACTIVE"] = "inactive";
    CompanyStatusEnum["SUSPENDED"] = "suspended";
})(CompanyStatusEnum || (exports.CompanyStatusEnum = CompanyStatusEnum = {}));
class CreateCompanyDto {
}
exports.CreateCompanyDto = CreateCompanyDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Company name is required' }),
    (0, class_validator_1.MinLength)(2, { message: 'Company name must be at least 2 characters' }),
    (0, class_validator_1.MaxLength)(200, { message: 'Company name must not exceed 200 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(CompanyTypeEnum, {
        message: 'Company type must be one of: developer, realtor, partner, consultant, investor'
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Company type is required' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, { message: 'Registration number must not exceed 50 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "registrationNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(CompanyStatusEnum, {
        message: 'Status must be one of: active, inactive, suspended'
    }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Contact person name is required' }),
    (0, class_validator_1.MinLength)(2, { message: 'Contact person name must be at least 2 characters' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Contact person name must not exceed 100 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "contactPerson", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value?.trim().toLowerCase()),
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Phone number is required' }),
    (0, class_validator_1.Matches)(/^[+]?[\d\s()-]+$/, {
        message: 'Please provide a valid phone number (digits, spaces, +, -, () allowed)'
    }),
    (0, class_validator_1.MinLength)(10, { message: 'Phone number must be at least 10 characters' }),
    (0, class_validator_1.MaxLength)(20, { message: 'Phone number must not exceed 20 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Address must not exceed 500 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'Agreement start date must be a valid date (YYYY-MM-DD)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Agreement start date is required' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "agreementStartDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'Agreement expiry date must be a valid date (YYYY-MM-DD)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Agreement expiry date is required' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "agreementExpiryDate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Commission rate must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Commission rate cannot be negative' }),
    (0, class_validator_1.Max)(100, { message: 'Commission rate cannot exceed 100' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Commission rate is required' }),
    __metadata("design:type", Number)
], CreateCompanyDto.prototype, "commissionRate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Payment terms must not exceed 500 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "paymentTerms", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100, { message: 'Account name must not exceed 100 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "accountName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100, { message: 'Bank name must not exceed 100 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "bankName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[\d]+$/, { message: 'Account number must contain only digits' }),
    (0, class_validator_1.MinLength)(10, { message: 'Account number must be at least 10 digits' }),
    (0, class_validator_1.MaxLength)(20, { message: 'Account number must not exceed 20 digits' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "accountNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000, { message: 'Notes must not exceed 1000 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "notes", void 0);
class UpdateCompanyDto {
}
exports.UpdateCompanyDto = UpdateCompanyDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(CompanyTypeEnum, {
        message: 'Company type must be one of: developer, realtor, partner, consultant, investor'
    }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "registrationNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(CompanyStatusEnum, {
        message: 'Status must be one of: active, inactive, suspended'
    }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "contactPerson", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim().toLowerCase()),
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[+]?[\d\s()-]+$/, { message: 'Please provide a valid phone number' }),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "agreementStartDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "agreementExpiryDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateCompanyDto.prototype, "commissionRate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "paymentTerms", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "accountName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "bankName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[\d]+$/),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "accountNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "notes", void 0);
class FilterCompaniesDto {
}
exports.FilterCompaniesDto = FilterCompaniesDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(CompanyTypeEnum),
    __metadata("design:type", String)
], FilterCompaniesDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(CompanyStatusEnum),
    __metadata("design:type", String)
], FilterCompaniesDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterCompaniesDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterCompaniesDto.prototype, "sortBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['asc', 'desc']),
    __metadata("design:type", String)
], FilterCompaniesDto.prototype, "sortOrder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FilterCompaniesDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], FilterCompaniesDto.prototype, "limit", void 0);


/***/ }),

/***/ "./src/dashboard/dashboard.controller.ts":
/*!***********************************************!*\
  !*** ./src/dashboard/dashboard.controller.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const dashboard_service_1 = __webpack_require__(/*! ./dashboard.service */ "./src/dashboard/dashboard.service.ts");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    getOverview() {
        return this.dashboardService.getOverview();
    }
    getRecentTransactions() {
        return this.dashboardService.getRecentTransactions();
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getOverview", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('recent-transactions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getRecentTransactions", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [typeof (_a = typeof dashboard_service_1.DashboardService !== "undefined" && dashboard_service_1.DashboardService) === "function" ? _a : Object])
], DashboardController);


/***/ }),

/***/ "./src/dashboard/dashboard.module.ts":
/*!*******************************************!*\
  !*** ./src/dashboard/dashboard.module.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const dashboard_service_1 = __webpack_require__(/*! ./dashboard.service */ "./src/dashboard/dashboard.service.ts");
const dashboard_controller_1 = __webpack_require__(/*! ./dashboard.controller */ "./src/dashboard/dashboard.controller.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [dashboard_service_1.DashboardService],
        controllers: [dashboard_controller_1.DashboardController],
    })
], DashboardModule);


/***/ }),

/***/ "./src/dashboard/dashboard.service.ts":
/*!********************************************!*\
  !*** ./src/dashboard/dashboard.service.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOverview() {
        const [totalAgents, activeClusters, totalRevenue, totalCommissions, activeAssets, assetTypeCounts, salesVolume,] = await Promise.all([
            this.prisma.user.count({ where: { role: 'AGENT' } }),
            this.prisma.cluster.count({ where: { status: 'active' } }),
            this.prisma.transaction.aggregate({
                where: { status: 'COMPLETED' },
                _sum: { totalAmount: true },
            }),
            this.prisma.transaction.aggregate({
                where: { status: 'COMPLETED' },
                _sum: { totalCommission: true },
            }),
            this.prisma.asset.count({ where: { status: 'published' } }),
            this.prisma.asset.groupBy({
                by: ['type'],
                _count: { type: true },
                where: { type: { not: null } },
            }),
            this.prisma.$queryRawUnsafe(`
        SELECT 
          TO_CHAR("createdAt", 'YYYY-MM') AS month,
          COUNT(*) AS sales,
          SUM("totalAmount") AS revenue
        FROM "Transaction"
        WHERE status = 'COMPLETED'
        GROUP BY month
        ORDER BY month
        LIMIT 12
      `),
        ]);
        function calcChange(current, previous) {
            if (previous === undefined || previous === null)
                return 'N/A';
            if (previous === 0)
                return current > 0 ? '+100.0%' : '0.0%';
            const change = ((current - previous) / previous) * 100;
            return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
        }
        const prevAgents = 0;
        const prevClusters = 0;
        const prevRevenue = 0;
        const prevCommissions = 0;
        const kpis = [
            {
                title: "Total Agents",
                value: totalAgents,
                icon: "building",
                trend: "up",
                change: calcChange(totalAgents, prevAgents),
            },
            {
                title: "Active Clusters",
                value: activeClusters,
                icon: "trendingUp",
                trend: "up",
                change: calcChange(activeClusters, prevClusters),
            },
            {
                title: "Total Revenue",
                value: `₦${(totalRevenue._sum.totalAmount || 0).toLocaleString()}`,
                icon: "dollarSign",
                trend: "up",
                change: calcChange(Number(totalRevenue._sum.totalAmount || 0), prevRevenue),
            },
            {
                title: "Total Commissions",
                value: `₦${(totalCommissions._sum.totalCommission || 0).toLocaleString()}`,
                icon: "receipt",
                trend: "up",
                change: calcChange(Number(totalCommissions._sum.totalCommission || 0), prevCommissions),
            },
        ];
        const colors = ["#4c51bf", "#10b981", "#f59e42", "#e53e3e", "#6b7280"];
        const assetDistribution = assetTypeCounts.map((item, idx) => ({
            name: item.type || "Other",
            value: item._count.type,
            color: colors[idx % colors.length],
        }));
        const salesVolumeData = salesVolume.map((row) => ({
            month: row.month,
            sales: Number(row.sales),
            revenue: Number(row.revenue) / 1000,
        }));
        return {
            kpis,
            assetDistribution,
            salesVolume: salesVolumeData,
        };
    }
    async getRecentTransactions() {
        return this.prisma.transaction.findMany({
            take: 10,
            orderBy: { date: 'desc' },
            include: {
                asset: { select: { id: true, name: true, type: true } },
                buyer: { select: { id: true, name: true } },
                company: { select: { id: true, name: true } },
                leadAgent: { include: { user: { select: { id: true, name: true } } } },
                closerAgent: { include: { user: { select: { id: true, name: true } } } },
            },
        });
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], DashboardService);


/***/ }),

/***/ "./src/freelancers/freelancers.controller.ts":
/*!***************************************************!*\
  !*** ./src/freelancers/freelancers.controller.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FreelancersController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const freelancers_service_1 = __webpack_require__(/*! ./freelancers.service */ "./src/freelancers/freelancers.service.ts");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class CreateFreelancerDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFreelancerDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateFreelancerDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFreelancerDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFreelancerDto.prototype, "registeredBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFreelancerDto.prototype, "registrarName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFreelancerDto.prototype, "registrarType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFreelancerDto.prototype, "cluster", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFreelancerDto.prototype, "status", void 0);
let FreelancersController = class FreelancersController {
    constructor(freelancersService) {
        this.freelancersService = freelancersService;
    }
    async findAll() {
        return this.freelancersService.findAll();
    }
    async getStats() {
        return this.freelancersService.getStats();
    }
    async getByRegistrar(registrarId) {
        return this.freelancersService.getFreelancersByRegistrar(registrarId);
    }
    async findOne(id) {
        return this.freelancersService.findById(id);
    }
    async create(dto) {
        return this.freelancersService.create(dto);
    }
    async update(id, dto) {
        return this.freelancersService.update(id, dto);
    }
    async remove(id) {
        return this.freelancersService.delete(id);
    }
};
exports.FreelancersController = FreelancersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)("by-registrar/:registrarId"),
    __param(0, (0, common_1.Param)("registrarId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "getByRegistrar", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateFreelancerDto]),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof Partial !== "undefined" && Partial) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "remove", null);
exports.FreelancersController = FreelancersController = __decorate([
    (0, common_1.Controller)("freelancers"),
    __metadata("design:paramtypes", [typeof (_a = typeof freelancers_service_1.FreelancersService !== "undefined" && freelancers_service_1.FreelancersService) === "function" ? _a : Object])
], FreelancersController);


/***/ }),

/***/ "./src/freelancers/freelancers.module.ts":
/*!***********************************************!*\
  !*** ./src/freelancers/freelancers.module.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FreelancersModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const freelancers_controller_1 = __webpack_require__(/*! ./freelancers.controller */ "./src/freelancers/freelancers.controller.ts");
const freelancers_service_1 = __webpack_require__(/*! ./freelancers.service */ "./src/freelancers/freelancers.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let FreelancersModule = class FreelancersModule {
};
exports.FreelancersModule = FreelancersModule;
exports.FreelancersModule = FreelancersModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [freelancers_controller_1.FreelancersController],
        providers: [freelancers_service_1.FreelancersService],
        exports: [freelancers_service_1.FreelancersService],
    })
], FreelancersModule);


/***/ }),

/***/ "./src/freelancers/freelancers.service.ts":
/*!************************************************!*\
  !*** ./src/freelancers/freelancers.service.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FreelancersService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const bcrypt = __importStar(__webpack_require__(/*! bcrypt */ "bcrypt"));
const serial_id_helper_1 = __webpack_require__(/*! ../common/serial-id.helper */ "./src/common/serial-id.helper.ts");
let FreelancersService = class FreelancersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const freelancers = await this.prisma.freelancer.findMany({
            include: {
                user: { select: { id: true, email: true, name: true } },
                cluster: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return freelancers.map(freelancer => ({
            id: freelancer.id,
            serialId: freelancer.serialId ?? "",
            name: freelancer.user?.name ?? "",
            email: freelancer.user?.email ?? "",
            registeredBy: freelancer.registeredBy ?? "",
            registrarName: freelancer.registrarName ?? "",
            registrarType: freelancer.registrarType ?? "",
            cluster: freelancer.cluster?.name ?? "",
            clusterId: freelancer.cluster?.id ?? "",
            activeDeals: freelancer.activeDeals ?? 0,
            closedDeals: freelancer.closedDeals ?? 0,
            totalCommission: freelancer.totalCommission ?? 0,
            performance: freelancer.closedDeals > 0 ? Math.min(100, Math.round((freelancer.closedDeals / 10) * 100)) : 0,
            status: freelancer.status?.toLowerCase() ?? "pending",
        }));
    }
    async findById(id) {
        const freelancer = await this.prisma.freelancer.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, email: true, name: true } },
                cluster: true,
            },
        });
        if (!freelancer)
            throw new common_1.NotFoundException(`Freelancer with ID ${id} not found`);
        return freelancer;
    }
    async create(data) {
        let user = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (user) {
            const existing = await this.prisma.freelancer.findUnique({ where: { userId: user.id } });
            if (existing)
                throw new common_1.ConflictException('User is already registered as a freelancer');
        }
        else {
            const hashedPassword = await bcrypt.hash('password123', 10);
            const userSerialId = await (0, serial_id_helper_1.generateSerialId)(this.prisma, 'USR');
            user = await this.prisma.user.create({
                data: { serialId: userSerialId, email: data.email, password: hashedPassword, name: data.name, role: 'FREELANCER' },
            });
        }
        const freelancerSerialId = await (0, serial_id_helper_1.generateSerialId)(this.prisma, 'FRL');
        return this.prisma.freelancer.create({
            data: {
                serialId: freelancerSerialId,
                userId: user.id,
                clusterId: data.cluster || null,
                status: data.status ? data.status.toUpperCase() : 'PENDING',
                registeredBy: data.registeredBy || null,
                registrarName: data.registrarName || null,
                registrarType: data.registrarType || null,
                activeDeals: 0,
                closedDeals: 0,
                totalCommission: 0,
            },
            include: {
                user: { select: { id: true, email: true, name: true } },
                cluster: { select: { id: true, name: true } },
            },
        });
    }
    async update(id, data) {
        const freelancer = await this.findById(id);
        if (data.name || data.email) {
            await this.prisma.user.update({
                where: { id: freelancer.userId },
                data: {
                    ...(data.name ? { name: data.name } : {}),
                    ...(data.email ? { email: data.email } : {}),
                },
            });
        }
        const updateData = {};
        if (data.cluster)
            updateData.clusterId = data.cluster;
        if (data.status)
            updateData.status = data.status.toUpperCase();
        if (data.registeredBy !== undefined)
            updateData.registeredBy = data.registeredBy;
        if (data.registrarName !== undefined)
            updateData.registrarName = data.registrarName;
        if (data.registrarType !== undefined)
            updateData.registrarType = data.registrarType;
        return this.prisma.freelancer.update({
            where: { id },
            data: updateData,
            include: {
                user: { select: { id: true, email: true, name: true } },
                cluster: { select: { id: true, name: true } },
            },
        });
    }
    async delete(id) {
        await this.findById(id);
        await this.prisma.freelancer.delete({ where: { id } });
        return { message: 'Freelancer deleted successfully', id };
    }
    async getStats() {
        const [total, active, agg] = await Promise.all([
            this.prisma.freelancer.count(),
            this.prisma.freelancer.count({ where: { status: 'ACTIVE' } }),
            this.prisma.freelancer.aggregate({
                _sum: { totalCommission: true, activeDeals: true, closedDeals: true },
            }),
        ]);
        return {
            totalFreelancers: total,
            activeFreelancers: active,
            totalActiveDeals: agg._sum.activeDeals || 0,
            totalClosedDeals: agg._sum.closedDeals || 0,
            totalCommission: agg._sum.totalCommission || 0,
        };
    }
    async getFreelancersByRegistrar(registrarId) {
        return this.prisma.freelancer.findMany({
            where: { registeredBy: registrarId },
            include: {
                user: { select: { id: true, name: true, email: true } },
                cluster: { select: { id: true, name: true } },
            },
        });
    }
};
exports.FreelancersService = FreelancersService;
exports.FreelancersService = FreelancersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], FreelancersService);


/***/ }),

/***/ "./src/installments/installments.controller.ts":
/*!*****************************************************!*\
  !*** ./src/installments/installments.controller.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InstallmentsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const installments_service_1 = __webpack_require__(/*! ./installments.service */ "./src/installments/installments.service.ts");
class CreateInstallmentPlanDto {
}
class SendReminderDto {
}
let InstallmentsController = class InstallmentsController {
    constructor(installmentsService) {
        this.installmentsService = installmentsService;
    }
    async findAll(status) {
        return this.installmentsService.findAll({ status });
    }
    async getStats() {
        return this.installmentsService.getStats();
    }
    async findOne(id) {
        return this.installmentsService.findById(id);
    }
    async getSchedule(id) {
        return this.installmentsService.getInstallmentSchedule(id);
    }
    async create(dto) {
        return this.installmentsService.create(dto);
    }
    async sendReminder(dto) {
        return this.installmentsService.sendPaymentReminder(dto);
    }
    async recordPayment(id, installmentId, body) {
        return this.installmentsService.recordPayment(id, installmentId, body);
    }
    async getUpcoming() {
        return this.installmentsService.findAll({ status: "upcoming" });
    }
    async getOverdue() {
        return this.installmentsService.findAll({ status: "overdue" });
    }
};
exports.InstallmentsController = InstallmentsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(":id/schedule"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "getSchedule", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateInstallmentPlanDto]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("reminders/send"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SendReminderDto]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "sendReminder", null);
__decorate([
    (0, common_1.Put)(":id/installments/:installmentId/pay"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Param)("installmentId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "recordPayment", null);
__decorate([
    (0, common_1.Get)("upcoming"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "getUpcoming", null);
__decorate([
    (0, common_1.Get)("overdue"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "getOverdue", null);
exports.InstallmentsController = InstallmentsController = __decorate([
    (0, common_1.Controller)("installments"),
    __metadata("design:paramtypes", [typeof (_a = typeof installments_service_1.InstallmentsService !== "undefined" && installments_service_1.InstallmentsService) === "function" ? _a : Object])
], InstallmentsController);


/***/ }),

/***/ "./src/installments/installments.module.ts":
/*!*************************************************!*\
  !*** ./src/installments/installments.module.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InstallmentsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const installments_controller_1 = __webpack_require__(/*! ./installments.controller */ "./src/installments/installments.controller.ts");
const installments_service_1 = __webpack_require__(/*! ./installments.service */ "./src/installments/installments.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
const notification_module_1 = __webpack_require__(/*! ../notification/notification.module */ "./src/notification/notification.module.ts");
let InstallmentsModule = class InstallmentsModule {
};
exports.InstallmentsModule = InstallmentsModule;
exports.InstallmentsModule = InstallmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, notification_module_1.NotificationModule],
        controllers: [installments_controller_1.InstallmentsController],
        providers: [installments_service_1.InstallmentsService],
        exports: [installments_service_1.InstallmentsService],
    })
], InstallmentsModule);


/***/ }),

/***/ "./src/installments/installments.service.ts":
/*!**************************************************!*\
  !*** ./src/installments/installments.service.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InstallmentsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const notification_service_1 = __webpack_require__(/*! ../notification/notification.service */ "./src/notification/notification.service.ts");
const serial_id_helper_1 = __webpack_require__(/*! ../common/serial-id.helper */ "./src/common/serial-id.helper.ts");
let InstallmentsService = class InstallmentsService {
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async findAll(filters) {
        const where = {};
        if (filters?.status && filters.status !== 'all') {
            where.status = filters.status.toUpperCase();
        }
        const plans = await this.prisma.installmentPlan.findMany({
            where,
            include: {
                asset: { select: { name: true } },
                company: { select: { name: true } },
                leadAgent: { include: { user: { select: { name: true } } } },
                closerAgent: { include: { user: { select: { name: true } } } },
                installments: { orderBy: { dueDate: 'asc' } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return plans.map(plan => ({
            id: plan.id,
            serialId: plan.serialId ?? "",
            asset: plan.asset?.name ?? "",
            buyer: plan.buyerName ?? "",
            buyerEmail: plan.buyerEmail ?? "",
            buyerPhone: plan.buyerPhone ?? "",
            totalAmount: plan.totalAmount,
            downPayment: plan.downPayment,
            paidAmount: plan.paidAmount,
            remainingBalance: plan.remainingBalance,
            numberOfInstallments: plan.numberOfInstallments,
            completedInstallments: plan.completedInstallments,
            installmentAmount: plan.installmentAmount,
            frequency: plan.frequency,
            startDate: plan.startDate?.toISOString().split("T")[0] ?? "",
            nextDueDate: plan.nextDueDate?.toISOString().split("T")[0] ?? "",
            status: plan.status?.toLowerCase(),
            company: plan.company?.name ?? "",
            leadAgent: plan.leadAgent?.user?.name ?? "",
            closerAgent: plan.closerAgent?.user?.name ?? "",
            installments: plan.installments.map(inst => ({
                id: inst.id,
                serialId: inst.serialId ?? "",
                dueDate: inst.dueDate?.toISOString().split("T")[0] ?? "",
                amount: inst.amount,
                paidAmount: inst.paidAmount,
                status: inst.status?.toLowerCase(),
                paidDate: inst.paidDate ? inst.paidDate.toISOString().split("T")[0] : null,
                paymentMethod: inst.paymentMethod ?? "",
            })),
        }));
    }
    async create(dto) {
        const serialId = await (0, serial_id_helper_1.generateSerialId)(this.prisma, 'IPL');
        return this.prisma.installmentPlan.create({
            data: {
                ...dto,
                serialId,
                companyId: dto.companyId,
                remainingBalance: dto.totalAmount - (dto.downPayment || 0),
                paidAmount: 0,
                installmentAmount: dto.totalAmount / dto.numberOfInstallments,
            },
        });
    }
    async findById(id) {
        const plan = await this.prisma.installmentPlan.findUnique({
            where: { id },
            include: {
                asset: true,
                leadAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                closerAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                installments: {
                    orderBy: {
                        dueDate: "asc",
                    },
                },
            },
        });
        if (!plan) {
            throw new common_1.NotFoundException(`Installment plan with ID ${id} not found`);
        }
        return plan;
    }
    async getInstallmentSchedule(planId) {
        const plan = await this.findById(planId);
        return plan.installments;
    }
    async recordPayment(planId, installmentId, data) {
        const plan = await this.findById(planId);
        const installment = await this.prisma.installment.findUnique({
            where: { id: installmentId },
        });
        if (!installment) {
            throw new common_1.NotFoundException(`Installment with ID ${installmentId} not found`);
        }
        const updatedInstallment = await this.prisma.installment.update({
            where: { id: installmentId },
            data: {
                paidAmount: installment.paidAmount + data.amount,
                status: installment.paidAmount + data.amount >= installment.amount ? "PAID" : "PARTIAL",
                paidDate: new Date(),
                paymentMethod: data.paymentMethod,
            },
        });
        const newPaidAmount = plan.paidAmount + data.amount;
        const completedInstallments = await this.prisma.installment.count({
            where: {
                installmentPlanId: planId,
                status: "PAID",
            },
        });
        const nextInstallment = await this.prisma.installment.findFirst({
            where: {
                installmentPlanId: planId,
                status: { in: ["PENDING", "UPCOMING", "OVERDUE"] },
            },
            orderBy: {
                dueDate: "asc",
            },
        });
        const isCompleted = newPaidAmount >= plan.remainingBalance;
        await this.prisma.installmentPlan.update({
            where: { id: planId },
            data: {
                paidAmount: newPaidAmount,
                completedInstallments,
                nextDueDate: nextInstallment?.dueDate || null,
                status: isCompleted ? "COMPLETED" : "ACTIVE",
            },
        });
        await this.notificationService.notifyInstallmentPaymentRecorded({
            planId,
            installmentId,
            paidAmount: data.amount,
            paymentMethod: data.paymentMethod,
            buyerName: plan.buyerName,
            assetName: plan.asset?.name,
        });
        return updatedInstallment;
    }
    async sendPaymentReminder(data) {
        const installment = await this.prisma.installment.findUnique({
            where: { id: data.installmentId },
            include: {
                installmentPlan: {
                    include: {
                        asset: { select: { name: true } },
                        leadAgent: { include: { user: { select: { name: true, email: true } } } },
                    },
                },
            },
        });
        if (!installment) {
            throw new common_1.NotFoundException(`Installment with ID ${data.installmentId} not found`);
        }
        const agentEmail = installment.installmentPlan?.leadAgent?.user?.email || 'unknown';
        console.log(`Sending ${data.method} reminder for asset "${installment.installmentPlan?.asset?.name}" to agent ${agentEmail}`);
        return {
            message: "Reminder sent successfully",
            installmentId: data.installmentId,
            method: data.method,
            sentAt: new Date(),
        };
    }
    async getStats() {
        const [activePlans, completedPlans, totalOutstanding, totalCollected, overduePayments,] = await Promise.all([
            this.prisma.installmentPlan.count({ where: { status: "ACTIVE" } }),
            this.prisma.installmentPlan.count({ where: { status: "COMPLETED" } }),
            this.prisma.installmentPlan.aggregate({
                where: { status: "ACTIVE" },
                _sum: {
                    remainingBalance: true,
                    paidAmount: true,
                },
            }),
            this.prisma.installmentPlan.aggregate({
                _sum: {
                    paidAmount: true,
                },
            }),
            this.prisma.installment.count({
                where: { status: "OVERDUE" },
            }),
        ]);
        const outstanding = (totalOutstanding._sum.remainingBalance || 0) -
            (totalOutstanding._sum.paidAmount || 0);
        return {
            activePlans,
            completedPlans,
            totalOutstanding: outstanding,
            totalCollected: totalCollected._sum.paidAmount || 0,
            overduePayments,
        };
    }
    async updateInstallmentStatuses() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        await this.prisma.installment.updateMany({
            where: {
                dueDate: { lt: today },
                status: { in: ["PENDING", "UPCOMING"] },
            },
            data: {
                status: "OVERDUE",
            },
        });
        const weekFromNow = new Date(today);
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        await this.prisma.installment.updateMany({
            where: {
                dueDate: { lte: weekFromNow, gte: today },
                status: "UPCOMING",
            },
            data: {
                status: "PENDING",
            },
        });
    }
    async generateInstallmentSchedule(planId, data) {
        const installments = [];
        const { numberOfInstallments, installmentAmount, frequency, startDate } = data;
        for (let i = 0; i < numberOfInstallments; i++) {
            const dueDate = this.calculateDueDate(startDate, frequency, i);
            installments.push({
                installmentPlanId: planId,
                dueDate,
                amount: installmentAmount,
                paidAmount: 0,
                status: i === 0 ? "PENDING" : "UPCOMING",
            });
        }
        await this.prisma.installment.createMany({
            data: installments,
        });
    }
    calculateDueDate(startDate, frequency, index) {
        const dueDate = new Date(startDate);
        switch (frequency.toLowerCase()) {
            case "weekly":
                dueDate.setDate(dueDate.getDate() + (index * 7));
                break;
            case "bi-weekly":
                dueDate.setDate(dueDate.getDate() + (index * 14));
                break;
            case "monthly":
                dueDate.setMonth(dueDate.getMonth() + index);
                break;
            case "quarterly":
                dueDate.setMonth(dueDate.getMonth() + (index * 3));
                break;
            default:
                dueDate.setMonth(dueDate.getMonth() + index);
        }
        return dueDate;
    }
};
exports.InstallmentsService = InstallmentsService;
exports.InstallmentsService = InstallmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _b : Object])
], InstallmentsService);


/***/ }),

/***/ "./src/investments/investments.controller.ts":
/*!***************************************************!*\
  !*** ./src/investments/investments.controller.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvestmentsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const investments_service_1 = __webpack_require__(/*! ./investments.service */ "./src/investments/investments.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/jwt-auth.guard */ "./src/auth/jwt-auth.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../common/roles.decorator */ "./src/common/roles.decorator.ts");
const roles_guard_1 = __webpack_require__(/*! ../common/roles.guard */ "./src/common/roles.guard.ts");
let InvestmentsController = class InvestmentsController {
    constructor(svc) {
        this.svc = svc;
    }
    async myInvestments(req) {
        if (!req.user?.id) {
            throw new common_1.UnauthorizedException('Missing or invalid auth token.');
        }
        return this.svc.findByUser(req.user.id);
    }
    async summary(req) {
        if (!req.user?.id) {
            throw new common_1.UnauthorizedException('Missing or invalid auth token.');
        }
        return this.svc.getInvestmentSummary(req.user.id);
    }
    async all() {
        return this.svc.findAll();
    }
};
exports.InvestmentsController = InvestmentsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvestmentsController.prototype, "myInvestments", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvestmentsController.prototype, "summary", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvestmentsController.prototype, "all", null);
exports.InvestmentsController = InvestmentsController = __decorate([
    (0, common_1.Controller)('investments'),
    __metadata("design:paramtypes", [typeof (_a = typeof investments_service_1.InvestmentsService !== "undefined" && investments_service_1.InvestmentsService) === "function" ? _a : Object])
], InvestmentsController);


/***/ }),

/***/ "./src/investments/investments.module.ts":
/*!***********************************************!*\
  !*** ./src/investments/investments.module.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvestmentsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const investments_controller_1 = __webpack_require__(/*! ./investments.controller */ "./src/investments/investments.controller.ts");
const investments_service_1 = __webpack_require__(/*! ./investments.service */ "./src/investments/investments.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let InvestmentsModule = class InvestmentsModule {
};
exports.InvestmentsModule = InvestmentsModule;
exports.InvestmentsModule = InvestmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [investments_controller_1.InvestmentsController],
        providers: [investments_service_1.InvestmentsService],
    })
], InvestmentsModule);


/***/ }),

/***/ "./src/investments/investments.service.ts":
/*!************************************************!*\
  !*** ./src/investments/investments.service.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvestmentsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
let InvestmentsService = class InvestmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByUser(userId) {
        try {
            return this.prisma.transaction.findMany({
                where: { buyerId: userId },
                include: {
                    asset: { select: { id: true, name: true, type: true, location: true, images: true } },
                    company: { select: { id: true, name: true } },
                    installments: { orderBy: { dueDate: 'asc' } },
                    installmentPlans: true,
                },
                orderBy: { date: 'desc' },
            });
        }
        catch (error) {
            return this.prisma.transaction.findMany({
                where: { buyerId: userId },
                include: {
                    asset: { select: { id: true, name: true, type: true, location: true, images: true } },
                    company: { select: { id: true, name: true } },
                },
                orderBy: { date: 'desc' },
            });
        }
    }
    async findAll() {
        return this.prisma.transaction.findMany({
            include: {
                asset: { select: { id: true, name: true, type: true } },
                buyer: { select: { id: true, name: true, email: true } },
                company: { select: { id: true, name: true } },
            },
            orderBy: { date: 'desc' },
        });
    }
    async getInvestmentSummary(userId) {
        const agg = await this.prisma.transaction.aggregate({
            where: { buyerId: userId },
            _sum: { totalAmount: true },
            _count: true,
        });
        return {
            totalInvestments: agg._count,
            totalInvested: agg._sum.totalAmount || 0,
        };
    }
};
exports.InvestmentsService = InvestmentsService;
exports.InvestmentsService = InvestmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], InvestmentsService);


/***/ }),

/***/ "./src/leads/leads.controller.ts":
/*!***************************************!*\
  !*** ./src/leads/leads.controller.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LeadsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const platform_express_1 = __webpack_require__(/*! @nestjs/platform-express */ "@nestjs/platform-express");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const leads_service_1 = __webpack_require__(/*! ./leads.service */ "./src/leads/leads.service.ts");
class CreateLeadDto {
}
class AssignLeadsDto {
}
class AssignSingleLeadDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignSingleLeadDto.prototype, "assignedToId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignSingleLeadDto.prototype, "clusterId", void 0);
let LeadsController = class LeadsController {
    constructor(leadsService) {
        this.leadsService = leadsService;
    }
    async findAll(source, status) {
        return this.leadsService.findAll({ source, status });
    }
    async getStats() {
        return this.leadsService.getStats();
    }
    async findOne(id) {
        return this.leadsService.findById(id);
    }
    async create(dto, req) {
        const createdById = req?.user?.id;
        return this.leadsService.create(dto, createdById);
    }
    async assignLeads(dto) {
        return this.leadsService.assignLeads(dto);
    }
    async assignSingleLead(id, dto) {
        return this.leadsService.assignSingleLead(id, dto);
    }
    async bulkImport(file, req) {
        const createdById = req?.user?.id;
        return this.leadsService.bulkImport(file, createdById);
    }
    async updateLeadStatus(id, body) {
        return this.leadsService.updateLeadStatus(id, body.status);
    }
    async update(id, dto) {
        return this.leadsService.update(id, dto);
    }
};
exports.LeadsController = LeadsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("source")),
    __param(1, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateLeadDto, Object]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("assign"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AssignLeadsDto]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "assignLeads", null);
__decorate([
    (0, common_1.Post)(":id/assign"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AssignSingleLeadDto]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "assignSingleLead", null);
__decorate([
    (0, common_1.Post)("bulk-import"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof Express !== "undefined" && (_b = Express.Multer) !== void 0 && _b.File) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "bulkImport", null);
__decorate([
    (0, common_1.Put)(":id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "updateLeadStatus", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof Partial !== "undefined" && Partial) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "update", null);
exports.LeadsController = LeadsController = __decorate([
    (0, common_1.Controller)("leads"),
    __metadata("design:paramtypes", [typeof (_a = typeof leads_service_1.LeadsService !== "undefined" && leads_service_1.LeadsService) === "function" ? _a : Object])
], LeadsController);


/***/ }),

/***/ "./src/leads/leads.module.ts":
/*!***********************************!*\
  !*** ./src/leads/leads.module.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LeadsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const leads_controller_1 = __webpack_require__(/*! ./leads.controller */ "./src/leads/leads.controller.ts");
const leads_service_1 = __webpack_require__(/*! ./leads.service */ "./src/leads/leads.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
const notification_module_1 = __webpack_require__(/*! ../notification/notification.module */ "./src/notification/notification.module.ts");
let LeadsModule = class LeadsModule {
};
exports.LeadsModule = LeadsModule;
exports.LeadsModule = LeadsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, notification_module_1.NotificationModule],
        controllers: [leads_controller_1.LeadsController],
        providers: [leads_service_1.LeadsService],
        exports: [leads_service_1.LeadsService],
    })
], LeadsModule);


/***/ }),

/***/ "./src/leads/leads.service.ts":
/*!************************************!*\
  !*** ./src/leads/leads.service.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LeadsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const notification_service_1 = __webpack_require__(/*! ../notification/notification.service */ "./src/notification/notification.service.ts");
const serial_id_helper_1 = __webpack_require__(/*! ../common/serial-id.helper */ "./src/common/serial-id.helper.ts");
const ExcelJS = __importStar(__webpack_require__(/*! exceljs */ "exceljs"));
let LeadsService = class LeadsService {
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async assignLeads(dto) {
        if (dto.assignmentType === 'all') {
            await this.prisma.lead.updateMany({
                where: { id: { in: dto.leadIds } },
                data: { status: 'available', assignedCluster: null, assignedToId: null },
            });
            await this.notificationService.notifyLeadAvailableToAll(dto.leadIds);
        }
        else if (dto.assignmentType === 'cluster' && dto.clusterId) {
            await this.prisma.lead.updateMany({
                where: { id: { in: dto.leadIds } },
                data: { status: 'assigned', assignedCluster: dto.clusterId },
            });
            await this.notificationService.notifyLeadAssignedToCluster(dto.leadIds, dto.clusterId);
        }
        else {
            throw new common_1.BadRequestException('Invalid assignment type or missing clusterId');
        }
        return { message: 'Leads assigned', ...dto };
    }
    async findAll(filters) {
        const where = {};
        if (filters?.status)
            where.status = filters.status;
        if (filters?.assetId)
            where.assetId = filters.assetId;
        if (filters?.assignedToId)
            where.assignedToId = filters.assignedToId;
        if (filters?.source)
            where.source = filters.source;
        return this.prisma.lead.findMany({
            where,
            include: {
                asset: { select: { id: true, name: true, type: true, location: true } },
                assignedTo: { include: { user: { select: { id: true, name: true } } } },
                createdBy: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        const lead = await this.prisma.lead.findUnique({
            where: { id },
            include: {
                asset: true,
                assignedTo: { include: { user: true, cluster: true } },
                createdBy: { select: { id: true, name: true, email: true } },
            },
        });
        if (!lead)
            throw new common_1.NotFoundException(`Lead with ID ${id} not found`);
        return lead;
    }
    async create(data, createdById) {
        if (!data.email)
            throw new common_1.BadRequestException('Email is required');
        const resolvedName = (data.name && data.name.trim()) || data.email.split('@')[0];
        const serialId = await (0, serial_id_helper_1.generateSerialId)(this.prisma, 'LED');
        const createdLead = await this.prisma.lead.create({
            data: {
                serialId,
                name: resolvedName,
                email: data.email,
                phone: data.phone || null,
                assetInterest: data.assetInterest || null,
                budget: data.budget ? parseFloat(data.budget) : null,
                source: data.source || null,
                leadSource: data.leadSource || "investor-app",
                location: data.location || null,
                notes: data.notes || null,
                status: data.status || "pending",
                assignedToId: data.assignedToId || null,
                assignedCluster: data.assignedCluster || null,
                createdById,
                dateReceived: data.dateReceived ? new Date(data.dateReceived) : new Date(),
            },
            include: {
                asset: { select: { id: true, name: true } },
                assignedTo: { include: { user: { select: { id: true, name: true } } } },
                createdBy: { select: { id: true, name: true } },
            },
        });
        const source = String(createdLead.leadSource || createdLead.source || '').toLowerCase();
        if (source.includes('investor')) {
            await this.notificationService.notifyNewLeadFromInvestor(createdLead.id);
        }
        return createdLead;
    }
    async update(id, data) {
        await this.findById(id);
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.email !== undefined)
            updateData.email = data.email;
        if (data.phone !== undefined)
            updateData.phone = data.phone;
        if (data.status !== undefined)
            updateData.status = data.status;
        if (data.budget !== undefined)
            updateData.budget = parseFloat(data.budget);
        if (data.source !== undefined)
            updateData.source = data.source;
        if (data.leadSource !== undefined)
            updateData.leadSource = data.leadSource;
        if (data.location !== undefined)
            updateData.location = data.location;
        if (data.notes !== undefined)
            updateData.notes = data.notes;
        if (data.assetInterest !== undefined)
            updateData.assetInterest = data.assetInterest;
        if (data.assignedToId !== undefined)
            updateData.assignedToId = data.assignedToId;
        if (data.assignedCluster !== undefined)
            updateData.assignedCluster = data.assignedCluster;
        return this.prisma.lead.update({
            where: { id },
            data: updateData,
            include: {
                asset: { select: { id: true, name: true } },
                assignedTo: { include: { user: { select: { id: true, name: true } } } },
            },
        });
    }
    async delete(id) {
        await this.findById(id);
        await this.prisma.lead.delete({ where: { id } });
        return { message: 'Lead deleted successfully', id };
    }
    async getStats() {
        const [total, byStatus] = await Promise.all([
            this.prisma.lead.count(),
            this.prisma.lead.groupBy({
                by: ['status'],
                _count: true,
            }),
        ]);
        return {
            total,
            byStatus: byStatus.map((s) => ({ status: s.status, count: s._count })),
        };
    }
    async assignSingleLead(leadId, dto) {
        if (!leadId)
            throw new common_1.BadRequestException('Missing leadId');
        const updateData = {};
        if (dto.assignedToId) {
            updateData.assignedToId = dto.assignedToId;
            updateData.status = 'assigned';
        }
        if (dto.clusterId) {
            updateData.assignedCluster = dto.clusterId;
            updateData.status = 'assigned';
        }
        if (!updateData.assignedToId && !updateData.assignedCluster) {
            throw new common_1.BadRequestException('Must provide assignedToId or clusterId');
        }
        const lead = await this.prisma.lead.update({
            where: { id: leadId },
            data: updateData,
        });
        if (dto.clusterId) {
            await this.notificationService.notifyLeadAssignedToCluster([leadId], dto.clusterId);
        }
        return { message: 'Lead assigned', lead };
    }
    async updateLeadStatus(id, status) {
        if (!id)
            throw new common_1.BadRequestException('Missing leadId');
        if (!status)
            throw new common_1.BadRequestException('Missing status');
        const lead = await this.prisma.lead.update({
            where: { id },
            data: { status },
        });
        return { message: 'Lead status updated', lead };
    }
    async bulkImport(file, createdById) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer);
        const worksheet = workbook.worksheets[0];
        if (!worksheet)
            throw new common_1.BadRequestException('Excel file contains no worksheets');
        const results = { created: 0, skipped: 0, errors: [] };
        const headerRow = worksheet.getRow(1);
        const headers = {};
        headerRow.eachCell((cell, colNumber) => {
            headers[colNumber] = String(cell.value || '').trim().toLowerCase();
        });
        const getCol = (row, names) => {
            for (const [colStr, header] of Object.entries(headers)) {
                if (names.some(n => header.includes(n))) {
                    const val = row.getCell(parseInt(colStr)).value;
                    return val ? String(val).trim() : '';
                }
            }
            return '';
        };
        for (let rowNum = 2; rowNum <= worksheet.rowCount; rowNum++) {
            const row = worksheet.getRow(rowNum);
            if (row.cellCount === 0)
                continue;
            const email = getCol(row, ['email']);
            if (!email) {
                results.skipped++;
                continue;
            }
            const name = getCol(row, ['name', 'full name']) || email.split('@')[0];
            const phone = getCol(row, ['phone', 'telephone', 'mobile']);
            const budget = getCol(row, ['budget']);
            const location = getCol(row, ['location', 'city', 'address']);
            const assetInterest = getCol(row, ['asset', 'interest', 'property']);
            const source = getCol(row, ['source']);
            const notes = getCol(row, ['notes', 'comment', 'remark']);
            try {
                await this.create({ name, email, phone, budget, location, assetInterest, source, leadSource: 'bulk-import', notes }, createdById || '');
                results.created++;
            }
            catch (err) {
                results.errors.push(`Row ${rowNum}: ${err?.message || 'Unknown error'}`);
                results.skipped++;
            }
        }
        return { message: `Bulk import complete`, ...results };
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _b : Object])
], LeadsService);


/***/ }),

/***/ "./src/notification/cron.service.ts":
/*!******************************************!*\
  !*** ./src/notification/cron.service.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CronService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const schedule_1 = __webpack_require__(/*! @nestjs/schedule */ "@nestjs/schedule");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const notification_service_1 = __webpack_require__(/*! ./notification.service */ "./src/notification/notification.service.ts");
let CronService = class CronService {
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async sendInstallmentReminders() {
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
        const upcomingInstallments = await this.prisma.installment.findMany({
            where: {
                dueDate: {
                    gte: new Date(),
                    lte: threeDaysFromNow,
                },
                status: 'PENDING',
            },
        });
        for (const installment of upcomingInstallments) {
            await this.notificationService.notifyInstallmentDue(installment.id);
        }
    }
    async sendOverdueNotifications() {
        const overdueInstallments = await this.prisma.installment.findMany({
            where: {
                dueDate: { lt: new Date() },
                status: 'PENDING',
            },
        });
        for (const installment of overdueInstallments) {
            await this.notificationService.notifyInstallmentOverdue(installment.id);
            await this.prisma.installment.update({
                where: { id: installment.id },
                data: { status: 'OVERDUE' },
            });
        }
    }
};
exports.CronService = CronService;
__decorate([
    (0, schedule_1.Cron)('0 9 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "sendInstallmentReminders", null);
__decorate([
    (0, schedule_1.Cron)('0 10 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "sendOverdueNotifications", null);
exports.CronService = CronService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _b : Object])
], CronService);


/***/ }),

/***/ "./src/notification/email-templates.ts":
/*!*********************************************!*\
  !*** ./src/notification/email-templates.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailTemplates = void 0;
exports.EmailTemplates = {
    PASSWORD_RESET: {
        subject: () => 'Reset Your BuyOps Password',
        body: (data, recipient) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset Your BuyOps Password</h2>
        <p>Dear ${recipient.name},</p>
        <p>You requested a password reset for your BuyOps account.</p>
        <p>Click the link below to create a new password:</p>
        <p>
          <a href="${data.resetLink}" 
             style="background-color: #4c51bf; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p>If you did not request this, please ignore this email.</p>
        <p>For security reasons, this link will expire shortly.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
    },
    NEW_DEVICE_LOGIN: {
        subject: () => 'New Login Detected on Your BuyOps Account',
        body: (data, recipient) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Login Detected</h2>
        <p>We noticed a successful login to your BuyOps account from a new device.</p>
        <p><strong>Device:</strong> ${data.device || 'Unknown'}<br/>
           <strong>Location:</strong> ${data.location || 'Unknown'}<br/>
           <strong>Time:</strong> ${data.timestamp || new Date().toLocaleString()}</p>
        <p>If this was you, no action is required.</p>
        <p>If you do not recognise this activity, please reset your password immediately or contact support.</p>
        <p>Your security matters to us.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
    },
    ASSET_PUBLISHED: {
        subject: (data) => 'Asset Successfully Published',
        body: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Asset Successfully Published</h2>
        <p>This is to confirm that a new asset has been published on BuyOps.</p>
        <p><strong>Asset Name:</strong> ${data.assetName}<br/>
           <strong>Company:</strong> ${data.companyName}</p>
        <p>The asset is now available according to its visibility and distribution settings.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
    },
    ASSET_UPDATED: {
        subject: () => 'Asset Information Updated',
        body: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Asset Information Updated</h2>
        <p>An asset on BuyOps has been updated.</p>
        <p><strong>Asset Name:</strong> ${data.assetName}<br/>
           <strong>Updated Fields:</strong> ${data.updatedFields}</p>
        <p>Please review the changes to ensure accuracy and alignment with current terms.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
    },
    NEW_LEAD_FROM_INVESTOR: {
        subject: () => 'New Lead Assigned to You',
        body: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Lead Assigned to You</h2>
        <p>A new lead has been onboarded and assigned to you.</p>
        <p><strong>Lead Name:</strong> ${data.leadName}<br/>
           <strong>Asset Interest:</strong> ${data.assetName}<br/>
           <strong>Budget:</strong> ₦${(data.budget || 0).toLocaleString()}</p>
        <p>Please follow up promptly to progress the opportunity.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
    },
    LEAD_ASSIGNED_TO_CLUSTER: {
        subject: () => 'Lead Assigned to Your Cluster',
        body: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Lead Assigned to Your Cluster</h2>
        <p>A lead has been assigned to your cluster.</p>
        <p><strong>Lead Name:</strong> ${data.leadName}<br/>
           <strong>Assigned Cluster:</strong> ${data.clusterName}</p>
        <p>Kindly coordinate follow-up with your team.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
    },
    LEAD_AVAILABLE_TO_ALL: {
        subject: () => 'New Lead Available',
        body: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Lead Available</h2>
        <p>A new lead has been made available to all clusters.</p>
        <p><strong>Lead Name:</strong> ${data.leadName}<br/>
           <strong>Asset Interest:</strong> ${data.assetName}</p>
        <p>Agents may engage based on availability and fit.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
    },
    DEAL_CREATED: {
        subject: () => 'New Deal Created',
        body: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Deal Created</h2>
        <p>A new deal has been created on BuyOps.</p>
        <p><strong>Deal ID:</strong> ${data.dealId}<br/>
           <strong>Agent:</strong> ${data.agentName}<br/>
           <strong>Asset:</strong> ${data.assetName}</p>
        <p>This notification is for administrative oversight.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
    },
    DEAL_PAYMENT_READY: {
        subject: () => 'Deal Ready for Payment Processing',
        body: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Deal Ready for Payment Processing</h2>
        <p>A deal has been marked as Payment Ready.</p>
        <p><strong>Deal ID:</strong> ${data.dealId}<br/>
           <strong>Amount:</strong> ₦${(data.amount || 0).toLocaleString()}<br/>
           <strong>Payment Type:</strong> ${data.paymentType}</p>
        <p>Please proceed with payment verification and processing.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
    },
    DEAL_CLOSED: {
        subject: () => 'Deal Successfully Closed',
        body: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Deal Successfully Closed</h2>
        <p>A deal has been successfully closed.</p>
        <p><strong>Deal ID:</strong> ${data.dealId}<br/>
           <strong>Asset:</strong> ${data.assetName}<br/>
           <strong>Commission Status:</strong> ${data.commissionStatus}</p>
        <p>This transaction will now reflect in reporting and commissions.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
    },
    INSTALLMENT_DUE: {
        subject: () => 'Upcoming Installment Payment Due',
        body: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Upcoming Installment Payment Due</h2>
        <p>This is a reminder that an installment payment is due.</p>
        <p><strong>Amount Due:</strong> ₦${(data.amount || 0).toLocaleString()}<br/>
           <strong>Due Date:</strong> ${new Date(data.dueDate).toLocaleDateString()}</p>
        <p>Please ensure payment is completed on or before the due date to avoid penalties.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
    },
    INSTALLMENT_OVERDUE: {
        subject: () => 'Overdue Installment Payment',
        body: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Overdue Installment Payment</h2>
        <p>Your installment payment is now overdue.</p>
        <p><strong>Amount:</strong> ₦${(data.amount || 0).toLocaleString()}<br/>
           <strong>Original Due Date:</strong> ${new Date(data.dueDate).toLocaleDateString()}</p>
        <p style="color: #e53e3e;">Please make payment as soon as possible or contact support if you need assistance.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
    },
    PAYMENT_RECEIVED: {
        subject: () => 'Payment Received Confirmation',
        body: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Payment Received Confirmation</h2>
        <p>We confirm receipt of your recent payment.</p>
        <p><strong>Amount:</strong> ₦${(data.amount || 0).toLocaleString()}<br/>
           <strong>Transaction Reference:</strong> ${data.reference}</p>
        <p>Thank you for your payment.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
    },
    INSTALLMENT_COMPLETED: {
        subject: () => 'Installment Plan Completed',
        body: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Installment Plan Completed</h2>
        <p>Congratulations! Your installment payment plan has been fully completed.</p>
        <p><strong>Asset:</strong> ${data.assetName}<br/>
           <strong>Total Paid:</strong> ₦${(data.totalPaid || 0).toLocaleString()}</p>
        <p>Thank you for completing your investment journey with BuyOps.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
    },
    AGENT_INVITATION: {
        subject: () => 'Welcome to BuyOps - Agent Invitation',
        body: (data, recipient) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to BuyOps!</h2>
        <p>Dear ${recipient.name},</p>
        <p>You have been invited to join BuyOps as a Sales Agent.</p>
        <p><strong>Login Credentials:</strong><br/>
           <strong>Email:</strong> ${recipient.email}<br/>
           <strong>Temporary Password:</strong> ${data.tempPassword}</p>
        <p>Please use the credentials above to log in to your account. We recommend changing your password immediately upon first login for security purposes.</p>
        <p>
          <a href="${data.loginLink}" 
             style="background-color: #4c51bf; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Log In to BuyOps
          </a>
        </p>
        <p>If you have any questions or need assistance, please contact our support team.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
    },
    EMAIL_VERIFICATION: {
        subject: () => 'Verify Your BuyOps Email Address',
        body: (data, recipient) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify Your Email Address</h2>
        <p>Dear ${recipient.name},</p>
        <p>Thank you for registering with BuyOps. Please verify your email address by clicking the link below:</p>
        <p>
          <a href="${data.verificationLink}" 
             style="background-color: #4c51bf; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Verify Email
          </a>
        </p>
        <p>This verification link will expire in 24 hours.</p>
        <p>If you did not create this account, please ignore this email.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">BuyOps - Your Investment Partner</p>
      </div>
    `,
    },
};


/***/ }),

/***/ "./src/notification/email.service.ts":
/*!*******************************************!*\
  !*** ./src/notification/email.service.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const nodemailer = __importStar(__webpack_require__(/*! nodemailer */ "nodemailer"));
let EmailService = class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }
    async sendEmail(options) {
        await this.transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: options.to,
            subject: options.subject,
            html: options.html,
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);


/***/ }),

/***/ "./src/notification/in-app-templates.ts":
/*!**********************************************!*\
  !*** ./src/notification/in-app-templates.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getInAppTemplate = getInAppTemplate;
function getInAppTemplate(type, data) {
    switch (type) {
        case 'deal_created':
            return {
                title: 'New Deal Created',
                message: `A new deal for "${data.assetName || 'an asset'}" worth ₦${(data.totalAmount || 0).toLocaleString()} has been created.`,
            };
        case 'payment_ready':
            return {
                title: 'Payment Due',
                message: `Your next installment of ₦${(data.installmentAmount || 0).toLocaleString()} is due on ${data.dueDate || 'the next due date'}.`,
            };
        case 'deal_closed':
            return {
                title: 'Deal Closed',
                message: `The deal for "${data.assetName || 'an asset'}" has been successfully closed.`,
            };
        default:
            return {
                title: 'Notification',
                message: data.message || 'You have a new notification.',
            };
    }
}


/***/ }),

/***/ "./src/notification/notification.controller.ts":
/*!*****************************************************!*\
  !*** ./src/notification/notification.controller.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/jwt-auth.guard */ "./src/auth/jwt-auth.guard.ts");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
let NotificationController = class NotificationController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getNotifications(req) {
        return this.prisma.notification.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
    async getUnreadCount(req) {
        const count = await this.prisma.notification.count({
            where: { userId: req.user.id, read: false },
        });
        return { count };
    }
    async markAsRead(id) {
        return this.prisma.notification.update({
            where: { id },
            data: { read: true },
        });
    }
    async markAllAsRead(req) {
        return this.prisma.notification.updateMany({
            where: { userId: req.user.id, read: false },
            data: { read: true },
        });
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Get)('unread'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Put)(':id/read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Put)('read-all'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAllAsRead", null);
exports.NotificationController = NotificationController = __decorate([
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], NotificationController);


/***/ }),

/***/ "./src/notification/notification.module.ts":
/*!*************************************************!*\
  !*** ./src/notification/notification.module.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const notification_controller_1 = __webpack_require__(/*! ./notification.controller */ "./src/notification/notification.controller.ts");
const notification_service_1 = __webpack_require__(/*! ./notification.service */ "./src/notification/notification.service.ts");
const sms_service_1 = __webpack_require__(/*! ./sms.service */ "./src/notification/sms.service.ts");
const email_service_1 = __webpack_require__(/*! ./email.service */ "./src/notification/email.service.ts");
const cron_service_1 = __webpack_require__(/*! ./cron.service */ "./src/notification/cron.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let NotificationModule = class NotificationModule {
};
exports.NotificationModule = NotificationModule;
exports.NotificationModule = NotificationModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, config_1.ConfigModule],
        controllers: [notification_controller_1.NotificationController],
        providers: [notification_service_1.NotificationService, sms_service_1.SmsService, email_service_1.EmailService, cron_service_1.CronService],
        exports: [notification_service_1.NotificationService],
    })
], NotificationModule);


/***/ }),

/***/ "./src/notification/notification.service.ts":
/*!**************************************************!*\
  !*** ./src/notification/notification.service.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationService_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const sms_service_1 = __webpack_require__(/*! ./sms.service */ "./src/notification/sms.service.ts");
const email_service_1 = __webpack_require__(/*! ./email.service */ "./src/notification/email.service.ts");
const sms_templates_1 = __webpack_require__(/*! ./sms-templates */ "./src/notification/sms-templates.ts");
const in_app_templates_1 = __webpack_require__(/*! ./in-app-templates */ "./src/notification/in-app-templates.ts");
const email_templates_1 = __webpack_require__(/*! ./email-templates */ "./src/notification/email-templates.ts");
const ADMIN_AND_SALES_ROLES = ['ADMIN', 'TEAM_LEAD', 'AGENT'];
let NotificationService = NotificationService_1 = class NotificationService {
    constructor(prisma, smsService, emailService) {
        this.prisma = prisma;
        this.smsService = smsService;
        this.emailService = emailService;
        this.logger = new common_1.Logger(NotificationService_1.name);
    }
    async sendSmsNotification(options) {
        if (!options.phone) {
            return;
        }
        const message = (0, sms_templates_1.getSmsTemplate)(options.templateType, options.data);
        try {
            await this.smsService.sendSms({
                to: options.phone,
                message,
            });
        }
        catch (error) {
            this.logger.warn(`SMS notification failed for ${options.phone}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async notifyUsersByRoles(options) {
        const users = await this.prisma.user.findMany({
            where: { role: { in: options.roles } },
            select: { id: true },
        });
        if (!users.length) {
            return;
        }
        await this.prisma.notification.createMany({
            data: users.map((user) => ({
                userId: user.id,
                title: options.title,
                message: options.message,
                type: options.type || 'INFO',
            })),
        });
    }
    async getUsersByRolesWithContact(roles) {
        return this.prisma.user.findMany({
            where: { role: { in: roles } },
            select: { id: true, email: true, name: true },
        });
    }
    async notifyAdminAndSales(options) {
        await this.notifyUsersByRoles({
            roles: [...ADMIN_AND_SALES_ROLES],
            title: options.title,
            message: options.message,
            type: options.type,
        });
    }
    async notifyCommissionSent(transactionIds) {
        if (!transactionIds.length)
            return;
        await this.notifyAdminAndSales({
            title: 'Commissions Sent for Payment',
            message: `${transactionIds.length} deal commission(s) have been marked as SENT for payment processing.`,
            type: 'INFO',
        });
    }
    async notifyCommissionsPaid(transactionIds, fileName) {
        if (!transactionIds.length)
            return;
        await this.notifyAdminAndSales({
            title: 'Commissions Marked Paid',
            message: `${transactionIds.length} deal commission(s) have been marked as PAID${fileName ? ` via ${fileName}` : ''}.`,
            type: 'SUCCESS',
        });
    }
    async notifyInstallmentPaymentRecorded(options) {
        await this.notifyAdminAndSales({
            title: 'Installment Payment Recorded',
            message: `Payment of ₦${options.paidAmount.toLocaleString()} was recorded for ${options.buyerName || 'a buyer'} on ${options.assetName || 'an asset'} via ${options.paymentMethod}.`,
            type: 'SUCCESS',
        });
        const plan = await this.prisma.installmentPlan.findUnique({
            where: { id: options.planId },
            include: {
                asset: { select: { name: true } },
            },
        });
        if (plan?.buyerEmail) {
            await this.sendEmail({
                to: plan.buyerEmail,
                templateType: 'PAYMENT_RECEIVED',
                data: {
                    amount: options.paidAmount,
                    reference: options.installmentId,
                    assetName: plan.asset?.name,
                },
                recipient: {
                    name: plan.buyerName || 'Investor',
                    email: plan.buyerEmail,
                },
            });
        }
        if (plan && plan.status?.toUpperCase() === 'COMPLETED') {
            await this.notifyInstallmentPlanCompleted(plan.id);
        }
    }
    async notifyInstallmentDue(installmentId) {
        const installment = await this.prisma.installment.findUnique({
            where: { id: installmentId },
            include: {
                installmentPlan: {
                    include: {
                        asset: { select: { name: true } },
                        leadAgent: { include: { user: { select: { id: true } } } },
                        closerAgent: { include: { user: { select: { id: true } } } },
                    },
                },
            },
        });
        if (!installment) {
            return { message: `Installment ${installmentId} not found.` };
        }
        const dueDate = installment.dueDate.toLocaleDateString('en-US', { dateStyle: 'medium' });
        const message = `Installment of ₦${installment.amount.toLocaleString()} for "${installment.installmentPlan?.asset?.name || 'an asset'}" is due on ${dueDate}.`;
        const recipients = [
            installment.installmentPlan?.leadAgent?.user?.id,
            installment.installmentPlan?.closerAgent?.user?.id,
        ].filter(Boolean);
        if (recipients.length) {
            await this.prisma.notification.createMany({
                data: recipients.map((userId) => ({
                    userId,
                    title: 'Installment Due Reminder',
                    message,
                    type: 'WARNING',
                })),
            });
        }
        await this.notifyAdminAndSales({
            title: 'Installment Due Reminder',
            message,
            type: 'WARNING',
        });
        const buyerEmail = installment.installmentPlan?.buyerEmail;
        const buyerName = installment.installmentPlan?.buyerName || 'Investor';
        if (buyerEmail) {
            await this.sendEmail({
                to: buyerEmail,
                templateType: 'INSTALLMENT_DUE',
                data: {
                    amount: installment.amount,
                    dueDate: installment.dueDate,
                },
                recipient: { name: buyerName, email: buyerEmail },
            });
            const buyerUser = await this.prisma.user.findUnique({
                where: { email: buyerEmail },
                select: { id: true },
            });
            if (buyerUser?.id) {
                await this.prisma.notification.create({
                    data: {
                        userId: buyerUser.id,
                        title: 'Installment Due Reminder',
                        message,
                        type: 'WARNING',
                    },
                });
            }
        }
        return { message: `Installment ${installmentId} is due soon.` };
    }
    async notifyInstallmentOverdue(installmentId) {
        const installment = await this.prisma.installment.findUnique({
            where: { id: installmentId },
            include: {
                installmentPlan: {
                    include: {
                        asset: { select: { name: true } },
                        leadAgent: { include: { user: { select: { id: true } } } },
                        closerAgent: { include: { user: { select: { id: true } } } },
                    },
                },
            },
        });
        if (!installment) {
            return { message: `Installment ${installmentId} not found.` };
        }
        const dueDate = installment.dueDate.toLocaleDateString('en-US', { dateStyle: 'medium' });
        const message = `Installment of ₦${installment.amount.toLocaleString()} for "${installment.installmentPlan?.asset?.name || 'an asset'}" is overdue since ${dueDate}.`;
        const recipients = [
            installment.installmentPlan?.leadAgent?.user?.id,
            installment.installmentPlan?.closerAgent?.user?.id,
        ].filter(Boolean);
        if (recipients.length) {
            await this.prisma.notification.createMany({
                data: recipients.map((userId) => ({
                    userId,
                    title: 'Installment Overdue',
                    message,
                    type: 'ERROR',
                })),
            });
        }
        await this.notifyAdminAndSales({
            title: 'Installment Overdue',
            message,
            type: 'ERROR',
        });
        const buyerEmail = installment.installmentPlan?.buyerEmail;
        const buyerName = installment.installmentPlan?.buyerName || 'Investor';
        if (buyerEmail) {
            await this.sendEmail({
                to: buyerEmail,
                templateType: 'INSTALLMENT_OVERDUE',
                data: {
                    amount: installment.amount,
                    dueDate: installment.dueDate,
                },
                recipient: { name: buyerName, email: buyerEmail },
            });
            const buyerUser = await this.prisma.user.findUnique({
                where: { email: buyerEmail },
                select: { id: true },
            });
            if (buyerUser?.id) {
                await this.prisma.notification.create({
                    data: {
                        userId: buyerUser.id,
                        title: 'Installment Overdue',
                        message,
                        type: 'ERROR',
                    },
                });
            }
        }
        return { message: `Installment ${installmentId} is overdue.` };
    }
    async findByUser(userId) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async markAsRead(id) {
        return this.prisma.notification.update({
            where: { id },
            data: { read: true },
        });
    }
    async markAllAsRead(userId) {
        return this.prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
        });
    }
    async create(data) {
        return this.prisma.notification.create({
            data: {
                userId: data.userId,
                title: data.title,
                message: data.message,
                type: data.type || 'INFO',
            },
        });
    }
    async notifyDealCreated(transactionId) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                asset: true,
                buyer: true,
                leadAgent: { include: { user: true } },
                closerAgent: { include: { user: true } },
            },
        });
        if (!transaction)
            return;
        const assetName = transaction.asset?.name || 'an asset';
        const adminUsers = await this.getUsersByRolesWithContact(['ADMIN']);
        await this.prisma.notification.create({
            data: {
                userId: transaction.buyerId,
                title: 'New Deal Created',
                message: `Your deal for "${assetName}" worth ₦${transaction.totalAmount.toLocaleString()} has been created.`,
                type: 'SUCCESS',
            },
        });
        await this.sendSmsNotification({
            phone: transaction.buyer?.phone,
            templateType: 'deal_created',
            data: {
                assetName,
                totalAmount: transaction.totalAmount,
            },
        });
        if (transaction.leadAgent?.user) {
            await this.prisma.notification.create({
                data: {
                    userId: transaction.leadAgent.user.id,
                    title: 'Deal Created on Your Lead',
                    message: `A deal for "${assetName}" worth ₦${transaction.totalAmount.toLocaleString()} has been created.`,
                    type: 'INFO',
                },
            });
            await this.sendSmsNotification({
                phone: transaction.leadAgent.user.phone,
                templateType: 'deal_created',
                data: {
                    assetName,
                    totalAmount: transaction.totalAmount,
                },
            });
            if (transaction.leadAgent.user.email) {
                await this.sendEmail({
                    to: transaction.leadAgent.user.email,
                    templateType: 'DEAL_CREATED',
                    data: {
                        dealId: transaction.id,
                        agentName: transaction.leadAgent.user.name,
                        assetName,
                    },
                    recipient: {
                        name: transaction.leadAgent.user.name || 'Agent',
                        email: transaction.leadAgent.user.email,
                    },
                });
            }
        }
        if (transaction.closerAgent?.user) {
            await this.prisma.notification.create({
                data: {
                    userId: transaction.closerAgent.user.id,
                    title: 'New Deal Assigned',
                    message: `A deal for "${assetName}" worth ₦${transaction.totalAmount.toLocaleString()} has been assigned to you.`,
                    type: 'INFO',
                },
            });
            await this.sendSmsNotification({
                phone: transaction.closerAgent.user.phone,
                templateType: 'deal_created',
                data: {
                    assetName,
                    totalAmount: transaction.totalAmount,
                },
            });
            if (transaction.closerAgent.user.email) {
                await this.sendEmail({
                    to: transaction.closerAgent.user.email,
                    templateType: 'DEAL_CREATED',
                    data: {
                        dealId: transaction.id,
                        agentName: transaction.closerAgent.user.name,
                        assetName,
                    },
                    recipient: {
                        name: transaction.closerAgent.user.name || 'Agent',
                        email: transaction.closerAgent.user.email,
                    },
                });
            }
        }
        for (const admin of adminUsers) {
            await this.sendEmail({
                to: admin.email,
                templateType: 'DEAL_CREATED',
                data: {
                    dealId: transaction.id,
                    agentName: transaction.leadAgent?.user?.name || transaction.closerAgent?.user?.name || 'Agent',
                    assetName,
                },
                recipient: {
                    name: admin.name || 'Admin',
                    email: admin.email,
                },
            });
        }
    }
    async notifyDealPaymentReady(transactionId) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
            include: { asset: true, buyer: true, installmentPlans: true },
        });
        if (!transaction)
            return;
        const plan = transaction.installmentPlans?.[0];
        const dueDate = plan?.nextDueDate
            ? plan.nextDueDate.toLocaleDateString('en-US', { dateStyle: 'medium' })
            : 'the next due date';
        const installmentAmount = plan?.installmentAmount || 0;
        await this.prisma.notification.create({
            data: {
                userId: transaction.buyerId,
                title: 'Payment Due',
                message: `Your next installment of ₦${installmentAmount.toLocaleString()} for "${transaction.asset?.name || 'an asset'}" is due on ${dueDate}.`,
                type: 'WARNING',
            },
        });
        await this.sendSmsNotification({
            phone: transaction.buyer?.phone,
            templateType: 'payment_ready',
            data: {
                installmentAmount,
                dueDate,
            },
        });
        const adminsAndAgents = await this.getUsersByRolesWithContact(['ADMIN', 'TEAM_LEAD', 'AGENT']);
        for (const recipient of adminsAndAgents) {
            await this.sendEmail({
                to: recipient.email,
                templateType: 'DEAL_PAYMENT_READY',
                data: {
                    dealId: transaction.id,
                    amount: transaction.totalAmount,
                    paymentType: transaction.paymentType || 'installment',
                },
                recipient: {
                    name: recipient.name || 'User',
                    email: recipient.email,
                },
            });
        }
    }
    async notifyDealClosed(transactionId) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                asset: true,
                buyer: true,
                leadAgent: { include: { user: true } },
                closerAgent: { include: { user: true } },
            },
        });
        if (!transaction)
            return;
        const assetName = transaction.asset?.name || 'an asset';
        const adminsAndAgents = await this.getUsersByRolesWithContact(['ADMIN', 'TEAM_LEAD', 'AGENT']);
        await this.prisma.notification.create({
            data: {
                userId: transaction.buyerId,
                title: 'Deal Closed',
                message: `Your deal for "${assetName}" has been closed successfully.`,
                type: 'SUCCESS',
            },
        });
        await this.sendSmsNotification({
            phone: transaction.buyer?.phone,
            templateType: 'deal_closed',
            data: {
                assetName,
            },
        });
        if (transaction.leadAgent?.user) {
            await this.prisma.notification.create({
                data: {
                    userId: transaction.leadAgent.user.id,
                    title: 'Deal Closed',
                    message: `The deal for "${assetName}" has been closed. Commission status: ${transaction.commissionPaymentStatus}.`,
                    type: 'SUCCESS',
                },
            });
            await this.sendSmsNotification({
                phone: transaction.leadAgent.user.phone,
                templateType: 'deal_closed',
                data: {
                    assetName,
                },
            });
            if (transaction.leadAgent.user.email) {
                await this.sendEmail({
                    to: transaction.leadAgent.user.email,
                    templateType: 'DEAL_CLOSED',
                    data: {
                        dealId: transaction.id,
                        assetName,
                        commissionStatus: transaction.commissionPaymentStatus,
                    },
                    recipient: {
                        name: transaction.leadAgent.user.name || 'Agent',
                        email: transaction.leadAgent.user.email,
                    },
                });
            }
        }
        if (transaction.closerAgent?.user) {
            await this.prisma.notification.create({
                data: {
                    userId: transaction.closerAgent.user.id,
                    title: 'Deal Closed',
                    message: `The deal for "${assetName}" you closed has been finalised. Commission status: ${transaction.commissionPaymentStatus}.`,
                    type: 'SUCCESS',
                },
            });
            await this.sendSmsNotification({
                phone: transaction.closerAgent.user.phone,
                templateType: 'deal_closed',
                data: {
                    assetName,
                },
            });
            if (transaction.closerAgent.user.email) {
                await this.sendEmail({
                    to: transaction.closerAgent.user.email,
                    templateType: 'DEAL_CLOSED',
                    data: {
                        dealId: transaction.id,
                        assetName,
                        commissionStatus: transaction.commissionPaymentStatus,
                    },
                    recipient: {
                        name: transaction.closerAgent.user.name || 'Agent',
                        email: transaction.closerAgent.user.email,
                    },
                });
            }
        }
        for (const recipient of adminsAndAgents) {
            await this.sendEmail({
                to: recipient.email,
                templateType: 'DEAL_CLOSED',
                data: {
                    dealId: transaction.id,
                    assetName,
                    commissionStatus: transaction.commissionPaymentStatus,
                },
                recipient: {
                    name: recipient.name || 'User',
                    email: recipient.email,
                },
            });
        }
    }
    async notifyAssetPublished(assetId) {
        const asset = await this.prisma.asset.findUnique({
            where: { id: assetId },
            include: { company: { select: { name: true } } },
        });
        if (!asset)
            return;
        const message = `Asset "${asset.name}" has been published and is now live.`;
        await this.notifyAdminAndSales({
            title: 'Asset Published',
            message,
            type: 'SUCCESS',
        });
        const recipients = await this.getUsersByRolesWithContact(['ADMIN', 'TEAM_LEAD', 'AGENT']);
        for (const recipient of recipients) {
            await this.sendEmail({
                to: recipient.email,
                templateType: 'ASSET_PUBLISHED',
                data: {
                    assetName: asset.name,
                    companyName: asset.company?.name || 'BuyOps',
                },
                recipient: {
                    name: recipient.name || 'User',
                    email: recipient.email,
                },
            });
        }
    }
    async notifyAssetUpdated(assetId, updatedFields) {
        const asset = await this.prisma.asset.findUnique({
            where: { id: assetId },
            select: { id: true, name: true },
        });
        if (!asset)
            return;
        const summary = updatedFields.join(', ');
        const message = `Asset "${asset.name}" has been updated (${summary}).`;
        await this.notifyAdminAndSales({
            title: 'Asset Updated',
            message,
            type: 'INFO',
        });
        const recipients = await this.getUsersByRolesWithContact(['ADMIN', 'TEAM_LEAD', 'AGENT']);
        for (const recipient of recipients) {
            await this.sendEmail({
                to: recipient.email,
                templateType: 'ASSET_UPDATED',
                data: {
                    assetName: asset.name,
                    updatedFields: summary,
                },
                recipient: {
                    name: recipient.name || 'User',
                    email: recipient.email,
                },
            });
        }
    }
    async notifyNewLeadFromInvestor(leadId) {
        const lead = await this.prisma.lead.findUnique({
            where: { id: leadId },
            include: {
                asset: { select: { name: true } },
            },
        });
        if (!lead)
            return;
        const message = `New investor lead "${lead.name}" created for ${lead.asset?.name || 'an asset'}.`;
        await this.notifyUsersByRoles({
            roles: ['ADMIN'],
            title: 'New Investor Lead',
            message,
            type: 'INFO',
        });
        const admins = await this.getUsersByRolesWithContact(['ADMIN']);
        for (const admin of admins) {
            await this.sendEmail({
                to: admin.email,
                templateType: 'NEW_LEAD_FROM_INVESTOR',
                data: {
                    leadName: lead.name,
                    assetName: lead.asset?.name || 'N/A',
                    budget: lead.budget || 0,
                },
                recipient: {
                    name: admin.name || 'Admin',
                    email: admin.email,
                },
            });
        }
    }
    async notifyLeadAssignedToCluster(leadIds, clusterId) {
        if (!leadIds.length)
            return;
        const [cluster, leads] = await Promise.all([
            this.prisma.cluster.findUnique({
                where: { id: clusterId },
                select: { id: true, name: true },
            }),
            this.prisma.lead.findMany({
                where: { id: { in: leadIds } },
                include: { asset: { select: { name: true } } },
            }),
        ]);
        const teamLeads = await this.prisma.user.findMany({
            where: {
                role: 'TEAM_LEAD',
                managedClusters: { some: { id: clusterId } },
            },
            select: { id: true, email: true, name: true },
        });
        const recipients = teamLeads.length
            ? teamLeads
            : await this.getUsersByRolesWithContact(['TEAM_LEAD']);
        for (const lead of leads) {
            const message = `Lead "${lead.name}" has been assigned to cluster ${cluster?.name || 'N/A'}.`;
            if (recipients.length) {
                await this.prisma.notification.createMany({
                    data: recipients.map((recipient) => ({
                        userId: recipient.id,
                        title: 'Lead Assigned to Cluster',
                        message,
                        type: 'INFO',
                    })),
                });
            }
            for (const recipient of recipients) {
                await this.sendEmail({
                    to: recipient.email,
                    templateType: 'LEAD_ASSIGNED_TO_CLUSTER',
                    data: {
                        leadName: lead.name,
                        clusterName: cluster?.name || 'N/A',
                    },
                    recipient: {
                        name: recipient.name || 'Team Lead',
                        email: recipient.email,
                    },
                });
            }
        }
    }
    async notifyLeadAvailableToAll(leadIds) {
        if (!leadIds.length)
            return;
        const [leads, agents] = await Promise.all([
            this.prisma.lead.findMany({
                where: { id: { in: leadIds } },
                include: { asset: { select: { name: true } } },
            }),
            this.getUsersByRolesWithContact(['AGENT']),
        ]);
        for (const lead of leads) {
            const message = `New available lead: ${lead.name} (${lead.asset?.name || 'General interest'}).`;
            if (agents.length) {
                await this.prisma.notification.createMany({
                    data: agents.map((agent) => ({
                        userId: agent.id,
                        title: 'New Lead Available',
                        message,
                        type: 'INFO',
                    })),
                });
            }
            for (const agent of agents) {
                await this.sendEmail({
                    to: agent.email,
                    templateType: 'LEAD_AVAILABLE_TO_ALL',
                    data: {
                        leadName: lead.name,
                        assetName: lead.asset?.name || 'N/A',
                    },
                    recipient: {
                        name: agent.name || 'Agent',
                        email: agent.email,
                    },
                });
            }
        }
    }
    async notifyInstallmentPlanCompleted(planId) {
        const plan = await this.prisma.installmentPlan.findUnique({
            where: { id: planId },
            include: {
                asset: { select: { name: true } },
            },
        });
        if (!plan || !plan.buyerEmail) {
            return;
        }
        await this.sendEmail({
            to: plan.buyerEmail,
            templateType: 'INSTALLMENT_COMPLETED',
            data: {
                assetName: plan.asset?.name || 'your asset',
                totalPaid: plan.paidAmount,
            },
            recipient: {
                name: plan.buyerName || 'Investor',
                email: plan.buyerEmail,
            },
        });
        const buyerUser = await this.prisma.user.findUnique({
            where: { email: plan.buyerEmail },
            select: { id: true },
        });
        if (buyerUser?.id) {
            await this.prisma.notification.create({
                data: {
                    userId: buyerUser.id,
                    title: 'Installment Plan Completed',
                    message: `Your installment plan for "${plan.asset?.name || 'your asset'}" is fully completed.`,
                    type: 'SUCCESS',
                },
            });
        }
    }
    getEmailTemplate(type, data) {
        const subject = type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        return `<h2>${subject}</h2><p>${data.message || (0, sms_templates_1.getSmsTemplate)(type, data)}</p>`;
    }
    async sendEmail(options) {
        try {
            const template = email_templates_1.EmailTemplates[options.templateType];
            if (!template) {
                console.warn(`Email template not found: ${options.templateType}`);
                return { success: false, message: 'Template not found' };
            }
            const subject = typeof template.subject === 'function'
                ? template.subject(options.data)
                : template.subject;
            const html = typeof template.body === 'function'
                ? template.body(options.data, options.recipient || { name: 'User', email: options.to })
                : template.body;
            await this.emailService.sendEmail({
                to: options.to,
                subject,
                html,
            });
            console.log(`Email sent to ${options.to} for template ${options.templateType}`);
            return { success: true, message: 'Email sent' };
        }
        catch (error) {
            console.error(`Failed to send email to ${options.to}:`, error);
            return { success: false, message: 'Email sending failed' };
        }
    }
    async sendPasswordResetEmail(user, resetToken) {
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
        return this.sendEmail({
            to: user.email,
            templateType: 'PASSWORD_RESET',
            data: { resetLink },
            recipient: { name: user.name, email: user.email },
        });
    }
    async sendAgentInvitationEmail(user, tempPassword) {
        const loginLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;
        return this.sendEmail({
            to: user.email,
            templateType: 'AGENT_INVITATION',
            data: { tempPassword, loginLink },
            recipient: { name: user.name, email: user.email },
        });
    }
    async sendEmailVerificationEmail(user, verificationToken) {
        const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;
        return this.sendEmail({
            to: user.email,
            templateType: 'EMAIL_VERIFICATION',
            data: { verificationLink },
            recipient: { name: user.name, email: user.email },
        });
    }
    getSmsTemplate(type, data) {
        return (0, sms_templates_1.getSmsTemplate)(type, data);
    }
    getInAppTemplate(type, data) {
        return (0, in_app_templates_1.getInAppTemplate)(type, data);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof sms_service_1.SmsService !== "undefined" && sms_service_1.SmsService) === "function" ? _b : Object, typeof (_c = typeof email_service_1.EmailService !== "undefined" && email_service_1.EmailService) === "function" ? _c : Object])
], NotificationService);


/***/ }),

/***/ "./src/notification/sms-templates.ts":
/*!*******************************************!*\
  !*** ./src/notification/sms-templates.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSmsTemplate = getSmsTemplate;
function getSmsTemplate(type, data) {
    switch (type) {
        case 'deal_created':
            return `BuyOps: A new deal for ${data.assetName || 'an asset'} has been created. Amount: ₦${(data.totalAmount || 0).toLocaleString()}`;
        case 'payment_ready':
            return `BuyOps: Payment of ₦${(data.installmentAmount || 0).toLocaleString()} is due on ${data.dueDate || 'the next due date'}.`;
        case 'deal_closed':
            return `BuyOps: The deal for ${data.assetName || 'an asset'} has been closed successfully.`;
        default:
            return `BuyOps Notification: ${data.message || 'You have a new notification.'}`;
    }
}


/***/ }),

/***/ "./src/notification/sms.service.ts":
/*!*****************************************!*\
  !*** ./src/notification/sms.service.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var SmsService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SmsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const twilio_1 = __importDefault(__webpack_require__(/*! twilio */ "twilio"));
let SmsService = SmsService_1 = class SmsService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(SmsService_1.name);
        const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
        const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
        this.fromPhone = this.configService.get('TWILIO_PHONE_NUMBER');
        this.isConfigured = Boolean(accountSid && authToken && this.fromPhone);
        if (!this.isConfigured) {
            this.twilioClient = null;
            this.logger.warn('Twilio SMS is disabled because required environment variables are missing.');
            return;
        }
        this.twilioClient = new twilio_1.default.Twilio(accountSid, authToken);
        this.logger.log('Twilio SMS service initialized.');
    }
    async sendSms({ to, message }) {
        if (!this.isConfigured || !this.twilioClient || !this.fromPhone) {
            this.logger.warn(`SMS send skipped for ${to}: Twilio is not configured.`);
            return false;
        }
        try {
            await this.twilioClient.messages.create({
                body: message,
                from: this.fromPhone,
                to,
            });
            this.logger.log(`SMS sent to ${to}`);
            return true;
        }
        catch (error) {
            const messageText = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to send SMS to ${to}: ${messageText}`);
            throw error;
        }
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], SmsService);


/***/ }),

/***/ "./src/payments/payments.controller.ts":
/*!*********************************************!*\
  !*** ./src/payments/payments.controller.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/jwt-auth.guard */ "./src/auth/jwt-auth.guard.ts");
const payments_service_1 = __webpack_require__(/*! ./payments.service */ "./src/payments/payments.service.ts");
class InitializePaymentDto {
}
__decorate([
    (0, class_validator_1.IsIn)(['paystack', 'flutterwave']),
    __metadata("design:type", typeof (_a = typeof payments_service_1.PaymentProvider !== "undefined" && payments_service_1.PaymentProvider) === "function" ? _a : Object)
], InitializePaymentDto.prototype, "provider", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], InitializePaymentDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "callbackUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "reference", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", typeof (_b = typeof Record !== "undefined" && Record) === "function" ? _b : Object)
], InitializePaymentDto.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "title", void 0);
let PaymentsController = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    getProviders() {
        return this.paymentsService.getProviderConfig();
    }
    initializePayment(payload) {
        return this.paymentsService.initializePayment(payload);
    }
    verifyPayment(provider, reference) {
        return this.paymentsService.verifyPayment(provider, reference);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Get)('providers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getProviders", null);
__decorate([
    (0, common_1.Post)('initialize'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [InitializePaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "initializePayment", null);
__decorate([
    (0, common_1.Get)('verify'),
    __param(0, (0, common_1.Query)('provider')),
    __param(1, (0, common_1.Query)('reference')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof payments_service_1.PaymentProvider !== "undefined" && payments_service_1.PaymentProvider) === "function" ? _d : Object, String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "verifyPayment", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_c = typeof payments_service_1.PaymentsService !== "undefined" && payments_service_1.PaymentsService) === "function" ? _c : Object])
], PaymentsController);


/***/ }),

/***/ "./src/payments/payments.module.ts":
/*!*****************************************!*\
  !*** ./src/payments/payments.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const payments_controller_1 = __webpack_require__(/*! ./payments.controller */ "./src/payments/payments.controller.ts");
const payments_service_1 = __webpack_require__(/*! ./payments.service */ "./src/payments/payments.service.ts");
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        controllers: [payments_controller_1.PaymentsController],
        providers: [payments_service_1.PaymentsService],
        exports: [payments_service_1.PaymentsService],
    })
], PaymentsModule);


/***/ }),

/***/ "./src/payments/payments.service.ts":
/*!******************************************!*\
  !*** ./src/payments/payments.service.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PaymentsService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(PaymentsService_1.name);
    }
    getProviderConfig() {
        const paystackConfigured = Boolean(this.configService.get('PAYSTACK_SECRET_KEY'));
        const flutterwaveConfigured = Boolean(this.configService.get('FLUTTERWAVE_SECRET_KEY'));
        return {
            paystack: {
                configured: paystackConfigured,
                publicKey: this.configService.get('PAYSTACK_PUBLIC_KEY') || null,
            },
            flutterwave: {
                configured: flutterwaveConfigured,
                publicKey: this.configService.get('FLUTTERWAVE_PUBLIC_KEY') || null,
            },
        };
    }
    async initializePayment(payload) {
        if (payload.provider === 'paystack') {
            return this.initializePaystackPayment(payload);
        }
        return this.initializeFlutterwavePayment(payload);
    }
    async verifyPayment(provider, reference) {
        if (provider === 'paystack') {
            return this.verifyPaystackPayment(reference);
        }
        return this.verifyFlutterwavePayment(reference);
    }
    async initializePaystackPayment(payload) {
        const secretKey = this.configService.get('PAYSTACK_SECRET_KEY');
        if (!secretKey) {
            throw new common_1.InternalServerErrorException('PAYSTACK_SECRET_KEY is not configured');
        }
        const response = await this.requestJson('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: payload.email,
                amount: Math.round(payload.amount * 100),
                currency: payload.currency || 'NGN',
                callback_url: payload.callbackUrl || this.configService.get('PAYMENT_CALLBACK_URL'),
                reference: payload.reference,
                metadata: payload.metadata || {},
            }),
        });
        return {
            provider: 'paystack',
            reference: response?.data?.reference,
            authorizationUrl: response?.data?.authorization_url,
            accessCode: response?.data?.access_code,
            raw: response,
        };
    }
    async initializeFlutterwavePayment(payload) {
        const secretKey = this.configService.get('FLUTTERWAVE_SECRET_KEY');
        if (!secretKey) {
            throw new common_1.InternalServerErrorException('FLUTTERWAVE_SECRET_KEY is not configured');
        }
        const txRef = payload.reference || `buyops-${Date.now()}`;
        const response = await this.requestJson('https://api.flutterwave.com/v3/payments', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tx_ref: txRef,
                amount: payload.amount,
                currency: payload.currency || 'NGN',
                redirect_url: payload.callbackUrl || this.configService.get('PAYMENT_CALLBACK_URL') || 'http://localhost:5173',
                customer: {
                    email: payload.email,
                },
                customizations: {
                    title: payload.title || 'BuyOps Payment',
                },
                meta: payload.metadata || {},
            }),
        });
        return {
            provider: 'flutterwave',
            reference: txRef,
            authorizationUrl: response?.data?.link,
            raw: response,
        };
    }
    async verifyPaystackPayment(reference) {
        const secretKey = this.configService.get('PAYSTACK_SECRET_KEY');
        if (!secretKey) {
            throw new common_1.InternalServerErrorException('PAYSTACK_SECRET_KEY is not configured');
        }
        const response = await this.requestJson(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${secretKey}`,
            },
        });
        return {
            provider: 'paystack',
            reference,
            status: response?.data?.status,
            paidAt: response?.data?.paid_at,
            amount: response?.data?.amount ? response.data.amount / 100 : undefined,
            currency: response?.data?.currency,
            customerEmail: response?.data?.customer?.email,
            raw: response,
        };
    }
    async verifyFlutterwavePayment(reference) {
        const secretKey = this.configService.get('FLUTTERWAVE_SECRET_KEY');
        if (!secretKey) {
            throw new common_1.InternalServerErrorException('FLUTTERWAVE_SECRET_KEY is not configured');
        }
        const response = await this.requestJson(`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference)}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${secretKey}`,
            },
        });
        return {
            provider: 'flutterwave',
            reference,
            status: response?.data?.status,
            paidAt: response?.data?.created_at,
            amount: response?.data?.amount,
            currency: response?.data?.currency,
            customerEmail: response?.data?.customer?.email,
            raw: response,
        };
    }
    async requestJson(url, init) {
        const response = await fetch(url, init);
        const text = await response.text();
        let json;
        try {
            json = text ? JSON.parse(text) : {};
        }
        catch {
            json = { message: text };
        }
        if (!response.ok) {
            this.logger.error(`Payment provider request failed (${response.status}): ${JSON.stringify(json)}`);
            throw new common_1.InternalServerErrorException(json?.message || json?.error || 'Payment provider request failed');
        }
        return json;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], PaymentsService);


/***/ }),

/***/ "./src/prisma/prisma.module.ts":
/*!*************************************!*\
  !*** ./src/prisma/prisma.module.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ./prisma.service */ "./src/prisma/prisma.service.ts");
let PrismaModule = class PrismaModule {
};
exports.PrismaModule = PrismaModule;
exports.PrismaModule = PrismaModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], PrismaModule);


/***/ }),

/***/ "./src/prisma/prisma.service.ts":
/*!**************************************!*\
  !*** ./src/prisma/prisma.service.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
const adapter_pg_1 = __webpack_require__(/*! @prisma/adapter-pg */ "@prisma/adapter-pg");
const pg_1 = __webpack_require__(/*! pg */ "pg");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    constructor() {
        const pool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            max: 3,
            min: 1,
            idleTimeoutMillis: 10000,
            connectionTimeoutMillis: 20000,
            keepAlive: true,
            keepAliveInitialDelayMillis: 5000,
        });
        super({
            adapter: new adapter_pg_1.PrismaPg(pool),
            log: ["error", "warn"],
        });
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);


/***/ }),

/***/ "./src/reports/reports.controller.ts":
/*!*******************************************!*\
  !*** ./src/reports/reports.controller.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const reports_service_1 = __webpack_require__(/*! ./reports.service */ "./src/reports/reports.service.ts");
const express_1 = __webpack_require__(/*! express */ "express");
const roles_guard_1 = __webpack_require__(/*! ../common/roles.guard */ "./src/common/roles.guard.ts");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getSalesReport(dateRange) {
        const report = await this.reportsService.getSalesReport(dateRange);
        return {
            success: true,
            salesData: report.salesByMonth,
            topSalesByAsset: report.topAssets.map(a => ({
                asset: a.name,
                sales: a.count,
                revenue: a.revenue,
                location: a.location,
            })),
            assetTypeBreakdown: report.salesByType.map(t => ({
                type: t.type,
                count: t.count,
                totalValue: t.revenue,
            })),
            summary: report.summary,
            message: 'Sales report fetched successfully'
        };
    }
    async getAssetPerformance(dateRange) {
        const data = await this.reportsService.getAssetPerformance(dateRange);
        return { success: true, ...data };
    }
    async getAgentPerformance(dateRange) {
        const report = await this.reportsService.getAgentPerformance(dateRange);
        return {
            success: true,
            data: report.data,
            summary: report.summary,
            message: 'Agent performance report fetched successfully'
        };
    }
    async getClusterPerformance(dateRange) {
        const report = await this.reportsService.getClusterPerformance(dateRange);
        return {
            success: true,
            data: report.data,
            summary: report.summary,
            message: 'Cluster performance report fetched successfully'
        };
    }
    async exportReport(type, res, dateRange) {
        const buffer = await this.reportsService.exportReport(type, dateRange);
        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.header('Content-Disposition', `attachment; filename=buyops-${type}-report-${dateRange || 'recent'}.xlsx`);
        return res.send(buffer);
    }
    async getInvestmentReports(dateRange) {
        const trends = await this.reportsService.getInvestmentTrends(dateRange);
        const categories = await this.reportsService.getInvestorCategories(dateRange);
        return {
            success: true,
            investmentTrends: trends,
            investorCategories: categories,
            message: 'Investment report fetched successfully'
        };
    }
    async getCommissionReports(dateRange) {
        const report = await this.reportsService.getCommissionReports(dateRange);
        return {
            success: true,
            ...report,
            message: 'Commission report fetched successfully'
        };
    }
    async getPerformanceReports(dateRange) {
        const metrics = await this.reportsService.getConversionMetrics(dateRange);
        const clusters = await this.reportsService.getClusterPerformance(dateRange);
        return {
            success: true,
            conversionMetrics: metrics,
            clusterPerformance: clusters.data.map(c => ({
                cluster: c.name,
                target: 100,
                achieved: c.closedDeals,
                performance: ((c.closedDeals / 100) * 100).toFixed(0),
            })),
            message: 'Performance report fetched successfully'
        };
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('sales'),
    __param(0, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getSalesReport", null);
__decorate([
    (0, common_1.Get)('assets'),
    __param(0, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getAssetPerformance", null);
__decorate([
    (0, common_1.Get)('agents'),
    __param(0, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getAgentPerformance", null);
__decorate([
    (0, common_1.Get)('clusters'),
    __param(0, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getClusterPerformance", null);
__decorate([
    (0, common_1.Get)('export'),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _b : Object, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportReport", null);
__decorate([
    (0, common_1.Get)('investments'),
    __param(0, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getInvestmentReports", null);
__decorate([
    (0, common_1.Get)('commissions'),
    __param(0, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getCommissionReports", null);
__decorate([
    (0, common_1.Get)('performance'),
    __param(0, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getPerformanceReports", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof reports_service_1.ReportsService !== "undefined" && reports_service_1.ReportsService) === "function" ? _a : Object])
], ReportsController);


/***/ }),

/***/ "./src/reports/reports.module.ts":
/*!***************************************!*\
  !*** ./src/reports/reports.module.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const reports_controller_1 = __webpack_require__(/*! ./reports.controller */ "./src/reports/reports.controller.ts");
const reports_service_1 = __webpack_require__(/*! ./reports.service */ "./src/reports/reports.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let ReportsModule = class ReportsModule {
};
exports.ReportsModule = ReportsModule;
exports.ReportsModule = ReportsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [reports_controller_1.ReportsController],
        providers: [reports_service_1.ReportsService],
        exports: [reports_service_1.ReportsService],
    })
], ReportsModule);


/***/ }),

/***/ "./src/reports/reports.service.ts":
/*!****************************************!*\
  !*** ./src/reports/reports.service.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const ExcelJS = __importStar(__webpack_require__(/*! exceljs */ "exceljs"));
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getDateFilter(dateRange) {
        const where = {};
        const now = new Date();
        switch (dateRange) {
            case '7d': {
                const d = new Date();
                d.setDate(d.getDate() - 7);
                where.date = { gte: d };
                break;
            }
            case '30d': {
                const d = new Date();
                d.setDate(d.getDate() - 30);
                where.date = { gte: d };
                break;
            }
            case '90d': {
                const d = new Date();
                d.setDate(d.getDate() - 90);
                where.date = { gte: d };
                break;
            }
            case 'ytd': {
                where.date = { gte: new Date(now.getFullYear(), 0, 1) };
                break;
            }
            case '6m': {
                const d = new Date();
                d.setMonth(d.getMonth() - 6);
                where.date = { gte: d };
                break;
            }
            case '1y': {
                const d = new Date();
                d.setFullYear(d.getFullYear() - 1);
                where.date = { gte: d };
                break;
            }
            case 'all': {
                break;
            }
            default: {
                const d = new Date();
                d.setDate(d.getDate() - 30);
                where.date = { gte: d };
                break;
            }
        }
        return where;
    }
    getLeadDateFilter(dateRange) {
        const where = {};
        const now = new Date();
        switch (dateRange) {
            case '7d': {
                const d = new Date();
                d.setDate(d.getDate() - 7);
                where.createdAt = { gte: d };
                break;
            }
            case '30d': {
                const d = new Date();
                d.setDate(d.getDate() - 30);
                where.createdAt = { gte: d };
                break;
            }
            case '90d': {
                const d = new Date();
                d.setDate(d.getDate() - 90);
                where.createdAt = { gte: d };
                break;
            }
            case 'ytd': {
                where.createdAt = { gte: new Date(now.getFullYear(), 0, 1) };
                break;
            }
            case '6m': {
                const d = new Date();
                d.setMonth(d.getMonth() - 6);
                where.createdAt = { gte: d };
                break;
            }
            case '1y': {
                const d = new Date();
                d.setFullYear(d.getFullYear() - 1);
                where.createdAt = { gte: d };
                break;
            }
            case 'all': {
                break;
            }
            default: {
                const d = new Date();
                d.setDate(d.getDate() - 30);
                where.createdAt = { gte: d };
                break;
            }
        }
        return where;
    }
    getLeadPreviousPeriodFilter(dateRange) {
        const now = new Date();
        switch (dateRange) {
            case '7d': {
                const s = new Date();
                s.setDate(s.getDate() - 14);
                const e = new Date();
                e.setDate(e.getDate() - 7);
                return { createdAt: { gte: s, lt: e } };
            }
            case '30d': {
                const s = new Date();
                s.setDate(s.getDate() - 60);
                const e = new Date();
                e.setDate(e.getDate() - 30);
                return { createdAt: { gte: s, lt: e } };
            }
            case '90d': {
                const s = new Date();
                s.setDate(s.getDate() - 180);
                const e = new Date();
                e.setDate(e.getDate() - 90);
                return { createdAt: { gte: s, lt: e } };
            }
            case 'ytd': {
                return { createdAt: { gte: new Date(now.getFullYear() - 1, 0, 1), lt: new Date(now.getFullYear() - 1, 11, 31) } };
            }
            default: return null;
        }
    }
    getPreviousPeriodFilter(dateRange) {
        const now = new Date();
        switch (dateRange) {
            case '7d': {
                const s = new Date();
                s.setDate(s.getDate() - 14);
                const e = new Date();
                e.setDate(e.getDate() - 7);
                return { date: { gte: s, lt: e } };
            }
            case '30d': {
                const s = new Date();
                s.setDate(s.getDate() - 60);
                const e = new Date();
                e.setDate(e.getDate() - 30);
                return { date: { gte: s, lt: e } };
            }
            case '90d': {
                const s = new Date();
                s.setDate(s.getDate() - 180);
                const e = new Date();
                e.setDate(e.getDate() - 90);
                return { date: { gte: s, lt: e } };
            }
            case 'ytd': {
                return { date: { gte: new Date(now.getFullYear() - 1, 0, 1), lt: new Date(now.getFullYear() - 1, 11, 31) } };
            }
            default: return null;
        }
    }
    async getSalesReport(dateRange) {
        const dateFilter = this.getDateFilter(dateRange);
        const prevFilter = this.getPreviousPeriodFilter(dateRange);
        const [transactions, totalRevenueAgg, totalCount, prevRevenueAgg, prevCount] = await Promise.all([
            this.prisma.transaction.findMany({
                where: { status: 'COMPLETED', ...dateFilter },
                include: { asset: { select: { name: true, type: true } } },
                orderBy: { date: 'desc' },
            }),
            this.prisma.transaction.aggregate({ where: { status: 'COMPLETED', ...dateFilter }, _sum: { totalAmount: true } }),
            this.prisma.transaction.count({ where: { status: 'COMPLETED', ...dateFilter } }),
            prevFilter
                ? this.prisma.transaction.aggregate({ where: { status: 'COMPLETED', ...prevFilter }, _sum: { totalAmount: true } })
                : { _sum: { totalAmount: 0 } },
            prevFilter ? this.prisma.transaction.count({ where: { status: 'COMPLETED', ...prevFilter } }) : 0,
        ]);
        const totalRevenue = totalRevenueAgg._sum.totalAmount || 0;
        const prevRevenue = prevRevenueAgg._sum.totalAmount || 0;
        const avgDealSize = totalCount > 0 ? totalRevenue / totalCount : 0;
        const prevAvg = prevCount > 0 ? prevRevenue / prevCount : 0;
        const leadDateFilter = this.getLeadDateFilter(dateRange);
        const leadPrevFilter = this.getLeadPreviousPeriodFilter(dateRange);
        const totalLeads = await this.prisma.lead.count({ where: leadDateFilter });
        const conversionRate = totalLeads > 0 ? ((totalCount / totalLeads) * 100).toFixed(1) : 0;
        const prevLeads = leadPrevFilter ? await this.prisma.lead.count({ where: leadPrevFilter }) : 0;
        const prevConversionRate = prevLeads > 0 ? (prevCount / prevLeads) * 100 : 0;
        const conversionChange = prevConversionRate > 0
            ? ((parseFloat(conversionRate) - prevConversionRate) / prevConversionRate) * 100
            : 0;
        return {
            summary: {
                totalRevenue,
                totalTransactions: totalCount,
                avgDealSize,
                revenueChange: prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0,
                transactionChange: prevCount > 0 ? ((totalCount - prevCount) / prevCount) * 100 : 0,
                avgDealSizeChange: prevAvg > 0 ? ((avgDealSize - prevAvg) / prevAvg) * 100 : 0,
                conversionRate,
                conversionChange,
            },
            salesByMonth: this.processSalesByMonth(transactions),
            topAssets: (await this.getTopAssetsBySales(dateFilter)).slice(0, 10),
            salesByType: this.processSalesByType(transactions),
        };
    }
    processSalesByMonth(transactions) {
        const data = {};
        transactions.forEach((tx) => {
            const d = new Date(tx.date);
            const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            if (!data[key])
                data[key] = { revenue: 0, transactions: 0, commission: 0 };
            data[key].revenue += tx.totalAmount || 0;
            data[key].transactions += 1;
            data[key].commission += tx.totalCommission || 0;
        });
        return Object.entries(data).map(([month, d]) => ({
            month, revenue: d.revenue, transactions: d.transactions,
            avgValue: d.transactions > 0 ? d.revenue / d.transactions : 0, commission: d.commission,
        }));
    }
    async getTopAssetsBySales(dateFilter) {
        const result = await this.prisma.transaction.groupBy({
            by: ['assetId'],
            where: { status: 'COMPLETED', ...dateFilter },
            _sum: { totalAmount: true, totalCommission: true },
            _count: true,
            orderBy: { _sum: { totalAmount: 'desc' } },
            take: 10,
        });
        if (!result.length)
            return [];
        const assets = await this.prisma.asset.findMany({
            where: { id: { in: result.map((r) => r.assetId) } },
            select: { id: true, name: true, type: true, location: true },
        });
        const map = new Map(assets.map((a) => [a.id, a]));
        return result.map((r) => {
            const a = map.get(r.assetId);
            return {
                name: a?.name || 'Unknown', revenue: r._sum.totalAmount || 0,
                count: r._count, commission: r._sum.totalCommission || 0,
                type: a?.type || 'Unknown', location: a?.location || 'Unknown',
            };
        });
    }
    processSalesByType(transactions) {
        const data = {};
        transactions.forEach((tx) => {
            const type = tx.paymentType || 'Standard';
            if (!data[type])
                data[type] = { revenue: 0, count: 0, commission: 0 };
            data[type].revenue += tx.totalAmount || 0;
            data[type].count += 1;
            data[type].commission += tx.totalCommission || 0;
        });
        return Object.entries(data).map(([type, d]) => ({
            type, revenue: d.revenue, count: d.count,
            avgValue: d.count > 0 ? d.revenue / d.count : 0, commission: d.commission,
        })).sort((a, b) => b.revenue - a.revenue);
    }
    async getAgentPerformance(dateRange) {
        const dateFilter = this.getDateFilter(dateRange);
        const agents = await this.prisma.agent.findMany({
            where: { status: 'ACTIVE' },
            include: {
                user: { select: { name: true, email: true } },
                leadTransactions: {
                    where: { status: 'COMPLETED', ...dateFilter },
                    select: { totalAmount: true, leadCommission: true, earnedLeadCommission: true, totalCommission: true, earnedTotalCommission: true, date: true },
                },
                closerTransactions: {
                    where: { status: 'COMPLETED', ...dateFilter },
                    select: { totalAmount: true, closerCommission: true, earnedCloserCommission: true, totalCommission: true, earnedTotalCommission: true, date: true },
                },
                cluster: { select: { name: true } },
            },
        });
        const agentPerformance = agents.map((agent) => {
            const leadTxs = agent.leadTransactions || [];
            const closerTxs = agent.closerTransactions || [];
            const all = [...leadTxs, ...closerTxs];
            const revenue = all.reduce((s, tx) => s + (tx.totalAmount || 0), 0);
            const leadComm = leadTxs.reduce((s, tx) => s + (tx.earnedLeadCommission || tx.leadCommission || 0), 0);
            const closerComm = closerTxs.reduce((s, tx) => s + (tx.earnedCloserCommission || tx.closerCommission || 0), 0);
            const totalComm = all.reduce((s, tx) => s + (tx.earnedTotalCommission || tx.totalCommission || 0), 0);
            return {
                name: agent.user?.name || 'Unknown',
                email: agent.user?.email || '',
                cluster: agent.cluster?.name || 'Unassigned',
                closedDeals: all.length,
                revenue, totalCommission: totalComm, leadCommission: leadComm, closerCommission: closerComm,
                conversionRate: '0.0',
                avgDealSize: all.length > 0 ? revenue / all.length : 0,
            };
        }).sort((a, b) => b.revenue - a.revenue);
        return {
            data: agentPerformance,
            summary: {
                totalAgents: agentPerformance.length,
                totalRevenue: agentPerformance.reduce((s, a) => s + a.revenue, 0),
                totalCommission: agentPerformance.reduce((s, a) => s + a.totalCommission, 0),
                avgConversionRate: '0.0',
            },
        };
    }
    async getClusterPerformance(dateRange) {
        const dateFilter = this.getDateFilter(dateRange);
        const clusters = await this.prisma.cluster.findMany({
            where: { status: 'active' },
            include: {
                agents: {
                    where: { status: 'ACTIVE' },
                    include: {
                        user: { select: { name: true, email: true } },
                        leadTransactions: {
                            where: { status: 'COMPLETED', ...dateFilter },
                            select: { totalAmount: true, earnedLeadCommission: true, earnedTotalCommission: true, totalCommission: true },
                        },
                        closerTransactions: {
                            where: { status: 'COMPLETED', ...dateFilter },
                            select: { totalAmount: true, earnedCloserCommission: true, earnedTotalCommission: true, totalCommission: true },
                        },
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
        const clusterPerformance = clusters.map((cluster) => {
            let agentsCount = 0, closedDeals = 0, revenue = 0, totalCommission = 0;
            cluster.agents.forEach((agent) => {
                const all = [...(agent.leadTransactions || []), ...(agent.closerTransactions || [])];
                if (all.length > 0) {
                    agentsCount++;
                    closedDeals += all.length;
                    revenue += all.reduce((s, tx) => s + (tx.totalAmount || 0), 0);
                    totalCommission += all.reduce((s, tx) => s + (tx.earnedTotalCommission || tx.totalCommission || 0), 0);
                }
            });
            return {
                name: cluster.name, agents: agentsCount, closedDeals, revenue, totalCommission,
                avgRevenuePerAgent: agentsCount > 0 ? revenue / agentsCount : 0,
                avgDealsPerAgent: agentsCount > 0 ? closedDeals / agentsCount : 0,
                avgCommissionPerAgent: agentsCount > 0 ? totalCommission / agentsCount : 0,
            };
        }).sort((a, b) => b.revenue - a.revenue);
        const totals = clusterPerformance.reduce((acc, c) => ({
            agents: acc.agents + c.agents, revenue: acc.revenue + c.revenue,
            commission: acc.commission + c.totalCommission, deals: acc.deals + c.closedDeals,
        }), { agents: 0, revenue: 0, commission: 0, deals: 0 });
        return {
            data: clusterPerformance,
            summary: {
                totalClusters: clusterPerformance.length,
                totalAgents: totals.agents, totalRevenue: totals.revenue,
                totalCommission: totals.commission, totalClosedDeals: totals.deals,
                avgRevenuePerCluster: clusterPerformance.length > 0 ? totals.revenue / clusterPerformance.length : 0,
                avgAgentsPerCluster: clusterPerformance.length > 0 ? totals.agents / clusterPerformance.length : 0,
            },
        };
    }
    async exportReport(type, dateRange) {
        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet(type.charAt(0).toUpperCase() + type.slice(1));
        if (type === 'sales') {
            const data = await this.getSalesReport(dateRange);
            ws.addRow(['BuyOps - Sales Report']);
            ws.addRow([`Date Range: ${dateRange || 'Last 30 days'}`]);
            ws.addRow([`Generated: ${new Date().toLocaleDateString()}`]);
            ws.addRow([]);
            ws.addRow(['SUMMARY']);
            ws.addRow([]);
            ws.addRow(['Metric', 'Value', 'Change vs Previous Period']);
            ws.addRow(['Total Revenue', `₦${data.summary.totalRevenue.toLocaleString()}`, `${data.summary.revenueChange.toFixed(1)}%`]);
            ws.addRow(['Total Transactions', data.summary.totalTransactions, `${data.summary.transactionChange.toFixed(1)}%`]);
            ws.addRow(['Average Deal Size', `₦${data.summary.avgDealSize.toLocaleString()}`, `${data.summary.avgDealSizeChange.toFixed(1)}%`]);
            ws.addRow([]);
            ws.addRow(['SALES BY MONTH']);
            ws.addRow([]);
            ws.addRow(['Month', 'Revenue', 'Transactions', 'Average Value', 'Commission']);
            data.salesByMonth.forEach((r) => ws.addRow([r.month, `₦${r.revenue.toLocaleString()}`, r.transactions, `₦${r.avgValue.toLocaleString()}`, `₦${r.commission.toLocaleString()}`]));
            ws.addRow([]);
            ws.addRow(['TOP PERFORMING ASSETS']);
            ws.addRow([]);
            ws.addRow(['Asset Name', 'Revenue', 'Transactions', 'Commission', 'Type', 'Location']);
            data.topAssets.forEach((a) => ws.addRow([a.name, `₦${a.revenue.toLocaleString()}`, a.count, `₦${a.commission.toLocaleString()}`, a.type, a.location]));
        }
        else if (type === 'agents') {
            const data = await this.getAgentPerformance(dateRange);
            ws.addRow(['BuyOps - Agent Performance Report']);
            ws.addRow([`Date Range: ${dateRange || 'Last 30 days'}`]);
            ws.addRow([`Generated: ${new Date().toLocaleDateString()}`]);
            ws.addRow([]);
            ws.addRow(['SUMMARY']);
            ws.addRow([]);
            ws.addRow(['Total Agents', data.summary.totalAgents]);
            ws.addRow(['Total Revenue', `₦${data.summary.totalRevenue.toLocaleString()}`]);
            ws.addRow(['Total Commission', `₦${data.summary.totalCommission.toLocaleString()}`]);
            ws.addRow([]);
            ws.addRow(['AGENT PERFORMANCE']);
            ws.addRow([]);
            ws.addRow(['Name', 'Cluster', 'Closed Deals', 'Revenue', 'Total Commission', 'Lead Commission', 'Closer Commission', 'Avg Deal Size']);
            data.data.forEach((a) => ws.addRow([a.name, a.cluster, a.closedDeals, `₦${a.revenue.toLocaleString()}`, `₦${a.totalCommission.toLocaleString()}`, `₦${a.leadCommission.toLocaleString()}`, `₦${a.closerCommission.toLocaleString()}`, `₦${a.avgDealSize.toLocaleString()}`]));
        }
        else {
            const data = await this.getClusterPerformance(dateRange);
            ws.addRow(['BuyOps - Cluster Performance Report']);
            ws.addRow([`Date Range: ${dateRange || 'Last 30 days'}`]);
            ws.addRow([`Generated: ${new Date().toLocaleDateString()}`]);
            ws.addRow([]);
            ws.addRow(['SUMMARY']);
            ws.addRow([]);
            ws.addRow(['Total Clusters', data.summary.totalClusters]);
            ws.addRow(['Total Agents', data.summary.totalAgents]);
            ws.addRow(['Total Revenue', `₦${data.summary.totalRevenue.toLocaleString()}`]);
            ws.addRow([]);
            ws.addRow(['CLUSTER PERFORMANCE']);
            ws.addRow([]);
            ws.addRow(['Cluster Name', 'Agents', 'Closed Deals', 'Revenue', 'Total Commission', 'Avg Revenue/Agent', 'Avg Deals/Agent']);
            data.data.forEach((c) => ws.addRow([c.name, c.agents, c.closedDeals, `₦${c.revenue.toLocaleString()}`, `₦${c.totalCommission.toLocaleString()}`, `₦${c.avgRevenuePerAgent.toLocaleString()}`, c.avgDealsPerAgent.toFixed(1)]));
        }
        ws.getRow(1).font = { bold: true, size: 16 };
        ws.eachRow((row, i) => {
            if (i > 4) {
                const val = row.getCell(1).value;
                if (typeof val === 'string' && ['SUMMARY', 'SALES BY MONTH', 'TOP PERFORMING ASSETS', 'AGENT PERFORMANCE', 'CLUSTER PERFORMANCE'].includes(val)) {
                    row.font = { bold: true, size: 12 };
                    row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
                }
            }
        });
        ws.columns?.forEach((col) => {
            if (col && col.eachCell) {
                let max = 10;
                col.eachCell({ includeEmpty: true }, (cell) => { max = Math.max(max, (cell.value?.toString().length || 0) + 2); });
                col.width = Math.min(max, 40);
            }
        });
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
    async getAssetPerformance(dateRange) {
        const statusAgg = await this.prisma.asset.groupBy({
            by: ['status'],
            _count: { status: true },
        });
        const colors = ["#4c51bf", "#10b981", "#f59e42", "#e53e3e", "#6b7280"];
        const assetPerformanceData = statusAgg.map((s, i) => ({
            name: s.status,
            value: s._count.status,
            color: colors[i % colors.length],
        }));
        const typeAgg = await this.prisma.asset.groupBy({
            by: ['type'],
            _count: { type: true },
        });
        const assets = await this.prisma.asset.findMany({
            select: { type: true, price: true },
        });
        const typeValueMap = {};
        assets.forEach(asset => {
            const type = asset.type || 'Unknown';
            const price = parseFloat(asset.price || '0');
            typeValueMap[type] = (typeValueMap[type] || 0) + price;
        });
        const assetTypeBreakdown = typeAgg.map(t => ({
            type: t.type,
            count: t._count.type,
            totalValue: typeValueMap[t.type || ''] || 0,
        }));
        return { assetPerformanceData, assetTypeBreakdown };
    }
    async getInvestmentTrends(dateRange) {
        const txs = await this.prisma.transaction.findMany({
            where: { status: 'COMPLETED', ...this.getDateFilter(dateRange) },
            select: { date: true, ownershipType: true, totalAmount: true }
        });
        const trends = {};
        txs.forEach(tx => {
            const d = new Date(tx.date);
            const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            if (!trends[key])
                trends[key] = { fractional: 0, full: 0 };
            if (tx.ownershipType === 'Fractional')
                trends[key].fractional += tx.totalAmount;
            else
                trends[key].full += tx.totalAmount;
        });
        return Object.entries(trends).map(([month, v]) => ({ month, ...v }));
    }
    async getInvestorCategories(dateRange) {
        const investors = await this.prisma.user.groupBy({
            by: ['role'],
            _count: { role: true },
        });
        const txs = await this.prisma.transaction.findMany({
            where: { status: 'COMPLETED', ...this.getDateFilter(dateRange) },
            select: { buyerId: true, totalAmount: true }
        });
        const invested = {};
        txs.forEach(tx => {
            invested[tx.buyerId] = (invested[tx.buyerId] || 0) + tx.totalAmount;
        });
        return investors.map(i => ({
            category: i.role,
            count: i._count.role,
            totalInvested: Object.values(invested).reduce((sum, v) => sum + v, 0),
        }));
    }
    async getCommissionTrends(dateRange) {
        const txs = await this.prisma.transaction.findMany({
            where: { status: 'COMPLETED', ...this.getDateFilter(dateRange) },
            select: { date: true, leadCommission: true, closerCommission: true }
        });
        const data = {};
        txs.forEach(tx => {
            const d = new Date(tx.date);
            const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            if (!data[key])
                data[key] = { agentComm: 0, companyComm: 0 };
            data[key].agentComm += (tx.leadCommission || 0) + (tx.closerCommission || 0);
        });
        return Object.entries(data).map(([month, v]) => ({ month, ...v }));
    }
    async getTopAgents(dateRange) {
        const agents = await this.prisma.agent.findMany({
            where: { status: 'ACTIVE' },
            include: {
                user: { select: { name: true } },
                leadTransactions: { where: { status: 'COMPLETED', ...this.getDateFilter(dateRange) } },
                closerTransactions: { where: { status: 'COMPLETED', ...this.getDateFilter(dateRange) } },
            },
        });
        return agents.map(a => ({
            name: a.user?.name ?? '',
            deals: (a.leadTransactions?.length ?? 0) + (a.closerTransactions?.length ?? 0),
            commission: (a.leadTransactions?.reduce((s, tx) => s + (tx.leadCommission || 0), 0) ?? 0) +
                (a.closerTransactions?.reduce((s, tx) => s + (tx.closerCommission || 0), 0) ?? 0),
            conversion: 'N/A',
        }));
    }
    async getConversionMetrics(dateRange) {
        const leads = await this.prisma.lead.groupBy({
            by: ['status'],
            _count: { status: true },
        });
        return leads.map(l => ({
            stage: l.status,
            count: l._count.status,
        }));
    }
    async getCommissionReports(dateRange) {
        const dateFilter = this.getDateFilter(dateRange);
        const transactions = await this.prisma.transaction.findMany({
            where: { status: 'COMPLETED', ...dateFilter },
            select: {
                date: true,
                leadCommission: true,
                closerCommission: true,
                totalCommission: true,
                commissionPaymentStatus: true,
                paymentType: true,
            },
            orderBy: { date: 'desc' },
        });
        let thisMonthTotal = 0;
        let totalEarned = 0;
        let pendingTotal = 0;
        let leadCommissionTotal = 0;
        let closerCommissionTotal = 0;
        let teamLeadBonus = 0;
        let teamTotalCommission = 0;
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        transactions.forEach(tx => {
            const txDate = new Date(tx.date);
            if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
                thisMonthTotal += tx.totalCommission || 0;
            }
            totalEarned += (tx.commissionPaymentStatus === 'PAID' ? tx.totalCommission || 0 : 0);
            pendingTotal += (tx.commissionPaymentStatus === client_1.CommissionPaymentStatus.SENT ? tx.totalCommission || 0 : 0);
            leadCommissionTotal += tx.leadCommission || 0;
            closerCommissionTotal += tx.closerCommission || 0;
            if (tx.paymentType === 'installment') {
                teamLeadBonus += (tx.totalCommission || 0) * 0.05;
            }
            teamTotalCommission += tx.totalCommission || 0;
        });
        const conversionRate = transactions.length > 0
            ? Math.round((totalEarned / teamTotalCommission) * 100)
            : 0;
        const monthlyMap = {};
        transactions.forEach(tx => {
            const d = new Date(tx.date);
            const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            monthlyMap[key] = (monthlyMap[key] || 0) + (tx.totalCommission || 0);
        });
        const monthlyData = Object.entries(monthlyMap).map(([month, amount]) => ({
            month,
            amount,
        }));
        const breakdown = [
            { name: "Lead", value: leadCommissionTotal, color: "#6366f1" },
            { name: "Closer", value: closerCommissionTotal, color: "#06b6d4" },
        ];
        return {
            summary: {
                thisMonth: `₦${thisMonthTotal.toLocaleString()}`,
                totalEarned: `₦${totalEarned.toLocaleString()}`,
                pending: `₦${pendingTotal.toLocaleString()}`,
                leadCommission: `₦${leadCommissionTotal.toLocaleString()}`,
                closerCommission: `₦${closerCommissionTotal.toLocaleString()}`,
                conversionRate: `${conversionRate}%`,
                teamLeadBonus: `₦${teamLeadBonus.toLocaleString()}`,
                teamTotalCommission: `₦${teamTotalCommission.toLocaleString()}`,
            },
            monthly: monthlyData,
            breakdown,
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ReportsService);


/***/ }),

/***/ "./src/sales/sales.controller.ts":
/*!***************************************!*\
  !*** ./src/sales/sales.controller.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SalesController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const sales_service_1 = __webpack_require__(/*! ./sales.service */ "./src/sales/sales.service.ts");
let SalesController = class SalesController {
    constructor(svc) {
        this.svc = svc;
    }
    async mySales(req) {
        return this.svc.findByUser(req.user.id);
    }
    async all() {
        return this.svc.findAll();
    }
    async summary() {
        return this.svc.getSalesSummary();
    }
};
exports.SalesController = SalesController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "mySales", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "all", null);
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "summary", null);
exports.SalesController = SalesController = __decorate([
    (0, common_1.Controller)('sales'),
    __metadata("design:paramtypes", [typeof (_a = typeof sales_service_1.SalesService !== "undefined" && sales_service_1.SalesService) === "function" ? _a : Object])
], SalesController);


/***/ }),

/***/ "./src/sales/sales.module.ts":
/*!***********************************!*\
  !*** ./src/sales/sales.module.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SalesModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const sales_controller_1 = __webpack_require__(/*! ./sales.controller */ "./src/sales/sales.controller.ts");
const sales_service_1 = __webpack_require__(/*! ./sales.service */ "./src/sales/sales.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let SalesModule = class SalesModule {
};
exports.SalesModule = SalesModule;
exports.SalesModule = SalesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [sales_controller_1.SalesController],
        providers: [sales_service_1.SalesService],
    })
], SalesModule);


/***/ }),

/***/ "./src/sales/sales.service.ts":
/*!************************************!*\
  !*** ./src/sales/sales.service.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SalesService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
let SalesService = class SalesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByUser(userId) {
        return this.prisma.transaction.findMany({
            where: { buyerId: userId },
            include: {
                asset: { select: { id: true, name: true, type: true } },
                leadAgent: { include: { user: { select: { id: true, name: true } } } },
                closerAgent: { include: { user: { select: { id: true, name: true } } } },
                installments: true,
            },
            orderBy: { date: 'desc' },
        });
    }
    async findAll() {
        return this.prisma.transaction.findMany({
            where: { status: 'COMPLETED' },
            include: {
                asset: { select: { id: true, name: true, type: true } },
                buyer: { select: { id: true, name: true, email: true } },
                company: { select: { id: true, name: true } },
                leadAgent: { include: { user: { select: { id: true, name: true } } } },
                closerAgent: { include: { user: { select: { id: true, name: true } } } },
            },
            orderBy: { date: 'desc' },
        });
    }
    async getSalesSummary() {
        const agg = await this.prisma.transaction.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { totalAmount: true, totalCommission: true },
            _count: true,
        });
        return {
            totalSales: agg._count,
            totalRevenue: agg._sum.totalAmount || 0,
            totalCommission: agg._sum.totalCommission || 0,
            avgDealSize: agg._count > 0 ? (agg._sum.totalAmount || 0) / agg._count : 0,
        };
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], SalesService);


/***/ }),

/***/ "./src/transactions/transactions.controller.ts":
/*!*****************************************************!*\
  !*** ./src/transactions/transactions.controller.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const platform_express_1 = __webpack_require__(/*! @nestjs/platform-express */ "@nestjs/platform-express");
const transactions_service_1 = __webpack_require__(/*! ./transactions.service */ "./src/transactions/transactions.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! src/auth/jwt-auth.guard */ "./src/auth/jwt-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../common/roles.guard */ "./src/common/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../common/roles.decorator */ "./src/common/roles.decorator.ts");
class CreateTransactionDto {
}
class SendCommissionsDto {
}
let TransactionsController = class TransactionsController {
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
    }
    async findAll(month) {
        return this.transactionsService.findAll({ month });
    }
    async getStats() {
        return this.transactionsService.getStats();
    }
    async getUnpaidCommissions(month) {
        return this.transactionsService.getUnpaidCommissions({ month });
    }
    async getPaidCommissions(month) {
        return this.transactionsService.getPaidCommissions({ month });
    }
    async findOne(id) {
        return this.transactionsService.findById(id);
    }
    async create(dto) {
        return this.transactionsService.create(dto);
    }
    async sendCommissions(dto) {
        return this.transactionsService.sendCommissionsForPayment(dto.transactionIds);
    }
    async uploadPaymentProof(file) {
        return this.transactionsService.uploadPaymentProof(file);
    }
    async update(id, dto) {
        return this.transactionsService.update(id, dto);
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("month")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)("commissions/unpaid"),
    __param(0, (0, common_1.Query)("month")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getUnpaidCommissions", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)("commissions/paid"),
    __param(0, (0, common_1.Query)("month")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getPaidCommissions", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)("commissions/send"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SendCommissionsDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "sendCommissions", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)("commissions/payment-proof"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof Express !== "undefined" && (_b = Express.Multer) !== void 0 && _b.File) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "uploadPaymentProof", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof Partial !== "undefined" && Partial) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "update", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, common_1.Controller)("transactions"),
    __metadata("design:paramtypes", [typeof (_a = typeof transactions_service_1.TransactionsService !== "undefined" && transactions_service_1.TransactionsService) === "function" ? _a : Object])
], TransactionsController);


/***/ }),

/***/ "./src/transactions/transactions.module.ts":
/*!*************************************************!*\
  !*** ./src/transactions/transactions.module.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const platform_express_1 = __webpack_require__(/*! @nestjs/platform-express */ "@nestjs/platform-express");
const transactions_controller_1 = __webpack_require__(/*! ./transactions.controller */ "./src/transactions/transactions.controller.ts");
const transactions_service_1 = __webpack_require__(/*! ./transactions.service */ "./src/transactions/transactions.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
const notification_module_1 = __webpack_require__(/*! ../notification/notification.module */ "./src/notification/notification.module.ts");
let TransactionsModule = class TransactionsModule {
};
exports.TransactionsModule = TransactionsModule;
exports.TransactionsModule = TransactionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            notification_module_1.NotificationModule,
            platform_express_1.MulterModule.register({
                dest: './uploads',
            }),
        ],
        controllers: [transactions_controller_1.TransactionsController],
        providers: [transactions_service_1.TransactionsService],
        exports: [transactions_service_1.TransactionsService],
    })
], TransactionsModule);


/***/ }),

/***/ "./src/transactions/transactions.service.ts":
/*!**************************************************!*\
  !*** ./src/transactions/transactions.service.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
const notification_service_1 = __webpack_require__(/*! ../notification/notification.service */ "./src/notification/notification.service.ts");
const serial_id_helper_1 = __webpack_require__(/*! ../common/serial-id.helper */ "./src/common/serial-id.helper.ts");
let TransactionsService = class TransactionsService {
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async getUnpaidCommissions({ month }) {
        return this.findAll({
            status: undefined,
            month,
        }).then(transactions => transactions.filter(t => t.status === 'unpaid' || t.status === 'sent'));
    }
    async getPaidCommissions({ month }) {
        return this.findAll({
            status: undefined,
            month,
        }).then(transactions => transactions.filter(t => t.status === 'paid'));
    }
    async sendCommissionsForPayment(transactionIds) {
        await this.prisma.transaction.updateMany({
            where: { id: { in: transactionIds } },
            data: { commissionPaymentStatus: 'SENT' },
        });
        await this.notificationService.notifyCommissionSent(transactionIds);
        return { message: 'Commissions marked as sent', transactionIds };
    }
    async uploadPaymentProof(file) {
        const sentTransactions = await this.prisma.transaction.findMany({
            where: { commissionPaymentStatus: 'SENT' },
            select: { id: true },
        });
        const transactionIds = sentTransactions.map((tx) => tx.id);
        await this.prisma.transaction.updateMany({
            where: { commissionPaymentStatus: 'SENT' },
            data: { commissionPaymentStatus: 'PAID' },
        });
        await this.notificationService.notifyCommissionsPaid(transactionIds, file?.originalname);
        return { message: 'Payment proof uploaded and commissions marked as paid', fileName: file?.originalname };
    }
    async findAll(filters) {
        const where = {};
        if (filters?.status)
            where.status = filters.status;
        if (filters?.agentId) {
            where.OR = [{ leadAgentId: filters.agentId }, { closerAgentId: filters.agentId }];
        }
        if (filters?.companyId)
            where.companyId = filters.companyId;
        if (filters?.month) {
            const [year, month] = filters.month.split('-');
            const start = new Date(Number(year), Number(month) - 1, 1);
            const end = new Date(Number(year), Number(month), 1);
            where.date = { gte: start, lt: end };
        }
        const transactions = await this.prisma.transaction.findMany({
            where,
            include: {
                asset: { select: { name: true } },
                buyer: { select: { name: true } },
                company: { select: { name: true } },
                leadAgent: { include: { user: { select: { name: true, accountNumber: true } } } },
                closerAgent: { include: { user: { select: { name: true } } } },
                installments: true,
            },
            orderBy: { date: 'desc' },
        });
        return transactions.map(formatDeal);
    }
    async findById(id) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id },
            include: {
                asset: true,
                buyer: { select: { id: true, name: true, email: true } },
                company: true,
                leadAgent: { include: { user: { select: { id: true, name: true } } } },
                closerAgent: { include: { user: { select: { id: true, name: true } } } },
                installments: { orderBy: { dueDate: 'asc' } },
                installmentPlans: true,
                commissions: { include: { agent: { include: { user: { select: { id: true, name: true } } } } } },
            },
        });
        if (!transaction)
            throw new common_1.NotFoundException(`Transaction with ID ${id} not found`);
        return transaction;
    }
    async create(data) {
        if (!data.assetId)
            throw new common_1.BadRequestException('Asset ID is required');
        if (!data.buyerId)
            throw new common_1.BadRequestException('Buyer ID is required');
        if (!data.totalAmount)
            throw new common_1.BadRequestException('Total amount is required');
        const asset = await this.prisma.asset.findUnique({ where: { id: data.assetId } });
        if (!asset)
            throw new common_1.NotFoundException('Asset not found');
        const buyer = await this.prisma.user.findUnique({ where: { id: data.buyerId } });
        if (!buyer)
            throw new common_1.NotFoundException('Buyer not found');
        const serialId = await (0, serial_id_helper_1.generateSerialId)(this.prisma, 'TRN');
        const transaction = await this.prisma.transaction.create({
            data: {
                serialId,
                assetId: data.assetId,
                buyerId: data.buyerId,
                totalAmount: parseFloat(data.totalAmount),
                companyId: data.companyId || asset.companyId || null,
                paymentType: data.paymentType || null,
                leadAgentId: data.leadAgentId || null,
                closerAgentId: data.closerAgentId || null,
                leadCommission: data.leadCommission ? parseFloat(data.leadCommission) : 0,
                closerCommission: data.closerCommission ? parseFloat(data.closerCommission) : 0,
                totalCommission: data.totalCommission ? parseFloat(data.totalCommission) : 0,
                commission: data.commission ? parseFloat(data.commission) : 0,
                status: data.status || client_1.CommissionPaymentStatus.UNPAID,
                commissionPaymentStatus: data.commissionPaymentStatus || client_1.CommissionPaymentStatus.UNPAID,
                installmentDuration: data.installmentDuration ? parseInt(data.installmentDuration) : null,
            },
            include: {
                asset: { select: { id: true, name: true } },
                buyer: { select: { id: true, name: true } },
                company: { select: { id: true, name: true } },
            },
        });
        await this.notificationService.notifyDealCreated(transaction.id);
        if ((transaction.paymentType || '').toLowerCase() === 'installment') {
            await this.notificationService.notifyDealPaymentReady(transaction.id);
        }
        await this.notificationService.notifyAdminAndSales({
            title: 'New Deal Created',
            message: `A new deal for "${transaction.asset?.name || 'an asset'}" worth ₦${transaction.totalAmount.toLocaleString()} has been created.`,
            type: 'INFO',
        });
        return transaction;
    }
    async update(id, data) {
        await this.findById(id);
        const updateData = {};
        if (data.status !== undefined)
            updateData.status = data.status;
        if (data.commissionPaymentStatus !== undefined)
            updateData.commissionPaymentStatus = data.commissionPaymentStatus;
        if (data.leadAgentId !== undefined)
            updateData.leadAgentId = data.leadAgentId;
        if (data.closerAgentId !== undefined)
            updateData.closerAgentId = data.closerAgentId;
        if (data.totalAmount !== undefined)
            updateData.totalAmount = parseFloat(data.totalAmount);
        if (data.paymentType !== undefined)
            updateData.paymentType = data.paymentType;
        if (data.companyId !== undefined)
            updateData.companyId = data.companyId;
        const updated = await this.prisma.transaction.update({
            where: { id },
            data: updateData,
            include: {
                asset: { select: { id: true, name: true } },
                company: { select: { id: true, name: true } },
            },
        });
        if (data.commissionPaymentStatus === 'SENT') {
            await this.notificationService.notifyCommissionSent([id]);
        }
        if (data.commissionPaymentStatus === 'PAID') {
            await this.notificationService.notifyCommissionsPaid([id]);
        }
        if (data.status === 'COMPLETED') {
            await this.notificationService.notifyDealClosed(id);
            await this.notificationService.notifyAdminAndSales({
                title: 'Deal Completed',
                message: `Deal "${updated.asset?.name || 'unknown asset'}" has been marked as completed.`,
                type: 'SUCCESS',
            });
        }
        return updated;
    }
    async delete(id) {
        await this.findById(id);
        await this.prisma.transaction.delete({ where: { id } });
        return { message: 'Transaction deleted successfully', id };
    }
    async getStats(filters) {
        const where = { status: 'COMPLETED' };
        if (filters?.startDate)
            where.date = { ...where.date, gte: new Date(filters.startDate) };
        if (filters?.endDate)
            where.date = { ...where.date, lte: new Date(filters.endDate) };
        const [total, revenue, commissions] = await Promise.all([
            this.prisma.transaction.count({ where }),
            this.prisma.transaction.aggregate({ where, _sum: { totalAmount: true } }),
            this.prisma.transaction.aggregate({ where, _sum: { totalCommission: true } }),
        ]);
        return {
            totalTransactions: total,
            totalRevenue: revenue._sum.totalAmount || 0,
            totalCommissions: commissions._sum.totalCommission || 0,
            avgDealSize: total > 0 ? (revenue._sum.totalAmount || 0) / total : 0,
        };
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _b : Object])
], TransactionsService);
function formatDeal(tx) {
    return {
        id: tx.id,
        serialId: tx.serialId ?? "",
        leadName: tx.buyer?.name ?? tx.leadAgent?.user?.name ?? "",
        buyer: tx.buyer?.name ?? "",
        leadAgent: tx.leadAgent?.user?.name ?? "",
        closerAgent: tx.closerAgent?.user?.name ?? "",
        accountNumber: tx.leadAgent?.user?.accountNumber ?? "",
        company: tx.company?.name ?? "",
        asset: tx.asset?.name ?? "",
        propertyValue: tx.totalAmount ? `₦${tx.totalAmount.toLocaleString()}` : "",
        amount: tx.totalAmount ?? 0,
        commission: tx.commission,
        totalCommission: tx.totalCommission ? `₦${tx.totalCommission.toLocaleString()}` : "",
        leadCommission: tx.leadCommission ? `₦${tx.leadCommission.toLocaleString()}` : "",
        closerCommission: tx.closerCommission ? `₦${tx.closerCommission.toLocaleString()}` : "",
        commissionType: tx.leadAgentId && tx.closerAgentId
            ? (tx.leadAgentId === tx.closerAgentId ? "split" : "lead")
            : "lead",
        status: tx.commissionPaymentStatus?.toLowerCase() ?? "unpaid",
        eligibility: tx.commissionPaymentStatus === "PAID" ? "Eligible" : "Not Eligible",
        payoutDate: tx.updatedAt?.toISOString().split("T")[0],
        date: tx.date?.toISOString().split("T")[0] ?? tx.updatedAt?.toISOString().split("T")[0],
        paymentType: tx.paymentType === "installment" ? "installment" : "full",
        paymentPlan: tx.paymentType === "installment"
            ? {
                type: "installment",
                numberOfInstallments: tx.installments?.length ?? 0,
            }
            : null,
        commissionBreakdown: (tx.installments ?? []).map((inst, idx) => ({
            installmentId: inst.id,
            installmentNumber: inst.installmentNumber ?? idx + 1,
            leadCommission: inst.leadCommission ?? 0,
            closerCommission: inst.closerCommission ?? 0,
            totalCommission: (inst.leadCommission ?? 0) + (inst.closerCommission ?? 0),
            status: inst.status === "PAID" ? "earned" : (inst.status === "PENDING" ? "pending" : "scheduled"),
            earnedDate: inst.paidDate ?? null,
        })),
    };
}


/***/ }),

/***/ "./src/users/users.controller.ts":
/*!***************************************!*\
  !*** ./src/users/users.controller.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = exports.CreateUserDto = exports.UpdatePasswordDto = exports.UpdateUserDto = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_auth_guard_1 = __webpack_require__(/*! src/auth/jwt-auth.guard */ "./src/auth/jwt-auth.guard.ts");
const users_service_1 = __webpack_require__(/*! ./users.service */ "./src/users/users.service.ts");
const roles_guard_1 = __webpack_require__(/*! ../common/roles.guard */ "./src/common/roles.guard.ts");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class UpdateUserDto {
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "timezone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "dateFormat", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "emailNotifications", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "pushNotifications", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "transactionAlerts", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "weeklyReports", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "agentUpdates", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "homeAddress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "nin", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "stateOfOrigin", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "dateOfRecruitment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "kinFullName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "kinPhoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "kinRelationship", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "kinAddress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "bankName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "accountNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "beneficiaryName", void 0);
class UpdatePasswordDto {
}
exports.UpdatePasswordDto = UpdatePasswordDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], UpdatePasswordDto.prototype, "newPassword", void 0);
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters' }),
    (0, class_validator_1.Matches)(/^(?=.*[0-9])(?=.*[!@#$%^&*])/, {
        message: 'Password must include at least one number and one special character',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^(ADMIN|TEAM_LEAD|AGENT|FREELANCER|INVESTOR|USER)$/i, {
        message: 'Role must be one of: ADMIN, TEAM_LEAD, AGENT, FREELANCER, INVESTOR, USER',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^(ACTIVE|INACTIVE|PENDING)$/i, {
        message: 'Status must be one of: ACTIVE, INACTIVE, PENDING',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async findAll(role, status, search) {
        return this.usersService.findAll({ role, status, search });
    }
    async getProfile(req) {
        return this.usersService.findById(req.user.id);
    }
    async updateProfile(req, dto) {
        return this.usersService.updateUser(req.user.id, dto);
    }
    async findOne(id, req) {
        if (req.user.role !== "ADMIN" && req.user.id !== id) {
            throw new Error("Unauthorized to view this profile");
        }
        return this.usersService.findById(id);
    }
    async findByEmail(email) {
        return this.usersService.findByEmail(email);
    }
    async getUserStats(id, req) {
        if (req.user.role !== "ADMIN" && req.user.id !== id) {
            throw new Error("Unauthorized to view these statistics");
        }
        return this.usersService.getUserStats(id);
    }
    async getUserActivity(id, limit, req) {
        if (req.user.role !== "ADMIN" && req.user.id !== id) {
            throw new Error("Unauthorized to view this activity");
        }
        const activityLimit = limit ? parseInt(limit) : 20;
        return this.usersService.getUserActivity(id, activityLimit);
    }
    async getUserTransactions(id, req) {
        if (req.user.role !== "ADMIN" && req.user.id !== id) {
            throw new Error("Unauthorized to view these transactions");
        }
        return this.usersService.getUserTransactions(id);
    }
    async getUserLeads(id, req) {
        if (req.user.role !== "ADMIN" && req.user.id !== id) {
            throw new Error("Unauthorized to view these leads");
        }
        return this.usersService.getUserLeads(id);
    }
    async create(dto) {
        return this.usersService.createUser(dto);
    }
    async update(id, dto, req) {
        if (req.user.role !== "ADMIN") {
            if (req.user.id !== id) {
                throw new Error("Unauthorized to update this profile");
            }
            delete dto.role;
        }
        return this.usersService.updateUser(id, dto);
    }
    async updateRole(id, role) {
        return this.usersService.updateUserRole(id, role);
    }
    async updatePassword(id, dto) {
        return this.usersService.updateUserPassword(id, dto.newPassword);
    }
    async deactivate(id) {
        return this.usersService.deactivateUser(id);
    }
    async reactivate(id) {
        return this.usersService.reactivateUser(id);
    }
    async remove(id) {
        return this.usersService.deleteUser(id);
    }
    async getUsersByRole(role) {
        return this.usersService.getUsersByRole(role);
    }
    async getUserDashboard(id, req) {
        if (req.user.role !== "ADMIN" && req.user.id !== id) {
            throw new Error("Unauthorized to view this dashboard");
        }
        return this.usersService.getUserDashboard(id);
    }
    async getAllAgents() {
        return this.usersService.getAllAgents();
    }
    async getAllInvestors() {
        return this.usersService.getAllInvestors();
    }
    async searchUsers(query, role) {
        return this.usersService.searchUsers(query, role);
    }
    async getUserCountByRole() {
        return this.usersService.getUserCountByRole();
    }
    async bulkCreate(users) {
        return this.usersService.bulkCreateUsers(users);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("role")),
    __param(1, (0, common_1.Query)("status")),
    __param(2, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("me"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)("me"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)("email/:email"),
    __param(0, (0, common_1.Param)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findByEmail", null);
__decorate([
    (0, common_1.Get)(":id/stats"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserStats", null);
__decorate([
    (0, common_1.Get)(":id/activity"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserActivity", null);
__decorate([
    (0, common_1.Get)(":id/transactions"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserTransactions", null);
__decorate([
    (0, common_1.Get)(":id/leads"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserLeads", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(":id/role"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Put)(":id/password"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdatePasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Post)(":id/deactivate"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Post)(":id/reactivate"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "reactivate", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)("by-role/:role"),
    __param(0, (0, common_1.Param)("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsersByRole", null);
__decorate([
    (0, common_1.Get)(":id/dashboard"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserDashboard", null);
__decorate([
    (0, common_1.Get)("agents/all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllAgents", null);
__decorate([
    (0, common_1.Get)("investors/all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllInvestors", null);
__decorate([
    (0, common_1.Get)("search/query"),
    __param(0, (0, common_1.Query)("q")),
    __param(1, (0, common_1.Query)("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "searchUsers", null);
__decorate([
    (0, common_1.Get)("count/by-role"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserCountByRole", null);
__decorate([
    (0, common_1.Post)("bulk-create"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)("users")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "bulkCreate", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)("users"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], UsersController);


/***/ }),

/***/ "./src/users/users.module.ts":
/*!***********************************!*\
  !*** ./src/users/users.module.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const users_controller_1 = __webpack_require__(/*! ./users.controller */ "./src/users/users.controller.ts");
const users_service_1 = __webpack_require__(/*! ./users.service */ "./src/users/users.service.ts");
const prisma_module_1 = __webpack_require__(/*! ../prisma/prisma.module */ "./src/prisma/prisma.module.ts");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService],
    })
], UsersModule);


/***/ }),

/***/ "./src/users/users.service.ts":
/*!************************************!*\
  !*** ./src/users/users.service.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../prisma/prisma.service */ "./src/prisma/prisma.service.ts");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll({ role, status, search } = {}) {
        let where = {};
        if (role && Object.values(client_1.UserRole).includes(role)) {
            where.role = role;
        }
        if (status) {
            where.status = status;
        }
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }
        return this.prisma.user.findMany({
            where,
            select: {
                id: true,
                serialId: true,
                email: true,
                name: true,
                role: true,
                status: true,
                phone: true,
                createdAt: true,
                agentProfile: {
                    select: {
                        id: true,
                        closedDeals: true,
                        totalCommission: true,
                        status: true,
                        cluster: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                freelancerProfile: {
                    select: {
                        id: true,
                        activeDeals: true,
                        closedDeals: true,
                        totalCommission: true,
                        registrarName: true,
                        registrarType: true,
                        status: true,
                        cluster: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                managedClusters: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        status: true,
                        location: true,
                    },
                },
                transactions: {
                    select: {
                        id: true,
                        totalAmount: true,
                        status: true,
                        date: true,
                        asset: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                                location: true,
                            },
                        },
                    },
                    orderBy: { date: 'desc' },
                    take: 5,
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                agentProfile: {
                    include: {
                        cluster: true,
                        assignedLeads: {
                            orderBy: { createdAt: 'desc' },
                            take: 50,
                        },
                        leadTransactions: {
                            orderBy: { date: 'desc' },
                            take: 20,
                        },
                        closerTransactions: {
                            orderBy: { date: 'desc' },
                            take: 20,
                        },
                    },
                },
                freelancerProfile: {
                    include: { cluster: true },
                },
                notifications: { orderBy: { createdAt: 'desc' }, take: 10 },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async getUserTransactions(userId) {
        return this.prisma.transaction.findMany({
            where: { buyerId: userId },
            include: {
                asset: {
                    select: { id: true, name: true, type: true, location: true },
                },
                leadAgent: { include: { user: { select: { id: true, name: true } } } },
                closerAgent: { include: { user: { select: { id: true, name: true } } } },
                installments: true,
            },
            orderBy: { date: 'desc' },
        });
    }
    async getUserStats(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.role === 'AGENT') {
            const agent = await this.prisma.agent.findUnique({ where: { userId } });
            if (!agent)
                return { closedDeals: 0, totalCommission: 0, assignedLeads: 0 };
            const [leadCount, leadTxCount, closerTxCount] = await Promise.all([
                this.prisma.lead.count({ where: { assignedToId: agent.id } }),
                this.prisma.transaction.count({ where: { leadAgentId: agent.id, status: 'COMPLETED' } }),
                this.prisma.transaction.count({ where: { closerAgentId: agent.id, status: 'COMPLETED' } }),
            ]);
            return {
                assignedLeads: leadCount,
                closedDeals: leadTxCount + closerTxCount,
                totalCommission: agent.totalCommission,
            };
        }
        if (user.role === 'INVESTOR') {
            const stats = await this.prisma.transaction.aggregate({
                where: { buyerId: userId },
                _sum: { totalAmount: true },
                _count: true,
            });
            return {
                totalInvested: stats._sum.totalAmount || 0,
                totalTransactions: stats._count,
            };
        }
        const [totalUsers, totalTransactions, revenueAgg] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.transaction.count({ where: { status: 'COMPLETED' } }),
            this.prisma.transaction.aggregate({
                where: { status: 'COMPLETED' },
                _sum: { totalAmount: true },
            }),
        ]);
        return {
            totalUsers,
            totalTransactions,
            totalRevenue: revenueAgg._sum.totalAmount || 0,
        };
    }
    async updateUser(id, dto) {
        const updateData = {};
        if (dto.name !== undefined)
            updateData.name = dto.name;
        if (dto.email !== undefined)
            updateData.email = dto.email;
        if (dto.phone !== undefined)
            updateData.phone = dto.phone;
        if (dto.role !== undefined)
            updateData.role = dto.role;
        if (dto.timezone !== undefined)
            updateData.timezone = dto.timezone;
        if (dto.dateFormat !== undefined)
            updateData.dateFormat = dto.dateFormat;
        if (dto.currency !== undefined)
            updateData.currency = dto.currency;
        if (dto.emailNotifications !== undefined)
            updateData.emailNotifications = dto.emailNotifications;
        if (dto.pushNotifications !== undefined)
            updateData.pushNotifications = dto.pushNotifications;
        if (dto.transactionAlerts !== undefined)
            updateData.transactionAlerts = dto.transactionAlerts;
        if (dto.weeklyReports !== undefined)
            updateData.weeklyReports = dto.weeklyReports;
        if (dto.agentUpdates !== undefined)
            updateData.agentUpdates = dto.agentUpdates;
        if (dto.gender !== undefined)
            updateData.gender = dto.gender;
        if (dto.dateOfBirth !== undefined)
            updateData.dateOfBirth = dto.dateOfBirth ? new Date(dto.dateOfBirth) : null;
        if (dto.homeAddress !== undefined)
            updateData.homeAddress = dto.homeAddress;
        if (dto.nin !== undefined)
            updateData.nin = dto.nin;
        if (dto.stateOfOrigin !== undefined)
            updateData.stateOfOrigin = dto.stateOfOrigin;
        if (dto.dateOfRecruitment !== undefined)
            updateData.dateOfRecruitment = dto.dateOfRecruitment ? new Date(dto.dateOfRecruitment) : null;
        if (dto.kinFullName !== undefined)
            updateData.kinFullName = dto.kinFullName;
        if (dto.kinPhoneNumber !== undefined)
            updateData.kinPhoneNumber = dto.kinPhoneNumber;
        if (dto.kinRelationship !== undefined)
            updateData.kinRelationship = dto.kinRelationship;
        if (dto.kinAddress !== undefined)
            updateData.kinAddress = dto.kinAddress;
        if (dto.bankName !== undefined)
            updateData.bankName = dto.bankName;
        if (dto.accountNumber !== undefined)
            updateData.accountNumber = dto.accountNumber;
        if (dto.beneficiaryName !== undefined)
            updateData.beneficiaryName = dto.beneficiaryName;
        return this.prisma.user.update({ where: { id }, data: updateData });
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
    async getUserActivity(id, limit) {
        return this.prisma.notification.findMany({ where: { userId: id }, take: limit, orderBy: { createdAt: 'desc' } });
    }
    async getUserLeads(id) {
        return this.prisma.lead.findMany({ where: { assignedToId: id } });
    }
    async createUser(dto) {
        if (!dto.status || !['ACTIVE', 'INACTIVE', 'PENDING'].includes(dto.status.toUpperCase())) {
            throw new Error('User status is required and must be one of: ACTIVE, INACTIVE, PENDING');
        }
        return this.prisma.user.create({ data: { ...dto, status: dto.status.toUpperCase() } });
    }
    async updateUserRole(id, role) {
        if (!Object.values(client_1.UserRole).includes(role)) {
            throw new Error('Invalid role');
        }
        return this.prisma.user.update({ where: { id }, data: { role: role } });
    }
    async updateUserPassword(id, newPassword) {
        return this.prisma.user.update({ where: { id }, data: { password: newPassword } });
    }
    async deactivateUser(id) {
        throw new Error('User model does not have a status field');
    }
    async reactivateUser(id) {
        throw new Error('User model does not have a status field');
    }
    async deleteUser(id) {
        return this.prisma.user.delete({ where: { id } });
    }
    async getUsersByRole(role) {
        if (!Object.values(client_1.UserRole).includes(role)) {
            throw new Error('Invalid role');
        }
        return this.prisma.user.findMany({ where: { role: role } });
    }
    async getUserDashboard(id) {
        return { userId: id, dashboard: 'stub' };
    }
    async getAllAgents() {
        return this.prisma.user.findMany({ where: { role: client_1.UserRole.AGENT } });
    }
    async getAllInvestors() {
        return this.prisma.user.findMany({ where: { role: client_1.UserRole.INVESTOR } });
    }
    async searchUsers(query, role) {
        let where = {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
            ],
        };
        if (role && Object.values(client_1.UserRole).includes(role)) {
            where.role = role;
        }
        return this.prisma.user.findMany({ where });
    }
    async getUserCountByRole() {
        return this.prisma.user.groupBy({ by: ['role'], _count: { role: true } });
    }
    async bulkCreateUsers(users) {
        return this.prisma.user.createMany({ data: users });
    }
    async delete(id) {
        return this.prisma.user.delete({ where: { id } });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], UsersService);


/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/passport":
/*!***********************************!*\
  !*** external "@nestjs/passport" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/platform-express":
/*!*******************************************!*\
  !*** external "@nestjs/platform-express" ***!
  \*******************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/platform-express");

/***/ }),

/***/ "@nestjs/schedule":
/*!***********************************!*\
  !*** external "@nestjs/schedule" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/schedule");

/***/ }),

/***/ "@prisma/adapter-pg":
/*!*************************************!*\
  !*** external "@prisma/adapter-pg" ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@prisma/adapter-pg");

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@prisma/client");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("bcrypt");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "class-transformer":
/*!************************************!*\
  !*** external "class-transformer" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("class-transformer");

/***/ }),

/***/ "class-validator":
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("class-validator");

/***/ }),

/***/ "dotenv/config":
/*!********************************!*\
  !*** external "dotenv/config" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("dotenv/config");

/***/ }),

/***/ "exceljs":
/*!**************************!*\
  !*** external "exceljs" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("exceljs");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),

/***/ "multer":
/*!*************************!*\
  !*** external "multer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("multer");

/***/ }),

/***/ "nodemailer":
/*!*****************************!*\
  !*** external "nodemailer" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = require("nodemailer");

/***/ }),

/***/ "passport-jwt":
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("passport-jwt");

/***/ }),

/***/ "pg":
/*!*********************!*\
  !*** external "pg" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("pg");

/***/ }),

/***/ "twilio":
/*!*************************!*\
  !*** external "twilio" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("twilio");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! dotenv/config */ "dotenv/config");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const path_1 = __webpack_require__(/*! path */ "path");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./src/app.module.ts");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });
    const frontendOrigins = process.env.FRONTEND_ORIGINS
        ? process.env.FRONTEND_ORIGINS.split(",").map((o) => o.trim())
        : ["http://localhost:5173"];
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (process.env.NODE_ENV !== 'production') {
                return callback(null, true);
            }
            if (frontendOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'), false);
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const port = process.env.PORT || 8080;
    await app.listen(port);
    console.log(`Server listening on ${port}`);
}
bootstrap();

})();

/******/ })()
;