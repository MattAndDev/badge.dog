const { resolve } = require('path')
const { woof, bau } = require('./api/routes')
const express = require('express')
const app = express()

const badgeFolder = resolve('./storage')

const bark = async () => {
  woof(app, badgeFolder)
  bau(app)
  app.use(express.static('./public'))
  app.listen(3100)
}

module.exports = bark()
