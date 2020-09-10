const lang = "yue"
const cyrillic = false

// Get all the text nodes in the document, and replace any Chinese characters found with Jyutping.
$(getTextNodesIn(document)).each((index, el) => {
  const $el = $(el);
  const text = $el.text();
  let chars = [];
  let frag = document.createDocumentFragment();

  const charmap = {
    yue: mapYueStandard,
    cmn: mapCmn,
    cmnSimple: mapCmnSimple
  } [lang]

  // Walk through the text in this node one character at a time.
  for (const c of text) {
    let phonetics = charmap[c];
    if (phonetics) {
      if (cyrillic) phonetics = phonetics.map(phonetic =>
        phonetic.normalize("NFD")
        .replace(/ı|i/g, "и")
        .replace(/y/g, "ѵ")
        .replace(/u/g, "у")

        .replace(/e/g, ["cmn", "cmnSimple"].includes(lang) ? "э" : "є")
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

        .replace(/s\u0323/g, "ш")
        .replace(/z\u0323/g, "җ")
        .replace(/c\u0323/g, "щ")

        .replace(/d/g, "д")
        .replace(/t/g, "т")
        .replace(/s/g, "с")
        .replace(/z/g, lang === "cmnSimple" ? "ѕ" : "з")
        .replace(/n/g, "н")
        .replace(/l/g, "л")
        .replace(/r/g, "р")

        .replace(/ʦ/g, "ц")
        .replace(/ʣ/g, "ѕ")

        .replace(/ʤ/g, "җ")
        .replace(/ʧ/g, "щ")
        .replace(/ʒ/g, "ж")
        .replace(/ʃ/g, "ш")

        .replace(/g/g, "г")
        .replace(/c/g, lang === "cmnSimple" ? "ц" : "к")
        .replace(/k/g, "к")
        .replace(/x/g, "х")
        .replace(/h/g, "ғ")
        .replace(/ŋ/g, "ӈ")
        .replace(/j|ȷ/g, "ь")

        .replace(/q/g, "ҁ")

        .normalize("NFC")
      )

      if (chars.length > 0) {
        frag.appendChild(document.createTextNode(chars.join('')));
        chars = [];
      }

      const ruby = document.createElement("ruby");
      ruby.appendChild(document.createTextNode(c));
      ruby.setAttribute("class", "romanize-yue");
      const rt = document.createElement("rt");

      const selectsOne = true;
      if (selectsOne)
        rt.innerHTML = phonetics[0];
      else {
        const div = document.createElement("div");
        div.innerHTML = phonetics.reverse().join("<br/>");
        rt.appendChild(div);
      }

      rt.setAttribute("style", "font-size: 100%;")
      ruby.appendChild(rt);
      frag.appendChild(ruby);
    } else
      chars.push(c);
  }

  if (chars.length > 0)
    frag.appendChild(document.createTextNode(chars.join('')));

  // Replace the text node with the fragment we've assembled.
  $el.replaceWith(frag);
});

// Selects all decendent text nodes of an element.
// http://stackoverflow.com/questions/298750/how-do-i-select-text-nodes-with-jquery
function getTextNodesIn(node, includeWhitespaceNodes) {
  const whitespace = /^\s*$/;
  let textNodes = [];

  const getTextNodes = node => {
    if (node.nodeType == 3) {
      if (includeWhitespaceNodes || !whitespace.test(node.nodeValue))
        textNodes.push(node);
    } else
      for (const childNode of node.childNodes)
        getTextNodes(childNode);
  }

  getTextNodes(node);
  return textNodes;
}