const fs = require('fs')
const path = require('path')
const [, , input, output] = process.argv
const dirs = path.dirname(output).split('\\')
const fileName = path.basename(output)
const inputStream = fs.createReadStream(input)

// dirs.forEach((dir, ind) => {
//   if(fs.existsSync(dir)) {
//     process.chdir(dir)
//   } else {
//     fs.mkdirSync(dir)
//     process.chdir(dir)
//   }

//   if(ind === (dirs.length - 1)) inputStream.pipe(fs.createWriteStream(fileName))
// })

const lsr = (path) => {
  fs.readdir(path, (err, files) => {
    files.forEach(file => {
      fs.stat(file, (err, stats) => {
        if(stats.isDirectory()) {
          process.chdir(file)
          lsr(file)
        }
        console.log(process.cwd(), file, stats.isDirectory())
      })
    })
  })
}

lsr(process.cwd())