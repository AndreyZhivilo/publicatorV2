const { jsonLoader, jsonWriter } = require('./../modules/jsonLoader')
const { imgOutside, unclosedBracket } = require('./../modules/validate')
const { loadAllImgs, imgFinder, imgToLoad } = require('./../modules/imgHandler')
const { shortcodesObjMaker } = require('./../modules/shortcodesHandler')
const {
  imgShortcode,
  listShortcode,
  stepsShortcode,
  videoShortcode,
} = require('./../classes/shortcodes')

module.exports = class Article {
  constructor(folderName, text) {
    this.folder = {
      folderName: folderName,
      get uploadsImgPath() {
        return `./src/${this.folderName}/uploads/img`
      },
      get outputImgPath() {
        return `./src/${this.folderName}/output/img`
      },
      get outputTextPath() {
        return `./src/${this.folderName}/output/text`
      },
      get projectRoot() {
        return `./src/${this.folderName}`
      },
      get linkMapPath() {
        return `./src/${this.folderName}/links-map.json`
      },
      get projectSettingsPath() {
        return `src/${this.folderName}/project-settings.json`
      },
    }
    this.inputText = text
    let { siteUrl, containerWidth, includeTimeSubfolders } = jsonLoader(
      this.folder.projectSettingsPath
    )
    this.siteUrl = siteUrl
    this.containerWidth = containerWidth
    this.includeTimeSubfolders = includeTimeSubfolders
    this.outputText = ''
    this.validationRegex = [
      {
        regex: /\[\/[^[]*?http.*?\.(jpg|png|jpeg|webp|gif)[\s\S]*?\[/g,
        message: 'Ссылка вне квадратных скобок',
        fn: imgOutside,
      },
      {
        regex: [/\[(?!\/)/g, /\[\//g],
        message: 'Сашка забыла закрыть скобки',
        fn: unclosedBracket,
      },
    ]
    this.shortcodesRegex = [
      {
        regex: /\[col-img\][\s\S]*?\[\/col-img\]/g,
        class: imgShortcode,
      },
      {
        regex: /\[col-list-\d\][\s\S]*?\[\/col-list-\d\]/g,
        class: listShortcode,
      },
      {
        regex: /\[col-steps-\d\][\s\S]*?\[\/col-steps-\d\]/g,
        class: stepsShortcode,
      },
      {
        regex: /\[col-video\][\s\S]*?\[\/col-video\]/g,
        class: videoShortcode,
      },
    ]
    this.linkRegex = [
      /http.*?\.(jpg|png|jpeg|webp|gif)\b/g,
      /(?<=\().*?\.(jpg|png|jpeg|webp|gif)(?=\))/g,
    ]
    this.imgMap = jsonLoader(this.folder.linkMapPath)
    this.shortcodes = []
  }

  textValidation() {
    this.validationRegex.forEach((item) => {
      item.fn(this.inputText, item.regex, item.message)
    })
    console.log('Validation passed!')
  }

  async downloadAllImg() {
    console.log('Fetching images map')

    const imgArray = imgFinder(this.inputText, this.linkRegex)

    const needLoad = imgToLoad(this.imgMap, imgArray)
    if (!needLoad) {
      console.log('All pictures allready uploaded')
      return this.imgMap
    } else {
      console.log('Starting pictures download')
      try {
        this.imgMap = await loadAllImgs(
          imgArray,
          this.folder.folderName,
          this.folder.uploadsImgPath
        )
        console.log('All pictures downloaded!')
        return this.imgMap
      } catch (e) {
        console.error('Some promblem while downloading pictures' + e)
      } finally {
        jsonWriter(this.imgMap, this.folder.linkMapPath)
        console.log('Image map writen!')
      }
    }
  }

  shortcodesFinder() {
    this.shortcodesRegex.forEach((item) => {
      shortcodesObjMaker(
        this.inputText,
        item.regex,
        item.class,
        this,
        this.shortcodes
      )
    })
  }

  calculateArticleOutput(arr) {
    this.outputText = this.inputText
    arr.forEach((item) => {
      this.outputText = this.outputText.replace(item.input, item.output)
    })

    return this.outputText
  }
}
