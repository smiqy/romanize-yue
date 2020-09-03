"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var fs = require('fs');

var pathEmc = "rime-middle-chinese/zyenpheng.dict.yaml";
var textEmc = fs.readFileSync(pathEmc, "utf8");

var reduceReplace = function reduceReplace(s, xys) {
  return xys.reduce(function (acc, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        x = _ref2[0],
        y = _ref2[1];

    return acc.replace(x, y);
  }, s);
};

var textEmcNew = textEmc.split("\n").filter(function (line) {
  return /^(?:[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DB5\u4E00-\u9FEF\uF900-\uFA6D\uFA70-\uFAD9]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D])\t/g.test(line);
}).slice(31).join("\n").replace(/[a-z']+/g, function (match) {
  var tone = 0;
  var syllable = match;

  if (/x$/.test(syllable)) {
    tone = 1;
    syllable = syllable.slice(0, -1);
  } else if (/h$/.test(syllable)) {
    tone = 2;
    syllable = syllable.slice(0, -1);
  } else if (/d$/.test(syllable)) tone = 2;else if (/[ktp]$/.test(syllable)) tone = 3;

  syllable = [[/ng/g, "ŋ"], [/k$/, "ŋ"], [/t$/, "n"], [/p$/, "m"], [/h/, "x"], [/^z(?!s)/, "ʣ"], [/^c/, "ʦ"], [/^zs/, "z"], [/^gx/, "h"], [/(?<!^)xr/, "rx"], [/xj/, "jx"], [/^k/, "c"], [/xj/, "j"], [/xj/, "jx"]].reduce(function (acc, _ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        x = _ref4[0],
        y = _ref4[1];

    return acc.replace(x, y);
  }, syllable);
  return (syllable + tone).normalize("NFC");
});
var emc = {};
textEmcNew.split("\n").map(function (line) {
  return line.trim().split("\t");
}).filter(function (_ref5) {
  var _ref6 = _slicedToArray(_ref5, 1),
      character = _ref6[0];

  return character.length == 1;
}).map(function (_ref7) {
  var _ref8 = _slicedToArray(_ref7, 3),
      character = _ref8[0],
      phonetic = _ref8[1],
      percentage = _ref8[2];

  if (!percentage || parseInt(percentage.match(/(\d+)%/)) >= 30) {
    var row = phonetic.match(/(.+)(\d)/).slice(1);
    if (emc[character]) emc[character].push(row);else emc[character] = [row];
  }
});
fs.writeFileSync("../docs/romanization-emc.js", "const mapEmc = {\n".concat(Object.entries(emc).map(function (_ref9) {
  var _ref10 = _slicedToArray(_ref9, 2),
      character = _ref10[0],
      phonetics = _ref10[1];

  return "  \"".concat(character, "\": [").concat(phonetics.map(function (_ref11) {
    var _ref12 = _slicedToArray(_ref11, 2),
        syllable = _ref12[0],
        tone = _ref12[1];

    return "\"".concat(syllable.replace(/j/g, "ȷ").replace(/i/g, "ı")).concat("\u0304\u0301\u0300\u030D".charAt(parseInt(tone)), "\"");
  }).join(", "), "]");
}).join(",\n"), "\n};"));
pathYue = "jyutping-table/list.tsv";
textYue = fs.readFileSync(pathYue, "utf8");

var voice = function voice(c) {
  return {
    g: "c",
    d: "t",
    ʣ: "ʦ",
    b: "p"
  }[c];
};

