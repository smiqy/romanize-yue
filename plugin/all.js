$(getTextNodesIn(document)).each((index, el) => {
  const $el = $(el)
  const text = $el.text()
  let chars = []
  let frag = document.createDocumentFragment()

  // Walk through the text in this node one character at a time.
  for (const c of text) {
    let data = yue[c]
    if (data) {
      if (chars.length > 0) {
        frag.appendChild(document.createTextNode(chars.join('')))
        chars = []
      }

      const ruby = document.createElement("ruby")
      ruby.appendChild(document.createTextNode(c))
      ruby.setAttribute("class", "romanize-yue")
      const rt = document.createElement("rt")

      rt.innerHTML = show.yue.verbose(data[0])

      rt.setAttribute("style", "font-size: 100%;")
      ruby.appendChild(rt)
      frag.appendChild(ruby)
    } else
      chars.push(c)
  }

  if (chars.length > 0)
    frag.appendChild(document.createTextNode(chars.join('')))

  // Replace the text node with the fragment we've assembled.
  $el.replaceWith(frag)
});

// Selects all decendent text nodes of an element.
// http://stackoverflow.com/questions/298750/how-do-i-select-text-nodes-with-jquery
function getTextNodesIn(node, includeWhitespaceNodes) {
  const whitespace = /^\s*$/;
  let textNodes = [];

  const getTextNodes = node => {
    if (node.nodeType == 3) {
      if (includeWhitespaceNodes || !whitespace.test(node.nodeValue))
        textNodes.push(node)
    } else
      for (const childNode of node.childNodes)
        getTextNodes(childNode)
  }

  getTextNodes(node)
  return textNodes;
}