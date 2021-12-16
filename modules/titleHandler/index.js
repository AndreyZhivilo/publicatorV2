module.exports = function projectTitle(title, words = 3, separator = '_') {
  if (typeof title !== 'string') throw new Error('Incorrect type of title')
  const wordsArray = title.trim().split(' ')
  let output = wordsArray
    .filter((word) => word.length > 1)
    .slice(0, words)
    .map((word) => word.trim().toLowerCase())
    .map((word) => translit(word))
    .join(separator)

  return output
}

function translit(str) {
  const translitMap = {
    'а': 'a',
    'б': 'b',
    'в': 'v',
    'г': 'g',
    'д': 'd',
    'е': 'e',
    'ё': 'e',
    'ж': 'zh',
    'з': 'z',
    'и': 'i',
    'й': 'y',
    'к': 'k',
    'л': 'l',
    'м': 'm',
    'н': 'n',
    'о': 'o',
    'п': 'p',
    'р': 'r',
    'с': 's',
    'т': 't',
    'у': 'u',
    'ф': 'f',
    'х': 'h',
    'ц': 'c',
    'ч': 'ch',
    'ш': 'sh',
    'щ': 'sch',
    'ь': '',
    'ы': 'y',
    'ъ': '',
    'э': 'e',
    'ю': 'yu',
    'я': 'ya',
    '-': '-',
    '_': '_',
    'A': 'A',
    'a': 'a',
    'B': 'B',
    'b': 'b',
    'C': 'C',
    'c': 'c',
    'D': 'D',
    'd': 'd',
    'E': 'E',
    'e': 'e',
    'F': 'F',
    'f': 'f',
    'G': 'G',
    'g': 'g',
    'H': 'H',
    'h': 'h',
    'I': 'I',
    'i': 'i',
    'J': 'J',
    'j': 'j',
    'K': 'K',
    'k': 'k',
    'L': 'L',
    'l': 'l',
    'M': 'M',
    'm': 'm',
    'N': 'N',
    'n': 'n',
    'O': 'O',
    'o': 'o',
    'P': 'P',
    'p': 'p',
    'Q': 'Q',
    'q': 'q',
    'R': 'R',
    'r': 'r',
    'S': 'S',
    's': 's',
    'T': 'T',
    't': 't',
    'U': 'U',
    'u': 'u',
    'V': 'V',
    'v': 'v',
    'W': 'W',
    'w': 'w',
    'X': 'X',
    'x': 'x',
    'Y': 'Y',
    'y': 'y',
    'Z': 'Z',
    'z': 'z',
  }

  let output = str.split('').reduce((acc, curr) => {
    let latinCh = translitMap[curr]
    acc = latinCh ? acc + latinCh : acc
    return acc
  }, '')

  return output
}