var yue = {};
textYue.trim().split("\r\n").slice(1).map(function (line) {
  var _line$split = line.split("\t"),
      _line$split2 = _slicedToArray(_line$split, 6),
      character = _line$split2[0],
      unicode = _line$split2[1],
      phonetic = _line$split2[2],
      initial = _line$split2[3],
      tail = _line$split2[4],
      tone = _line$split2[5];

  var syllable = phonetic.replace(/[1-6]$/, "");

  if (syllable.split(" ").length == 1 && (!/[ktp]$/.test(syllable) || ["1", "3", "6"].includes(tone)) && syllable != "ngm") {
    if (/[ktp]$/.test(syllable)) {
      tone = {
        "1": "7",
        "3": "7",
        "6": "8"
      }[tone];
      syllable = syllable.replace(/k$/, "ng").replace(/t$/, "n").replace(/p$/, "m");
    }

    syllable = syllable // pre
    .replace(/^k/, "kh").replace(/^t/, "th").replace(/^c/, "ch").replace(/^p/, "ph").replace(/^g/, "k").replace(/^d/, "t").replace(/^z/, "c").replace(/^b/, "p") // main
    .replace(/ng/g, "ŋ").replace(/yu/, "y").replace(/oe|eo/, "ø").replace(/j(?=[iyø])/, "").replace(/w/, "v").replace(/v(?=u)/, "").replace(/a/g, "ə").replace(/əə/, "a").replace(/c/, "ʦ").replace(/z/, "ʣ").replace(/k/g, "c").replace(/h/, "x");
    tone = tone;
    if (["1", "2", "3", "7"].includes(tone)) syllable = syllable.replace(/^(?=[ŋnmljviyueøoəa])/, "q");else syllable = syllable.replace(/^s/, "z").replace(/^x/, "h").replace(/^f/, "w").replace(/^p/, "b").replace(/^c/, "g").replace(/^t/, "d").replace(/^ʦ/, "ʣ");
    tone = {
      "1": 0,
      "2": 1,
      "3": 2,
      "4": 0,
      "5": 1,
      "6": 2,
      "7": 3,
      "8": 3
    }[tone]; // historical conversion {

    var emcs = emc[character];

    if (emcs && emcs.length >= 1) {
      var _loop = function _loop() {
        var nasal = _arr2[_i2];

        if (emcs.some(function (emc) {
          return new RegExp("^" + nasal).test(emc[0]);
        })) {
          syllable = syllable.replace(/(?<=^q?)(?=[iyueøoaəjv])/, "".concat(nasal, "\u2019"));
          return "break";
        }
      };

      for (var _i2 = 0, _arr2 = ["ŋ", "n", "m"]; _i2 < _arr2.length; _i2++) {
        var _ret = _loop();

        if (_ret === "break") break;
      }

      syllable = syllable.replace(/n’j/, "nj").replace(/(?<=n)’(?=[iyø])/, "j").replace(/(?<=ŋ)’(?=[iyj])/, "");

      var _loop2 = function _loop2() {
        var _arr3$_i = _slicedToArray(_arr3[_i3], 3),
            x = _arr3$_i[0],
            y = _arr3$_i[1],
            z = _arr3$_i[2];

        if (emcs.every(function (emc) {
          return x.test(emc[0]);
        }) && y.test(syllable)) {
          syllable = syllable.replace(y, z);
          return "break";
        }
      };

      for (var _i3 = 0, _arr3 = [[/^[dtʣʦzs]j/, /(?<=^[ʣʦzs])/, "j"], [/^[dtʣʦzs]r/, /(?<=^[ʣʦzs])/, "r"], //, [/^px/, /^f/, "pvx"]
      //, [/^p/, /^f/, "pv"]
      //, [/^b/, /^f/, "pv"]
      //, [/^px/, /^w/, "bvx"]
      //, [/^p/, /^w/, "bv"]
      //, [/^b/, /^w/, "bv"]
      [/^[gchx]/, /^f/, "xv"], [/^[gchx]/, /^w/, "hv"], [/^[gcxh]/, /(?=^[iyueøoəajv])/, "h’"], [/^[gcxh]/, /^q(?=[iyueøoəajv])/, "x’"]]; _i3 < _arr3.length; _i3++) {
        var _ret2 = _loop2();

        if (_ret2 === "break") break;
      }
      /*
      for(const [x, y, z] of
        [ [/^cx/, /^x/, "cx’x"]
        , [/^cx/, /^h/, "cx’h"]
        , [/^c/, /^x/, "c’x"]
        , [/^c/, /^h/, "c’h"]
        , [/^g/, /^x/, "g’x"]
        , [/^g/, /^h/, "g’h"]
        ])
        if(emcs.some(emc => x.test(emc[0])) && y.test(syllable)) {
          syllable = syllable.replace(y, z);
          break;
        }
      */


      syllable = syllable.replace(/(?<=^h)’(?=[jvy])/, "").replace(/’(?=u)/, "v").replace(/(?<=[xh])v(?=u)/, "").replace(/’(?=[iyø])/, "j").replace(/(?<=^[xnm])’(?=j)/, "").replace(/(?<=^ŋ)’(?=[jiyø])/, "").replace(/(?<=[ŋnm])’(?=v)/, "").replace(/(?<=ŋ)’(?=[iyueøoəa])/, "");
    } // } historical conversion


    syllable = syllable.replace(/(?<!^)xv/, "vx").replace(/(?<!^)xj/, "jx").replace(/(?<!^)xr/, "rx");
    /*
    syllable = syllable
      .replace(/^ʣ[jr]/g, "ʤ")
      .replace(/^ʦ[jr]/g, "ʧ")
      .replace(/^z[jr]/g, "ʒ")
      .replace(/^s[jr]/g, "ʃ")
    */

    if (true) syllable = syllable.replace(/j/, "ȷ").replace(/i/, "ı");else syllable = [[/b/g, "б"], [/p/g, "п"], [/m/g, "м"], [/f/g, "ф"], [/w/g, "в"], [/v/g, "ъ"], [/d/g, "д"], [/t/g, "т"], [/n/g, "н"], [/l/g, "л"], [/r/g, "р"], [/ʣ/g, "ѕ"], [/ʦ/g, "ц"], [/z/g, "з"], [/s/g, "с"], [/ʤ/g, "җ"], [/ʧ/g, "щ"], [/ʒ/g, "ж"], [/ʃ/g, "ш"], [/g/g, "г"], [/c/g, "к"], [/ŋ/g, "ӈ"], [/x/g, "х"], [/h/g, "ғ"], [/q/g, "ҁ"], [/j/g, "ь"][(/i/g, "и")], [/y/g, "ѵ"], [/u/g, "у"], [/e/g, "є"], [/ø/g, "е"], [/o/g, "о"], [/ə/g, "э"], [/a/g, "а"]].reduce(function (acc, _ref13) {
      var _ref14 = _slicedToArray(_ref13, 2),
          x = _ref14[0],
          y = _ref14[1];

      return acc.replace(x, y);
    }, syllable);
    phonetic = syllable + ["\u0300", "\u0301", "\u0304", "\u030D"][tone];
    if ( //(! /[gdʣb]x|q[ŋnml]/.test(syllable)) &&
    !emcs || (!/^q?ŋ/.test(syllable) || emcs.some(function (emc) {
      return /^ŋ/.test(emc[0]);
    })) && (!/^q?n/.test(syllable) || emcs.some(function (emc) {
      return /^n/.test(emc[0]);
    })) && (!/^q?m/.test(syllable) || emcs.some(function (emc) {
      return /^m/.test(emc[0]);
    }))) if (yue[character]) {
      if (yue[character].includes(phonetic) || yue[character].some(function (element) {
        return element.replace(/.$/, "") == phonetic.replace(/q(?=[ŋnml])/, "").replace(/.$/, "");
      }) || yue[character].some(function (element) {
        return element.replace(/.$/, "") == phonetic.replace(/(?<=[gdʣb][rj]?)x/, "").replace(/.$/, "");
      }) || yue[character].some(function (element) {
        return element.replace(/.$/, "") == phonetic.replace(/^./, voice).replace(/.$/, "");
      }) || yue[character].some(function (element) {
        return element == phonetic.replace(/^l/, "n");
      }) || yue[character].some(function (element) {
        return element.replace(/.$/, "") == phonetic.replace(/^ql(.+).$/, "n$1");
      }) || yue[character].includes(phonetic.replace(/(?<=[cg]x?)/, "v"))) void 0;else yue[character].push(phonetic);
    } else yue[character] = [phonetic];
  }
});
fs.writeFileSync("../docs/romanization-yue.js", "const mapYue = {\n".concat(Object.entries(yue).map(function (_ref15) {
  var _ref16 = _slicedToArray(_ref15, 2),
      character = _ref16[0],
      phonetics = _ref16[1];

  return "  \"".concat(character, "\": [").concat(phonetics.map(function (phonetic) {
    return "\"".concat(phonetic, "\"");
  }).join(", "), "]");
}).join(",\n"), "\n};"));

