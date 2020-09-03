const fs = require('fs');

const pathEmc = "rime-middle-chinese/zyenpheng.dict.yaml"
const textEmc = fs.readFileSync(pathEmc, "utf8");

const reduceReplace = (s, xys) => xys.reduce((acc, [x, y]) => acc.replace(x, y), s);

const textEmcNew = textEmc
  .split("\n")
  .filter(line => /^\p{sc=Han}\t/ug.test(line))
  .slice(31)
  .join("\n")
  .replace(/[a-z']+/g, match => {
    let tone = 0;
    let syllable = match;
    if (/x$/.test(syllable)) {
      tone = 1;
      syllable = syllable.slice(0, -1);
    } else if (/h$/.test(syllable)) {
      tone = 2;
      syllable = syllable.slice(0, -1);
    } else if (/d$/.test(syllable))
      tone = 2;
    else if (/[ktp]$/.test(syllable))
      tone = 3;

    syllable = [
        [/ng/g, "ŋ"],
        [/k$/, "ŋ"],
        [/t$/, "n"],
        [/p$/, "m"],

        [/h/, "x"],
        [/^z(?!s)/, "ʣ"],
        [/^c/, "ʦ"],
        [/^zs/, "z"],
        [/^gx/, "h"],

        [/(?<!^)xr/, "rx"],
        [/xj/, "jx"],

        [/^k/, "c"],

        [/xj/, "j"],
        [/xj/, "jx"]
      ]
      .reduce((acc, [x, y]) => acc.replace(x, y), syllable);

    return (syllable + tone).normalize("NFC");
  });

const emc = {};
textEmcNew
  .split("\n")
  .map(line => line.trim().split("\t"))
  .filter(([character]) => character.length == 1)
  .map(([character, phonetic, percentage]) => {
    if (!percentage || parseInt(percentage.match(/(\d+)%/)) >= 30) {
      const row = phonetic.match(/(.+)(\d)/).slice(1);
      if (emc[character])
        emc[character].push(row);
      else
        emc[character] = [row];
    }
  });

fs.writeFileSync("../docs/romanization-emc.js",
  `const mapEmc = {
${
  Object.entries(emc)
  .map(([character, phonetics]) =>
    `  "${character}": [${phonetics.map(([syllable, tone]) => `"${syllable.replace(/j/g, "ȷ").replace(/i/g, "ı")}${"\u0304\u0301\u0300\u030D".charAt(parseInt(tone))}"`).join(", ")}]`).join(",\n")
}
};`
);

pathYue = "jyutping-table/list.tsv";
textYue = fs.readFileSync(pathYue, "utf8");

const voice = c =>
  ({
    g: "c",
    d: "t",
    ʣ: "ʦ",
    b: "p"
  })[c]

