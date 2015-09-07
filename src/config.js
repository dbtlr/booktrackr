module.exports = {
  development: {
    isProduction: false,
    port: 3000,
    apiPort: 3030,
    wpApiKey: 'DT9fPvRUpnFq',
    wpApiSecret: 'wdiZTkQONuyKymZtjHE4cKiDMzwmU3HuJcrUMLAUcHxx0cmc',
    wpApiEndPoint: 'http://127.0.0.1:8080/index.php/wp-json',
    app: {
      name: 'Booktrackr Development'
    }
  },
  production: {
    isProduction: true,
    port: process.env.PORT,
    apiPort: 3030,
    wpApiKey: 'DT9fPvRUpnFq',
    wpApiSecret: 'wdiZTkQONuyKymZtjHE4cKiDMzwmU3HuJcrUMLAUcHxx0cmc',
    wpApiEndPoint: 'http://127.0.0.1:8080/index.php/wp-json',
    app: {
      name: 'Booktrackr Production'
    }
  }
}[process.env.NODE_ENV || 'development'];
