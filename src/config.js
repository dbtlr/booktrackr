module.exports = {
  development: {
    isProduction: false,
    port: 3000,
    apiPort: 3030,
    app: {
      name: 'Booktrackr Development'
    }
  },
  production: {
    isProduction: true,
    port: process.env.PORT,
    apiPort: 3030,
    app: {
      name: 'Booktrackr Production'
    }
  }
}[process.env.NODE_ENV || 'development'];
