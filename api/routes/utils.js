const url = require('url')
const fetch = require('node-fetch')

const utils = (app) => {
  app.get('/utils/encodefont/:fontName', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    let googleFontUrl = `https://fonts.googleapis.com/css?family=${req.params.fontName}`
    let query = url.parse(req.url).query
    if (query) googleFontUrl = `${googleFontUrl}&${query}`
    let googleRes = await fetch(googleFontUrl)
    let googleCssStyles = await googleRes.text()
    googleCssStyles.match(/https:\/\/[^)]+/g).forEach(async (link) => {
      let fontRaw = await fetch(link)
      let fontBuffer = await fontRaw.buffer()
      let response = googleCssStyles.replace(link, `data:font/ttf;base64,${fontBuffer.toString('base64')}`)
      res.send(response)
    })
  })
}

module.exports = utils
