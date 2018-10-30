const http = require('http'),
      map = require('through2-map')

http.createServer((req, res) => {
  if(req.method !== 'POST') return res.end('Only POST methods')
   
  req.pipe(map(chunk => {
    return chunk.toString().toUpperCase()
  })).pipe(res)
}).listen(process.argv[2])