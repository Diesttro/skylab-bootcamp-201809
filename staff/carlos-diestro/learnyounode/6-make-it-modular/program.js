let filter = require('./mymodule.js')

let result = filter(process.argv[2], process.argv[3], function(error, result) {
  if(error) return console.log(error)

  result.forEach(file => console.log(file))
})