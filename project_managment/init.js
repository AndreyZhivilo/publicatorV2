const inquirer = require('inquirer')
const fs = require('fs')
const fsPromises = require('fs/promises')
const projectTitle = require('./../modules/titleHandler')
const { jsonLoader } = require('./../modules/jsonLoader')

/************functions***************/

function settingsOptions() {
  //collecting settings for all sites
  const files = fs.readdirSync('settings')
  const settings = files.map((file) => {
    const path = `settings/${file}`
    return jsonLoader(path)
  })
  const output = {}
  settings.forEach((item) => (output[item.siteUrl] = item))
  return output
}

function createFolder(name) {
  //creating project folder
  if (!fs.existsSync('src')) throw new Error("src folder doesn't exists")

  if (fs.existsSync(`src/${name}`))
    throw new Error('destination folder already exists')

  return fsPromises
    .mkdir(`src/${name}`)
    .then(() => fsPromises.mkdir(`src/${name}/uploads`))
    .then(() => fsPromises.mkdir(`src/${name}/uploads/text`))
    .then(() => fsPromises.mkdir(`src/${name}/uploads/img`))
    .then(() => fsPromises.mkdir(`src/${name}/output`))
    .then(() => fsPromises.mkdir(`src/${name}/output/text`))
    .then(() => fsPromises.mkdir(`src/${name}/output/img`))
    .then(() =>
      fs.writeFileSync(`src/${name}/links-map.json`, JSON.stringify({}))
    )
}

function createSettings(path, url, options) {
  //choosing project settings and writing json file inside project folder
  const projectSettings = options[url]
  const data = JSON.stringify(projectSettings)
  fs.writeFileSync(`src/${path}/project-settings.json`, data)
}

/*************resolving data we need*********************/

const options = settingsOptions()

/**************run the function*************************/

;(async function () {
  try {
    const settings = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Название статьи',
      },
      {
        type: 'list',
        name: 'projectUrl',
        message: 'Выбери сайт',
        choices: Object.keys(options),
      },
    ])
    const name = settings.projectName
    const url = settings.projectUrl
    const folderName = projectTitle(name, 3, '-')
    await createFolder(folderName)
    await createSettings(folderName, url, options)
    console.log('Project folder created 🚀')
  } catch (e) {
    if (e.isTtyError) {
      // Prompt couldn't be rendered in the current environment
      console.error(e)
    } else {
      // Something else went wrong
      console.error(e)
    }
  }
})()
