const fs = require("fs")

const pathEmc = "rime-middle-chinese/zyenpheng.dict.yaml"
const textEmc = fs.readFileSync(pathEmc, "utf8");

const reduceReplace = (s, xys) =>
  xys.reduce((acc, [x, y]) => acc.replace(x, y), s);

const data = {}
const toStr = {}

const textEmcNew = textEmc
  .split("\n")
  .filter((line) => /^\p{sc=Han}\t/gu.test(line))
  .slice(31)
  .join("\n")
  .replace(/[a-z']+/g, (match) => {
    let tone = 0;
    let syllable = match;
    if (/x$/.test(syllable)) {
      tone = 1;
      syllable = syllable.slice(0, -1);
    } else if (/h$/.test(syllable)) {
      tone = 2;
      syllable = syllable.slice(0, -1);
    } else if (/d$/.test(syllable)) tone = 2;
    else if (/[ktp]$/.test(syllable)) tone = 3;

    syllable = [
      [/'/g, "-"],
      [/ng/g, "ŋ"],
      [/k$/, "ŋ"],
      [/t$/, "n"],
      [/p$/, "m"],
      [/^h/, "x"],
      [/^gh/, "h"],
      [/h/, "'"],
      [/^z(?!s)/, "ʣ"],
      [/^c/, "ʦ"],
      [/^k/, "c"],
      [/^zs/, "z"],

      [/(?<=ʦ)'j/, "j'"],
      [/(?<=[tʦ])'r/, "r'"],
    ].reduce((acc, [x, y]) => acc.replace(x, y), syllable);

    return (syllable + tone).normalize("NFC");
  });

data.emc = {};
textEmcNew
  .split("\n")
  .map((line) => line.trim().split("\t"))
  .filter(([character]) => character.length == 1)
  .map(([character, entry, percentage]) => {
    if (!percentage || parseInt(percentage.match(/(\d+)%/)) >= 30) {
      const row = entry.match(/(.+)(\d)/).slice(1);
      if (data.emc[character]) data.emc[character].push(row);
      else data.emc[character] = [row];
    }
  });

toStr.emc = {}

toStr.emc.standard = ([syllable, tone]) =>
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
      [/'/, "\u0315"],
      [/j/g, "ȷ"],
      [/i/g, "ı"], ])
      + ["\u0304", "\u0301", "\u0300", "\u030D"][tone]
  ).normalize("NFC")

pathYue = "jyutping-table/list.tsv";
textYue = fs.readFileSync(pathYue, "utf8");

const voice = (c) =>
  ({
    g: "c",
    d: "t",
    ʣ: "ʦ",
    b: "p",
  }[c]);

data.yue = {};
textYue
  .trim()
  .split("\r\n")
  .slice(1)
  .map((line) => {
    let [character, unicode, entry, initial, tail, tone] = line.split("\t");

    let syllable = entry.replace(/[1-6]$/, "");

    if (
      syllable.split(" ").length == 1 &&
      (!/[ktp]$/.test(syllable) || ["1", "3", "6"].includes(tone)) &&
      syllable != "ngm"
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

      syllable = syllable
        // pre
        .replace(/^k/, "k'")
        .replace(/^t/, "t'")
        .replace(/^c/, "c'")
        .replace(/^p/, "p'")

        .replace(/^g/, "k")
        .replace(/^d/, "t")
        .replace(/^z/, "c")
        .replace(/^b/, "p")

        // main
        .replace(/ng/g, "ŋ")
        .replace(/yu/, "y")
        .replace(/oe|eo/, "ø")
        .replace(/j(?=[iy])/, "")
        .replace(/w/, "v")
        .replace(/v(?=u)/, "")
        .replace(/a/g, "ə")
        .replace(/əə/, "a")
        .replace(/c/, "ʦ")
        .replace(/z/, "ʣ")
        .replace(/k/g, "c")
        .replace(/h/, "x");

      tone = tone;
      if (["1", "2", "3", "7"].includes(tone))
        syllable = syllable.replace(/^(?=[ŋnmljviyueøoəa])/, "q");
      else
        syllable = syllable
          .replace(/^s/, "z")
          .replace(/^x/, "h")
          .replace(/^f/, "w")
          .replace(/^p/, "b")
          .replace(/^c/, "g")
          .replace(/^t/, "d")
          .replace(/^ʦ/, "ʣ");

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
          if (emcs.some((emc) => new RegExp("^" + nasal).test(emc[0]))) {
            syllable = syllable.replace(
              /(?<=^q?)(?=[iyueøoaəjv])/,
              `${nasal}-`
            );
            break;
          }

        syllable = syllable
          .replace(/n-j/, "nj")
          .replace(/(?<=n)-(?=[iyø])/, "j")
          .replace(/(?<=ŋ)-(?=[iyj])/, "");

        for (const [x, y, z] of [
          [/^[ʣʦzs]j/, /(?<=^[ʣʦzs])/, "j"],
          [/^[dtʣʦzs]r/, /(?<=^[ʣʦzs])/, "r"],
          [/^nr/, /^n/, "nr"],

          //, [/^px/, /^f/, "pvx"]
          //, [/^p/, /^f/, "pv"]
          //, [/^b/, /^f/, "pv"]
          //, [/^px/, /^w/, "bvx"]
          //, [/^p/, /^w/, "bv"]
          //, [/^b/, /^w/, "bv"]

          [/^[gchx]/, /^f/, "xv"],
          [/^[gchx]/, /^w/, "hv"],

          [/^[gcxh]/, /(?=^[iyueøoəajv])/, "h-"],
          [/^[gcxh]/, /^q(?=[iyueøoəajv])/, "x-"],
        ])
          if (emcs.every((emc) => x.test(emc[0])) && y.test(syllable)) {
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
          if(emcs.some(emc => x.test(emc[0])) && y.test(syllable)) {
            syllable = syllable.replace(y, z);
            break;
          }
        */

        syllable = syllable
          .replace(/(?<=^h)-(?=[jvy])/, "")
          .replace(/-(?=u)/, "v")
          .replace(/(?<=[xh])v(?=u)/, "")
          .replace(/-(?=[iyø])/, "j")
          .replace(/(?<=^[xnm])-(?=j)/, "")
          .replace(/(?<=^ŋ)-(?=[jiyø])/, "")
          .replace(/(?<=[ŋnm])-(?=v)/, "")
          .replace(/(?<=ŋ)-(?=[iyueøoəa])/, "");
      }
      // } historical conversion


      syllable = syllable
        .replace(/'([vjr])/, "$1'")

      const entry = [syllable, tone]

      if (
        //(! /[gdʣb]x|q[ŋnml]/.test(syllable)) &&
        ! emcs || [
          ! /^q?ŋ/.test(syllable) || emcs.some((emc) => /^ŋ/.test(emc[0])),
          ! /^q?n/.test(syllable) || emcs.some((emc) => /^n/.test(emc[0])),
          ! /^q?m/.test(syllable) || emcs.some((emc) => /^m/.test(emc[0])),
          /m$/.test(syllable) == emcs.some(emc => /m$/.test(emc[0])),
          /n$/.test(syllable) == emcs.some(emc => /n$/.test(emc[0])),
          /ŋ$/.test(syllable) == emcs.some(emc => /ŋ$/.test(emc[0])),
        ].every(x => x)
      )
        if (data.yue[character]) {
          if (!
            data.yue[character].some(
              ([syllableOld, toneOld]) =>
                [
                  syllableOld,
                  syllableOld.replace(/^n/, "l"),
                  syllableOld.replace(/^l/, "n"),
                  syllableOld.replace(/^n/, "ql"),
                  syllableOld.replace(/^l/, "qn"),
                  syllableOld.replace(/^(?=[ŋnmljviyueøoəa])/, "q"),
                  syllableOld.replace(/^(?=[ŋnmljviyueøoəa])/, "q"),
                ].includes(syllable)
                || tone == toneOld && [
                  syllable.replace(/q(?=[ŋnml])/, ""),
                  syllable.replace(/(?<=[gdʣb][rj]?)x/, ""),
                  syllable.replace(/^./, voice),
                  syllable.replace(/^q?l/, "n"),
                  syllable.replace(/^q?l/, "qn"),
                  syllable.replace(/(?<=^[cg])/, "v"),
                  syllable.replace(/eŋ/, "iŋ"),
                  syllable.replace(/oŋ/, "uŋ"),
                ].includes(syllableOld)
            )
          )
            data.yue[character].push(entry);
        } else data.yue[character] = [entry];
    }
  });

toStr.yue = {}

toStr.yue.standard = ([syllable, tone]) =>
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
      [/'/, "\u0315"],
      [/j/, "ȷ"],
      [/i/, "ı"],
    ])
  + ["\u0300", "\u0301", "\u0304", "\u030D"][tone]
  )
  .normalize("NFC")

