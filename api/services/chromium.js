/** @module services/chromium */

const puppeteer = require('puppeteer')

/**
*  render url with puppeteer and returns dom as string
*  optionally
*
*  @func renderUrl
*  @param {String} url - url to render
*  @param {String} [waitForSelector = false] - DOM selector to wait for
*  @param {String} [returnSelector = false] - DOM node to return instead of complete page
*  @returns {Object} {html, screenshot} the resulting html as string and a png screenshot as buffer
*/

const renderUrl = async (
  url,
  waitForSelector = false,
  returnSelector = false,
  takeScreenshot = true,
  size = { width: 1000, height: 1000 }
) => {
  let browserOpt = process.env.PUPPETEER || {}
  let browser = await puppeteer.launch(browserOpt)
  let page = await browser.newPage()
  if (process.env.NODE_ENV === 'development') {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()))
  }
  page.setViewport(size)
  await page.goto(url, { waitUntil: 'networkidle0' })
  if (waitForSelector) {
    await page.waitForSelector(waitForSelector)
  }
  let string = (returnSelector) ? await page.$eval(returnSelector, el => el.outerHTML) : await page.content()
  let screenshot = false
  if (takeScreenshot) {
    let screenshotHandle = (returnSelector) ? await page.$(returnSelector) : page
    screenshot = await screenshotHandle.screenshot({ omitBackground: true })
  }
  await browser.close()
  return { string, screenshot }
}

module.exports = {
  renderUrl
}
