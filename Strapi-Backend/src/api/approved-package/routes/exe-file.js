module.exports = {
    routes: [
      { // Path defined with an URL parameter
        method: 'POST',
        path: '/exe', 
        handler: 'exe-file.buildAndSendExe',
      }
    ]
}