var yueToSimple = function yueToSimple(phonetic) {
  var _phonetic$normalize$m = phonetic.normalize("NFD").match(/(.+)(.)/),
      _phonetic$normalize$m2 = _slicedToArray(_phonetic$normalize$m, 3),
      _ = _phonetic$normalize$m2[0],
      syllable = _phonetic$normalize$m2[1],
      tone = _phonetic$normalize$m2[2];

  syllable = syllable.replace(/ı/g, "i").replace(/ȷ/g, "j");
  /*
  if(/^[bwmdznlʣghŋjviyueøoəa]/.test(syllable))
    tone = " " + {
      "\u0300": "\u0316",
      "\u0301": "\u0317",
      "\u0304": "\u0331",
      "\u030D": "\u0329",
    }[tone]
  */

  tone = (/^[bwmdznlʣghŋjviyueøoəa]/.test(syllable) ? ["\u0300", "\u030C", "\u1DC5", "\u030F"] : ["\u0302", "\u0301", "\u0304", "\u030B"])[["\u0300", "\u0301", "\u0304", "\u030D"].indexOf(tone)];
  syllable = syllable.replace(/g/g, "c").replace(/h/g, "x").replace(/d/g, "t").replace(/ʣ/g, "ʦ").replace(/z/g, "s").replace(/b/g, "p").replace(/w/g, "f").replace(/q/g, "").replace(/c(?!x)/g, "g").replace(/t(?!x)/g, "d").replace(/ʦ(?![jr]?x)/g, "ʣ").replace(/p(?!x)/g, "b").replace(/(?<=(c|t|ʦ[jr]|p))x/g, "").replace(/ʣ/g, "z").replace(/c/g, "k").replace(/ʦ/g, "c").replace(/z[jr]/g, "ᵶ").replace(/c[jr]/g, "ꞓ").replace(/s[jr]/g, "ꞩ").replace(/i/g, "ı").replace(/j/g, "ȷ");
  return (syllable + tone).normalize("NFC");
};

