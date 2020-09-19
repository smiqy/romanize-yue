
const reduceReplace = (s, xys) =>
  xys.reduce((acc, [x, y]) => acc.replace(x, y), s);

const show = {
  emc: {
    standard: ({ syllable, tone }) =>
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
      ).normalize("NFC"),
  },
  yue: {
    standard: ({ syllable, tone }) =>
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
      ).normalize("NFC"),

    verbose: ({ initial, nucleus, terminal, tone, voiced, short }) => {
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
    },

    simple: ({ syllable, tone, voiced }) => {
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
    },

    ascii: ({ syllable, tone }) =>
      reduceReplace(syllable, [
        [/ŋ/g, "k"],
        [/ʣ/g, "dz"],
        [/ʦ/g, "ts"],
        [/ø/g, "eo"],
        [/ə/g, "^"],
      ]) + ["\\", "/", "-", "|"][tone],

    ipa: ({ syllable, tone, voiced, short }) => {
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
    },
  },

  cmn: {
    standard: ({ syllable, tone }) =>
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
      ).normalize("NFC"),

    simple: ({ syllable, tone }) =>
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
      ).normalize("NFC"),
  },
}