module.exports = {
  apps: [
    {
      name: 'badge.dog.dev',
      script: 'index.js',
      watch: true,
      env: {
        NODE_ENV: 'test',
        DEBUG: true,
        PORT: 3100
      }
    },
    {
      name: 'badge.dog',
      script: 'index.js',
      env: {
        NODE_ENV: 'production',
        DEBUG: false,
        PORT: 3100
      }
    }
  ]
}
