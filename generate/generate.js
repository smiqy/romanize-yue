const fs = require('fs');

const pathTng = "rime-middle-chinese/zyenpheng.dict.yaml"
const textTng = fs.readFileSync(pathTng, "utf8");

const textTngNew = textTng
.split("\n")
.filter(line => /^\p{sc=Han}\t/ug.test(line))
.slice(31)
.join("\n")
.replace(/[a-z']+/g, match => {
  let tone = 0;
  let syllable = match;
  if(/x$/.test(syllable)) {
    tone = 1;
    syllable = syllable.slice(0, -1);
  }
  else if(/h$/.test(syllable)) {
    tone = 2;
    syllable = syllable.slice(0, -1);
  }
  else if(/d$/.test(syllable))
    tone = 2;
  else if(/[ktp]$/.test(syllable))
    tone = 3;

  syllable =
    [ [/ng/g, "ŋ"]
    , [/k$/, "ŋ"]
    , [/t$/, "n"]
    , [/p$/, "m"]

    , [/h/, "x"]
    , [/^z(?!s)/, "ʣ"]
    , [/^c/, "ʦ"]
    , [/^zs/, "z"]
    , [/^gx/, "h"]

    , [/(?<!^)xr/, "rx"]
    , [/xj/, "jx"]

    , [/^k/, "c"]

    , [/xj/, "j"]
    , [/xj/, "jx"]
    ]
    .reduce((acc, [x, y]) => acc.replace(x, y), syllable);

  return syllable + tone;
});

fs.writeFileSync("romanization-tng.tsv",
  textTngNew
  .replace(/j/g, "ȷ")
  .replace(/i/g, "ı")
  .replace(/(?<!\s)0/g, "\u0304")
  .replace(/(?<!\s)1/g, "\u0301")
  .replace(/(?<!\s)2/g, "\u0300")
  .replace(/(?<!\s)3/g, "\u030D")
);

