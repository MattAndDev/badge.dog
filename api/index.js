const { resolve } = require('path')
const { mkdirSync, existsSync } = require('fs')
const { woof } = require('./routes')
const express = require('express')
const app = express()
const storageFolder = resolve(process.env.STORAGE_DIR)
const bark = async () => {
  if (!await existsSync(storageFolder)) {
    await mkdirSync(storageFolder)
  }
  woof(app, storageFolder)
  app.use('/templates', express.static('./templates'))
  app.listen(process.env.PORT)
}

module.exports = bark()
