const capitalize = s =>
  s == "" ? s : s[0].toUpperCase() + s.slice(1)

document.addEventListener("DOMContentLoaded", () => {
  const source = document.getElementById("source");
  const sink = {
    emc: document.getElementById("emc"),
    yue: document.getElementById("yue"),
    cmn: document.getElementById("cmn"),
  }
  const alphabet = document.getElementById("alphabet");

  const select = (event) => {
    if (event.srcElement) {
      const e = document.createElement("span");
      for (const a of event.srcElement.attributes)
        e.setAttribute(a.name, a.value);
      e.innerHTML = event.srcElement.innerHTML;
      event.srcElement.parentElement.replaceWith(e);
    }
    setTweet();
  };

  const setTweet = (event) => {
    document
      .getElementsByTagName("a")[0]
      .setAttribute(
        "href",
        "https://twitter.com/intent/tweet?text=" +
        encodeURIComponent(
          [
            source.value,
            sink.emc.textContent,
            sink.yue.textContent,
            sink.cmn.textContent,
          ].join("\n\n")
        )
      );
  };

  const update = event => {
    const sourceText = convertSym(source.value);
    for(const key of Object.keys(sink))
      sink[key].innerHTML = convert(key, sourceText, alphabet.value)

    for (const option of document.querySelectorAll(".multiple .option")) {
      option.addEventListener("click", select);
    }

    for (const e of document.getElementsByClassName("trigger")) {
      e.addEventListener("input", update);
    }

    setTweet();
  };

  update();
});

const convertSym = s =>
  s
  .replace(/。/g, ". ")
  .replace(/，/g, ", ")
  .replace(/！/g, "! ")
  .replace(/？/g, "? ")
  .replace(/；/g, "; ")
  .replace(/：/g, ": ")
  .replace(/、/g, "· ")
  .replace(/＿/g, "_")
  .replace(/（/g, " (")
  .replace(/）/g, ") ")
  .replace(/「/g, " ‹")
  .replace(/」/g, "› ")
  .replace(/『/g, " «")
  .replace(/』/g, "» ")
  .replace(/‘/g, ` '`)
  .replace(/’/g, `' `)
  .replace(/“/g, ` "`)
  .replace(/”/g, `" `);

const maps = {
  emcStandard: mapEmcStandard,
  yueStandard: mapYueStandard,
  yueVerbose: mapYueVerbose,
  yueSimple: mapYueSimple,
  yueAscii: mapYueAscii,
  yueIpa: mapYueIpa,
  cmnStandard: mapCmnStandard,
  cmnSimple: mapCmnSimple,
};

const tones = {
  emc: "\u0304\u0301\u0300\u030D",
  yue: "\u0300\u0301\u0304\u030D",
  cmn: "\u0301\u030C\u0300\u0302\u0307",
};

const convert = (lang, s, alphabetType) =>
  s.replace(/\p{sc=Han}/gu, character => {
    let phonetics = null
    for(const key of ["simple", "ipa", "ascii", "verbose", "standard"]) {
      const suffix = capitalize(key)
      if(alphabetType == key && maps[lang + suffix]) {
        phonetics = maps[lang + suffix][character]
        break
      }
    }
    if (!phonetics)
    phonetics = maps[lang + "Standard"][character]

    if (!phonetics) {
      return character;
    } else {
      if (cyrillic.checked) {
        const simple = alphabetType === "simple" && lang != "emc"
        phonetics = phonetics.map((phonetic) =>
          phonetic
          .normalize("NFD")
          .replace(/ı/g, "i")
          .replace(/ȷ/g, "j")

          .replace(/ɲ/g, "nj")
          .replace(/ᶎ/g, "zj")
          .replace(/ᶊ/g, "sj")
          .replace(/ɳ/g, "nr")
          .replace(/ʐ/g, "zr")
          .replace(/ʂ/g, "sr")
          .replace(/ɖ/g, "dr")
          .replace(/ʈ/g, "tr")
          .replace(/\u0321/g, "j")
          .replace(/\u0322/g, "r")

          .replace(/i/g, "и")
          .replace(/y/g, "ѵ")
          .replace(/u/g, "у")

          .replace(/e/g, lang === "cmn" ? "э" : "є")
          .replace(/ø/g, "е")
          .replace(/ə/g, "э")
          .replace(/o/g, "о")

          .replace(/a/g, "а")

          .replace(/b/g, "б")
          .replace(/p/g, "п")
          .replace(/f/g, "ф")
          .replace(/w/g, "в")
          .replace(/m/g, "м")
          .replace(/v/g, "ъ")

          .replace(/d/g, "д")
          .replace(/t/g, "т")
          .replace(/s/g, "с")
          .replace(/z/g, simple ? "ѕ" : "з")
          .replace(/n/g, "н")
          .replace(/l/g, "л")
          .replace(/r/g, "р")

          .replace(/ʦ/g, "ц")
          .replace(/ʣ/g, "ѕ")

          .replace(/g/g, "г")
          .replace(/c/g, simple ? "ц" : "к")
          .replace(/k/g, "к")
          .replace(/x/g, "х")
          .replace(/h/g, "ғ")
          .replace(/ŋ/g, "ӈ")
          .replace(/j/g, "ь")

          .replace(/q/g, "ҁ")
        );
      }

      if (uppercase.checked)
        phonetics = phonetics.map((phonetic) =>
          phonetic
          .replace(/ʤ/g, "dʒ")
          .replace(/ʧ/g, "tʃ")
          .replace(/ʣ/g, "dz")
          .replace(/ʦ/g, "ts")
          .toUpperCase()
          .replace(/ȷ/g, "J")
        );

      if (phonetics.length == 1 || single.checked) {
        return phonetics.map(
          (phonetic) =>
          `<span class="${lang}-phonetic-${tones[lang].indexOf(
              phonetic.slice(-1)
            )}">${phonetic}</span>`
        )[0];
      } else {
        return `<div class="multiple">${phonetics
          .map(
            (phonetic) =>
              `<button class="option ${lang}-phonetic-${tones[lang].indexOf(
                phonetic.slice(-1)
              )}">${phonetic}</button>`
          )
          .join("<br/>")}</div>`;
      }
    }
  });