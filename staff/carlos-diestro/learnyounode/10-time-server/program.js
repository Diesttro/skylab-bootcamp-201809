const net = require('net')

const port = process.argv[2]

const addZero = number => {
  return `${(number < 10  ? '0' : '')}${number}`
}

const server = net.createServer(socket => {
  const date = new Date()
  let [year, month, day, hour, minute] = [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()]
  
  socket.end(`${year}-${addZero(month + 1)}-${addZero(day)} ${addZero(hour)}:${addZero(minute)}\n`)
})
server.listen(port)