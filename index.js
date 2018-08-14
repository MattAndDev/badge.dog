const { readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path')
const express = require('express')
const puppeteer = require('puppeteer')
const handlebars = require('handlebars')
const app = express()

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

const start = async () => {
  const browser = await puppeteer.launch()
  app.get('/svg/:type/:style', async function (req, res) {
    const page = await browser.newPage()
    let htmlPath = await hbsTemplateToHtml(resolve(`./templates/${req.params.type}/${req.params.style}.hbs`), req.query)
    page.setViewport({ width: 1280, height: 926 })
    // Navigate to this blog post and wait a bit.
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' })
    await page.waitForSelector('.badge')
    // Select the #svg img element and save the screenshot.
    const svgImage = await page.$('.badge')
    await svgImage.screenshot({
      path: './logo-screenshot.png',
      omitBackground: true
    })
    await page.close()
    res.sendFile(resolve('./logo-screenshot.png'))
  })
  app.listen(3000)
}

module.exports = start()
console.log('hi')
