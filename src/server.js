const path = require('path')
const express = require('express')

module.exports = {
  app: function () {
    const app = express()
    const indexPath = path.join(__dirname, '/../index.html')
    const publicPath = express.static(path.join(__dirname, '../public'))

    app.use('/public', publicPath)
    app.get('/', function (req, res) {
      // Heroku https check
      if(req.headers["x-forwarded-proto"] !== "https"){
        res.redirect('https://'+req.hostname+req.url);
      };
      res.sendFile(indexPath)
    })

    return app
  }
}
