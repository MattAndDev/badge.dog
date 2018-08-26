const { resolve } = require('path')
const { mkdirSync, existsSync } = require('fs')
const { woof, utils } = require('./api/routes')
const express = require('express')
const app = express()
const storageFolder = resolve(process.env.STORAGE_DIR)
const bark = async () => {
  if (!await existsSync(storageFolder)) {
    await mkdirSync(storageFolder)
  }
  woof(app, storageFolder)
  utils(app)
  app.use(express.static('./public'))
  app.listen(process.env.PORT)
}

module.exports = bark()
