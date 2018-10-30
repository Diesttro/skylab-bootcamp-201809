const http = require('http')

const argv = process.argv.slice(2)

let result = []
let num = 0
argv.forEach((url, ind) => {
  result[ind] = ''

  req = http.get(url, res => {
    res.setEncoding('utf8')
    res.on('data', data => result[ind] += data)
    res.on('end', () => {
      num++

      if(num === 3) result.forEach(str => console.log(str))
    })
  })
})