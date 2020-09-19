const data = {emc, yue, cmn}

const capitalize = s =>
  s == "" ? s : s[0].toUpperCase() + s.slice(1)

document.addEventListener("DOMContentLoaded", async () => {
  const source = document.getElementById("source");
  const sink = {
    emc: document.getElementById("emc"),
    yue: document.getElementById("yue"),
    cmn: document.getElementById("cmn"),
  }
  const alphabet = document.getElementById("alphabet");

  const select = event => {
    if (event.srcElement) {
      const e = document.createElement("span");
      for (const a of event.srcElement.attributes)
        e.setAttribute(a.name, a.value);
      e.innerHTML = event.srcElement.innerHTML;
      event.srcElement.parentElement.replaceWith(e);
    }
    setTweet();
  };

  const setTweet = event => {
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

const convert = (lang, s, alphabetType) =>
  s.replace(/\p{sc=Han}/gu, character => {
    const show0 = show[lang][alphabetType] || show[lang].standard
    const data0 = data[lang][character]
    if(! data0) return character

    const toUpperCase = x => 
      x
      .replace(/ʣ/g, "dz")
      .replace(/ʦ/g, "ts")
      .replace(/ȷ/g, "j")
      .toUpperCase()

    if (data0.length == 1 || single.checked) 
      return data0.map(datum =>
        `<span class="syllable ${lang} tone-${datum.tone} ${datum.voiced ? "voiced" : ""}">${
          (uppercase.checked ? toUpperCase : x => x)(show0(datum))
        }</span>`
      )[0];

    return `<div class="multiple">${data0
      .map(datum =>
        `<button class="option syllable ${lang} tone-${datum.tone} ${datum.voiced ? "voiced" : ""}">${
          (uppercase.checked ? toUpperCase : x => x)(show0(datum))
        }</button>`
      )
      .join("<br/>")}</div>`;
    })