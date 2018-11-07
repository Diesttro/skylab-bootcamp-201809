require('dotenv').config()

const express = require('express')
const package = require('./package.json')
const router = require('./routes')
const cors = require('./utils/cors')

const { env: { PORT } } = process

const { argv: [, , port = PORT || 8080] } = process

const app = express()

app.use(cors)

app.use('/api', router)

app.listen(port, () => console.log(`${package.name} ${package.version} up and running on port ${port}`))