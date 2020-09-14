const fs = require("fs")

const reduceReplace = (s, xys) =>
  xys.reduce((acc, [x, y]) => acc.replace(x, y), s);

const data = {}
const toStr = {}

const pathEmc = "rime-middle-chinese/zyenpheng.dict.yaml"
const textEmc = fs.readFileSync(pathEmc, "utf8");

data.emc = {};
textEmc
  .split("\n")
  .filter(line => /^\p{sc=Han}\t/gu.test(line))
  .slice(31)
  .join("\n")
  .replace(/[a-z']+/g, (match) => {
    let tone = 0;
    let syllable = match;
    if (/x$/.test(syllable)) {
      tone = 1;
      syllable = syllable.slice(0, -1);
    }
    else if (/h$/.test(syllable)) {
      tone = 2;
      syllable = syllable.slice(0, -1);
    }
    else if (/d$/.test(syllable))
      tone = 2;
    else if (/[ktp]$/.test(syllable))
      tone = 3;

    syllable = [
      [/'/g, "-"],
      [/ng/g, "ŋ"],
      [/k$/, "ŋ"],
      [/t$/, "n"],
      [/p$/, "m"],
      [/^h/, "x"],
      [/^gh/, "h"],
      [/(?<!^)h/, "'"],
      [/^z(?!s)/, "ʣ"],
      [/^c/, "ʦ"],
      [/^k/, "c"],
      [/^zs/, "z"],

      [/(?<=ʦ)'j/, "j'"],
      [/(?<=[tʦ])'r/, "r'"],
    ].reduce((acc, [x, y]) => acc.replace(x, y), syllable.trim());

    return (syllable + tone).normalize("NFC");
  })
  .split("\n")
  .map(line => line.trim().split("\t"))
  .filter(([character]) => character.length == 1)
  .forEach(([character, entry, percentage]) => {
    percentage = parseInt(percentage) || null
    const [syllable, tone] = entry.match(/(.+)(\d)/).slice(1);
    if (!data.emc[character])
      data.emc[character] = []
    const initial = syllable.match(/^[^iyueoa]*/)
    data.emc[character].push({ syllable, initial, tone, percentage });
  });

for(const character of Object.keys(data.emc))
  data.emc[character] = data.emc[character].sort((x, y) => (y.percentage || 50) - (x.percentage || 50))


toStr.emc = {}

toStr.emc.standard = ({ syllable, tone }) =>
  (
    reduceReplace(syllable, [
      [/nj/, "ɲ"],
      [/zj/, "ᶎ"],
      [/sj/, "ᶊ"],
      [/nr/, "ɳ"],
      [/zr/, "ʐ"],
      [/sr/, "ʂ"],
      [/dr/, "ɖ"],
      [/tr/, "ʈ"],
      [/(?<=[ʣʦ])j/, "\u0321"],
      [/(?<=[ʣʦ])r/, "\u0322"],
      // [/'/, "\u0315"],
      [/j/g, "ȷ"],
      [/i/g, "ı"],])
    + ["\u0304", "\u0301", "\u0300", "\u030D"][tone]
  ).normalize("NFC")

pathYue = "jyutping-table/list.tsv";
textYue = fs.readFileSync(pathYue, "utf8");

const voice = c =>
  ({
    g: "c",
    d: "t",
    ʣ: "ʦ",
    b: "p",
  }[c])

data.yue = {};
textYue
  .trim()
  .split("\r\n")
  .slice(1)
  .map((line) => {
    let [character, unicode, entry, initial, tail, tone] = line.split("\t")
    let syllable = entry.replace(/[1-6]$/, "")

    if (
      syllable.split(" ").length == 1
      && (! /[ktp]$/.test(syllable) || ["1", "3", "6"].includes(tone))
      && syllable != "ngm"
    ) {
      if (/[ktp]$/.test(syllable)) {
        tone = {
          "1": "7",
          "3": "7",
          "6": "8",
        }[tone];

        syllable = syllable
          .replace(/k$/, "ng")
          .replace(/t$/, "n")
          .replace(/p$/, "m");
      }

      syllable = reduceReplace(syllable, [
        // pre
        [/^k/, "k'"],
        [/^t/, "t'"],
        [/^c/, "c'"],
        [/^p/, "p'"],

        [/^g/, "k"],
        [/^d/, "t"],
        [/^z/, "c"],
        [/^b/, "p"],

        // main
        [/ng/g, "ŋ"],
        [/yu/, "y"],
        [/oe|eo/, "ø"],
        [/j(?=[iy])/, ""],
        [/w/, "v"],
        [/v(?=u)/, ""],
        [/a/g, "ə"],
        [/əə/, "a"],
        [/c/, "ʦ"],
        [/z/, "ʣ"],
        [/k/g, "c"],
        [/h/, "x"],
      ])

      if (["1", "2", "3", "7"].includes(tone))
        syllable = syllable.replace(/^(?=[ŋnmljviyueøoəa])/, "q");
      else
        syllable = reduceReplace(syllable, [
          [/^s/, "z"],
          [/^x/, "h"],
          [/^f/, "w"],
          [/^p/, "b"],
          [/^c/, "g"],
          [/^t/, "d"],
          [/^ʦ/, "ʣ"],
        ])

      tone = {
        "1": 0,
        "2": 1,
        "3": 2,
        "4": 0,
        "5": 1,
        "6": 2,
        "7": 3,
        "8": 3,
      }[tone]

      // historical conversion {
      const emcs = data.emc[character];
      if (emcs && emcs.length >= 1) {
        for (const nasal of ["ŋ", "n", "m"])
          if (emcs.some(emc => new RegExp(`^${nasal}`).test(emc.syllable))) {
            syllable = syllable.replace(/(?<=^q?)(?=[iyueøoaəjv])/, `${nasal}-`)
            break
          }

        syllable = reduceReplace(syllable, [
          [/n-j/, "nj"],
          [/(?<=n)-(?=[iyø])/, "j"],
          [/(?<=ŋ)-(?=[iyøj])/, ""],
        ])

        for (const [x, y, z] of [
          [/^[ʣʦzs]j/, /(?<=^[ʣʦzs])/, "j"],
          [/^[ʣʦzsdt]r/, /(?<=^[ʣʦzs])/, "r"],
          [/^nr/, /^n/, "nr"],

          [/^[gchx]/, /^f/, "xv"],
          [/^[gchx]/, /^w/, "hv"],

          [/^[gcxh]/, /(?=^[iyueøoəajv])/, "h-"],
          [/^[gcxh]/, /^q(?=[iyueøoəajv])/, "x-"],
        ])
          if (emcs.every(emc => x.test(emc.syllable)) && y.test(syllable)) {
            syllable = syllable.replace(y, z);
            break;
          }

        /*
        for(const [x, y, z] of
          [ /*[/^cx/, /^x/, "c-x"]
          , [/^cx/, /^h/, "g-h"]
          , [/^c/, /^x/, "c-x"]
          , [/^c/, /^h/, "c-h"]
          , [/^g/, /^x/, "g-x"]
          , [/^g/, /^h/, "g-h"]
          ])
          if(emcs.some(emc => x.test(emc.syllable)) && y.test(syllable)) {
            syllable = syllable.replace(y, z);
            break;
          }
        */

        syllable = reduceReplace(syllable, [
          [/(?<=^h)-(?=[jvy])/, ""],
          [/-(?=u)/, "v"],
          [/(?<=[xh])v(?=u)/, ""],
          [/-(?=[iyø])/, "j"],
          [/(?<=^[xŋnm])-(?=j)/, ""],
          [/(?<=^ŋ)-(?=[iyø])/, ""],
          [/(?<=[ŋnm])-(?=v)/, ""],
          [/(?<=ŋ)-(?=[iyueøoəa])/, ""],
        ])
      }
      // } historical conversion

      syllable = syllable.replace(/'([vjr])/, "$1'")

      let syllableCopy = syllable
      const initial = /^[ŋm]$/.test(syllable) ? "" : syllable.match(/^[^iyueøoəa]*/)
      syllableCopy = syllableCopy.replace(new RegExp(`^${initial}`), "")
      const nucleus = /^[ŋm]$/.test(syllable) ? syllable : syllableCopy.match(/^[iyueøoəa]/)
      const terminal = syllableCopy.slice(1)
      const medial = null

      const entry = {
        syllable,
        initial,
        medial,
        nucleus,
        terminal,
        tone,
        voiced: /^[bwmdznlʣghŋjviyueøoəa]/.test(syllable),
        short: /ə|ei|ou|ø[in]|[iu]ŋ/.test(syllable),
      }

      if (
        ! emcs || [
          ! /^q?ŋ/.test(syllable) || emcs.some(emc => /^ŋ/.test(emc.syllable)),
          ! /^q?n/.test(syllable) || emcs.some(emc => /^n/.test(emc.syllable)),
          ! /^q?m/.test(syllable) || emcs.some(emc => /^m/.test(emc.syllable)),
          ///m$/.test(syllable) == emcs.some(emc => /m$/.test(emc.syllable)),
          ///n$/.test(syllable) == emcs.some(emc => /n$/.test(emc.syllable)),
          ///ŋ$/.test(syllable) == emcs.some(emc => /ŋ$/.test(emc.syllable)),
        ].every(x => x)
      )
        if (data.yue[character]) {
          if (!
            data.yue[character].some(old =>
              [
                ["", ""],
                [/^n/, "l"],
                [/^l/, "n"],
                [/^n/, "ql"],
                [/^l/, "qn"],
                [/^(?=[ŋnmljviyueøoəa])/, "q"],
                [/^(?=[ŋnmljviyueøoəa])/, "q"],
              ].map(([x, y]) => old.syllable.replace(x, y)).includes(syllable)
              || tone == old.tone && [
                [/(?=[ŋnml])/, "q"],
                [/(?<=g|d|ʣ[rj]?|b)x/, ""],
                [/^q?n/, "l"],
                [/^qn/, "l"],
                [/^n/, "ql"],
                [/(?<=^[cg])v/, ""],
                [/iŋ$/, "eŋ"],
                [/uŋ$/, "oŋ"],
                [/^[ʣʦ]([rj]?)'?/, "s$1"],
                [/^[ʣʦ]([rj]?)'?/, "z$1"],
              ].map(([x, y]) => old.syllable.replace(x, y)).includes(syllable)
            )
          )
            data.yue[character].push(entry);
        } else data.yue[character] = [entry];
    }
  });

toStr.yue = {}

toStr.yue.standard = ({ syllable, tone }) =>
  (
    reduceReplace(syllable, [
      [/nj/, "ɲ"],
      [/zj/, "ᶎ"],
      [/sj/, "ᶊ"],
      [/(?<=[ʣʦ])j/, "\u0321"],
      [/nr/, "ɳ"],
      [/zr/, "ʐ"],
      [/sr/, "ʂ"],
      [/(?<=[ʣʦ])r/, "\u0322"],
      [/j/, "ȷ"],
      [/i/, "ı"],
    ])
    + ["\u0300", "\u0301", "\u0304", "\u030D"][tone]
  ).normalize("NFC")

toStr.yue.verbose = ({ initial, nucleus, terminal, tone, voiced, short }) => {
  if(short)
    //terminal += terminal
    nucleus += "\u0306" //"\u032F"
  tone = (voiced
    ? ["\u0316", "\u0317", "\u0331", "\u0329"]
    : ["\u0300", "\u0301", "\u0304", "\u030D"])[tone]

    return reduceReplace(initial + nucleus + terminal + tone, [
        [/nj/, "ɲ"],
        [/zj/, "ᶎ"],
        [/sj/, "ᶊ"],
        [/(?<=[ʣʦ])j/, "\u0321"],
        [/nr/, "ɳ"],
        [/zr/, "ʐ"],
        [/sr/, "ʂ"],
        [/(?<=[ʣʦ])r/, "\u0322"],
        [/j/, "ȷ"],
        [/i/, "ı"],
    ]).normalize("NFC")
}

toStr.yue.simple = ({ syllable, tone, voiced }) => {
  tone = (voiced
    ? ["\u0300", "\u030C", "\u1DC5", "\u030F"]
    : ["\u0302", "\u0301", "\u0304", "\u030B"])[tone]

  syllable = reduceReplace(syllable, [
    [/g/g, "c"],
    [/h/g, "x"],
    [/d/g, "t"],
    [/ʣ/g, "ʦ"],
    [/z/g, "s"],
    [/b/g, "p"],
    [/w/g, "f"],
    [/q/g, ""],

    [/c(?!')/g, "g"],
    [/cv(?!')/g, "gv"],
    [/t(?!')/g, "d"],
    [/ʦ(?![jr]?')/g, "ʣ"],
    [/p(?!')/g, "b"],

    [/(?<=(cv?|t|ʦ[jr]?|p))'/g, ""],

    [/ʣ/g, "z"],
    [/c/g, "k"],
    [/ʦ/g, "c"],

    [/nr/, "n"],
    [/nj/, "ɲ"],
    [/c[jr]/, "ꞔ"],
    [/z[jr]/, "ᶎ"],
    [/s[jr]/, "ᶊ"],
    [/i/g, "ı"],
    [/j/g, "ȷ"],
  ])

  return (syllable + tone).normalize("NFC");
};

toStr.yue.ascii = ({ syllable, tone }) =>
  reduceReplace(syllable, [
    [/ŋ/g, "k"],
    [/ʣ/g, "dz"],
    [/ʦ/g, "ts"],
    [/ø/g, "eo"],
    [/ə/g, "^"],
  ]) + ["\\", "/", "-", "|"][tone]

toStr.yue.ipa = ({ syllable, tone, voiced, short }) => {
  syllable = reduceReplace(syllable, [
    [/i/, "iː"],
    [/oi$/, "ɔːy"],
    [/ui$/, "uːy"],
    [/o(?!u$)/, "ɔː"],
    [/e(?!i$)/, "ɛː"],
    [/y/, "yː"],
    [/øi$/, "ɵy"],
    [/ø(?=n$)/, "ɵ"],
    [/ø/, "œː"],

    [/^q/, ""],

    [/^[gc]/, "k"],
    [/^[hx]/, "h"],
    [/'/, "ʰ"],

    [/^[dt]/, "t"],

    [/^[ʣʦ]r/, "ʈʂ"],
    [/^[zs]r/, "ʂ"],

    [/^[ʣʦ]j/, "tɕ"],
    [/^[zs]j/, "ɕ"],
    [/^nj/, "ɲ"],

    [/^[ʣʦ]/, "ts"],

    [/^[wf]/, "f"],
    [/^v/, "W"],
    [/v/, "ʷ"],

    [/^m$/, "m̩"],
    [/^ŋ$/, "ŋ̍"],
  ])

  if (tone == 3)
    syllable = syllable
      .replace(/(?<!^)ŋ$/, "k̚")
      .replace(/(?<!^)n$/, "t̚")
      .replace(/(?<!^)m$/, "p̚");

  tone = (voiced
    ? ["˧˩", "˩˧", "˩", "˩"]
    : ["˥˧", "˧˥", "˧", short ? "˥" : "˧"])[tone];

  return (syllable + tone).normalize("NFC");
};

// cmn
const pinyin = require("pinyin/data/dict-zi");
data.cmn = {};
for (const [k, v] of Object.entries(pinyin)) {
  const c = String.fromCharCode(k);
  if (c.match(/\p{sc=Han}/u)) {
    if (!data.cmn[c]) data.cmn[c] = [];

    const addition = v.split(",").map(entry => {
      entry = entry.normalize("NFD");

      const tone = {
        "\u0304": "0",
        "\u0301": "1",
        "\u030C": "2",
        "\u0300": "3",
        null: "4",
      }[entry.match(/[\u0304\u0301\u030C\u0300]/)];

      let syllable = reduceReplace(
        entry.replace(/[\u0304\u0301\u030C\u0300]/, "").normalize("NFC"),
        [
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
        ]
      );

      const emcs = data.emc[c];
      if (emcs && emcs.length >= 1) {
        if (emcs.some(emc => /^m/.test(emc.syllable)))
          syllable = syllable.replace(/^(?=u)/, "m");
        else if (emcs.some(emc => /^ŋ/.test(emc.syllable)))
          syllable = syllable.replace(/^(?=[iyuea])/, "ŋ");
        else if (emcs.some(emc => /^nr/.test(emc.syllable)))
          syllable = syllable.replace(/^r/, "nr").replace(/^er$/, "enr");
        else if (emcs.some(emc => /^n[ij]/.test(emc.syllable)))
          syllable = syllable.replace(/^r/, "nj").replace(/^er$/, "enj");
        else if (emcs.some(emc => /^[ij]/.test(emc.syllable)))
          syllable = syllable.replace(/^r/, "j").replace(/^er$/, "ej");

        if (emcs.some(emc => /^[ʣʦsz]r/.test(emc.syllable)))
          syllable = syllable
            .replace(/^g(?=[iy])/, "ʣr")
            .replace(/^c(?=[iy])/, "ʦr")
            .replace(/^x(?=[iy])/, "sr");
        else if (emcs.some(emc => /^[ʣʦsz]j/.test(emc.syllable)))
          syllable = syllable
            .replace(/^g(?=[iy])/, "ʣj")
            .replace(/^c(?=[iy])/, "ʦj")
            .replace(/^x(?=[iy])/, "sj")
            .replace(/(?<=^[ʣʦs])r/, "j");
        else if (emcs.some(emc => /^[ʣʦsz]/.test(emc.syllable)))
          syllable = syllable
            .replace(/^g(?=[iy])/, "ʣ")
            .replace(/^c(?=[iy])/, "ʦ")
            .replace(/^x(?=[iy])/, "s");

        for (const emc of emcs) {
          if (/[ŋnm]$/.test(emc.syllable) && emc.tone == 3) {
            syllable += {
              ŋ: "c",
              n: "t",
              m: "p",
            }[emc.syllable.slice(-1)];
            break;
          }
        }
      }

      try {
        let [initial, medial, nucleus, terminal] =
          /^en?[jr][ctp]?$/.test(syllable)
            ? ["", "", syllable.replace(/[ctp]$/, ""), syllable.match(/[ctp]?$/)]
            : syllable.match(/^([^iyuea]*)([iyu]?)([iyuea]?)([iuŋnm]?[ctp]?)$/).slice(1)

        if (medial && !nucleus) {
          [medial, nucleus] = [nucleus, medial]
        }
        return { syllable, initial, medial, nucleus, terminal, tone };
      } catch {
        console.log([c, syllable])
        return null
      }
    });

    data.cmn[c] = data.cmn[c].concat(addition.filter(x => x));
  }
}

toStr.cmn = {}

toStr.cmn.standard = ({ syllable, tone }) =>
  (
    reduceReplace(syllable, [
      [/nj/g, "ɲ"],
      [/nr/g, "ɳ"],
      [/(?<=[ʣʦs])j/g, "\u0321"],
      [/(?<=[ʣʦs])r/g, "\u0322"],
      [/i/g, "ı"],
      [/j/g, "ȷ"],
    ])
    + ["\u0301", "\u030C", "\u0300", "\u0302", "\u0307"][tone]
  ).normalize("NFC")

toStr.cmn.simple = ({ syllable, tone }) =>
  (
    syllable
      .replace(/e(?=[ŋnm])/, "")
      .replace(/(?=[iuy])e(?=[iu])/, "")
      .replace(/c/g, "k")
      .replace(/ʣ/g, "z")
      .replace(/ʦ/g, "c")

      .replace(/n[jr]/, "ɳ")
      .replace(/(?<=[zcs])[jr]/, "\u0322")

      .replace(/[ktp](?=.$)/, "")

      .replace(/i/g, "ı")
      .replace(/j/g, "ȷ")
    + ["\u0301", "\u030C", "\u0300", "\u0302", "\u0307"][tone]
  ).normalize("NFC");

const pathTsv = "tsv"
const pathRom = "../docs/romanization"
for (const path of [pathTsv, pathRom, pathRom.replace("/docs/", "/plugin/")])
  if (!fs.existsSync(path))
    fs.mkdirSync(path)

for (const lang of Object.keys(toStr)) {
  fs.writeFileSync(
    `${pathTsv}/${lang}.tsv`,
    "character\tsyllable\tinitial\tmedial\tnuclues\tterminal\ttone\tpercentage\n"
    + Object.keys(data[lang])
      .map(character =>
        data[lang][character]
          .map(e =>
            `${character}\t${e.syllable}\t${e.initial}\t${e.medial}\t${e.nucleus}\t${e.terminal}\t${e.tone}\t${e.percentage}\n`
          )
          .join("")
      )
      .join("")
  );

  for (const key of Object.keys(toStr[lang])) {
    const path = `${pathRom}/${lang}-${key}.js`

    fs.writeFileSync(
      path,
      `const map${lang[0].toUpperCase() + lang.slice(1)}${key[0].toUpperCase() + key.slice(1)} = {\n${Object.entries(data[lang])
        .map(
          ([character, entries]) =>
            `  "${character}": [${entries
              .map(entry => `"${toStr[lang][key](entry).replace("\\", "\\\\")}"`)
              .join(", ")}]`
        )
        .join(",\n")}\n};`
    );

    fs.copyFile(
      path,
      path.replace("/docs/", "/plugin/"),
      err => {
        if (err) console.log(err);
      }
    );
  }
}

console.log([..."完了"].map(c => toStr.yue.standard(data.yue[c][0])).join(""));
