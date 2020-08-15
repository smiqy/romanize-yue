document.addEventListener("DOMContentLoaded", () => {
  const source = document.getElementById("source");
  const sinkEmc = document.getElementById("emc");
  const sinkYue = document.getElementById("yue");
  const sinkCmn = document.getElementById("cmn");
  const single = document.getElementById("single");
  const simple = document.getElementById("simple");
  const cyrillic = document.getElementById("cyrillic");
  const uppercase = document.getElementById("uppercase");

  const select = event => {
    if (event.srcElement) {
      const e = document.createElement("span");
      for (const a of event.srcElement.attributes)
        e.setAttribute(a.name, a.value)
      e.innerHTML = event.srcElement.innerHTML
      event.srcElement.parentElement.replaceWith(e);
    }
    setTweet();
  }

  const setTweet = event => {
    document.getElementsByTagName("a")[0]
      .setAttribute("href", "https://twitter.com/intent/tweet?text=" + encodeURIComponent([
        source.value,
        sinkEmc.textContent,
        sinkYue.textContent,
        sinkCmn.textContent
      ].join("\n\n")));
  }

  const update = event => {
    const sourceText = convertSym(source.value)
    sinkEmc.innerHTML = convert("emc", sourceText, simple.checked) //.replace(/[a-zıȷʦʣŋ]+[\u0304\u0301\u0300\u030D]/g, );
    sinkYue.innerHTML = convert("yue", sourceText, simple.checked)
    sinkCmn.innerHTML = convert("cmn", sourceText, simple.checked)

    for (const option of document.querySelectorAll(".option")) {
      option.addEventListener("click", select);
    }

    for (const e of document.getElementsByClassName("trigger"))
      e.addEventListener("input", update);

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
  emc: mapEmc,
  yue: mapYue,
  cmn: mapCmn,
  cmnSimple: mapCmnSimple,
}

const tones = {
  emc: "\u0304\u0301\u0300\u030D",
  yue: "\u0300\u0301\u0304\u030D",
  cmn: "\u0301\u030C\u0300\u0302\u0307",
}

const convert = (lang, s, isSimple) =>
  s.replace(
    /\p{sc=Han}/ug,
    character => {
      let phonetics = (isSimple && maps[lang + "Simple"] ? maps[lang + "Simple"] : maps[lang])[character]

      if (!phonetics) {
        return character;
      } else {
        if (cyrillic.checked)
          phonetics = phonetics.map(phonetic =>
            phonetic.normalize("NFD")
            .replace(/ı/g, "и")
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
            .replace(/z/g, lang === "cmn" && simple.checked ? "ѕ" : "з")
            .replace(/n/g, "н")
            .replace(/l/g, "л")
            .replace(/r/g, "р")

            .replace(/ʦ/g, "ц")
            .replace(/ʣ/g, "ѕ")

            .replace(/ʤ/g, "җ")
            .replace(/ʧ/g, "щ")
            .replace(/ʒ/g, "ж")
            .replace(/ʃ/g, "ш")

            .replace(/s\u0323/g, "ш")
            .replace(/z\u0323/g, "җ")
            .replace(/c\u0323/g, "щ")

            .replace(/g/g, "г")
            .replace(/c/g, lang === "cmn" && simple.checked ? "ц" : "к")
            .replace(/k/g, "к")
            .replace(/x/g, "х")
            .replace(/h/g, "ғ")
            .replace(/ŋ/g, "ӈ")
            .replace(/ȷ/g, "ь")

            .replace(/q/g, "ҁ")
          );

        if (uppercase.checked)
          phonetics = phonetics.map(phonetic => phonetic
            .replace(/ʤ/g, "dʒ")
            .replace(/ʧ/g, "tʃ")
            .replace(/ʣ/g, "dz")
            .replace(/ʦ/g, "ts")
            .toUpperCase()
            .replace(/ȷ/g, "J")
          )

        if (phonetics.length == 1 || single.checked) {
          return phonetics.map(phonetic =>
            `<span class="${lang}-phonetic-${tones[lang].indexOf(phonetic.slice(-1))}">${phonetic}</span>`
          )[0]
        } else {
          return `<div class="multiple">${
            phonetics.map(phonetic => `<button class="option ${lang}-phonetic-${tones[lang].indexOf(phonetic.slice(-1))}">${phonetic}</button>`).join("<br/>")
          }</div>`
        }
      }
    }
  );