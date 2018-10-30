let fs = require('fs')

let buffer = fs.readdir(process.argv[2], function(err, list) {
  if(err) return console.log(err)

  let match = list.filter(file => {
    if(file.search(`.${process.argv[3]}`) !== -1) console.log(file)
  })
})