fs.writeFileSync("../docs/romanization-yue-simple.js", "const mapYueSimple = {\n".concat(Object.entries(yue).map(function (_ref17) {
  var _ref18 = _slicedToArray(_ref17, 2),
      character = _ref18[0],
      phonetics = _ref18[1];

  return "  \"".concat(character, "\": [").concat(phonetics.map(function (phonetic) {
    return "\"".concat(yueToSimple(phonetic), "\"");
  }).join(", "), "]");
}).join(",\n"), "\n};"));

var yueToIpa = function yueToIpa(phonetic) {
  var _phonetic$normalize$m3 = phonetic.normalize("NFD").match(/(.+)(.)/),
      _phonetic$normalize$m4 = _slicedToArray(_phonetic$normalize$m3, 3),
      _ = _phonetic$normalize$m4[0],
      syllable = _phonetic$normalize$m4[1],
      tone = _phonetic$normalize$m4[2];

  syllable = syllable.replace(/ı/g, "i").replace(/ȷ/g, "j");
  tone = ["\u0300", "\u0301", "\u0304", "\u030D"].indexOf(tone);
  voiced = /^[bwmdznlʣghŋjviyueøoəa]/.test(syllable);
  syllable = syllable.replace(/i/, "iː").replace(/oi$/, "ɔːy").replace(/o(?!u$)/, "ɔː").replace(/e(?!i$)/, "ɛː").replace(/y/, "yː").replace(/øi$/, "ɵy").replace(/ø(?=n$)/, "ɵ").replace(/ø/, "œː").replace(/^q/, "").replace(/^[gc]/, "k").replace(/^[hx]/, "h").replace(/x/, "ʰ").replace(/^[dt]/, "t").replace(/^[ʣʦ]r/, "ʈʂ").replace(/^[zs]r/, "ʂ").replace(/^[ʣʦ]j/, "tɕ").replace(/^[zs]j/, "ɕ").replace(/^nj/, "ɲ").replace(/^[ʣʦ]/, "ts").replace(/^[wf]/, "f").replace(/^v/, "W").replace(/v/, "ʷ").replace(/^m$/, "m̩").replace(/^ŋ$/, "ŋ̍");
  if (tone == 3) syllable = syllable.replace(/(?<!^)ŋ$/, "k̚").replace(/(?<!^)n$/, "t̚").replace(/(?<!^)m$/, "p̚");

  var _short = !/ː/.test(syllable);

  tone = (voiced ? ["˧˩", "˩˧", "˩", "˩"] : ["˥˧", "˧˥", "˧", _short ? "˥" : "˧"])[tone];
  return (syllable + tone).normalize("NFC");
};

