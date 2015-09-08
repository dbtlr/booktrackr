module.exports = {
  development: {
    isProduction: false,
    port: 3000,
    apiPort: 3030,
    wpApiKey: 'DT9fPvRUpnFq',
    wpApiSecret: 'wdiZTkQONuyKymZtjHE4cKiDMzwmU3HuJcrUMLAUcHxx0cmc',
    wpApiHost: '127.0.0.1',
    wpApiProtocol: 'http',
    wpApiPort: ':8080',
    wpApiPrefix: '/index.php',
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
    wpApiHost: '127.0.0.1',
    wpApiProtocol: 'http',
    wpApiPort: ':8080',
    wpApiPrefix: '/index.php',
    app: {
      name: 'Booktrackr Production'
    }
  }
}[process.env.NODE_ENV || 'development'];
