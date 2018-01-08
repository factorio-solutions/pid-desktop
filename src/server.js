const path = require('path')
const express = require('express')

module.exports = {
  app() {
    const app = express()
    const indexPath = path.join(__dirname, '/../index.html')
    const publicPath = express.static(path.join(__dirname, '../public'))

    app.use('/public', publicPath)
    app.get('/', (req, res) => {
      if (req.headers['x-forwarded-proto'] !== 'https') { // Heroku https check
        res.redirect('https://' + req.hostname + req.url)
      }
      res.sendFile(indexPath)
    })

    return app
  }
}
