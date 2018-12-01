module.exports = {
  apps: [
    {
      name: 'badge.dog.dev',
      script: 'index.js',
      watch: true,
      ignore_watch: ['/templates', './storage-dev'],
      env: {
        NODE_ENV: 'development',
        DEBUG: true,
        PORT: 3100,
        PUPPETEER: {
          deviceScaleFactor: 2,
          headless: false
        },
        STORAGE_DIR: 'storage-dev'
      }
    },
    {
      name: 'badge.dog',
      script: 'index.js',
      env: {
        NODE_ENV: 'production',
        DEBUG: false,
        PUPPETEER: {
          deviceScaleFactor: 2
        },
        PORT: 3100,
        STORAGE_DIR: 'storage'
      }
    }
  ]
}
