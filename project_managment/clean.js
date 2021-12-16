const fs = require('fs')

if (!fs.existsSync('src')) {
  throw new Error("src folder doesn't exists")
}
//finding all files and subdirectories
const files = fs.readdirSync('src')

function cleanDir(files) {
  if (files.length > 0) {
    //deleting them all in a loop
    files.forEach((file) => {
      fs.rmSync(`src/${file}`, {
        recursive: true,
      })
    })

    console.log('src directory cleaned!')
  } else {
    console.log('src directory is empty')
  }
}

cleanDir(files)
