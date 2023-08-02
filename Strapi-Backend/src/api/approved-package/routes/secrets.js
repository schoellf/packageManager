module.exports = {
    routes: [
      { 
        method: 'GET',
        path: '/token', 
        handler: 'secrets.serveToken',
      }
    ]
}