const { readFileSync, writeFileSync, unlinkSync, existsSync } = require('fs')
const { resolve, basename } = require('path')
const express = require('express')
const puppeteer = require('puppeteer')
const handlebars = require('handlebars')
const app = express()

const badgeFolder = resolve('./badges')

const hbsTemplateToHtml = async (
  templatePath,
  data = {},
  targetBase = badgeFolder,
  defaultDataPath = `${templatePath.replace('.hbs', '.js')}`
) => {
  let defaults = require(defaultDataPath)
  let source = await readFileSync(templatePath).toString()
  let compiler = handlebars.compile(source)
  let html = compiler({ ...defaults, ...data })
  let name = new Date().getUTCMilliseconds()
  await writeFileSync(`${badgeFolder}/${name}.html`, html)
  return resolve(`${badgeFolder}/${name}.html`)
}

const htmlToPng = async (
  htmlPath,
  filename = basename(htmlPath).replace('.html', '')
) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  page.setViewport({ width: 1000, height: 1000, deviceScaleFactor: 2 })
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' })
  await page.waitForSelector('.badge')
  const svgImage = await page.$('.badge')
  await svgImage.screenshot({
    path: `${badgeFolder}/${filename}.png`,
    omitBackground: true
  })
  await browser.close()
  return resolve(`${badgeFolder}/${filename}.png`)
}

const generateHash = async (str) => {
  let hash = 5381
  let length = str.length
  while (length) {
    hash = (hash * 33) ^ str.charCodeAt(--length)
  }
  return hash >>> 0
}

const start = async () => {
  app.get('/svg/:type/:style', async function (req, res) {
    let urlHash = await generateHash(req.url)
    if (existsSync(`${badgeFolder}/${urlHash}.png`)) {
      res.sendFile(resolve(`${badgeFolder}/${urlHash}.png`))
      return false
    }
    let htmlPath = await hbsTemplateToHtml(resolve(`./templates/${req.params.type}/${req.params.style}.hbs`), req.query)
    let pngPath = await htmlToPng(htmlPath, urlHash)
    // await unlinkSync(htmlPath)
    res.sendFile(pngPath)
  })
  app.listen(3000)
}
module.exports = start()
