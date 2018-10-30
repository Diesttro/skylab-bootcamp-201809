const fs = require('fs'), http = require('http')

const server = http.createServer((req, res) => {
  const stream = fs.createReadStream(process.argv[3])

  stream.pipe(res)
})

server.listen(process.argv[2])