fs.writeFileSync("../docs/romanization-yue-ipa.js", "const mapYueIpa = {\n".concat(Object.entries(yue).map(function (_ref19) {
  var _ref20 = _slicedToArray(_ref19, 2),
      character = _ref20[0],
      phonetics = _ref20[1];

  return "  \"".concat(character, "\": [").concat(phonetics.map(function (phonetic) {
    return "\"".concat(yueToIpa(phonetic), "\"");
  }).join(", "), "]");
}).join(",\n"), "\n};")); // cmn

var pinyin = require("pinyin/data/dict-zi");

var cmn = {};

var _loop3 = function _loop3() {
  var _Object$entries$_i = _slicedToArray(_Object$entries[_i4], 2),
      k = _Object$entries$_i[0],
      v = _Object$entries$_i[1];

  var c = String.fromCharCode(k);

  if (c.match(/(?:[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DB5\u4E00-\u9FEF\uF900-\uFA6D\uFA70-\uFAD9]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D])/)) {
    if (!cmn[c]) cmn[c] = [];
    var addition = v.split(",").map(function (phonetic) {
      phonetic = phonetic.normalize("NFD");
      var tone = {
        "\u0304": "\u0301",
        "\u0301": "\u030C",
        "\u030C": "\u0300",
        "\u0300": "\u0302",
        "null": "\u0307"
      }[phonetic.match(/[\u0304\u0301\u030C\u0300]/)];
      var syllable = reduceReplace(phonetic.replace(/[\u0304\u0301\u030C\u0300]/, "").normalize("NFC"), [[/ng$/, "ŋ"], [/(?<=^[zcs])h/, "r"], [/(?<=[zcsr])i/, ""], [/(?<=^[bpmf])o/, "uo"], [/(?<=^[jqx])u/, "ü"], [/^j/, "g"], [/^q/, "k"], [/^h/, "x"], [/^yi/, "i"], [/^yu/, "ü"], [/^wu/, "u"], [/y/, "i"], [/ü/, "y"], [/w/, "u"], [/ioŋ$/, "yeŋ"], [/ao$/, "au"], [/ou$/, "eu"], [/uo$/, "ue"], [/(?<=[iy])(?=[ŋn]$)/, "e"], [/iu$/, "ieu"], [/ui$/, "uei"], [/un$/, "uen"], [/oŋ$/, "ueŋ"], [/c/g, "ʦ"], [/z/g, "ʣ"], [/k/g, "c"]]);
      var emcs = emc[c];

      if (emcs && emcs.length >= 1) {
        if (emcs.some(function (emc) {
          return /^m/.test(emc[0]);
        })) syllable = syllable.replace(/^(?=u)/, "m");else if (emcs.some(function (emc) {
          return /^ŋ/.test(emc[0]);
        })) syllable = syllable.replace(/^(?=[iyuea])/, "ŋ");else if (emcs.some(function (emc) {
          return /^nr/.test(emc[0]);
        })) syllable = syllable.replace(/^r/, "nr").replace(/^er$/, "enr");else if (emcs.some(function (emc) {
          return /^n[ij]/.test(emc[0]);
        })) syllable = syllable.replace(/^r/, "nj").replace(/^er$/, "enj");else if (emcs.some(function (emc) {
          return /^[ij]/.test(emc[0]);
        })) syllable = syllable.replace(/^r/, "j").replace(/^er$/, "ej");
        if (emcs.some(function (emc) {
          return /^[ʣʦsz]r/.test(emc[0]);
        })) syllable = syllable.replace(/^g(?=[iy])/, "ʣr").replace(/^c(?=[iy])/, "ʦr").replace(/^x(?=[iy])/, "sr");else if (emcs.some(function (emc) {
          return /^[ʣʦsz]j/.test(emc[0]);
        })) syllable = syllable.replace(/^g(?=[iy])/, "ʣj").replace(/^c(?=[iy])/, "ʦj").replace(/^x(?=[iy])/, "sj").replace(/(?<=^[ʣʦs])r/, "j");else if (emcs.some(function (emc) {
          return /^[ʣʦsz]/.test(emc[0]);
        })) syllable = syllable.replace(/^g(?=[iy])/, "ʣ").replace(/^c(?=[iy])/, "ʦ").replace(/^x(?=[iy])/, "s");
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = emcs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _emc = _step.value;

            if (/[ŋnm]$/.test(_emc[0]) && _emc[1] == 3) {
              syllable += {
                "ŋ": "c",
                "n": "t",
                "m": "p"
              }[_emc[0].slice(-1)];
              break;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      syllable = syllable.replace(/i/g, "ı").replace(/j/g, "ȷ");
      return (syllable + tone).normalize("NFC");
    });
    cmn[c] = cmn[c].concat(addition);
  }
};

for (var _i4 = 0, _Object$entries = Object.entries(pinyin); _i4 < _Object$entries.length; _i4++) {
  _loop3();
}

fs.writeFileSync("../docs/romanization-cmn.js", "const mapCmn = {\n".concat(Object.entries(cmn).map(function (_ref21) {
  var _ref22 = _slicedToArray(_ref21, 2),
      character = _ref22[0],
      phonetics = _ref22[1];

  return "  \"".concat(character, "\": [").concat(phonetics.map(function (s) {
    return "\"".concat(s, "\"");
  }).join(", "), "]");
}).join(",\n"), "\n};"));

var cmnToSimple = function cmnToSimple(phonetic) {
  return phonetic.normalize("NFD").replace(/ı/g, "i").replace(/ȷ/g, "j").replace(/e(?=[ŋnm])/, "").replace(/(?=[iuy])e(?=[iu])/, "").replace(/c/g, "k").replace(/ʣ/g, "z").replace(/ʦ/g, "c").replace(/z[rj]/, "ẓ").replace(/c[rj]/, "c̣").replace(/s[rj]/, "ṣ").replace(/[ktp](?=.$)/, "").replace(/i/g, "ı").replace(/j/g, "ȷ").normalize("NFC");
};

fs.writeFileSync("../docs/romanization-cmn-simple.js", "const mapCmnSimple = {\n".concat(Object.entries(cmn).map(function (_ref23) {
  var _ref24 = _slicedToArray(_ref23, 2),
      character = _ref24[0],
      phonetics = _ref24[1];

  return "  \"".concat(character, "\": [").concat(phonetics.map(function (s) {
    return "\"".concat(cmnToSimple(s), "\"");
  }).join(", "), "]");
}).join(",\n"), "\n};"));

for (var _i5 = 0, _arr4 = ["yue", "cmn"]; _i5 < _arr4.length; _i5++) {
  var lang = _arr4[_i5];

  for (var _i6 = 0, _arr5 = ["", "-simple", "-ipa"]; _i6 < _arr5.length; _i6++) {
    var suffix = _arr5[_i6];
    fs.copyFile("../docs/romanization-".concat(lang).concat(suffix, ".js"), "../plugin/romanization-".concat(lang).concat(suffix, ".js"), function (err) {
      if (err) console.log(err);
    });
  }
}

console.log(_toConsumableArray("完了").map(function (c) {
  return yue[c][0];
}).join(""));