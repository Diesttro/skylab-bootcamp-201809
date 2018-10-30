let fs = require('fs')

let n = 0

let buffer = fs.readFile(process.argv[2], 'utf8', function callback(err, data) {
  if(err) return console.log(err)

  n = data.split('\n').length - 1

  console.log(n)
})

