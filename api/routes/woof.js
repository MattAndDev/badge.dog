const { readFileSync, writeFileSync, unlinkSync, existsSync, mkdirSync } = require('fs')
const { resolve, dirname } = require('path')
const puppeteer = require('puppeteer')

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
    if (existsSync(`${targetDir}/${urlHash}.svg`) && !process.env.DEBUG) {
      res.sendFile(resolve(`${targetDir}/${urlHash}.svg`))
      return false
    }
    let html = await addQueryToTemplate(templatePath, req.query)
    let htmlPath = `${dirname(templatePath)}/${urlHash}.html`
    await writeFileSync(htmlPath, html)
    let svg = await renderHtmlAndGetSvg(htmlPath)
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

const renderHtmlAndGetSvg = async (
  htmlPath
) => {
  let browserOpt = (process.env.NODE_ENV === 'development') ? {dumpio: true, headless: process.env.HEADLESS} : {}
  let browser = await puppeteer.launch(browserOpt)
  let page = await browser.newPage()
  if (process.env.NODE_ENV === 'development') {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()))
  }
  page.setViewport({ width: 1000, height: 1000 })
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' })
  await page.waitForSelector('#done')
  let svg = await page.$eval('#badge', el => el.innerHTML)
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
