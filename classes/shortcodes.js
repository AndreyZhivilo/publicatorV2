const Picture = require('./picture')

class Shortcode {
  constructor(article, inputText) {
    this.inputText = inputText
    this.listElements = this.inputText.match(/(?<=<li>).*?(?=<\/li>)/g)
    this.outputText = ''
    this.containerWidth = article.containerWidth
    this.linkRegex = article.linkRegex
    this.imgMap = article.imgMap
    this.imgNum = this.getImgStrings().length
    this.colNum = this.getColsNum()
    this.picWidth = this.calculateWidth()
    this.picHeight = this.picWidth
    this.pictures = this.getPictures(article, this.getImgStrings())
  }

  getColsNum() {
    const match = this.inputText.match(/(?<=\[\w*?-\w*?-)\d(?=\])/g)
    return match ? Number(match[0]) : this.imgNum
  }
  getImgStrings() {
    const [regex1, regex2] = this.linkRegex
    const external = this.inputText.match(regex1)
    const internal = this.inputText.match(regex2)
    const allLinks = [...new Set(external), ...new Set(internal)]
    return allLinks
  }

  getPictures(ctx, allLinks) {
    const pictures = allLinks.reduce((arr, current) => {
      arr.push(
        new Picture(ctx, this.imgMap[current], this.picWidth, this.picHeight)
      )
      return arr
    }, [])

    return pictures
  }

  calculateWidth() {
    const num = this.colNum ? this.colNum : this.imgNum
    const width = (this.containerWidth - num * 15 * 2) / num

    return parseInt(width)
  }
}

class imgShortcode extends Shortcode {
  constructor(article, inputText) {
    super(article, inputText)
  }
  async calculateOutput() {
    let imgHtmlPromise = await this.pictures.map(async (picture) => {
      await picture.crop()
      return picture.htmlConstructor()
    })

    let imgHtml = await Promise.all(imgHtmlPromise)

    const rowInnerHtml = imgHtml.reduce((string, current) => {
      string += `[colonizator_col]${current}[/colonizator_col]`
      return string
    }, '')

    this.outputText = `[colonizator_wrap]${rowInnerHtml}[/colonizator_wrap]`
    //console.log('Промежуточный результат - ', this.outputText)

    return { input: this.inputText, output: this.outputText }
  }
}

class listShortcode extends Shortcode {
  constructor(article, inputText) {
    super(article, inputText)
  }
  colFormatter(el) {
    let output = el.reduce((str, current) => {
      str += `<li>${current}</li>`
      return str
    }, '')
    return `[colonizator_col]<ul>${output}</ul>[/colonizator_col]`
  }
  async calculateOutput() {
    let i = this.colNum
    let items = [...this.listElements]
    let oneColNum = Math.ceil(items.length / this.colNum)
    let output = ''
    for (i; i > 0; --i) {
      if (i === 1) {
        output += this.colFormatter(items)
      } else {
        output += this.colFormatter(items.splice(0, oneColNum))
      }
    }
    output = `[colonizator_wrap]${output}[/colonizator_wrap]`
    this.outputText = output
    return { input: this.inputText, output: this.outputText }
  }
}

class stepsShortcode extends Shortcode {
  constructor(article, inputText) {
    super(article, inputText)
  }

  rowConstructor(imgHtml, listItems) {
    let output = ''
    for (let i = 0; i < listItems.length; i++) {
      output += `[colonizator_col]${imgHtml[i]}${listItems[i]}[/colonizator_col]`
    }
    return `[colonizator_wrap]${output}[/colonizator_wrap]`
  }

  async calculateOutput() {
    console.log('IMGS', this.getImgStrings())

    if (this.imgNum !== this.listElements.length)
      throw new Error(
        "Numbers of imgs don't match with numbers of list items in one of the steps shortcodes"
      )
    let imgHtmlPromise = await this.pictures.map(async (picture) => {
      await picture.crop()
      return picture.htmlConstructor()
    })

    let imgHtml = await Promise.all(imgHtmlPromise)
    let items = [...this.listElements]
    let output = ''
    let i = 0
    let n = 0

    while (i < items.length && n < 100) {
      output += this.rowConstructor(
        imgHtml.slice(i, i + this.colNum),
        items.slice(i, i + this.colNum)
      )
      i = i + this.colNum
      n++
    }
    this.outputText = output
    return { input: this.inputText, output: this.outputText }
  }
}

class videoShortcode extends Shortcode {
  constructor(article, inputText) {
    super(article, inputText)
  }
}

module.exports = {
  Shortcode,
  imgShortcode,
  listShortcode,
  stepsShortcode,
  videoShortcode,
}
