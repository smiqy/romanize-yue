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

_we may ignore þe difference, at least we must know it þough._

### initial

|                 | tenuis | nasal | approximant | fricative |
| :-------------- | :----- | :---- | :---------- | :-------- |
| velar           | c      | ŋ     |             | x         |
| labial velar    | cv     |       | v           | xv        |
| alveolar        | ʦȷ     |       | ȷ           | sȷ        |
| retroflex       | ʦr     |       |             | sr        |
| dental          | ʦ      |       |             | s         |
| dental plossive | t      | n     | l           |           |
| labial          | p      | m     |             | f         |

- any tenuis has an aspirated counterpart `-x`.
- retroflex and alveolar initials in a same column are pronounced equal.

### nucleus

|        | front | front round | central | back |
| :----- | :---- | :---------- | :------ | :--- |
| closed | ı     | y           |         | u    |
| mid    | e     | œ           | ə       | o    |
| open   |       |             | a       |      |
| nasal  | ŋ     |             |         | m    |

### terminal

`ı`, `u`, `ŋ`, `n`, `m`

### tone

we have #{high, low} × #{falling, rising, flat, checked} = 8 tones.

|  falling  |  rising   |   flat    |  checked  |
| :-------: | :-------: | :-------: | :-------: |
| a&#x0300; | a&#x0301; | a&#x0304; | a&#x030D; |

for any syllable, its initial indicates hweþer it is high or low.

| high | low                 |
| :--- | :------------------ |
| c    | g                   |
| t    | d                   |
| ʦ    | ʣ                   |
| p    | b                   |
| x    | h                   |
| s    | z                   |
| f    | w                   |
| q-   | ∅, ŋ, n, m, l, ȷ, v |

### rule

- `xv` is pronounced equal to `f`.
- no (`x`, `h`) preceding `ȷ` is pronounced.
- no `h` preceding (`v`, `y`) is pronounced.
- no (`ŋ`, `n`, `m`) preceding (`ȷ`, `v`) is pronounced.
- no `ŋ` preceding (`ı`, `y`, `œ`) is pronounced.
- no letter preceding `’` is pronounced.
