require('dotenv').config()

const express = require('express')
const package = require('./package.json')
const router = require('./routes')

const { env: { PORT } } = process

const { argv: [, , port = PORT || 8080] } = process

const app = express()

app.use('/api', router)

app.listen(port, () => console.log(`${package.name} ${package.version} up and running on port ${port}`))