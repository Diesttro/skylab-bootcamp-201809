const http = require('http'),
      url = require('url')

const addZero = number => {
  return `${(number < 10  ? '0' : '')}${number}`
}

const parsetime = dateString => {
  const date = new Date(dateString)
  const [hour, minute, second] = [
    Number(addZero(date.getHours())),
    Number(addZero(date.getMinutes())),
    Number(addZero(date.getSeconds()))
  ]
  const parsetime = { hour, minute, second }

  return parsetime
}

const unixtime = dateString => {
  const date = new Date(dateString)
  const unixtime = {unixtime: date.getTime()}

  return unixtime
}

http.createServer((req, res) => {
  const urlData = url.parse(req.url, true)

  if(urlData.pathname.includes('parsetime')) {
    const parse = parsetime(urlData.query.iso)

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(parse))
  } else if(urlData.pathname.includes('unix')) {
    const unix = unixtime(urlData.query.iso)

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(unix))
  }
}).listen(process.argv[2])