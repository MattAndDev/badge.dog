const { resolve } = require('path')
const { mkdirSync, existsSync } = require('fs')
const { woof, retrieve } = require('./api/routes')
const express = require('express')
const app = express()
const storageFolder = resolve(process.env.STORAGE_DIR)
const bark = async () => {
  if (!await existsSync(storageFolder)) {
    await mkdirSync(storageFolder)
  }
  woof(app, storageFolder)
  retrieve(app)
  app.use('/templates', express.static('./templates'))
  app.use(express.static('./public'))
  app.listen(process.env.PORT)
}

module.exports = bark()
