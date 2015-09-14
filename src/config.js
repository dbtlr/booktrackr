module.exports = {
  development: {
    isProduction: false,
    port: 3000,
    app: {
      name: 'Booktrackr Development'
    }
  },
  production: {
    isProduction: true,
    port: process.env.PORT,
    app: {
      name: 'Booktrackr Production'
    }
  }
}[process.env.NODE_ENV || 'development'];
