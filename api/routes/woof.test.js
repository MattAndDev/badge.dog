/* global env, expect, test, describe */
const { resolve } = require('path')
const exec = require('child_process').exec
const { mkdirSync, existsSync } = require('fs')
const woof = require('./woof')
const express = require('express')
const fetch = require('node-fetch')
const app = express()
const storageFolder = resolve('./test')

process.env = { ...process.env, ...env }

const bark = async () => {
  if (!await existsSync(storageFolder)) {
    await mkdirSync(storageFolder)
  }
  app.use('/templates', express.static('./templates'))
  woof(app, storageFolder)
  return app.listen(process.env.PORT)
}

describe('/woof endpoint', async () => {
  test('test default templates', async () => {
    const app = await bark()
    let res = await fetch(`http://localhost:${process.env.PORT}/woof/simple.svg`)
    app.close()
    expect(res.status).toEqual(200)
    exec('rm -rf ./test')
  })
})
