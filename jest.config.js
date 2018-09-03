module.exports = {
  globals: {
    env: {
      NODE_ENV: 'development',
      DEBUG: false,
      PORT: 3101,
      PUPPETEER: {
        headless: false,
        deviceScaleFactor: 2
      },
      STORAGE_DIR: 'test'
    }
  }
}
