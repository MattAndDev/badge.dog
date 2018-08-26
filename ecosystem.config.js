module.exports = {
  apps: [
    {
      name: 'badge.dog.dev',
      script: 'index.js',
      watch: true,
      ignore_watch: ['api/templates', './storage-dev'],
      env: {
        NODE_ENV: 'development',
        DEBUG: true,
        PORT: 3100,
        HEADLESS: true,
        STORAGE_DIR: 'storage-dev'
      }
    },
    {
      name: 'badge.dog',
      script: 'index.js',
      env: {
        NODE_ENV: 'production',
        DEBUG: false,
        HEADLESS: false,
        PORT: 3100,
        STORAGE_DIR: 'storage'
      }
    }
  ]
}
