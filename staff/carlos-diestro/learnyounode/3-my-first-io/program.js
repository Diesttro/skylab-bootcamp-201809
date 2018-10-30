let fs = require('fs')

let buffer = fs.readFileSync(process.argv[2])

let str = buffer.toString()

let n = str.split('\n')

n = n.length - 1

console.log(n)