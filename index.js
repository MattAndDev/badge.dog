const { resolve } = require('path')
const { woof, bau } = require('./routes')
const express = require('express')
const app = express()

const badgeFolder = resolve('./badges')
const bark = async () => {
  woof(app, badgeFolder)
  bau(app)
  app.use(express.static('./public'))
  app.listen(3100)
}

module.exports = bark()