const tng = {};
textTngNew
.split("\n")
.map(line => line.trim().split("\t"))
.filter(([character]) => character.length == 1)
.map(([character, phonetic, percentage]) => {
  if(! percentage || parseInt(percentage.match(/(\d+)%/)) >= 30) {
    const row = phonetic.match(/(.+)(\d)/).slice(1);
    if(tng[character])
      tng[character].push(row);
    else
      tng[character] = [row];
  }
});

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

  if(
    (syllable.split(" ").length == 1)
    && (! /[ktp]$/.test(syllable) || ["1", "3", "6"].includes(tone))
    && (syllable != "ngm")
    ) {
    if(/[ktp]$/.test(syllable)) {
      tone = {
        "1": "7",
        "3": "7",
        "6": "8"
      }[tone];

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
    .replace(/oe|eo/, "œ")
    .replace(/j(?=[iyœ])/, "")
    .replace(/w/, "v")
    .replace(/v(?=u)/, "")
    .replace(/a/g, "ə")
    .replace(/əə/, "a")
    .replace(/c/, "ʦ")
    .replace(/z/, "ʣ")
    .replace(/k/g, "c")
    .replace(/h/, "x");

    tone = tone
    if(["1", "2", "3", "7"].includes(tone))
      syllable = syllable
      .replace(/^(?=[ŋnmljviyueœoəa])/, "q")
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
    }[tone]

    // historical conversion {
    const tngs = tng[character];
    if(tngs && tngs.length >= 1) {

      for(const nasal of ["ŋ", "n", "m"])
        if(tngs.some(tng => new RegExp("^" + nasal).test(tng[0]))) {
          syllable = syllable.replace(/(?<=^q?)(?=[iyueœoaəjv])/, `${nasal}’`);
          break;
        }

      syllable = syllable
      .replace(/n’j/, "nj")
      .replace(/(?<=n)’(?=[iyœ])/, "j")
      .replace(/(?<=ŋ)’(?=[iyj])/, "");

      for(const [x, y, z] of
        [ [/^[dtʣʦzs]j/, /(?<=^[ʣʦzs])/, "j"]
        , [/^[dtʣʦzs]r/, /(?<=^[ʣʦzs])/, "r"]

        //, [/^px/, /^f/, "pvx"]
        //, [/^p/, /^f/, "pv"]
        //, [/^b/, /^f/, "pv"]
        //, [/^px/, /^w/, "bvx"]
        //, [/^p/, /^w/, "bv"]
        //, [/^b/, /^w/, "bv"]

        , [/^[gchx]/, /^f/, "xv"]
        , [/^[gchx]/, /^w/, "hv"]

        , [/^[xh]/, /(?=^[iyueœoəajv])/, "h’"]
        , [/^[xh]/, /^q(?=[iyueœoəajv])/, "x’"]
      ])
        if(tngs.every(tng => x.test(tng[0])) && y.test(syllable)) {
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
        if(tngs.some(tng => x.test(tng[0])) && y.test(syllable)) {
          syllable = syllable.replace(y, z);
          break;
        }
      */

      syllable = syllable
      .replace(/(?<=^h)’(?=[jvy])/, "")
      .replace(/’(?=u)/, "v")
      .replace(/’(?=[iyœ])/, "j")
      .replace(/(?<=^[xnm])’(?=j)/, "")
      .replace(/(?<=^ŋ)’(?=[jiyœ])/, "")
      .replace(/(?<=[ŋnm])’(?=v)/, "")
      .replace(/(?<=ŋ)’(?=[iyueœoəa])/, "")
    }
    // } historical conversion

    syllable = syllable
    .replace(/(?<!^)xv/, "vx")
    .replace(/(?<!^)xj/, "jx")
    .replace(/(?<!^)xr/, "rx")

    if(true)
      syllable = syllable
      .replace(/j/, "ȷ")
      .replace(/i/, "ı")
    else
      syllable =
      [ [/b/g, "б"]
      , [/p/g, "п"]
      , [/m/g, "м"]
      , [/f/g, "ф"]
      , [/w/g, "в"]
      , [/v/g, "ъ"]

      , [/d/g, "д"]
      , [/t/g, "т"]
      , [/n/g, "н"]
      , [/l/g, "л"]
      , [/r/g, "р"]

      , [/ʣ/g, "ѕ"]
      , [/ʦ/g, "ц"]
      , [/z/g, "з"]
      , [/s/g, "с"]

      , [/g/g, "г"]
      , [/c/g, "к"]
      , [/ŋ/g, "ӈ"]
      , [/x/g, "х"]
      , [/h/g, "ғ"]

      , [/q/g, "ҁ"]
      , [/j/g, "ь"]

      , [/i/g, "и"]
      , [/y/g, "ѵ"]
      , [/u/g, "у"]
      , [/e/g, "є"]
      , [/œ/g, "е"]
      , [/o/g, "о"]
      , [/ə/g, "э"]
      , [/a/g, "а"]
      ]
      .reduce((acc, [x, y]) => acc.replace(x, y), syllable);

    phonetic = syllable + ["\u0300", "\u0301", "\u0304", "\u030D"][tone];

    if(
      //(! /[gdʣb]x|q[ŋnml]/.test(syllable)) &&
      (! tngs || (
        (! /^q?ŋ/.test(syllable) || tngs.some(tng => /^ŋ/.test(tng[0]))) &&
        (! /^q?n/.test(syllable) || tngs.some(tng => /^n/.test(tng[0]))) &&
        (! /^q?m/.test(syllable) || tngs.some(tng => /^m/.test(tng[0])))
      ))
    )
      if(yue[character]) {
        if(
          ! yue[character].includes(phonetic)
          && ! yue[character].includes(phonetic.replace(/q(?=[ŋnml])/, ""))
          && ! yue[character].includes(phonetic.replace(/q?l/, "n"))
          && ! yue[character].some(phonetic_ => phonetic_ == phonetic.replace(/(?<=^[gdʣb])x/, ""))
          && ! yue[character].some(phonetic_ => phonetic_ == phonetic.replace(/^([gdʣb])x/, match => voice(match[1])))
        )
          yue[character].push(phonetic);
      }
      else
        yue[character] = [phonetic];
  }
});

for(const [character, phonetics] of Object.entries(yue)) {
  for(const phonetic of phonetics)
    if(/^[ŋnml]/.test(phonetic))
      yue[character] = phonetics.filter(element => element != "q" + phonetic)

  for(const phonetic of phonetics) {
    if(/^[gdʣb](?!x)/.test(phonetic))
      yue[character] = phonetics.filter(element => element != phonetic.charAt(0) + "x" + phonetics.slice(1))
    if(/^[ctʦp]x/.test(phonetic))
      yue[character] = phonetics.filter(element => element != voice(phonetic.charAt(0)) + phonetics.slice(1))
  }
}

fs.writeFileSync("romanization-yue.tsv",
  Object.entries(yue)
  .map(([character, phonetics]) => `${character}\t${phonetics.join(" ")}`).join("\n")
);

let output = `const _charmap = {\n${
  Object.entries(yue)
  .map(([character, rows]) =>
    `  "${character}": [${rows.map(row => `"${row}"`).join(", ")}]`
  ).join(",\n")
}\n};`;
fs.writeFileSync('../plugin/charmap.js', output);

[..."成功"].forEach(c => console.log(yue[c].join(" ")))
