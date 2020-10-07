const reduceReplace = (s, xys) =>
  xys.reduce((acc, [x, y]) => acc.replace(x, y), s);

const hook = s =>
  reduceReplace(s, [
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
  ])

const tonesOf = {
  emc: ["\u0304", "\u0301", "\u0300", "\u030D"],
  yue: ["\u0300", "\u0301", "\u0304", "\u030D"],
  cmn: ["\u0304", "\u0301", "\u1DC5", "\u0300", "\u0307"],
}

const show = {
  emc: {
    standard: ({ syllable, tone }) =>
      reduceReplace(hook(syllable), [
        [/j/g, "ȷ"],
        [/i/g, "ı"],

        [/$/, tonesOf.emc[tone]],
      ]).normalize("NFC"),
  },
  yue: {
    standard: ({ syllable, tone }) =>
      reduceReplace(hook(syllable), [
        [/j/, "ȷ"],
        [/i/, "ı"],

        [/$/, tonesOf.yue[tone]],
      ]).normalize("NFC"),

    "standard cyrillic": ({ syllable, tone }) =>
      reduceReplace(syllable, [
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

        [/ʣ/g, "ѕ"],
        [/ʦ/g, "ц"],
        [/s/g, "с"],
        [/z/g, "з"],
        [/j/g, "ь"],
        [/r/g, "р"],

        [/g/g, "г"],
        [/c/g, "к"],
        [/ŋ/g, "ӈ"],
        [/x/g, "х"],
        [/h/g, "ғ"],

        [/i/g, "и"],
        [/u/g, "у"],
        [/y/g, "ѵ"],

        [/e/g, "є"],
        [/ø/g, "ө"],
        [/ə/g, "э"],
        [/o/g, "о"],

        [/a/g, "а"],

        [/$/, tonesOf.yue[tone]],
      ]).normalize("NFC"),

    conservative: ({ syllable, initial, tone, voiced }) => {
      if (/'$/.test(initial))
        syllable = reduceReplace(syllable, [
          [/'/, ""],
          [/^g/, "c"],
          [/^d/, "t"],
          [/^ʣ/, "ʦ"],
          [/^p/, "b"],
        ])
      else
        syllable = reduceReplace(syllable, [
          [/^c/, "g"],
          [/^t/, "d"],
          [/^ʦ/, "ʣ"],
          [/^b/, "p"],
        ])
      syllable = reduceReplace(syllable, [
        [/^q/, ""],
        [/^w/, "f"],
        [/^z/, "s"],
        [/^h/, "x"],
        [/v/, "w"],

        [/^ʦ/, "c"],
        [/^ʣ/, "z"],
        [/(?<=^[zcs])[jr]/, ""],
        [/^nr/, "n"],

        [/j/, "ȷ"],
        [/i/, "ı"],
      ])

      if (tone == 3)
        syllable = reduceReplace(syllable, [
          [/ŋ$/, "k"],
          [/n$/, "t"],
          [/m$/, "p"],
        ])

      tone = (voiced
        ? ["\u0300", "\u030C", "\u1DC5", "\u0300"]
        : ["\u0302", "\u0301", "\u0304", "\u0301"])[tone]

      return (hook(syllable) + tone).normalize("NFC")
    },

    verbose: ({ initial, nucleus, terminal, tone, voiced, short }) => {
      if (short)
        nucleus += "\u0306"
      tone = (voiced
        ? ["\u0316", "\u0317", "\u0331", "\u0329"]
        : ["\u0300", "\u0301", "\u0304", "\u030D"])[tone]

      return reduceReplace(hook(initial + nucleus + terminal + tone), [
        [/j/, "ȷ"],
        [/i/, "ı"],
      ])
        .normalize("NFC")
    },

    ascii: ({ syllable, tone }) =>
      reduceReplace(syllable, [
        [/ŋ/g, "k"],
        [/ʣ/g, "dz"],
        [/ʦ/g, "ts"],
        [/ø/g, "io"],
        [/ə/g, "ue"],
        [/$/, ["\\", "/", "-", "|"][tone]],
      ]),

    ipa: ({ syllable, tone, voiced, short }) => {
      syllable = reduceReplace(syllable, [
        [/(?<![iyueøoəa])i/, "iː"],
        [/ə/, "ɐ"],
        [/y/, "yː"],

        [/øi$/, "ɵy"],
        [/ø(?=n$)/, "ɵ"],
        [/ø/, "œː"],

        [/oi$/, "ɔːy"],
        [/o(?!u$)/, "ɔː"],
        [/e(?!i$)/, "ɛː"],

        [/ui$/, "uːy"],

        [/^q/, ""],

        [/^[gc]/, "k"],
        [/^[hx]/, "h"],
        [/'/, "ʰ"],

        [/^[dt]/, "t"],

        [/^[ʣʦ]r/, "ʈʂ"],
        [/^[zs]r/, "ʂ"],
        [/^nr/, "ɳ"],

        [/^[ʣʦ]j/, "tɕ"],
        [/^[zs]j/, "ɕ"],
        [/^nj/, "ɲ"],

        [/^[ʣʦ]/, "ts"],

        [/^[wf]/, "f"],
        [/^v/, "w"],
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
    },
  },

  cmn: {
    standard: ({ syllable, tone }) =>
      reduceReplace(hook(syllable), [
        [/i/g, "ı"],
        [/j/g, "ȷ"],

        [/$/, tonesOf.cmn[tone]],
      ]).normalize("NFC"),

    "standard cyrillic": ({ syllable, tone }) =>
      reduceReplace(hook(syllable), [
        [/b/g, "б"],
        [/p/g, "п"],
        [/m/g, "м"],
        [/f/g, "ф"],

        [/d/g, "д"],
        [/t/g, "т"],
        [/n/g, "н"],
        [/l/g, "л"],

        [/ʣ/g, "ѕ"],
        [/ʦ/g, "ц"],
        [/s/g, "с"],
        [/j/g, "ь"],
        [/r/g, "р"],

        [/g/g, "г"],
        [/c/g, "к"],
        [/ŋ/g, "ӈ"],
        [/x/g, "х"],

        [/i/g, "и"],
        [/u/g, "у"],
        [/y/g, "ѵ"],
        [/e/g, "э"],
        [/a/g, "а"],

        [/$/, tonesOf.cmn[tone]]
      ]).normalize("NFC"),

    simple: ({ syllable, tone }) =>
      reduceReplace(syllable, [
        [/ʦ/, "ts"],
        [/ʣ/, "ds"],

        [/n[jr]/, "ɳ"],
        [/s[jr]/, "ʂ"],

        [/e(?=[ŋnm]$)/, ""],
        [/(?<=[iuy])e(?=[iu])/, ""],

        [/[ctp]$/, ""],

        [/i/g, "ı"],
        [/j/g, "ȷ"],

        [/$/, tonesOf.cmn[tone]]
      ]).normalize("NFC"),

    "simple cyrillic": ({ syllable, tone }) =>
      reduceReplace(syllable, [
        [/e(?=[ŋnm]$)/, ""],
        [/(?<=[iuy])e(?=[iu]$)/, ""],
        [/[ctp]$/, ""],
        [/j/g, "r"],

        [/b/g, "б"],
        [/p/g, "п"],
        [/m/g, "м"],
        [/f/g, "ф"],

        [/d/g, "д"],
        [/t/g, "т"],
        [/n/g, "н"],
        [/l/g, "л"],

        [/ʣ[jr]/g, "џ"],
        [/ʦ[jr]/g, "ч"],
        [/s[jr]/g, "ш"],
        [/n[jr]/g, "ԩ"],
        [/r/g, "р"],

        [/ʣ/g, "ѕ"],
        [/ʦ/g, "ц"],
        [/s/g, "с"],

        [/g/g, "г"],
        [/c/g, "к"],
        [/ŋ/g, "ӈ"],
        [/x/g, "х"],

        [/i/g, "и"],
        [/u/g, "у"],
        [/y/g, "ѵ"],
        [/e/g, "э"],
        [/a/g, "а"],

        [/$/, tonesOf.cmn[tone]]
      ]).normalize("NFC"),

    "conservative": ({ syllable, tone }) =>
      reduceReplace(syllable, [
        [/[ctp]$/, ""],
        [/^ŋ/, ""],
        [/^mu/, "u"],
        [/m$/, "n"],

        [/j/, "r"],
        [/c/, "k"],
        [/ʦ/, "c"],
        [/ʣ/, "z"],
        [/x/, "h"],
        [/(?<=[szc])r/, "\u0323"],
        [/nr/, "r"],

        [/e(?=[ŋnm]$)/, ""],
        [/(?<=[iuy])e(?=[iu]$)/, ""],

        [/i/g, "ı"],
        [/$/, ["\u0304", "\u0301", "\u030C", "\u0300", "\u0307"][tone]],
      ]).normalize("NFC"),
  },
}