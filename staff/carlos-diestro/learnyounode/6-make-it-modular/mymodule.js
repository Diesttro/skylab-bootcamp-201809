function filter(dir, ext, callback) {
  const fs = require('fs')
  const path = require('path')
  let result = undefined
  let error = null 

  let buffer = fs.readdir(dir, function(err, list) {
    if(err) return callback(err)

    result = list.filter(file => path.extname(file) === `.${ext}`)

    callback(error, result)
  })
}

module.exports = filter