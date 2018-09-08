const fetch = require('node-fetch')
const retrieve = (app, storageDir) => {
  app.get('/retrieve/circleci', async function (req, res) {
    let content = await fetch(req.query.origin)
    let svg = await content.text()
    if (svg.includes('passing')) {
      res.redirect(req.query.passing)
    } else {
      res.redirect(req.query.failingt)
    }
  })
}

module.exports = retrieve
