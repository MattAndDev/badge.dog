const { readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path')
const express = require('express')
const puppeteer = require('puppeteer')
const handlebars = require('handlebars')
const app = express()

// should be async (?)
const browser = puppeteer.launch()

const hbsTemplateToHtml = async (
  templatePath,
  data = {},
  targetBase = './badges',
  defaultDataPath = `${templatePath.replace('.hbs', '.js')}`
) => {
  let defaults = require(defaultDataPath)
  let source = await readFileSync(templatePath).toString()
  let compiler = handlebars.compile(source)
  let html = compiler({ ...defaults, ...data })
  await writeFileSync(`${targetBase}/badge.html`, html)
  return resolve(`${targetBase}/badge.html`)
}

const htmlToPng = async (
  htmlPath
) => {
  const page = await browser.newPage()
  page.setViewport({ width: 1280, height: 926 })
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' })
  await page.waitForSelector('.badge')
  const svgImage = await page.$('.badge')
  await svgImage.screenshot({
    path: './logo-screenshot.png',
    omitBackground: true
  })
  await page.close()
  return resolve('./logo-screenshot.png')
}

const start = async () => {
  app.get('/svg/:type/:style', async function (req, res) {
    let htmlPath = await hbsTemplateToHtml(resolve(`./templates/${req.params.type}/${req.params.style}.hbs`), req.query)
    let pngPath = await htmlToPng(htmlPath)
    res.sendFile(pngPath)
  })
  app.listen(3000)
}
module.exports = start()
