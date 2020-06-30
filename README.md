# romanize-yue

a Google Chrome plugin hwich add þe auþor's original cantonese romanization above every chinese character when you have pressed þe button.

## system

*we may ignore the difference, at least we must know it þough.*

### initial

||tenuis|nasal|approximant|fricative|
|:-|:-|:-|:-|:-|
|velar          |c |ŋ | |x |
|labial velar   |cv|  |v|xv|
|alveolar       |ʦȷ|  |ȷ|sȷ|
|retroflex      |ʦr|  | |sr|
|dental         |ʦ |  | |s |
|dental plossive|t |n |l|  |
|labial         |p |m | |f |

- any tenuis has an aspirated counterpart `-x`.
- retroflex and alveolar initials in a same column are pronounced equal.

### nucleus

||front|front round|central|back|
|:-|:-|:-|:-|:-|
|closed|ı|y| |u|
|mid   |e|œ|ə|o|
|open  | | |a| |
|nasal |ŋ| | |m|

### terminal
`ı`, `u`, `ŋ`, `n`, `m`

### tone

we have #{high, low} × #{falling, rising, flat, checked} = 8 tones.

|falling|rising|flat|checked|
|:-:|:-:|:-:|:-:|
|a&#x0300;|a&#x0301;|a&#x0304;|a&#x030D;|

for any syllable, its initial indicates hweþer it is high or low.

|high|low|
|:-|:-|
|c|g|
|t|d|
|ʦ|ʣ|
|p|b|
|x|h|
|s|z|
|f|w|
|q-|∅, ŋ, n, m, l, ȷ, v|

### rule

- `xv` is pronounced equal to `f`.
- no (`x`, `h`) preceding `ȷ` is pronounced.
- no `h` preceding (`v`, `y`) is pronounced.
- no (`ŋ`, `n`, `m`) preceding (`ȷ`, `v`) is pronounced.
- no `ŋ` preceding (`ı`, `y`, `œ`) is pronounced.
- no letter preceding `’` is pronounced.

### example

<ruby style="margin-left: 1px; margin-right: 1px;">人<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">nȷəǹ</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">人<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">nȷəǹ</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">生<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">srəŋ̀</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">而<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">nȷı̀</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">自<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">ʣı̄</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">由<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">ȷəù</rt></ruby>
，
<ruby style="margin-left: 1px; margin-right: 1px;">在<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">ʣoı̄</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">尊<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">ʦyǹ</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">嚴<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">ŋım̀</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">和<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">hvò</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">權<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">gxyǹ</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">利<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">leı̄</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">上<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">zȷœŋ̄</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">一<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">qȷən̍</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">律<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">lœn̍</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">平<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">bxıŋ̀</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">等<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">təŋ́</rt></ruby>
。
<ruby style="margin-left: 1px; margin-right: 1px;">他<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">txà</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">們<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">muǹ</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">賦<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">fū</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">有<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">ȷəú</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">理<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">leı́</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">性<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">sıŋ̄</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">和<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">hvò</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">良<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">lœŋ̀</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">心<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">səm̀</rt></ruby>
，
<ruby style="margin-left: 1px; margin-right: 1px;">並<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">bıŋ̄</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">應<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">qıŋ̄</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">以<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">ı́</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">兄<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">xıŋ̀</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">弟<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">dəı̄</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">關<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">cvaǹ</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">係<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">həı̄</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">的<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">tıŋ̍</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">精<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">ʦıŋ̀</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">神<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">zȷəǹ</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">相<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">sœŋ̀</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">對<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">tœı̄</rt></ruby>
<ruby style="margin-left: 1px; margin-right: 1px;">待<rt style="font-size: 100%; font-family: 'Noto Sans', 'Helvetica Neue', sans-serif">doı̄</rt></ruby>
。