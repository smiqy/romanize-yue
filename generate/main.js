const fs = require("fs")

const reduceReplace = (s, xys) =>
  xys.reduce((acc, [x, y]) => acc.replace(x, y), s);

const data = {}

data.emc = {};
fs.readFileSync("rime-middle-chinese/zyenpheng.dict.yaml", "utf8")
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
    const voiced = /^[ghŋdznʣbwmiyueoa]/.test(syllable)
    data.emc[character].push({ syllable, initial, tone, voiced, percentage });
  });

for(const character of Object.keys(data.emc))
  data.emc[character] = data.emc[character].sort((x, y) => (y.percentage || 100) - (x.percentage || 100))

const unvoice = c =>
  ({
    g: "c",
    h: "x",
    d: "t",
    z: "s",
    ʣ: "ʦ",
    b: "p",
    w: "f",
  }[c])

data.yue = {};
fs.readFileSync("jyutping-table/list.tsv", "utf8")
  .trim()
  .split("\r\n")
  .slice(1)
  .map((line) => {
    let [character, unicode, entry, initial, tail, tone] = line.split("\t")
    let syllable = entry.replace(/[1-6]$/, "")

    if ([
      syllable.split(" ").length == 1,
      (! /[ktp]$/.test(syllable) || ["1", "3", "6"].includes(tone)),
      syllable != "ngm",
    ].every(x => x)) {
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
        [/(?<=^[ktcp])/, "'"],
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

      syllable = ["1", "2", "3", "7"].includes(tone)
        ? syllable.replace(/^(?=[ŋnmljviyueøoəa])/, "q")
        : reduceReplace(syllable, [
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
      if (emcs?.length >= 1) {
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
          [/yn$/, "yen"],

          [/o/, "e"],
          [/c/g, "ʦ"],
          [/z/g, "ʣ"],
          [/k/g, "c"],
        ]
      );

      const emcs = data.emc[c];
      if (emcs?.length >= 1) {
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

        if (emcs.some(emc => /m$/.test(emc.syllable)))
          syllable = syllable.replace(/n$/, "m");

        if (emcs.some(emc => /^[ʣʦsz]/.test(emc.syllable)))
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

for (const lang of Object.keys(data))
  fs.writeFileSync(
    `../docs/data/${lang}.js`,
    `const ${lang} = ` + JSON.stringify(data[lang], null, 2)
  );

console.log([..."完了"].map(c => data.yue[c].syllable).join(""));
