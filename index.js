const { readFileSync, writeFileSync, unlinkSync } = require('fs')
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
  await writeFileSync(`${badgeFolder}/badge.html`, html)
  return resolve(`${badgeFolder}/badge.html`)
}

const htmlToPng = async (
  htmlPath
) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  page.setViewport({ width: 1280, height: 926 })
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' })
  await page.waitForSelector('.badge')
  const svgImage = await page.$('.badge')
  let name = basename(htmlPath).replace('html', 'png')
  await svgImage.screenshot({
    path: `${badgeFolder}/${name}`,
    omitBackground: true
  })
  await browser.close()
  return resolve(`${badgeFolder}/${name}`)
}

const start = async () => {
  app.get('/svg/:type/:style', async function (req, res) {
    let htmlPath = await hbsTemplateToHtml(resolve(`./templates/${req.params.type}/${req.params.style}.hbs`), req.query)
    let pngPath = await htmlToPng(htmlPath)
    await unlinkSync(htmlPath)
    res.sendFile(pngPath)
  })
  app.listen(3000)
}
module.exports = start()
