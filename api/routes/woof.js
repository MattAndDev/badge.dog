const { readFileSync, writeFileSync, unlinkSync, existsSync, mkdirSync } = require('fs')
const { resolve, relative } = require('path')
const { renderUrl } = require('../services/chromium')
const { fromString } = require('../services/hash')

const woof = (app, storageDir) => {
  app.get('/woof/:template.:ext', async function (req, res) {
    let id = await fromString(req.url)
    let templateDir = resolve(`./templates/${req.params.template}/`)
    let targetStorageDir = resolve(`${storageDir}/${req.params.template}`)
    let templatePath = `${templateDir}/index.html`
    let htmlTempPath = `${templateDir}/${id}.html`
    let svgPath = `${targetStorageDir}/${id}.svg`
    let pngPath = `${targetStorageDir}/${id}.png`
    let reqFile = (req.params.ext === 'svg') ? svgPath : pngPath
    if (!await existsSync(templatePath)) {
      res.status(404)
      res.send('Template no found')
      return false
    }

    if (await existsSync(reqFile) && process.env.DEBUG === 'false') {
      res.sendFile(reqFile)
      return false
    }

    let html = await addQueryToTemplate(templatePath, req.query)
    await writeFileSync(htmlTempPath, html)
    let { string, screenshot } = await renderUrl(`http://localhost:${process.env.PORT}/${relative('./', htmlTempPath)}`, '#done', 'svg', true)
    if (!await existsSync(targetStorageDir)) {
      await mkdirSync(targetStorageDir)
    }
    await writeFileSync(svgPath, string)
    await writeFileSync(pngPath, screenshot)
    await unlinkSync(htmlTempPath)
    res.sendFile(reqFile)
  })
}

const addQueryToTemplate = async (
  templatePath,
  query = {}
) => {
  let source = await readFileSync(templatePath).toString()
  let js = `
    <script id="data" type="application/javascript">
      const query = ${JSON.stringify({ ...query })}
    </script>`.replace(/^ {4}/gm, '')
  source = `${js}\n${source}`
  return source
}

module.exports = woof
