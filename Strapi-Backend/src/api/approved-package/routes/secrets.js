module.exports = {
    routes: [
      { // Path defined with an URL parameter
        method: 'GET',
        path: '/token', 
        handler: 'secrets.serveToken',
      }
    ]
}