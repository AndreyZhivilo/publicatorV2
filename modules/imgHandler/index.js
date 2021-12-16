const download = require('image-downloader')
const Link = require('../../classes/link')

async function singleImgLoader(linkObj, folderName, filename) {
  const options = {
    url: linkObj.str,
    dest: `${folderName}/${filename}.${linkObj.extention}`, // will be saved to /path/to/dest/image.jpg
    extractFilename: false,
  }
  try {
    const filename = await download.image(options)
    console.log('Saved to', filename)
    return filename
  } catch (e) {
    console.error(e)
  }
}

function imgToLoad(map, linksArray) {
  const result = linksArray.filter((link) => {
    if (!map[link.str] && link.needToDownload) return link
  })
  return result.length > 0 ? true : false
}

function imgFinder(text, regexArr) {
  const [regex1, regex2] = regexArr
  if (text.match(regex1) === null && text.match(regex2) === null)
    throw new Error('No images was founded')

  const allLinksArray = []
  let externalLinks = text.match(regex1)
  let internalLinks = text.match(regex2)
  let all = [...new Set(externalLinks), ...new Set(internalLinks)]
  all.forEach((link) => allLinksArray.push(new Link(link)))
  return allLinksArray
}

function extentionExtractor(link) {
  const splited = link.split('.')
  return splited[splited.length - 1]
}

async function loadAllImgs(linksArray, fileBaseName, outputFolder) {
  const res = await linksArray.reduce(async (map, link, index) => {
    const newMap = await map
    const filename = `${fileBaseName}-${index}`
    if (link.needToDownload) {
      const file = await singleImgLoader(link, outputFolder, filename)
      const fileNameArr = file.filename.split('/')
      const outputFileName = fileNameArr[fileNameArr.length - 1]
      link.localName = outputFileName
      link.localPath = file.filename
    } else {
      link.localName = link.str
      link.localPath = `${outputFolder}/${link.name}.${link.extention}`
    }
    newMap[link.str] = link
    return newMap
  }, Promise.resolve({}))
  return res
}

module.exports = {
  singleImgLoader,
  extentionExtractor,
  imgFinder,
  imgToLoad,
  loadAllImgs,
}
