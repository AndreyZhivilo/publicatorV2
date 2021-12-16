const fs = require('fs')
const inquirer = require('inquirer')

module.exports = function projectSelect() {
  const files = fs.readdirSync('src')
  if (files.length === 0) throw new Error('no subfolders in src directory')
  return inquirer.prompt([
    {
      type: 'list',
      name: 'projectFolder',
      message: 'Выбери папку проекта',
      choices: files,
    },
  ])
}
