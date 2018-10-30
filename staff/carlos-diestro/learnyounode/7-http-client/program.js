let http = require('http')

http.get(process.argv[2], function(response) {
  response.setEncoding('utf8')
  response.on('data', data => console.log(data))
  response.on('error', error => console.log(error))
}).on('error', error => console.log(error))