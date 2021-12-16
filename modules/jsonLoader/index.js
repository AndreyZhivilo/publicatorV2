const fs = require('fs')

function jsonLoader(path) {
  if (!fs.existsSync(path))
    throw new Error("File you are trying to read doesn't exists")
  const data = fs.readFileSync(path)
  return JSON.parse(data)
}

function jsonWriter(obj, path) {
  const data = JSON.stringify(obj)
  fs.writeFileSync(path, data)
}

module.exports = { jsonLoader, jsonWriter }
