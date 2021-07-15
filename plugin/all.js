


const replace = (s, replacements) =>
    replacements.reduce((acc, replacement) => acc.replace(...replacement), s);

const fromJyutping = jyutping => {
    let [syllable, tone] = jyutping.match(/^([a-z]+)([1-6])$/).slice(1);

    syllable = replace(syllable, [
        [/a/g, "ӑ"],
        [/ӑӑ/, "a"],
        [/yu/g, "y"],
        [/oe|eo/, "ø"],
        [/^c/, "ŧ"],
        [/^z/, "đ"],
        [/^h/, "x"],
        [/^g/, "c"],
        [/w/, "v"],
        [/ng/g, "g"],

        [/j(?=[iyø])/g, ""],
        [/v(?=u)/g, ""],

        [/(?<=[iyueøoӑa])i$/, "j"],
        [/(?<=[iyueøoӑa])u$/, "v"],

        [/^k/, "kx"],
        [/^c/, "k"],
        [/^t/, "tx"],
        [/^d/, "t"],
        [/^ŧ/, "ŧx"],
        [/^đ/, "ŧ"],
        [/^p/, "px"],
        [/^b/, "p"],
    ]);

    if (/[ktp]$/.test(syllable)) {
        tone = {
            1: 7,
            3: 7,
            6: 8,
        }[tone];

        syllable = syllable
            .replace(/k$/, "g")
            .replace(/t$/, "n")
            .replace(/p$/, "m");
    }

    tone = [0, 1, 2, 4, 5, 6, 3, 7][parseInt(tone) - 1];
    voiced = 4 <= tone;
    tone %= 4;

    syllable = syllable
        .replace(/(?<!^)([jv])x/, "x$1");

    if (voiced) {
        syllable = replace(syllable, [
            [/^k/, "c"],
            [/^t/, "d"],
            [/^ŧ/, "đ"],
            [/^ṭ/, "ḍ"],
            [/^p/, "b"],
            [/^x/, "h"],
            [/^s/, "z"],
            [/^ṣ/, "ẓ"],
            [/^f/, "w"],
        ]);

        if ([0, 1].includes(tone))
            syllable = syllable
                .replace(/(?<=[cdđḍb])(?!x)/, "h")
                .replace(/(?<=[cdđḍb])x/, "");
    } else
        syllable = syllable
            .replace(/^(?=[gnlmjviyueøoӑa])/, "q");

    syllable = syllable

    return tone == 3
        ? syllable
            .replace(/g$/, "k")
            .replace(/n$/, "t")
            .replace(/m$/, "p")
        : syllable
            .replace(/(?<=[iyueøoӑa])|^[gm]$/, ["\u0300", "\u0301", ""][tone])
            .normalize("NFC");

};

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
                rt.appendChild(document.createTextNode(fromJyutping(jyutping)));
                rt.setAttribute("style", "font-size: 80%;")
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

