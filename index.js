const { resolve } = require('path')
const { woof } = require('./routes')
const express = require('express')
const app = express()

const badgeFolder = resolve('./badges')
const bark = async () => {
  woof(app, badgeFolder)
  app.listen(3100)
}

module.exports = bark()
