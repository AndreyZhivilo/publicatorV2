const mammoth = require('mammoth')

const fs = require('fs')

async function textLoader(folderName) {
  const filePath = `./src/${folderName}/uploads/text/index.docx`
  if (!fs.existsSync(filePath))
    throw new Error("docx file doesn't exist in that folder")
  try {
    const docParse = await mammoth.convertToHtml({
      path: filePath,
    })
    //console.log('Docx convertation - ', docParse.messages)
    let html = docParse.value
    html = html.replace(/<a id="_\w*?"><\/a>/g, '')
    html = html.replace(
      /(<h[123]>)<strong>(.*?)<\/strong>(<\/h[123]>)/g,
      '$1$2$3'
    )
    return html
  } catch (e) {
    console.error('Some problem with docx to html convertation - ', e)
  }
}

function outputWriter(text, path) {
  fs.writeFileSync(path, text)
  console.log('Article html-code is ready!')
}

module.exports = { textLoader, outputWriter }
