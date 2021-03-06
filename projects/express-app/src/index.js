const express = require('express')

const app = express()
const port = 5000
const controller = require('./controller')

app.disable('x-powered-by')

app.use([
  express.urlencoded({ extended: false }),
  express.json()
])

app.use(controller)
app.use('/assets', express.static('./storage/profile-images'))

app.all('*', (request, response) => {
  const responseBody = {
    success: false,
    code: 405,
    message: 'Request failed'
  }

  response.status(responseBody.code).json(responseBody)
})

const server = app.listen(port, () => console.info(`server running on port ${port}`))

const shutdown = () => {
  console.info('closing http server')

  server.close(() => {
    console.info('http server closed')
    process.exit(0)
  })
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
