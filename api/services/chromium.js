/** @module services/chromium */

const puppeteer = require('puppeteer')

/**
*  render html file with puppeteer and returns dom as string
*  optionally
*
*  @func renderFile
*  @param {String} htmlPath - absolute path of html file to render
*  @param {String} [waitForSelector = false] - DOM selector to wait for
*  @param {String} [returnSelector = false] - DOM node to return instead of complete page
*  @returns {String} the resulting html as string
*/

const renderFile = async (
  htmlPath,
  waitForSelector = false,
  returnSelector = false
) => {
  let browserOpt = (process.env.NODE_ENV === 'development') ? {dumpio: true, headless: process.env.HEADLESS} : {}
  let browser = await puppeteer.launch(browserOpt)
  let page = await browser.newPage()
  if (process.env.NODE_ENV === 'development') {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()))
  }
  page.setViewport({ width: 1000, height: 1000 })
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' })
  if (waitForSelector) {
    await page.waitForSelector(waitForSelector)
  }
  let result = (returnSelector) ? await page.$eval(returnSelector, el => el.innerHTML) : await page.content()
  await browser.close()
  return result
}

module.exports = {
  renderFile
}
