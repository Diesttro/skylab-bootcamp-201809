const { env: { JWT_SECRET } } = process

function jwtVerifier(req, res, next) {
    try {
        const { token } = req

        const { sub } = jwt.verify(token, JWT_SECRET)

        req.sub = sub

        next()
    } catch ({ message }) {
        res.json({
            status: 'KO',
            message
        })
    }
}

module.exports = jwtVerifier