var app = require('./route.js')

var server = app.listen(process.env.PORT || 8080, () => {
   var port = server.address().port
   
   console.log(`Running on port ${port}`)
})
