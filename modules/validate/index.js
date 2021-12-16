function imgOutside(text, regex, message) {
  const res = text.match(regex)

  if (res !== null) throw new Error('Text validation error: ' + message)

  return true
}

function unclosedBracket(text, regex, message) {
  const [regex1, regex2] = regex
  if (text.match(regex1).length !== text.match(regex2).length)
    throw new Error('Text validation error: ' + message)
}

module.exports = { imgOutside, unclosedBracket }
