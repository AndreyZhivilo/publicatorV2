module.exports = class Link {
  constructor(str) {
    this.str = str
    this.type = this.typeChecker(this.str)
    this.needToDownload = this.toDownload(this.type)
    this.name = this.extentionExtractor(str).name
    this.extention = this.extentionExtractor(str).extention
    this.localName = ''
    this.localPath = ''
  }

  typeChecker(str) {
    return str.includes('http') ? 'external' : 'internal'
  }
  toDownload(type) {
    return type === 'external' ? true : false
  }

  extentionExtractor(link) {
    const splited = link.split('.')
    return {
      name: splited[splited.length - 2],
      extention: splited[splited.length - 1],
    }
  }
}
