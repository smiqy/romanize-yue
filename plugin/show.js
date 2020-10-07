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


const show = {
  emc: {
    standard: ({ syllable, tone }) =>
      (
        reduceReplace(hook(syllable), [
          // [/'/, "\u0315"],
          [/j/g, "ȷ"],
          [/i/g, "ı"],])
        + ["\u0304", "\u0301", "\u0300", "\u030D"][tone]
      ).normalize("NFC"),
  },
  yue: {
    standard: ({ syllable, tone }) =>
      (
        reduceReplace(hook(syllable), [
          [/j/, "ȷ"],
          [/i/, "ı"],
        ])
        + ["\u0300", "\u0301", "\u0304", "\u030D"][tone]
      ).normalize("NFC"),

    conservative: ({ syllable, initial, tone }) => {
      if (/'$/.test(initial))
        syllable = reduceReplace(syllable, [
          [/'/, ""],
          ["g", "c"]
          ["d", "t"]
          ["ʣ", "ʦ"]
          ["p", "b"]
        ])
      else
        syllable = reduceReplace(syllable, [
          ["c", "g"]
          ["t", "d"]
          ["ʦ", "ʣ"]
          ["b", "p"]
        ])
      syllable = hook(reduceReplace(syllable, [
        [/^q/, ""],
        [/^w/, "f"],
        [/^z/, "s"],
        [/^h/, "x"],

        [/j/, "ȷ"],
        [/i/, "ı"],
      ]))

      tone = (voiced
        ? ["\u0300", "\u030C", "\u1DC5", "\u0306\u030C"]
        : ["\u0302", "\u0301", "\u0304", "\u0306\u0302"])[tone]

      return (syllable + tone).normalize("NFC")
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

    simple: ({ syllable, tone, voiced }) => {
      tone = (voiced
        ? ["\u0300", "\u030C", "\u1DC5", "\u030F"]
        : ["\u0302", "\u0301", "\u0304", "\u030B"])[tone]

      syllable = hook(reduceReplace(syllable, [
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

        //[/ʣ/g, "z"],
        //[/c/g, "k"],
        //[/ʦ/g, "c"],

        [/i/g, "ı"],
        [/j/g, "ȷ"],
      ]))

      return (syllable + tone).normalize("NFC");
    },

    ascii: ({ syllable, tone }) =>
      reduceReplace(syllable, [
        [/ŋ/g, "k"],
        [/ʣ/g, "dz"],
        [/ʦ/g, "ts"],
        [/ø/g, "io"],
        [/ə/g, "ue"],
      ]) + ["\\", "/", "-", "|"][tone],

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
      (
        reduceReplace(hook(syllable), [
          [/i/g, "ı"],
          [/j/g, "ȷ"],
        ])
        + ["\u0301", "\u030C", "\u0300", "\u0302", "\u0307"][tone]
      ).normalize("NFC"),

    simple: ({ syllable, tone }) =>
      (
        syllable
          .replace(/ʦ/, "ts")
          .replace(/ʣ/, "ds")

          .replace(/e(?=[ŋnm])/, "")
          .replace(/(?<=[iuy])e(?=[iu])/, "")

          .replace(/n[jr]/, "ɳ")
          .replace(/s[jr]/, "ʂ")

          .replace(/[ctp]$/, "")

          .replace(/i/g, "ı")
          .replace(/j/g, "ȷ")
        + ["\u0301", "\u030C", "\u0300", "\u0302", "\u0307"][tone]
      ).normalize("NFC"),

    "simple cyrillic": ({ syllable, tone }) =>
      (
        syllable
          .replace(/e(?=[ŋnm])/, "")
          .replace(/(?<=[iuy])e(?=[iu])/, "")
          .replace(/[ctp]$/, "")

          .replace(/b/g, "б")
          .replace(/p/g, "п")
          .replace(/m/g, "м")
          .replace(/f/g, "ф")

          .replace(/d/g, "д")
          .replace(/t/g, "т")
          .replace(/n/g, "н")
          .replace(/l/g, "л")

          .replace(/ʣ[jr]/g, "џ")
          .replace(/ʦ[jr]/g, "ч")
          .replace(/s[jr]/g, "ш")
          .replace(/n[jr]/g, "ԩ")
          .replace(/r/g, "р")

          .replace(/ʣ/g, "ѕ")
          .replace(/ʦ/g, "ц")
          .replace(/s/g, "с")

          .replace(/g/g, "г")
          .replace(/c/g, "к")
          .replace(/ŋ/g, "ӈ")
          .replace(/x/g, "х")

          .replace(/i/g, "и")
          .replace(/u/g, "у")
          .replace(/y/g, "ѵ")
          .replace(/e/g, "э")
          .replace(/a/g, "а")

        + ["\u0301", "\u030C", "\u0300", "\u0302", "\u0307"][tone]
      ).normalize("NFC"),
  },
}