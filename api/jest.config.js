module.exports = {
  globals: {
    env: {
      NODE_ENV: 'development',
      DEBUG: false,
      PORT: 3101,
      PUPPETEER: {
        headless: true,
        deviceScaleFactor: 2,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      },
      STORAGE_DIR: 'test'
    }
  }
}
