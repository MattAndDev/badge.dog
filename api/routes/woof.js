const { readFileSync, writeFileSync, unlinkSync, existsSync, mkdirSync, copyFileSync } = require('fs')
const { resolve } = require('path')
const { renderFile } = require('../services/chromium')
const { fromString } = require('../services/hash')

const woof = (app, storageDir) => {
  app.get('/woof/:template.svg', async function (req, res) {
    let urlHash = await fromString(req.url)
    let templateDir = resolve(`./api/templates/${req.params.template}/`)
    let targetStorageDir = resolve(`${storageDir}/${req.params.template}`)
    let templatePath = `${templateDir}/index.html`
    let htmlTempPath = `${templateDir}/${urlHash}.html`
    let htmlTargetPath = `${targetStorageDir}/${urlHash}.html`
    let svgPath = `${targetStorageDir}/${urlHash}.svg`
    if (!await existsSync(templatePath)) {
      res.status(404)
      res.send('Template no found')
      return false
    }
    if (!existsSync(targetStorageDir)) {
      mkdirSync(targetStorageDir)
    }
    if (await existsSync(svgPath) && process.env.DEBUG === 'false') {
      res.sendFile(svgPath)
      return false
    }
    let html = await addQueryToTemplate(templatePath, req.query)
    await writeFileSync(htmlTempPath, html)
    let svg = await renderFile(htmlTempPath, '#done', '#badge')
    await writeFileSync(svgPath, svg)
    if (process.env.DEBUG === 'true') {
      await copyFileSync(htmlTempPath, htmlTargetPath)
    }
    await unlinkSync(htmlTempPath)
    res.sendFile(resolve(svgPath))
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

module.exports = woof
