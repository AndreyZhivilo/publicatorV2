const moment = require('moment')
const sharp = require('sharp')
module.exports = class Picture {
  constructor(ctx, linkObj, width, height) {
    this.siteUrl = ctx.siteUrl
    this.internalName = linkObj.localName
    this.uploadsPath = linkObj.localPath
    this.outputFolder = ctx.folder.outputImgPath
    this.includeTimeSubfolders = ctx.includeTimeSubfolders
    this.height = width
    this.width = height
    this.year = moment().format('YYYY')
    this.month = moment().format('MM')
  }
  htmlConstructor() {
    if (this.includeTimeSubfolders) {
      return `<img src="${this.siteUrl}/wp-content/uploads/${this.year}/${this.month}/${this.internalName}" alt="" width="${this.width}" height="${this.height}" />`
    } else {
      return `<img src="${this.siteUrl}/wp-content/uploads/${this.internalName}" alt="" width="${this.width}" height="${this.height}" />`
    }
  }

  crop() {
    return new Promise((res, rej) => {
      sharp(this.uploadsPath)
        .resize(this.width, this.height, { fit: 'cover' })
        .toFile(`${this.outputFolder}/${this.internalName}`)
        .then(() => {
          console.log('Image Croped', this.internalName)
          res()
        })
        .catch((e) => rej('Error durin resizing ' + e + this.uploadsPath))
    })
  }
}