toStr.yue.simple = ([syllable, tone]) => {
  if(true)
    if(/^[bwmdznlʣghŋjviyueøoəa]/.test(syllable))
      tone = ["\u0316", "\u0317", "\u0331", "\u0329"][tone]
  else
    tone = (/^[bwmdznlʣghŋjviyueøoəa]/.test(syllable)
      ? ["\u0300", "\u030C", "\u1DC5", "\u030F"]
      : ["\u0302", "\u0301", "\u0304", "\u030B"])[tone];

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
    [/t(?!')/g, "d"],
    [/ʦ(?![jr]?')/g, "ʣ"],
    [/p(?!')/g, "b"],

    [/(?<=(c|t|ʦ[jr]?|p))'/g, ""],

    [/ʣ/g, "z"],
    [/c/g, "k"],
    [/ʦ/g, "c"],

    [/[zcs]z[jr]/g, "\u0321"],

    [/nj/, "ɲ"],
    [/(?<=[ʣʦzsn])j/, "\u0321"],
    [/(?<=[ʣʦzs])r/, "\u0322"],
    [/i/g, "ı"],
    [/j/g, "ȷ"],
  ])

  return (syllable + tone).normalize("NFC");
};

toStr.yue.ascii = ([syllable, tone]) =>
  reduceReplace(syllable, [
    [/ŋ/g, "k"],
    [/ʣ/g, "dz"],
    [/ʦ/g, "ts"],
    [/ø/g, "eo"],
    [/ə/g, "^"],
  ]) + ["\\", "/", "-", "|"][tone]

toStr.yue.ipa = ([syllable, tone]) => {
  voiced = /^[bwmdznlʣghŋjviyueøoəa]/.test(syllable);

  syllable = syllable
    .replace(/i/, "iː")
    .replace(/oi$/, "ɔːy")
    .replace(/ui$/, "uːy")
    .replace(/o(?!u$)/, "ɔː")
    .replace(/e(?!i$)/, "ɛː")
    .replace(/y/, "yː")
    .replace(/øi$/, "ɵy")
    .replace(/ø(?=n$)/, "ɵ")
    .replace(/ø/, "œː")

    .replace(/^q/, "")

    .replace(/^[gc]/, "k")
    .replace(/^[hx]/, "h")
    .replace(/'/, "ʰ")

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
    .replace(/^ŋ$/, "ŋ̍");

  if (tone == 3)
    syllable = syllable
      .replace(/(?<!^)ŋ$/, "k̚")
      .replace(/(?<!^)n$/, "t̚")
      .replace(/(?<!^)m$/, "p̚");

  const short = !/ː/.test(syllable);

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
        if (emcs.some((emc) => /^m/.test(emc[0])))
          syllable = syllable.replace(/^(?=u)/, "m");
        else if (emcs.some((emc) => /^ŋ/.test(emc[0])))
          syllable = syllable.replace(/^(?=[iyuea])/, "ŋ");
        else if (emcs.some((emc) => /^nr/.test(emc[0])))
          syllable = syllable.replace(/^r/, "nr").replace(/^er$/, "enr");
        else if (emcs.some((emc) => /^n[ij]/.test(emc[0])))
          syllable = syllable.replace(/^r/, "nj").replace(/^er$/, "enj");
        else if (emcs.some((emc) => /^[ij]/.test(emc[0])))
          syllable = syllable.replace(/^r/, "j").replace(/^er$/, "ej");

        if (emcs.some((emc) => /^[ʣʦsz]r/.test(emc[0])))
          syllable = syllable
            .replace(/^g(?=[iy])/, "ʣr")
            .replace(/^c(?=[iy])/, "ʦr")
            .replace(/^x(?=[iy])/, "sr");
        else if (emcs.some((emc) => /^[ʣʦsz]j/.test(emc[0])))
          syllable = syllable
            .replace(/^g(?=[iy])/, "ʣj")
            .replace(/^c(?=[iy])/, "ʦj")
            .replace(/^x(?=[iy])/, "sj")
            .replace(/(?<=^[ʣʦs])r/, "j");
        else if (emcs.some((emc) => /^[ʣʦsz]/.test(emc[0])))
          syllable = syllable
            .replace(/^g(?=[iy])/, "ʣ")
            .replace(/^c(?=[iy])/, "ʦ")
            .replace(/^x(?=[iy])/, "s");

        for (const emc of emcs) {
          if (/[ŋnm]$/.test(emc[0]) && emc[1] == 3) {
            syllable += {
              ŋ: "c",
              n: "t",
              m: "p",
            }[emc[0].slice(-1)];
            break;
          }
        }
      }

      return [syllable, tone];
    });

    data.cmn[c] = data.cmn[c].concat(addition);
  }
}

toStr.cmn = {}

toStr.cmn.standard = ([syllable, tone]) =>
  (
    syllable
    .replace(/nj/g, "ɲ")
    .replace(/nr/g, "ɳ")
    .replace(/(?<=[ʣʦs])j/g, "\u0321")
    .replace(/(?<=[ʣʦs])r/g, "\u0322")
    .replace(/i/g, "ı")
    .replace(/j/g, "ȷ")
    + ["\u0301", "\u030C", "\u0300", "\u0302", "\u0307"][tone]
  ).normalize("NFC")

toStr.cmn.simple = ([syllable, tone]) =>
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
for(const path of [pathTsv, pathRom, pathRom.replace("/docs/", "/plugin/")])
  if (! fs.existsSync(path))
    fs.mkdirSync(path)

for(const lang of Object.keys(toStr)) {
  fs.writeFileSync(
    `${pathTsv}/${lang}.tsv`,
    Object.keys(data[lang])
    .map(character =>
      data[lang][character]
      .map(([syllable, tone]) =>
        `${character}\t${syllable}\t${tone}\n`
      )
      .join("")
    )
    .join("")
  );

  for(const key of Object.keys(toStr[lang])) {
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
      (err) => {
        if (err) console.log(err);
      }
    );
  }
}

console.log([..."完了"].map(c => toStr.yue.standard(data.yue[c][0])).join(""));
