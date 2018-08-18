const { resolve } = require('path')
const { woof, utils } = require('./api/routes')
const express = require('express')
const app = express()
// to env (?)
const storageFolder = resolve('./storage')

const bark = async () => {
  woof(app, storageFolder)
  utils(app)
  app.use(express.static('./public'))
  app.listen(3100)
}

module.exports = bark()
