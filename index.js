const projectSelect = require('./project_managment/start.js')
const { textLoader, outputWriter } = require('./modules/textLoader')
const Article = require('./classes/index.js')

;(async function () {
  try {
    const answer = await projectSelect()
    const folder = answer.projectFolder
    const text = await textLoader(folder)
    const article = new Article(folder, text)
    article.textValidation()
    const file = await article.downloadAllImg()

    article.shortcodesFinder()

    const outputPromises = await article.shortcodes.map(async (shortcode) =>
      shortcode.calculateOutput()
    )
    const output = await Promise.all(outputPromises)
    const res = await article.calculateArticleOutput(output)

    outputWriter(res, `${article.folder.outputTextPath}/output.txt`)
  } catch (e) {
    console.error(e)
  }
})()
