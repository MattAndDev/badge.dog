const { readFileSync, writeFileSync, unlinkSync, existsSync, mkdirSync } = require('fs')
const { resolve } = require('path')
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
  let source = await readFileSync(templatePath).toString()
  let compiler = handlebars.compile(source)
  let html = compiler({ data: JSON.stringify({...data}) })
  let name = new Date().getUTCMilliseconds()
  await writeFileSync(`${badgeFolder}/${name}.html`, html)
  return resolve(`${badgeFolder}/${name}.html`)
}

const renderHtmlAndGetSvg = async (
  htmlPath
) => {
  const browser = await puppeteer.launch({
    args: ['--enable-font-antialiasing']
  })
  const page = await browser.newPage()
  page.setViewport({ width: 1000, height: 1000 })
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' })
  await page.waitForSelector('#badge')
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

const start = async () => {
  app.get('/woof/:template.svg', async function (req, res) {
    let urlHash = await generateHash(req.url)
    let targetDir = `${badgeFolder}/${req.params.template}`
    if (existsSync(`${targetDir}/${urlHash}.svg`)) {
      res.sendFile(resolve(`${targetDir}/${urlHash}.svg`))
      return false
    }
    let htmlPath = await hbsTemplateToHtml(resolve(`./templates/${req.params.template}.hbs`), req.query)
    let svg = await renderHtmlAndGetSvg(htmlPath)
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir)
    }
    await writeFileSync(`${targetDir}/${urlHash}.svg`, svg)
    await unlinkSync(htmlPath)
    res.sendFile(resolve(`${targetDir}/${urlHash}.svg`))
  })
  app.listen(3100)
}
module.exports = start()
