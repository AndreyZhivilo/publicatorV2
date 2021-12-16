function shortcodesObjMaker(text, regex, className, ctx, outputArray) {
  const shortcodesText = text.match(regex)
  if (shortcodesText) {
    console.log('Text Array - ', shortcodesText)
    shortcodesText.forEach((shortcode) => {
      const shortcodeObj = new className(ctx, shortcode)
      outputArray.push(shortcodeObj)
    })
  }
}

module.exports = { shortcodesObjMaker }
