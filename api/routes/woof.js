const { readFileSync, writeFileSync, unlinkSync, existsSync, mkdirSync } = require('fs')
const { resolve, dirname } = require('path')
const { renderFile } = require('../services/chromium')

const woof = (app, storageDir) => {
  app.get('/woof/:template.svg', async function (req, res) {
    let templatePath = resolve(`./api/templates/${req.params.template}/index.html`)
    if (!await existsSync(templatePath)) {
      res.status(404)
      res.send('Template no found')
      return false
    }
    let urlHash = await generateHash(req.url)
    let targetDir = `${storageDir}/${req.params.template}`
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir)
    }
    if (await existsSync(`${targetDir}/${urlHash}.svg`) && process.env.DEBUG === 'false') {
      res.sendFile(resolve(`${targetDir}/${urlHash}.svg`))
      return false
    }
    let html = await addQueryToTemplate(templatePath, req.query)
    let htmlPath = `${dirname(templatePath)}/${urlHash}.html`
    await writeFileSync(htmlPath, html)
    let svg = await renderFile(htmlPath, '#done', '#badge')
    await writeFileSync(`${targetDir}/${urlHash}.svg`, svg)
    await unlinkSync(htmlPath)
    res.sendFile(resolve(`${targetDir}/${urlHash}.svg`))
  })
}

const addQueryToTemplate = async (
  templatePath,
  query = {}
) => {
  let source = await readFileSync(templatePath).toString()
  let js = `
    <script id="data" type="application/javascript">
      const query = ${JSON.stringify({...query})}
    </script>`.replace(/^ {4}/gm, '')
  return `${js}\n${source}`
}

const generateHash = async (str) => {
  let hash = 5381
  let length = str.length
  while (length) {
    hash = (hash * 33) ^ str.charCodeAt(--length)
  }
  return hash >>> 0
}

module.exports = woof
