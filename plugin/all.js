// Get all the text nodes in the document, and replace any Chinese characters found with Jyutping.
$(getTextNodesIn(document)).each(function (index, el) {
    var $el, text, chars, jyutping, frag, match;
    $el = $(el), text = $el.text(), chars = [], frag = document.createDocumentFragment();

    // Walk through the text in this node one character at a time.
    for (const c of text) {
        jyutping = _charmap[c];

        // If the char was in our map (i.e. it's a Chinese char), replace it with Jyutping.
        if (jyutping) {
            if (chars.length) {
                frag.appendChild(document.createTextNode(chars.join('')));
                chars = [];
            }

            match = jyutping.match(/^(\w+)(\d)$/);
            if (match && match.length == 3) {
                const ruby = document.createElement('ruby');
                const rt = document.createElement('rt');
                ruby.appendChild(document.createTextNode(c));
                rt.appendChild(document.createTextNode(jyutping));
                ruby.appendChild(rt);
                frag.appendChild(ruby);
            }
            else
                chars.push(jyutping);
        }
        else
            chars.push(c);
    }

    // Add any remaining chars to the document fragment.
    if (chars.length)
        frag.appendChild(document.createTextNode(chars.join('')));

    // Replace the text node with the fragment we've assembled.
    $el.replaceWith(frag);
});

// Selects all decendent text nodes of an element.
// http://stackoverflow.com/questions/298750/how-do-i-select-text-nodes-with-jquery
function getTextNodesIn(node, includeWhitespaceNodes) {
    const textNodes = [];

    function getTextNodes(node) {
        if (node.nodeType == 3) {
            if (includeWhitespaceNodes || !/^\s*$/.test(node.nodeValue))
                textNodes.push(node);
        } else
            for (const childNode of node.childNodes)
                getTextNodes(childNode);
    }

    getTextNodes(node);
    return textNodes;
}