const yue = {};
textYue
  .trim()
  .split("\r\n")
  .slice(1)
  .map(line => {
    let [character, unicode, phonetic, initial, tail, tone] = line.split("\t");

    let syllable = phonetic.replace(/[1-6]$/, "");

    if (
      (syllable.split(" ").length == 1) &&
      (!/[ktp]$/.test(syllable) || ["1", "3", "6"].includes(tone)) &&
      (syllable != "ngm")
    ) {
      if (/[ktp]$/.test(syllable)) {
        tone = {
          "1": "7",
          "3": "7",
          "6": "8"
        } [tone];

        syllable = syllable
          .replace(/k$/, "ng")
          .replace(/t$/, "n")
          .replace(/p$/, "m")
      }

      syllable = syllable
        // pre
        .replace(/^k/, "kh")
        .replace(/^t/, "th")
        .replace(/^c/, "ch")
        .replace(/^p/, "ph")

        .replace(/^g/, "k")
        .replace(/^d/, "t")
        .replace(/^z/, "c")
        .replace(/^b/, "p")

        // main
        .replace(/ng/g, "ŋ")
        .replace(/yu/, "y")
        .replace(/oe|eo/, "ø")
        .replace(/j(?=[iyø])/, "")
        .replace(/w/, "v")
        .replace(/v(?=u)/, "")
        .replace(/a/g, "ə")
        .replace(/əə/, "a")
        .replace(/c/, "ʦ")
        .replace(/z/, "ʣ")
        .replace(/k/g, "c")
        .replace(/h/, "x");

      tone = tone
      if (["1", "2", "3", "7"].includes(tone))
        syllable = syllable
        .replace(/^(?=[ŋnmljviyueøoəa])/, "q")
      else
        syllable = syllable
        .replace(/^s/, "z")
        .replace(/^x/, "h")
        .replace(/^f/, "w")
        .replace(/^p/, "b")
        .replace(/^c/, "g")
        .replace(/^t/, "d")
        .replace(/^ʦ/, "ʣ")

      tone = {
        "1": 0,
        "2": 1,
        "3": 2,
        "4": 0,
        "5": 1,
        "6": 2,
        "7": 3,
        "8": 3
      } [tone]

      // historical conversion {
      const emcs = emc[character];
      if (emcs && emcs.length >= 1) {

        for (const nasal of ["ŋ", "n", "m"])
          if (emcs.some(emc => new RegExp("^" + nasal).test(emc[0]))) {
            syllable = syllable.replace(/(?<=^q?)(?=[iyueøoaəjv])/, `${nasal}’`);
            break;
          }

        syllable = syllable
          .replace(/n’j/, "nj")
          .replace(/(?<=n)’(?=[iyø])/, "j")
          .replace(/(?<=ŋ)’(?=[iyj])/, "");

        for (const [x, y, z] of [
            [/^[dtʣʦzs]j/, /(?<=^[ʣʦzs])/, "j"],
            [/^[dtʣʦzs]r/, /(?<=^[ʣʦzs])/, "r"],

            //, [/^px/, /^f/, "pvx"]
            //, [/^p/, /^f/, "pv"]
            //, [/^b/, /^f/, "pv"]
            //, [/^px/, /^w/, "bvx"]
            //, [/^p/, /^w/, "bv"]
            //, [/^b/, /^w/, "bv"]

            [/^[gchx]/, /^f/, "xv"],
            [/^[gchx]/, /^w/, "hv"],

            [/^[gcxh]/, /(?=^[iyueøoəajv])/, "h’"],
            [/^[gcxh]/, /^q(?=[iyueøoəajv])/, "x’"]
          ])
          if (emcs.every(emc => x.test(emc[0])) && y.test(syllable)) {
            syllable = syllable.replace(y, z);
            break;
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

        syllable = syllable
          .replace(/(?<=^h)’(?=[jvy])/, "")
          .replace(/’(?=u)/, "v")
          .replace(/(?<=[xh])v(?=u)/, "")
          .replace(/’(?=[iyø])/, "j")
          .replace(/(?<=^[xnm])’(?=j)/, "")
          .replace(/(?<=^ŋ)’(?=[jiyø])/, "")
          .replace(/(?<=[ŋnm])’(?=v)/, "")
          .replace(/(?<=ŋ)’(?=[iyueøoəa])/, "")
      }
      // } historical conversion

      syllable = syllable
        .replace(/(?<!^)xv/, "vx")
        .replace(/(?<!^)xj/, "jx")
        .replace(/(?<!^)xr/, "rx")

      /*
      syllable = syllable
        .replace(/^ʣ[jr]/g, "ʤ")
        .replace(/^ʦ[jr]/g, "ʧ")
        .replace(/^z[jr]/g, "ʒ")
        .replace(/^s[jr]/g, "ʃ")
      */

      if (true)
        syllable = syllable
        .replace(/j/, "ȷ")
        .replace(/i/, "ı")
      else
        syllable = [
          [/b/g, "б"],
          [/p/g, "п"],
          [/m/g, "м"],
          [/f/g, "ф"],
          [/w/g, "в"],
          [/v/g, "ъ"],

          [/d/g, "д"],
          [/t/g, "т"],
          [/n/g, "н"],
          [/l/g, "л"],
          [/r/g, "р"],

          [/ʣ/g, "ѕ"],
          [/ʦ/g, "ц"],
          [/z/g, "з"],
          [/s/g, "с"],

          [/ʤ/g, "җ"],
          [/ʧ/g, "щ"],
          [/ʒ/g, "ж"],
          [/ʃ/g, "ш"],

          [/g/g, "г"],
          [/c/g, "к"],
          [/ŋ/g, "ӈ"],
          [/x/g, "х"],
          [/h/g, "ғ"],

          [/q/g, "ҁ"],
          [/j/g, "ь"]

          [/i/g, "и"],
          [/y/g, "ѵ"],
          [/u/g, "у"],
          [/e/g, "є"],
          [/ø/g, "е"],
          [/o/g, "о"],
          [/ə/g, "э"],
          [/a/g, "а"],
        ]
        .reduce((acc, [x, y]) => acc.replace(x, y), syllable);

      phonetic = syllable + ["\u0300", "\u0301", "\u0304", "\u030D"][tone];

      if (
        //(! /[gdʣb]x|q[ŋnml]/.test(syllable)) &&
        (!emcs || (
          (!/^q?ŋ/.test(syllable) || emcs.some(emc => /^ŋ/.test(emc[0]))) &&
          (!/^q?n/.test(syllable) || emcs.some(emc => /^n/.test(emc[0]))) &&
          (!/^q?m/.test(syllable) || emcs.some(emc => /^m/.test(emc[0])))
        ))
      )
        if (yue[character]) {
          if (
            yue[character].includes(phonetic) ||
            yue[character].some(element =>
              element.replace(/.$/, "") ==
              phonetic
              .replace(/q(?=[ŋnml])/, "")
              .replace(/.$/, "")
            ) ||
            yue[character].some(element =>
              element.replace(/.$/, "") ==
              phonetic
              .replace(/(?<=[gdʣb][rj]?)x/, "")
              .replace(/.$/, "")
            ) ||
            yue[character].some(element =>
              element.replace(/.$/, "") ==
              phonetic
              .replace(/^./, voice)
              .replace(/.$/, "")
            ) ||
            yue[character].some(element => element == phonetic.replace(/^l/, "n")) ||
            yue[character].some(element => element.replace(/.$/, "") == phonetic.replace(/^ql(.+).$/, "n$1")) ||
            yue[character].includes(phonetic.replace(/(?<=[cg]x?)/, "v"))
          )
            void(0);
          else
            yue[character].push(phonetic);
        }
      else
        yue[character] = [phonetic];
    }
  });

fs.writeFileSync("../docs/romanization-yue.js",
  `const mapYue = {
${
  Object.entries(yue)
  .map(([character, phonetics]) =>
    `  "${character}": [${phonetics.map(phonetic => `"${phonetic}"`).join(", ")}]`).join(",\n")
}
};`
);

const yueToSimple = phonetic => {
  let [_, syllable, tone] = phonetic.normalize("NFD").match(/(.+)(.)/)
  syllable = syllable.replace(/ı/g, "i").replace(/ȷ/g, "j")
  /*
  if(/^[bwmdznlʣghŋjviyueøoəa]/.test(syllable))
    tone = " " + {
      "\u0300": "\u0316",
      "\u0301": "\u0317",
      "\u0304": "\u0331",
      "\u030D": "\u0329",
    }[tone]
  */

  tone = (
    /^[bwmdznlʣghŋjviyueøoəa]/.test(syllable) ?
      ["\u0300", "\u030C", "\u1DC5", "\u030F"]
    :
      ["\u0302", "\u0301", "\u0304", "\u030B"]
  )[["\u0300", "\u0301", "\u0304", "\u030D"].indexOf(tone)]

  syllable = syllable
  .replace(/g/g, "c")
  .replace(/h/g, "x")
  .replace(/d/g, "t")
  .replace(/ʣ/g, "ʦ")
  .replace(/z/g, "s")
  .replace(/b/g, "p")
  .replace(/w/g, "f")
  .replace(/q/g, "")

  .replace(/c(?!x)/g, "g")
  .replace(/t(?!x)/g, "d")
  .replace(/ʦ(?![jr]?x)/g, "ʣ")
  .replace(/p(?!x)/g, "b")

  .replace(/(?<=(c|t|ʦ[jr]|p))x/g, "")

  .replace(/ʣ/g, "z")
  .replace(/c/g, "k")
  .replace(/ʦ/g, "c")

  .replace(/z[jr]/g, "ᵶ")
  .replace(/c[jr]/g, "ꞓ")
  .replace(/s[jr]/g, "ꞩ")

  .replace(/i/g, "ı")
  .replace(/j/g, "ȷ")

  return (syllable + tone).normalize("NFC")
}

fs.writeFileSync("../docs/romanization-yue-simple.js",
  `const mapYueSimple = {\n${
  Object.entries(yue).map(([character, phonetics]) =>
    `  "${character}": [${phonetics.map(phonetic => `"${yueToSimple(phonetic)}"`).join(", ")}]`).join(",\n")
  }\n};`
);

const yueToIpa = phonetic => {
  let [_, syllable, tone] = phonetic.normalize("NFD").match(/(.+)(.)/)
  syllable = syllable.replace(/ı/g, "i").replace(/ȷ/g, "j")
  tone = ["\u0300", "\u0301", "\u0304", "\u030D"].indexOf(tone)
  voiced = /^[bwmdznlʣghŋjviyueøoəa]/.test(syllable)

  syllable = syllable
    .replace(/i/, "iː")
    .replace(/oi$/, "ɔːy")
    .replace(/o(?!u$)/, "ɔː")
    .replace(/e(?!i$)/, "ɛː")
    .replace(/y/, "yː")
    .replace(/øi$/, "ɵy")
    .replace(/ø(?=n$)/, "ɵ")
    .replace(/ø/, "œː")

    .replace(/^q/, "")

    .replace(/^[gc]/, "k")
    .replace(/^[hx]/, "h")
    .replace(/x/, "ʰ")

    .replace(/^[dt]/, "t")

    .replace(/^[ʣʦ]r/, "ʈʂ")
    .replace(/^[zs]r/, "ʂ")

    .replace(/^[ʣʦ]j/, "tɕ")
    .replace(/^[zs]j/, "ɕ")
    .replace(/^nj/, "ɲ")

    .replace(/^[ʣʦ]/, "ts")

    .replace(/^[wf]/, "f")
    .replace(/^v/, "W")
    .replace(/v/, "ʷ")

    .replace(/^m$/, "m̩")
    .replace(/^ŋ$/, "ŋ̍")

  if (tone == 3)
    syllable = syllable
    .replace(/(?<!^)ŋ$/, "k̚")
    .replace(/(?<!^)n$/, "t̚")
    .replace(/(?<!^)m$/, "p̚")

  const short = !/ː/.test(syllable)

  tone = (voiced ? ["˧˩", "˩˧", "˩", "˩"] : ["˥˧", "˧˥", "˧", short ? "˥" : "˧"])[tone]

  return (syllable + tone).normalize("NFC")
}


fs.writeFileSync("../docs/romanization-yue-ipa.js",
  `const mapYueIpa = {\n${
  Object.entries(yue).map(([character, phonetics]) =>
    `  "${character}": [${phonetics.map(phonetic => `"${yueToIpa(phonetic)}"`).join(", ")}]`).join(",\n")
  }\n};`
);

// cmn
const pinyin = require("pinyin/data/dict-zi");
let cmn = {};
for (const [k, v] of Object.entries(pinyin)) {
  const c = String.fromCharCode(k)
  if (c.match(/\p{sc=Han}/u)) {
    if (!cmn[c])
      cmn[c] = [];

    const addition =
      v.split(",")
      .map(phonetic => {
        phonetic = phonetic.normalize("NFD")

        const tone = {
          "\u0304": "\u0301",
          "\u0301": "\u030C",
          "\u030C": "\u0300",
          "\u0300": "\u0302",
          null: "\u0307"
        } [phonetic.match(/[\u0304\u0301\u030C\u0300]/)]

        let syllable = reduceReplace(phonetic.replace(/[\u0304\u0301\u030C\u0300]/, "").normalize("NFC"), [
          [/ng$/, "ŋ"],
          [/(?<=^[zcs])h/, "r"],
          [/(?<=[zcsr])i/, ""],

          [/(?<=^[bpmf])o/, "uo"],
          [/(?<=^[jqx])u/, "ü"],
          [/^j/, "g"],
          [/^q/, "k"],
          [/^h/, "x"],

          [/^yi/, "i"],
          [/^yu/, "ü"],
          [/^wu/, "u"],

          [/y/, "i"],
          [/ü/, "y"],
          [/w/, "u"],

          [/ioŋ$/, "yeŋ"],
          [/ao$/, "au"],
          [/ou$/, "eu"],
          [/uo$/, "ue"],
          [/(?<=[iy])(?=[ŋn]$)/, "e"],
          [/iu$/, "ieu"],
          [/ui$/, "uei"],
          [/un$/, "uen"],
          [/oŋ$/, "ueŋ"],

          [/c/g, "ʦ"],
          [/z/g, "ʣ"],
          [/k/g, "c"],
        ])

        const emcs = emc[c];
        if (emcs && emcs.length >= 1) {
          if (emcs.some(emc => /^m/.test(emc[0])))
            syllable = syllable.replace(/^(?=u)/, "m")
          else if (emcs.some(emc => /^ŋ/.test(emc[0])))
            syllable = syllable.replace(/^(?=[iyuea])/, "ŋ")
          else if (emcs.some(emc => /^nr/.test(emc[0])))
            syllable = syllable
            .replace(/^r/, "nr")
            .replace(/^er$/, "enr")
          else if (emcs.some(emc => /^n[ij]/.test(emc[0])))
            syllable = syllable
            .replace(/^r/, "nj")
            .replace(/^er$/, "enj")
          else if (emcs.some(emc => /^[ij]/.test(emc[0])))
            syllable = syllable
            .replace(/^r/, "j")
            .replace(/^er$/, "ej")

          if (emcs.some(emc => /^[ʣʦsz]r/.test(emc[0])))
            syllable = syllable
            .replace(/^g(?=[iy])/, "ʣr")
            .replace(/^c(?=[iy])/, "ʦr")
            .replace(/^x(?=[iy])/, "sr")
          else if (emcs.some(emc => /^[ʣʦsz]j/.test(emc[0])))
            syllable = syllable
            .replace(/^g(?=[iy])/, "ʣj")
            .replace(/^c(?=[iy])/, "ʦj")
            .replace(/^x(?=[iy])/, "sj")
            .replace(/(?<=^[ʣʦs])r/, "j")
          else if (emcs.some(emc => /^[ʣʦsz]/.test(emc[0])))
            syllable = syllable
            .replace(/^g(?=[iy])/, "ʣ")
            .replace(/^c(?=[iy])/, "ʦ")
            .replace(/^x(?=[iy])/, "s")

          for (const emc of emcs) {
            if (/[ŋnm]$/.test(emc[0]) && emc[1] == 3) {
              syllable += {
                "ŋ": "c",
                "n": "t",
                "m": "p"
              } [emc[0].slice(-1)]
              break
            }
          }
        }

        syllable = syllable
          .replace(/i/g, "ı")
          .replace(/j/g, "ȷ")

        return (syllable + tone).normalize("NFC")
      });

    cmn[c] = cmn[c].concat(addition)
  }
}

fs.writeFileSync("../docs/romanization-cmn.js",
  `const mapCmn = {\n${
  Object.entries(cmn)
  .map(([character, phonetics]) =>
    `  "${character}": [${phonetics.map(s => `"${s}"`).join(", ")}]`).join(",\n")
}\n};`
);

const cmnToSimple = phonetic =>
  phonetic
  .normalize("NFD")
  .replace(/ı/g, "i")
  .replace(/ȷ/g, "j")

  .replace(/e(?=[ŋnm])/, "")
  .replace(/(?=[iuy])e(?=[iu])/, "")
  .replace(/c/g, "k")
  .replace(/ʣ/g, "z")
  .replace(/ʦ/g, "c")

  .replace(/z[rj]/, "ẓ")
  .replace(/c[rj]/, "c̣")
  .replace(/s[rj]/, "ṣ")

  .replace(/[ktp](?=.$)/, "")

  .replace(/i/g, "ı")
  .replace(/j/g, "ȷ")
  .normalize("NFC")

fs.writeFileSync("../docs/romanization-cmn-simple.js",
  `const mapCmnSimple = {\n${
  Object.entries(cmn)
  .map(([character, phonetics]) =>
    `  "${character}": [${phonetics.map(s => `"${cmnToSimple(s)}"`).join(", ")}]`).join(",\n")
}\n};`
);

for(const lang of ["yue", "cmn"])
  for(const suffix of ["", "-simple", "-ipa"])
    fs.copyFile(`../docs/romanization-${lang}${suffix}.js`, `../plugin/romanization-${lang}${suffix}.js`, err => {
      if (err) console.log(err)
    })

console.log([..."完了"].map(c => yue[c][0]).join(""))