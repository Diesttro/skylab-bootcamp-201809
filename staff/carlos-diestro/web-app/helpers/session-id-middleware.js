function getSessionId(req) {
    const { ip, headers } = req

    const userAgent = headers['user-agent']

    return `${ip}-${userAgent}`
}

function sessionIdMiddleware(req, res, next) {
    req.sid = getSessionId(req)

    next()
}

module.exports = sessionIdMiddleware