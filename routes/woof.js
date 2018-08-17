const { readFileSync, writeFileSync, unlinkSync, existsSync, mkdirSync } = require('fs')
const { resolve } = require('path')
const puppeteer = require('puppeteer')

const env = require('../env')

const woof = (app, storageDir) => {
  app.get('/woof/:template.svg', async function (req, res) {
    let urlHash = await generateHash(req.url)
    let targetDir = `${storageDir}/${req.params.template}`
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir)
    }
    if (existsSync(`${targetDir}/${urlHash}.svg`) && !env.forceOverwite) {
      res.sendFile(resolve(`${targetDir}/${urlHash}.svg`))
      return false
    }
    // meh
    req.query.baseUrl = req.headers.host
    let html = await addQueryToTemplate(resolve(`./templates/${req.params.template}/index.html`), req.query)
    let htmlPath = `${targetDir}/${urlHash}.html`
    await writeFileSync(htmlPath, html)
    let svg = await renderHtmlAndGetSvg(htmlPath)
    await writeFileSync(`${targetDir}/${urlHash}.svg`, svg)
    if (!env.keepHtml) {
      await unlinkSync(htmlPath)
    }
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
    </script>`
  return `${js}\n${source}`
}

const renderHtmlAndGetSvg = async (
  htmlPath
) => {
  const browser = await puppeteer.launch({})
  const page = await browser.newPage()
  page.setViewport({ width: 1000, height: 1000 })
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' })
  await page.waitForSelector('#done')
  const svg = await page.$eval('#badge', el => el.innerHTML)
  await browser.close()
  return svg
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
