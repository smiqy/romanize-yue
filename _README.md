<style>
  ruby.romanize-yue {
    margin-left: 1px;
    margin-right: 1px;
  }

  ruby.romanize-yue rt {
    font-size: 100%;
    font-family: 'Noto Sans', 'Helvetica Neue', sans-serif;
  }
</style>

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

<ruby class="romanize-yue">人<rt>nȷəǹ</rt></ruby><ruby class="romanize-yue">人<rt>nȷəǹ</rt></ruby><ruby class="romanize-yue">生<rt>srəŋ̀</rt></ruby><ruby class="romanize-yue">而<rt>nȷı̀</rt></ruby><ruby class="romanize-yue">自<rt>ʣı̄</rt></ruby><ruby class="romanize-yue">由<rt>ȷəù</rt></ruby>，<ruby class="romanize-yue">在<rt>ʣoı̄</rt></ruby><ruby class="romanize-yue">尊<rt>ʦyǹ</rt></ruby><ruby class="romanize-yue">嚴<rt>ŋım̀</rt></ruby><ruby class="romanize-yue">和<rt>hvò</rt></ruby><ruby class="romanize-yue">權<rt>gxyǹ</rt></ruby><ruby class="romanize-yue">利<rt>leı̄</rt></ruby><ruby class="romanize-yue">上<rt>zȷœŋ̄</rt></ruby><ruby class="romanize-yue">一<rt>qȷən̍</rt></ruby><ruby class="romanize-yue">律<rt>lœn̍</rt></ruby><ruby class="romanize-yue">平<rt>bxıŋ̀</rt></ruby><ruby class="romanize-yue">等<rt>təŋ́</rt></ruby>。<ruby class="romanize-yue">他<rt>txà</rt></ruby><ruby class="romanize-yue">們<rt>muǹ</rt></ruby><ruby class="romanize-yue">賦<rt>fū</rt></ruby><ruby class="romanize-yue">有<rt>ȷəú</rt></ruby><ruby class="romanize-yue">理<rt>leı́</rt></ruby><ruby class="romanize-yue">性<rt>sıŋ̄</rt></ruby><ruby class="romanize-yue">和<rt>hvò</rt></ruby><ruby class="romanize-yue">良<rt>lœŋ̀</rt></ruby><ruby class="romanize-yue">心<rt>səm̀</rt></ruby>，<ruby class="romanize-yue">並<rt>bıŋ̄</rt></ruby><ruby class="romanize-yue">應<rt>qıŋ̄</rt></ruby><ruby class="romanize-yue">以<rt>ı́</rt></ruby><ruby class="romanize-yue">兄<rt>xıŋ̀</rt></ruby><ruby class="romanize-yue">弟<rt>dəı̄</rt></ruby><ruby class="romanize-yue">關<rt>cvaǹ</rt></ruby><ruby class="romanize-yue">係<rt>həı̄</rt></ruby><ruby class="romanize-yue">的<rt>tıŋ̍</rt></ruby><ruby class="romanize-yue">精<rt>ʦıŋ̀</rt></ruby><ruby class="romanize-yue">神<rt>zȷəǹ</rt></ruby><ruby class="romanize-yue">相<rt>sœŋ̀</rt></ruby><ruby class="romanize-yue">對<rt>tœı̄</rt></ruby><ruby class="romanize-yue">待<rt>doı̄</rt></ruby>。